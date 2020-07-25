import React, { useState, useEffect } from "react";
import { get } from "./Helpers";
import Positions from "./PositionsComponents/Positions";
import Account from "./Account";
import Companies from "./CompaniesComponents/Companies";
import EarningsCalendar from "./CalendarComponents/EarningsCalendar";
import PositionSummary from "./PositionsComponents/PositionSummary";

export default function Window(props) {
  const [marketData, setMarketData] = useState([]);
  const [selectedStock, setSelectedStock] = useState("");

  useEffect(() => {
    function update() {
      let q = getData("QQQ");
      let d = getData("DIA");
      let s = getData("SPY");

      Promise.all([q, d, s]).then((values) => {
        setMarketData({
          QQQ: Object.values(values[0])[1],
          DIA: Object.values(values[1])[1],
          SPY: Object.values(values[2])[1],
        });
      });
    }

    update();

    let timer = setInterval(update, 300000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    setSelectedStock("");
  }, [props.menuOption]);

  async function getData(symbol) {
    return await get(
      "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=" +
        symbol +
        "&interval=5min&outputsize=full&apikey=MZVTEZTGKT653IH3"
    );
  }

  if (selectedStock) {
    return (
      <PositionSummary
        returnFunc={setSelectedStock}
        ticker={selectedStock}
      ></PositionSummary>
    );
  }

  let views = [
    <Positions
      marketData={marketData}
      setSelectedStock={setSelectedStock}
    ></Positions>,
    <Companies setSelectedStock={setSelectedStock}></Companies>,
    <EarningsCalendar setSelectedStock={setSelectedStock}></EarningsCalendar>,
    <Account></Account>,
    <div>view5</div>,
  ];

  return views[props.menuOption];
}
