import React from "react";
import "./Navbar.css";
import { useEffect, useState } from "react";

function Navbar() {
  const [menu, setMenu] = useState([]);

  useEffect(() => {
    fetch("https://gownapi-dsbyfdeydah3aadr.newzealandnorth-01.azurewebsites.net/degreesandceremonies")
        .then((res) => res.json())
        .then((data) => setMenu(data))
        .catch((err) => console.error("Failed to fetch menu:", err));
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img src="/logo.jpg" alt="MasseyGowns" className="logo" />
      </div>
      <ul className="navbar-menu">
        <li>
          <a href="#">HOME</a>
        </li>
        <li className="has-dropdown">
          <a href="#" className="menu-link">
            HIRE REGALIA
          </a>
          <section className="dropdown_panel">
            <div className="dropdown_casual">
              {menu.map((menuItem, i) => {
                  console.log(menuItem);
                  return (
                <li className={menuItem.children ? "has-dropdown" : ""}>
                  <h4>{menuItem.name}</h4>
                  {/*{menuItem.children && menuItem.children.length > 0 && (*/}
                  {/*  <ul className="drondown-list">*/}
                  {/*    {menuItem.children.map((child, j) => (*/}
                  {/*      <li key={j}>*/}
                  {/*        <a href="#">{child.name}</a>*/}
                  {/*      </li>*/}
                  {/*    ))}*/}
                  {/*  </ul>*/}
                  {/*)}*/}
                </li>
              )})}
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
          <a href="#">FAQs</a>
        </li>
        <li>
          <a href="#">Contact Us</a>
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
