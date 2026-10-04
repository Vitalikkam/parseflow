import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

export const api = axios.create({ baseURL: API_BASE });

export interface DocumentListItem {
  id: string;
  filename: string;
  document_type: string | null;
  status: string;
  validation_score: number | null;
  created_at: string;
}

export interface DocumentListResponse {
  documents: DocumentListItem[];
  total: number;
}

export interface LineItem { description: string; amount: number; }

export interface StructuredData {
  document_type: string;
  vendor: string;
  invoice_number: string;
  invoice_date: string;
  due_date: string;
  currency: string;
  subtotal: number;
  tax: number;
  total: number;
  line_items: LineItem[];
}

export interface FieldValidation {
  status: "valid" | "review" | "invalid";
  checks: string[];
}

export interface ValidationResult {
  score: number;
  status: "high" | "review" | "low";
  checks_passed: number;
  checks_total: number;
  fields: Record<string, FieldValidation>;
}

export interface DocumentDetail {
  id: string;
  filename: string;
  document_type: string | null;
  status: string;
  file_size_bytes: number;
  page_count: number | null;
  processing_ms: number | null;
  created_at: string;
  updated_at: string;
  structured_data: StructuredData | null;
  validation_result: ValidationResult | null;
  error_message: string | null;
}

export interface DocumentUploadResponse {
  id: string;
  filename: string;
  status: string;
  created_at: string;
}

export async function listDocuments(): Promise<DocumentListResponse> {
  const { data } = await api.get<DocumentListResponse>("/api/v1/documents");
  return data;
}

export async function getDocument(id: string): Promise<DocumentDetail> {
  const { data } = await api.get<DocumentDetail>(`/api/v1/documents/${id}`);
  return data;
}

export async function uploadDocument(file: File): Promise<DocumentUploadResponse> {
  const form = new FormData();
  form.append("file", file);
  const { data } = await api.post<DocumentUploadResponse>(
    "/api/v1/documents",
    form,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return data;
}

export function documentFileUrl(id: string): string {
  return `${API_BASE}/api/v1/documents/${id}/file`;
}