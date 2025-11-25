import React from "react";
import Navbar from "../components/Navbar";
import Ceremony from "../components/Ceremony";
import FAQs from "../components/FAQs";
import Contact from "../components/Contact";
import Hireprocess from "../components/Hireprocess";
import BuyDressSet from "../components/BuyDressSet";
import "./HomePage.css";
import { Link } from "react-router-dom";
import { useCmsContent } from "../api/useCmsContent";

export default function HomePage() {
  // Hero content controlled by CMS, with sensible defaults

  const { getValue, isLoaded } = useCmsContent();

  if (!isLoaded) return null;
  const heroImageUrl = getValue("home.heroImage") || "./img_small.png";
  const heroTitleLine1 = getValue("home.heroTitleLine1") || "Academic";
  const heroTitleLine2 = getValue("home.heroTitleLine2") || "Dress Hire";
  const heroTagline = getValue("home.heroTagline") || "A service provided by";
  const heroBoxLine1 =
    getValue("home.heroBoxLine1") || "Graduate Women Manawatu";
  const heroBoxLine2 = getValue("home.heroBoxLine2") || "Charitable Trust Inc.";
  const heroIntro =
    getValue("home.heroIntro") ||
    "Home of academic dress for the Massey University graduations and also for other institutions in the Central Districts.";

  return (
    <div>
      <Navbar />
      <div className="hero">
        <div className="bigbox">
          <div className="image">
            <img src={heroImageUrl} alt="picture" className="picture" />
          </div>
          <div className="text">
            <h1>{heroTitleLine1}</h1>
            <h1>{heroTitleLine2}</h1>
            <h2>{heroTagline}</h2>
            <div className="green-box">
              <h3>{heroBoxLine1}</h3>
              <h3>{heroBoxLine2}</h3>
            </div>
            <p>{heroIntro}</p>
            <div className="options">
              <Link to="/hireregalia" className="HireRegalia">
                Hire Regalia
              </Link>
              <Link to="/buyregalia" className="BuyRegalia">
                Buy Regalia
              </Link>
              <Link
                to={{ pathname: "/hireregalia", search: "?mode=photo" }}
                className="HireRegalia"
              >
                Casual Hire for Photos
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Ceremony />
      <Hireprocess />
      <BuyDressSet />
      <FAQs />
      <Contact />
    </div>
  );
}
