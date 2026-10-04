import time
from pathlib import Path

from sqlalchemy.orm import Session

from app.models.document import Document
from app.services.llm import extract_invoice
from app.services.pdf import PdfError, extract_text
from app.services.validation import validate_invoice


class PipelineError(Exception):
    pass


def process_document(doc_id: str, pdf_path: Path, db: Session) -> Document:
    doc = db.get(Document, doc_id)
    if doc is None:
        raise PipelineError(f"Document {doc_id} not found")

    started = time.perf_counter()

    try:
        doc.status = "processing"
        db.commit()

        text, page_count = extract_text(pdf_path)
        doc.raw_text = text
        doc.page_count = page_count
        db.commit()

        structured = extract_invoice(text)
        doc.structured_data = structured
        doc.document_type = structured.get("document_type", "invoice")

        validation = validate_invoice(structured)
        doc.validation_result = validation

        doc.status = "processed"
        doc.processing_ms = int((time.perf_counter() - started) * 1000)
        db.commit()
        db.refresh(doc)
        return doc

    except PdfError as e:
        doc.status = "failed"
        doc.error_message = f"PDF error: {e}"
        db.commit()
        raise PipelineError(str(e)) from e

    except Exception as e:
        doc.status = "failed"
        doc.error_message = f"{type(e).__name__}: {e}"
        db.commit()
        raise PipelineError(str(e)) from e