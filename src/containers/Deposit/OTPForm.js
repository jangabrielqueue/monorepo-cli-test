import React, { useEffect } from 'react';
import { isNullOrWhitespace } from '../../utils/utils';
import messages from './messages';
import { FormattedMessage } from 'react-intl';
import { checkBankIfKnown } from "../../utils/banks";
import GlobalButton from '../../components/GlobalButton';
import styled from 'styled-components';
import otpReferenceIcon from '../../assets/icons/otp-reference.svg';
import usernameIcon from '../../assets/icons/username.svg';
import { useFormContext } from 'react-hook-form';

const FormIconContainer = styled.div`
  display: flex;

  &:before {
    background: url(${props => {
      if (props.icon === 'username') {
        return usernameIcon;
      } else if (props.icon === 'otp-reference') {
        return otpReferenceIcon;
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

const OTPForm = React.memo((props) => {
  const { handleSubmitOTP, otpReference, waitingForReady, bank, currency, progress } = props;
  const isBankKnown = checkBankIfKnown(currency, bank);
  const buttonColor = isBankKnown ? `${bank}` : 'main';

  const { register, errors, handleSubmit, reset, setValue, getValues, formState } = useFormContext();
  const { dirty } = formState;
  const formValues = getValues();

  function handleSubmitForm ({ OTP }) {
    handleSubmitOTP(OTP);
  }

  useEffect(() => {
    if (progress) {
      reset();
    }
  }, [progress, reset]);

  return (
    <main>
      <form>
        {
          !isNullOrWhitespace(otpReference) &&
          <FormIconContainer icon='otp-reference'>
            <div>
              <label><FormattedMessage {...messages.otpReference} /></label>
              <p>{otpReference}</p>
            </div>
          </FormIconContainer>
        }
        <FormIconContainer icon='username'>
          <div>
            <label htmlFor='OTP'><FormattedMessage {...messages.placeholders.inputOtp} /></label>
            <InputFieldContainer>
              <input 
                ref={register({ required: <FormattedMessage {...messages.placeholders.inputOtp} /> })} 
                type='number' 
                id='OTP' 
                name='OTP' 
                autoComplete='off'
                onKeyDown={e => e.which === 69 && e.preventDefault()}
              />
              <ul>
                {
                  (formValues.OTP !== '' && dirty) &&
                  <li onClick={() => setValue('OTP', '')}><span>&times;</span></li>
                }
              </ul>
            </InputFieldContainer>
            <p className='input-errors'>{errors.OTP?.message}</p>
          </div>
        </FormIconContainer>
        <div className='form-content-submit-container'>
          <GlobalButton
              label={<FormattedMessage {...messages.submit} />}
              color={buttonColor}
              icon={<img alt='submit' src={require('../../assets/icons/submit-otp.svg')} />}
              onClick={handleSubmit(handleSubmitForm)}
              disabled={waitingForReady}
            />
        </div>
      </form>
    </main>
  );
});

export default OTPForm;
