import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Dashboard } from "./pages/Dashboard";
import { Documents } from "./pages/Documents";
import { DocumentAnalysis } from "./pages/DocumentAnalysis";
import { ApiDocs } from "./pages/ApiDocs";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/api" element={<ApiDocs />} />
        </Route>
        {/* Full-width, no sidebar */}
        <Route path="/documents/:id" element={<DocumentAnalysis />} />
      </Routes>
    </BrowserRouter>
  );
}