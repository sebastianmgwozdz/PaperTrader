import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { withRouter } from "react-router-dom";
import Home from "./HomeComponents/Home";
import "./App.css";
import { withFirebase } from "./Firebase";
import Main from "./Main";

function App(props) {
  if (
    window.location.href !== "http://localhost:3000/home" &&
    !props.firebase.auth.currentUser
  ) {
    props.history.replace("/home");
  }

  return (
    <Router>
      <Route exact path="/home" component={Home} />
      <Route exact path="/dashboard" component={Main} />
    </Router>
  );
}

export default withRouter(withFirebase(App));
