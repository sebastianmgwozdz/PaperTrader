import React, { useState, useEffect } from "react";
import { get } from "../Helpers";
import StockCard from "./StockCard";
import { withFirebase } from "../Firebase";
import { message } from "antd";

function CardGrid(props) {
  const [positions, setPositions] = useState(new Map());
  const [prices] = useState(new Map());

  function update() {
    let p = new Map();
    let n = [];

    get(
      "http://localhost:8080/positions/id=" +
        props.firebase.auth.currentUser.uid +
        "/active"
    ).then((res) => {
      if (res) {
        for (let pos of res) {
          let ticker = pos["ticker"];
          if (p.has(ticker)) {
            p.get(ticker).push(pos);
          } else {
            p.set(ticker, [pos]);
            n.push(ticker);
          }
        }
      } else {
        message.error("Error connecting to server. Attempting to reconnect.");
      }

      setPositions(p);
    });

    const socket = new WebSocket(
      "wss://ws.finnhub.io?token=bpleiinrh5r8m26im1dg"
    );

    let dataFunc = (event) => {
      let data = JSON.parse(event.data).data;

      if (data) {
        prices.set(data[0]["s"], data[0]);
      }
    };

    addConnections(socket, n);

    socket.onmessage = dataFunc;
  }

  function addConnections(socket, n) {
    socket.onopen = () =>
      n.forEach((val) => {
        socket.send(JSON.stringify({ type: "subscribe", symbol: val }));
      });
  }

  useEffect(() => {
    update();
    let t = setInterval(() => {
      update();
    }, 3000);

    return () => {
      clearInterval(t);
    };
  }, []);

  function getCards() {
    let cards = [];

    positions.forEach((val, key, map) => {
      cards.push(
        <StockCard
          ticker={key}
          positions={val}
          key={key}
          clickFunc={props.clickFunc}
          data={prices.get(key)}
        ></StockCard>
      );
    });

    return cards;
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "0.35fr 0.35fr 0.35fr",
      }}
    >
      {getCards()}
    </div>
  );
}

export default withFirebase(CardGrid);
