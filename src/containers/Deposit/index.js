import React, { useState, useEffect } from "react";
import { Card, Steps, Spin, Alert, Progress } from "antd";
import * as firebase from "firebase/app";
import DepositForm from "./DepositForm";
import OTPForm from "./OTPForm";
import { TransferSuccessful, TransferFailed } from "./TransferResult";
import { sendDepositRequest, sendDepositOtp } from "./Requests";
import * as signalR from "@microsoft/signalr";
import { useQuery } from "../../utils/utils";

const { Step } = Steps;

const ENDPOINT = process.env.REACT_APP_ENDPOINT;
const API_USER_COMMAND_MONITOR = ENDPOINT + "/hubs/monitor";

const initProgress = {
  currentStep: 1,
  totalSteps: 10,
  statusCode: "009",
  statusMessage: "In progress",
};

const Deposit = props => {
  const analytics = firebase.analytics();
  const [depositState, setDepositState] = useState({
    step: 0,
    waitingForReady: true,
    depositRequesting: false,
    otpRequesting: false,
    error: undefined,
    progress: undefined,
    otpReference: "",
    isSuccessful: false,
    transferResult: {},
  });
  const queryParams = useQuery();
  const merchant = queryParams.get("merchant");
  const requester = queryParams.get("requester");
  const reference = queryParams.get("reference");
  const session = `DEPOSIT-BANK-${merchant}-${reference}`;

  analytics.setUserProperties({
    merchant: merchant,
    requester: requester,
  });

  async function handleSubmitDeposit(values) {
    analytics.logEvent("login", {
      reference: reference,
    });
    setDepositState({
      ...depositState,
      waitingForReady: true,
      error: undefined,
      progress: undefined,
    });
    const result = await sendDepositRequest({
      ...values,
      reference: queryParams.get("reference"),
    });
    if (result.error) {
      analytics.logEvent("login_failed", {
        reference: reference,
        error: result.error,
      });
      setDepositState({
        ...depositState,
        waitingForReady: false,
        error: result.error,
        progress: undefined,
      });
    } else {
      setDepositState({
        ...depositState,
        waitingForReady: true,
        progress: initProgress,
      });
    }
  }

  async function handleSubmitOTP(value) {
    analytics.logEvent("submitted_otp", {
      reference: reference,
      otp: value.otp,
    });
    setDepositState({
      ...depositState,
      waitingForReady: true,
      error: undefined,
      progress: undefined,
    });
    const result = await sendDepositOtp(
      queryParams.get("reference"),
      value.otp
    );
    if (result.error) {
      analytics.logEvent("submitted_otp_failed", {
        reference: reference,
        otp: value.otp,
      });
      setDepositState({
        ...depositState,
        waitingForReady: false,
        error: result.error,
        progress: undefined,
      });
    } else {
      analytics.logEvent("submitted_otp_succeed", {
        reference: reference,
        otp: value.otp,
      });
      setDepositState({
        ...depositState,
        waitingForReady: true,
        step: 1,
      });
    }
  }

  function handleCommandStatusUpdate(e) {
    analytics.logEvent("received_result", {
      reference: reference,
      result: e,
    });
    setDepositState({
      ...depositState,
      waitingForReady: false,
      isSuccessful: e.isSuccess,
      progress: undefined,
      step: 2,
      transferResult: e,
    });
  }

  function handleRequestOTP(e) {
    setDepositState({
      ...depositState,
      waitingForReady: false,
      progress: undefined,
      step: 1,
      otpReference: e.extraData,
    });
  }

  function handleUpdateProgress(e) {
    setDepositState({
      ...depositState,
      progress: e,
    });
  }

  function showProgress(progress) {
    return (
      <div style={{ padding: "5px" }}>
        <Progress
          percent={(progress.currentStep / progress.totalSteps) * 100}
          status="active"
          showInfo={false}
        />
        <strong>{progress.statusMessage}</strong>
      </div>
    );
  }

  useEffect(() => {
    if (!props.location.search) {
      props.history.replace("/invalid");
    }

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(API_USER_COMMAND_MONITOR)
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();

    connection.on("receivedResult", handleCommandStatusUpdate);
    connection.on("otpRequested", handleRequestOTP);
    connection.on("update", handleUpdateProgress);

    async function start() {
      try {
        await connection.start();
        await connection.invoke("Start", session);
        setDepositState({
          ...depositState,
          waitingForReady: false,
        });
      } catch (ex) {
        setDepositState({
          ...depositState,
          error: {
            code: "Network error",
            message: "Can't connect to server, please refresh your browser.",
          },
        });
      }
    }

    start();

    return () => {
      connection.onclose(() => {
        setDepositState({
          ...depositState,
          waitingForReady: true,
          error: {
            code: "Network error",
            message: "connection is closed, please refresh the page.",
          },
          progress: undefined,
        });
      });
    };
  }, []);

  const {
    step,
    waitingForReady,
    error,
    isSuccessful,
    transferResult,
    progress,
    otpReference,
  } = depositState;

  let content;
  if (step === 0) {
    analytics.setCurrentScreen("input_user_credentials");
    content = (
      <DepositForm
        merchant={queryParams.get("merchant")}
        requester={queryParams.get("requester")}
        currency={queryParams.get("currency")}
        bank={queryParams.get("bank")}
        amount={queryParams.get("amount")}
        reference={queryParams.get("reference")}
        clientIp={queryParams.get("clientIp")}
        signature={queryParams.get("signature")}
        datetime={queryParams.get("datetime")}
        handleSubmit={handleSubmitDeposit}
      />
    );
  } else if (step === 1) {
    analytics.setCurrentScreen("input_otp");
    content = (
      <OTPForm otpReference={otpReference} handleSubmit={handleSubmitOTP} />
    );
  } else if (step === 2 && isSuccessful) {
    analytics.setCurrentScreen("transfer_successful");
    content = <TransferSuccessful transferResult={transferResult} />;
  } else if (step === 2) {
    analytics.setCurrentScreen("transfer_failed");
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
            description={error.message}
            type="error"
            showIcon
            closable
            className="error-message"
          />
        )}
        {progress && showProgress(progress)}
        <Spin spinning={waitingForReady}>
          <Card>{content}</Card>
        </Spin>
      </div>
    </>
  );
};

export default Deposit;
