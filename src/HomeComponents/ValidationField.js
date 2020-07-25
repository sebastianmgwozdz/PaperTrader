import React, { useState, useEffect } from "react";
import AntButton from "./AntButton";
import { withFirebase } from "../Firebase";
import InputField from "./InputField";
import { withRouter } from "react-router-dom";
import { Alert } from "antd";

const inputStyle = { width: "20vw", marginBottom: "2vh", borderRadius: "25px" };

function ValidationField(props) {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setError(false);
  }, [props.login]);

  useEffect(() => {
    const listener = (event) => {
      if (event.code === "Enter") {
        handleSubmit();
      }
    };
    document.addEventListener("keydown", listener);
    return () => {
      document.removeEventListener("keydown", listener);
    };
  }, [user, pass]);

  function handleSubmit() {
    setLoading(true);
    props
      .submit(user, pass)
      .then((res) => {
        props.history.replace("/dashboard");
      })
      .catch((err) => {
        setError(true);
        setLoading(false);
      });
  }

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ float: "left", marginLeft: "4vw" }}>
        <InputField
          type="user"
          changeFunc={(us) => {
            setError(false);
            setUser(us);
          }}
          style={inputStyle}
        ></InputField>
        <InputField
          type="pass"
          changeFunc={(us) => {
            setError(false);
            setPass(us);
          }}
          style={inputStyle}
        ></InputField>
      </div>
      <div style={{ paddingTop: "2vh", float: "left", paddingLeft: "2vw" }}>
        <AntButton click={handleSubmit} loading={loading}></AntButton>
      </div>

      {error ? (
        <Alert
          message={props.errorMessage}
          type="error"
          showIcon
          style={{ marginTop: "13vh", width: "25vw", marginLeft: "1.5vw" }}
        />
      ) : null}
    </div>
  );
}

export default withRouter(withFirebase(ValidationField));
