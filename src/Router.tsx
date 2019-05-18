import * as React from "react";
import { ApolloProvider } from "react-apollo";
import { BrowserRouter, Route, Link, Switch, Redirect } from "react-router-dom";
import Header from "./components/Header";
import Index from "./pages/index";
import Login from "./pages/login";
import Test from "./pages/test";
import withRoot from "./withRoot";
import ApolloClient from "./ApolloClient";

const AuthedRoutes = () => (
  <div>
    <Header />
    <Switch>
      <Route path="/" exact component={Index} />
      <Route path="/history/" exact component={Test} />
      <Route path="/exercises/" exact component={Test} />
      <Route path="/exercises/new/" exact component={Test} />
      <Redirect to="/" />
    </Switch>
  </div>
);

const UnauthedRoutes = () => (
  <Switch>
    <Route path="/login/" exact component={Login} />
    <Redirect to="/login/" />
  </Switch>
);

const authed = window.localStorage.getItem("token");
const Router = () => (
  <ApolloProvider client={ApolloClient}>
    <BrowserRouter>
      {authed ? <AuthedRoutes /> : <UnauthedRoutes />}
    </BrowserRouter>
  </ApolloProvider>
);

//  Apply MUI theme to root component to make accessible to children
export default withRoot(Router);
