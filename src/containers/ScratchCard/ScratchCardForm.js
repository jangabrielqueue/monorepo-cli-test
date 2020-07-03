import React, { useState } from 'react';
import { Form, Input, Button, Select, Spin } from 'antd';
import { useIntl, FormattedMessage } from 'react-intl';
import messages from './messages';
import { ReactComponent as OTPSubmitIcon } from '../../assets/icons/submit-otp.svg';

const { Option } = Select;

const ScratchCardForm = React.memo((props) => {
    const { handleSubmitScratchCard, waitingForReady, establishConnection, bank } = props;
    const { getFieldDecorator, validateFieldsAndScroll, getFieldsError, resetFields } = props.form;
    const [telcoName, setTelcoName] = useState((bank === 'GWCVND' || bank === 'GWCTHB') ? 'GW' : 'VTT');
    const intl = useIntl();

    function validationRuleforCardPin () {
        let validation = {};

        if (telcoName === 'VTT' || telcoName === 'GW') {
            validation = {
                pattern: /^\d{1,15}$/,
                message: intl.formatMessage(messages.placeholders.inputMaxChar, { maxLength: 15 })
            }
        } else if (telcoName === 'VNP') {
            validation = {
                pattern: /^\d{1,14}$/,
                message: intl.formatMessage(messages.placeholders.inputMaxChar, { maxLength: 14 })
            } 
        } else if (telcoName === 'VMS') {
            validation = {
                pattern: /^\d{1,12}$/,
                message: intl.formatMessage(messages.placeholders.inputMaxChar, { maxLength: 12 })
            }
        }

        return [
            {
                required: true,
                message: intl.formatMessage(messages.placeholders.inputCardPin)
            },
            validation
        ];
    }

    function validationRuleforCardSerial () {
        let validation = [];

        if (telcoName === 'VTT' || telcoName === 'VNP') {
            validation = [
                {
                    required: true,
                    message: intl.formatMessage(messages.placeholders.inputSerialNumber)
                },
                {
                    pattern: /^\d{1,14}$/,
                    message: intl.formatMessage(messages.placeholders.inputMaxChar, { maxLength: 14 })
                }
            ];
        } else if (telcoName === 'GW') {
            validation = [
                {
                    required: true,
                    message: intl.formatMessage(messages.placeholders.inputSerialNumber)
                },
                {
                    pattern: /^\d{1,15}$/,
                    message: intl.formatMessage(messages.placeholders.inputMaxChar, { maxLength: 15 })
                }
            ];
        } else {
            validation = [
                {
                    required: true,
                    message: intl.formatMessage(messages.placeholders.inputSerialNumber)
                }                
            ];
        }

        return validation;
    }

    function hasErrors (fieldsError) {
        return Object.keys(fieldsError).some(field => fieldsError[field]);
    }

    return (
        <main>
            <Spin spinning={waitingForReady}>
                <Form layout='vertical' hideRequiredMark={true} onSubmit={(e) => handleSubmitScratchCard(e, validateFieldsAndScroll)}>
                    {
                        (bank !== 'GWCVND' && bank !== 'GWCTHB') &&
                        <div className='form-icon-container mobile'>
                            <Form.Item label={intl.formatMessage(messages.placeholders.telcoName)}>
                                {
                                    getFieldDecorator('telcoName', {
                                        rules: [{
                                            required: true,
                                            message: intl.formatMessage(messages.placeholders.selectTelco)
                                        }],
                                        initialValue: telcoName
                                    })
                                    (
                                        <Select
                                            size='large'
                                            onChange={(val) => {
                                                setTelcoName(val)
                                                resetFields()
                                            }}
                                            aria-owns='telco-1 telco-2 telco-3'
                                        >
                                            <Option value='VTT' id='telco-1'>Viettel</Option>
                                            <Option value='VNP' id='telco-2'>Vinaphone</Option>
                                            <Option value='VMS' id='telco-3'>Mobiphone</Option>
                                        </Select>                            
                                    )
                                }
                            </Form.Item>
                        </div>
                    }
                    <div className='form-icon-container credit-card'>
                        <Form.Item label={intl.formatMessage(messages.placeholders.cardPin)} htmlFor='scratch_card_form_cardPin'>
                            {
                                getFieldDecorator('cardPin', {
                                    rules: validationRuleforCardPin()
                                })
                                (
                                    <Input
                                        type='number'
                                        size='large'
                                        allowClear
                                        id='scratch_card_form_cardPin'
                                        onKeyDown={e => e.which === 69 && e.preventDefault()}
                                        autoComplete='off'
                                    />                            
                                )
                            }
                        </Form.Item>
                    </div>
                    <div className='form-icon-container credit-card'>
                        <Form.Item label={intl.formatMessage(messages.placeholders.cardSerialNo)} htmlFor='scratch_card_form_cardSerialNumber'>
                            {
                                getFieldDecorator('cardSerialNumber', {
                                    rules: validationRuleforCardSerial()
                                })
                                (
                                    <Input
                                        type='number'
                                        size='large'
                                        allowClear
                                        id='scratch_card_form_cardSerialNumber'
                                        onKeyDown={e => e.which === 69 && e.preventDefault()}
                                        autoComplete='off'
                                    />                         
                                )
                            }
                        </Form.Item>
                    </div>
                    <div className='form-content-submit-container'>
                        <Button
                            className='button-precard'
                            size='large'
                            htmlType='submit'
                            disabled={hasErrors(getFieldsError()) || !establishConnection}
                            loading={waitingForReady}
                        >
                            {
                                !waitingForReady &&
                                <div className='button-content'>
                                    <OTPSubmitIcon /> <FormattedMessage {...messages.submit} />
                                </div>
                            }
                        </Button>
                    </div>
                    {
                        (bank !== 'GWCVND' && bank !== 'GWCTHB') &&
                        <div className='note-text'>
                            <p>- <FormattedMessage {...messages.texts.submitCorrectCardDetails} /></p>
                            <p>- <FormattedMessage {...messages.texts.submitIncorrectCardDetails} /></p>    
                        </div>
                    }
                </Form>
            </Spin>
        </main>
    );
});

const WrappedScratchCardForm = Form.create({ name: 'scratch_card_form' })(ScratchCardForm);
export default WrappedScratchCardForm;
