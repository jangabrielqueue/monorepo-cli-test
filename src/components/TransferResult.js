import React from "react";
import { Result, Statistic } from "antd";

export const TransferSuccessful = ({ transferResult }) => {
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

export const TransferFailed = ({ transferResult }) => {
  return (
    <Result
      status="error"
      title="Submitted transaction failed"
      subTitle={transferResult.message || transferResult.statusMessage}
    ></Result>
  );
};

export const TransferWaitForConfirm = ({ transferResult }) => {
  return (
    <Result
      status="success"
      title="Successfully Deposit!"
      subTitle="Transaction is pending for confirmation."
    ></Result>
  );
};
