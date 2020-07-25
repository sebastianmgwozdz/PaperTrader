import React from "react";
import { Card } from "antd";

export default function CoverCard(props) {
  return (
    <Card
      hoverable
      style={{
        width: "24vw",
        height: "35vh",
        borderColor: "#949494"
      }}
      cover={props.cover ? props.cover : null}
      loading={props.loading}
      onClick={props.onClick}
    >
      {props.metaList}
    </Card>
  );
}
