import React, { Component } from "react";
import { Statistic, Form, Icon, Input, Button, Spin } from "antd";
import { isNullOrWhitespace } from "../../utils/utils";

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
    const { otpReference } = this.props;
    const hint = isNullOrWhitespace(otpReference) ? (
      <b>OTP for new recipient</b>
    ) : (
      <b>OTP Reference: {otpReference}</b>
    );
    return (
      <Spin spinning={false}>
        <Form onSubmit={this.handleSubmit}>
          <Form.Item>
            <Countdown title="Countdown" value={deadline} />
          </Form.Item>
          <Form.Item>{hint}</Form.Item>
          <Form.Item>
            {getFieldDecorator("OTP", {
              rules: [
                {
                  required: true,
                  message: "Please input OTP received from bank!",
                },
              ],
            })(
              <Input
                size="large"
                allowClear
                prefix={
                  <Icon type="safety" style={{ color: "rgba(0,0,0,.25)" }} />
                }
                placeholder="Please input OTP received from bank"
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
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    );
  }
}

const OTPForm = Form.create({ name: "otp_form" })(OTPFormImpl);

export default OTPForm;
