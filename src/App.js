import React, { useState, useEffect } from 'react';
import * as firebase from 'firebase/app';
import 'firebase/analytics';
import './App.scss';
import ErrorBoundary from 'react-error-boundary';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Layout from './containers/Layout/Layout';
import axios from 'axios';
import { IntlProvider } from 'react-intl';
import locale_en from './translations/locale/en.json';
import locale_vi from './translations/locale/vi.json';
import locale_th from './translations/locale/th.json';
import './assets/fonts/ProductSans-Regular.ttf';
import './assets/fonts/ProductSans-Bold.ttf';
import './assets/fonts/ProductSans-Medium-500.ttf';
import '@rmwc/button/styles';
import '@rmwc/dialog/styles';
import { ThemeProvider } from 'styled-components';
import GlobalStyles from './assets/styles/GlobalStyles';
import { useForm, FormContext } from 'react-hook-form';

const theme = {
  colors: {
    main: '#91C431',
    faker: '#91C431',
    fakerthb: '#91C431',
    topup: '#1890ff',
    tcb: '#FF2600',
    tmb: '#008CCD',
    boa: '#FFCC2F',
    ktb: '#00B5E9',
    bbl: '#0048AA',
    kbank: '#00B463',
    scb: '#59358C',
    vib: '#007BC0',
    agri: '#AB1C40',
    exim: '#0071A7',
    dab: '#F49200',
    bidv: '#2B56AB',
    vcb: '#00613F',
    acb: '#0038A6',
    sacom: '#0A74BE',
    vtb: '#055893'
  }
};

const errorHandler = (error, componentStack) => {
  const analytics = firebase.analytics();
  analytics.logEvent('exception', {
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
  axios.defaults.headers.post['Content-Type'] = 'application/json';

  const methods = useForm();

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
      authDomain: '',
      databaseURL: '',
      projectId: REACT_APP_FIREBASE_PROJ_ID,
      storageBucket: '',
      messagingSenderId: REACT_APP_FIREBASE_MSG_SENDER_ID,
      appId: REACT_APP_FIREBASE_APP_ID,
      measurementId: REACT_APP_FIREBASE_MEASUREMENT_ID,
    };
    firebase.initializeApp(firebaseConfig);
  }

  const [locale, setLocale] = useState('en');
  const localeMessages = {
    'en': locale_en,
    'vi': locale_vi,
    'th': locale_th
  };

  function handleSelectLanguage (param) {
    switch (param) {
      case 'vi-vn':
        setLocale('vi');
        break;
      case 'th-th':
        setLocale('th');
        break;
      default:
        setLocale('en');
    }
  }

  useEffect(() => {
    const url = new URL(window.location.href);
    const urlParams = new URLSearchParams(url.search);

    handleSelectLanguage(urlParams.get('l'));
  }, []);

  return (
    <FormContext {...methods}>
      <ThemeProvider theme={theme}>
        <ErrorBoundary onError={errorHandler} FallbackComponent={FallbackComponent}>
          <IntlProvider locale={locale} messages={localeMessages[locale]}>
            <GlobalStyles />
            <Router>
              <Switch>
                <Route path='/' component={Layout} />
              </Switch>
            </Router>
          </IntlProvider>
        </ErrorBoundary>
      </ThemeProvider>
    </FormContext>
  );
};

export default App;
