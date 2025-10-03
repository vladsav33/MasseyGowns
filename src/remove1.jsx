import React from "react";
import ReactDOM, {createRoot} from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // 关键
import App from "./AdminApp.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </React.StrictMode>
);