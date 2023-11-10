import React from "react";
import { Form, Button } from "react-bootstrap";
import { useFormik } from "formik";

export function Area1() {
  const formik = useFormik({
    initialValues: {
      data: "",
    },
    onSubmit: (values) => {
      console.log("form has been submitted with data: ", values.data);
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
      {/* <div className="home-projects">
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
      </div> */}
    </div>
  );
}
