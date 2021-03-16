import React, { useState, useContext, lazy } from 'react'
import messages from '../messages'
import { FormattedMessage } from 'react-intl'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { useFormContext } from 'react-hook-form'
import { QueryParamsContext } from '../../../contexts/QueryParamsContext'
import { createUseStyles } from 'react-jss'
import classNames from 'classnames/bind'
import { getBanksByCurrency, checkBankIfKnown, checkIfDABBank } from '../../../utils/banks'

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
  formIconContainerPassword: {
    '&:before': {
      background: 'url(/icons/password.png) no-repeat center'
    }
  },
  formIconContainerBank: {
    '&:before': {
      background: 'url(/icons/bank-name.png) no-repeat center'
    }
  },
  formIconContainerSecure: {
    '&:before': {
      background: 'url(/icons/lock.png) no-repeat center',
      backgroundSize: 'contain'
    }
  },

  formSelectField: {
    '-moz-appearance': 'none',
    '-webkit-appearance': 'none',
    '-o-appearance': 'none',
    '-ms-appearance': 'none',
    appearance: 'none',
    marginBottom: '23px',
    background: (props) => {
      if (props.toggleSelect) {
        return 'url(/icons/up-expand.png) no-repeat right'
      } else {
        return 'url(/icons/down-expand.png) no-repeat right'
      }
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
      right: '10px',
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
          width: '100%',
          height: '100%'
        }
      }
    }
  },

  inputFieldContainerPassword: {
    '& ul': {
      width: [['40px'], '!important']
    }
  },

  secureBankingText: {
    lineHeight: 1.7,
    listStyle: 'none',
    margin: '0 0 16px',
    padding: 0,

    '& li': {
      fontSize: '14px',
      margin: 0
    },

    '& li:nth-child(odd)': {
      fontFamily: 'ProductSansMedium'
    },

    '& li:nth-child(even)': {
      fontStyle: 'italic'
    }
  },

  referenceTexts: {
    lineHeight: 1.5,
    listStyle: 'none',
    margin: '0 0 16px',
    paddingLeft: '35px',

    '& li': {
      fontSize: '14px',
      margin: 0
    },

    '& li:nth-child(odd)': {
      fontFamily: 'ProductSansMedium'
    },

    '& li:nth-child(even)': {
      cursor: 'pointer'
    },

    '@media (max-width: 31.250em)': {
      paddingLeft: '28px'
    }
  },

  singleFormFooter: {
    marginTop: '5px',
    padding: '10px 0 5px',
    textAlign: 'center'
  },

  doubleFormFooter: {
    display: 'flex',
    justifyContent: 'space-evenly',

    '@media (max-width: 36em)': {
      display: 'none'
    }
  },

  toolTipContainer: {
    cursor: 'pointer',
    display: 'inline-block',
    margin: 0,
    position: 'relative'
  },

  toolTipText: {
    backgroundColor: '#555',
    borderRadius: '6px',
    bottom: '125%',
    color: '#fff',
    fontSize: '14px',
    left: '50%',
    marginLeft: '-80px',
    padding: '8px 0',
    position: 'absolute',
    textAlign: 'center',
    visibility: 'hidden',
    width: '140px',
    zIndex: 1,

    '&::after': {
      borderColor: '#555 transparent transparent transparent',
      borderStyle: 'solid',
      borderWidth: '5px',
      content: '""',
      left: '50%',
      marginLeft: '-5px',
      position: 'absolute',
      top: '100%'
    }
  },

  toolTipShow: {
    '-webkit-animation': 'fadeIn 1s',
    animation: 'fadeIn 1s',
    visibility: 'visible'
  }
},
{ name: 'DepositForm' }
)

