import { Form, Button, Spinner, ListGroup } from "react-bootstrap";
import { useFormik } from "formik";
import React, { useState } from "react";
import axios from "axios";
import { URL } from "../config";

export function Area1() {
  const [loading, setLoading] = useState(false);
  const [testData, setTestData] = useState([]);

  const formik = useFormik({
    initialValues: {
      data: "",
    },
    onSubmit: (values) => {
      setLoading(true);
      setTestData();
      axios
        .post(`${URL}teachers/find`, { data: values.data })
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
              Search by subject
            </Button>
          </Form>
        </div>
      </div>
      <br />
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
                <strong>Name:</strong> {item.name}
                <br />
                <strong>Subjects:</strong> {item.subjects.join(", ")}
                <br />
                <strong>To Class:</strong> {item.toClass}
                <br />
                <strong>From Class:</strong> {item.fromClass}
                <br />
                <strong>Education:</strong> {item.education}
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </div>
    </div>
  );
}
