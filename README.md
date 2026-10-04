# ParseFlow

**AI document intelligence platform.** Turns PDF invoices into validated, structured business data.

Upload a PDF → extract structured fields with an LLM → validate against deterministic rules → export as JSON.

Built as a portfolio project, but architected and deployed like a real product.

---

## Live Demo

| | |
|---|---|
| **App** | https://parseflow-k0rcyx9ga-vitalikkam.vercel.app |
| **API** | https://parseflow-api-1mmc.onrender.com |
| **API Docs** | https://parseflow-api-1mmc.onrender.com/docs |

> **Note:** The backend runs on Render's free tier and sleeps after 15 minutes of inactivity. The first request after idle takes 30–60 seconds. Open the API `/health` endpoint first to warm it up before opening the app.

---

## What It Does

Upload a PDF invoice. ParseFlow:

1. Extracts the raw text layer with PyMuPDF
2. Sends it to Gemini with an enforced JSON schema
3. Runs 13 deterministic validation checks
4. Displays per-field status and a validation score
5. Lets you export the structured result as JSON

**Fields extracted:** vendor, invoice number, invoice date, due date, currency, subtotal, tax, total, line items.

**Validation categories:**
- Required field presence
- Format checks (ISO dates, ISO 4217 currency, decimal precision)
- Arithmetic checks (`subtotal + tax == total`, `sum(line_items) == subtotal`)
- Cross-field checks (`due_date >= invoice_date`, invoice date not in future)

---

## Architecture
┌──────────────────┐
│ React + Vite │ Vercel
│ TypeScript │
└────────┬─────────┘
│ HTTPS
▼
┌──────────────────┐
│ FastAPI │ Render
│ + Uvicorn │
└────────┬─────────┘
│
┌────┼──────────┬──────────────┐
▼ ▼ ▼ ▼
┌────────┐ ┌──────────┐ ┌────────────┐
│PyMuPDF │ │ Gemini │ │ PostgreSQL │
│ text │ │ struct. │ │ │
│ ext. │ │ output │ │ │
└────────┘ └──────────┘ └────────────┘
│
▼
Deterministic validation
13 checks, weighted score
│
▼
Structured JSON + per-field status



---

## Stack

**Backend**
- Python 3.13
- FastAPI
- SQLAlchemy 2 + Alembic
- PostgreSQL
- PyMuPDF (PDF text extraction)
- Google Gemini 3.5 Flash Lite (structured output via OpenAI-compatible endpoint)
- Pydantic v2

**Frontend**
- React 18 + TypeScript
- Vite
- Tailwind CSS
- TanStack Query
- React Router
- Lucide icons

**Deployment**
- Backend: Render (web service + PostgreSQL, free tier)
- Frontend: Vercel (static SPA)
- Docker Compose for local PostgreSQL

---

## How It Works

### 1. Upload
The client uploads a PDF. The backend validates:
- File type (`%PDF-` magic bytes)
- Size (max 5 MB)
- Page count (max 10)

### 2. Text extraction
PyMuPDF extracts the text layer from every page.

### 3. LLM extraction
A single call to Gemini with an enforced JSON schema returns:

```json
{
  "document_type": "invoice",
  "vendor": "Acme Corporation",
  "invoice_number": "INV-2026-1042",
  "invoice_date": "2026-09-15",
  "due_date": "2026-10-15",
  "currency": "USD",
  "subtotal": 1840.50,
  "tax": 0.00,
  "total": 1840.50,
  "line_items": [
    { "description": "API Development", "amount": 1200.00 },
    { "description": "Consulting", "amount": 640.50 }
  ]
}
