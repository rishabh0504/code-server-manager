from pydantic import BaseModel

class CodeServerCreate(BaseModel):
    git_repo: str
