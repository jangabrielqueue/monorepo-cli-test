import React, { useState } from "react";
import "./App.scss";
import { ConfigProvider } from "antd";
import enUS from "antd/es/locale/en_US";
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';
import Layout from './containers/Layout/Layout'
import axios from 'axios';

const App = () => {
  const { REACT_APP_ENDPOINT } = process.env;
  axios.defaults.baseURL = REACT_APP_ENDPOINT;
  axios.defaults.headers.post['Content-Type'] = 'application/json';

  const [locale, setLocale] = useState(enUS); // locale hasn't been setup

  return (
    <ConfigProvider locale={locale}>
      <Router>
        <Switch>
          <Route path='/' component={Layout} />
        </Switch>
      </Router>
    </ConfigProvider>
  );
}

export default App;
