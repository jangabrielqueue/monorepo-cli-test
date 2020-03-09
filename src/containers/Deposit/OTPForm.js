import React from 'react';
import { Form, Input, Button, Spin } from 'antd';
import { isNullOrWhitespace } from '../../utils/utils';
import messages from './messages';
import { injectIntl, FormattedMessage } from 'react-intl';
import { ReactComponent as OTPSubmitIcon } from '../../assets/icons/submit-otp.svg';

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

const OTPFormImpl = React.memo((props) => {
  const { getFieldDecorator, getFieldsError, validateFields } = props.form;
  const { handleSubmitOTP, otpReference, intl, waitingForReady } = props;

  function handleSubmitForm (e) {
    e.preventDefault();

    validateFields((err, { OTP }) => {
      if (!err) {
        handleSubmitOTP(OTP);
      }
    });
  };

  return (
    <main>
      <Spin spinning={waitingForReady}>
        <Form layout='vertical' onSubmit={handleSubmitForm} hideRequiredMark={true}>
          {
            isNullOrWhitespace(otpReference) ?
            <div className='form-otp-new-recipient'>
              <FormattedMessage {...messages.otpNewRecipient} />
            </div> :
            <div className='form-icon-container otp-reference'>
              <Form.Item label='OTP Reference'>
                {otpReference}
              </Form.Item>
            </div>
          }
          <div className='form-icon-container username'>
            <Form.Item label='Input OTP Received from Bank' htmlFor='input_otp'>
              {
                getFieldDecorator('OTP', {
                  rules: [
                    {
                      required: true,
                      message: intl.formatMessage(messages.placeholders.inputOtp),
                    },
                  ],
                })(
                  <Input
                    size='large'
                    allowClear
                    placeholder={intl.formatMessage(messages.placeholders.inputOtp)}
                    id='input_otp'
                  />
                )
              }
            </Form.Item>
          </div>
          <div className='form-content-submit-container'>
            <Button
              size='large'
              type='primary'
              htmlType='submit'
              block
              disabled={hasErrors(getFieldsError())}
              className='otp-submit'
            >
              <OTPSubmitIcon /> <FormattedMessage {...messages.submit} />
            </Button>
          </div>
        </Form>
      </Spin>
    </main>
  );

});

const OTPForm = Form.create({ name: 'otp_form' })(OTPFormImpl);
export default injectIntl(OTPForm);
