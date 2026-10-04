"""Deterministic validation for extracted invoice data.

Rules are grouped into four categories:
- required fields (presence)
- format checks (types, patterns, ranges)
- arithmetic checks (subtotal + tax == total, line items sum)
- cross-field checks (date ordering, currency consistency)

The score is a weighted average. The UI never sees the formula, only the score
and the check counts. The formula is documented here and in the README.
"""
from __future__ import annotations

import re
from datetime import date, datetime
from decimal import Decimal, InvalidOperation
from typing import Any


ISO_DATE_RE = re.compile(r"^\d{4}-\d{2}-\d{2}$")
INVOICE_NUMBER_RE = re.compile(r"^[A-Za-z0-9\-\/]+$")
CURRENCY_RE = re.compile(r"^[A-Z]{3}$")
AMOUNT_TOLERANCE = Decimal("0.01")
MAX_DATE_AGE_YEARS = 5
MAX_DUE_WINDOW_DAYS = 365


def _to_decimal(value: Any) -> Decimal | None:
    if value is None or value == "":
        return None
    try:
        return Decimal(str(value))
    except (InvalidOperation, ValueError):
        return None


def _parse_date(value: Any) -> date | None:
    if not isinstance(value, str) or not ISO_DATE_RE.match(value):
        return None
    try:
        return datetime.strptime(value, "%Y-%m-%d").date()
    except ValueError:
        return None


def _amount_has_valid_precision(value: Any) -> bool:
    d = _to_decimal(value)
    if d is None:
        return False
    return -d.as_tuple().exponent <= 2


