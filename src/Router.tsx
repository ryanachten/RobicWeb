import * as React from "react";
import { ApolloProvider } from "react-apollo";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Stub from "./pages/Stub";
import withRoot from "./withRoot";
import ApolloClient from "./ApolloClient";

const AuthedRoutes = () => (
  <div>
    <Header />
    <Switch>
      <Route path="/" exact component={Dashboard} />
      <Route path="/history/" exact component={Stub} />
      <Route path="/exercises/" exact component={Stub} />
      <Route path="/exercises/new/" exact component={Stub} />
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
