from fastapi import FastAPI
from contextlib import asynccontextmanager
from dotenv import load_dotenv
import os
from fastapi.middleware.cors import CORSMiddleware

from app.api.db.db import connect_db, disconnect_db
from app.api.models.response import SuccessResponse
from app.api.v1 import code_server, template_scripts, credentials

origins = [
    "http://localhost:3000"
]
load_dotenv()

@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_db()
    yield
    await disconnect_db()

app = FastAPI(
    title="Code Server Instance Manager",
    lifespan=lifespan,
    prefix=os.getenv("API_PREFIX")
)

app.include_router(code_server.code_server_router)
app.include_router(template_scripts.template_scripts_router)
app.include_router(credentials.credential_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health", tags=["Health API"], response_model=SuccessResponse)
def get_health():
    return SuccessResponse(status_code=200, message="Server is up")
