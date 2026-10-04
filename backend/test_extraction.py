"""Quick test: run extraction on all fixture invoices."""
import json
from pathlib import Path

from app.services.llm import extract_invoice
from app.services.pdf import extract_text


def main() -> None:
    fixtures = Path("tests/fixtures/invoices")
    pdfs = sorted(fixtures.glob("*.pdf"))

    if not pdfs:
        print(f"No PDFs found in {fixtures}")
        return

    for pdf in pdfs:
        print(f"\n{'=' * 70}")
        print(f"  {pdf.name}")
        print(f"{'=' * 70}\n")

        text, _ = extract_text(pdf)
        try:
            result = extract_invoice(text)
            print(json.dumps(result, indent=2))
        except Exception as e:
            print(f"ERROR: {type(e).__name__}: {e}")


if __name__ == "__main__":
    main()