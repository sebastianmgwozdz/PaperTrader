import { Button } from "antd";
import { LoginOutlined } from "@ant-design/icons";
import React from "react";
import { withRouter } from "react-router-dom";

function AntButton(props) {
  return (
    <Button
      type="primary"
      shape="circle"
      icon={<LoginOutlined />}
      onClick={props.click}
      loading={props.loading}
    ></Button>
  );
}

export default withRouter(AntButton);
