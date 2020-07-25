import React from "react";
import { Input } from "antd";
import { get } from "../Helpers";
import { withFirebase } from "../Firebase";

function AntInput(props) {
  async function sharesOwned(long) {
    let shares = 0;

    await get(
      "http://localhost:8080/positions/id=" +
        props.firebase.auth.currentUser.uid +
        "/ticker=" +
        props.ticker +
        "/active"
    ).then((res) => {
      for (let pos of res) {
        if (pos["isLong"] === long) {
          shares += pos["remaining"];
        }
      }
    });

    return shares;
  }

  function onChange(data) {
    let input = Number(data.target.value);
    if (isNaN(input)) {
      return;
    }
    switch (props.type) {
      case 0:
        if (props.balance - props.price * input >= 0) {
          props.setVal(input);
        }
        break;
      case 1:
        sharesOwned(true).then((res) => {
          if (res >= input) {
            props.setVal(input);
          }
        });

        break;
      case 2:
        props.setVal(input);
        break;
      default:
        sharesOwned(false).then((res) => {
          if (res >= input) {
            props.setVal(input);
          }
        });
        break;
    }
  }

  return (
    <Input
      onChange={(data) => {
        onChange(data);
      }}
      value={props.quantity}
      style={props.style}
      allowClear
    />
  );
}

export default withFirebase(AntInput);
