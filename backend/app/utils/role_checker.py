from fastapi import HTTPException

def require_role(payload, allowed_roles):

    if payload["role"] not in allowed_roles:
        raise HTTPException(
            status_code=403,
            detail="Access Denied"
        )

    return True