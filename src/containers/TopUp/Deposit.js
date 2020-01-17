import React, { useState, useEffect } from 'react';
import { Card, Steps, Spin, Alert, Progress } from "antd";
import DepositForm from "./DepositForm";
import OTPForm from "./OTPForm";
import { TransferSuccessful, TransferFailed } from "./TransferResult";
import { sendTopUpRequest, sendTopUpOtp } from "./Requests";
import * as signalR from "@microsoft/signalr";
import { useQuery } from '../../utils/utils';

const { Step } = Steps;

const ENDPOINT = process.env.REACT_APP_ENDPOINT;
const API_USER_COMMAND_MONITOR = ENDPOINT + "/hubs/monitor";

const initProgress = {
    currentStep: 1,
    totalSteps: 10,
    statusCode: "009",
    statusMessage: "In progress",
  };

const Deposit = (props) => {
    const [depositRequest, setDepositRequest] = useState({
        step: 0,
        waitingForReady: true,
        depositRequesting: false,
        otpRequesting: false,
        error: undefined,
        errors: undefined,
        progress: undefined,
        otpReference: '',
        isSuccessful: false,
        transferResult: {}
    });
    const queryParams = useQuery();
    const session = `${queryParams.get('merchant')}-${queryParams.get('reference')}`;

    async function handleSubmitDeposit (values) {
        setDepositRequest({
            ...depositRequest,
            waitingForReady: true,
            error: undefined,
            errors: undefined,
            progress: undefined,
        });

        const result = await sendTopUpRequest({
          ...values,
          reference: queryParams.get('reference'),
        });
        if (result.errors) {
            setDepositRequest({
                ...depositRequest,
                waitingForReady: false,
                error: result.title,
                errors: result.errors,
                progress: undefined,
            });
        } else {
            setDepositRequest({
                ...depositRequest,
                progress: initProgress,
            });
        }
    };

    async function handleSubmitOTP (value) {
        setDepositRequest({
            ...depositRequest,
            waitingForReady: true,
            error: undefined,
            errors: undefined,
            progress: undefined,
        });
        const result = await sendTopUpOtp(this.props.reference, value.otp);
        if (result.errors) {
            setDepositRequest({
                ...depositRequest,
                waitingForReady: false,
                error: result.title,
                errors: result.errors,
                progress: undefined,
            });
        }
    };
    
    function handleCommandStatusUpdate (e) {
        setDepositRequest({
            ...depositRequest,
            waitingForReady: false,
            isSuccessful: e.isSuccess,
            errors: undefined,
            progress: undefined,
            step: 2,
            transferResult: e,
        });
      };
      
      function handleRequestOTP (e) {
        setDepositRequest({
            ...depositRequest,
            waitingForReady: false,
            progress: undefined,
            step: 1,
            otpReference: e.extraData,
        });
      };
      
      function handleUpdateProgress (e) {
        setDepositRequest({
            ...depositRequest,
            progress: e,
        });
      };

      function showProgress (progress) {
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
      };
    
    useEffect(() => {
        if (!props.location.search) {
            props.history.replace('/invalid');
        }

        const connection = new signalR.HubConnectionBuilder()
        .withUrl(API_USER_COMMAND_MONITOR)
        .withAutomaticReconnect()
        .configureLogging(signalR.LogLevel.Information)
        .build();

        connection.on("receivedResult", handleCommandStatusUpdate);
        connection.on("otpRequested", handleRequestOTP);
        connection.on("Update", handleUpdateProgress);

        async function start() {
            try {
                await connection.start();
                await connection.invoke("Start", session);
                setDepositRequest({
                    ...depositRequest,
                    waitingForReady: false
                });
            } catch (ex) {
                setDepositRequest({
                    ...depositRequest,
                    error: "Network error",
                    errors: {
                    network: "Can't connect to server, please refresh your browser.",
                    },
                });
            }
        };

        start();

        connection.onclose(() => {
            setDepositRequest({
                ...depositRequest,
                waitingForReady: true,
                error: "Network error",
                errors: {
                  network: "connection is closed, please refresh the page.",
                },
                progress: undefined,                    
            });
        });
    }, [])

    const { step,
        waitingForReady,
        error,
        isSuccessful,
        transferResult,
        progress,
        otpReference
    } = depositRequest;

    let content;
    if (step === 0) {
      content = (
            <DepositForm
                merchant={queryParams.get('merchant')}
                requester={queryParams.get('requester')}
                currency={queryParams.get('currency')}
                bank={queryParams.get('bank')}
                amount={queryParams.get('amount')}
                reference={queryParams.get('reference')}
                clientIp={queryParams.get('clientIp')}
                signature={queryParams.get('signature')}
                datetime={queryParams.get('datetime')}
                handleSubmit={handleSubmitDeposit}
            />
      );
    } else if (step === 1) {
      content = (
        <OTPForm
            otpReference={otpReference}
            handleSubmit={handleSubmitOTP}
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

export default Deposit;
