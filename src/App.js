import React from "react";
import QueryString from "query-string";

import Deposit from "./components/deposit/index";
import "./App.scss";
import { ReactComponent as Logo } from "./logo.svg";

import { ConfigProvider } from "antd";
import enUS from "antd/es/locale/en_US";
import { RequestContext } from "./Context";
import { ErrorMessage } from "./components/Error";


function getParameters(queryString) {
  const parameters = QueryString.parse(queryString);
  if (
    !parameters.merchant ||
    !parameters.requester ||
    !parameters.currency ||
    !parameters.amount ||
    parameters.amount <= 0 ||
    !parameters.reference ||
    !parameters.clientIp ||
    !parameters.datetime ||
    !parameters.signature
  ) {
    return undefined;
  } else {
    return {
      merchant: parameters.merchant,
      requester: parameters.requester,
      currency: parameters.currency,
      amount: parameters.amount,
      reference: parameters.reference,
      clientIp: parameters.clientIp,
      datetime: parameters.datetime,
      signature: parameters.signature,
    };
  }
}

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      locale: enUS,
      request: getParameters(window.location.search),
    };
  }

  changeLocale = e => {
    const localeValue = e.target.value;
    this.setState({ locale: localeValue });
  };

  render() {
    const { locale, request } = this.state;
    const content = request ? (
      <RequestContext.Provider value={request}>
        <Deposit
          reference={request.reference}
          signature={request.signature}
          session={request.merchant + "-" + request.reference}
        />
      </RequestContext.Provider>
    ) : (
      <ErrorMessage errorMessage="Invalid parameters" />
    );
    return (
      <ConfigProvider locale={locale}>
        <div className="main">
          <div style={{ textAlign: "center" }}>
            <Logo className="logo" />
          </div>
          {content}
        </div>
      </ConfigProvider>
    );
  }
}

export default App;
