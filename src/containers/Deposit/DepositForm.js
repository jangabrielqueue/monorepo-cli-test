import React, { useState } from 'react';
import { getBanksByCurrency, checkBankIfKnown } from '../../utils/banks';
import messages from './messages';
import { FormattedMessage } from 'react-intl';
import GlobalButton from '../../components/GlobalButton';
import CollapsiblePanel from '../../components/CollapsiblePanel';
import styled from 'styled-components';
import accountIcon from '../../assets/icons/account.png';
import currencyIcon from '../../assets/icons/currency.png';
import usernameIcon from '../../assets/icons/username.svg';
import passwordIcon from '../../assets/icons/password.svg';
import bankIcon from '../../assets/icons/bank-name.svg';
import { useFormContext } from 'react-hook-form';

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

const FormIconContainer = styled.div`
  display: flex;

  &:before {
    background: url(${props => {
      if (props.icon === 'username') {
        return usernameIcon;
      } else if (props.icon === 'password') {
        return passwordIcon;
      } else if (props.icon === 'bank') {
        return bankIcon;
      }
    }}) no-repeat center;
    content: '';
    display: block;
    height: 20px;
    margin: 15px 15px 0 0;
    width: 20px;
  }

  > div {
    flex: 0 1 415px;
  }
`;

const FormSelectField = styled.select`
  margin-bottom: 23px;
`;

const InputFieldContainer = styled.div`
  position: relative;

  ul {
    align-items: center;
    display: flex;
    justify-content: space-between;
    list-style: none;
    margin: 0;
    padding: 0;
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    width: ${props => props.passwordIcon ? '40px' : 'auto'};

    > li:nth-child(odd) {
      height: 14px;
      width: 14px;

      span {
        align-items: center;
        background: #C0C0C0;
        border-radius: 50%;
        color: #FFF;
        cursor: pointer;
        display: flex;
        font-size: 14px;
        height: 100%;
        justify-content: center;
        line-height: 1.5;
        width: 100%;
      }
    }

    > li:nth-child(even) {
      cursor: pointer;
      height: 16px;
      width: 16px;

      > img {
        width: 100%;
      }
    }
  }
`;

const DepositForm = React.memo((props) => {
  const {
    currency,
    bank,
    reference,
    handleSubmitDeposit,
    waitingForReady,
    showOtpMethod,
    windowDimensions,
    establishConnection
  } = props;
  const bankCodes = getBanksByCurrency(currency);
  const isBankKnown = checkBankIfKnown(currency, bank);
  const buttonColor = isBankKnown ? `${bank.toLowerCase()}` : 'main';
  const renderIcon = isBankKnown ? `${bank.toLowerCase()}`: 'unknown';
  const [showPassword, setShowPassword] = useState(false);

  const { register, errors, handleSubmit, setValue, getValues, formState } = useFormContext();
  const { dirty } = formState;
  const formValues = getValues();

  function handleSubmitForm (values, e, type) {
    handleSubmitDeposit(values, e, type);
  };

    return (
      <main>
        <form autoComplete='off'>
          {
              !isBankKnown &&
              <FormIconContainer icon='bank'>
                <div>
                  <label htmlFor='bank'><FormattedMessage {...messages.placeholders.bankName} /></label>
                  <FormSelectField 
                    name='bank'
                    id='bank'
                    ref={register}
                    aria-owns='1 2 3 4 5 6 7 8 9'
                  >
                    {
                      bankCodes.map((bc, i) => (
                        <option key={bc.code} value={bc.code}>
                          {
                            bc.name
                          }
                        </option>
                      ))
                    }
                  </FormSelectField>
                </div>
              </FormIconContainer>
            }
            <FormIconContainer icon='username'>
              <div>
                <label htmlFor='username'><FormattedMessage {...messages.placeholders.loginName} /></label>
                <InputFieldContainer>
                  <input 
                    ref={register({ required: <FormattedMessage {...messages.placeholders.inputLoginName} /> })} 
                    type='text' 
                    id='username' 
                    name='username' 
                    autoComplete='off' 
                  />
                  <ul>
                    {
                      (formValues.username !== '' && dirty) &&
                      <li onClick={() => setValue('username', '')}><span>&times;</span></li>
                    }
                  </ul>
                </InputFieldContainer>
                <p className='input-errors'>{errors.username?.message}</p>
              </div>
            </FormIconContainer>
            <FormIconContainer icon='password'>
              <div>
                <label htmlFor='password'><FormattedMessage {...messages.placeholders.password} /></label>
                <InputFieldContainer passwordIcon>
                  <input 
                    ref={register({ required: <FormattedMessage {...messages.placeholders.inputPassword} /> })}  
                    type={showPassword ? 'text' : 'password'} 
                    id='password' 
                    name='password' 
                    autoComplete='off' 
                  />
                  <ul>
                    {
                      (formValues.password !== '' && dirty) ?
                      <li onClick={() => setValue('password', '')}><span>&times;</span></li> :
                      <li>&nbsp;</li>
                    }
                    <li onClick={() => setShowPassword(prevState => !prevState)}>
                      <img src={require(`../../assets/icons/${showPassword ? 'password-show' : 'password-hide'}.png`)} />
                    </li>
                  </ul>
                </InputFieldContainer>
                <p className='input-errors'>{errors.password?.message}</p>
              </div>
            </FormIconContainer>
            <CollapsiblePanel
              title={<FormattedMessage {...messages.moreInformation} />}
            >
            <StyledMoreInfo>
              <li>{reference}</li>
              <li>{currency}</li>
            </StyledMoreInfo>
            </CollapsiblePanel>
        </form>
        {
          !showOtpMethod &&
          <div className='form-content-submit-container'>
            <GlobalButton
                label={<FormattedMessage {...messages.submit} />}
                color={buttonColor}
                icon={<img alt='submit' src={require('../../assets/icons/submit-otp.svg')} />}
                onClick={handleSubmit(handleSubmitForm)}
                disabled={!establishConnection || waitingForReady}
              />
          </div>
        }
        {
          (showOtpMethod && windowDimensions.width > 576) &&
          <div className='deposit-submit-buttons'>
              <GlobalButton
                label='SMS OTP'
                color={buttonColor}
                outlined
                icon={<img alt='sms' src={require(`../../assets/icons/${renderIcon}/sms-${renderIcon}.svg`)} />}
                onClick={handleSubmit((values, e) => handleSubmitForm(values, e, 'sms'))}
                disabled={!establishConnection || waitingForReady}
              />
              <GlobalButton
                label='SMART OTP'
                color={buttonColor} 
                outlined
                icon={<img alt='smart' src={require(`../../assets/icons/${renderIcon}/smart-${renderIcon}.svg`)} />}
                onClick={handleSubmit((values, e) => handleSubmitForm(values, e, 'smart'))}
                disabled={!establishConnection || waitingForReady}
              />
          </div>          
        }
      </main>
    );
  });

export default DepositForm;
