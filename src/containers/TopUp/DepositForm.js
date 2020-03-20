import React, { useEffect } from 'react';
import {
  Form,
  Icon,
  Input,
  Button,
  Select,
  Collapse,
  Spin
} from 'antd';
import { getBanksByCurrencyForTopUp } from './../../utils/banks';
import messages from './messages';
import { injectIntl } from 'react-intl';
import './styles.scss';

const { Option } = Select;
const { Panel } = Collapse;

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

function getDefaultBankByCurrency(currency) {
  return getBanksByCurrencyForTopUp(currency)[0];
}

const DepositFormImpl = React.memo((props) => {
  const {
    currency,
    merchant,
    requester,
    amount,
    signature,
    reference,
    clientIp,
    datetime,
    handleSubmit,
    refFormSubmit,
    handleHasFieldError,
    waitingForReady,
    intl,
    hasFieldError,
    handleRefFormSubmit,
    windowDimensions
  } = props;
  const {
    validateFields,
    getFieldDecorator,
    getFieldsError
  } = props.form;
  const bankCodes = getBanksByCurrencyForTopUp(currency);
  const getFieldsErrorDepArray = getFieldsError(); // declared a variable for this dep array to remove warning from react hooks, but still uses the same props as well for dep array.

  function handleSubmitForm (type) {
    const otpType = (type === 'sms' || type === undefined) ? '1' : '2';

    validateFields((err, values) => {
      if (!err) {
        handleSubmit({
          currency,
          merchant,
          requester,
          bank: getDefaultBankByCurrency(props.currency).code,
          signature,
          reference,
          clientIp,
          datetime,
          amount,
          otpMethod: otpType,
          ...values
        });
      }
    });
  };

  useEffect(() => {
    handleHasFieldError(hasErrors(getFieldsError()))
  }, [getFieldsErrorDepArray, getFieldsError, handleHasFieldError])

    return (
      <main>
        <Spin spinning={waitingForReady}>
          <Form layout='vertical' ref={refFormSubmit} hideRequiredMark={true} onSubmit={handleSubmitForm}>
          <div className='form-icon-container bank-name'>
            <Form.Item label='Bank Name'>
              {
                getFieldDecorator('bank', {
                  initialValue: getDefaultBankByCurrency(props.currency).code
                })(
                  <Select
                    size='large'
                    aria-owns='1 2 3 4 5 6 7 8 9'
                  >
                    {bankCodes.map(x => (
                      <Option key={x.code} value={x.code}>
                        {x.name}
                      </Option>
                    ))}
                  </Select>
                )
              }
              </Form.Item>
          </div>
          <div className='form-icon-container username'>
            <Form.Item label='Online Banking Login Name' htmlFor='deposit_form_username'>
                {getFieldDecorator('username', {
                  rules: [
                    {
                      required: true,
                      message: intl.formatMessage(messages.placeholders.inputLoginName),
                    },
                  ],
                })(
                  <Input
                    size='large'
                    allowClear
                    placeholder={intl.formatMessage(messages.placeholders.loginName)}
                    id='deposit_form_username'
                  />
                )}
              </Form.Item>
          </div>
          <div className='form-icon-container password'>
            <Form.Item label='Password' htmlFor='deposit_form_password'>
                {getFieldDecorator('password', {
                  rules: [
                    { required: true, message: intl.formatMessage(messages.placeholders.inputPassword) },
                  ],
                })(
                  <Input.Password
                    size='large'
                    allowClear
                    placeholder={intl.formatMessage(messages.placeholders.password)}
                    id='deposit_form_password'
                  />
                )}
              </Form.Item>
          </div>
          <div className='more-info-form-item'>
            <Collapse bordered={false}>
                <Panel
                  header={'More about deposit to ' + merchant}
                  key='1'
                  style={{
                    border: '0',
                    fontWeight: 600,
                  }}
                >
                  <div className='infos'>
                    <div className='info-item'>
                      <Icon type='key' />
                      <span>{reference}</span>
                    </div>
                    <div className='info-item'>
                      <Icon type='safety' />
                      <span>{merchant}</span>
                    </div>
                    <div className='info-item'>
                      <Icon type='user' />
                      <span>{requester}</span>
                    </div>
                    <div className='info-item'>
                      <Icon type='pay-circle' />
                      <span>{currency}</span>
                    </div>
                  </div>
                </Panel>
              </Collapse>
            </div>
          </Form>
        </Spin>
        {
          (windowDimensions.width > 576) &&
          <div className='deposit-submit-top-up-buttons'>
            <Button size='large' onClick={() => handleRefFormSubmit('sms')} disabled={hasFieldError}>
              SMS OTP
            </Button>
            <Button size='large' onClick={() => handleRefFormSubmit('smart')} disabled={hasFieldError}>
              SMART OTP
            </Button>     
          </div>          
        }
      </main>
    );
  });

const DepositForm = Form.create({ name: 'deposit_form' })(DepositFormImpl);
export default injectIntl(DepositForm);
