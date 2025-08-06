from pydantic import BaseModel

class CodeServerCreate(BaseModel):
    name: str
    image: str
