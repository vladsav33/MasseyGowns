import React from "react";
import HomePage from "./pages/HomePage";
import { Routes, Route, Navigate } from "react-router-dom";
import HireRegalia from "./pages/HireRegalia.jsx";
import BuyRegalia from "./pages/BuyRegalia.jsx";
import FAQPage from "./pages/FAQPage";
import ContactUS from "./pages/ContactUS.jsx";
import Payment from "./components/Payment.jsx";
import Checkout from "./components/Checkout.jsx";
import TermsAndConditions from "./pages/TermsAndConditions.jsx";
import HireprocessWrapper from "./components/HireprocessWrapper.jsx";
import PaymentCompleted from "./components/PaymentCompleted.jsx";
import ShoppingCart from "./pages/ShoppingCart.jsx";
import CustomerDetailsPage from "./pages/CustomerDetailsPage.jsx";
import WhatToWearGuidePage from "./pages/WhatToWearGuidePage.jsx";

export default function App() {
  return (
    <Routes>
      <Route
        path="/what-to-wear/choose-your-institutions-regalia-guide"
        element={<WhatToWearGuidePage />}
      />
      <Route
        path="/what-to-wear/conjoint-degree-regalia"
        element={<WhatToWearGuidePage />}
      />
      <Route
        path="/what-to-wear/general-regalia-guide"
        element={<WhatToWearGuidePage />}
      />
      <Route path="/what-to-wear/gowns" element={<WhatToWearGuidePage />} />
      <Route path="/what-to-wear/head-wear" element={<WhatToWearGuidePage />} />
      <Route
        path="/what-to-wear/hoods-stoles-and-sash"
        element={<WhatToWearGuidePage />}
      />
      <Route path="/what-to-wear/korowai" element={<WhatToWearGuidePage />} />
      <Route
        path="/what-to-wear/regalia-from-overseas-and-other-new-zealand-universities"
        element={<WhatToWearGuidePage />}
      />
      <Route
        path="/what-to-wear/sizes-and-fitting"
        element={<WhatToWearGuidePage />}
      />
      <Route
        path="/what-to-wear/massey-university-what-to-wear"
        element={<WhatToWearGuidePage />}
      />
      <Route
        path="/what-to-wear/ucol-what-to-wear"
        element={<WhatToWearGuidePage />}
      />
      <Route path="/" element={<HomePage />} />
      <Route path="/faqs" element={<FAQPage />} />
      <Route path="/hireregalia" element={<HireRegalia />} />
      <Route path="/buyregalia" element={<BuyRegalia />} />
      <Route path="/cart" element={<ShoppingCart />} />
      <Route path="/customerdetailsPage" element={<CustomerDetailsPage />} />
      <Route path="/contactus" element={<ContactUS />} />
      <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
      <Route path="/hireregalia/:degree" element={<HireprocessWrapper />} />
      <Route path="/payment" element={<Payment />} />
      <Route path="/paymentcompleted" element={<PaymentCompleted />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
