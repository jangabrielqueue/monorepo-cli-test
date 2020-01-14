import React, { useState, useEffect } from 'react';
import { Form, InputNumber, Button, Select, Icon, Spin, Row, Col } from 'antd';
import { useQuery } from '../../utils/utils';
import axios from 'axios';

const ScratchCardForm = React.memo((props) => {
    const { Option } = Select;
    const { getFieldDecorator,validateFields } = props.form;
    const { handleCurrentStep } = props;
    const queryParams = useQuery();
    const [postRes, setPostRes] = useState({
        loading: false,
        statusCode: '',
        redirectUri: '',
        error: false
      });
    const loadingIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;
    const [telcoName, setTelcoName] = useState('');

    function handleSubmit (e) {
        e.preventDefault();

        validateFields(async (err, values) => {

            if (!err) {
                const submitValues = {
                    Telecom: values.telcoName,
                    Pin: values.cardPin.toString(),
                    SerialNumber: values.cardSerialNumber.toString(),
                    ClientIp: queryParams.get('ClientIp'),
                    Language: queryParams.get('Language'),
                    SuccessfulUrl: queryParams.get('SuccessfulUrl'),
                    FailedUrl: queryParams.get('FailedUrl'),
                    CallbackUri: queryParams.get('CallbackUri'),
                    Datetime: queryParams.get('Datetime'),
                    Key: queryParams.get('Key'),
                    Note: queryParams.get('Note'),
                    Merchant: queryParams.get('Merchant'),
                    Currency: queryParams.get('Currency'),
                    Bank: queryParams.get('Bank'),
                    Customer: queryParams.get('Customer'),
                    Reference: queryParams.get('Reference'),
                    Amount: queryParams.get('Amount')
                };
                
                await setPostRes({
                    loading: true,
                    statusCode: '',
                    redirectUri: '',
                    error: false
                });

                try {
                    const res = await axios({
                      url: '/ScratchCard/Deposit',
                      method: 'POST',
                      data: submitValues
                    });
                    await setPostRes({
                      loading: false,
                      statusCode: res.data.data.statusCode,
                      redirectUri: res.data.redirectUri,
                      error: false
                    });
                  } catch (error) {
                    await setPostRes({
                      loading: false,
                      statusCode: '',
                      redirectUri: '',
                      error: true
                    });
                  }
            }
        });
    }

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

    function renderScratchCardForm () {
        if (postRes.loading) {
            return (
                    <div className='loading-container'>
                        <Spin indicator={loadingIcon} tip='Waiting For Response...' />
                    </div>
            );
        } else if (postRes.statusCode === '009') {
            return (
                <div className='loading-container'>
                    <Spin indicator={loadingIcon} tip='Confirming transaction...' />
                </div>
            );
        } else {
            const formItemLayout = {
                labelCol: {
                    xs: {
                        span: 6
                    }
                },
                wrapperCol: {
                    xs: {
                        span: 18
                    }
                }
            };

           return (
            <>
                <h1>Fill In Form</h1>
                <Form {...formItemLayout} onSubmit={handleSubmit}>
                    <Form.Item labelAlign='left' label='Telco Name'>
                    {
                        getFieldDecorator('telcoName', {
                            rules: [{
                                required: true,
                                message: 'Please select telco name!'
                            }]
                        })
                        (
                            <Select
                                placeholder='Telco Name'
                                size='large'
                                onChange={(val) => {
                                    setTelcoName(val)
                                    props.form.resetFields()
                                }}
                            >
                                <Option value='VTT'>Viettel</Option>
                                <Option value='VNP'>Vinaphone</Option>
                                <Option value='VMS'>Mobiphone</Option>
                            </Select>                            
                        )
                    }
                    </Form.Item>
                    <Form.Item labelAlign='left' label='Amount'>
                    {
                        getFieldDecorator('amount', {
                            rules: [{
                                required: true,
                                message: 'Please input amount!'
                            }],
                            initialValue: queryParams.get('Amount')
                        })
                        (
                            <InputNumber type='number' placeholder='Amount' disabled size='large' />                            
                        )
                    }
                    </Form.Item>
                    <Form.Item labelAlign='left' label='Card Pin'>
                    {
                        getFieldDecorator('cardPin', {
                            rules: validationRuleforCardPin()
                        })
                        (
                            <InputNumber type='number' placeholder='Card Pin' size='large' disabled={!telcoName} />                            
                        )
                    }
                    </Form.Item>
                    <Form.Item labelAlign='left' label='Card Serial No.'>
                    {
                        getFieldDecorator('cardSerialNumber', {
                            rules: validationRuleforCardSerial()
                        })
                        (
                            <InputNumber type='number' placeholder='Card Serial No.' size='large' disabled={!telcoName} />                         
                        )
                    }
                    </Form.Item>
                    <Row justify='center' type='flex'>
                        <Col span={8}>
                            <Button type='primary' htmlType='submit' block>
                                Submit
                            </Button>
                        </Col>
                    </Row>
                    <div className='note-text'>
                        <p>- Please submit the correct amount, card pin and serial number.</p>
                        <p>- If submitted with incorrect amount, member will be penalised.</p>    
                    </div>
                </Form>
            </>
           ); 
        }
    }

    useEffect(() => {
        if (postRes.statusCode !== '009' && postRes.redirectUri && !postRes.error && !postRes.loading) {
             handleCurrentStep(postRes.statusCode, postRes.redirectUri)
        } else if (postRes.statusCode === '009') {
            setTimeout(() => handleCurrentStep(postRes.statusCode, postRes.redirectUri), 3000);
        } else if (postRes.error) {
            props.history.replace('/deposit/invalid');
        }

        if (!props.location.search) {
            props.history.replace('/deposit/invalid');
        }
    }, [postRes]);

    return (
        <div className='scratch-form-container'>
            {
                renderScratchCardForm()
            }
        </div>
    );
});

const WrappedScratchCardForm = Form.create({ name: 'scratch_card_form' })(ScratchCardForm);
export default WrappedScratchCardForm;
