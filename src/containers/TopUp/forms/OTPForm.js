import React, { useEffect, lazy, useState } from 'react'
import messages from '../messages'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'
import otpReferenceIcon from '../../../assets/icons/otp-reference.svg'
import usernameIcon from '../../../assets/icons/username.png'
import { useFormContext } from 'react-hook-form'

// lazy loaded components
const GlobalButton = lazy(() => import('../../../components/GlobalButton'))

// styling
const FormIconContainer = styled.div`
  display: flex;

  &:before {
    background: url(${props => {
      if (props.icon === 'username') {
        return usernameIcon
      } else if (props.icon === 'otp-reference') {
        return otpReferenceIcon
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
`

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
`
const StyledFormFooter = styled.section`
  margin-top: 5px;
  padding: 10px 0 5px;
  text-align: center;
`

const OTPForm = React.memo((props) => {
  const { handleSubmitOTP, otpReference, waitingForReady, progress } = props
  const buttonColor = 'topup'
  const [dynamicLoadBankUtils, setDynamicLoadBankUtils] = useState(null)
  const { register, errors, handleSubmit, reset, setValue, getValues, formState } = useFormContext()
  const { dirty } = formState
  const formValues = getValues()

  function handleSubmitForm ({ OTP }) {
    handleSubmitOTP(OTP)
  }

  useEffect(() => {
    async function dynamicLoadModules () { // dynamically load bank utils
      const { isNullOrWhitespace } = await import('../../../utils/utils')
      setDynamicLoadBankUtils({
        isNullOrWhitespace
      })
    }

    dynamicLoadModules()
  }, [])

  useEffect(() => {
    if (progress) {
      reset()
    }
  }, [progress, reset])

  return (
    <main>
      <form>
        {
          !dynamicLoadBankUtils?.isNullOrWhitespace(otpReference) &&
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
        <StyledFormFooter>
          <GlobalButton
            label={<FormattedMessage {...messages.submit} />}
            color={buttonColor}
            icon={<img alt='submit' src={require('../../../assets/icons/submit-otp.svg')} />}
            onClick={handleSubmit(handleSubmitForm)}
            disabled={waitingForReady}
          />
        </StyledFormFooter>
      </form>
    </main>
  )
})

export default OTPForm
