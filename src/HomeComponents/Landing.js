import React from "react";
import { RiseOutlined } from "@ant-design/icons";

import { Button } from "antd";

const buttonStyle = {
  width: "12vw",
  height: "8vh",
  fontSize: "18px",
  backgroundColor: "#f55936",
  borderColor: "#f55936",
  marginRight: "3vh",
  marginLeft: "3vh",
};

export default function Landing(props) {
  return (
    <div>
      <div
        style={{
          textAlign: "center",
          backgroundColor: "rgba(116, 232, 49, 0.5)",
          width: "100vw",
          height: "70vh",
          borderBottom: "3px solid",
        }}
      >
        <RiseOutlined
          style={{ fontSize: "23vh", paddingTop: "24vh" }}
        ></RiseOutlined>
      </div>{" "}
      <div
        style={{
          justifyContent: "center",
          textAlign: "center",
          backgroundColor: "rgba(81, 114, 232, 0.5)",
          height: "30vh",
          paddingTop: "10vh",
        }}
      >
        <span>
          <Button
            style={buttonStyle}
            type="primary"
            shape="round"
            onClick={() => {
              props.setView(1);
            }}
          >
            Login
          </Button>
          <Button
            style={buttonStyle}
            type="primary"
            shape="round"
            onClick={() => {
              props.setView(2);
            }}
          >
            Register
          </Button>
        </span>
      </div>
    </div>
  );
}
