import React from "react";
import styled from "styled-components";

const StyledCountdown = styled.div`
  position: absolute;
  top: 0;
  padding: 10px;
  background: #ffffcc;
  color: #3e3e3e;
  font-size: smaller;
  b {
    font-weight: 700;
    color: black;
  }
`;

const en = (
  <StyledCountdown>
    <div>
      - For customers already having VCB Digibank account:{" "}
      <b>Username is Phone number registered for this service</b>
    </div>
    <div>
      - For customers not having VCB Digibank account:{" "}
      <b>Username is VCB-iB@nking username</b>, used to transform to VCB
      Digibank.
    </div>
  </StyledCountdown>
);

const vn = (
  <StyledCountdown>
    <div>
      - Với khách hàng đã có tài khoản VCB Digibank:{" "}
      <b>Tên đăng nhập là Số điện thoại đăng ký dịch vụ.</b>
    </div>
    <div>
      - Với khách hàng chưa có tài khoản VCB Digibank:{" "}
      <b>Tên đăng nhập là Tên đăng nhập VCB-iB@nking</b>, để thực hiện chuyển
      đổi sang dịch vụ VCB Digibank mới.
    </div>
  </StyledCountdown>
);

const Notifications = ({ bank, language }) => {
  const element = language === "vi-vn" ? vn : en;
  return bank === "VCB" && element;
};

export default Notifications;
