import React, { useState, lazy } from 'react'
import { useIntl, FormattedMessage } from 'react-intl'
import messages from '../messages'
import { useFormContext } from 'react-hook-form'
import { createUseStyles } from 'react-jss'
import classNames from 'classnames/bind'
import { checkBankIfKnown, checkIfGWCBank } from '../../../utils/banks'

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
      width: '20px'
    },

    '& div': {
      flex: '0 1 425px'
    }
  },

  formIconContainerMobile: {
    '&:before': {
      background: 'url(/icons/otp-reference.svg) no-repeat center',
      margin: '15px 15px 15px 0',
      opacity: 1
    }
  },
  formIconContainerCreditCard: {
    '&:before': {
      background: 'url(/icons/credit-card.svg) no-repeat center',
      margin: '15px 15px 15px 2px',
      opacity: 0.6
    }
  },

  formSelectField: {
    marginBottom: '23px'
  },

  noteText: {
    fontSize: '14px',
    lineHeight: 1.5,
    margin: '15px 0',
    paddingLeft: '20px',

    '& li': {
      color: '#767676',
      marginBottom: '5px'
    },

    '& ul': {
      boxSizing: 'border-box',
      listStyleType: 'circle',
      paddingLeft: '25px',
      width: '100%',

      '& li': {
        color: '#767676',
        marginBottom: '5px'
      }
    }
  },

  footer: {
    marginTop: '5px',
    padding: '10px 0px 5px',
    textAlign: 'center'
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
      right: '4px',
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
  }
},
{ name: 'ScratchCardForm' }
)

