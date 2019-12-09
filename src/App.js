import React from "react";
import QueryString from "query-string";

import Deposit from "./components/deposit/index";
import "./App.scss";
import { ReactComponent as Logo } from "./logo.svg";

import { ConfigProvider } from "antd";
import enUS from "antd/es/locale/en_US";
import { RequestContext } from "./Context";

function uuid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
    var r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

class App extends React.Component {
  constructor() {
    super();
    const parameters = QueryString.parse(window.location.search);
    this.state = {
      locale: enUS,
      request: {
        merchant: parameters.merchant || "faker",
        customer: parameters.customer || "clement",
        currency: parameters.currency || "USD",
        bank: parameters.bank || "FAKER",
        amount: parameters.amount || 1,
        referenceId: parameters.referenceId || uuid(),
        securityKey: parameters.securityKey || uuid(),
      },
    };
  }

  changeLocale = e => {
    const localeValue = e.target.value;
    this.setState({ locale: localeValue });
  };

  render() {
    const { locale } = this.state;
    return (
      <RequestContext.Provider value={this.state.request}>
        <ConfigProvider locale={locale}>
          <div className="main">
            <div style={{ textAlign: "center" }}>
              <Logo className="logo" />
            </div>
            <RequestContext.Consumer>
              {({ merchant, referenceId, idempotencyKey, securityKey }) => (
                <Deposit
                  referenceId={referenceId}
                  idempotencyKey={idempotencyKey}
                  securityKey={securityKey}
                  session={merchant + "-" + referenceId}
                />
              )}
            </RequestContext.Consumer>
          </div>
        </ConfigProvider>
      </RequestContext.Provider>
    );
  }
}

export default App;
