import React, { useEffect, useState } from "react";
import { Table, Tag } from "antd";
import { get, post, close } from "../Helpers";
import { withFirebase } from "../Firebase";

const columns = [
  {
    title: "Date",
    dataIndex: "date",
    key: "date",
  },
  {
    title: "Price",
    dataIndex: "price",
    key: "price",
  },
  {
    title: "Initial",
    dataIndex: "initial",
    key: "initial",
  },
  {
    title: "Remaining",
    dataIndex: "remaining",
    key: "remaining",
  },
  {
    title: "Type",
    key: "type",
    dataIndex: "tags",
    render: (tags) => (
      <span>
        {tags.map((tag) => {
          let color = tag === "Buy" ? "green" : "red";

          return (
            <Tag color={color} key={tag}>
              {tag.toUpperCase()}
            </Tag>
          );
        })}
      </span>
    ),
  },
  {
    title: "",
    key: "action",
    dataIndex: "action",
    render: (param) => (
      <span>
        <a onClick={param.func}>{param.text}</a>
      </span>
    ),
  },
];

function localTime(utc) {
  let local = utc.valueOf();
  let offset = utc.getTimezoneOffset() * 60 * 1000;
  local -= offset;
  return new Date(local);
}

function formattedDate(date) {
  return date.getMonth() + 1 + "-" + date.getDate() + "-" + date.getFullYear();
}

function ActivePositions(props) {
  const [data, setData] = useState([]);

  useEffect(() => {
    get(
      "http://localhost:8080/positions/id=" +
        props.firebase.auth.currentUser.uid +
        "/ticker=" +
        props.ticker +
        "/active"
    ).then((res) => {
      setData(res);
    });
  }, []);

  function formattedData() {
    return data
      .map((entry, index) => {
        let date = localTime(new Date(entry["openDate"]));

        return {
          key: index,
          date: formattedDate(date),
          price: (entry["price"] / 100).toFixed(2),
          initial: entry["initial"],
          remaining: entry["remaining"],
          tags: [entry["isLong"] ? "Buy" : "Short"],
          long: entry["isLong"],
          action: {
            text: entry["isLong"] ? "Sell All" : "Cover All",
            func: () => {
              action(index);
            },
          },
        };
      })
      .reverse();
  }

  function incrementBalance(amt) {
    get(
      "http://localhost:8080/balances/" + props.firebase.auth.currentUser.uid
    ).then((bal) => {
      let b = {
        userId: props.firebase.auth.currentUser.uid,
        amount: bal["amount"] + amt,
      };

      post("http://localhost:8080/balances/", b);
    });
  }

  function action(id) {
    let pos = data[id];
    get(
      "https://finnhub.io/api/v1/quote?symbol=" +
        props.ticker +
        "&token=bpleiinrh5r8m26im1dg"
    ).then((curr) => {
      let trade = {
        user: props.firebase.auth.currentUser.uid,
        type: pos.isLong ? 1 : 3,
        price: curr["c"] * 100,
        shareCount: pos.remaining,
        ticker: props.ticker,
        positions: [pos],
      };

      close(trade, incrementBalance).then(() => {
        let arr = data.slice(0, id).concat(data.slice(id + 1));
        setData(arr);
        props.incrementTick();
      });
    });
  }

  return (
    <Table columns={columns} dataSource={formattedData()} style={props.style} />
  );
}

export default withFirebase(ActivePositions);
