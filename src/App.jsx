import React from "react";
import HomePage from "./pages/HomePage";
import { Routes, Route, Navigate } from "react-router-dom";
import HireRegalia from "./pages/HireRegalia.jsx";
import BuyRegalia from "./pages/BuyRegalia.jsx";
import FAQPage from "./components/FAQPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/faqs" element={<FAQPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
      <Route path="/hireregalia" element={<HireRegalia />} />
      <Route path="/buyregalia" element={<BuyRegalia />} />
    </Routes>
  );
}
