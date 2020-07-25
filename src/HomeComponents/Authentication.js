import React from "react";
import ValidationField from "./ValidationField";
import { Button } from "antd";
import { withFirebase } from "../Firebase";

function Authentication(props) {
  return (
    <div
      style={{
        paddingTop: "35vh",
        backgroundColor: "rgba(116, 232, 49, 0.5)",
        height: "100vh",
      }}
    >
      <div
        style={{ textAlign: "center", marginBottom: "6vh", fontSize: "32px" }}
      >
        {props.login ? "Login" : "Register"}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "4vh",
        }}
      >
        <ValidationField
          submit={props.firebase.doSignInWithEmailAndPassword}
          errorMessage={
            props.login
              ? "Username and/or password are incorrect. Try again."
              : "Make sure email is formatted correctly and password contains at least 6 characters"
          }
          login={props.login}
        ></ValidationField>
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Button type="link" onClick={props.setView}>
          {props.login
            ? "Don't have an account? Click here to create an account"
            : "Already have an account? Click here to sign in"}
        </Button>
      </div>
    </div>
  );
}

export default withFirebase(Authentication);
