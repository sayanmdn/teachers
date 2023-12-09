import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useFormik } from "formik";
import axios from "axios";
import { URL } from "../../config";
import { TEACHER_USER_ROLE } from "../../constants";

const transformArray = (subjects, selectedFromRange, selectedToRange) => {
  return subjects.map((subject, index) => ({
    subject: subject,
    selectedFromRange: parseInt(selectedFromRange[index]),
    selectedToRange: parseInt(selectedToRange[index]),
  }));
};

export function SignupForm(props) {
  const [emailAlreadyExists, setemailAlreadyExists] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [passwordValidationError, setPasswordValidationError] = useState(null);
  const [otpSentSuccessfully, setOtpSentSuccessfully] = useState(false);

  // Initialize form values with arrays for subjects, selectedFromRange, and selectedToRange
  const formik = useFormik({
    initialValues: {
      subjects: [""],
      selectedFromRange: [1],
      selectedToRange: [1],
    },
    onSubmit: (values) => {
      axios
        .post(`${URL}user/signup`, {
          name: values.name,
          role: TEACHER_USER_ROLE,
          otp: values.otp,
          password: values.password,
          phone: values.phone,
          college: values.college,
          subjectEnrolled: values.subjectEnrolled,
          degreeEnrolled: values.degreeEnrolled,
          subjects: transformArray(
            values.subjects.map((e) => e.trim()),
            values.selectedFromRange,
            values.selectedToRange
          ),
        })
        .then((res) => {
          if (res.data === "Email already exists") {
            setemailAlreadyExists(true);
          }

          if (res.data.code === "userCreated") {
            setSignupSuccess(true);
          }

          if (res.data.code === "validationFalse") {
            let msg = res.data.message;
            let result = msg.search("password");
            if (result) setPasswordValidationError(msg);
          }
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
        setOtpSentSuccessfully(false);
        alert(res.data.message || "Error: OTP not sent");
      }
    });
  };

  const addSubjectField = () => {
    formik.setFieldValue("subjects", [...formik.values.subjects, ""]);
    formik.setFieldValue("selectedFromRange", [
      ...formik.values.selectedFromRange,
      1,
    ]);
    formik.setFieldValue("selectedToRange", [
      ...formik.values.selectedToRange,
      1,
    ]);
  };

  const removeSubjectField = (index) => {
    const subjects = [...formik.values.subjects];
    if (subjects.length === 1) {
      return;
    }
    const selectedFromRange = [...formik.values.selectedFromRange];
    const selectedToRange = [...formik.values.selectedToRange];

    subjects.splice(index, 1);
    selectedFromRange.splice(index, 1);
    selectedToRange.splice(index, 1);

    formik.setFieldValue("subjects", subjects);
    formik.setFieldValue("selectedFromRange", selectedFromRange);
    formik.setFieldValue("selectedToRange", selectedToRange);
  };

  return (
    <div>
      {signupSuccess ? (
        <div>
          <h2>Signup Successful</h2>
          <h3>Please try to login</h3>
        </div>
      ) : (
        <Form className="login-form" onSubmit={formik.handleSubmit}>
          <Form.Group controlId="formBasicName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="name"
              name="name"
              placeholder="Enter Name"
              onChange={formik.handleChange}
              value={formik.values.name}
            />
          </Form.Group>
          <Form.Group controlId="formBasicPhone">
            <Form.Label>Phone Number</Form.Label>
            <Form.Control
              type="phone"
              placeholder="Enter Phone Number"
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
                Send OTP to the phone number
              </Button>
            </Form.Text>
          </Form.Group>
          <Form.Group controlId="formBasicOTP">
            <Form.Label>
              One-Time Password (OTP), which is sent to the respective phone
              number
            </Form.Label>
            <Form.Control
              type="otp"
              name="otp"
              placeholder="Enter OTP"
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

          <Form.Group controlId="formBasicCollege">
            <Form.Label>
              Name of the college where you pursuing / completed studing?
            </Form.Label>
            <Form.Control
              name="college"
              placeholder="Name of college"
              onChange={formik.handleChange}
              value={formik.values.college}
            />
          </Form.Group>

          <Form.Group controlId="formBasicSpecilization">
            <Form.Label>
              What subject are you pursuing / completed in college?
            </Form.Label>
            <Form.Control
              name="subjectEnrolled"
              placeholder="Subject you are enrolled in"
              onChange={formik.handleChange}
              value={formik.values.subjectEnrolled}
            />
          </Form.Group>

          <Form.Group controlId="formBasicDegree">
            <Form.Label>
              What degree are you pursuing / completed in college?
            </Form.Label>
            <Form.Control
              name="degreeEnrolled"
              placeholder="Degree you are enrolled in"
              onChange={formik.handleChange}
              value={formik.values.degreeEnrolled}
            />
          </Form.Group>
          <Form.Label>
            Please specify the subjects you would like to receive tuition
            requests for, indicating the class level as well.
          </Form.Label>
          {/* Subjects, selectedFromRange, and selectedToRange input fields */}
          {formik.values.subjects.map((subject, index) => (
            <div key={index}>
              <Form.Group controlId={`formBasicSubject${index}`}>
                <Form.Label>{`Subject ${index + 1}`}</Form.Label>
                <Form.Control
                  type="subject"
                  name={`subjects[${index}]`}
                  placeholder="Enter Subject"
                  onChange={formik.handleChange}
                  value={formik.values.subjects[index]}
                />
              </Form.Group>

              <Form.Group controlId={`formBasicRangeFrom${index}`}>
                <Form.Label>{`Teach from class ${index + 1}`}</Form.Label>
                <select
                  name={`selectedFromRange[${index}]`}
                  onChange={formik.handleChange}
                  value={formik.values.selectedFromRange[index]}
                  className="form-select"
                  style={{ marginLeft: "2%" }}
                >
                  {[...Array(12).keys()].map((num) => (
                    <option key={num + 1} value={num + 1}>
                      {num + 1}
                    </option>
                  ))}
                </select>
              </Form.Group>

              <Form.Group controlId={`formBasicRangeTo${index}`}>
                <Form.Label>{`Teach to class ${index + 1}`}</Form.Label>
                <select
                  name={`selectedToRange[${index}]`}
                  onChange={formik.handleChange}
                  value={formik.values.selectedToRange[index]}
                  className="form-select"
                  style={{ marginLeft: "2%" }}
                >
                  {[...Array(12).keys()].map((num) => (
                    <option key={num + 1} value={num + 1}>
                      {num + 1}
                    </option>
                  ))}
                </select>
              </Form.Group>
              {/* Remove button for each set of fields */}
              <Button
                variant="danger"
                onClick={() => removeSubjectField(index)}
              >
                Remove
              </Button>
            </div>
          ))}

          {/* Button to add more subject fields */}
          <Button variant="secondary" onClick={addSubjectField}>
            Add Subject
          </Button>

          {/* Submit button */}
          <Form.Group
            controlId="formSubmit"
            style={{ marginTop: "2vh", marginBottom: "2vh" }}
          >
            <Button variant="primary" type="submit">
              Register
            </Button>
          </Form.Group>
        </Form>
      )}
    </div>
  );
}
