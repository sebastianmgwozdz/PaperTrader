import React from "react";
import { Input } from "antd";

export default function InputField(props) {
  const { type } = props;

  function handleChange(e) {
    props.changeFunc(e.target.value);
  }

  return (
    <div>
      {type === "user" ? (
        <Input
          placeholder="Enter Username"
          onChange={handleChange}
          style={props.style}
        ></Input>
      ) : (
        <Input.Password
          placeholder="Enter Password"
          onChange={handleChange}
          style={props.style}
        ></Input.Password>
      )}
    </div>
  );
}
