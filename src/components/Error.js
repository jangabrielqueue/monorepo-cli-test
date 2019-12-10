import React from "react";
import { Result } from "antd";


export const ErrorMessage = ({ errorMessage }) => {
  return (
    <Result
      status="error"
      title="Opps, Something wrong"
      subTitle={errorMessage}
    ></Result>
  );
};
