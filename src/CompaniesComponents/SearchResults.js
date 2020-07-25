import React, { useState, useEffect } from "react";
import { get } from "../Helpers";
import { Card, Avatar, BackTop } from "antd";
import { EllipsisOutlined } from "@ant-design/icons";

import PriceCounter from "./PriceCounter";
import Header from "../PositionsComponents/Header";

const priceStyle = { fontSize: "30px" };

export default function SearchResults(props) {
  const [stocks] = useState([]);
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    get(
      "https://finnhub.io/api/v1/stock/symbol?exchange=US&token=bpleiinrh5r8m26im1dg"
    ).then((res) => {
      for (let stock of res) {
        let symbol = stock["displaySymbol"];

        if (symbol.indexOf(props.searchText) === 0) {
          stocks.push(symbol);
        }
      }

      nextCards();
    });
  }, []);

  function nextCards() {
    let next = [];
    for (
      let i = profiles.length;
      i < Math.min(stocks.length, profiles.length + 5);
      i++
    ) {
      next.push(
        get(
          "https://finnhub.io/api/v1/stock/profile2?symbol=" +
            stocks[i] +
            "&token=bpleiinrh5r8m26im1dg"
        )
      );
    }

    Promise.all(next).then((vals) => {
      setProfiles(profiles.concat(vals));
    });
  }

  function results() {
    if (!profiles) {
      return [];
    }
    let res = [];
    profiles.forEach((value, index) => {
      res.push(
        <a
          key={index}
          onClick={() => {
            props.setSelectedStock(stocks[index]);
          }}
        >
          <Card
            title={stocks[index] + (value["name"] ? " - " + value["name"] : "")}
            extra={
              value["logo"] ? (
                <Avatar
                  shape="square"
                  size={64}
                  icon={<img src={value["logo"]}></img>}
                />
              ) : null
            }
            hoverable
            style={{ width: "100%", marginBottom: "2vh" }}
          >
            <PriceCounter
              ticker={stocks[index]}
              style={priceStyle}
            ></PriceCounter>
          </Card>
        </a>
      );
    });

    return <div style={{ paddingLeft: "23vw", width: 900 }}>{res}</div>;
  }

  return (
    <div>
      <BackTop />
      <Header returnFunc={props.returnFunc}></Header>
      {results()}
      {profiles.length < stocks.length ? (
        <a
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "5vh",
            marginBottom: "5vh",
          }}
        >
          <Avatar size={64} icon={<EllipsisOutlined />} onClick={nextCards} />
        </a>
      ) : null}
    </div>
  );
}
