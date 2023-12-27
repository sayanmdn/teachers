import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useFormik } from "formik";
import axios from "axios";
import { URL } from "../../config";
import { STUDENT_USER_ROLE } from "../../constants";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { initAuth } from "../../redux/actions";

export function StudentAccessForm(_props) {
  const [otpSentSuccessfully, setOtpSentSuccessfully] = useState(false);
  let history = useHistory();
  let dispatch = useDispatch();

  // Initialize form values with arrays for subjects, selectedFromRange, and selectedToRange
  const formik = useFormik({
    initialValues: {
      phone: "",
      otp: "",
    },
    onSubmit: (values) => {
      axios
        .post(`${URL}students/access`, {
          otp: values.otp,
          phone: values.phone,
        })
        .then((res) => {
          if (res.data.code === "SUCCESS") {
            localStorage.setItem("token", res.data.token);
            dispatch(
              initAuth({ ...res.data.student, role: STUDENT_USER_ROLE })
            );
            history.push("/");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
  });

  const sendOTP = () => {
    let { phone } = formik.values;
    axios
      .post(`${URL}user/otpsend`, { phone, role: STUDENT_USER_ROLE })
      .then((res) => {
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

  return (
    <div>
      <Form className="login-form" onSubmit={formik.handleSubmit}>
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
            type="number"
            name="otp"
            placeholder="Enter OTP"
            onChange={formik.handleChange}
            value={formik.values.otp}
          />
        </Form.Group>

        {/* Submit button */}
        <Form.Group
          controlId="formSubmit"
          style={{ marginTop: "2vh", marginBottom: "2vh" }}
        >
          <Button variant="primary" type="submit">
            Get Access
          </Button>
        </Form.Group>
      </Form>
    </div>
  );
}
