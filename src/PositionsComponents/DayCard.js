import React, { useState, useEffect } from "react";
import Graph from "./Graph";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

export default function DayCard(props) {
  const [data, setData] = useState(undefined);

  useEffect(() => {
    setData(props.data);
  }, [props.data]);

  function firstDataPoint() {
    let keys = Object.keys(data);
    for (let i = 0; i < keys.length - 1; i++) {
      let date = keys[i].substring(0, 10);
      let next = keys[i + 1].substring(0, 10);
      if (
        date !== next ||
        keys[i].substring(11, keys[i].length) === "09:30:00"
      ) {
        return i;
      }
    }

    return keys.length - 1;
  }

  function prevClose() {
    let keys = Object.keys(data);

    if (keys.length <= 1) {
      return 0;
    }

    for (let i = 1; i < keys.length; i++) {
      let k = keys[i];
      let date = k.substring(0, 10);
      let prev = keys[i - 1].substring(0, 10);
      if (date !== prev) {
        return Object.values(data[k])[3];
      }
    }

    return props.reference;
  }

  function formattedData() {
    if (Object.keys(data).length === 0) {
      return [];
    }
    let vals = Object.values(data);
    let form = vals
      .map((v, index) => {
        return { val: Object.values(v)[0], x: index };
      })
      .slice(0, firstDataPoint() + 1)
      .reverse();

    return [...form, { val: Object.values(vals[0])[3] }];
  }

  return (
    <div
      style={{
        width: "100%",
        height: props.height + 30,

        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        display: "flex",
      }}
    >
      {data ? (
        <div>
          <Graph
            data={formattedData()}
            reference={prevClose()}
            width={props.width}
            height={props.height}
            ticker={props.ticker}
            hide={props.hide}
          ></Graph>
          {props.name ? props.name : null}
        </div>
      ) : (
        <Spin
          indicator={
            <LoadingOutlined style={{ fontSize: 40 }} spin></LoadingOutlined>
          }
        ></Spin>
      )}
    </div>
  );
}
