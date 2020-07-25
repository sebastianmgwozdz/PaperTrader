import React from "react";
import { post, del } from "./Helpers";
import { withFirebase } from "./Firebase";
import { notification, Button } from "antd";
import { CheckCircleTwoTone } from "@ant-design/icons";

import { withRouter } from "react-router-dom";

const btnStyle = {
  width: "20vw",
  height: "6vh",
  fontSize: "22px",
  backgroundColor: "#f55936",
  borderColor: "#f55936",
};

function openNotification(placement) {
  notification.info({
    message: `Your account has been reset`,

    placement,
    icon: <CheckCircleTwoTone twoToneColor="#52c41a" />,
  });
}

function Account(props) {
  function signout() {
    props.firebase.auth.signOut().then(function () {
      props.history.replace("/home");
    });
  }

  function reset() {
    del(
      "http://localhost:8080/positions/id=" +
        props.firebase.auth.currentUser.uid
    );

    let data = {
      userId: props.firebase.auth.currentUser.uid,
      amount: 10000000,
    };
    post("http://localhost:8080/balances/", data);
    openNotification("topRight");
  }

  return (
    <div style={{ paddingTop: "20vh" }}>
      <div style={{ paddingLeft: "25vw", marginBottom: "10vh" }}>
        <Button type="primary" shape="round" onClick={reset} style={btnStyle}>
          Reset Account
        </Button>
      </div>
      <div style={{ paddingLeft: "25vw" }}>
        <Button type="primary" shape="round" onClick={signout} style={btnStyle}>
          Sign Out
        </Button>
      </div>
    </div>
  );
}

export default withRouter(withFirebase(Account));
