import React, { useEffect, useState } from "react";
import { List } from "antd";
import { get } from "../Helpers";

const liStyle = {
  width: "15vw",
  display: "inline-block",
  textAlign: "left",
};

export default function AboutCompany(props) {
  const [values, setValues] = useState({
    quote: undefined,
    mktCap: undefined,
    pe: undefined,
    lowHigh: undefined,
  });

  async function lowHigh() {
    let data = [];
    await get(
      "https://finnhub.io/api/v1/stock/metric?symbol=" +
        props.ticker +
        "&metric=price&token=bpleiinrh5r8m26im1dg"
    ).then((res) => {
      data.push("52 Week High: " + res["metric"]["52WeekHigh"].toFixed(2));
      data.push("52 Week Low: " + res["metric"]["52WeekLow"].toFixed(2));
    });
    return data;
  }

  async function quote() {
    let data = [];
    await get(
      "https://finnhub.io/api/v1/quote?symbol=" +
        props.ticker +
        "&token=bpleiinrh5r8m26im1dg"
    ).then((res) => {
      data.push("Open: " + res["o"].toFixed(2));
      data.push("High: " + res["h"].toFixed(2));
      data.push("Low: " + res["l"].toFixed(2));
      data.push("Previous Close: " + res["pc"].toFixed(2));
    });

    return data;
  }

  async function mktCap() {
    let m;
    await get(
      "https://finnhub.io/api/v1/stock/profile2?symbol=" +
        props.ticker +
        "&token=bpleiinrh5r8m26im1dg"
    ).then((res) => {
      if (res["marketCapitalization"]) {
        m = "Market Cap: " + formattedMktCap(res["marketCapitalization"]);
      }
    });

    return m;
  }

  function formattedMktCap(val) {
    let num = Number(val);

    if (num >= 1000000) {
      return (num / 1000000).toFixed(2) + "T";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(2) + "B";
    } else {
      return num.toFixed(2) + "M";
    }
  }

  async function pe() {
    let p;

    let currDate = new Date().toISOString().substring(0, 10);
    let lastDate =
      Number(currDate.substring(0, 4)) - 1 + currDate.substring(4, 10);
    let newDate =
      Number(currDate.substring(0, 4)) + 1 + currDate.substring(4, 10);

    await get(
      "https://finnhub.io/api/v1/calendar/earnings?from=" +
        lastDate +
        "&to=" +
        newDate +
        "&symbol=" +
        props.ticker +
        "&token=bpleiinrh5r8m26im1dg"
    ).then((res) => {
      let eps = 0;

      if (res["earningsCalendar"]) {
        for (let i = 0; i < 4; i++) {
          let actual = res["earningsCalendar"][i]["epsActual"];
          if (actual) {
            eps += actual;
          } else {
            eps += res["earningsCalendar"][i]["epsEstimate"];
          }
        }
        p = props.price["c"] / eps;
      }
    });

    return "P/E Ratio: " + p.toFixed(2);
  }

  useEffect(() => {
    let vals = [quote(), mktCap(), pe(), lowHigh()];
    Promise.all(vals).then((res) => {
      setValues({
        quote: res[0],
        mktCap: res[1],
        pe: res[2],
        lowHigh: res[3],
      });
    });
  }, []);

  function data() {
    let arr = [];

    for (let i of Object.values(values)) {
      if (Array.isArray(i)) {
        for (let el of i) {
          arr.push(listItem(el));
        }
      } else {
        arr.push(listItem(i));
      }
    }
    return arr;
  }

  function listItem(str) {
    if (!str) {
      return "";
    }

    let colon = str.indexOf(":");

    let label = str.substring(0, colon + 1);
    let value = str.substring(colon + 2, str.length);

    return (
      <div>
        <span style={liStyle}>{label}</span>
        {value}
      </div>
    );
  }

  let d = data();

  return (
    <span style={{ display: "flex", justifyContent: "center" }}>
      <List
        size="large"
        bordered
        dataSource={d.slice(0, 4)}
        renderItem={(item) => <List.Item>{item}</List.Item>}
        style={{ width: "45vh", marginBottom: "10vh" }}
      />
      <List
        size="large"
        bordered
        dataSource={d.slice(4, 8)}
        renderItem={(item) => <List.Item>{item}</List.Item>}
        style={{ width: "45vh", marginBottom: "10vh" }}
      />
    </span>
  );
}
