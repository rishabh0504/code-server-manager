from pydantic import BaseModel
from enum import Enum
from typing import List

class TemplateType(Enum):
    NEXTJS = "NEXTJS"
    NEXTJS_AND_NESTJS = "NEXTJS_AND_NESTJS"
    FASTAPI = "FASTAPI"

class TemplateScripts(BaseModel):
    instructions: List[str]
    template_type: TemplateType
