import React from "react";
import "./BuyDressSet.css"; // 注意这里用 BuyDressSet.css，而不是 Footer.css

export default function BuyDressSet() {
  return (
    <section>
      <h2 className="BuyDressSetTitle">Buy Quality Academic Dress Set</h2>
      <div className="BuyDressSetImg">
        <div>
          <img src="/BuyBachelorRobes.png" alt="Buy Bachelor Robes" />
          <p>Buy Bachelor Robes</p>
        </div>
        <div>
          <img src="/BuyMastersRobes.png" alt="Buy Masters Robes" />
          <p>Buy Masters Robes</p>
        </div>
        <div>
          <img src="/BuyPhDRobes.png" alt="Buy PhD Robes" />
          <p>Buy PhD Robes</p>
        </div>
      </div>
    </section>
  );
}
