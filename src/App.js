import React, { Component, useState, useEffect } from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import { BTProvider } from "./helpers/btContext";
// import { renderRoutes } from 'react-router-config';
import "./App.scss";
import {
  onReadBatteryLevelButtonClick,
  onStartNotificationsButtonClick
} from "./helpers/bt";

const loading = () => (
  <div className="animated fadeIn pt-3 text-center">Loading...</div>
);

// Containers
const DefaultLayout = React.lazy(() => import("./containers/DefaultLayout"));

// Pages
const Login = React.lazy(() => import("./views/Pages/Login"));
const Register = React.lazy(() => import("./views/Pages/Register"));
const Page404 = React.lazy(() => import("./views/Pages/Page404"));
const Page500 = React.lazy(() => import("./views/Pages/Page500"));
const PrivateRoute = ({ component: Component, authed, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props =>
        authed === true ? (
          <Component {...props} authed={authed} />
        ) : (
          <Redirect
            to={{ pathname: "/login", state: { from: props.location } }}
          />
        )
      }
    />
  );
};

const PublicRoute = ({ component: Component, authed, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props =>
        authed === false ? (
          <Component {...props} />
        ) : (
          <Redirect to="/dashboard" />
        )
      }
    />
  );
};
const App = () => {
  const [authed, setAuthed] = useState(false);
  const [battery, setBattery] = useState(50);
  const user = { name: "Tania", loggedIn: true };

  const handleBatteryLevelChanged = event => {
    let batteryLevel = event.target.value.getUint8(0);
    console.warn("> Battery Level is " + batteryLevel + "%");
    setBattery(batteryLevel);
  };
  const onLogin = () => {
    onReadBatteryLevelButtonClick(handleBatteryLevelChanged).then(value => {
      console.log({ value });
      onStartNotificationsButtonClick();
      setAuthed(true);
    });
  };

  return (
    <BTProvider value={{ battery }}>
      <BrowserRouter>
        <Switch>
          <PublicRoute
            authed={authed}
            path="/login"
            name="Login Page"
            component={props => (
              <Login
                {...{ ...props, onReadBatteryLevelButtonClick: onLogin }}
              />
            )}
          />
          <PublicRoute
            authed
            path="/register"
            name="Register Page"
            component={props => <Register {...props} />}
          />
          <PrivateRoute
            authed={authed}
            exact
            path="/404"
            name="Page 404"
            component={props => <Page404 {...props} />}
          />
          <PrivateRoute
            authed={authed}
            exact
            path="/500"
            name="Page 500"
            component={props => <Page500 {...props} />}
          />
          <PrivateRoute
            authed={authed}
            path="/"
            name="Home"
            component={props => <DefaultLayout {...props} />}
          />
        </Switch>
      </BrowserRouter>
    </BTProvider>
  );
};

export default props => (
  <React.Suspense fallback={loading()}>
    <App {...props} />
  </React.Suspense>
);