const ScratchCardForm = React.memo((props) => {
  const { handleSubmitScratchCard, waitingForReady, establishConnection, currency, bank } = props
  const [telcoName, setTelcoName] = useState(bank?.toUpperCase() === 'GWC' ? 'GW' : 'VTT')
  const intl = useIntl()
  const { register, errors, handleSubmit, reset, watch, getValues, formState } = useFormContext()
  const { isSubmitting } = formState
  const isBankKnown = checkBankIfKnown(currency, bank)
  const buttonColor = isBankKnown ? `${bank}` : 'main'
  const language = props.language
  const watchCardSerialNumber = watch('cardSerialNumber', '')
  const watchCardPin = watch('cardPin', '')
  const formValues = getValues()
  const classes = useStyles()
  const cx = classNames.bind(classes)
  const formIconContainerMobileStyles = cx({
    formIconContainer: true,
    formIconContainerMobile: true
  })
  const formIconContainerCreditCardStyles = cx({
    formIconContainer: true,
    formIconContainerCreditCard: true
  })

  function handleSubmitForm (values) {
    handleSubmitScratchCard(values)
  }

  function renderCardPinValidations () {
    if (telcoName === 'VTT' || telcoName === 'GW') {
      return {
        required: true,
        maxLength: 15
      }
    } else if (telcoName === 'VNP') {
      return {
        required: true,
        maxLength: 14
      }
    } else if (telcoName === 'VMS') {
      return {
        required: true,
        maxLength: 12
      }
    } else if (telcoName === 'VNM') {
      return {
        required: true,
        maxLength: 12
      }
    } else if (telcoName === 'ZING') {
      return {
        required: true,
        maxLength: 9
      }
    } else if (telcoName === 'GATE') {
      return {
        required: true,
        maxLength: 10
      }
    }
  }

  function renderMaxLengthMessageCardPin () {
    switch (telcoName) {
      case 'VTT':
        return intl.formatMessage(messages.placeholders.inputMaxChar, { maxLength: 15 })
      case 'GW':
        return intl.formatMessage(messages.placeholders.inputMaxChar, { maxLength: 15 })
      case 'VNP':
        return intl.formatMessage(messages.placeholders.inputMaxChar, { maxLength: 14 })
      case 'VMS':
        return intl.formatMessage(messages.placeholders.inputMaxChar, { maxLength: 12 })
      case 'VNM':
        return intl.formatMessage(messages.placeholders.inputMaxChar, { maxLength: 12 })
      case 'ZING':
        return intl.formatMessage(messages.placeholders.inputMaxChar, { maxLength: 9 })
      case 'GATE':
        return intl.formatMessage(messages.placeholders.inputMaxChar, { maxLength: 10 })
      default:
        break
    }
  }

  function renderSerialNumberValidations () {
    if (telcoName === 'VTT' || telcoName === 'VNP') {
      return {
        required: true,
        maxLength: 14
      }
    } else if (telcoName === 'GW' || telcoName === 'VMS') {
      return {
        required: true,
        maxLength: 15
      }
    } else if (telcoName === 'ZING') {
      return {
        required: true,
        maxLength: 12,
        pattern: /^([a-z]{2})(\d{10})/i
      }
    } else if (telcoName === 'GATE') {
      return {
        required: true,
        maxLength: 10,
        pattern: /^([a-z]{2})(\d{8})/i
      }
    } else if (telcoName === 'VNM') {
      return {
        required: true,
        maxLength: 16
      }
    } else {
      return {
        required: true
      }
    }
  }

  function renderMaxLengthMessageSerialNumber () {
    if (telcoName === 'VTT' || telcoName === 'VNP') {
      return intl.formatMessage(messages.placeholders.inputMaxChar, { maxLength: 14 })
    } else if (telcoName === 'GW' || telcoName === 'VMS') {
      return intl.formatMessage(messages.placeholders.inputMaxChar, { maxLength: 15 })
    } else if (telcoName === 'ZING') {
      return intl.formatMessage(messages.placeholders.inputMaxChar, { maxLength: 12 })
    } else if (telcoName === 'GATE') {
      return intl.formatMessage(messages.placeholders.inputMaxChar, { maxLength: 10 })
    } else if (telcoName === 'VNM') {
      return intl.formatMessage(messages.placeholders.inputMaxChar, { maxLength: 16 })
    }
  }

  function renderPatternMessageSerialNumber () {
    switch (telcoName) {
      case 'GATE':
        return intl.formatMessage(messages.placeholders.inputPattern, { numberLetter: 2, digitNumber: 8 })
      default:
        break
    }
  }

  function handleSelectTelco (e) {
    setTelcoName(e.target.value)
    reset({
      telcoName: e.target.value
    })
  }

  function renderTransactionRates () {
    if (language === 'vi-vn') {
      return (
        <ul>
          <li>VIETTEL: 22%</li>
          <li>MOBI: 27% (Giá trị thẻ 10-20-30-50-100) và 32% (Giá trị thẻ 200-300-500)</li>
          <li>VINA: 20%</li>
          <li>ZING: 25%</li>
          <li>GATE: 28%</li>
          <li>VIETNAMOBILE: 25%</li>
        </ul>
      )
    } else {
      return (
        <ul>
          <li>VIETTEL: 22%</li>
          <li>MOBI: 27% (card value 10-20-30-50-100) and 32% (card value 200-300-500)</li>
          <li>VINA: 20%</li>
          <li>ZING: 25%</li>
          <li>GATE: 28%</li>
          <li>VIETNAMOBILE: 25%</li>
        </ul>
      )
    }
  }

  return (
    <>
      <form autoComplete='off'>
        {
          !checkIfGWCBank(bank) &&
            <div className={formIconContainerMobileStyles}>
              <div>
                <label htmlFor='telcoName'><FormattedMessage {...messages.placeholders.telcoName} /></label>
                <select
                  className={classes.formSelectField}
                  name='telcoName'
                  id='telcoName'
                  ref={register}
                  onChange={handleSelectTelco}
                >
                  <option value='VTT' id='telco-1'>Viettel</option>
                  <option value='VMS' id='telco-2'>Mobiphone</option>
                  <option value='VNP' id='telco-3'>Vinaphone</option>
                  <option value='ZING' id='telco-4'>Zing</option>
                  <option value='GATE' id='telco-5'>Gate</option>
                  <option value='VNM' id='telco-6'>Vietnamobile</option>
                </select>
              </div>
            </div>
        }
        <div className={formIconContainerCreditCardStyles}>
          <div>
            <label htmlFor='cardSerialNumber'><FormattedMessage {...messages.placeholders.cardSerialNo} /></label>
            <div className={classes.inputFieldContainer}>
              <input
                ref={register(renderSerialNumberValidations())}
                onKeyDown={e => e.which === 69 && e.preventDefault()}
                type={(telcoName === 'ZING' || telcoName === 'GATE') ? 'text' : 'number'}
                id='cardSerialNumber'
                name='cardSerialNumber'
                autoComplete='off'
              />
              <ul>
                {
                  (watchCardSerialNumber || formValues.cardSerialNumber) &&
                    <li onClick={() => reset({ ...formValues, cardSerialNumber: '' })}><span>&times;</span></li>
                }
              </ul>
            </div>
            <p className='input-errors'>
              {errors.cardSerialNumber?.type === 'required' && <FormattedMessage {...messages.placeholders.inputSerialNumber} />}
              {errors.cardSerialNumber?.type === 'maxLength' && renderMaxLengthMessageSerialNumber()}
              {errors.cardSerialNumber?.type === 'pattern' && renderPatternMessageSerialNumber()}
            </p>
          </div>
        </div>
        <div className={formIconContainerCreditCardStyles}>
          <div>
            <label htmlFor='cardPin'><FormattedMessage {...messages.placeholders.cardPin} /></label>
            <div className={classes.inputFieldContainer}>
              <input
                ref={register(renderCardPinValidations())}
                onKeyDown={e => e.which === 69 && e.preventDefault()}
                type='number'
                id='cardPin'
                name='cardPin'
                autoComplete='off'
              />
              <ul>
                {
                  (watchCardPin || formValues.cardPin) &&
                    <li onClick={() => reset({ ...formValues, cardPin: '' })}><span>&times;</span></li>
                }
              </ul>
            </div>
            <p className='input-errors'>
              {errors.cardPin?.type === 'required' && <FormattedMessage {...messages.placeholders.inputCardPin} />}
              {errors.cardPin?.type === 'maxLength' && renderMaxLengthMessageCardPin()}
            </p>
          </div>
        </div>
        <footer className={classes.footer}>
          <GlobalButton
            label={<FormattedMessage {...messages.submit} />}
            color={buttonColor}
            onClick={handleSubmit(handleSubmitForm)}
            disabled={!establishConnection || waitingForReady || isSubmitting}
          >
            <img alt='submit' width='24' height='24' src='/icons/submit-otp.svg' />
          </GlobalButton>
        </footer>
        {
          !checkIfGWCBank(bank) &&
            <ul className={classes.noteText}>
              <li><FormattedMessage {...messages.notes.notesOne} /></li>
              <li><FormattedMessage {...messages.notes.notesTwo} /></li>
              <li><FormattedMessage {...messages.notes.notesThree} /></li>
              <ul>
                <li><FormattedMessage {...messages.notes.notesFour} /></li>
                <li><FormattedMessage {...messages.notes.notesFive} /></li>
              </ul>
              <li><FormattedMessage {...messages.notes.notesSix} /></li>
              <li>The rate will be fluctuated, please do contact for the updated rates. (Rate updated: 17th June 2021)</li>
              {
                renderTransactionRates()
              }
            </ul>
        }
        {
          checkIfGWCBank(bank) &&
            <ul className={classes.noteText}>
              <li><FormattedMessage {...messages.notes.notesSix} /> 15%</li>
            </ul>
        }
      </form>
    </>
  )
})

export default ScratchCardForm
