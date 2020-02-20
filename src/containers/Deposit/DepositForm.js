import React, { useState } from "react";
import {
  Statistic,
  Form,
  Icon,
  Input,
  Button,
  Select,
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

const DepositFormImpl = React.memo((props) => {
  const {
    currency,
    merchant,
    requester,
    bank,
    signature,
    reference,
    clientIp,
    datetime,
    amount,
    handleSubmit,
    intl
  } = props;
  const {
    validateFields,
    getFieldDecorator,
    getFieldsError
  } = props.form;
  const showOtpMethod = currency === "VND";
  const bankCodes = getBanksByCurrency(currency);
  const [otpMethodValue, setOtpMethodValue] = useState('1');

  const handleSubmitForm = e => {
    e.preventDefault();
    validateFields((err, values) => {

      if (!err) {
        handleSubmit({
          currency,
          merchant,
          requester,
          bank,
          signature,
          reference,
          clientIp,
          datetime,
          amount,
          otpMethod: otpMethodValue,
          ...values
        });
      }
    });
  };

    return (
        <Form onSubmit={handleSubmitForm}>
          <Form.Item>
            <Statistic
              title={intl.formatMessage(messages.deposit)}
              prefix={currency}
              value={amount}
              valueStyle={{ color: "#000", fontWeight: 700 }}
              precision={2}
            />
          </Form.Item>
          <Form.Item>
            <Select
              defaultValue={bank || getDefaultBankByCurrency(props.currency).code}
              size="large"
              disabled={Boolean(bank)}
            >
              {bankCodes.map(x => (
                <Option key={x.code} value={x.code}>
                  {x.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('username', {
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
              />
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('password', {
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
              />
            )}
          </Form.Item>
          {showOtpMethod && (
            <Form.Item>
              <Select
                defaultValue={otpMethodValue}
                size="large"
                onChange={(val) => {
                  setOtpMethodValue(val);
                }}
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
    );
  });

const DepositForm = Form.create({ name: "deposit_form" })(DepositFormImpl);
export default injectIntl(DepositForm);
