import React from "react";
import { Result } from "antd";

export const TransferSuccessful = ({ transferResult }) => {
  return (
    <Result
      status="success"
      title="Successfully Deposit!"
      subTitle={"Bank references: " + transferResult.bankReference}
    />
  );
};

export const TransferFailed = ({ transferResult }) => {
  return (
    <Result
      status="error"
      title="Submitted transaction failed"
      subTitle={transferResult.error}
    ></Result>
  );
};
