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

const firebaseConfig = {
  apiKey: "AIzaSyDhdp-yh5TH6QsS4hWSjh6OSQxQ88bLRwY",
  authDomain: "",
  databaseURL: "",
  projectId: "ezpay-prod",
  storageBucket: "",
  messagingSenderId: "687841048917",
  appId: "1:687841048917:web:edcacb2afdf0ee5ce997dc",
  measurementId: "G-FTXSLEEXVV",
};

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
  firebase.initializeApp(firebaseConfig);

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
