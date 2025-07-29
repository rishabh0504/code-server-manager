from io import BytesIO
from fastapi import APIRouter, HTTPException, status
from fastapi.responses import StreamingResponse
from app.api.models.response import SuccessResponse
from app.api.models.docker_scripts import CreateDockerScript, UpdateDockerScript
from app.api.db.db import prisma
from app.api.utils.logger_utils import get_logger
from app.api.utils.docker_utils import log_generator
logger = get_logger("DockerScripts")

docker_script_router = APIRouter(prefix="/docker-scripts", tags=["Docker Image Scripts"])

# Create
@docker_script_router.post("/", response_model=SuccessResponse, status_code=status.HTTP_201_CREATED)
async def create_docker_script(docker_script: CreateDockerScript):
    try:
        created = await prisma.dockerscript.create(
            data={
                "dockerFile": docker_script.dockerFile,
                "name": docker_script.name,
                "description": docker_script.description,
                "tag":docker_script.tag
            }
        )
        return SuccessResponse(data=created, status_code=201)
    except Exception as e:
        logger.error(f"Error creating DockerScript: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

# Read All
@docker_script_router.get("/", response_model=SuccessResponse)
async def get_all_scripts():
    try:
        scripts = await prisma.dockerscript.find_many()
        return SuccessResponse(data=scripts, status_code=200)
    except Exception as e:
        logger.error(f"Error fetching DockerScripts: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

# Read One
@docker_script_router.get("/{script_id}", response_model=SuccessResponse)
async def get_script(script_id: str):
    try:
        script = await prisma.dockerscript.find_unique(where={"id": script_id})
        if not script:
            raise HTTPException(status_code=404, detail="Script not found")
        return SuccessResponse(data=script, status_code=200)
    except Exception as e:
        logger.error(f"Error fetching DockerScript {script_id}: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

# Update
@docker_script_router.put("/{script_id}", response_model=SuccessResponse)
async def update_script(script_id: str, data: UpdateDockerScript):
    try:
        existing = await prisma.dockerscript.find_unique(where={"id": script_id})
        if not existing:
            raise HTTPException(status_code=404, detail="Script not found")

        updated = await prisma.dockerscript.update(
            where={"id": script_id},
            data=data.dict(exclude_unset=True)
        )
        return SuccessResponse(data=updated, status_code=200)
    except Exception as e:
        logger.error(f"Error updating DockerScript {script_id}: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

# Delete
@docker_script_router.delete("/{script_id}", response_model=SuccessResponse)
async def delete_script(script_id: str):
    try:
        existing = await prisma.dockerscript.find_unique(where={"id": script_id})
        if not existing:
            raise HTTPException(status_code=404, detail="Script not found")

        await prisma.dockerscript.delete(where={"id": script_id})
        return SuccessResponse(data={"id": script_id}, status_code=200)
    except Exception as e:
        logger.error(f"Error deleting DockerScript {script_id}: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

@docker_script_router.get("/{script_id}/build-image", response_class=StreamingResponse)
async def stream_docker_build_logs(script_id: str):
    try:
        script = await prisma.dockerscript.find_unique(where={"id": script_id})
        if not script:
            raise HTTPException(status_code=404, detail="Script not found")

        fileobj = BytesIO(script.dockerFile.encode('utf-8'))
        return StreamingResponse(log_generator(fileobj = fileobj,tag = script.tag, dockerScriptId=script.id), media_type="application/octet-stream")

    except Exception as e:
        logger.error(f"Error streaming Docker build logs: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")