from pathlib import Path

import pymupdf


class PdfError(Exception):
    pass


def extract_text(pdf_path: Path) -> tuple[str, int]:
    """Return (text, page_count). Raises PdfError on unreadable files."""
    try:
        doc = pymupdf.open(pdf_path)
    except Exception as e:
        raise PdfError(f"Cannot open PDF: {e}") from e

    try:
        page_count = doc.page_count
        text_parts: list[str] = []
        for page in doc:
            text_parts.append(page.get_text())
        return "\n".join(text_parts).strip(), page_count
    finally:
        doc.close()