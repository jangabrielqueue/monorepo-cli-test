import React, { useEffect, useContext, lazy } from 'react'
import messages from '../messages'
import { FormattedMessage } from 'react-intl'
import { useFormContext } from 'react-hook-form'
import { QueryParamsContext } from '../../../contexts/QueryParamsContext'
import { createUseStyles } from 'react-jss'
import classNames from 'classnames/bind'
import { checkBankIfKnown, checkIfBcaBank, checkIfBniBank } from '../../../utils/banks'
import { isNullOrWhitespace, checkIfAppOneOtp, checkIfAppTwoOtp, isNullorUndefined } from '../../../utils/utils'
import QRCode from 'qrcode.react'
import { theme } from '../../../App'

const OtpMethod = {
  Input: 1,
  Confirm: 2,
  QrInput: 3,
  QrConfirm: 4
}
// lazy loaded components
const GlobalButton = lazy(() => import('../../../components/GlobalButton'))

// styling
const useStyles = createUseStyles({
  qrCodeContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
    flexDirection: 'column'
  },
  otpReferenceText: {
    fontWeight: 'bold',
    wordBreak: 'break-all'
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
      background: 'url(/icons/otp-reference.svg) no-repeat center'
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

const bcaBankInputLabel = (otpReference) => (
  <FormattedMessage
    {...messages.bcaOtpReference.pleaseInputOtp}
    values={{
      number: checkIfAppTwoOtp(otpReference) ? 2 : 1
    }}
  />
)

const bniBankInputLabel = () => (
  <FormattedMessage
    {...messages.bniOtpReference.pleaseInputOtp}
    values={{
      number: 8
    }}
  />
)

const otpMethodInputLabel = () => (
  <FormattedMessage {...messages.placeholders.inputOtp} />
)
const otpMethodQrInputLabel = () => (
  <FormattedMessage {...messages.placeholders.inputQrOtp} />
)

const inputLabelRender = ({ bank, methodType, otpReference }) => {
  const notCardOTPInputLabels = {
    [checkIfBcaBank(bank)]: bcaBankInputLabel,
    [checkIfBniBank(bank)]: bniBankInputLabel,
    [OtpMethod.Input]: otpMethodInputLabel,
    [OtpMethod.QrInput]: otpMethodQrInputLabel
  }
  return (!isNullOrWhitespace(otpReference) && notCardOTPInputLabels.true && notCardOTPInputLabels.true(otpReference)) ||
    (notCardOTPInputLabels[methodType] && notCardOTPInputLabels[methodType]())
}

const bcaMinLengthErrorMessage = ({ otpReference }) => (
  <FormattedMessage
    {...messages.bcaOtpReference.inputFixedLength}
    values={{
      fixedLength: checkIfAppTwoOtp(otpReference) ? 6 : 8
    }}
  />
)

const bniMinLengthErrorMessage = () => (
  <FormattedMessage
    {...messages.bniOtpReference.inputFixedLength}
    values={{
      fixedLength: 8
    }}
  />
)

const minLengthErrorMessageRender = ({ otpReference, bank }) => {
  const minLengthErrorMessages = {
    [checkIfBcaBank(bank)]: bcaMinLengthErrorMessage,
    [checkIfBniBank(bank)]: bniMinLengthErrorMessage
  }
  return (
    <p className='input-errors'>
      {minLengthErrorMessages.true && minLengthErrorMessages.true(otpReference)}
    </p>
  )
}

const requiredErrorMessage = ({ errors }) => (
  <p className='input-errors'>{errors.OTP?.message}</p>
)

const bniMaxLengthErrorMessage = () => (
  <FormattedMessage
    {...messages.bniOtpReference.inputFixedLength}
    values={{
      fixedLength: 8
    }}
  />
)

const bcaMaxLengthErrorMessage = (otpReference) => (
  <FormattedMessage
    {...messages.bcaOtpReference.inputFixedLength}
    values={{
      fixedLength: checkIfAppTwoOtp(otpReference) ? 6 : 8
    }}
  />
)

const maxLengthErrorMessageRender = ({ otpReference, bank }) => {
  const maxLengthErrorMessages = {
    [checkIfBniBank(bank)]: bniMaxLengthErrorMessage,
    [checkIfBcaBank(bank)]: bcaMaxLengthErrorMessage
  }
  return (
    <p className='input-errors'>
      {maxLengthErrorMessages.true && maxLengthErrorMessages.true(otpReference)}
    </p>
  )
}

const errorMessages = {
  minLength: minLengthErrorMessageRender,
  required: requiredErrorMessage,
  maxLength: maxLengthErrorMessageRender
}

export const notCardOtpErrorMessagesRender = (props) => (
  errorMessages[props.errors.OTP?.type] && errorMessages[props.errors.OTP?.type](props)
)

const maxLengthCardOtpErrorMessage = () => (
  <p className='input-errors'>
    <FormattedMessage {...messages.placeholders.inputOtpDAB} />
  </p>
)

const requiredCardOtpErrorMessage = (errors) => (
  <p className='input-errors'>
    {errors.OTP1?.message || errors.OTP2?.message}
  </p>
)
const cardOtpErrorMessages = {
  maxLength: maxLengthCardOtpErrorMessage,
  required: requiredCardOtpErrorMessage
}

export const cardOtpErrorMessageRender = ({ errors }) => {
  return (cardOtpErrorMessages[errors?.OTP1?.type] && cardOtpErrorMessages[errors?.OTP1?.type](errors)) ||
    (cardOtpErrorMessages[errors?.OTP2?.type] && cardOtpErrorMessages[errors?.OTP2?.type](errors))
}

const notCardOtpInputRender = ({ formIconContainerUsernameStyles, classes, register, inputOtpValidations, formValues, dirty, setValue, shouldDisplayLabel, ...renderProps }) => (
  <div className={formIconContainerUsernameStyles}>
    <div>
      {shouldDisplayLabel && <label htmlFor='OTP'>{inputLabelRender(renderProps)}</label>}
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
      {notCardOtpErrorMessagesRender(renderProps)}
    </div>
  </div>
)

const cardOtpInputRender = ({ classes, cardOTP1, register, cardOTP2, shouldDisplayLabel, ...renderProps }) => (
  <div>
    <h1 className={classes.formHeader}><FormattedMessage {...messages.otpDABLabel} /></h1>
    <div className={classes.formDabContainer}>
      {shouldDisplayLabel && <label htmlFor='OTP1'>{cardOTP1}</label>}
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
    {cardOtpErrorMessageRender(renderProps)}
  </div>
)

const inputRenders = {
  true: cardOtpInputRender,
  false: notCardOtpInputRender
}

export const InputRender = ({ hasMethodType, isCardOTP, ...renderProps }) => (
  (!hasMethodType || [OtpMethod.Input, OtpMethod.QrInput].includes(renderProps.methodType)) && inputRenders[isCardOTP] && inputRenders[isCardOTP](renderProps)
)

const defaultGlobalButton = ({ buttonColor, handleSubmit, handleSubmitForm, waitingForReady, isSubmitting }) => (
  <GlobalButton
    label={<FormattedMessage {...messages.submit} />}
    color={buttonColor}
    onClick={handleSubmit(handleSubmitForm)}
    disabled={waitingForReady || isSubmitting}
  >
    <img alt='submit' src='/icons/submit-otp.svg' />
  </GlobalButton>
)

const doneGlobalButton = ({ buttonColor, handleSubmitOTP, waitingForReady, isSubmitting }) => (
  <GlobalButton
    label={<FormattedMessage {...messages.done} />}
    color={buttonColor}
    onClick={() => handleSubmitOTP('DONE')}
    disabled={waitingForReady || isSubmitting}
  >
    <img alt='submit' src='/icons/submit-otp.svg' />
  </GlobalButton>
)

const globalButtons = {
  default: defaultGlobalButton,
  [OtpMethod.Confirm]: doneGlobalButton,
  [OtpMethod.QrConfirm]: doneGlobalButton
}

export const globalButtonRender = ({ classes, methodType, ...renderProps }) => (
  <section className={classes.formFooter}>
    {(globalButtons[methodType] && globalButtons[methodType](renderProps)) || globalButtons.default(renderProps)}
  </section>
)

const defaultOtpMessage = ({ classes, otpReference, shouldDisplayLabel }) => (
  <>
    {shouldDisplayLabel && <FormattedMessage {...messages.otpReference} />}
    <p className={classes.otpReferenceText}>{otpReference}</p>
  </>
)

const qrCodeRender = ({ otpReference, classes }) => (
  <div className={classes.qrCodeContainer}>
    <p className={classes.otpReferenceText}>Please scan the QR Code for OTP Reference</p>
    <QRCode
      value={otpReference}
      size={200}
      renderAs='svg'
      level='M'
      imageSettings={{
        src: theme.logoIcon,
        x: null,
        y: null,
        height: 40,
        width: 40,
        excavate: true
      }}
    />
  </div>
)
const methodTypeComponents = {
  [OtpMethod.Input]: defaultOtpMessage,
  [OtpMethod.Confirm]: defaultOtpMessage,
  [OtpMethod.QrInput]: qrCodeRender,
  [OtpMethod.QrConfirm]: qrCodeRender
}
export const methodTypeRender = ({ methodType, ...renderProps }) => (
  !isNullOrWhitespace(renderProps.otpReference) && methodTypeComponents[methodType] && methodTypeComponents[methodType](renderProps)
)

const appTwoBniMessage = () => (
  <FormattedMessage
    {...messages.bniOtpReference.pleaseKeyInDigit}
    values={{
      number: 8
    }}
  />
)

const appTwoBcaMessage = (otpReference) => (
  <FormattedMessage
    {...messages.bcaOtpReference.pleaseKeyInDigit}
    values={{
      number: checkIfAppTwoOtp(otpReference) ? 6 : 8
    }}
  />
)

const appTwoOtpMessage = ({ bank, otpReference, classes }) => {
  const bankMessage = {
    [checkIfBcaBank(bank)]: appTwoBcaMessage,
    [checkIfBniBank(bank)]: appTwoBniMessage
  }

  return (
    <>
      {bankMessage.true && bankMessage.true(otpReference)}
      <p className={classes.otpReferenceText}>{otpReference}</p>
    </>
  )
}

const appOneBniMessage = () => (
  <FormattedMessage
    {...messages.bniOtpReference.pleaseKeyInDigit}
    values={{
      number: 8
    }}
  />
)

const appOneBcaMessage = () => (
  <FormattedMessage
    {...messages.bcaOtpReference.pleaseKeyInDigit}
    values={{
      number: 8
    }}
  />
)

const appOneOtpMessage = ({ bank, otpReference, classes }) => {
  const bankMessage = {
    [checkIfBcaBank(bank)]: appOneBcaMessage,
    [checkIfBniBank(bank)]: appOneBniMessage
  }

  return (
    <>
      {bankMessage.true && bankMessage.true(otpReference)}
      <p className={classes.otpReferenceText}>{otpReference}</p>
    </>
  )
}

const neitherAppOtpMessage = ({ otpReference, classes }) => (
  <>
    <FormattedMessage {...messages.otpReference} />
    <p className={classes.otpReferenceText}>{otpReference}</p>
  </>
)

const appMessagesRender = (renderProps) => {
  const appOtpMessages = {
    [checkIfAppTwoOtp(renderProps.otpReference)]: appTwoOtpMessage,
    [checkIfAppOneOtp(renderProps.otpReference)]: appOneOtpMessage,
    otherwise: neitherAppOtpMessage
  }

  return (appOtpMessages.true && appOtpMessages.true(renderProps)) || appOtpMessages.otherwise(renderProps)
}

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
    methodType,
    isCardOTP,
    isInquiry
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
  const hasMethodType = !isNullorUndefined(methodType)
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
        minLength: checkIfBcaBank(bank) ? 6 : 8,
        maxLength: checkIfBcaBank(bank) ? 6 : 8
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
    if (progress || otpReference) {
      reset()
    }
  }, [progress, otpReference, reset])

  const renderProps = {
    formIconContainerUsernameStyles,
    classes,
    inputOtpValidations,
    formValues,
    dirty,
    isCardOTP,
    hasMethodType,
    cardOTP1,
    cardOTP2,
    register,
    setValue,
    methodType,
    otpReference,
    bank,
    errors,
    buttonColor,
    handleSubmit,
    handleSubmitForm,
    handleSubmitOTP,
    waitingForReady,
    isSubmitting,
    shouldDisplayLabel: !isInquiry
  }

  return (
    <form>
      {
        !isNullOrWhitespace(otpReference) && !isCardOTP && !hasMethodType &&
          <div className={formIconContainerOtpReferenceStyles}>
            <div>
              {appMessagesRender(renderProps)}
            </div>
          </div>
      }
      {methodTypeRender(renderProps)}
      {InputRender(renderProps)}
      {globalButtonRender(renderProps)}
    </form>
  )
})

export default OTPForm
