import React, { useEffect } from 'react';
import { isNullOrWhitespace } from '../../utils/utils';
import messages from './messages';
import { FormattedMessage } from 'react-intl';
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

const OTPForm = React.memo((props) => {
  const { handleSubmitOTP, otpReference, waitingForReady, progress } = props;
  const buttonColor = 'topup';

  const { register, errors, handleSubmit, reset } = useFormContext();

  function handleSubmitForm ({ OTP }) {
    handleSubmitOTP(OTP);
  }

  useEffect(() => {
    if (progress) {
      reset();
    }
  }, [progress, reset]);

  useEffect(() => {
    if (progress) {
      resetFields();
    }
  }, [progress]);

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
            <label htmlFor='OTP'>Input OTP Received from Bank</label>
            <input 
              ref={register({ required: <FormattedMessage {...messages.placeholders.inputOtp} /> })} 
              type='number' 
              id='OTP' 
              name='OTP' 
              autoComplete='off'
            />
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
