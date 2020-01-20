import React, { useState, useEffect } from 'react';
import { Card, Steps, Spin, Alert, Progress } from "antd";
import ScratchCardForm from './ScratchCardForm';
import ScratchCardResult from './ScratchCardResult';
import { useQuery } from '../../utils/utils';
import * as signalR from "@microsoft/signalr";
import './styles.scss';
import axios from 'axios';

const { Step } = Steps;

const ENDPOINT = process.env.REACT_APP_ENDPOINT;
const API_USER_COMMAND_MONITOR = ENDPOINT + "/hubs/monitor";

const initProgress = {
    currentStep: 1,
    totalSteps: 10,
    statusCode: "009",
    statusMessage: "In progress",
  };

const ScratchCard = (props) => {
    const [depositRequest, setDepositRequest] = useState({
        step: 0,
        waitingForReady: true,
        otpRequesting: false,
        error: undefined,
        errors: undefined,
        progress: undefined,
        isSuccessful: false,
        transferResult: {}
    });
    const steps = ['FILL IN FORM', 'RESULT'];
    const queryParams = useQuery();
    const session = `${queryParams.get('merchant')}-${queryParams.get('reference')}`;

    function handleSubmitScratchCard (e, validateFields) {
        e.preventDefault();

        validateFields(async (err, values) => {

            if (!err) {
                const submitValues = {
                    Telecom: values.telcoName,
                    Pin: values.cardPin.toString(),
                    SerialNumber: values.cardSerialNumber.toString(),
                    ClientIp: queryParams.get('ClientIp'),
                    Language: queryParams.get('Language'),
                    SuccessfulUrl: queryParams.get('SuccessfulUrl'),
                    FailedUrl: queryParams.get('FailedUrl'),
                    CallbackUri: queryParams.get('CallbackUri'),
                    Datetime: queryParams.get('Datetime'),
                    Key: queryParams.get('Key'),
                    Note: queryParams.get('Note'),
                    Merchant: queryParams.get('Merchant'),
                    Currency: queryParams.get('Currency'),
                    Bank: queryParams.get('Bank'),
                    Customer: queryParams.get('Customer'),
                    Reference: queryParams.get('Reference'),
                    Amount: queryParams.get('Amount')
                };
                
                await setDepositRequest({
                    ...depositRequest,
                    waitingForReady: true,
                    error: undefined,
                    errors: undefined,
                    progress: undefined,
                });

                try {
                    await axios({
                      url: 'api/ScratchCard/Deposit',
                      method: 'POST',
                      data: submitValues
                    });
                    await setDepositRequest({
                        ...depositRequest,
                        progress: initProgress,
                    });
                  } catch (error) {
                    await setDepositRequest({
                        ...depositRequest,
                        waitingForReady: false,
                        error: error.title,
                        errors: error.errors,
                        progress: undefined,
                    });
                  }
            }
        });
    }    
    
    function renderStepsContent (currentStep) {
        switch (currentStep) {
            case 'FILL IN FORM':
                return (
                    <ScratchCardForm
                        handleSubmitScratchCard={handleSubmitScratchCard}
                    />
                );

            case 'RESULT':
                return (
                    <ScratchCardResult
                        isSuccessful={depositRequest.isSuccessful}
                        transferResult={depositRequest.transferResult}
                    />
                );
        
            default:
                return;
        }
    }

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
      
    function handleUpdateProgress (e) {
        setDepositRequest({
            ...depositRequest,
            progress: e,
        });
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
        connection.on("Update", handleUpdateProgress);

        connection.start()
        .catch(() => {
            setDepositRequest({
                ...depositRequest,
                error: "Network Error",
                errors: {
                network: "Can't connect to server, please refresh your browser.",
                }
            });   
        });

        connection.invoke("Start", session)
        .then(() => {
            setDepositRequest({
                ...depositRequest,
                error: undefined,
                errors: undefined,
                waitingForReady: false
            });
        })
        .catch(() => {
            setDepositRequest({
                ...depositRequest,
                error: "Network Error",
                errors: {
                    network: "Can't connect to server, please refresh your browser.",
                }
            });
        });

        connection.onclose(() => {
            setDepositRequest({
                ...depositRequest,
                waitingForReady: true,
                error: "Network Error",
                errors: {
                    network: "Connection is closed, please refresh the page.",
                },
                progress: undefined,                    
            });
        });
    }, [])

    const {
        step,
        waitingForReady,
        error,
        errors,
        progress,
    } = depositRequest;

    return (
        <>
            <div className='steps-container'>  
                <Steps current={step} size='small'>
                    {
                        steps.map((item, i) => (
                            <Step key={i} title={item} />
                        ))
                    }
                </Steps>
            </div>
            <div className='deposit-container'>
            {
                false &&
                    <Alert
                        message={error}
                        description={errors.network}
                        type="error"
                        showIcon
                        style={{ marginBottom: "0.5rem" }}
                    />
            }
            <Spin spinning={false}>
                <Card>
                    {
                        renderStepsContent(steps[step])
                    }
                </Card>
            </Spin>
                {
                    progress && showProgress(progress)
                }
            </div>
        </>
    );
}

export default ScratchCard;
