import React, { useState, useEffect, useCallback } from "react";
import { Card, Steps, Spin, Alert, Progress } from "antd";
import * as firebase from "firebase/app";
import AutoRedirect from "../../components/AutoRedirect";
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
import { useIntl } from 'react-intl';
import messages from './messages';

const { Step } = Steps;

const ENDPOINT = process.env.REACT_APP_ENDPOINT;
const API_USER_COMMAND_MONITOR = ENDPOINT + "/hubs/monitor";

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
  const intl = useIntl();
  const initProgress = {
    currentStep: 1,
    totalSteps: 10,
    statusCode: "009",
    statusMessage: intl.formatMessage(messages.progress.inProgress),
  };

  analytics.setCurrentScreen("deposit");

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

  const handleReceivedResult = useCallback(
    (e) => {
        analytics.logEvent("received_result", {
          reference: reference,
          result: e,
        });
        setIsSuccessful(e.isSuccess);
        setProgress(undefined);
        setTransferResult(e);
        setWaitingForReady(false);
        setStep(2);
    },
    [analytics, reference],
  );

  const handleRequestOTP = useCallback(
    (e) => {
      setProgress(undefined);
      setStep(1);
      setOtpReference(e.extraData);
      setWaitingForReady(false);
    },
    [],
  );

  const handleUpdateProgress = useCallback(
    (e) => {
      setProgress(e);
    },
    [],
  );

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
    if (queryParams.toString().split('&').length < 14) {
      return props.history.replace('/invalid');
    }

    // disabling the react hooks recommended rule on this case because it forces to add queryparams and props.history as dependencies array
    // although dep array only needed on first load and would cause multiple rerendering if enforce as dep array. So for this case only will disable it to
    // avoid unnecessary warning
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
    .withUrl(API_USER_COMMAND_MONITOR)
    .withAutomaticReconnect()
    .configureLogging(signalR.LogLevel.Information)
    .build();

    connection.on("receivedResult", handleReceivedResult);
    connection.on("otpRequested", handleRequestOTP);
    connection.on("update", handleUpdateProgress);
    connection.onreconnected(async e => {
      await connection.invoke("Start", session);
    });

    async function start() {
      try {
        await connection.start();
        await connection.invoke("Start", session);
      } catch (ex) {
        setError({
          code: intl.formatMessage(messages.errors.networkErrorTitle),
          message: intl.formatMessage(messages.errors.networkError),
        });
      }
      setWaitingForReady(false);
    }

    start();

    return () => {
      connection.onclose(() => {
        setWaitingForReady(true);
        setError({
          code: intl.formatMessage(messages.errors.networkErrorTitle),
          message: intl.formatMessage(messages.errors.connectionError),
        });
        setProgress(undefined);
      });
    };
  }, [session, handleReceivedResult, handleRequestOTP, handleUpdateProgress, intl]);

  useEffect(() => {
    window.onbeforeunload = (e) => {
      if (step < 2) {
        // this custom message will only appear on earlier version of different browsers.
        // However on modern and latest browsers their own default message will override this custom message.
        // as of the moment only applicable on browsers. there's no definite implementation on mobile
        e.returnValue = 'Do you really want to leave current page?'
      } else {
        return;
      }
    };
  }, [step]);

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
      <AutoRedirect delay={10000} url={successfulUrl}>
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
          <Step title={intl.formatMessage(messages.steps.login)} />
          <Step title={intl.formatMessage(messages.steps.authorization)} />
          <Step title={intl.formatMessage(messages.steps.result)} />
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
