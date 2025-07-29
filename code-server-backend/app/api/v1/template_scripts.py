from fastapi import APIRouter
from app.api.db import db
from app.api.models.response import SuccessResponse

template_scripts_router = APIRouter(
    prefix="/templates",
    tags=["Template Scripts API's"]
)

@template_scripts_router.post("/",response_model=SuccessResponse)
async def create_template_scripts():
    return SuccessResponse(data=[], status_code=200)


@template_scripts_router.get("/",response_model=SuccessResponse)
async def get_template_scripts():
    template_scripts = await db.prisma.templatescript.find_many()
    return SuccessResponse(data=template_scripts, status_code=200)