from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from app.models.job_model import JobCreate
from app.database.db import db
from bson import ObjectId

from app.utils.jwt_handler import verify_access_token
from app.utils.role_checker import require_role

router = APIRouter()

security = HTTPBearer()


@router.post("/jobs")
def create_job(
    job: JobCreate,
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

    job_dict = job.model_dump()

    job_dict["recruiter_id"] = payload["user_id"]
    job_dict["recruiter_email"] = payload["email"]

    result = db.jobs.insert_one(job_dict)

    job_dict["_id"] = str(result.inserted_id)

    return {
        "message": "Job Created Successfully",
        "job": job_dict
    }


@router.get("/jobs")
def get_jobs():

    jobs = list(db.jobs.find())

    for job in jobs:
        job["_id"] = str(job["_id"])

    return jobs

@router.get("/jobs/search")
def search_jobs(keyword: str):

    jobs = list(
        db.jobs.find(
            {
                "title": {
                    "$regex": keyword,
                    "$options": "i"
                }
            }
        )
    )

    for job in jobs:
        job["_id"] = str(job["_id"])

    return jobs

@router.get("/jobs/{job_id}")
def get_job(job_id: str):

    job = db.jobs.find_one(
        {"_id": ObjectId(job_id)}
    )

    if not job:
        raise HTTPException(
            status_code=404,
            detail="Job Not Found"
        )

    job["_id"] = str(job["_id"])

    return job


@router.put("/jobs/{job_id}")
def update_job(
    job_id: str,
    job: JobCreate,
    credentials: HTTPAuthorizationCredentials = Depends(security)
):

    token = credentials.credentials

    payload = verify_access_token(token)
    print(payload)

    if not payload:
        raise HTTPException(
            status_code=401,
            detail="Invalid Token"
        )

    require_role(
        payload,
        ["recruiter"]
    )

    job_data = db.jobs.find_one(
        {"_id": ObjectId(job_id)}
    )

    if not job_data:
        raise HTTPException(
            status_code=404,
            detail="Job Not Found"
        )

    if job_data.get("recruiter_id") != payload["user_id"]:
        raise HTTPException(
            status_code=403,
            detail="You can only update your own jobs"
        )

    db.jobs.update_one(
        {"_id": ObjectId(job_id)},
        {
            "$set": job.model_dump()
        }
    )

    return {
        "message": "Job Updated Successfully"
    }


@router.delete("/jobs/{job_id}")
def delete_job(
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

    job_data = db.jobs.find_one(
        {"_id": ObjectId(job_id)}
    )

    if not job_data:
        raise HTTPException(
            status_code=404,
            detail="Job Not Found"
        )

    if job_data.get("recruiter_id") != payload["user_id"]:
        raise HTTPException(
            status_code=403,
            detail="You can only delete your own jobs"
        )

    db.jobs.delete_one(
        {"_id": ObjectId(job_id)}
    )

    return {
        "message": "Job Deleted Successfully"
    }


@router.get("/my-jobs")
def my_jobs(
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

    jobs = list(
        db.jobs.find(
            {
                "recruiter_id": payload["user_id"]
            }
        )
    )

    for job in jobs:
        job["_id"] = str(job["_id"])

    return jobs

