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

    &:nth-child(1) {
      &:before {
        background: url(${accountIcon}) no-repeat center;
      }
    }

    &:nth-child(2) {
      &:before {
        background: url(${usernameIcon}) no-repeat center;
      }
    }

    &:nth-child(3) {
      &:before {
        background: url(${usernameIcon}) no-repeat center;
      }
    }

    &:nth-child(4) {
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

const DepositForm = React.memo((props) => {
  const {
    currency,
    merchant,
    requester,
    reference,
    waitingForReady,
    handleSubmitDeposit,
    windowDimensions,
    establishConnection
  } = props;
  const bankCodes = getBanksByCurrencyForTopUp(currency);
  const buttonColor = 'topup';

  const { register, errors, handleSubmit } = useFormContext();

  function handleSubmitForm (values, e, type) {
    handleSubmitDeposit(values, e, type);
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
            topup
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
            <GlobalButton
              label='SMS OTP'
              color={buttonColor}
              outlined
              topup='true'
              onClick={handleSubmit((values, e) => handleSubmitForm(values, e, 'sms'))}
              disabled={!establishConnection || waitingForReady}
            />
            <GlobalButton
              label='SMART OTP'
              color={buttonColor} 
              outlined
              topup='true'
              onClick={handleSubmit((values, e) => handleSubmitForm(values, e, 'smart'))}
              disabled={!establishConnection || waitingForReady}
            />
          </div>          
        }
      </main>
    );
  });

export default DepositForm;
