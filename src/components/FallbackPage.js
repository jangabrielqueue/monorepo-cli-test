import React from "react";
import { Spin, Card, Steps } from 'antd';
import '../containers/Layout/styles.scss';

const FallbackPage = (props) => {
  const { Step } = Steps;

  return (
    <>
      <div className="steps-container">
        <Steps size="small" current={0}>
          <Step title='LOGIN' />
          {
            window.location.pathname === '/deposit/bank' &&
            <Step title='AUTHORIZATION' />
          }
          <Step title='RESULT' />
        </Steps>
      </div>
      <div className="fallback-container">
        <Card>
          <Spin />
        </Card>
      </div>
    </>
  );
};

export default FallbackPage;