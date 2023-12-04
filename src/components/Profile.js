import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { URL } from "../config";
import { Row, Col } from "react-bootstrap";

export function Profile() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await axios.post(`${URL}teachers/findById`, { id });
        setProfile(response.data);
        console.log("response ", response);
        return response;
      } catch (e) {
        console.log(e);
      }
    }

    fetchProfile();
  }, []);

  return (
    <div className="body-backgroud">
      <div className="profile-upper">
        <div>
          <h3>Profile Page</h3>
          <p>Id: {id}</p>
        </div>
      </div>
      {profile && (
        <div className="profile-main">
          <Row>
            <Col sm={6}>
              <div className="home-main-right">
                <h3 style={{ marginBottom: "1rem" }}>Name: {profile.name}</h3>
                <h5>Subjects: {profile.subjects.join(" ")}</h5>
                <h5>Educational Qualifications: Studing MSc in Physics</h5>
                <h5>Teaches from class: {profile.fromClass}</h5>
                <h5>Teaches up to class: {profile.toClass}</h5>
              </div>
            </Col>
            <Col sm={6}>
              <div className="home-main-right">
                <h3>Contact Information</h3>
                <p>Phone: {profile.phone}</p>
              </div>
            </Col>
          </Row>
        </div>
      )}
    </div>
  );
}
