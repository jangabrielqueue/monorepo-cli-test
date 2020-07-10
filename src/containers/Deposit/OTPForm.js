import React, { useEffect } from 'react';
import { Form, Input, Button, Spin } from 'antd';
import { isNullOrWhitespace } from '../../utils/utils';
import messages from './messages';
import { injectIntl, FormattedMessage } from 'react-intl';
import { ReactComponent as OTPSubmitIcon } from '../../assets/icons/submit-otp.svg';
import { checkBankIfKnown } from "../../utils/banks";

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

const OTPFormImpl = React.memo((props) => {
  const { getFieldDecorator, getFieldsError, validateFields, resetFields } = props.form;
  const { handleSubmitOTP, otpReference, intl, waitingForReady, bank, currency, progress } = props;
  const isBankKnown = checkBankIfKnown(currency, bank && bank.toUpperCase());
  const buttonOtpBG = isBankKnown ? `button-otp-${bank && bank.toLowerCase()}` : 'button-otp-unknown';

  function handleSubmitForm (e) {
    e.preventDefault();

    validateFields((err, { OTP }) => {
      if (!err) {
        handleSubmitOTP(OTP);
      }
    });
  };

  useEffect(() => {
    if (progress) {
      resetFields();
    }
  }, [progress, resetFields]);

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
              <Form.Item label={intl.formatMessage(messages.otpReference)}>
                {otpReference}
              </Form.Item>
            </div>
          }
          <div className='form-icon-container username'>
            <Form.Item label={intl.formatMessage(messages.placeholders.inputOtp)} htmlFor='input_otp'>
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
                    id='input_otp'
                    autoComplete='off'
                  />
                )
              }
            </Form.Item>
          </div>
          <div className='form-content-submit-container'>
            <Button
              size='large'
              htmlType='submit'
              loading={waitingForReady}
              disabled={hasErrors(getFieldsError())}
              className={buttonOtpBG}
            >
              {
                !waitingForReady &&
                <div className='button-content'>
                  <OTPSubmitIcon /> <FormattedMessage {...messages.submit} />
                </div>
              }
            </Button>
          </div>
        </Form>
      </Spin>
    </main>
  );
});

const OTPForm = Form.create({ name: 'otp_form' })(OTPFormImpl);
export default injectIntl(OTPForm);
