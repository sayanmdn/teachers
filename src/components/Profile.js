import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { URL } from "../config";
import { Row, Col, Button } from "react-bootstrap";
import AOS from "aos";
import "aos/dist/aos.css";
import { useHistory } from "react-router-dom";
import { isNil } from "lodash";

export function Profile() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const history = useHistory();

  useEffect(() => {
    AOS.init();
    async function fetchProfile() {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.post(
          `${URL}teachers/findById`,
          {
            id,
          },
          { headers: { Authorization: token }, retry: 3 }
        );
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
          <br></br>
          <strong>Teaches from class:</strong> {subject.fromClass}
          <br></br>
          <strong>Teaches up to class:</strong> {subject.toClass}
          <br></br>
        </p>
      </div>
    ));
  };

  const redirectToStudentAccss = () => {
    // Redirect to StudentAccss
    history.push("/student-access");
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
                <div style={{ marginBottom: "1rem" }}>
                  <h3>Education:</h3>
                  <p>
                    <strong>College:</strong> {profile.college}
                    <br></br>
                    <strong>Degree:</strong> {profile.degreeEnrolled}
                    <br></br>
                    <strong>Subject:</strong> {profile.subjectEnrolled}
                  </p>
                </div>
                <h3>Subjects:</h3>
                {renderSubjects(profile.subjectClasses)}
              </div>
            </Col>
            <Col sm={6}>
              <div className="home-main-right">
                <h3>Contact Information</h3>
                <p>
                  <strong>Phone:</strong>{" "}
                  {!isNil(profile.phone) ? (
                    <a href={`tel:${profile.phone}`}>{profile.phone}</a>
                  ) : !isNil(profile.numberOfvisitedProfiles) &&
                    profile.numberOfvisitedProfiles >= 5 ? (
                    <div>
                      <b>Limit Exceeded</b>
                      <br></br>
                      Sorry, the limit has been exceeded. Student are allowed to
                      have a maximum of 5 contacts per day. Please try again
                      after 24 hours.
                    </div>
                  ) : (
                    <div>
                      <p>
                        Please click here to get student access to view the
                        phone number.
                      </p>
                      <Button onClick={redirectToStudentAccss}>
                        Student Access
                      </Button>
                    </div>
                  )}
                </p>
              </div>
            </Col>
          </Row>
        </div>
      )}
    </div>
  );
}
