import React, { useEffect, useContext, lazy, useState } from 'react'
import messages from '../messages'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'
import { useFormContext } from 'react-hook-form'
import { QueryParamsContext } from '../../../contexts/QueryParamsContext'
import otpReferenceIcon from '../../../assets/icons/otp-reference.svg'
import usernameIcon from '../../../assets/icons/username.png'

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
const FormHeader = styled.h1`
  font-size: 14px;
  font-weight: normal;
  margin: 0 0 20px;
`
const FormDABContainer = styled.div`
  align-items: center;
  display: flex;
  margin-bottom: 15px;

  label {
    margin-right: 10px;
  }

  input {
    &:nth-child(2) {
      margin-right: 5px;
    }
  }
`
const FormDABInput = styled.input`
  border: 1px solid #CCC !important;
`
const StyledFormFooter = styled.section`
  margin-top: 5px;
  padding: 10px 0 5px;
  text-align: center;
`

const OTPForm = React.memo((props) => {
  const {
    bank,
    currency
  } = useContext(QueryParamsContext)
  const {
    handleSubmitOTP,
    otpReference,
    waitingForReady,
    progress,
    isCardOTP
  } = props
  const [dynamicLoadUtils, setDynamicLoadUtils] = useState(null)
  const isBankKnown = dynamicLoadUtils?.checkBankIfKnown(currency, bank)
  const buttonColor = isBankKnown ? `${bank}` : 'main'
  const { register, errors, handleSubmit, reset, setValue, getValues, formState } = useFormContext()
  const { dirty } = formState
  const formValues = getValues()
  const cardOTPReferenceArray = otpReference?.split('-')
  const cardOTP1 = cardOTPReferenceArray?.[0]
  const cardOTP2 = cardOTPReferenceArray?.[1]

  function handleSubmitForm ({ OTP, OTP1, OTP2 }) {
    const OTPValue = isCardOTP ? `${OTP1}-${OTP2}` : OTP

    handleSubmitOTP(OTPValue)
  }

  useEffect(() => {
    async function dynamicLoadModules () { // dynamically load bank utils
      const { checkBankIfKnown } = await import('../../../utils/banks')
      const { isNullOrWhitespace } = await import('../../../utils/utils')
      setDynamicLoadUtils({
        checkBankIfKnown,
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
    <form>
      {
        !dynamicLoadUtils?.isNullOrWhitespace(otpReference) && !isCardOTP &&
          <FormIconContainer icon='otp-reference'>
            <div>
              <label><FormattedMessage {...messages.otpReference} /></label>
              <p>{otpReference}</p>
            </div>
          </FormIconContainer>
      }
      {
        !isCardOTP &&
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
      }
      {
        isCardOTP &&
          <div>
            <FormHeader><FormattedMessage {...messages.otpDABLabel} /></FormHeader>
            <FormDABContainer>
              <label htmlFor='OTP1'>{cardOTP1}</label>
              <FormDABInput
                ref={register({ required: <FormattedMessage {...messages.placeholders.inputOtp} />, maxLength: 3 })}
                type='number'
                id='OTP1'
                name='OTP1'
                autoComplete='off'
                onKeyDown={e => e.which === 69 && e.preventDefault()}
              />
              <label htmlFor='OTP2'>{cardOTP2}</label>
              <FormDABInput
                ref={register({ required: <FormattedMessage {...messages.placeholders.inputOtp} />, maxLength: 3 })}
                type='number'
                id='OTP2'
                name='OTP2'
                autoComplete='off'
                onKeyDown={e => e.which === 69 && e.preventDefault()}
              />
            </FormDABContainer>
            {
              (errors.OTP1?.type === 'required' || errors.OTP2?.type === 'required') &&
                <p className='input-errors'>
                  {errors.OTP1?.message || errors.OTP2?.message}
                </p>
            }
            {
              (errors.OTP1?.type === 'maxLength' || errors.OTP2?.type === 'maxLength') &&
                <p className='input-errors'>
                  <FormattedMessage {...messages.placeholders.inputOtpDAB} />
                </p>
            }
          </div>
      }
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
  )
})

export default OTPForm
