import React from "react";
import "./Contact.css";
import { Link } from "react-router-dom";
import Googlemap from "./Googlemap";

export default function Contact() {
  return (
    <section className="contact">
      <h2 className="h2">Contact Us</h2>
      <div className="contact_inner">
        <div className="contact_map">
          <Googlemap />
        </div>
        <div className="contact_info">
          <h3 className="contact_location">Location</h3>
          <p className="location">
            3 Refectory Road, University Avenue <br />
            Massey University <br />
            Palmerston North
          </p>
          <h3 className="contact_service">Customer Service</h3>
          <p className="phone">
            Phone:
            <br />
            06 350 4166
          </p>
          <p className="email">
            Email: <br />
            info@masseygowns.org.nz
          </p>
          <p className="openinghours">
            Opening Hours: <br />
            Monday - Thursday 9am - 2.30pm
          </p>
          <p className="detail">
            For more details, click{" "}
            <Link to="/contact" className="underline">
              here
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
