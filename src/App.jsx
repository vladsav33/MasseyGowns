import React from "react";
import HomePage from "./pages/HomePage";
import { Routes, Route, Navigate } from "react-router-dom";
import HireRegalia from "./pages/HireRegalia.jsx";
import BuyRegalia from "./pages/BuyRegalia.jsx";
import FAQPage from "./pages/FAQPage";
import ContactUS from "./pages/ContactUS.jsx";
import TermsAndConditions from "./pages/TermsAndConditions.jsx";
import HireprocessWrapper from "./components/HireprocessWrapper.jsx";
import ExtractOrder from "./components/ExtractOrder.jsx";
import Authentication from "./components/Authentication.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/faqs" element={<FAQPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
      <Route path="/hireregalia" element={<HireRegalia />} />
      <Route path="/buyregalia" element={<BuyRegalia />} />
      <Route path="/contactus" element={<ContactUS />} />
      <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
      <Route path="/hireregalia/:degree" element={<HireprocessWrapper />} />
      <Route path="/admin" element={<ExtractOrder />} />
    </Routes>
  );
}
