from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import documents
from app.core.config import settings

from app.core.database import Base, engine
from app.models import Document  # noqa: F401 — registers model with Base

Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="ParseFlow API",
    description="Turn invoices into validated, structured business data.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in settings.cors_origins.split(",")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(documents.router, prefix="/api/v1")


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}