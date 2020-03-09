import React, { useState } from 'react';
import { Form, Input, Button, Select, Statistic } from 'antd';
import { useQuery } from '../../utils/utils';
import { useIntl, FormattedMessage } from 'react-intl';
import messages from './messages';

const { Option } = Select;

const ScratchCardForm = React.memo((props) => {
    const { handleSubmitScratchCard } = props;
    const { getFieldDecorator, validateFieldsAndScroll, getFieldsError, resetFields } = props.form;
    const queryParams = useQuery();
    const [telcoName, setTelcoName] = useState('VTT');
    const intl = useIntl();

    function validationRuleforCardPin () {
        let validation = {};

        if (telcoName === 'VTT') {
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
                message: intl.formatMessage(messages.placeholders.inputSerialNumber)
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
        <Form onSubmit={(e) => handleSubmitScratchCard(e, validateFieldsAndScroll)}>
            <Form.Item>
                <Statistic
                    title={intl.formatMessage(messages.deposit)}
                    prefix={queryParams.get('c1')}
                    value={queryParams.get('a')}
                    valueStyle={{ color: "#000", fontWeight: 700 }}
                    precision={2}
                />
            </Form.Item>
            <Form.Item>
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
                        allowClear
                        placeholder={intl.formatMessage(messages.placeholders.telcoName)}
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
            <Form.Item htmlFor='scratch_card_form_cardPin'>
            {
                getFieldDecorator('cardPin', {
                    rules: validationRuleforCardPin()
                })
                (
                    <Input
                        type='number'
                        placeholder={intl.formatMessage(messages.placeholders.cardPin)}
                        size='large'
                        id='scratch_card_form_cardPin'
                    />                            
                )
            }
            </Form.Item>
            <Form.Item htmlFor='scratch_card_form_cardSerialNumber'>
            {
                getFieldDecorator('cardSerialNumber', {
                    rules: validationRuleforCardSerial()
                })
                (
                    <Input
                        type='number'
                        placeholder={intl.formatMessage(messages.placeholders.cardSerialNo)}
                        size='large'
                        id='scratch_card_form_cardSerialNumber'
                    />                         
                )
            }
            </Form.Item>
            <Form.Item>
                <Button
                    size='large'
                    shape='round'
                    type='primary'
                    htmlType='submit'
                    block
                    disabled={hasErrors(getFieldsError())}
                >
                    <FormattedMessage {...messages.submit} />
                </Button>
            </Form.Item>
            <div className='note-text'>
                <p>- <FormattedMessage {...messages.texts.submitCorrectCardDetails} /></p>
                <p>- <FormattedMessage {...messages.texts.submitIncorrectCardDetails} /></p>    
            </div>
        </Form>
    );
});

const WrappedScratchCardForm = Form.create({ name: 'scratch_card_form' })(ScratchCardForm);
export default WrappedScratchCardForm;
