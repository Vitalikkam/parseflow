import uuid
from pathlib import Path

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from fastapi.responses import FileResponse
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.database import get_db
from app.models.document import Document
from app.schemas.document import (
    DocumentDetail,
    DocumentListItem,
    DocumentListResponse,
    DocumentUploadResponse,
)
from app.services.pdf import PdfError, extract_text
from app.services.pipeline import PipelineError, process_document

router = APIRouter(prefix="/documents", tags=["documents"])

PDF_MAGIC = b"%PDF-"


@router.post(
    "",
    response_model=DocumentUploadResponse,
    status_code=status.HTTP_201_CREATED,
)
async def upload_document(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
) -> Document:
    if not file.filename or not file.filename.lower().endswith(".pdf"):
        raise HTTPException(422, "Only PDF files are accepted")

    contents = await file.read()

    if not contents.startswith(PDF_MAGIC):
        raise HTTPException(422, "File is not a valid PDF")

    max_bytes = settings.max_file_size_mb * 1024 * 1024
    if len(contents) > max_bytes:
        raise HTTPException(413, f"File exceeds {settings.max_file_size_mb} MB")

    storage = Path(settings.storage_path)
    storage.mkdir(parents=True, exist_ok=True)
    doc_id = uuid.uuid4()
    file_path = storage / f"{doc_id}.pdf"
    file_path.write_bytes(contents)

    try:
        text, page_count = extract_text(file_path)
    except PdfError as e:
        file_path.unlink(missing_ok=True)
        raise HTTPException(422, str(e)) from e

    if page_count > settings.max_pages:
        file_path.unlink(missing_ok=True)
        raise HTTPException(
            422, f"PDF exceeds {settings.max_pages} pages (got {page_count})"
        )

    doc = Document(
        id=doc_id,
        filename=file.filename,
        file_size_bytes=len(contents),
        page_count=page_count,
        status="uploaded",
        raw_text=text,
    )
    db.add(doc)
    db.commit()
    db.refresh(doc)

    try:
        doc = process_document(str(doc.id), file_path, db)
    except PipelineError as e:
        raise HTTPException(500, f"Extraction failed: {e}") from e

    return doc


@router.get("", response_model=DocumentListResponse)
def list_documents(db: Session = Depends(get_db)) -> DocumentListResponse:
    total = db.scalar(select(func.count()).select_from(Document)) or 0
    rows = db.scalars(
        select(Document).order_by(Document.created_at.desc()).limit(50)
    ).all()

    items = [
        DocumentListItem(
            id=d.id,
            filename=d.filename,
            document_type=d.document_type,
            status=d.status,
            validation_score=(d.validation_result or {}).get("score"),
            created_at=d.created_at,
        )
        for d in rows
    ]
    return DocumentListResponse(documents=items, total=total)


@router.get("/{document_id}", response_model=DocumentDetail)
def get_document(document_id: uuid.UUID, db: Session = Depends(get_db)) -> Document:
    doc = db.get(Document, document_id)
    if doc is None:
        raise HTTPException(404, "Document not found")
    return doc


@router.get("/{document_id}/file")
def get_document_file(
    document_id: uuid.UUID, db: Session = Depends(get_db)
) -> FileResponse:
    doc = db.get(Document, document_id)
    if doc is None:
        raise HTTPException(404, "Document not found")
    file_path = Path(settings.storage_path) / f"{doc.id}.pdf"
    if not file_path.exists():
        raise HTTPException(404, "File missing from storage")
    return FileResponse(
        file_path,
        media_type="application/pdf",
        filename=doc.filename,
    )


@router.get("/{document_id}/text")
def get_document_text(document_id: uuid.UUID, db: Session = Depends(get_db)) -> dict:
    doc = db.get(Document, document_id)
    if doc is None:
        raise HTTPException(404, "Document not found")
    return {"id": str(doc.id), "raw_text": doc.raw_text or ""}