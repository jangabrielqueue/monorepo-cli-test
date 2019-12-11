import React from "react";
import { Result, Typography, Icon } from "antd";

const { Paragraph, Text } = Typography;

export const TransferSuccessful = ({ transferResult }) => {
  return (
    <Result
      status="success"
      title="Successfully Deposit!"
      subTitle={"Bank references: " + transferResult.message}
    >
      <div className="desc">
        <Paragraph>
          <Text
            strong
            style={{
              fontSize: 16,
            }}
          >
            Please reference the details:
          </Text>
        </Paragraph>
        <Paragraph>
          <Icon style={{ color: "red" }} type="close-circle" />{" "}
          {transferResult.refId}
        </Paragraph>
        <Paragraph>
          <Icon style={{ color: "red" }} type="close-circle" />{" "}
          {transferResult.message}
        </Paragraph>
        <Paragraph>
          <Icon style={{ color: "red" }} type="close-circle" />{" "}
          {transferResult.reference}
        </Paragraph>
      </div>
    </Result>
  );
};

export const TransferFailed = ({ transferResult }) => {
  return (
    <Result
      status="error"
      title="Submitted transaction failed"
      subTitle={transferResult.message}
    ></Result>
  );
};
