import React from "react";
import { Result, Button } from 'antd';

const NotFound = (props) => {
  const { history: { goBack } } = props;
  return (
    <Result
      status="error"
      title="Submission Failed"
      subTitle="Invalid parameters"
    />
  );
};

export default NotFound;
