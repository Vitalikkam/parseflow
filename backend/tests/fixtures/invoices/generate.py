"""Generate synthetic invoice PDFs for testing ParseFlow extraction."""
from pathlib import Path

from reportlab.lib.pagesizes import LETTER
from reportlab.lib.units import inch
from reportlab.pdfgen import canvas

OUT = Path(__file__).parent


def draw_invoice(path: Path, vendor: dict, invoice: dict, line_items: list[dict]) -> None:
    c = canvas.Canvas(str(path), pagesize=LETTER)
    width, height = LETTER
    y = height - 1 * inch

    # Header
    c.setFont("Helvetica-Bold", 22)
    c.drawString(1 * inch, y, "INVOICE")
    y -= 0.4 * inch

    # Vendor block (top left)
    c.setFont("Helvetica-Bold", 12)
    c.drawString(1 * inch, y, vendor["name"])
    c.setFont("Helvetica", 10)
    for line in vendor["address"]:
        y -= 0.18 * inch
        c.drawString(1 * inch, y, line)

    # Invoice meta (top right)
    right_x = width - 3 * inch
    meta_y = height - 1.4 * inch
    c.setFont("Helvetica-Bold", 10)
    c.drawString(right_x, meta_y, "Invoice Number:")
    c.drawString(right_x, meta_y - 0.2 * inch, "Invoice Date:")
    c.drawString(right_x, meta_y - 0.4 * inch, "Due Date:")
    c.setFont("Helvetica", 10)
    c.drawString(right_x + 1.2 * inch, meta_y, invoice["number"])
    c.drawString(right_x + 1.2 * inch, meta_y - 0.2 * inch, invoice["date"])
    c.drawString(right_x + 1.2 * inch, meta_y - 0.4 * inch, invoice["due_date"])

    # Bill To
    y -= 0.5 * inch
    c.setFont("Helvetica-Bold", 11)
    c.drawString(1 * inch, y, "Bill To:")
    c.setFont("Helvetica", 10)
    y -= 0.2 * inch
    c.drawString(1 * inch, y, invoice["bill_to"])

    # Line items table
    y -= 0.6 * inch
    c.setFont("Helvetica-Bold", 10)
    c.drawString(1 * inch, y, "Description")
    c.drawString(width - 2 * inch, y, "Amount")
    c.line(1 * inch, y - 0.05 * inch, width - 1 * inch, y - 0.05 * inch)

    c.setFont("Helvetica", 10)
    subtotal = 0.0
    for item in line_items:
        y -= 0.25 * inch
        c.drawString(1 * inch, y, item["description"])
        c.drawRightString(width - 1 * inch, y, f"${item['amount']:,.2f}")
        subtotal += item["amount"]

    # Totals
    y -= 0.4 * inch
    c.line(width - 3 * inch, y + 0.15 * inch, width - 1 * inch, y + 0.15 * inch)
    c.drawString(width - 3 * inch, y, "Subtotal")
    c.drawRightString(width - 1 * inch, y, f"${subtotal:,.2f}")

    tax = invoice.get("tax", 0.0)
    y -= 0.22 * inch
    c.drawString(width - 3 * inch, y, "Tax")
    c.drawRightString(width - 1 * inch, y, f"${tax:,.2f}")

    total = subtotal + tax
    y -= 0.25 * inch
    c.setFont("Helvetica-Bold", 11)
    c.drawString(width - 3 * inch, y, "Total")
    c.drawRightString(width - 1 * inch, y, f"${total:,.2f}")

    # Footer
    c.setFont("Helvetica-Oblique", 8)
    c.drawString(1 * inch, 0.8 * inch, f"Currency: {invoice.get('currency', 'USD')}")
    c.drawString(1 * inch, 0.65 * inch, "Thank you for your business.")

    c.save()
    print(f"Wrote {path.name}")


# --- Invoice 1: Clean, simple, no tax
draw_invoice(
    OUT / "invoice_01_acme.pdf",
    vendor={
        "name": "Acme Corporation",
        "address": ["123 Industrial Way", "Springfield, IL 62704", "United States"],
    },
    invoice={
        "number": "INV-2026-1042",
        "date": "September 15, 2026",
        "due_date": "October 15, 2026",
        "bill_to": "Globex Industries, 500 Enterprise Blvd, Chicago, IL 60601",
        "currency": "USD",
        "tax": 0.0,
    },
    line_items=[
        {"description": "API Development — Phase 1", "amount": 1200.00},
        {"description": "Technical Consulting (8h)", "amount": 640.50},
    ],
)

# --- Invoice 2: With tax, different vendor, different layout details
draw_invoice(
    OUT / "invoice_02_globex.pdf",
    vendor={
        "name": "Globex Industries LLC",
        "address": ["500 Enterprise Blvd", "Chicago, IL 60601", "United States"],
    },
    invoice={
        "number": "GBX-88421",
        "date": "August 1, 2026",
        "due_date": "August 31, 2026",
        "bill_to": "Initech Solutions, 1 Infinite Loop, Cupertino, CA 95014",
        "currency": "USD",
        "tax": 187.25,
    },
    line_items=[
        {"description": "Cloud Infrastructure — August 2026", "amount": 2500.00},
        {"description": "Monitoring Add-on", "amount": 245.00},
        {"description": "Support Retainer", "amount": 1000.00},
    ],
)

# --- Invoice 3: High-value, single line item, tighter deadline
draw_invoice(
    OUT / "invoice_03_initech.pdf",
    vendor={
        "name": "Initech Solutions",
        "address": ["1 Infinite Loop", "Cupertino, CA 95014", "United States"],
    },
    invoice={
        "number": "INV-2026-0184",
        "date": "September 28, 2026",
        "due_date": "October 12, 2026",
        "bill_to": "Acme Corporation, 123 Industrial Way, Springfield, IL 62704",
        "currency": "USD",
        "tax": 420.00,
    },
    line_items=[
        {"description": "Enterprise License — Annual", "amount": 8400.00},
    ],
)