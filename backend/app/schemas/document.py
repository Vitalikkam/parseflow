import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict


class DocumentBase(BaseModel):
    filename: str
    document_type: str | None = None
    status: str


class DocumentListItem(DocumentBase):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    validation_score: float | None = None
    created_at: datetime


class DocumentDetail(DocumentBase):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    file_size_bytes: int
    page_count: int | None
    processing_ms: int | None
    created_at: datetime
    updated_at: datetime
    structured_data: dict | None = None
    validation_result: dict | None = None
    error_message: str | None = None


class DocumentUploadResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    filename: str
    status: str
    created_at: datetime


class DocumentListResponse(BaseModel):
    documents: list[DocumentListItem]
    total: int