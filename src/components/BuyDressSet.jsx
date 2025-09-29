import React from "react";
import "./BuyDressSet.css";
import { Link } from "react-router-dom";
export default function BuyDressSet() {
  return (
    <section>
      <h2 className="BuyDressSetTitle">Purchasing a Set of Academic Regalia</h2>
      <div className="BuyDressSetImg">
        <div className="threepic">
          <img src="/BuyBachelorRobes.png" alt="Buy Bachelor Robes" />
          <Link to="/buyregalia" className="buyrobes">
            Buy Bachelor Robes
          </Link>
        </div>
        <div className="threepic">
          <img src="/BuyMastersRobes.png" alt="Buy Masters Robes" />
          <Link to="/buyregalia" className="buyrobes">
            Buy Masters Robes
          </Link>
        </div>
        <div className="threepic">
          <img src="/BuyPhDRobes.png" alt="Buy PhD Robes" />
          <Link to="/buyregalia" className="buyrobes">
            Buy PhD Robes
          </Link>
        </div>
      </div>
    </section>
  );
}
