import React from "react";
import { HashRouter, Route, Switch, Redirect } from "react-router-dom";

// components
import Layout from "./Layout";

// pages
import Error from "../pages/error";
import Login from "../pages/login";

import { useUserState } from "../context/UserContext";

export default function App() {
  var { isAuthenticated } = useUserState();

  return (
    <HashRouter>
      <Switch>
        <Route path="/login" component={Login} />
        {isAuthenticated &&
          <PrivateRoute path="/app" component={Layout} />
        }
        <Route exact path="/" render={() => <Redirect to="/login" />} />
        <Route component={Error} />
      </Switch>
    </HashRouter>
  );

  function PrivateRoute({ component, ...rest }) {
    return (
      <Route
        {...rest}
        render={props =>
          isAuthenticated ? (
            React.createElement(component, props)
          ) : (
            <Redirect
              to={{
                pathname: "/login",
                state: {
                  from: props.location,
                },
              }}
            />
          )
        }
      />
    );
  }

}
