import React, { Component } from "react";
import {
  Statistic,
  Form,
  Icon,
  Input,
  Button,
  Select,
  Spin,
  Collapse,
} from "antd";
import { getBanksByCurrency } from "./banks";

const { Option } = Select;
const { Panel } = Collapse;

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class DepositFormImpl extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currency: props.currency,
      merchantId: props.merchant,
      customerId: props.customer,
      bankCode: undefined,
      otpMethod: "SMS",
    };
  }

  handleBankCodeSelected = value => {
    this.setState({
      bankCode: value,
    });
  };

  handleLoginNameChanged = e => {
    this.setState({
      loginName: e.target.value,
    });
  };

  handlePasswordChanged = e => {
    this.setState({
      password: e.target.value,
    });
  };

  handleOtpMethodSelected = value => {
    this.setState({
      otpMethod: value,
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.handleSubmit({
          ...this.state,
          amount: this.props.amount,
        });
      }
    });
  };

  render() {
    const { getFieldDecorator, getFieldsError } = this.props.form;
    const { referenceId } = this.props;
    const {
      merchantId,
      customerId,
      currency,
      otpMethod,
    } = this.state;
    const bankCodes = getBanksByCurrency(currency);
    const bankCode = this.state.bankCode || bankCodes[0];
    return (
      <Spin spinning={false}>
        <Form onSubmit={this.handleSubmit}>
          <Form.Item>
            <Statistic
              title="Deposit"
              prefix={this.props.currency}
              value={this.props.amount}
              valueStyle={{ color: "#000", fontWeight: 700 }}
              precision={2}
            />
          </Form.Item>
          <Form.Item>
            <Select
              defaultValue={bankCode}
              size="large"
              onChange={this.handleBankCodeSelected}
            >
              {bankCodes.map(x => (
                <Option value={x}>{x}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            {getFieldDecorator("Login Name", {
              rules: [
                {
                  required: true,
                  message: "Please input your online banking login name!",
                },
              ],
            })(
              <Input
                size="large"
                allowClear
                prefix={
                  <Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />
                }
                placeholder="Online banking login name"
                onChange={this.handleLoginNameChanged}
              />
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator("Password", {
              rules: [
                { required: true, message: "Please input your Password!" },
              ],
            })(
              <Input.Password
                size="large"
                allowClear
                prefix={
                  <Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />
                }
                placeholder="Password"
                onChange={this.handlePasswordChanged}
              />
            )}
          </Form.Item>
          <Form.Item>
            <Select
              defaultValue={otpMethod}
              size="large"
              onChange={this.handleOtpMethodSelected}
            >
              <Option value="SMS">SMS OTP</Option>
              <Option value="SMART_OTP">Smart OTP</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button
              size="large"
              type="primary"
              htmlType="submit"
              shape="round"
              block
              disabled={hasErrors(getFieldsError())}
            >
              Submit
            </Button>
          </Form.Item>
          <Form.Item>
            <Collapse bordered={false}>
              <Panel
                header={"More about deposit to " + merchantId}
                key="1"
                style={{
                  border: "0",
                  fontWeight: 600,
                }}
              >
                <div className="infos">
                  <div className="info-item">
                    <Icon type="key" />
                    <span>{referenceId}</span>
                  </div>
                  <div className="info-item">
                    <Icon type="safety" />
                    <span>{merchantId}</span>
                  </div>
                  <div className="info-item">
                    <Icon type="user" />
                    <span>{customerId}</span>
                  </div>
                  <div className="info-item">
                    <Icon type="pay-circle" />
                    <span>{currency}</span>
                  </div>
                </div>
              </Panel>
            </Collapse>
          </Form.Item>
        </Form>
      </Spin>
    );
  }
}

const DepositForm = Form.create({ name: "deposit_form" })(DepositFormImpl);

export default DepositForm;
