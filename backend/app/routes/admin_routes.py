from fastapi import APIRouter, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from app.database.db import db
from app.utils.jwt_handler import verify_access_token
from app.utils.role_checker import require_role

from bson import ObjectId

router = APIRouter()

security = HTTPBearer()


@router.get("/admin/users")
def get_users(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):

    payload = verify_access_token(
        credentials.credentials
    )

    require_role(
        payload,
        ["admin"]
    )

    users = list(
        db.users.find()
    )

    for user in users:
        user["_id"] = str(user["_id"])

        if "password" in user:
            del user["password"]

    return users


@router.get("/admin/jobs")
def get_jobs(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):

    payload = verify_access_token(
        credentials.credentials
    )

    require_role(
        payload,
        ["admin"]
    )

    jobs = list(
        db.jobs.find()
    )

    for job in jobs:
        job["_id"] = str(job["_id"])

    return jobs


@router.get("/admin/applications")
def get_applications(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):

    payload = verify_access_token(
        credentials.credentials
    )

    require_role(
        payload,
        ["admin"]
    )

    applications = list(
        db.applications.find()
    )

    for app in applications:
        app["_id"] = str(app["_id"])

    return applications


@router.delete("/admin/jobs/{job_id}")
def delete_job(
    job_id: str,
    credentials: HTTPAuthorizationCredentials = Depends(security)
):

    payload = verify_access_token(
        credentials.credentials
    )

    require_role(
        payload,
        ["admin"]
    )

    db.jobs.delete_one(
        {
            "_id": ObjectId(job_id)
        }
    )

    return {
        "message": "Job Deleted Successfully"
    }