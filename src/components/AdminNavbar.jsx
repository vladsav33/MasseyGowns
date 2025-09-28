import React from "react";
import { Link, useNavigate } from "react-router-dom";

function AdminNavbar() {
    return (
            <nav className="navbar">
                <div className="navbar-left">
                    <Link to="/">
                        <img src="/logo.jpg" alt="MasseyGowns" className="logo" />
                    </Link>
                    <ul className="navbar-menu">
                        <li>
                            <Link to="/admineditceremonies">
                                CEREMONIES
                            </Link>
                        </li>
                        <li>
                            <Link to="/admineditceremonies">
                                DEGREES
                            </Link>
                        </li>
                        <li>
                            <Link to="/adminextractorders">
                                ORDERS
                            </Link>
                        </li>
                    </ul>
                </div>
            </nav>
    );
}

export default AdminNavbar;