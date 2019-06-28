import * as React from "react";
import { ApolloProvider, graphql } from "react-apollo";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import Navigation from "./components/Navigation";
import Exercise from "./pages/Exercise";
import Exercises from "./pages/Exercises";
import NewExercise from "./pages/NewExercise";
import Dashboard from "./pages/Dashboard";
import Loading from "./pages/Loading";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Stub from "./pages/Stub";
import withRoot from "./withRoot";
import ApolloClient from "./ApolloClient";
import routes from "./constants/routes";
import { GetCurrentUser } from "./constants/queries";
import EditExercise from "./pages/EditExercise";

const AuthedRoutes = () => (
  <Navigation>
    <Switch>
      <Route path={routes.HOME.route} exact component={Dashboard} />
      <Route path={routes.EDIT_EXERCISE().route} component={EditExercise} />} />
      <Route path={routes.EXERCISES.route} exact component={Exercises} />
      <Route path={routes.NEW_EXERCISE.route} exact component={NewExercise} />
      <Route path={routes.EXERCISE().route} component={Exercise} />} />
      <Redirect to={routes.HOME.route} />
    </Switch>
  </Navigation>
);

const UnauthedRoutes = () => (
  <Switch>
    <Route path={routes.LOGIN.route} exact component={Login} />
    <Route path={routes.REGISTER.route} exact component={Register} />
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
