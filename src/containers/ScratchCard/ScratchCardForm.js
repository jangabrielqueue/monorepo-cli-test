import React, { useState } from 'react';
import { Form, InputNumber, Button, Select, Statistic } from 'antd';
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
                message: 'Please input a maximum length of 15 characters.'
            }                
        } else if (telcoName === 'VNP') {
            validation = {
                pattern: /^\d{1,14}$/,
                message: 'Please input a maximum length of 14 characters.'
            } 
        } else if (telcoName === 'VMS') {
            validation = {
                pattern: /^\d{1,12}$/,
                message: 'Please input a maximum length of 12 characters.'
            }
        }

        return [
            {
                required: true,
                message: 'Please input serial number!'
            },
            validation
        ]
    }

    function validationRuleforCardSerial () {
        let validation = [];

        if (telcoName === 'VTT' || telcoName === 'VNP') {
            validation = [
                {
                    required: true,
                    message: 'Please input serial number!'
                },
                {
                    pattern: /^\d{1,14}$/,
                    message: 'Please input a maximum length of 14 characters.'
                }
            ];             
        } else {
            validation = [
                {
                    required: true,
                    message: 'Please input serial number!'
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
                        placeholder='Telco Name'
                        size='large'
                        onChange={(val) => {
                            setTelcoName(val)
                            resetFields()
                        }}
                    >
                        <Option value='VTT'>Viettel</Option>
                        <Option value='VNP'>Vinaphone</Option>
                        <Option value='VMS'>Mobiphone</Option>
                    </Select>                            
                )
            }
            </Form.Item>
            <Form.Item>
            {
                getFieldDecorator('cardPin', {
                    rules: validationRuleforCardPin()
                })
                (
                    <InputNumber
                        type='number'
                        size='large'
                        placeholder={intl.formatMessage(messages.placeholders.cardPin)}
                        size='large'
                    />                            
                )
            }
            </Form.Item>
            <Form.Item>
            {
                getFieldDecorator('cardSerialNumber', {
                    rules: validationRuleforCardSerial()
                })
                (
                    <InputNumber
                        type='number'
                        size='large'
                        placeholder={intl.formatMessage(messages.placeholders.cardSerialNo)}
                        size='large'
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
                <p>- <FormattedMessage {...messages.texts.submitCorrectCardDetails} /></p>    
            </div>
        </Form>
    );
});

const WrappedScratchCardForm = Form.create({ name: 'scratch_card_form' })(ScratchCardForm);
export default WrappedScratchCardForm;
