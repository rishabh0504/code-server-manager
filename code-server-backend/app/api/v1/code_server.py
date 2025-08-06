import os
import subprocess
import uuid
from fastapi import APIRouter, HTTPException
from app.api.db.db import prisma
from app.api.models.code_server import CodeServerCreate
from app.api.models.response import SuccessResponse
from app.api.utils.network_utils import get_safe_port
from prisma.enums import CredentialType, InstanceStatus
from app.api.utils import docker_utils
code_server_router = APIRouter(
    prefix="/code-server",
    tags=["Code Server API Management"]
)

@code_server_router.get("/", response_model=SuccessResponse)
async def get_code_servers():
    code_servers = await prisma.codeserverinstance.find_many()
    return SuccessResponse(data=code_servers, status_code=200)

@code_server_router.post("/", response_model=SuccessResponse)
async def create_code_servers( create_code_server : CodeServerCreate):
    port = get_safe_port()
    container_name = f"{create_code_server.name}"
    user_home = os.path.expanduser("~")
    image_name = f"{create_code_server.image}"
    # Step 1: Start Docker container
    cmd = [
        "docker", "run", "-d",
        "--name", container_name,
        "-p", f"{os.getenv('BASE_API_HOST')}:{port}:8080",
        "-v", f"{user_home}/.config:/home/coder/.config",
        image_name,
        "--auth", "none"
    ]

    print(cmd)
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        raise HTTPException(status_code=500, detail=f"Instance creation failed: {result.stderr}")

    # Step 2: Save instance to DB
    url = f"{os.getenv('BASE_API_POINT')}:{port}"
    code_server_instance = await prisma.codeserverinstance.create(
        data={
            "id": str(uuid.uuid4()),
            "name": container_name,
            "port": port,
            "url": url,
            "status":InstanceStatus.RUNNING.value,
            "image":image_name
        }
    )

    # # Step 3: Fetch GitHub credentials
    # github_credential = await prisma.credentials.find_first(
    #     where={"type": CredentialType.GITHUB.value}
    # )

    # if not github_credential:
    #     raise HTTPException(status_code=404, detail="GitHub credentials not found")

    # github_pat = github_credential.value

    # commands = [
    #     f"git config --global user.email '{github_credential.email}'",
    #     f"git config --global user.name '{github_credential.username}'",
    #     f"bash -c \"echo -e 'machine github.com\\nlogin {github_credential.username}\\npassword {github_pat}' > /home/coder/.netrc\"",
    #     f"chmod 600 /home/coder/.netrc",
    #     f"chown coder:coder /home/coder/.netrc",
    #     "git config --global http.sslVerify false"
    # ]
    # docker_utils.perform_docker_actions(container_name=container_name,commands=commands, user="coder")

    # root_commands = [
    #     "apt-get update",
    #     "apt-get install -y nodejs npm",
    #     "npm install -g pnpm"
    # ]

    # docker_utils.perform_docker_actions(container_name=container_name,commands=root_commands, user="root")


    return SuccessResponse(
        status_code=200,
        message="Code server started and GitHub repo configured",
        data=code_server_instance,
    )