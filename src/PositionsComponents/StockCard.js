import React, { useEffect, useState } from "react";
import { get, isOpen } from "../Helpers";
import Graph from "./Graph";
import { Typography } from "antd";
import { withFirebase } from "../Firebase";
import CoverCard from "./CoverCard";
import Loading from "./Loading";

const { Text } = Typography;
const BLACK = "#000000";
const GRAY = "#787777";
const GREEN = "#24e361";
const RED = "#f55936";

function StockCard(props) {
  const [quote, setQuote] = useState(null);
  const { ticker, positions, clickFunc, data } = props;

  function updateQuote() {
    get(
      "https://finnhub.io/api/v1/quote?symbol=" +
        ticker +
        "&token=bpleiinrh5r8m26im1dg"
    ).then((res) => {
      if (res) {
        res["pc"] = res["pc"] * 100;
        res["c"] = res["c"] * 100;
        res["t"] = Number(res["t"] + "000");
        setQuote(res);
      }
    });
  }

  useEffect(() => {
    updateQuote();
  }, []);

  useEffect(() => {
    let curr = Date.now();
    let past = curr - 1000 * 60;

    if (isOpen(new Date(curr)) && !isOpen(new Date(past))) {
      updateQuote();
    }
  }, [positions]);

  function isToday(date) {
    const today = new Date();
    const d = new Date(date);

    return (
      d.getUTCDate() === today.getUTCDate() &&
      d.getUTCMonth() === today.getUTCMonth() &&
      d.getUTCFullYear() === today.getUTCFullYear()
    );
  }

  function currPrice() {
    let curr;

    if (data) {
      if (data["t"] > quote["t"]) {
        curr = data["p"] * 100;
      } else {
        curr = quote["c"];
      }
    } else {
      curr = quote["c"];
    }

    return curr;
  }

  function calcDiff(type) {
    let diff = 0;

    if (!quote) {
      return diff;
    }

    for (let pos of positions) {
      let d = pos["remaining"];
      let sinceClose = nextOpen(new Date(pos["openDate"])) > Date.now();

      let sinceOpen =
        isToday(pos["openDate"]) && isOpen(new Date(pos["openDate"]));
      let currPr = currPrice();

      if (sinceClose) {
        d = 0;
      } else if (type === "net" || sinceOpen) {
        d *= currPr - pos["price"];
      } else {
        d *= currPr - quote["pc"];
      }

      if (pos["isLong"]) {
        diff += d;
      } else {
        diff -= d;
      }
    }

    return diff;
  }

  function nextOpen(date) {
    if (date.getUTCHours() > 19) {
      date.setUTCDate(date.getUTCDate() + 1);
    }
    if (date.getUTCDay() === 6) {
      date.setUTCDate(date.getUTCDate() + 1);
    }
    if (date.getUTCDay() === 0) {
      date.setUTCDate(date.getUTCDate() + 1);
    }
    date.setUTCHours(13);
    date.setUTCMinutes(30);

    date.setUTCSeconds(0);
    return date;
  }

  function percentDiff(old, updated) {
    if (isNaN(updated) || isNaN(old)) {
      return 0;
    }
    return ((updated - old) / old) * 100;
  }

  function initialInvestment() {
    let val = 0;

    for (let pos of positions) {
      val += pos["initial"] * pos["price"];
    }

    return val;
  }

  function color(val) {
    if (Math.abs(val) < 0.005) {
      return GRAY;
    } else if (val > 0) {
      return GREEN;
    } else {
      return RED;
    }
  }

  function text(dayChange, netChange) {
    if (!quote) {
      return null;
    }

    let initial = initialInvestment();

    let dayPercent =
      Math.abs(dayChange) < 0.005
        ? 0
        : percentDiff(initial, dayChange + initial);

    let netPercent =
      Math.abs(netChange) < 0.005
        ? 0
        : percentDiff(initial, netChange + initial);

    let dayColor = color(dayChange);
    let netColor = color(netChange);

    return (
      <div>
        <Text style={{ color: BLACK, fontSize: "20px" }}>{ticker}</Text>
        <br />

        <Text style={{ color: BLACK }}>Day Change: </Text>
        <Text
          style={{
            color: dayColor,
          }}
        >
          ${(dayChange / 100).toFixed(2)} ({dayPercent.toFixed(2)}%)
        </Text>
        <br />
        <Text style={{ color: BLACK }}>Net Change: </Text>
        <Text
          style={{
            color: netColor,
          }}
        >
          ${(netChange / 100).toFixed(2)} ({netPercent.toFixed(2)}%)
        </Text>
      </div>
    );
  }

  let dayChange = calcDiff("day");
  let netChange = calcDiff("net");

  return (
    <div
      style={{ margin: "3vh" }}
      onClick={() => {
        clickFunc(ticker);
      }}
    >
      <CoverCard
        cover={
          quote ? (
            <Graph
              dataPoint={dayChange}
              positions={positions}
              reference={0}
              ticker={ticker}
              hide
            ></Graph>
          ) : (
            <Loading></Loading>
          )
        }
        metaList={text(dayChange, netChange)}
      ></CoverCard>
    </div>
  );
}

export default withFirebase(StockCard);
