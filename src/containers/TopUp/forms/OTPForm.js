import React, { useEffect, lazy } from 'react'
import messages from '../messages'
import { FormattedMessage } from 'react-intl'
import { useFormContext } from 'react-hook-form'
import { createUseStyles } from 'react-jss'
import classNames from 'classnames/bind'
import QRCode from 'qrcode.react'
import { isNullOrWhitespace } from '../../../utils/utils'

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

  footer: {
    marginTop: '5px',
    padding: '10px 0 5px',
    textAlign: 'center'
  }
},
{ name: 'TopupOtpForm' }
)

const OTPForm = React.memo((props) => {
  const { handleSubmitOTP, otpReference, waitingForReady, progress, methodType } = props
  const buttonColor = 'topup'
  const { register, errors, handleSubmit, reset, setValue, getValues, formState } = useFormContext()
  const { dirty, isSubmitting } = formState
  const formValues = getValues()
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

  function handleSubmitForm ({ OTP }) {
    handleSubmitOTP(OTP)
  }

  useEffect(() => {
    if (progress) {
      reset()
    }
  }, [progress, reset])

  return (
    <main>
      <form>
        {
          !isNullOrWhitespace(otpReference) && ![OtpMethod.Confirm, OtpMethod.QrConfirm].includes(methodType) &&
            <div className={formIconContainerOtpReferenceStyles}>
              <div>
                <label><FormattedMessage {...messages.otpReference} /></label>
                <p>{otpReference}</p>
              </div>
            </div>
        }
        {
          [OtpMethod.QrInput, OtpMethod.QrConfirm].includes(methodType) &&
            <QRCode
              value={otpReference}
              size={200}
              renderAs='svg'
              level='M'
              imageSettings={{
                src: '/logo/GW_LOGO_ICON.png',
                x: null,
                y: null,
                height: 40,
                width: 40,
                excavate: true
              }}
            />
        }
        {
          ![OtpMethod.Confirm, OtpMethod.QrConfirm].includes(methodType) &&
            <div className={formIconContainerUsernameStyles}>
              <div>
                <label htmlFor='OTP'><FormattedMessage {...messages.placeholders.inputOtp} /></label>
                <div className={classes.inputFieldContainer}>
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
                </div>
                <p className='input-errors'>{errors.OTP?.message}</p>
              </div>
            </div>
        }
        <section className={classes.footer}>
          {
            ![OtpMethod.Confirm, OtpMethod.QrConfirm].includes(methodType) &&
              <GlobalButton
                label={<FormattedMessage {...messages.submit} />}
                color={buttonColor}
                onClick={handleSubmit(handleSubmitForm)}
                disabled={waitingForReady || isSubmitting}
              >
                <img alt='submit' src='/icons/submit-otp.svg' />
              </GlobalButton>
          }
          {
            [OtpMethod.Confirm, OtpMethod.QrConfirm].includes(methodType) &&
              <GlobalButton
                label={<FormattedMessage {...messages.done} />}
                color={buttonColor}
                onClick={() => handleSubmitOTP('DONE')}
                disabled={waitingForReady || isSubmitting}
              >
                <img alt='submit' src='/icons/submit-otp.svg' />
              </GlobalButton>
          }
        </section>
      </form>
    </main>
  )
})

export default OTPForm
