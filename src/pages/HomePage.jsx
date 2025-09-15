import React from "react";
import Navbar from "../components/Navbar";
import Ceremony from "../components/Ceremony";
import FAQs from "../components/FAQs";
import Contact from "../components/Contact";
//import Footer from "../components/Footer";
import Hireprocess from "../components/Hireprocess";
import "./HomePage.css";
import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div>
      <Navbar />
      <div className="hero">
        <div className="bigbox">
          <div className="image">
            <img src="./img.png" alt="picture" className="picture" />
          </div>
          <div className="text">
            <h1>Academic</h1>
            <h1>Dress Hire</h1>
            <h2>A service provided by</h2>
            <div className="green-box">
              <h3>Graduate Women Manawatu</h3>
              <h3>Charitable Trust Inc.</h3>
            </div>
            <p>
              Home of academic dress for the Massey University graduations{" "}
              <br /> and also for other institutions in the Central Districts.
            </p>
            <div className="options">
              <Link to="/hireregalia" className="HireRegalia">
                Hire Regalia
              </Link>
              <Link to="/buyregalia" className="BuyRegalia">
                Buy Regalia
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Ceremony />
      <Hireprocess />
      <FAQs />
      <Contact />
    </div>
  );
}

export default HomePage;
