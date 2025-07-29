from typing import Optional
from pydantic import BaseModel
from enum import Enum

class CredentialType(Enum):
    GITHUB = "GITHUB"
    JIRA = "JIRA"
    GITLAB = "GITLAB"
    CONFLUENCES = "CONFLUENCES"
    DOCKERHUB = "DOCKERHUB"
    GITHUB_CONTAINER="GITHUB_CONTAINER"

class CreateCredential(BaseModel):
    name: str
    type : CredentialType
    token: str
    baseUrl: Optional[str] = None
    username: str
    email:str