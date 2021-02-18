import React, { useState, lazy, useContext, useEffect } from 'react'
import messages from '../messages'
import { FormattedMessage } from 'react-intl'
import { useFormContext } from 'react-hook-form'
import { QueryParamsContext } from '../../../contexts/QueryParamsContext'
import { createUseStyles } from 'react-jss'
import classNames from 'classnames/bind'

// lazy loaded components
const GlobalButton = lazy(() => import('../../../components/GlobalButton'))
const CollapsiblePanel = lazy(() => import('../../../components/CollapsiblePanel'))

// styling
const useStyles = createUseStyles({
  styledMoreInfo: {
    listStyle: 'none',
    margin: 0,
    padding: '0 25px',

    '& li': {
      paddingBottom: '5px',
      margin: 0,

      '&:before': {
        content: '""',
        display: 'inline-block',
        height: '20px',
        marginRight: '5px',
        verticalAlign: 'middle',
        width: '20px'
      },

      '&:nth-child(1)': {
        '&:before': {
          background: 'url(/icons/account.png) no-repeat center'
        }
      },

      '&:nth-child(2)': {
        '&:before': {
          background: 'url(/icons/username.png) no-repeat center'
        }
      },

      '&:nth-child(3)': {
        '&:before': {
          background: 'url(/icons/username.png) no-repeat center'
        }
      },

      '&:nth-child(4)': {
        '&:before': {
          background: 'url(/icons/currency.png) no-repeat center'
        }
      }
    }
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
  formSelectField: {
    marginBottom: '23px'
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

  doubleFormFooter: {
    display: 'flex',
    justifyContent: 'space-evenly',

    '@media (max-width: 36em)': {
      display: 'none'
    }
  }
},
{ name: 'TopupDepositForm' }
)

const DepositForm = React.memo((props) => {
  const {
    merchant,
    requester,
    currency,
    reference
  } = useContext(QueryParamsContext)
  const {
    waitingForReady,
    handleSubmitDeposit,
    establishConnection
  } = props
  const [dynamicLoadBankUtils, setDynamicLoadBankUtils] = useState(null)
  const bankCodes = dynamicLoadBankUtils?.getBanksByCurrencyForTopUp(currency)
  const buttonColor = 'topup'
  const [showPassword, setShowPassword] = useState(false)
  const { register, errors, handleSubmit, setValue, getValues, formState } = useFormContext()
  const { dirty } = formState
  const formValues = getValues()
  const classes = useStyles()
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
  const inputFieldContainerPasswordStyles = cx({
    inputFieldContainer: true,
    inputFieldContainerPassword: true
  })

  function handleSubmitForm (values, e, type) {
    handleSubmitDeposit(values, e, type)
  }

  useEffect(() => {
    async function dynamicLoadModules () { // dynamically load bank utils
      const { getBanksByCurrencyForTopUp } = await import('../../../utils/banks')
      setDynamicLoadBankUtils({
        getBanksByCurrencyForTopUp
      })
    }

    dynamicLoadModules()
  }, [])

  return (
    <>
      <form autoComplete='off'>
        <div className={formIconContainerBankStyles}>
          <div>
            <label htmlFor='bank'><FormattedMessage {...messages.placeholders.bankName} /></label>
            <select
              className={classes.formSelectField}
              name='bank'
              id='bank'
              ref={register}
              aria-owns='1 2 3 4 5 6 7 8 9'
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
        <CollapsiblePanel
          title={<FormattedMessage {...messages.moreInformation} />}
          topup
        >
          <ul className={classes.styledMoreInfo}>
            <li>{reference}</li>
            <li>{merchant}</li>
            <li>{requester}</li>
            <li>{currency}</li>
          </ul>
        </CollapsiblePanel>
      </form>
      <section className={classes.doubleFormFooter}>
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
      </section>
    </>
  )
})

export default DepositForm
