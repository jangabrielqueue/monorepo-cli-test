import React from "react";
import { Result } from 'antd';
import messages from './messages';
import { useIntl } from 'react-intl';

const InvalidPage = (props) => {
  const intl = useIntl();

  return (
    <Result
      status="error"
      title={intl.formatMessage(messages.errors.submissionFailed)}
      subTitle={intl.formatMessage(messages.errors.invalidParameters)}
    />
  );
};

export default InvalidPage;
