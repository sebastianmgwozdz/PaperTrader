import React, { useState, useEffect } from "react";
import { List } from "antd";
import { get } from "../Helpers";
import { withFirebase } from "../Firebase";

function TradeText(props) {
  const [text, setText] = useState(null);

  const { quantity, symbol, type, balance, price } = props;

  useEffect(() => {
    update();
  }, [quantity, symbol, type, price]);

  async function sharesOwned(long) {
    let shares = 0;

    await get(
      "http://localhost:8080/positions/id=" +
        props.firebase.auth.currentUser.uid +
        "/ticker=" +
        symbol +
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

  function close(numShares) {
    get(
      "http://localhost:8080/positions/id=" +
        props.firebase.auth.currentUser.uid +
        "/ticker=" +
        symbol +
        "/active"
    ).then((res) => {
      let closed = 0;
      let am = 0;
      for (let p of res) {
        let shares = p["remaining"];
        let remSell = quantity - closed;
        let sellAll = shares <= remSell;

        am +=
          (sellAll ? remSell : quantity) *
          (type === 1 ? price : p["price"] * 100 - price);
        closed += sellAll ? remSell : quantity;
      }
      setText([
        "Current Shares: " + numShares,
        "Remaining Shares: " + (numShares - quantity),
        "Current Balance: $" + balance / 100,
        "New Balance: $" + (balance + am) / 100,
      ]);
    });
  }

  async function update() {
    if (!symbol || quantity === 0) {
      setText(null);
      return;
    }

    switch (type) {
      case 0:
        setText([
          "Current Balance: $" + (balance / 100).toFixed(2),
          "New Balance: $" + ((balance - price * quantity) / 100).toFixed(2),
        ]);
        break;

      case 2:
        setText(["Total Value: $" + ((quantity * price) / 100).toFixed(2)]);
        break;
      default:
        sharesOwned(true).then((res) => {
          close(res);
        });
        break;
    }
  }

  if (!text) {
    return null;
  }

  return (
    <List
      size="small"
      bordered
      dataSource={text}
      renderItem={(item) => <List.Item>{item}</List.Item>}
      style={props.style}
    />
  );
}

export default withFirebase(TradeText);
