import React from "react";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img src="/new.png" alt="MasseyGowns" className="logo" />
      </div>
      <ul className="navbar-menu">
        <li>
          <a href="#">HOME</a>
        </li>
        <li>
          <a href="#">HIRE REGALIA</a>
        </li>
        <li>
          <a href="#">BUY REGALIA</a>
        </li>
        <li>
          <a href="#">FAQs</a>
        </li>
        <li>
          <a href="#">CONTACT US</a>
        </li>
      </ul>
      <div className="navbar-icons">
        <i className="fa fa-user"></i>
        <i className="fa fa-shopping-bag"></i>
        <i className="fa fa-search"></i>
      </div>
    </nav>
  );
}

export default Navbar;
