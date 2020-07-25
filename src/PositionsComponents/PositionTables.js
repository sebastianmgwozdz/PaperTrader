import React, { useState } from "react";
import ActivePositions from "./ActivePositions";
import ClosedPositions from "./ClosedPositions";
import { Divider } from "antd";

export default function PositionTables(props) {
  const [tick, setTick] = useState(0);

  function incrementTick() {
    setTick(tick + 1);
  }

  return (
    <div>
      <Divider>Active Positions</Divider>
      <ActivePositions
        ticker={props.ticker}
        style={props.style}
        incrementTick={incrementTick}
      ></ActivePositions>
      <Divider>Closed Positions</Divider>
      <ClosedPositions
        ticker={props.ticker}
        style={props.style}
        tick={tick}
      ></ClosedPositions>
    </div>
  );
}
