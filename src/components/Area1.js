import React, { useState } from "react";
import { Link } from "react-router-dom";
import gitLogo from "./../assets/github.svg";
import linkedinLogo from "./../assets/linkedin-logo.svg";

export function Area1(props) {
  const [isHidden, setisHidden] = useState(true);
  const onFirstlineComplete = () => {
    setisHidden(false);
  };

  return (
    <div className="body-backgroud">
      <div className="home-upper">
        <div className="Area1">
          <div style={{ fontSize: 50 }}>Hi, I am Sayantan Mishra</div>
        </div>
        <div className="home-social-links">
          <a href="https://github.com/sayanmdn">
            <img src={gitLogo} width="40px" />
          </a>
          <a href="https://www.linkedin.com/in/sayanmdn/">
            <img
              src={linkedinLogo}
              width="40px"
              style={{ marginLeft: "30px" }}
            />
          </a>
        </div>
      </div>
      <div className="home-projects">
        <h2>Projects :</h2>
        <ul>
          <li>Warehouse - Http Logger:</li>
          <p>
            Please signup with your email id in th top right bar and login to
            use it.
          </p>
          <li>News:</li>
          <p>Condense the latest news in India into one-line summaries.</p>
          <li>Rewrite:</li>
          <p>It provides a different wording for the sentence.</p>
          <br />
        </ul>
      </div>
    </div>
  );
}
