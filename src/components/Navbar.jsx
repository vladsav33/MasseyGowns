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
          <Link to="/hireregalia" className="menu-link">
            HIRE REGALIA
          </Link>
          <section className="dropdown_panel">
            <div className="dropdown_casual">
              <h4>Casual Hire for Photos</h4>
              <ul>
                <li>
                  <Link to="/hireregalia?degree=certificate">Certificate</Link>
                </li>
                <li>
                  <Link to="/hireregalia?degree=diploma">
                    Diploma / Graduate Diploma / Post Grad Diploma
                  </Link>
                </li>
                <li>
                  <Link to="/hireregalia?degree=bachelor">Bachelor Degree</Link>
                </li>
                <li>
                  <Link to="/hireregalia?degree=master">Master Degree</Link>
                </li>
                <li>
                  <Link to="/hireregalia?degree=phd">PhD Degree</Link>
                </li>
                <li>
                  <Link to="/hireregalia?degree=doctoral">
                    Doctoral Degree (DEd, DBusAdmin, DClinPsych, DSW)
                  </Link>
                </li>
                <li>
                  <Link to="/hireregalia?degree=higher-doctoral">
                    Higher Doctoral Degree
                  </Link>
                </li>
              </ul>
            </div>
          </section>
        </li>
        <li className="has-dropdown">
          <Link to="/buyregalia">BUY REGALIA</Link>
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
        <i className="fa fa-shopping-bag"></i>
        <i className="fa fa-search"></i>
      </div>
    </nav>
  );
}

export default Navbar;
