import React, { useState, useEffect } from 'react';
import { Form, InputNumber, Button, Select, Statistic, Row, Col } from 'antd';
import { useQuery } from '../../utils/utils';

const { Option } = Select;

const ScratchCardForm = React.memo((props) => {
    const { handleSubmitScratchCard } = props;
    const { getFieldDecorator, validateFieldsAndScroll, getFieldsError, resetFields } = props.form;
    const queryParams = useQuery();
    const [telcoName, setTelcoName] = useState('');

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
                    title="Deposit"
                    prefix={queryParams.get('currency')}
                    value={queryParams.get('amount')}
                    valueStyle={{ color: "#000", fontWeight: 700 }}
                    precision={2}
                />
            </Form.Item>
            <Form.Item>
            {
                getFieldDecorator('telcoName', {
                    rules: [{
                        required: true,
                        message: 'Please select telco name!'
                    }]
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
                        placeholder='Card Pin'
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
                        placeholder='Card Serial No.'
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
                    Submit
                </Button>
            </Form.Item>
            <div className='note-text'>
                <p>- Please submit the correct amount, card pin and serial number.</p>
                <p>- If submitted with incorrect amount, member will be penalised.</p>    
            </div>
        </Form>
    );
});

const WrappedScratchCardForm = Form.create({ name: 'scratch_card_form' })(ScratchCardForm);
export default WrappedScratchCardForm;
