from io import BytesIO
from typing import List
import docker
from fastapi import HTTPException, status
from app.api.utils.logger_utils import get_logger

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

def log_generator(fileobj: BytesIO, tag:str):
    try:
        for chunk in client.api.build(fileobj=fileobj, rm=True, decode=True, pull=True, tag=tag):
            if 'stream' in chunk:
                yield chunk['stream']
    except Exception as e:
        yield f"Error: {str(e)}\n"