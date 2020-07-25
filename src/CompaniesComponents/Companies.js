import React, { useState } from "react";
import Autocomplete from "../PositionsComponents/Autocomplete";
import SearchResults from "./SearchResults";

export default function Companies(props) {
  const [symbol, setSymbol] = useState("");

  if (symbol) {
    return (
      <SearchResults
        setSelectedStock={props.setSelectedStock}
        searchText={symbol.toUpperCase()}
        returnFunc={setSymbol}
      ></SearchResults>
    );
  }

  return (
    <div
      style={{
        paddingTop: "40vh",
        paddingLeft: "23vw",
      }}
    >
      <Autocomplete setSymbol={setSymbol} search width={500}></Autocomplete>
    </div>
  );
}
