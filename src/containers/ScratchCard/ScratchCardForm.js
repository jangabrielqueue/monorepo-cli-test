import React, { useState } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import messages from './messages';
import { useFormContext } from 'react-hook-form';
import styled from 'styled-components';
import mobileIcon from '../../assets/icons/otp-reference.svg';
import creditCardIcon from '../../assets/icons/credit-card.svg';
import { checkBankIfKnown } from '../../utils/banks';
import GlobalButton from '../../components/GlobalButton';

const FormIconContainer = styled.div`
  display: flex;

  &:before {
    background: url(${props => {
      if (props.icon === 'mobile') {
        return mobileIcon;
      } else if (props.icon === 'credit-card') {
        return creditCardIcon;
      }
    }}) no-repeat center;
    content: '';
    display: block;
    height: 20px;
    margin: ${props => {
        if (props.icon === 'mobile') {
          return '15px 15px 15px 0';
        } else if (props.icon === 'credit-card') {
          return '15px 15px 15px 2px';
        }
      }};
    width: 20px;
    opacity: ${props => {
        if (props.icon === 'mobile') {
          return '1';
        } else if (props.icon === 'credit-card') {
          return '0.6';
        }
      }};
  }

  > div {
    flex-grow: 1;
  }
`;

const FormSelectField = styled.select`
  margin-bottom: 23px;
`;

const StyledNoteText = styled.div`
    font-size: 14px;
    margin: 15px 0;
    text-align: center;

    > p {
        color: #767676;
        margin-bottom: 5px;
    }
`;

const ScratchCardForm = React.memo((props) => {
    const { handleSubmitScratchCard, waitingForReady, establishConnection, currency, bank } = props;
    const [telcoName, setTelcoName] = useState('VTT');
    const intl = useIntl();
    const { register, errors, handleSubmit, reset } = useFormContext();
    const isBankKnown = checkBankIfKnown(currency, bank);
    const buttonColor = isBankKnown ? `${bank.toLowerCase()}` : 'main';

    function handleSubmitForm (values) {
        handleSubmitScratchCard(values);
    }

    function renderMaxLengthCardPin () {
        switch (telcoName) {
            case 'VTT':
                return 15;
            case 'VNP':
                return 14; 
            case 'VMS':
                return 12;
            default:
                break;
        }
    }

    function renderMaxLengthMessageCardPin () {
        switch (telcoName) {
            case 'VTT':
                return intl.formatMessage(messages.placeholders.inputMaxChar, { maxLength: 15 });
            case 'VNP':
                return intl.formatMessage(messages.placeholders.inputMaxChar, { maxLength: 14 });
            case 'VMS':
                return intl.formatMessage(messages.placeholders.inputMaxChar, { maxLength: 12 });
            default:
                break;
        }
    }

    function renderMaxLengthSerialNumber () {
        if (telcoName === 'VTT' || telcoName === 'VNP') {
            return {
                required: true,
                maxLength: 14
            };
        } else {
            return {
                required: true
            };
        }
    }

    function renderMaxLengthMessageSerialNumber () {
        if (telcoName === 'VTT' || telcoName === 'VNP') {
            return intl.formatMessage(messages.placeholders.inputMaxChar, { maxLength: 14 });
        }
    }

    return (
        <main>
            <form>
                <FormIconContainer icon='mobile'>
                    <div>
                        <label htmlFor='telcoName'><FormattedMessage {...messages.placeholders.telcoName} /></label>
                        <FormSelectField 
                            name='telcoName'
                            id='telcoName'
                            ref={register}
                            aria-owns='telco-1 telco-2 telco-3'
                            onChange={(e) => {
                                setTelcoName(e.target.value)
                                reset()
                            }}
                            value={telcoName}
                        >
                            <option value='VTT' id='telco-1'>Viettel</option>
                            <option value='VNP' id='telco-2'>Vinaphone</option>
                            <option value='VMS' id='telco-3'>Mobiphone</option>
                        </FormSelectField>
                    </div>
                </FormIconContainer>
                <FormIconContainer icon='credit-card'>
                    <div>
                        <label htmlFor='cardPin'><FormattedMessage {...messages.placeholders.cardPin} /></label>
                        <input 
                            ref={register({ required: true, maxLength: renderMaxLengthCardPin() })}
                            onKeyDown={e => e.which === 69 && e.preventDefault()} 
                            type='number' 
                            id='cardPin' 
                            name='cardPin' 
                            autoComplete='off' 
                        />      
                        <p className='input-errors'>
                            {errors.cardPin?.type === 'required' && <FormattedMessage {...messages.placeholders.inputCardPin} />}
                            {errors.cardPin?.type === 'maxLength' && renderMaxLengthMessageCardPin()}
                        </p>   
                    </div>
                </FormIconContainer>
                <FormIconContainer icon='credit-card'>
                    <div>
                        <label htmlFor='cardSerialNumber'><FormattedMessage {...messages.placeholders.cardSerialNo} /></label>
                        <input 
                            ref={register(renderMaxLengthSerialNumber())}
                            onKeyDown={e => e.which === 69 && e.preventDefault()}  
                            type='number' 
                            id='cardSerialNumber' 
                            name='cardSerialNumber' 
                            autoComplete='off' 
                        /> 
                        <p className='input-errors'>
                            {errors.cardSerialNumber?.type === 'required' && <FormattedMessage {...messages.placeholders.inputSerialNumber} />}
                            {errors.cardSerialNumber?.type === 'maxLength' && renderMaxLengthMessageSerialNumber()}
                        </p>
                    </div>
                </FormIconContainer>
                <div className='form-content-submit-container'>
                    <GlobalButton
                        label={<FormattedMessage {...messages.submit} />}
                        color={buttonColor}
                        icon={<img alt='submit' src={require('../../assets/icons/submit-otp.svg')} />}
                        onClick={handleSubmit(handleSubmitForm)}
                        disabled={!establishConnection || waitingForReady}
                    />
                </div>
                <StyledNoteText>
                    <p>- <FormattedMessage {...messages.texts.submitCorrectCardDetails} /></p>
                    <p>- <FormattedMessage {...messages.texts.submitIncorrectCardDetails} /></p>    
                </StyledNoteText>
            </form>
        </main>
    );
});

export default ScratchCardForm;
