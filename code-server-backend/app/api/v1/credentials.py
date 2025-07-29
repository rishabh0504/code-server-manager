from fastapi import APIRouter, HTTPException, status
from app.api.models.response import SuccessResponse
from app.api.models.credentials import CreateCredential
from app.api.utils.logger_utils import get_logger
from app.api.db.db import prisma

logger =  get_logger("CredentialRouter")

credential_router = APIRouter(
    prefix="/credentials",
    tags=["Credential Managers"]
)

@credential_router.post("/", response_model=SuccessResponse, status_code=status.HTTP_201_CREATED)
async def create_credentials(credential: CreateCredential):
    logger.info("Initiating credential creator")
    
    data = credential.model_dump()
    data['type'] = credential.type.value

    try:
        existing = await prisma.credentials.find_first(
            where={"type": credential.type}
        )

        if existing:
            logger.info("Existing credential found. Updating...")
            updated = await prisma.credentials.update(
                where={"id": existing.id},
                data=data
            )
            return SuccessResponse(data=updated, status_code=200)
        else:
            logger.info("No existing credential found for this type. Deleting others and creating new.")
            await prisma.credentials.delete_many(
                where={"type": {"not": credential.type}}
            )
            created = await prisma.credentials.create(data=data)
            return SuccessResponse(data=created, status_code=201)

    except Exception as e:
        logger.error(f"Error in credential creation flow: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

@credential_router.get("/", response_model=SuccessResponse)
async def get_credentials():
    logger.info("Initiating credential getter")
    
    try:
        created_credentials = await prisma.credentials.find_many()
        return SuccessResponse(data=created_credentials, status_code=200)

    except Exception as e:
        logger.error(f"Error fetching credentials: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
    
@credential_router.delete("/{id}", response_model=SuccessResponse)
async def delete_credential(id: str):
    logger.info(f"Attempting to delete credential with id: {id}")
    
    try:        
        existing = await prisma.credentials.find_unique(where={"id": id})
        if not existing:
            raise HTTPException(status_code=404, detail="Credential not found")

        deleted = await prisma.credentials.delete(where={"id": id})

        logger.info(f"Deleted credential with id: {id}")
        return SuccessResponse(data=deleted, status_code=200)

    except Exception as e:
        logger.error(f"Error deleting credential: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")