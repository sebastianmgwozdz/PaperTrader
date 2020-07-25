import React from "react";
import { Radio } from "antd";

export default function AntRadio(props) {
  function getButtons() {
    let buttons = [];
    for (let i = 0; i < props.labels.length; i++) {
      buttons.push(
        <Radio.Button value={i} key={i}>
          {props.labels[i]}
        </Radio.Button>
      );
    }
    return buttons;
  }

  return (
    <Radio.Group
      defaultValue={0}
      buttonStyle="solid"
      onChange={(e) => {
        props.setVal(e.target.value);
      }}
      style={props.style}
    >
      {getButtons()}
    </Radio.Group>
  );
}
