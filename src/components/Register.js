import React from "react";
import { SignupForm } from "./forms/SignupForm";

export function Register(props) {
  return (
    <div
      style={{
        background: "linear-gradient(#112233, #002222)",
        color: "white",
        textAlign: "center",
      }}
    >
      <div style={{ paddingTop: "10vh" }}></div>
      <SignupForm />
    </div>
  );
}
