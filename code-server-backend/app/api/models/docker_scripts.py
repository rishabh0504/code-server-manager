from pydantic import BaseModel
from typing import Optional

class CreateDockerScript(BaseModel):
    dockerFile: str
    name: str
    description: str
    tag:str

class UpdateDockerScript(BaseModel):
    dockerFile: Optional[str] = None
    name: Optional[str] = None
    description: Optional[str] = None
    tag: Optional[str] = None
