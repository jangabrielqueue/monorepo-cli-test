import React from 'react';
import { Spin } from 'antd';
import '../containers/Layout/styles.scss';

const FallbackPage = () => {
  return (
    <div className='wrapper'>
      <div className='container'>
        <div className='form-content'>
          <div className='fallback-container'>
            <Spin />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FallbackPage;