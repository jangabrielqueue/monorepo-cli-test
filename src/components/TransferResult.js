import React from "react";
import { Result, Statistic } from "antd";
import { useIntl } from 'react-intl';
import messages from './messages';

let intl;

export const TransferSuccessful = ({ transferResult }) => {
  intl = useIntl();

  return (
    <Result
      status="success"
      title={intl.formatMessage(messages.success.successfullyDeposit)}
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
  intl = useIntl();

  return (
    <Result
      status="error"
      title={intl.formatMessage(messages.errors.transactionFailed)}
      subTitle={transferResult.message}
    ></Result>
  );
};

export const TransferWaitForConfirm = ({ transferResult }) => {
  intl = useIntl();

  return (
    <Result
      status="success"
      title={intl.formatMessage(messages.success.successfullyDeposit)}
      subTitle={intl.formatMessage(messages.progress.pendingConfirmation)}
    ></Result>
  );
};
