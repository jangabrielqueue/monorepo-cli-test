import React, { useState, useEffect } from "react";
import { Card, Steps, Spin, Alert, Progress } from "antd";
import * as firebase from "firebase/app";
import { AutoRedirect } from "../../components/AutoRedirect";
import DepositForm from "./DepositForm";
import OTPForm from "./OTPForm";
import {
  TransferSuccessful,
  TransferFailed,
  TransferWaitForConfirm,
} from "../../components/TransferResult";
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
  const [step, setStep] = useState(0);
  const [otpReference, setOtpReference] = useState();
  const [waitingForReady, setWaitingForReady] = useState(true);
  const [error, setError] = useState();
  const [progress, setProgress] = useState();
  const [isSuccessful, setIsSuccessful] = useState(false);
  const [transferResult, setTransferResult] = useState({});
  const queryParams = useQuery();
  const bank = queryParams.get("b");
  const merchant = queryParams.get("m");
  const currency = queryParams.get("c1");
  const requester = queryParams.get("c2");
  const clientIp = queryParams.get("c3");
  const callbackUri = queryParams.get("c4");
  const amount = queryParams.get("a");
  const reference = queryParams.get("r");
  const datetime = queryParams.get("d");
  const signature = queryParams.get("k");
  const successfulUrl = queryParams.get("su");
  const failedUrl = queryParams.get("fu");
  const note = queryParams.get("n");
  const language = queryParams.get("l");

  const session = `DEPOSIT-BANK-${merchant}-${reference}`;

  analytics.setUserProperties({
    merchant: merchant,
    requester: requester,
  });

  async function handleSubmitDeposit(values) {
    analytics.logEvent("login", {
      reference,
    });
    setError(undefined);
    setProgress(undefined);
    setWaitingForReady(true);
    const result = await sendDepositRequest({
      ...values,
      reference,
      language,
      note,
      successfulUrl,
      failedUrl,
      callbackUri,
    });
    if (result.error) {
      analytics.logEvent("login_failed", {
        reference,
        error: result.error,
      });
      setWaitingForReady(false);
      setError(result.error);
    } else {
      setProgress(initProgress);
    }
  }

  async function handleSubmitOTP(value) {
    analytics.logEvent("submitted_otp", {
      reference: reference,
      otp: value.otp,
    });
    setError(undefined);
    setProgress(undefined);
    setWaitingForReady(true);
    const result = await sendDepositOtp(reference, value.otp);
    if (result.error) {
      analytics.logEvent("submitted_otp_failed", {
        reference: reference,
        otp: value.otp,
      });
      setError(result.error);
      setProgress(undefined);
      setWaitingForReady(false);
    } else {
      analytics.logEvent("submitted_otp_succeed", {
        reference: reference,
        otp: value.otp,
      });
      setStep(1);
    }
  }

  function handleReceivedResult(e) {
    analytics.logEvent("received_result", {
      reference: reference,
      result: e,
    });
    setIsSuccessful(e.isSuccess);
    setProgress(undefined);
    setTransferResult(e);
    setWaitingForReady(false);
    setStep(2);
  }

  function handleRequestOTP(e) {
    setProgress(undefined);
    setStep(1);
    setOtpReference(e.extraData);
    setWaitingForReady(false);
  }

  function handleUpdateProgress(e) {
    setProgress(e);
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

    connection.on("receivedResult", handleReceivedResult);
    connection.on("otpRequested", handleRequestOTP);
    connection.on("update", handleUpdateProgress);

    async function start() {
      try {
        await connection.start();
        await connection.invoke("Start", session);
      } catch (ex) {
        setError({
          code: "Network error",
          message: "Can't connect to server, please refresh your browser.",
        });
      }
      setWaitingForReady(false);
    }

    start();

    return () => {
      connection.onclose(() => {
        setWaitingForReady(true);
        setError({
          code: "Network error",
          message: "connection is closed, please refresh the page.",
        });
        setProgress(undefined);
      });
    };
  }, []);

  let content;
  if (step === 0) {
    analytics.setCurrentScreen("input_user_credentials");
    content = (
      <DepositForm
        merchant={merchant}
        requester={requester}
        currency={currency}
        bank={bank}
        amount={amount}
        reference={reference}
        clientIp={clientIp}
        signature={signature}
        datetime={datetime}
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
    content = (
      <AutoRedirect delay={10000} url={successfulUrl}>
        <TransferSuccessful transferResult={transferResult} />
      </AutoRedirect>
    );
  } else if (step === 2 && transferResult.statusCode === "000") {
    analytics.setCurrentScreen("transfer_successful");
    content = (
      <AutoRedirect delay={10000} url={failedUrl}>
        <TransferWaitForConfirm transferResult={transferResult} />
      </AutoRedirect>
    );
  } else if (step === 2) {
    analytics.setCurrentScreen("transfer_failed");
    content = (
      <AutoRedirect delay={10000} url={failedUrl}>
        <TransferFailed transferResult={transferResult} />
      </AutoRedirect>
    );
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
        <Spin spinning={waitingForReady}>
          <Card>{content}</Card>
        </Spin>
        {progress && showProgress(progress)}
      </div>
    </>
  );
};

export default Deposit;
