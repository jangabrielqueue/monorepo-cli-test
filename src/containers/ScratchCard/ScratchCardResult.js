import React, { useState, useEffect } from 'react';
import { Button, Result, Icon, Spin } from 'antd';

const ScratchCardResult = (props) => {
  const { isSuccessful, transferResult } = props
  console.log('isSuccessful, transferResult', isSuccessful, transferResult)
  // initialize timeLeft with the seconds prop
  const [timeLeft, setTimeLeft] = useState(20);

  useEffect(() => {
    // exit early when we reach 0
    if (!timeLeft) {
      // return window.location.replace(redirectUri);
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

  function handleRedirect () {
    // return window.location.replace(redirectUri);
  }

  return (
      <div className='scratch-result-container'>
        <Result
          status={isSuccessful ? 'success' : 'error'}
          title='Payment Result'
          subTitle={`${isSuccessful ? 'The transaction has completed successfully.' : 'Deposit transaction is existing..'} You will be redirected to merchant website in ${timeLeft} seconds.`}
          extra={
              <Button type='primary' onClick={handleRedirect}>
                  Close
              </Button>
          }
        />
      </div>
  );
}

export default ScratchCardResult;
