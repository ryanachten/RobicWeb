import * as React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Header from "./components/Header";
import Index from "./pages/index";
import Test from "./pages/test";

export default () => (
  <Router>
    <div>
      <Header />
      <Route path="/" exact component={Index} />
      <Route path="/test/" component={Test} />
    </div>
  </Router>
);
