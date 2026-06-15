from fastapi import APIRouter, UploadFile, File
import cloudinary
import cloudinary.uploader
from app.services import cloudinary_service

router = APIRouter()

@router.post("/upload-resume")
async def upload_resume(
    file: UploadFile = File(...)
):

    result = cloudinary.uploader.upload(
        file.file,
        resource_type="raw"
    )

    return {
        "resume_url": result["secure_url"]
    }