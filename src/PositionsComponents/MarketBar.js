import React from "react";
import DayCard from "./DayCard";

export default function MarketBar(props) {
  return (
    <div
      style={{
        display: "flex",
        borderBottom: "1px solid rgb(235, 237, 240)",
        width: "83vw",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <DayCard
        name="NASDAQ"
        ticker="QQQ"
        data={props.marketData["QQQ"]}
        width={300}
        height={105}
        hide
      ></DayCard>
      <DayCard
        name="DJIA"
        ticker="DIA"
        data={props.marketData["DIA"]}
        width={300}
        height={105}
        hide
      ></DayCard>
      <DayCard
        name="S&P 500"
        ticker="SPY"
        data={props.marketData["SPY"]}
        width={300}
        height={105}
        hide
      ></DayCard>
    </div>
  );
}
