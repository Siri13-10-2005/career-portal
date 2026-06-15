from pydantic import BaseModel

class SavedJob(BaseModel):
    job_id: str