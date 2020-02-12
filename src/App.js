import React, { useState, useEffect } from "react";
import * as firebase from "firebase/app";
import "firebase/analytics";
import "./App.scss";
import { ConfigProvider } from "antd";
import ErrorBoundary from "react-error-boundary";
import enUS from "antd/es/locale/en_US";
import viVN from "antd/es/locale/vi_VN";
import thTH from "antd/es/locale/th_TH";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Layout from "./containers/Layout/Layout";
import axios from "axios";
import { IntlProvider } from "react-intl";
import locale_en from './translations/locale/en.json';
import locale_vi from './translations/locale/vi.json';
import locale_th from './translations/locale/th.json';

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

const App = (props) => {
  const { REACT_APP_ENDPOINT } = process.env;
  axios.defaults.baseURL = REACT_APP_ENDPOINT;
  axios.defaults.headers.post["Content-Type"] = "application/json";

  // Initialize Firebase
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }

  const [locale, setLocale] = useState('en');
  const [localeAntd, setLocaleAntd] = useState({});
  const localeMessages = {
    'en': locale_en,
    'vi': locale_vi,
    'th': locale_th
  };

  function handleSelectLanguage (param) {
    switch (param) {
      case 'vi-vn':
        setLocale('vi');
        setLocaleAntd(viVN);
        break;
      case 'th-th':
        setLocale('th');
        setLocaleAntd(thTH);
        break;
      default:
        setLocale('en');
        setLocaleAntd(enUS);
    }
  }

  useEffect(() => {
    const url = new URL(window.location.href);
    const urlParams = new URLSearchParams(url.search);

    handleSelectLanguage(urlParams.get('l'));
  }, []);

  return (
    <ErrorBoundary onError={errorHandler} FallbackComponent={FallbackComponent}>
      <ConfigProvider locale={localeAntd}>
        <IntlProvider locale={locale} messages={localeMessages[locale]}>
          <Router>
            <Switch>
              <Route path="/" component={Layout} />
            </Switch>
          </Router>
        </IntlProvider>
      </ConfigProvider>
    </ErrorBoundary>
  );
};

export default App;
