import React, { useState, useCallback } from 'react';
import { Steps } from "antd";
import ScratchCardForm from './ScratchCardForm';
import ScratchCardResult from './ScratchCardResult';
import './styles.scss';

const { Step } = Steps;

const ScratchCard = (props) => {
    const [current, setCurrent] = useState(0);
    const steps = ['FILL IN FORM', 'RESULT'];
    const [resultStatus, setResultStatus] = useState('');
    const [redirectUri, setRedirectUri] = useState('');

    const handleCurrentStep = useCallback((status, uri) => {
        setCurrent(prevState => prevState + 1);
        setResultStatus(status);
        setRedirectUri(uri);
    }, [setCurrent]);

    function renderStepsContent (currentStep) {
        switch (currentStep) {
            case 'FILL IN FORM':
                return (
                    <ScratchCardForm
                        handleCurrentStep={handleCurrentStep}
                        {...props}
                    />
                );

            case 'RESULT':
                return (
                    <ScratchCardResult
                        resultStatus={resultStatus}
                        redirectUri={redirectUri}
                    />
                );
        
            default:
                return;
        }
    }

    return (
        <div className='steps-container'>  
            <Steps current={current} labelPlacement='vertical'>
                {
                    steps.map((item, i) => (
                        <Step key={i} title={item} />
                    ))
                }
            </Steps>
            {
                renderStepsContent(steps[current])
            }
        </div>
    );
}

export default ScratchCard;
