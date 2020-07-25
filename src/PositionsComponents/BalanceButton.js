import React, { useState, useEffect } from "react";
import { Button } from "antd";
import BuyModal from "./BuyModal";
import { get, post } from "../Helpers";
import { withFirebase } from "../Firebase";

function BalanceButton(props) {
  const [visible, setVisible] = useState(false);
  const [balance, setBalance] = useState(-1);

  useEffect(() => {
    currBalance();

    let interval = setInterval(currBalance, 10000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  function currBalance() {
    get(
      "http://localhost:8080/balances/" + props.firebase.auth.currentUser.uid
    ).then((res) => {
      if (res) {
        setBalance(res["amount"]);
      } else {
        setBalance(10000000);
        let data = {
          userId: props.firebase.auth.currentUser.uid,
          amount: 10000000,
        };
        post("http://localhost:8080/balances", data);
      }
    });
  }

  function showModal() {
    setVisible(true);
  }

  if (balance === -1) {
    return null;
  }

  return (
    <div>
      <Button
        type="primary"
        shape={props.shape}
        style={props.style}
        onClick={showModal}
      >
        {props.text ? props.text : "$" + (balance / 100).toFixed(2)}
      </Button>
      <BuyModal
        visible={visible}
        setVisible={setVisible}
        balance={balance}
        setBalance={setBalance}
        symbol={props.symbol}
      ></BuyModal>
    </div>
  );
}

export default withFirebase(BalanceButton);
