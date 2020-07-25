import React, { useState } from "react";
import { withFirebase } from "../Firebase";
import Landing from "./Landing";
import Authentication from "./Authentication";

function Home() {
  const [view, setView] = useState(0);

  const views = [
    <Landing setView={setView}></Landing>,
    <Authentication
      login
      setView={() => {
        setView(2);
      }}
    ></Authentication>,
    <Authentication
      login={false}
      setView={() => {
        setView(1);
      }}
    ></Authentication>,
  ];

  return views[view];
}

export default withFirebase(Home);
