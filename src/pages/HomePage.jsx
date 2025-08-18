import React from "react";
import Navbar from "../components/Navbar";
import Ceremony from "../components/Ceremony";
import FAQs from "../components/FAQs";
import Contact from "../components/Contact";
import Footer from "../components/Footer";
import Hireprocess from "../components/Hireprocess";
import "./HomePage.css";

function HomePage() {
  return (
    <div>
      <Navbar />
      <div className="hero">
        <h1>Academic Dress Hire</h1>
        <div className="options">
          <a href="#" className="HireRegalia">
            Hire Regalia
          </a>
          <a href="#" className="BuyRegalia">
            Buy Regalia
          </a>
        </div>
        <p>
          Home of academic dress for the Massey University graduations and also
          for other institutions in the Central Districts.
        </p>
      </div>
      <Ceremony />
      <Hireprocess />
      <FAQs />
      <Contact />
      <Footer />
    </div>
  );
}

export default HomePage;
