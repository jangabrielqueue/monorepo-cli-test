import React, { Component } from "react";
import { Card, Steps, Spin, Alert } from "antd";
import DepositForm from "./DepositForm";
import OTPForm from "./OTPForm";
import { TransferSuccessful, TransferFailed } from "./TransferResult";
import { sendTopUpRequest, sendTopUpOtp } from "./Requests";

import * as signalR from "@microsoft/signalr";
import { RequestContext } from "../../Context";

const { Step } = Steps;

const ENDPOINT = process.env.REACT_APP_ENDPOINT;
const API_USER_COMMAND_MONITOR = ENDPOINT + "/hubs/monitor";

class Deposit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      step: 0,
      waitingForReady: true,
      depositRequesting: false,
      otpRequesting: false,
    };
  }

  handleSubmitDeposit = async values => {
    this.setState({
      waitingForReady: true,
      error: undefined,
      errors: undefined,
    });
    const result = await sendTopUpRequest({
      ...values,
      referenceId: this.props.referenceId,
    });
    if (result.errors) {
      this.setState({
        waitingForReady: false,
        error: result.title,
        errors: result.errors,
      });
    }
  };

  handleRequestOTP = () => {
    this.setState({
      waitingForReady: false,
      step: 1,
    });
  };

  handleSubmitOTP = async value => {
    this.setState({
      waitingForReady: true,
      error: undefined,
      errors: undefined,
    });
    const result = await sendTopUpOtp(this.props.session, value.otp);
    if (result.errors) {
      this.setState({
        waitingForReady: false,
        error: result.title,
        errors: result.errors,
      });
    }
  };

  handleCommandStatusUpdate = e => {
    let successful = false;
    let transferResult = undefined;
    if (e.successful) {
      transferResult = e.successful;
      successful = true;
    } else if (e.retryableFailed) {
      transferResult = e.retryableFailed;
    } else if (e.unretryableFailed) {
      transferResult = e.unretryableFailed;
    }
    this.setState({
      waitingForReady: false,
      isSuccessful: successful,
      errors: undefined,
      step: 2,
      transferResult: transferResult,
    });
  };

  componentDidMount = async () => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(API_USER_COMMAND_MONITOR)
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();
    connection.on("Update", this.handleCommandStatusUpdate);
    connection.on("OtpRequested", this.handleRequestOTP);
    connection.onclose(async () => {
      this.setState({
        waitingForReady: true,
        error: "Network error",
        errors: {
          network: "connection is closed, please refresh the page.",
        },
      });
    });
    try {
      await connection.start();
      await connection.invoke("Start", this.props.session);
      this.setState({
        connection,
        waitingForReady: false,
      });
    } catch (ex) {
      this.setState({
        error: "Network error",
        errors: {
          network: "Can't connect to server, please refresh your browser.",
        },
      });
    }
  };

  render() {
    const {
      step,
      waitingForReady,
      error,
      isSuccessful,
      transferResult,
    } = this.state;
    let content;
    if (step === 0) {
      content = (
        <RequestContext.Consumer>
          {request => (
            <DepositForm
              merchant={request.merchant}
              requester={request.requester}
              currency={request.currency}
              bank={request.bank}
              amount={request.amount}
              reference={request.reference}
              signature={request.signature}
              handleSubmit={this.handleSubmitDeposit}
            />
          )}
        </RequestContext.Consumer>
      );
    } else if (step === 1) {
      content = <OTPForm handleSubmit={this.handleSubmitOTP} />;
    } else if (step === 2 && isSuccessful) {
      content = <TransferSuccessful transferResult={transferResult} />;
    } else if (step === 2) {
      content = <TransferFailed transferResult={transferResult} />;
    }
    return (
      <>
        <div className="steps-container">
          <Steps size="small" current={step}>
            <Step title="LOGIN" />
            <Step title="AUTHORIZATION" />
            <Step title="RESULT" />
          </Steps>
        </div>
        <div className="deposit-container">
          {error && (
            <Alert
              message={error}
              type="error"
              showIcon
              closable
              style={{ marginBottom: "0.5rem" }}
            />
          )}
          <Spin spinning={waitingForReady}>
            <Card>{content}</Card>
          </Spin>
        </div>
      </>
    );
  }
}

export default Deposit;
