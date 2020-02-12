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
import { getBanksByCurrency } from "../../utils/banks";
import messages from './messages';
import { injectIntl, FormattedMessage } from 'react-intl';

const { Option } = Select;
const { Panel } = Collapse;

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

function getDefaultBankByCurrency(currency) {
  return getBanksByCurrency(currency)[0];
}

class DepositFormImpl extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currency: props.currency,
      merchant: props.merchant,
      requester: props.requester,
      bank: props.bank || getDefaultBankByCurrency(props.currency).code,
      signature: props.signature,
      reference: props.reference,
      clientIp: props.clientIp,
      datetime: props.datetime,
      otpMethod: "1",
    };
  }

  handleBankCodeSelected = value => {
    this.setState({
      bank: value,
    });
  };

  handleLoginNameChanged = e => {
    this.setState({
      username: e.target.value,
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
    const { reference, intl } = this.props;
    const { merchant, requester, currency, otpMethod, bank } = this.state;
    const showOtpMethod = currency === "VND";
    const bankCodes = getBanksByCurrency(currency);

    return (
      <Spin spinning={false}>
        <Form onSubmit={this.handleSubmit}>
          <Form.Item>
            <Statistic
              title={intl.formatMessage(messages.deposit)}
              prefix={this.props.currency}
              value={this.props.amount}
              valueStyle={{ color: "#000", fontWeight: 700 }}
              precision={2}
            />
          </Form.Item>
          <Form.Item>
            <Select
              defaultValue={bank}
              size="large"
              disabled={Boolean(this.props.bank)}
              onChange={this.handleBankCodeSelected}
            >
              {bankCodes.map(x => (
                <Option key={x.code} value={x.code}>
                  {x.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            {getFieldDecorator("Login Name", {
              rules: [
                {
                  required: true,
                  message: intl.formatMessage(messages.placeholders.inputLoginName),
                },
              ],
            })(
              <Input 
                size="large"
                allowClear
                prefix={
                  <Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />
                }
                placeholder={intl.formatMessage(messages.placeholders.loginName)}
                onChange={this.handleLoginNameChanged}
              />
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator("Password", {
              rules: [
                { required: true, message: intl.formatMessage(messages.placeholders.inputPassword) },
              ],
            })(
              <Input.Password
                size="large"
                allowClear
                prefix={
                  <Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />
                }
                placeholder={intl.formatMessage(messages.placeholders.password)}
                onChange={this.handlePasswordChanged}
              />
            )}
          </Form.Item>
          {showOtpMethod && (
            <Form.Item>
              <Select
                defaultValue={otpMethod}
                size="large"
                onChange={this.handleOtpMethodSelected}
              >
                <Option value="1">SMS OTP</Option>
                <Option value="2">Smart OTP</Option>
              </Select>
            </Form.Item>
          )}
          <Form.Item>
            <Button
              size="large"
              type="primary"
              htmlType="submit"
              shape="round"
              block
              disabled={hasErrors(getFieldsError())}
            >
              <FormattedMessage {...messages.submit} />
            </Button>
          </Form.Item>
          <Form.Item>
            <Collapse bordered={false}>
              <Panel
                header={intl.formatMessage(messages.moreInformation)}
                key="1"
                style={{
                  border: "0",
                  fontWeight: 600,
                }}
              >
                <div className="infos">
                  <div className="info-item">
                    <Icon type="key" />
                    <span>{reference}</span>
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

export default injectIntl(DepositForm);
