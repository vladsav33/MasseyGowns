import React from "react";
import HomePage from "./pages/HomePage";
import { Routes, Route, Navigate } from "react-router-dom";
import FAQs from "./components/FAQs.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/faqs" element={<FAQs />} />
      {/* 兜底避免空白 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
