import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Ceremony from "../components/Ceremony";
import FAQs from "../components/FAQs";
import Contact from "../components/Contact";
import Hireprocess from "../components/Hireprocess";
import BuyDressSet from "../components/BuyDressSet";
import "./HomePage.css";
import { Link } from "react-router-dom";

const API_BASE = import.meta.env.VITE_GOWN_API_BASE;

function HomePage() {
  const [heroImageUrl, setHeroImageUrl] = useState(null);

  useEffect(() => {
    async function fetchHeroImage() {
      try {
        const res = await fetch(`${API_BASE}/api/HomePage/hero-image`);
        if (!res.ok) {
          throw new Error(`Failed to load hero image: ${res.status}`);
        }

        const json = await res.json();
        const url =
          (json && json.data && json.data.heroImageUrl) ||
          json.heroImageUrl ||
          null;

        if (url) {
          setHeroImageUrl(url);
        }
      } catch (err) {
        console.error(err);
      }
    }

    fetchHeroImage();
  }, []);

  const finalHeroSrc = heroImageUrl || "./img_small.png";

  return (
    <div>
      <Navbar />
      <div className="hero">
        <div className="bigbox">
          <div className="image">
            <img
              key={finalHeroSrc}
              src={finalHeroSrc}
              alt="picture"
              className="picture"
            />
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
              Home of academic dress for the Massey University graduations
              <br /> and also for other institutions in the Central Districts.
            </p>
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

export default HomePage;
