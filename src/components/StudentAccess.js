import React from "react";
import { StudentAccessForm } from "./forms/StudentAccessForm";

export function StudentAccess(props) {
  return (
    <div
      style={{
        background: "linear-gradient(#112233, #002222)",
        color: "white",
        textAlign: "center",
      }}
    >
      <div style={{ paddingTop: "10vh" }}></div>
      <StudentAccessForm />
    </div>
  );
}
