import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export function Contact(_props) {
  useEffect(() => {
    AOS.init();
  }, []);

  return (
    <div>
      <h2>Contact Us</h2>
      <p data-aos="fade-right">
        Please reach out to us regarding any concerns related to updates in
        data, app issues, or suggestions.
      </p>
      <p data-aos="fade-up">
        <b>Phone:</b> +91 7001137041 , +91 7001671470
        <br></br>
        <b>Email:</b> sayanmdn@gmail.com
      </p>
    </div>
  );
}
