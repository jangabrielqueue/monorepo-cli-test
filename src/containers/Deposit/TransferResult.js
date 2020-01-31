import React from "react";
import { Result, Statistic } from "antd";

export class AutoRedirect extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.id = setTimeout(() => {
      window.location.href = this.props.url;
    }, this.props.delay);
  }

  componentWillUnmount() {
    clearTimeout(this.id);
  }

  render() {
    return this.props.children;
  }
}

export const TransferSuccessful = ({ transferResult, redirectUrl }) => {
  return (
    <Result
      status="success"
      title="Successfully Deposit!"
      subTitle={"References: " + transferResult.reference}
    >
      <Statistic
        title=""
        prefix={transferResult.currency}
        value={transferResult.amount}
        valueStyle={{ color: "#000", fontWeight: 700 }}
        precision={2}
      />
    </Result>
  );
};

export const TransferFailed = ({ transferResult, redirectUrl }) => {
  return (
    <Result
      status="error"
      title="Submitted transaction failed"
      subTitle={transferResult.message}
    ></Result>
  );
};
