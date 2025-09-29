import React from "react";
import Authentication from "../components/Authentication";
import ExtractOrder from "./AdminExtractOrders.jsx";
import Navbar from "./Navbar.jsx";
import AdminEditCeremonies from "./AdminEditCeremonies.jsx";
import AdminNavbar from "./AdminNavbar.jsx";

export default function AdminConsole() {
    localStorage.removeItem("token"); // Remove it later
    // console.log("Admin Console");
    return (
        <div>
        <Authentication>
            {/*<Navbar/>*/}
            {/*<div className="pt-24">*/}
            {/*<ExtractOrder/>*/}
            {/*</div>*/}
            <AdminNavbar/>
        </Authentication>
        </div>
    );
}
