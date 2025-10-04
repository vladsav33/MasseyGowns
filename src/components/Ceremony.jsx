import React from "react";
import "./Ceremony.css";

function Ceremony() {
  return (
    <section className="ceremony">
      <div className="ceremony_inner">
        <div className="cere_img">
          <img src="/cere_img.png" alt="graduations" />
        </div>
        <div className="ceremony_text">
          <h2 className="ceremony_title">WHAT YOU SHOULD WEAR ON</h2>
          <div className="littlebox">
            <h2>YOUR GRADUATION DAY</h2>
          </div>
          <div className="graduation_text">
            <p>
              Your graduation ceremony is a formal celebration of your
              achievement, and you are encouraged to dress appropriately.
              <br />
            </p>
            <p>
              All graduands are required to wear academic regalia at the
              graduation ceremony.
            </p>
            <p>
              Appropriate dress is considered to be <br />
              Men: suit and tie and applicable academic dress.
              <br />
              Women: formal clothes and applicable academic dress.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Ceremony;
