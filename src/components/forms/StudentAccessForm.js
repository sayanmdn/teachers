import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useFormik } from "formik";
import axios from "axios";
import { URL } from "../../config";
import {
  SEND_OTP_API_ENDPOINT,
  STUDENT_USER_ROLE,
  INPUT_FILD_STYLE,
  BUTTON_STYLE,
} from "../../constants";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { initAuth } from "../../redux/actions";
import { isEmpty, isNumber } from "lodash";

export function StudentAccessForm(_props) {
  const [otpSentSuccessfully, setOtpSentSuccessfully] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [phone, setPhone] = useState("");

  const history = useHistory();
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  // Initialize form values with arrays for subjects, selectedFromRange, and selectedToRange
  const formik = useFormik({
    initialValues: {
      phone: "",
      otp: "",
    },
    onSubmit: (values) => {
      axios
        .post(
          `${URL}students/access`,
          {
            otp: values.otp.toString(),
            phone: values.phone,
          },
          { retry: 3 }
        )
        .then((res) => {
          if (res.data.code === "SUCCESS") {
            localStorage.setItem("token", res.data.token);
            setOtpVerified(true);
            setPhone(values.phone);
            dispatch(
              initAuth({ ...res.data.student, role: STUDENT_USER_ROLE })
            );

            // Redirect to home page if user details are already filled
            if (
              !(
                isEmpty(res.data.student.name) ||
                !isNumber(res.data.student.class)
              )
            ) {
              history.push("/");
            }
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
      .post(
        `${SEND_OTP_API_ENDPOINT}user/otpsend`,
        {
          phone,
          role: STUDENT_USER_ROLE,
        },
        { retry: 3 }
      )
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

  const userDetailsForm = useFormik({
    initialValues: {
      name: "",
      class: "",
    },
    onSubmit: (values) => {
      axios
        .post(
          `${URL}students/update`,
          {
            name: values.name.trim(),
            class: values.class,
            token: localStorage.getItem("token"),
            phone: phone,
          },
          { retry: 3 }
        )
        .then((res) => {
          if (res.data.code === "validationFalse") {
            alert(res.data.message || "Unable to Update User Details");
          } else {
            alert("User Details Updated");
            dispatch(initAuth({ ...auth.user, ...res.data.student }));
            history.push("/");
          }
        })
        .catch((error) => {
          alert(error);
        });
    },
  });

  if (otpVerified) {
    return (
      <div>
        <div style={{ fontSize: 50, color: "wheat" }}>User Details</div>
        <Form className="data-form" onSubmit={userDetailsForm.handleSubmit}>
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
              style={INPUT_FILD_STYLE}
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
              style={INPUT_FILD_STYLE}
            />
          </Form.Group>
          <Button variant="primary" type="submit" style={BUTTON_STYLE}>
            Submit
          </Button>
        </Form>
      </div>
    );
  } else {
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
              style={INPUT_FILD_STYLE}
              value={formik.values.phone}
            />

            <Form.Text className="text-muted">
              <Button
                onClick={sendOTP}
                hidden={otpSentSuccessfully}
                style={BUTTON_STYLE}
              >
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
              style={INPUT_FILD_STYLE}
              value={formik.values.otp}
            />
          </Form.Group>

          {/* Submit button */}
          <Form.Group
            controlId="formSubmit"
            style={{ marginTop: "2vh", marginBottom: "2vh" }}
          >
            <Button variant="primary" type="submit" style={BUTTON_STYLE}>
              Get Access
            </Button>
          </Form.Group>
        </Form>
      </div>
    );
  }
}
