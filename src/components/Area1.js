import { Link } from "react-router-dom";
import { Form, Button, Spinner, ListGroup } from "react-bootstrap";
import { useFormik } from "formik";
import React, { useState } from "react";
import axios from "axios";
import { URL } from "../config";
import { useSelector, useDispatch } from "react-redux";
import { initAuth } from "../redux/actions";

export function Area1() {
  const [loading, setLoading] = useState(false);
  const [testData, setTestData] = useState([]);
  let dispatch = useDispatch();

  const auth = useSelector((state) => state.auth);

  const formik = useFormik({
    initialValues: {
      data: "",
    },
    onSubmit: (values) => {
      setLoading(true);
      setTestData();
      axios
        .post(`${URL}teachers/find`, { data: values.data.trim() })
        .then((res) => {
          if (res.data) {
            setLoading(false);
            setTestData(res.data);
          }
        })
        .catch((error) => {
          setLoading(false);
          console.error(error);
        });
    },
  });

  const userDetailsForm = useFormik({
    initialValues: {
      name: "",
      class: "",
    },
    onSubmit: (values) => {
      axios
        .post(`${URL}students/update`, {
          name: values.name.trim(),
          class: values.class,
          token: localStorage.getItem("token"),
          phone: auth.user.id,
        })
        .then((res) => {
          alert("User Details Updated");
          dispatch(initAuth({ ...auth.user, ...res.data.student }));
        })
        .catch((_error) => {});
    },
  });

  return (
    <div className="body-backgroud">
      <div className="home-upper">
        <div className="Area1">
          <div style={{ fontSize: 50, color: "wheat" }}>Find Teacher</div>
          <Form className="data-form" onSubmit={formik.handleSubmit}>
            <Form.Group
              controlId="formBasicName"
              style={{ width: "60%", margin: "auto", marginTop: "1%" }}
            >
              <Form.Control
                type="text"
                name="data"
                placeholder="Biology"
                onChange={formik.handleChange}
                value={formik.values.data}
                style={{
                  background: "linear-gradient(#112233, #002222)",
                  borderRadius: "1rem",
                  borderBlockColor: "wheat",
                  color: "white",
                }}
              />
            </Form.Group>
            <Button
              variant="primary"
              type="submit"
              style={{
                marginTop: "2%",
                color: "InfoText",
                backgroundColor: "wheat",
                borderRadius: "1rem",
              }}
            >
              Search by Subject or Teacher Name
            </Button>
          </Form>
        </div>
      </div>
      <br />
      <div>
        <div className="home-name-entry">
          {(!auth.user || !auth.user.name || !auth.user.class) && (
            <div>
              <Form
                className="data-form"
                onSubmit={userDetailsForm.handleSubmit}
              >
                <Form.Group
                  controlId="formBasicName"
                  style={{ width: "40%", margin: "auto", marginTop: "1%" }}
                >
                  <Form.Control
                    type="text"
                    name="name"
                    placeholder="Name"
                    onChange={userDetailsForm.handleChange}
                    value={userDetailsForm.values.data}
                    style={{
                      background: "linear-gradient(#112233, #002222)",
                      borderRadius: "1rem",
                      borderBlockColor: "wheat",
                      color: "white",
                    }}
                  />
                </Form.Group>
                <Form.Group
                  controlId="formBasicClass"
                  style={{ width: "40%", margin: "auto", marginTop: "1%" }}
                >
                  <Form.Control
                    type="number"
                    name="class"
                    placeholder="Class"
                    onChange={userDetailsForm.handleChange}
                    value={userDetailsForm.values.data}
                    style={{
                      background: "linear-gradient(#112233, #002222)",
                      borderRadius: "1rem",
                      borderBlockColor: "wheat",
                      color: "white",
                    }}
                  />
                </Form.Group>
                <Button
                  variant="primary"
                  type="submit"
                  style={{
                    marginTop: "2%",
                    color: "InfoText",
                    backgroundColor: "wheat",
                    borderRadius: "1rem",
                  }}
                >
                  Submit
                </Button>
              </Form>
            </div>
          )}
        </div>
      </div>
      <div
        className="data-api"
        style={{ textAlign: "center", fontSize: "large" }}
      >
        {loading && (
          <div>
            <Spinner animation="border" role="status">
              <span className="sr-only">Loading...</span>
            </Spinner>
            <p>(This typically requires around 2 seconds.)</p>
          </div>
        )}
        {testData && (
          <ListGroup
            style={{
              color: "black",
              background: "blue",
            }}
          >
            {testData.map((item, index) => (
              <ListGroup.Item key={index}>
                <strong>Name:</strong>{" "}
                <Link to={`/teachers/${item._id}`}>{item.name}</Link>
                <br />
                <strong>Subjects:</strong> {item.subjects.join(", ")}
                <br />
                <strong>Education:</strong>{" "}
                {item.degreeEnrolled
                  .concat(" in ")
                  .concat(item.subjectEnrolled)}
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </div>
    </div>
  );
}
