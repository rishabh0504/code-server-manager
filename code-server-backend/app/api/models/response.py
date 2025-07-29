from typing import Any, Optional
from pydantic import BaseModel


class Response(BaseModel):
    message: Optional[str] = None 
    data: Optional[Any] =  None
    status_code :  int

class SuccessResponse(Response):
    status:str = "success"

class ErrorResponse(Response):
    status:str = "error"