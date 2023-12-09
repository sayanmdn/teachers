import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { URL } from "../config";
import { Row, Col } from "react-bootstrap";
import AOS from "aos";
import "aos/dist/aos.css";

export function Profile() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    AOS.init();
    async function fetchProfile() {
      try {
        const response = await axios.post(`${URL}teachers/findById`, { id });
        setProfile(response.data);
        return response;
      } catch (e) {
        console.log(e);
      }
    }

    fetchProfile();
  }, [id]);

  const renderSubjects = (subjects) => {
    return subjects.map((subject, index) => (
      <div key={index}>
        <p>
          <strong>Subject:</strong> {subject.subject}
        </p>
        <p>
          <strong>Teaches from class:</strong> {subject.fromClass}
        </p>
        <p>
          <strong>Teaches up to class:</strong> {subject.toClass}
        </p>
      </div>
    ));
  };

  return (
    <div className="body-backgroud">
      <div className="profile-upper" data-aos="fade-up">
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
                <h5 style={{ marginBottom: "1rem" }}>
                  Education: {profile.education}
                </h5>
                <h3>Subjects:</h3>
                {renderSubjects(profile.subjectClasses)}
              </div>
            </Col>
            <Col sm={6}>
              <div className="home-main-right">
                <h3>Contact Information</h3>
                <p>
                  <strong>Phone:</strong>{" "}
                  <a href={`tel:${profile.phone}`}>{profile.phone}</a>
                </p>
              </div>
            </Col>
          </Row>
        </div>
      )}
    </div>
  );
}
