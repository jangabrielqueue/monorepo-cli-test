import React from "react";
import { Spin, Card } from 'antd';
import Logo from "./Logo";
import '../containers/Layout/styles.scss';

const FallbackPage = () => {
  return (
    <div className="main">
      <div className="logo-container">
        <Logo bank='FAKER' />
      </div>
      <div className="fallback-container">
        <Card>
          <Spin />
        </Card>
      </div>
    </div>
  );
};

export default FallbackPage;