import React, { Component } from "react";
import { Statistic, Form, Icon, Input, Button, Spin } from "antd";
import { isNullOrWhitespace } from "../../utils/utils";
import messages from './messages';
import { injectIntl, FormattedMessage } from 'react-intl';

const { Countdown } = Statistic;

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class OTPFormImpl extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleOTPChanged = e => {
    this.setState({
      otp: e.target.value,
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.handleSubmit(this.state);
      }
    });
  };

  componentDidMount = () => {
    const deadline = Date.now() + 1000 * 180;
    this.setState({
      deadline,
    });
  };

  render() {
    const { getFieldDecorator, getFieldsError } = this.props.form;
    const { deadline } = this.state;
    const { otpReference, intl } = this.props;
    const hint = isNullOrWhitespace(otpReference) ? (
      <b><FormattedMessage {...messages.otpNewRecipient} /></b>
    ) : (
      <b><FormattedMessage {...messages.otpReference} />: {otpReference}</b>
    );
    return (
      <Spin spinning={false}>
        <Form onSubmit={this.handleSubmit}>
          <Form.Item>
            <Countdown title={intl.formatMessage(messages.countdown)} value={deadline} />
          </Form.Item>
          <Form.Item>{hint}</Form.Item>
          <Form.Item>
            {getFieldDecorator("OTP", {
              rules: [
                {
                  required: true,
                  message: intl.formatMessage(messages.placeholders.inputOtp),
                },
              ],
            })(
              <Input
                size="large"
                allowClear
                prefix={
                  <Icon type="safety" style={{ color: "rgba(0,0,0,.25)" }} />
                }
                placeholder={intl.formatMessage(messages.placeholders.inputOtp)}
                onChange={this.handleOTPChanged}
              />
            )}
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
              <FormattedMessage {...messages.submit} />
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    );
  }
}

const OTPForm = Form.create({ name: "otp_form" })(OTPFormImpl);

export default injectIntl(OTPForm);
