from pydantic import BaseModel

class ApplicationCreate(BaseModel):
    job_id: str
    resume_link: str