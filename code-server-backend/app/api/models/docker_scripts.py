from pydantic import BaseModel

class CreateDockerScript(BaseModel):
    dockerFileContent:str
    name: str