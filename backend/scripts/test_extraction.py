"""Quick test: run extraction on all three fixture invoices."""
from pathlib import Path

from app.services.llm import extract_invoice
from app.services.pdf import extract_text

fixtures = Path("tests/fixtures/invoices")
for pdf in sorted(fixtures.glob("*.pdf")):
    text, _ = extract_text(pdf)
    print(f"\n{'='*60}\n{pdf.name}\n{'='*60}")
    try:
        result = extract_invoice(text)
        print(json.dumps(result, indent=2))
    except Exception as e:
        print(f"ERROR: {e}")