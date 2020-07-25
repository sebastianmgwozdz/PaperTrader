import React, { useState, useEffect } from "react";
import { Modal, Button } from "antd";
import Autocomplete from "./Autocomplete";
import AntRadio from "./AntRadio";
import AntInput from "./AntInput";
import { get, close, post } from "../Helpers";
import { withFirebase } from "../Firebase";
import TradeText from "./TradeText";

const style = { marginTop: "2vh", marginBottom: "1vh" };
const radioStyle = {
  marginTop: "2vh",
  marginBottom: "1vh",
  display: "flex",
  justifyContent: "center",
  textAlign: "center",
};

function BuyModal(props) {
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [type, setType] = useState(0);
  const [symbol, setSymbol] = useState(props.symbol);
  const [quantity, setQuantity] = useState(0);
  const [price, setPrice] = useState(props.price);

  function onOk() {
    setConfirmLoading(true);
    makeTrade().then(reset);
  }

  useEffect(() => {
    if (props.price) {
      setPrice(props.price);
    } else if (symbol) {
      get(
        "https://finnhub.io/api/v1/quote?symbol=" +
          symbol +
          "&token=bpleiinrh5r8m26im1dg"
      ).then((res) => {
        if (res) {
          setPrice(res["c"] * 100);
        }
      });
    } else {
      setPrice("");
    }
  }, [symbol, props.price]);

  function reset() {
    props.setVisible(false);
    setConfirmLoading(false);
    setType(0);
    if (!props.symbol) {
      setSymbol("");
    }
    if (!props.price) {
      setPrice("");
    }
    setQuantity(0);
  }

  async function activePositions() {
    let pos;
    await get(
      "http://localhost:8080/positions/id=" +
        props.firebase.auth.currentUser.uid +
        "/ticker=" +
        symbol +
        "/active"
    ).then((res) => {
      pos = res;
    });

    return pos;
  }

  function incrementBalance(val) {
    let b = {
      userId: props.firebase.auth.currentUser.uid,
      amount: props.balance + val,
    };

    post("http://localhost:8080/balances/", b).then(() => {
      props.setBalance(b.amount);
    });
  }

  async function makeTrade() {
    if (type === 1 || type === 3) {
      let mult = type === 1 ? 1 : -1;
      activePositions().then((res) => {
        res.sort((a, b) => {
          return mult * (a["price"] - b["price"]);
        });
        let trade = {
          user: props.firebase.auth.currentUser.uid,
          type: type,
          price: price,
          shareCount: quantity,
          positions: res,
        };
        close(trade, incrementBalance);
      });
    } else {
      let long = type !== 2;

      let position = {
        ticker: symbol,
        price: price,
        initial: quantity,
        remaining: quantity,
        userId: props.firebase.auth.currentUser.uid,
        isLong: long,
        openDate: new Date(),
      };

      post("http://localhost:8080/positions/", position);
      if (long) {
        incrementBalance(-1 * quantity * price);
      }
    }
  }

  return (
    <Modal
      title="Make a Trade"
      visible={props.visible}
      destroyOnClose
      footer={[
        <Button key="back" onClick={reset}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={confirmLoading}
          onClick={onOk}
          disabled={!symbol || !quantity}
        >
          Confirm
        </Button>,
      ]}
      closable={false}
    >
      <div
        style={{
          height: "2vh",
          fontSize: "24px",
          marginBottom: "5vh",
          textAlign: "center",
        }}
      >
        {price ? (price / 100).toFixed(2) : ""}
      </div>
      <div style={style}>
        {props.symbol ? null : (
          <Autocomplete
            setSymbol={setSymbol}
            setQuantity={setQuantity}
            width="100%"
          ></Autocomplete>
        )}
      </div>

      <AntInput
        setVal={setQuantity}
        balance={props.balance}
        price={price}
        quantity={quantity}
        type={type}
        ticker={symbol}
        style={style}
      ></AntInput>
      <AntRadio
        labels={["Buy", "Sell", "Short", "Cover Short"]}
        setVal={(val) => {
          if (val !== type) {
            setQuantity(0);
          }
          setType(val);
        }}
        style={radioStyle}
      ></AntRadio>
      <TradeText
        symbol={symbol}
        quantity={quantity}
        price={price}
        balance={props.balance}
        type={type}
        style={style}
      ></TradeText>
    </Modal>
  );
}

export default withFirebase(BuyModal);
