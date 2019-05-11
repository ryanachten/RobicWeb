import * as React from "react";
import { BrowserRouter, Route, Link } from "react-router-dom";
import Header from "./components/Header";
import Index from "./pages/index";
import Test from "./pages/test";
import withRoot from "./withRoot";

const Router = () => (
  <BrowserRouter>
    <div>
      <Header />
      <Route path="/" exact component={Index} />
      <Route path="/test/" component={Test} />
    </div>
  </BrowserRouter>
);

//  Apply MUI theme to root component to make accessible to children
export default withRoot(Router);