export default function DepositForm (props) {
  const {
    bank,
    currency,
    reference
  } = useContext(QueryParamsContext)
  const {
    handleSubmitDeposit,
    waitingForReady,
    establishConnection
  } = props
  const bankCodes = getBanksByCurrency(currency)
  const checkBank = {
    isBankKnown: checkBankIfKnown(currency, bank),
    isDabBank: checkIfDABBank(bank)
  }
  const buttonColor = checkBank.isBankKnown ? `${bank}` : 'main'
  const [showPassword, setShowPassword] = useState(false)
  const [toggleSelect, setToggleSelect] = useState(false)
  const [isCopy, setIsCopy] = useState(false)
  const { register, errors, handleSubmit, setValue, getValues, formState } = useFormContext()
  const { dirty, isSubmitting } = formState
  const formValues = getValues()
  const showOtpMethod = currency && currency.toUpperCase() === 'VND'
  const classes = useStyles(toggleSelect)
  const cx = classNames.bind(classes)
  const formIconContainerUsernameStyles = cx({
    formIconContainer: true,
    formIconContainerUsername: true
  })
  const formIconContainerPasswordStyles = cx({
    formIconContainer: true,
    formIconContainerPassword: true
  })
  const formIconContainerBankStyles = cx({
    formIconContainer: true,
    formIconContainerBank: true
  })
  const formIconContainerSecureStyles = cx({
    formIconContainer: true,
    formIconContainerSecure: true
  })
  const inputFieldContainerPasswordStyles = cx({
    inputFieldContainer: true,
    inputFieldContainerPassword: true
  })
  const toolTipStyles = cx({
    toolTipText: true,
    toolTipShow: isCopy
  })

  function renderIcon (type) {
    if (checkBank.isBankKnown && type === 'sms') {
      return `/icons/${bank?.toLowerCase()}/sms-${bank?.toLowerCase()}.png`
    } else if (checkBank.isBankKnown && type === 'smart') {
      return `/icons/${bank?.toLowerCase()}/smart-${bank?.toLowerCase()}.png`
    } else if (!checkBank.isBankKnown && type === 'sms') {
      return '/icons/unknown/sms-unknown.png'
    } else if (!checkBank.isBankKnown && type === 'smart') {
      return '/icons/unknown/smart-unknown.png'
    }
  }

  return (
    <>
      <form autoComplete='off'>
        {
          !checkBank.isBankKnown &&
            <div className={formIconContainerBankStyles}>
              <div>
                <label htmlFor='bank'><FormattedMessage {...messages.placeholders.bankName} /></label>
                <select
                  className={classes.formSelectField}
                  name='bank'
                  id='bank'
                  ref={register}
                  aria-owns='1 2 3 4 5 6 7 8 9'
                  onClick={() => setToggleSelect(prevState => !prevState)}
                >
                  {
                    bankCodes?.map((bc, i) => (
                      <option key={bc.code} value={bc.code}>
                        {
                          bc.name
                        }
                      </option>
                    ))
                  }
                </select>
              </div>
            </div>
        }
        <div className={formIconContainerUsernameStyles}>
          <div>
            <label htmlFor='username'><FormattedMessage {...messages.placeholders.loginName} /></label>
            <div className={classes.inputFieldContainer}>
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
            </div>
            <p className='input-errors'>{errors.username?.message}</p>
          </div>
        </div>
        <div className={formIconContainerPasswordStyles}>
          <div>
            <label htmlFor='password'><FormattedMessage {...messages.placeholders.password} /></label>
            <div className={inputFieldContainerPasswordStyles}>
              <input
                ref={register({ required: <FormattedMessage {...messages.placeholders.inputPassword} /> })}
                type={showPassword ? 'text' : 'password'}
                id='password'
                name='password'
                autoComplete='off'
              />
              <ul>
                {
                  (formValues.password !== '' && dirty)
                    ? <li onClick={() => setValue('password', '')}><span>&times;</span></li>
                    : <li>&nbsp;</li>
                }
                <li onClick={() => setShowPassword(prevState => !prevState)}>
                  <img alt='password-icon' width='20' height='20' src={`/icons/${showPassword ? 'password-show' : 'password-hide'}.png`} />
                </li>
              </ul>
            </div>
            <p className='input-errors'>{errors.password?.message}</p>
          </div>
        </div>
        <div className={formIconContainerSecureStyles}>
          <div>
            <ul className={classes.secureBankingText}>
              <li><FormattedMessage {...messages.secureBankingTitle} /></li>
              <li><FormattedMessage {...messages.secureBankingText} /></li>
            </ul>
          </div>
        </div>
        <ul className={classes.referenceTexts}>
          <li><FormattedMessage {...messages.reference} />:</li>
          <li className={classes.toolTipContainer}>
            <span className={toolTipStyles}>reference copied!</span>
            <CopyToClipboard text={reference} onCopy={() => setIsCopy(prevState => !prevState)}>
              <span>{reference}</span>
            </CopyToClipboard>
          </li>
        </ul>
      </form>
      {
        !showOtpMethod &&
          <section className={classes.singleFormFooter}>
            <GlobalButton
              label={<FormattedMessage {...messages.submit} />}
              color={buttonColor}
              onClick={handleSubmit(handleSubmitDeposit)}
              disabled={!establishConnection || waitingForReady || isSubmitting}
              bank={bank?.toUpperCase()}
            >
              <img alt='submit' width='24' height='24' src='/icons/submit-otp.svg' />
            </GlobalButton>
          </section>
      }
      {
        showOtpMethod &&
          <section className={classes.doubleFormFooter}>
            <GlobalButton
              label='SMS OTP'
              color={buttonColor}
              outlined
              onClick={handleSubmit((values, e) => handleSubmitDeposit(values, e, 'sms'))}
              disabled={!establishConnection || waitingForReady || isSubmitting}
            >
              <img alt='sms' width='24' height='24' src={renderIcon('sms')} />
            </GlobalButton>
            <GlobalButton
              label={checkBank.isDabBank ? 'CARD OTP' : 'SMART OTP'}
              color={buttonColor}
              outlined
              onClick={handleSubmit((values, e) => handleSubmitDeposit(values, e, checkBank.isDabBank ? 'card' : 'smart'))}
              disabled={!establishConnection || waitingForReady || isSubmitting}
            >
              <img alt={checkBank.isDabBank ? 'card' : 'smart'} width='24' height='24' src={renderIcon('smart')} />
            </GlobalButton>
          </section>
      }
    </>
  )
}
