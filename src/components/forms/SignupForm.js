import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useFormik } from "formik";
import axios from "axios";
import { URL } from "../../config";
import { TEACHER_USER_ROLE } from "../../constants";

export function SignupForm(props) {
  var [emailAlreadyExists, setemailAlreadyExists] = useState(false);
  var [signupSuccess, setSignupSuccess] = useState(false);
  var [passwordValidationError, setPasswordValidationError] = useState(null);
  const [otpSentSuccessfully, setOtpSentSuccessfully] = useState(false);

  // Pass the useFormik() hook initial form values and a submit function that will
  // be called when the form is submitted
  const formik = useFormik({
    initialValues: {},
    onSubmit: (values) => {
      axios
        .post(`${URL}user/signup`, { ...values, role: TEACHER_USER_ROLE })
        .then((res) => {
          if (res.data === "Email already exists") {
            setemailAlreadyExists(true);
          }

          //USERCREATED SUCCESS
          if (res.data.code === "userCreated") {
            setSignupSuccess(true);
            // alert("signup success")
          }

          //validationFalse
          if (res.data.code === "validationFalse") {
            // setValidationError(res.data.message)
            let msg = res.data.message;
            let result = msg.search("password");
            if (result) setPasswordValidationError(msg);
          }
          // console.log(res);
          // console.log(res.data);
        })
        .catch((error) => {
          console.log(error);
        });
    },
  });
  const sendOTP = () => {
    let { phone } = formik.values;
    axios.post(`${URL}user/otpsend`, { phone, role: "TEACHER" }).then((res) => {
      if (res.data.code === "otpSent") {
        setOtpSentSuccessfully(true);
        alert("OTP Sent Successfully to your phone");
      }
      if (res.data.code === "validationFalse") {
        setOtpSentSuccessfully(true);
        alert(res.data.message || "Error: OTP not sent");
      }
    });
  };
  if (signupSuccess)
    return (
      <div>
        <h2>Signup Successful</h2>
        <h3>Please try to login</h3>
      </div>
    );
  else
    return (
      <div>
        <Form className="login-form" onSubmit={formik.handleSubmit}>
          <Form.Group controlId="formBasicName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="name"
              name="name"
              placeholder="Enter name"
              onChange={formik.handleChange}
              value={formik.values.name}
            />
          </Form.Group>
          <Form.Group controlId="formBasicPhone">
            <Form.Label>Phone Number</Form.Label>
            <Form.Control
              type="phone"
              placeholder="Enter phone number"
              name="phone"
              readOnly={otpSentSuccessfully}
              onChange={formik.handleChange}
              value={formik.values.phone}
            />
            <Form.Text className="text-muted" hidden={!emailAlreadyExists}>
              This phone number is already exists, try with another number
            </Form.Text>
            <Form.Text className="text-muted">
              <Button onClick={sendOTP} hidden={otpSentSuccessfully}>
                Send OTP to phone number
              </Button>
            </Form.Text>
          </Form.Group>
          <Form.Group controlId="formBasicOTP">
            <Form.Label>OTP (That is sent to the phone number)</Form.Label>
            <Form.Control
              type="otp"
              name="otp"
              placeholder="Enter otp"
              onChange={formik.handleChange}
              value={formik.values.otp}
            />
          </Form.Group>

          <Form.Group controlId="formBasicPassword">
            <Form.Label>Password (To be set for the account)</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              name="password"
              onChange={formik.handleChange}
              value={formik.values.password}
            />
            <Form.Text className="text-muted" hidden={!passwordValidationError}>
              Error: {passwordValidationError}
            </Form.Text>
          </Form.Group>

          <Form.Group controlId="formBasicSubject">
            <Form.Label>Primary Subjects (Mathematics,Physics,etc)</Form.Label>
            <Form.Control
              type="subject"
              name="subject"
              placeholder="Enter Subject"
              onChange={formik.handleChange}
              value={formik.values.subject}
            />
          </Form.Group>

          <Form.Group controlId="formBasicRange">
            <Form.Label>Teach from class </Form.Label>
            {/* Use a standard HTML select element */}
            <select
              name="selectedFromRange"
              onChange={formik.handleChange}
              value={formik.values.selectedFromRange}
              className="form-select" // Add any necessary styling class
              style={{ marginLeft: "2%" }}
            >
              {/* Generate options for numbers 1 to 12 */}
              {[...Array(12).keys()].map((num) => (
                <option key={num + 1} value={num + 1}>
                  {num + 1}
                </option>
              ))}
            </select>
          </Form.Group>

          <Form.Group controlId="formBasicRange">
            <Form.Label>Teach to class </Form.Label>
            {/* Use a standard HTML select element */}
            <select
              name="selectedToRange"
              onChange={formik.handleChange}
              value={formik.values.selectedToRange}
              className="form-select" // Add any necessary styling class
              style={{ marginLeft: "2%" }}
            >
              {/* Generate options for numbers 1 to 12 */}
              {[...Array(12).keys()].map((num) => (
                <option key={num + 1} value={num + 1}>
                  {num + 1}
                </option>
              ))}
            </select>
          </Form.Group>

          <Button variant="primary" type="submit">
            Signup
          </Button>
        </Form>
      </div>
    );
}
