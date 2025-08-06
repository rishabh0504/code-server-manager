from pydantic import BaseModel
from enum import Enum
from pydantic import BaseModel

class CodeServerAction(str, Enum):
    START = "START"
    STOP = "STOP"
    PAUSE = "PAUSE"
    UNPAUSE = "UNPAUSE"
    DELETE = "DELETE"

class CodeServerStatusChange(BaseModel):
    action: CodeServerAction

class CodeServerCreate(BaseModel):
    name: str
    image: str
