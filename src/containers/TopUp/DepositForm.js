import React from 'react';
import { getBanksByCurrencyForTopUp } from './../../utils/banks';
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
    flex-grow: 1;
  }
`;

const FormSelectField = styled.select`
  margin-bottom: 23px;
`;

const DepositForm = React.memo((props) => {
  const {
    currency,
    merchant,
    requester,
    amount,
    signature,
    reference,
    clientIp,
    datetime,
    handleSubmitDeposit,
    waitingForReady,
    intl,
    windowDimensions,
    establishConnection
  } = props;
  const bankCodes = getBanksByCurrencyForTopUp(currency);
  const buttonColor = 'topup';

  const { register, errors, handleSubmit } = useFormContext();

  function handleSubmitForm (values, e, type) {
    // const otpType = (type === 'sms' || type === undefined) ? '1' : '2';
    console.log('values, e, type', values, e, type)
    // validateFields((err, values) => {
    //   if (!err) {
    //     handleSubmitDeposit({
    //       currency,
    //       merchant,
    //       requester,
    //       bank: getDefaultBankByCurrency(props.currency).code,
    //       signature,
    //       reference,
    //       clientIp,
    //       datetime,
    //       amount,
    //       otpMethod: otpType,
    //       ...values
    //     });
    //   }
    // });
  };

    return (
      <main>
        <form>
          <FormIconContainer icon='bank'>
            <div>
              <label htmlFor='bank'>Bank Name</label>
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
          <FormIconContainer icon='username'>
            <div>
              <label htmlFor='username'><FormattedMessage {...messages.placeholders.loginName} /></label>
              <input 
                ref={register({ required: <FormattedMessage {...messages.placeholders.inputLoginName} /> })} 
                type='text' 
                id='username' 
                name='username' 
                autoComplete='off' 
              />
              <p className='input-errors'>{errors.username?.message}</p>
            </div>
          </FormIconContainer>
          <FormIconContainer icon='password'>
            <div>
              <label htmlFor='password'><FormattedMessage {...messages.placeholders.password} /></label>
              <input 
                ref={register({ required: <FormattedMessage {...messages.placeholders.inputPassword} /> })}  
                type='password' 
                id='password' 
                name='password' 
                autoComplete='off' 
              />
              <p className='input-errors'>{errors.password?.message}</p>
            </div>
          </FormIconContainer>
          <CollapsiblePanel
            title={<FormattedMessage {...messages.moreInformation} />}
          >
          <StyledMoreInfo>
            <li>{reference}</li>
            <li>{merchant}</li>
            <li>{requester}</li>
            <li>{currency}</li>
          </StyledMoreInfo>
          </CollapsiblePanel>
        </form>
        {
          (windowDimensions.width > 576) &&
          <div className='deposit-submit-top-up-buttons'>
            {/* <Button size='large' onClick={() => handleRefFormSubmit('sms')} disabled={hasFieldError || !establishConnection}>
              SMS OTP
            </Button>
            <Button size='large' onClick={() => handleRefFormSubmit('smart')} disabled={hasFieldError || !establishConnection}>
              SMART OTP
            </Button>      */}
            <GlobalButton
              label='SMS OTP'
              color={buttonColor}
              outlined
              onClick={handleSubmit((values, e) => handleSubmitForm(values, e, 'sms'))}
              disabled={!establishConnection || waitingForReady}
            />
            <GlobalButton
              label='SMART OTP'
              color={buttonColor} 
              outlined
              onClick={handleSubmit((values, e) => handleSubmitForm(values, e, 'smart'))}
              disabled={!establishConnection || waitingForReady}
            />
          </div>          
        }
      </main>
    );
  });

export default DepositForm;
