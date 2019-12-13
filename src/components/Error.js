import React from "react";
import { Card, Result } from "antd";

export const ErrorMessage = ({ errorMessage }) => {
  return (
    <>
      <div className="deposit-container">
        <Card>
          <Result
            status="error"
            title={errorMessage}
          ></Result>
        </Card>
      </div>
    </>
  );
};
