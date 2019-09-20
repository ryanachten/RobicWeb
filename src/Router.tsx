import * as React from "react";
import { ApolloProvider, graphql } from "react-apollo";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import Navigation from "./components/Navigation";
import Activity from "./pages/Activity";
import Exercise from "./pages/Exercise";
import Exercises from "./pages/Exercises";
import NewExercise from "./pages/NewExercise";
import Dashboard from "./pages/Dashboard";
import Landing from "./pages/Landing";
import Loading from "./pages/Loading";
import Login from "./pages/Login";
import Register from "./pages/Register";
import withRoot from "./withRoot";
import ApolloClient from "./ApolloClient";
import routes from "./constants/routes";
import { GetCurrentUser } from "./constants/queries";
import EditExercise from "./pages/EditExercise";

const AuthedRoutes = () => (
  <Switch>
    <Route path={routes.HOME.route} exact component={Dashboard} />
    <Route path={routes.EDIT_EXERCISE().route} component={EditExercise} />} />
    <Route path={routes.EXERCISES.route} exact component={Exercises} />
    <Route path={routes.NEW_EXERCISE.route} exact component={NewExercise} />
    <Route path={routes.EXERCISE().route} component={Exercise} />} />
    <Route path={routes.ACTIVITY.route} exact component={Activity} />
    <Redirect to={routes.HOME.route} />
  </Switch>
);

const UnauthedRoutes = () => (
  <Switch>
    <Route path={routes.LOGIN.route} exact component={Login} />
    <Route path={routes.REGISTER.route} exact component={Register} />
    <Route path={routes.LANDING.route} exact component={Landing} />
    <Redirect to={routes.LANDING.route} />
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
