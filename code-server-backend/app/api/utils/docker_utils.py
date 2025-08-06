from io import BytesIO
from typing import AsyncGenerator, List
import docker
from fastapi import HTTPException, status
from app.api.utils.logger_utils import get_logger
from datetime import datetime
from prisma.enums import BuildStatus

from app.api.db.db import prisma

logger = get_logger('DockerUtils')

client = docker.from_env()

def perform_docker_actions(container_name: str, commands: List[str], user:str):
    try:
        logger.info(f"Initiating Docker shell commands execution in container '{container_name}'")
        container = client.containers.get(container_name)

        for command in commands:
            logger.warning(f"Executing command in container '{container_name}': {command}")
            exit_code, output = container.exec_run(command,user=user)

            if exit_code != 0:
                logger.error(f"Command failed: '{command}'\nExit Code: {exit_code}\nOutput: {output.decode('utf-8', errors='ignore')}")
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail=f"Docker command failed: {command}"
                )
            else:
                logger.info(f"Command succeeded: {command}\nOutput: {output.decode('utf-8', errors='ignore')}")

    except docker.errors.NotFound:
        logger.exception(f"Container '{container_name}' not found")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Container '{container_name}' not found"
        )
    except Exception as e:
        logger.exception(f"Unexpected error while running docker actions on container '{container_name}'")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Something went wrong while running docker actions"
        )

async def log_generator(fileobj: BytesIO, tag: str, dockerScriptId: str) -> AsyncGenerator[str, None]:
    started_at = datetime.now()
    completed_at = None
    build_status = None
    image_tag = tag
    already_logged = False

    async def safe_log():
        nonlocal already_logged
        if already_logged:
            return
        already_logged = True
        try:
            await prisma.buildinfo.create(
                data={
                    "dockerScriptId": dockerScriptId,
                    "status": build_status or BuildStatus.FAILED.value,
                    "imageTag": image_tag,
                    "startedAt": started_at,
                    "completedAt": completed_at or datetime.now(),
                }
            )
        except Exception as log_err:
            print(f"[ERROR] Failed to log buildinfo: {log_err}")

    try:
        for chunk in client.api.build(fileobj=fileobj, rm=True, decode=True, pull=True, tag=tag):
            if 'stream' in chunk:
                yield chunk['stream']

        build_status = BuildStatus.SUCCESS.value
        completed_at = datetime.now()
        await safe_log()

    except Exception as e:
        build_status = BuildStatus.FAILED.value
        completed_at = datetime.now()
        yield f"\n[Build Failed] {str(e)}\n"
        await safe_log()

    finally:
        await safe_log()

def pause_container(container_name: str):
    try:
        container = client.containers.get(container_name)
        container.pause()
    except docker.errors.NotFound:
        raise HTTPException(status_code=404, detail=f"Container '{container_name}' not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def unpause_container(container_name: str):
    try:
        container = client.containers.get(container_name)
        container.unpause()
    except docker.errors.NotFound:
        raise HTTPException(status_code=404, detail=f"Container '{container_name}' not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
def start_container(container_name: str):
    try:
        container = client.containers.get(container_name)
        container.start()
    except docker.errors.NotFound:
        raise HTTPException(status_code=404, detail=f"Container '{container_name}' not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
    
def stop_container(container_name: str):
    try:
        container = client.containers.get(container_name)
        container.stop()
    except docker.errors.NotFound:
        raise HTTPException(status_code=404, detail=f"Container '{container_name}' not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    
def remove_container(container_name: str):
    try:
        container = client.containers.get(container_name)
        container.remove()
    except docker.errors.NotFound:
        raise HTTPException(status_code=404, detail=f"Container '{container_name}' not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
def restart_container(container_name: str):
    try:
        container = client.containers.get(container_name)
        container.restart()
    except docker.errors.NotFound:
        raise HTTPException(status_code=404, detail=f"Container '{container_name}' not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))