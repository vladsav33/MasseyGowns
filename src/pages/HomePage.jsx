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
  // Hero content controlled by CMS, with sensible defaults
  const [heroImageUrl, setHeroImageUrl] = useState(null);

  const [heroTitleLine1, setHeroTitleLine1] = useState("Academic");
  const [heroTitleLine2, setHeroTitleLine2] = useState("Dress Hire");
  const [heroTagline, setHeroTagline] = useState("A service provided by");
  const [heroBoxLine1, setHeroBoxLine1] = useState("Graduate Women Manawatu");
  const [heroBoxLine2, setHeroBoxLine2] = useState("Charitable Trust Inc.");
  const [heroIntro, setHeroIntro] = useState(
    "Home of academic dress for the Massey University graduations and also for other institutions in the Central Districts."
  );

  const [isHeroLoaded, setIsHeroLoaded] = useState(false);

  useEffect(() => {
    async function fetchCmsContent() {
      try {
        const res = await fetch(`${API_BASE}/api/CmsContent`);
        if (!res.ok) {
          const text = await res.text();
          throw new Error(
            `Failed to load CMS content (${res.status}): ${text}`
          );
        }

        const json = await res.json();
        const blocks = json.data || [];

        const getValue = (key) => {
          const block = blocks.find((b) => b.key === key);
          if (!block) return null;
          return typeof block.value === "string" ? block.value : null;
        };

        const heroImg = getValue("home.heroImage");
        if (heroImg) {
          setHeroImageUrl(heroImg);
        }

        const t1 = getValue("home.heroTitleLine1");
        if (t1) setHeroTitleLine1(t1);

        const t2 = getValue("home.heroTitleLine2");
        if (t2) setHeroTitleLine2(t2);

        const tagline = getValue("home.heroTagline");
        if (tagline) setHeroTagline(tagline);

        const box1 = getValue("home.heroBoxLine1");
        if (box1) setHeroBoxLine1(box1);

        const box2 = getValue("home.heroBoxLine2");
        if (box2) setHeroBoxLine2(box2);

        const intro = getValue("home.heroIntro");
        if (intro) setHeroIntro(intro);
      } catch (err) {
        console.error(err);
      } finally {
        setIsHeroLoaded(true);
      }
    }

    fetchCmsContent();
  }, []);

  const fallbackHeroSrc = "./img_small.png";
  const finalHeroSrc = isHeroLoaded ? heroImageUrl || fallbackHeroSrc : null;

  return (
    <div>
      <Navbar />
      <div className="hero">
        <div className="bigbox">
          <div className="image">
            {finalHeroSrc ? (
              <img
                key={finalHeroSrc}
                src={finalHeroSrc}
                alt="picture"
                className="picture"
              />
            ) : null}
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

export default HomePage;
