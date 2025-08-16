import React from "react";
import "./Ceremony.css";

function Ceremony() {
  return (
    <section className="ceremony">
      <h2 className="ceremony_title">
        WHAT YOU SHOULD WEAR ON YOUR GRADUATION DAY
      </h2>
      <div className="ceremony_inner">
        <div className="text">
          <p>
            Your graduation ceremony is a formal celebration of your
            achievement, and you are encouraged to dress appropriately <br />
          </p>
          <p>
            Appropriate dress is considered to be <br />
            Men: suit and tie and applicable academic dress.
            <br />
            Women: formal clothes and applicable academic dress.
          </p>
          <p>
            At graduation all graduates shall appear in the academic dress
            proper to their degree.
          </p>
          <a href="#" className="cere_link">
            Read More
          </a>
        </div>
        <div className="cere_img">
          <img src="/cere_img.png" alt="graduations" />
        </div>
      </div>
    </section>
  );
}

export default Ceremony;
