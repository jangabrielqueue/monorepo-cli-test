import React, { useEffect, useContext, lazy } from 'react'
import messages from '../messages'
import { FormattedMessage } from 'react-intl'
import { useFormContext } from 'react-hook-form'
import { QueryParamsContext } from '../../../contexts/QueryParamsContext'
import { createUseStyles } from 'react-jss'
import classNames from 'classnames/bind'
import { checkBankIfKnown, checkIfBcaBank, checkIfBniBank } from '../../../utils/banks'
import { isNullOrWhitespace, checkIfAppOneOtp, checkIfAppTwoOtp } from '../../../utils/utils'

// lazy loaded components
const GlobalButton = lazy(() => import('../../../components/GlobalButton'))

// styling
const useStyles = createUseStyles({
  otpReferenceText: {
    fontWeight: 'bold'
  },
  formIconContainer: {
    display: 'flex',

    '&:before': {
      content: '""',
      display: 'block',
      height: '20px',
      margin: '15px 15px 0 0',
      width: '20px'
    },

    '& div': {
      flex: '0 1 425px'
    }
  },

  formIconContainerUsername: {
    '&:before': {
      background: 'url(/icons/username.png) no-repeat center'
    }
  },
  formIconContainerOtpReference: {
    '&:before': {
      background: 'url(/icons/otp-reference.png) no-repeat center'
    }
  },

  inputFieldContainer: {
    position: 'relative',

    '& ul': {
      alignItems: 'center',
      display: 'flex',
      justifyContent: 'space-between',
      listStyle: 'none',
      margin: 0,
      padding: 0,
      position: 'absolute',
      right: 0,
      top: '50%',
      transform: 'translateY(-50%)',
      width: 'auto',

      '& li:nth-child(odd)': {
        height: '14px',
        width: '14px',
        margin: 0,

        '& span': {
          alignItems: 'center',
          background: '#C0C0C0',
          borderRadius: '50%',
          color: '#FFF',
          cursor: 'pointer',
          display: 'flex',
          fontSize: '16px',
          height: '100%',
          justifyContent: 'center',
          lineHeight: 1.5,
          width: '100%'
        }
      },

      '& li:nth-child(even)': {
        cursor: 'pointer',
        height: '16px',
        width: '16px',
        margin: 0,

        '& img': {
          height: '100%',
          width: '100%'
        }
      }
    }
  },

  formHeader: {
    fontSize: '14px',
    fontWeight: 'normal',
    margin: '0 0 20px'
  },

  formDabContainer: {
    alignItems: 'center',
    display: 'flex',
    marginBottom: '15px',

    '& label': {
      marginRight: '10px'
    },

    '& input': {
      '&:nth-child(2)': {
        marginRight: '5px'
      }
    }
  },

  formDabInput: {
    border: '1px solid #CCC'
  },

  formFooter: {
    marginTop: '5px',
    padding: '10px 0 5px',
    textAlign: 'center'
  }

},
{ name: 'OTPForm' }
)

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
  const isBankKnown = checkBankIfKnown(currency, bank)
  const buttonColor = isBankKnown ? `${bank}` : 'main'
  const { register, errors, handleSubmit, reset, setValue, getValues, formState } = useFormContext()
  const { dirty, isSubmitting } = formState
  const formValues = getValues()
  const cardOTPReferenceArray = otpReference?.split('-')
  const cardOTP1 = cardOTPReferenceArray?.[0]
  const cardOTP2 = cardOTPReferenceArray?.[1]
  const classes = useStyles()
  const cx = classNames.bind(classes)
  const formIconContainerOtpReferenceStyles = cx({
    formIconContainer: true,
    formIconContainerOtpReference: true
  })
  const formIconContainerUsernameStyles = cx({
    formIconContainer: true,
    formIconContainerUsername: true
  })
  const inputOtpValidations = (checkIfBcaBank(bank) || checkIfBniBank(bank)) && !isNullOrWhitespace(otpReference) ? renderBcaAndBniOtpError() : {
    required: <FormattedMessage {...messages.placeholders.inputOtp} />
  }

  function handleSubmitForm ({ OTP, OTP1, OTP2 }) {
    const OTPValue = isCardOTP ? `${OTP1}-${OTP2}` : OTP

    handleSubmitOTP(OTPValue)
  }

  function renderBcaAndBniOtpError () {
    if (checkIfAppTwoOtp(otpReference)) {
      return {
        required:
        (checkIfBcaBank(bank) && <FormattedMessage
          {...messages.bcaOtpReference.inputFixedLength}
          values={{
            fixedLength: 6
          }}
        />) || //eslint-disable-line
        (checkIfBniBank(bank) && <FormattedMessage
          {...messages.bniOtpReference.inputFixedLength}
          values={{
            fixedLength: 8
          }}
      />), // eslint-disable-line
        minLength: 8,
        maxLength: 8
      }
    } else if (checkIfAppOneOtp(otpReference)) {
      return {
        required:
        (checkIfBcaBank(bank) && <FormattedMessage
          {...messages.bcaOtpReference.inputFixedLength}
          values={{
            fixedLength: 8
          }}
        />) || //eslint-disable-line
        (checkIfBniBank(bank) && <FormattedMessage
          {...messages.bniOtpReference.inputFixedLength}
          values={{
            fixedLength: 8
          }}
      />), // eslint-disable-line
        minLength: 8,
        maxLength: 8
      }
    }
  }

  useEffect(() => {
    if (progress) {
      reset()
    }
  }, [progress, reset])

  return (
    <form>
      {
        !isNullOrWhitespace(otpReference) && !isCardOTP &&
          <div className={formIconContainerOtpReferenceStyles}>
            <div>
              {
                checkIfAppTwoOtp(otpReference) &&
                  <>
                    {
                      checkIfBcaBank(bank) && <FormattedMessage {...messages.bcaOtpReference.pleaseKeyInDigit} />
                    }
                    {
                      checkIfBniBank(bank) && <FormattedMessage {...messages.bniOtpReference.pleaseKeyInDigit} />
                    }
                    <p className={classes.otpReferenceText}>{otpReference}</p>
                  </>
              }
              {
                !checkIfAppTwoOtp(otpReference) && !checkIfAppOneOtp(otpReference) &&
                  <>
                    <FormattedMessage {...messages.otpReference} />
                    <p className={classes.otpReferenceText}>{otpReference}</p>
                  </>
              }
            </div>
          </div>
      }
      {
        !isCardOTP &&
          <div className={formIconContainerUsernameStyles}>
            <div>
              <label htmlFor='OTP'>
                {
                  checkIfBcaBank(bank) && !isNullOrWhitespace(otpReference) &&
                    <FormattedMessage
                      {...messages.bcaOtpReference.pleaseInputOtp}
                      values={{
                        number: checkIfAppTwoOtp(otpReference) ? 2 : 1
                      }}
                    />
                }
                {
                  checkIfBniBank(bank) && !isNullOrWhitespace(otpReference) &&
                    <FormattedMessage
                      {...messages.bniOtpReference.pleaseInputOtp}
                      values={{
                        number: 8
                      }}
                    />
                }
                {
                  !checkIfBcaBank(bank) && !checkIfBniBank(bank) &&
                    <FormattedMessage {...messages.placeholders.inputOtp} />
                }
              </label>
              <div className={classes.inputFieldContainer}>
                <input
                  ref={register({
                    ...inputOtpValidations
                  })}
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
              </div>
              {
                errors.OTP?.type === 'required' && <p className='input-errors'>{errors.OTP?.message}</p>
              }
              {
                errors.OTP?.type === 'minLength' &&
                  <p className='input-errors'>
                    {
                      checkIfBcaBank(bank) &&
                        <FormattedMessage
                          {...messages.bcaOtpReference.inputFixedLength}
                          values={{
                            fixedLength: checkIfAppTwoOtp(otpReference) ? 6 : 8
                          }}
                        />
                    }
                    {
                      checkIfBniBank(bank) &&
                        <FormattedMessage
                          {...messages.bniOtpReference.inputFixedLength}
                          values={{
                            fixedLength: 8
                          }}
                        />
                    }
                  </p>
              }
              {
                errors.OTP?.type === 'maxLength' &&
                  <p className='input-errors'>
                    {
                      checkIfBcaBank(bank) &&
                        <FormattedMessage
                          {...messages.bcaOtpReference.inputFixedLength}
                          values={{
                            fixedLength: checkIfAppTwoOtp(otpReference) ? 6 : 8
                          }}
                        />
                    }
                    {
                      checkIfBniBank(bank) &&
                        <FormattedMessage
                          {...messages.bniOtpReference.inputFixedLength}
                          values={{
                            fixedLength: 8
                          }}
                        />
                    }
                  </p>
              }
            </div>
          </div>
      }
      {
        isCardOTP &&
          <div>
            <h1 className={classes.formHeader}><FormattedMessage {...messages.otpDABLabel} /></h1>
            <div className={classes.formDabContainer}>
              <label htmlFor='OTP1'>{cardOTP1}</label>
              <input
                className={classes.formDabInput}
                ref={register({ required: <FormattedMessage {...messages.placeholders.inputOtp} />, maxLength: 3 })}
                type='number'
                id='OTP1'
                name='OTP1'
                autoComplete='off'
                onKeyDown={e => e.which === 69 && e.preventDefault()}
              />
              <label htmlFor='OTP2'>{cardOTP2}</label>
              <input
                className={classes.formDabInput}
                ref={register({ required: <FormattedMessage {...messages.placeholders.inputOtp} />, maxLength: 3 })}
                type='number'
                id='OTP2'
                name='OTP2'
                autoComplete='off'
                onKeyDown={e => e.which === 69 && e.preventDefault()}
              />
            </div>
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
      <section className={classes.formFooter}>
        <GlobalButton
          label={<FormattedMessage {...messages.submit} />}
          color={buttonColor}
          onClick={handleSubmit(handleSubmitForm)}
          disabled={waitingForReady || isSubmitting}
        >
          <img alt='submit' src='/icons/submit-otp.svg' />
        </GlobalButton>
      </section>
    </form>
  )
})

export default OTPForm
