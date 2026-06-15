from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from app.models.application_model import ApplicationCreate
from app.database.db import db
from app.utils.jwt_handler import verify_access_token
from bson import ObjectId
from app.utils.role_checker import require_role
from bson.errors import InvalidId

router = APIRouter()

security = HTTPBearer()


@router.post("/apply")
def apply_job(
    application: ApplicationCreate,
    credentials: HTTPAuthorizationCredentials = Depends(security)
):

    token = credentials.credentials

    payload = verify_access_token(token)

    if not payload:
        raise HTTPException(
            status_code=401,
            detail="Invalid Token"
        )

    application_dict = application.model_dump()

    application_dict["student_id"] = payload["user_id"]
    application_dict["student_email"] = payload["email"]
    application_dict["status"] = "Applied"

    existing_application = db.applications.find_one(
    {
        "student_id": payload["user_id"],
        "job_id": application.job_id
    }
    )

    if existing_application:
        raise HTTPException(
        status_code=400,
        detail="You have already applied for this job"
    )

    result = db.applications.insert_one(
        application_dict
    )

    application_dict["_id"] = str(
        result.inserted_id
    )

    return {
        "message": "Application Submitted Successfully",
        "application": application_dict
    }

@router.get("/job-applicants/{job_id}")
def job_applicants(
    job_id: str,
    credentials: HTTPAuthorizationCredentials = Depends(security)
):

    token = credentials.credentials

    payload = verify_access_token(token)

    if not payload:
        raise HTTPException(
            status_code=401,
            detail="Invalid Token"
        )

    require_role(
        payload,
        ["recruiter"]
    )

    applicants = list(
        db.applications.find(
            {"job_id": job_id}
        )
    )

    for applicant in applicants:
        applicant["_id"] = str(
            applicant["_id"]
        )

    return applicants

@router.put("/application-status/{application_id}")
def update_status(
    application_id: str,
    status: str,
    credentials: HTTPAuthorizationCredentials = Depends(security)
):

    token = credentials.credentials

    payload = verify_access_token(token)

    if not payload:
        raise HTTPException(
            status_code=401,
            detail="Invalid Token"
        )

    require_role(
        payload,
        ["recruiter"]
    )

    db.applications.update_one(
        {"_id": ObjectId(application_id)},
        {
            "$set": {
                "status": status
            }
        }
    )

    application = db.applications.find_one(
        {"_id": ObjectId(application_id)}
    )

    db.notifications.insert_one(
        {
            "student_id": application["student_id"],
            "message": f"Your application status changed to {status}"
        }
    )

    return {
        "message": "Status Updated"
    }

from bson.errors import InvalidId


@router.get("/dashboard/student")
def student_dashboard(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):

    token = credentials.credentials

    payload = verify_access_token(token)

    if not payload:
        raise HTTPException(
            status_code=401,
            detail="Invalid Token"
        )

    student_id = payload["user_id"]

    applications = list(
        db.applications.find(
            {"student_id": student_id}
        )
    )

    total = len(applications)

    shortlisted = len(
        [
            app for app in applications
            if app["status"] == "Shortlisted"
        ]
    )

    rejected = len(
        [
            app for app in applications
            if app["status"] == "Rejected"
        ]
    )

    applied = len(
        [
            app for app in applications
            if app["status"] == "Applied"
        ]
    )

    recent_applications = []

    for app in applications:

        try:

            job = db.jobs.find_one(
                {
                    "_id": ObjectId(app["job_id"])
                }
            )

            if job:

                recent_applications.append(
                    {
                        "job_title": job["title"],
                        "company": job["company"],
                        "status": app["status"]
                    }
                )

        except InvalidId:
            continue

    return {
        "total_applications": total,
        "shortlisted": shortlisted,
        "rejected": rejected,
        "applied": applied,
        "recent_applications": recent_applications
    }

@router.get("/dashboard/recruiter")
def recruiter_dashboard(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):

    token = credentials.credentials

    payload = verify_access_token(token)

    if not payload:
        raise HTTPException(
            status_code=401,
            detail="Invalid Token"
        )

    require_role(
        payload,
        ["recruiter"]
    )

    recruiter_id = payload["user_id"]

    jobs = list(
        db.jobs.find(
            {
                "recruiter_id": recruiter_id
            }
        )
    )

    total_jobs = len(jobs)

    job_ids = [
        str(job["_id"])
        for job in jobs
    ]

    applications = list(
        db.applications.find(
            {
                "job_id": {
                    "$in": job_ids
                }
            }
        )
    )

    total_applications = len(applications)

    shortlisted = len(
        [
            app for app in applications
            if app["status"] == "Shortlisted"
        ]
    )

    rejected = len(
        [
            app for app in applications
            if app["status"] == "Rejected"
        ]
    )

    recent_applications = []

    for app in applications:

        job = db.jobs.find_one(
            {
                "_id": ObjectId(app["job_id"])
            }
        )

        if job:

            recent_applications.append(
                {
                    "student_email": app["student_email"],
                    "job_title": job["title"],
                    "status": app["status"]
                }
            )

    return {
        "total_jobs": total_jobs,
        "total_applications": total_applications,
        "shortlisted": shortlisted,
        "rejected": rejected,
        "recent_applications": recent_applications
    }

@router.get("/jobs/company")
def jobs_by_company(company: str):

    jobs = list(
        db.jobs.find(
            {
                "company": {
                    "$regex": company,
                    "$options": "i"
                }
            }
        )
    )

    for job in jobs:
        job["_id"] = str(job["_id"])

    return jobs

@router.get("/my-applications")
def my_applications(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):

    token = credentials.credentials

    payload = verify_access_token(token)

    if not payload:
        raise HTTPException(
            status_code=401,
            detail="Invalid Token"
        )

    student_id = payload["user_id"]

    applications = list(
        db.applications.find(
            {"student_id": student_id}
        )
    )

    for application in applications:
        application["_id"] = str(application["_id"])

    return applications

@router.get("/notifications")
def get_notifications(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):

    token = credentials.credentials

    payload = verify_access_token(token)

    if not payload:
        raise HTTPException(
            status_code=401,
            detail="Invalid Token"
        )

    notifications = list(
        db.notifications.find(
            {
                "student_id": payload["user_id"]
            }
        )
    )

    for notification in notifications:
        notification["_id"] = str(notification["_id"])

    return notifications