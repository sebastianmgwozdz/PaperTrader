import axios from "axios";

const https = require("https");

const agent = new https.Agent({
  rejectUnauthorized: false,
});

export async function get(url) {
  let res;

  await axios
    .get(url, { httpsAgent: agent })
    .then(function (response) {
      res = response.data;
    })
    .catch(function (error) {
      console.log(error);
    });

  return res;
}

export function del(url) {
  axios.delete(url, { httpsAgent: agent }).catch(function (error) {
    console.log(error);
  });
}

export async function post(url, data) {
  axios.post(url, data, { httpsAgent: agent }).catch(function (error) {
    console.log(error);
  });
}

export function isOpen(date) {
  let currDay = date.getUTCDay();
  let currHour = date.getUTCHours();
  let currMin = date.getUTCMinutes();

  return !(
    currDay === 0 ||
    currDay === 6 ||
    currHour < 13 ||
    currHour >= 20 ||
    (currHour === 13 && currMin < 30)
  );
}

export async function close(trade, incrementState) {
  // trade = {user: ..., type: ..., price: ..., shareCount: ..., ticker: ..., positions: ... }
  let type = trade["type"];
  let price = trade["price"];
  let shareCount = trade["shareCount"];
  let positions = trade["positions"];

  let closed = 0;
  let am = 0;
  for (let p of positions) {
    if ((type === 1 && p["isLong"]) || (type === 3 && !p["isLong"])) {
      let shares = p["remaining"];
      let remSell = shareCount - closed;
      let sellAll = shares <= remSell;

      am +=
        (sellAll ? remSell : shareCount) *
        (type === 1 ? price : p["price"] - price);
      closed += sellAll ? remSell : shareCount;
      p["remaining"] = sellAll ? 0 : shares - shareCount;
      let date = new Date();

      p["closeDate"] = sellAll ? date : null;

      await post("http://localhost:8080/positions/", p);
    }
  }

  if (incrementState) {
    incrementState(am);
  }
}
