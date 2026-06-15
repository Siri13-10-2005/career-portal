from pydantic import BaseModel

class NotificationCreate(BaseModel):
    student_id: str
    message: str