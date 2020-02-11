import React, { useState } from "react";
import * as firebase from "firebase/app";
import "firebase/analytics";
import "./App.scss";
import { ConfigProvider } from "antd";
import ErrorBoundary from "react-error-boundary";
import enUS from "antd/es/locale/en_US";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Layout from "./containers/Layout/Layout";
import axios from "axios";

const errorHandler = (error, componentStack) => {
  const analytics = firebase.analytics();
  analytics.logEvent("exception", {
    stack: componentStack,
    description: error,
    fatal: true,
  });
};

const FallbackComponent = ({ componentStack, error }) => (
  <div>
    <p>
      <strong>Oops! An error occured!</strong>
    </p>
    <p>Please contact customer service</p>
    <p>
      <strong>Error:</strong> {error.toString()}
    </p>
    <p>
      <strong>Stacktrace:</strong> {componentStack}
    </p>
  </div>
);

const App = () => {
  const { REACT_APP_ENDPOINT } = process.env;
  axios.defaults.baseURL = REACT_APP_ENDPOINT;
  axios.defaults.headers.post["Content-Type"] = "application/json";

  // Initialize Firebase
  if (!firebase.apps.length) {
    const {
      REACT_APP_FIREBASE_API_KEY,
      REACT_APP_FIREBASE_APP_ID,
      REACT_APP_FIREBASE_PROJ_ID,
      REACT_APP_FIREBASE_MSG_SENDER_ID,
      REACT_APP_FIREBASE_MEASUREMENT_ID,
    } = process.env;
    const firebaseConfig = {
      apiKey: REACT_APP_FIREBASE_API_KEY,
      authDomain: "",
      databaseURL: "",
      projectId: REACT_APP_FIREBASE_PROJ_ID,
      storageBucket: "",
      messagingSenderId: REACT_APP_FIREBASE_MSG_SENDER_ID,
      appId: REACT_APP_FIREBASE_APP_ID,
      measurementId: REACT_APP_FIREBASE_MEASUREMENT_ID,
    };
    firebase.initializeApp(firebaseConfig);
  }

  const [locale, setLocale] = useState(enUS); // locale hasn't been setup

  return (
    <ErrorBoundary onError={errorHandler} FallbackComponent={FallbackComponent}>
      <ConfigProvider locale={locale}>
        <Router>
          <Switch>
            <Route path="/" component={Layout} />
          </Switch>
        </Router>
      </ConfigProvider>
    </ErrorBoundary>
  );
};

export default App;
