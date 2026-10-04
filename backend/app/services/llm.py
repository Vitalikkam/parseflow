import json

from openai import OpenAI

from app.core.config import settings


client = OpenAI(
    api_key=settings.llm_api_key,
    base_url=settings.llm_base_url,
)


INVOICE_SCHEMA = {
    "type": "object",
    "properties": {
        "document_type": {"type": "string", "enum": ["invoice"]},
        "vendor": {"type": "string"},
        "invoice_number": {"type": "string"},
        "invoice_date": {"type": "string", "description": "ISO 8601 date (YYYY-MM-DD)"},
        "due_date": {"type": "string", "description": "ISO 8601 date (YYYY-MM-DD)"},
        "currency": {"type": "string", "description": "ISO 4217 code"},
        "subtotal": {"type": "number"},
        "tax": {"type": "number"},
        "total": {"type": "number"},
        "line_items": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "description": {"type": "string"},
                    "amount": {"type": "number"},
                },
                "required": ["description", "amount"],
                "additionalProperties": False,
            },
        },
    },
    "required": [
        "document_type",
        "vendor",
        "invoice_number",
        "invoice_date",
        "due_date",
        "currency",
        "subtotal",
        "tax",
        "total",
        "line_items",
    ],
    "additionalProperties": False,
}


SYSTEM_PROMPT = """You are an invoice data extraction engine.

Extract the requested fields from the invoice text.

Rules:
- Return dates in ISO 8601 format: YYYY-MM-DD
- Return amounts as plain numbers without currency symbols or thousands separators
- If a value is missing from the document, use an empty string for text fields or 0 for numeric fields
- Do not invent data
- currency must be a 3-letter ISO 4217 code (e.g. USD, EUR, GBP)
"""


def extract_invoice(text: str) -> dict:
    response = client.chat.completions.create(
        model=settings.llm_model,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": f"Extract invoice data from this text:\n\n{text}"},
        ],
        response_format={
            "type": "json_schema",
            "json_schema": {
                "name": "invoice_extraction",
                "strict": True,
                "schema": INVOICE_SCHEMA,
            },
        },
        temperature=0,
    )

    content = response.choices[0].message.content
    if content is None:
        raise ValueError("LLM returned no content")
    return json.loads(content)