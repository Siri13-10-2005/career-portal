from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from app.models.user_model import UserCreate, UserLogin
from app.database.db import db
from app.utils.security import hash_password, verify_password
from app.utils.jwt_handler import (
    create_access_token,
    verify_access_token
)
from app.utils.role_checker import require_role

router = APIRouter()

security = HTTPBearer()


# =========================
# REGISTER
# =========================
@router.post("/register")
def register(user: UserCreate):

    existing_user = db.users.find_one(
        {"email": user.email}
    )

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    user_dict = user.model_dump()

    user_dict["password"] = hash_password(
        user_dict["password"]
    )

    result = db.users.insert_one(user_dict)

    user_dict["_id"] = str(
        result.inserted_id
    )

    return {
        "message": "User Registered Successfully",
        "user": user_dict
    }


# =========================
# GET ALL USERS
# =========================
@router.get("/users")
def get_users():

    users = list(
        db.users.find()
    )

    for user in users:
        user["_id"] = str(
            user["_id"]
        )

    return users


# =========================
# LOGIN
# =========================
@router.post("/login")
def login(user: UserLogin):

    existing_user = db.users.find_one(
        {"email": user.email}
    )

    if not existing_user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    if not verify_password(
        user.password,
        existing_user["password"]
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid password"
        )

    token = create_access_token(
        {
            "user_id": str(
                existing_user["_id"]
            ),
            "email": existing_user["email"],
            "role": existing_user["role"]
        }
    )

    return {
        "message": "Login Successful",
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": str(
                existing_user["_id"]
            ),
            "name": existing_user["name"],
            "email": existing_user["email"],
            "role": existing_user["role"]
        }
    }


# =========================
# PROTECTED PROFILE ROUTE
# =========================
@router.get("/profile")
def profile(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):

    token = credentials.credentials

    payload = verify_access_token(
        token
    )

    if not payload:
        raise HTTPException(
            status_code=401,
            detail="Invalid token"
        )

    return {
        "message": "Protected Route Accessed",
        "user": payload
    }

@router.get("/admin")
def admin_route(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):

    token = credentials.credentials

    payload = verify_access_token(token)

    if not payload:
        raise HTTPException(
            status_code=401,
            detail="Invalid token"
        )

    require_role(
        payload,
        ["admin"]
    )

    return {
        "message": "Welcome Admin"
    }

@router.get("/student")
def student_route(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):

    token = credentials.credentials

    payload = verify_access_token(token)

    if not payload:
        raise HTTPException(
            status_code=401,
            detail="Invalid token"
        )

    require_role(
        payload,
        ["student"]
    )

    return {
        "message": "Welcome Student"
    }

