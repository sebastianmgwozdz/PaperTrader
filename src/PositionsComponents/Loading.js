import React from "react";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

export default function Loading() {
  const antIcon = (
    <LoadingOutlined style={{ fontSize: 60, top: "13vh" }} spin />
  );
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Spin indicator={antIcon} />
    </div>
  );
}
