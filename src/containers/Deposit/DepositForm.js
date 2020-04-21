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
import { getBanksByCurrency, checkBankIfKnown } from '../../utils/banks';
import messages from './messages';
import { injectIntl, FormattedMessage } from 'react-intl';
import './styles.scss';
import GlobalButton from '../../components/GlobalButton';
import CollapsiblePanel from '../../components/CollapsiblePanel';
import styled from 'styled-components';
import accountIcon from '../../assets/icons/account.png';
import currencyIcon from '../../assets/icons/currency.png';
import bankIcon from '../../assets/icons/bank-name.svg';
import usernameIcon from '../../assets/icons/username.svg';
import passwordIcon from '../../assets/icons/password.svg';

const { Option } = Select;
const { Panel } = Collapse;

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

function getDefaultBankByCurrency(currency) {
  return getBanksByCurrency(currency)[0];
}

const StyledMoreInfo = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0 25px;

  > li {
    padding-bottom: 5px;
    
    &:before {
      content: '';
      display: inline-block;
      height: 20px;
      margin-right: 5px;
      vertical-align: middle;
      width: 20px;
    }

    &:first-child {
      &:before {
        background: url(${accountIcon}) no-repeat center;
      }
    }

    &:last-child {
      &:before {
        background: url(${currencyIcon}) no-repeat center;
      }
    }
  }
`;

const FormIconContainer = styled.fieldset`
  margin-bottom: 25px;

  &:before {
    content: '';
    display: inline-block;
    width: 20px;
    height: 20px;
    background: url(${usernameIcon}) no-repeat center;
  }
`;

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
    refFormSubmit,
    handleHasFieldError,
    intl,
    waitingForReady,
    hasFieldError,
    showOtpMethod,
    handleRefFormSubmit,
    windowDimensions,
    establishConnection
  } = props;
  const {
    validateFields,
    getFieldDecorator,
    getFieldsError
  } = props.form;
  const bankCodes = getBanksByCurrency(currency);
  const isBankKnown = checkBankIfKnown(currency, bank);
  const getFieldsErrorDepArray = getFieldsError(); // declared a variable for this dep array to remove warning from react hooks, but still uses the same props as well for dep array.
  const buttonColor = isBankKnown ? `${bank.toLowerCase()}` : 'main';
  const renderIcon = isBankKnown ? `${bank.toLowerCase()}`: 'unknown';
  
  function handleSubmitForm (type) {
    const otpType = (type === 'sms' || type === undefined) ? '1' : '2';

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
        {/* <Spin spinning={waitingForReady}>
          <Form layout='vertical' ref={refFormSubmit} hideRequiredMark={true} onSubmit={handleSubmitForm}>
            {
              !isBankKnown &&
              <div className='form-icon-container bank-name'>
                <Form.Item label={intl.formatMessage(messages.placeholders.bankName)}>
                  {
                    getFieldDecorator('bank', {
                      initialValue: getDefaultBankByCurrency(props.currency).code
                    })(
                      <Select
                        size='large'
                        aria-owns='1 2 3 4 5 6 7 8 9'
                      >
                        {bankCodes.map((x, i)=> (
                          <Option key={x.code} id={i} value={x.code}>
                            {x.name}
                          </Option>
                        ))}
                      </Select>
                    )
                  }
                </Form.Item>
              </div>
            }
          <div className='form-icon-container username'>
            <Form.Item label={intl.formatMessage(messages.placeholders.loginName)} htmlFor='deposit_form_username'>
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
                  id='deposit_form_username'
                  autoComplete='off'
                />
              )}
            </Form.Item>
          </div>
          <div className='form-icon-container password'>
            <Form.Item label={intl.formatMessage(messages.placeholders.password)} htmlFor='deposit_form_password'>
              {getFieldDecorator('password', {
                rules: [
                  { required: true, message: intl.formatMessage(messages.placeholders.inputPassword) },
                ],
              })(
                <Input.Password
                  size='large'
                  allowClear
                  id='deposit_form_password'
                  autoComplete='off'
                />
              )}
            </Form.Item>
          </div>
          <CollapsiblePanel
            title={intl.formatMessage(messages.moreInformation)}
          >
            <StyledMoreInfo>
              <li>{reference}</li>
              <li>{currency}</li>
            </StyledMoreInfo>
          </CollapsiblePanel>
           <div className='more-info-form-item'>
            <Collapse bordered={false}>
              <Panel
                header={intl.formatMessage(messages.moreInformation)}
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
                    <Icon type='pay-circle' />
                    <span>{currency}</span>
                  </div>
                </div>
              </Panel>
            </Collapse>
          </div>
        </Form>
        </Spin> */}
        <form>
            <FormIconContainer icon='username'>
                <label htmlFor='username'>Online Banking Login Name</label>
                <input type='text' id='username' name='username' />
            </FormIconContainer>
            <FormIconContainer icon='password'>
                <label htmlFor='password'>Password</label>
                <input type='text' id='password' name='password' />
            </FormIconContainer>
        </form>
        {
          !showOtpMethod &&
          <div className='form-content-submit-container'>
            {/* <Button
              className={buttonBG}
              size='large'
              htmlType='submit'
              disabled={hasFieldError || !establishConnection}
              loading={waitingForReady}
              onClick={() => handleRefFormSubmit(undefined)}
            >
              {
                !waitingForReady &&
                <>
                  <OTPSubmitIcon /> <FormattedMessage {...messages.submit} />
                </>
              }
            </Button> */}
            <GlobalButton
                label={<FormattedMessage {...messages.submit} />}
                color={buttonColor}
                icon={<img alt='sms' src={require('../../assets/icons/submit-otp.svg')} />}
                onClick={() => undefined}
                disabled={!establishConnection || waitingForReady}
              />
          </div>
        }
        {
          (showOtpMethod && windowDimensions.width > 576) &&
          <div className='deposit-submit-buttons'>
            {/* <Button className={buttonBG} size='large' onClick={() => handleRefFormSubmit('sms')} disabled={hasFieldError || !establishConnection}>
              {
                !waitingForReady &&
                <img alt='sms' src={require(`../../assets/icons/${renderIcon}/sms-${renderIcon}.svg`)} />
              }
              SMS OTP
            </Button>
            <Button className={buttonBG} size='large' onClick={() => handleRefFormSubmit('smart')} disabled={hasFieldError || !establishConnection}>
              {
                !waitingForReady &&
                <img alt='smart' src={require(`../../assets/icons/${renderIcon}/smart-${renderIcon}.svg`)} />
              }
              SMART OTP
            </Button>      */}
              <GlobalButton
                label='SMS OTP'
                color={buttonColor}
                outlined
                icon={<img alt='sms' src={require(`../../assets/icons/${renderIcon}/sms-${renderIcon}.svg`)} />}
                onClick={() => undefined}
                disabled={!establishConnection || waitingForReady}
              />
              <GlobalButton
                label='SMART OTP'
                color={buttonColor} 
                outlined
                icon={<img alt='smart' src={require(`../../assets/icons/${renderIcon}/smart-${renderIcon}.svg`)} />}
                onClick={() => undefined}
                disabled={!establishConnection || waitingForReady}
              />
          </div>          
        }
      </main>
    );
  });

const DepositForm = Form.create({ name: 'deposit_form' })(DepositFormImpl);
export default injectIntl(DepositForm);
