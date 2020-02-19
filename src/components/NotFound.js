import React from "react";
import { Result } from 'antd';
import messages from './messages';
import { useIntl } from 'react-intl';

const NotFound = (props) => {
  const intl = useIntl();

  return (
    <Result
      status="404"
      title="404"
      subTitle={intl.formatMessage(messages.errors.pageDoesNoExist)}
    />
  );
};

export default NotFound;
