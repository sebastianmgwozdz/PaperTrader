import React, { useState, useEffect } from "react";
import { get } from "../Helpers";
import "./PriceCounter.css";
import { Skeleton } from "antd";
import { isOpen } from "../Helpers";

export default function PriceCounter(props) {
  const [currPrice] = useState([-1]);
  const [tick, setTick] = useState(0);

  function update() {
    get(
      "https://finnhub.io/api/v1/quote?symbol=" +
        props.ticker +
        "&token=bpleiinrh5r8m26im1dg"
    ).then((res) => {
      if (res) {
        let col = color(res);
        let pr = document.getElementById("price");
        if (pr && col) {
          pr.classList.add(col);
          currPrice[0] = res;
          setTick((tick) => tick + 1);
          setTimeout(() => {
            pr.classList.remove(col);
          }, 2000);
        } else {
          currPrice[0] = res;
          setTick((tick) => tick + 1);
        }
        if (props.setPrice) {
          props.setPrice(res);
        }
      }
    });
  }

  function color(updated) {
    if (
      currPrice.length < 1 ||
      Math.abs(updated["c"] - currPrice[0]["c"]) < 0.01
    ) {
      return "";
    } else if (updated["c"] > currPrice[0]["c"]) {
      return "flashGreen";
    } else {
      return "flashRed";
    }
  }

  useEffect(() => {
    update();
    let t = setInterval(() => {
      if (isOpen(new Date())) {
        update();
      }
    }, 5000);
    return () => {
      clearInterval(t);
    };
  }, []);

  let pr = document.getElementById("price");
  if (pr && tick === 1 && pr.classList.length === 1) {
    pr.classList.remove(pr.classList.value);
  }

  let element = currPrice[0]["c"] ? (
    currPrice[0]["c"].toFixed(2)
  ) : (
    <Skeleton.Input
      style={{ width: "270px", height: "60px" }}
      active={true}
      size={"default"}
    />
  );

  return (
    <div style={props.style} id="price">
      {element}
    </div>
  );
}
