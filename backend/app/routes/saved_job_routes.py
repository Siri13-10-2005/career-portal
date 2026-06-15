from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from app.database.db import db
from app.utils.jwt_handler import verify_access_token
from app.utils.role_checker import require_role

from bson import ObjectId

router = APIRouter()

security = HTTPBearer()


@router.post("/save-job/{job_id}")
def save_job(
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
        ["student"]
    )

    existing_job = db.saved_jobs.find_one(
        {
            "student_id": payload["user_id"],
            "job_id": job_id
        }
    )

    if existing_job:
        raise HTTPException(
            status_code=400,
            detail="Job already saved"
        )

    db.saved_jobs.insert_one(
        {
            "student_id": payload["user_id"],
            "job_id": job_id
        }
    )

    return {
        "message": "Job Saved Successfully"
    }


@router.get("/saved-jobs")
def get_saved_jobs(
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
        ["student"]
    )

    saved_jobs = list(
        db.saved_jobs.find(
            {
                "student_id": payload["user_id"]
            }
        )
    )

    jobs_data = []

    for saved_job in saved_jobs:

        job = db.jobs.find_one(
            {
                "_id": ObjectId(saved_job["job_id"])
            }
        )

        if job:
            job["_id"] = str(job["_id"])
            jobs_data.append(job)

    return jobs_data


@router.delete("/unsave-job/{job_id}")
def unsave_job(
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
        ["student"]
    )

    db.saved_jobs.delete_one(
        {
            "student_id": payload["user_id"],
            "job_id": job_id
        }
    )

    return {
        "message": "Job Removed From Saved Jobs"
    }