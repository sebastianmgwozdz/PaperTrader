import React, { useEffect, useState } from "react";
import { Card, Avatar } from "antd";

import { get } from "../Helpers";

const { Meta } = Card;

export default function CompanyNews(props) {
  const [news, setNews] = useState([]);

  useEffect(() => {
    let currDate = new Date().toISOString().substring(0, 10);
    let lastDate = new Date(Date.now() - 2592000000)
      .toISOString()
      .substring(0, 10);

    get(
      "https://finnhub.io/api/v1/company-news?symbol=" +
        props.ticker +
        "&from=" +
        lastDate +
        "&to=" +
        currDate +
        "&token=bpleiinrh5r8m26im1dg"
    ).then((res) => {
      setNews(res);
    });
  }, []);

  function newsCards() {
    let cards = [];

    let stop = Math.min(5, news.length);

    for (let i = 0; i < stop; i++) {
      let art = news[i];

      cards.push(
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={art["url"]}
          style={{
            display: "flex",
            justifyContent: "center",
            textAlign: "center",
            width: 800,
          }}
          key={i}
        >
          <Card
            style={{
              marginTop: 16,
              width: 800,
            }}
          >
            <Meta
              avatar={<Avatar src={art["image"]} shape="square" size={80} />}
              title={art["headline"]}
              description={new Date(Number(art["datetime"] + "000"))
                .toISOString()
                .substring(0, 10)}
              key={art["id"]}
            />
          </Card>
        </a>
      );
    }

    return cards;
  }

  return <div style={{ marginLeft: "10.5vw" }}>{newsCards()}</div>;
}
