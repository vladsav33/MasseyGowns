import React from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img src="/logo.jpg" alt="MasseyGowns" className="logo" />
      </div>
      <ul className="navbar-menu">
        <li>
          <Link to="/">HOME</Link>
        </li>
        <li className="has-dropdown">
          <a href="#" className="menu-link">
            HIRE REGALIA
          </a>
          <section className="dropdown_panel">
            <div className="dropdown_casual">
              <h4>Casual Hire for Photos</h4>
              <ul>
                <li>
                  <a href="#">Certificate</a>
                </li>
                <li>
                  <a href="#">Diploma / Graduate Diploma / Post Grad Diploma</a>
                </li>
                <li>
                  <a href="#">Bachelor Degree</a>
                </li>
                <li>
                  <a href="#">Master Degree</a>
                </li>
                <li>
                  <a href="#">PhD Degree</a>
                </li>
                <li>
                  <a href="#">
                    Doctoral Degree (DEd, DBusAdmin, DClinPsych, DSW)
                  </a>
                </li>
                <li>
                  <a href="#">Higher Doctoral Degree</a>
                </li>
              </ul>
            </div>
          </section>
        </li>
        <li className="has-dropdown">
          <a href="#">BUY REGALIA</a>
          <section className="dropdown-panel">
            <div className="buyfull">
              <h4>Buy Full Regalia Sets</h4>
              <ul className="drondown-list">
                <li>
                  <a href="#">Buy Bachelor Degree Set</a>
                </li>
                <li>
                  <a href="#">Buy Master Degree Set</a>
                </li>
                <li>
                  <a href="#">Buy PhD Degree Set</a>
                </li>
              </ul>
            </div>
            <div className="buyindividual">
              <h4>Buy Individual Pieces</h4>
              <ul className="drondown-list">
                <li>
                  <a href="#">Buy Gowns</a>
                </li>
                <li>
                  <a href="#">Buy Hoods</a>
                </li>
                <li>
                  <a href="#">Buy Headwears</a>
                </li>
              </ul>
            </div>
          </section>
        </li>
        <li>
          <Link to="/faqs">FAQs</Link>
        </li>
        <li>
          <a href="#">Contact Us</a>
        </li>
      </ul>
      <div className="navbar-icons">
        {/*<i className="fa fa-user"></i>*/}
        <i className="fa fa-shopping-bag"></i>
        <i className="fa fa-search"></i>
      </div>
    </nav>
  );
}

export default Navbar;
