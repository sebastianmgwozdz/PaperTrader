import React, { useState, useEffect } from "react";
import { YAxis, ReferenceLine, Area, AreaChart } from "recharts";
import { isOpen } from "../Helpers";

const GRAY = "#787777";
const GREEN = "#24e361";
const RED = "#f55936";

export default function Graph(props) {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (!isNaN(props.dataPoint) && isOpen(new Date())) {
      setData([
        ...data,
        {
          val: props.dataPoint,
          x: data.length,
        },
      ]);
    } else if (props.data) {
      setData(props.data);
    }
  }, [props.data, props.dataPoint, props.positions]);

  function minMax() {
    let arr = data.map((dp) => {
      return dp.val;
    });
    let incl = [...arr, props.reference];
    let min = Math.min.apply(Math, incl);
    let max = Math.max.apply(Math, incl);

    let diff = Math.abs(max - min);

    return [min - diff / 4, max + diff / 4];
  }

  function ticks(domain) {
    let t = [];
    let diff = domain[1] - domain[0];
    let gap = Math.round(diff / 3);

    for (let i = Math.floor(domain[0]); i <= Math.ceil(domain[1]); i += gap) {
      t.push(Math.round(i));
    }
    return t;
  }

  if (data.length <= 1) {
    return null;
  }

  console.log(data);

  let color;
  let diff = data[data.length - 1]["val"] - props.reference;

  if (Math.abs(diff) < 0.005) {
    color = GRAY;
  } else {
    color = diff > 0 ? GREEN : RED;
  }

  let domain = minMax();

  return props.reference ? (
    <AreaChart
      width={props.width ? props.width : 350}
      height={props.height ? props.height : 155}
      data={data}
      margin={{ top: 15, left: 25, right: 25, bottom: 10 }}
    >
      <defs>
        <linearGradient id={"color" + props.ticker} x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor={color} stopOpacity={0.4} />
          <stop offset="95%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <YAxis
        type="number"
        domain={[domain[0] - 1, domain[1] + 1]}
        ticks={ticks(domain)}
        hide={props.hide}
      ></YAxis>

      <ReferenceLine y={props.reference} strokeDasharray="3 3" />

      <Area
        type="monotone"
        dataKey="val"
        stroke={color}
        dot={false}
        isAnimationActive={false}
        strokeWidth={props.strokeWidth}
        fillOpacity={1}
        fill={"url(#color" + props.ticker + ")"}
      />
    </AreaChart>
  ) : (
    <AreaChart
      width={props.width ? props.width : 350}
      height={props.height ? props.height : 155}
      data={data}
      margin={{ top: 15, left: 25, right: 25, bottom: 10 }}
    >
      <defs>
        <linearGradient id={"color" + props.ticker} x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor={color} stopOpacity={0.4} />
          <stop offset="95%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>

      <Area
        type="monotone"
        dataKey="val"
        stroke={color}
        dot={false}
        isAnimationActive={false}
        strokeWidth={props.strokeWidth}
        fillOpacity={1}
        fill={"url(#color" + props.ticker + ")"}
      />
    </AreaChart>
  );
}
