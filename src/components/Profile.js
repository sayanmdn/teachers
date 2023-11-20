import React from "react";

import { useParams } from "react-router-dom";

export function Profile() {
  const { username } = useParams();

  return (
    <div className="body-backgroud">
      <div className="home-upper">
        <div>
          <h2>Profile Page</h2>
          <p>Username: {username}</p>
        </div>
      </div>
    </div>
  );
}
