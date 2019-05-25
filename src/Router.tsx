import * as React from "react";
import { ApolloProvider, graphql } from "react-apollo";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Stub from "./pages/Stub";
import withRoot from "./withRoot";
import ApolloClient from "./ApolloClient";
import routes from "./constants/routes";
import { GetCurrentUser } from "./constants/queries";
import Loading from "./pages/Loading";

const AuthedRoutes = () => (
  <div>
    <Header />
    <Switch>
      <Route path={routes.HOME.route} exact component={Dashboard} />
      <Route path={routes.HISTORY.route} exact component={Stub} />
      <Route path={routes.EXERCISES.route} exact component={Stub} />
      <Route path={routes.NEW_EXERCISE.route} exact component={Stub} />
      <Redirect to={routes.HOME.route} />
    </Switch>
  </div>
);

const UnauthedRoutes = () => (
  <Switch>
    <Route path={routes.LOGIN.route} exact component={Login} />
    <Redirect to={routes.LOGIN.route} />
  </Switch>
);

const Routes = graphql<any>(GetCurrentUser)(props => {
  const {
    data: { loading, currentUser }
  } = props;
  if (loading) {
    return <Loading />;
  }
  return <Switch>{currentUser ? <AuthedRoutes /> : <UnauthedRoutes />}</Switch>;
});

const Router = () => {
  return (
    <ApolloProvider client={ApolloClient}>
      <BrowserRouter>
        <Routes />
      </BrowserRouter>
    </ApolloProvider>
  );
};

//  Apply MUI theme to root component to make accessible to children
export default withRoot(Router);
