import React from "react";
import { PageHeader } from "antd";

export default function Header(props) {
  return (
    <PageHeader
      style={{ border: "1px solid rgb(235, 237, 240)", width: "83vw" }}
      onBack={() => props.returnFunc("")}
      title={"Back"}
    />
  );
}
