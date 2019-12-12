import React, { Component } from "react";
import { Card, Steps, Spin, Alert, Progress } from "antd";
import DepositForm from "./DepositForm";
import OTPForm from "./OTPForm";
import { TransferSuccessful, TransferFailed } from "./TransferResult";
import { sendTopUpRequest, sendTopUpOtp } from "./Requests";

import * as signalR from "@microsoft/signalr";
import { RequestContext } from "../../Context";

const { Step } = Steps;

const ENDPOINT = process.env.REACT_APP_ENDPOINT;
const API_USER_COMMAND_MONITOR = ENDPOINT + "/hubs/monitor";

const initProgress = {
  currentStep: 1,
  totalSteps: 10,
  statusCode: "009",
  statusMessage: "In progress",
};

const showProgress = progress => (
  <div style={{ padding: "5px" }}>
    <Progress
      percent={(progress.currentStep / progress.totalSteps) * 100}
      status="active"
      showInfo={false}
    />
    <strong>{progress.statusMessage}</strong>
  </div>
);

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
      progress: undefined,
    });
    const result = await sendTopUpRequest({
      ...values,
      reference: this.props.reference,
    });
    if (result.errors) {
      this.setState({
        waitingForReady: false,
        error: result.title,
        errors: result.errors,
        progress: undefined,
      });
    } else {
      this.setState({
        progress: initProgress,
      });
    }
  };

  handleRequestOTP = e => {
    this.setState({
      waitingForReady: false,
      progress: undefined,
      step: 1,
      otpReference: e.extraData,
    });
  };

  handleSubmitOTP = async value => {
    this.setState({
      waitingForReady: true,
      error: undefined,
      errors: undefined,
      progress: undefined,
    });
    const result = await sendTopUpOtp(this.props.reference, value.otp);
    if (result.errors) {
      this.setState({
        waitingForReady: false,
        error: result.title,
        errors: result.errors,
        progress: undefined,
      });
    }
  };

  handleCommandStatusUpdate = e => {
    this.setState({
      waitingForReady: false,
      isSuccessful: e.isSuccess,
      errors: undefined,
      progress: undefined,
      step: 2,
      transferResult: e,
    });
  };

  handleUpdateProgress = e => {
    this.setState({
      progress: e,
    });
  };

  componentDidMount = async () => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(API_USER_COMMAND_MONITOR)
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();
    connection.on("receivedResult", this.handleCommandStatusUpdate);
    connection.on("otpRequested", this.handleRequestOTP);
    connection.on("Update", this.handleUpdateProgress);
    connection.onclose(async () => {
      this.setState({
        waitingForReady: true,
        error: "Network error",
        errors: {
          network: "connection is closed, please refresh the page.",
        },
        progress: undefined,
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
      progress,
      otpReference,
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
              clientIp={request.clientIp}
              signature={request.signature}
              datetime={request.datetime}
              handleSubmit={this.handleSubmitDeposit}
            />
          )}
        </RequestContext.Consumer>
      );
    } else if (step === 1) {
      content = (
        <OTPForm
          otpReference={otpReference}
          handleSubmit={this.handleSubmitOTP}
        />
      );
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
          {progress && showProgress(progress)}
        </div>
      </>
    );
  }
}

export default Deposit;
