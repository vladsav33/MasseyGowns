import React from "react";
import HomePage from "./pages/HomePage";
import { Routes, Route, Navigate } from "react-router-dom";
import FAQs from "./components/FAQs.jsx";
import HireRegalia from "./pages/HireRegalia.jsx"

export default function AdminApp() {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/faqs" element={<FAQs />} />
            {/* 兜底避免空白 */}
            <Route path="*" element={<Navigate to="/" replace />} />
            <Route path="/hireregalia" element={<HireRegalia />} />
        </Routes>
    );
}