import React, { useState, useEffect } from 'react';
import {  Result, Statistic } from 'antd';

const ScratchCardResult = (props) => {
  const { isSuccessful, transferResult, successfulUrl, failedUrl } = props
  
  // initialize timeLeft with the seconds prop
  const [timeLeft, setTimeLeft] = useState(10);

  useEffect(() => {
    // exit early when we reach 0
    const redirectUrl = isSuccessful ? successfulUrl : failedUrl;

    if (!timeLeft) {
      return window.location.replace(redirectUrl);
    };

    // save intervalId to clear the interval when the
    // component re-renders
    const intervalId = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    // clear interval on re-render to avoid memory leaks
    return () => clearTimeout(intervalId);
    // add timeLeft as a dependency to re-rerun the effect
    // when we update it
  }, [timeLeft]);

  return (
      <Result
        status={isSuccessful ? 'success' : 'error'}
        title={isSuccessful ? 'Successfully Deposit!' : 'Submitted Transaction Failed!'}
        subTitle={`${isSuccessful ? 'References: ' + transferResult.reference : transferResult.statusMessage}`}
      >
        <p>You will be redirected to merchant website in {timeLeft} seconds.</p>
        {
          isSuccessful &&
            <Statistic
              prefix={transferResult.currency}
              value={transferResult.actualAmount}
              valueStyle={{ color: "#000", fontWeight: 700 }}
              precision={2}
            />
        }
      </Result>
  );
}

export default ScratchCardResult;