def validate_invoice(data: dict) -> dict:
    """Run all validation rules against extracted invoice data.

    Returns a dict with: score, status, checks_passed, checks_total, fields.
    """
    field_results: dict[str, dict] = {}

    required_passed = 0
    required_total = 0
    format_passed = 0
    format_total = 0
    arithmetic_passed = 0
    arithmetic_total = 0
    date_passed = 0
    date_total = 0

    # ---------- vendor ----------
    vendor_checks: list[str] = []
    vendor_status = "valid"
    v = data.get("vendor")
    required_total += 1
    if isinstance(v, str) and 1 <= len(v) <= 200:
        required_passed += 1
        vendor_checks.append("present")
        format_total += 1
        format_passed += 1
        vendor_checks.append("format")
    else:
        vendor_status = "invalid"
    field_results["vendor"] = {"status": vendor_status, "checks": vendor_checks}

    # ---------- invoice_number ----------
    inv_checks: list[str] = []
    inv_status = "valid"
    inv = data.get("invoice_number")
    required_total += 1
    if isinstance(inv, str) and inv:
        required_passed += 1
        inv_checks.append("present")
        format_total += 1
        if INVOICE_NUMBER_RE.match(inv):
            format_passed += 1
            inv_checks.append("format")
        else:
            inv_status = "review"
    else:
        inv_status = "invalid"
    field_results["invoice_number"] = {"status": inv_status, "checks": inv_checks}

    # ---------- invoice_date ----------
    invoice_date = _parse_date(data.get("invoice_date"))
    id_checks: list[str] = []
    id_status = "valid"
    required_total += 1
    if invoice_date:
        required_passed += 1
        id_checks.append("present")
        date_total += 1
        today = date.today()
        if invoice_date > today:
            id_status = "review"
        elif (today - invoice_date).days > MAX_DATE_AGE_YEARS * 365:
            id_status = "review"
        else:
            date_passed += 1
            id_checks.append("within_range")
    else:
        id_status = "invalid"
    field_results["invoice_date"] = {"status": id_status, "checks": id_checks}

    # ---------- due_date ----------
    due_date = _parse_date(data.get("due_date"))
    dd_checks: list[str] = []
    dd_status = "valid"
    required_total += 1
    if due_date:
        required_passed += 1
        dd_checks.append("present")
        date_total += 1
        if invoice_date and due_date < invoice_date:
            dd_status = "review"
        elif invoice_date and (due_date - invoice_date).days > MAX_DUE_WINDOW_DAYS:
            dd_status = "review"
        else:
            date_passed += 1
            dd_checks.append("after_invoice_date")
    else:
        dd_status = "invalid"
    field_results["due_date"] = {"status": dd_status, "checks": dd_checks}

    # ---------- currency ----------
    cur_checks: list[str] = []
    cur_status = "valid"
    cur = data.get("currency")
    required_total += 1
    if isinstance(cur, str) and CURRENCY_RE.match(cur):
        required_passed += 1
        cur_checks.append("present")
        format_total += 1
        format_passed += 1
        cur_checks.append("format")
    else:
        cur_status = "invalid"
    field_results["currency"] = {"status": cur_status, "checks": cur_checks}

    # ---------- amounts ----------
    subtotal = _to_decimal(data.get("subtotal"))
    tax = _to_decimal(data.get("tax"))
    total = _to_decimal(data.get("total"))

    for name, value in (("subtotal", subtotal), ("tax", tax), ("total", total)):
        checks: list[str] = []
        st = "valid"
        required_total += 1
        if value is not None and value >= 0:
            required_passed += 1
            checks.append("present")
            format_total += 1
            if _amount_has_valid_precision(data.get(name)):
                format_passed += 1
                checks.append("format")
            else:
                st = "review"
        else:
            st = "invalid"
        field_results[name] = {"status": st, "checks": checks}

    # ---------- line_items ----------
    items = data.get("line_items") or []
    li_checks: list[str] = []
    li_status = "valid"
    required_total += 1
    if isinstance(items, list) and len(items) > 0:
        required_passed += 1
        li_checks.append("present")
        format_total += 1
        if all(
            isinstance(i, dict)
            and isinstance(i.get("description"), str)
            and _to_decimal(i.get("amount")) is not None
            for i in items
        ):
            format_passed += 1
            li_checks.append("format")
        else:
            li_status = "review"
    else:
        li_status = "invalid"
    field_results["line_items"] = {"status": li_status, "checks": li_checks}

    # ---------- arithmetic: subtotal + tax == total ----------
    total_status = field_results["total"]["status"]
    if subtotal is not None and tax is not None and total is not None:
        arithmetic_total += 1
        if abs((subtotal + tax) - total) <= AMOUNT_TOLERANCE:
            arithmetic_passed += 1
            field_results["total"]["checks"].append("matches_subtotal_tax")
        else:
            total_status = "review"
            field_results["total"]["status"] = "review"

    # ---------- arithmetic: sum(line_items) == subtotal ----------
    if subtotal is not None and items:
        arithmetic_total += 1
        try:
            items_sum = sum(
                (_to_decimal(i.get("amount")) or Decimal("0")) for i in items
            )
            if abs(items_sum - subtotal) <= AMOUNT_TOLERANCE:
                arithmetic_passed += 1
                field_results["total"]["checks"].append("matches_line_items")
            else:
                total_status = "review"
                field_results["total"]["status"] = "review"
        except Exception:
            total_status = "review"
            field_results["total"]["status"] = "review"

    # ---------- currency consistency ----------
    # (Single-currency invoices for V1 — placeholder for V2)

    # ---------- scoring ----------
    def ratio(p: int, t: int) -> float:
        return p / t if t else 1.0

    score = (
        0.40 * ratio(required_passed, required_total)
        + 0.30 * ratio(arithmetic_passed, arithmetic_total)
        + 0.15 * ratio(date_passed, date_total)
        + 0.15 * ratio(format_passed, format_total)
    )

    if score >= 0.90:
        band = "high"
    elif score >= 0.70:
        band = "review"
    else:
        band = "low"

    checks_passed = (
        required_passed + format_passed + arithmetic_passed + date_passed
    )
    checks_total = (
        required_total + format_total + arithmetic_total + date_total
    )

    return {
        "score": round(score, 4),
        "status": band,
        "checks_passed": checks_passed,
        "checks_total": checks_total,
        "fields": field_results,
    }