import React, {useState} from "react";

import { 
    Layout, Checkbox, Form, Input, Button, Row, Col, Image, Divider,
    Comment, Select, notification, Alert
} from "antd";

import $ from 'jquery'

import countryList from 'react-select-country-list'

const ComponentStepFour = ({
    setShowStepFour,
    setDataStepFour,
    setCollapse,
    states,
    accountType,
    dataStepTwo,
    dataStepThree,
    dataStepFour,
}) => {
    const [form] = Form.useForm();
    let country = countryList().getData();

    const onFinishStepThree = (values) => {
        if(accept) {
            setDataStepFour(values)
            setShowStepFour(true)
            setCollapse(['4'])
            console.log('accountType', accountType)
            console.log('dataStepTwo', dataStepTwo)
            console.log('dataStepThree', dataStepThree)
            console.log('dataStepFour', values)

            notification.success({
                message: 'Success',
                description: 'Successfully Purchase Completed!'
            })
        } else {
            notification.error({
                message: 'Error',
                description: 'Please Accept the Terms and Condition!'
            })
        }
    };

    // console.log('countryList', countryList().getData())
    const [accept, setAccept] = useState(false)
    const onChange = (e) =>  {
        // console.log(`checked = ${e.target.checked}`);
        setAccept(e.target.checked)
    }

    const handleScroll = (e) => {
        console.log('values')
        let element = e.target
        if (element.scrollHeight - element.scrollTop === element.clientHeight) {
            // console.log('values')
            // alert()
            $('.complete-btn').removeAttr('disabled')
        } else {
            $('.complete-btn').attr('disabled', 'disabled')
        }
    }

    const [couponError, setCouponError] = useState(false)
    const handleApplyCoupon = (e) => {
        let coupon = $('#form-member_coupon_card').val()
        setCouponError(true)
        console.log('coupon', coupon)
    }


    return (
        <Form
            name="form-member"
            layout="vertical"
            className="login-form"
            // style={{
            //     marginTop: '-50px'
            // }}
            onFinish={onFinishStepThree}
            form={form}
            autoComplete="off"
        >
            <span>{dataStepThree.program_plan}</span><br/><br/>
            <h1>Credit Card Information</h1>
            
            <Form.Item
                name="card_name"
                rules={[
                    {
                        required: true,
                        message: "This field field is required."
                    }
                ]}
            >
                <Input size="large" placeholder="Name on Card"/>
            </Form.Item>
            
            <Form.Item
                name="card_number"
                rules={[
                    {
                        required: true,
                        message: "This field field is required."
                    }
                ]}
            >
                <Input placeholder="Card Number" size="large"/>
            </Form.Item>

            <Row gutter={24}>
                <Col className="gutter-row" xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
                    <Form.Item
                        name="expiration_month"
                        rules={[
                            {
                                required: true,
                                message: "This field field is required."
                            }
                        ]}
                    >
                        <Select
                            className="login-input login-select"
                            placeholder="Expiration Month"
                            size="large"
                            // onChange={handlerMemberProgram.bind(this)}
                        >
                            <Select.Option
                                key="1"
                                value="01"
                            >
                                01
                            </Select.Option>
                            <Select.Option
                                key="2"
                                value="02"
                            >
                                02
                            </Select.Option>
                        </Select>
                    </Form.Item>
                </Col>
                <Col className="gutter-row" xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
                    <Form.Item
                        name="expiration_year"
                        rules={[
                            {
                                required: true,
                                message: "This field field is required."
                            }
                        ]}
                    >
                        <Select
                            className="login-input login-select"
                            placeholder="Expiration Year"
                            size="large"
                            // onChange={handlerMemberProgram.bind(this)}
                        >
                            <Select.Option
                                key="1"
                                value="01"
                            >
                                01
                            </Select.Option>
                            <Select.Option
                                key="2"
                                value="02"
                            >
                                02
                            </Select.Option>
                        </Select>
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={24}>
                <Col className="gutter-row"  xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
                    <Form.Item
                        name="card_security_code"
                        rules={[
                            {
                                required: true,
                                message: "This field field is required."
                            }
                        ]}
                    >
                        <Input placeholder="Security Code (CVV)" size="large"/>
                    </Form.Item>
                </Col>
                <Col className="gutter-row" xs={24} sm={24} md={12} lg={12} xl={12} xxl={12} style={{marginBottom: '4px'}}>
                    <Form.Item
                        name="coupon_card" 
                    >
                        <Input 
                            size="large"
                            placeholder="Coupon Code"
                            className="coupon"
                            addonAfter={
                                <Button
                                    className="btn-login-outline"
                                    style={{
                                        height: '40px',
                                        marginTop: '-1px'
                                    }}
                                    onClick={e=>handleApplyCoupon(e)}
                                >
                                    APPLY
                                </Button>
                            }
                        />
                    </Form.Item>
                    {couponError &&
                        <span style={{color: '#23BF08', marginTop: '-23px', position: 'absolute'}}>Code Successfully appliied</span>
                    }
                </Col>
            </Row>
            
            <br/><br/>
            <h1 style={{marginTop: '-25px'}}>Billing Address</h1>
            <Form.Item
                name="address"
            >
                <Input 
                    placeholder="Street Address"
                    size="large" 
                />
            </Form.Item>
            <Form.Item
                name="address_extra"
            >
                <Input 
                    placeholder="Street Address 2"
                    size="large" 
                />
            </Form.Item>
            <Row gutter={24} style={{marginBottom: '-27px'}}>
                <Col className="gutter-row" xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
                    <Form.Item
                        name="city"
                    >
                        <Input placeholder="City" size="large"/>
                    </Form.Item>
                </Col>
                <Col className="gutter-row" xs={24} sm={24} md={6} lg={6} xl={6} xxl={6}>
                    <Form.Item
                        name="State"
                        rules={[
                            {
                                required: true,
                                message: "This field field is required."
                            }
                        ]}
                    >
                        <Select
                            className="login-input login-select"
                            placeholder="State"
                            size="large"
                            // onChange={handlerMemberProgram.bind(this)}
                        >
                            {states.map((row, index) => {
                                return <Select.Option
                                    key={index}
                                    value={row.name}
                                >
                                    {row.name}
                                </Select.Option>
                            })}
                        </Select>
                    </Form.Item>
                </Col>
                <Col className="gutter-row" xs={24} sm={24} md={6} lg={6} xl={6} xxl={6}>
                    <Form.Item
                        name="zip"
                        rules={[
                            {
                                required: true,
                                message: "This field field is required."
                            }
                        ]}
                    >
                        <Form.Item
                            name="zip"
                        >
                            <Input placeholder="Zip" size="large"/>
                        </Form.Item>
                    </Form.Item>
                </Col>
            </Row>
            <Form.Item
                name="country"
                rules={[
                    {
                        required: true,
                        message: "This field field is required."
                    }
                ]}
            >
                <Select
                    className="login-input login-select"
                    placeholder="Country"
                    size="large"
                    // onChange={handlerMemberProgram.bind(this)}
                >
                    {country.map((row, index) => {
                        return <Select.Option
                            key={index}
                            value={row.label}
                        >
                            {row.label}
                        </Select.Option>
                    })}
                </Select>
            </Form.Item>

            <div
                onScroll={handleScroll}
                className="scrollbar-2"
                style={{
                    overflowY: 'scroll',
                    overflowX: 'hidden',
                    height: '150px'
                }}
            >
                <p>
                    <h4> Privacy Policy & Terms and Conditions (Please Read) </h4>
                    Enim minim duis eu ad tempor ad culpa nulla aliquip velit. Ea consectetur in sunt tempor fugiat qui 
                    cillum proident ullamco exercitation culpa. Laboris fugiat officia aliquip aute proident nulla excepteur 
                    aute excepteur labore nisi sit. Mollit sint occaecat occaecat in duis labore deserunt quis 
                    Lorem cillum cillum. Aliquip dolore enim dolore nisi excepteur sint irure dolore exercitation 
                    anim elit. Do exercitation dolore tempor voluptate duis consequat commodo cupidatat ullamco 
                    officia elit irure.<br/><br/>
                    Enim minim duis eu ad tempor ad culpa nulla aliquip velit. Ea consectetur in sunt tempor fugiat qui 
                    cillum proident ullamco exercitation culpa. Laboris fugiat officia aliquip aute proident nulla excepteur 
                    aute excepteur labore nisi sit. Mollit sint occaecat occaecat in duis labore deserunt quis 
                    Lorem cillum cillum. Aliquip dolore enim dolore nisi excepteur sint irure dolore exercitation 
                    anim elit. Do exercitation dolore tempor voluptate duis consequat commodo cupidatat ullamco 
                    officia elit irure.<br/><br/>
                    Enim minim duis eu ad tempor ad culpa nulla aliquip velit. Ea consectetur in sunt tempor fugiat qui 
                    cillum proident ullamco exercitation culpa. Laboris fugiat officia aliquip aute proident nulla excepteur 
                    aute excepteur labore nisi sit. Mollit sint occaecat occaecat in duis labore deserunt quis 
                    Lorem cillum cillum. Aliquip dolore enim dolore nisi excepteur sint irure dolore exercitation 
                    anim elit. Do exercitation dolore tempor voluptate duis consequat commodo cupidatat ullamco 
                    officia elit irure.<br/><br/>
                </p>
            </div><br/>

            <Checkbox 
                onChange={onChange}
                name="checkbox_2"
                className="optiona"
                id="dd"
            >
                Yes, I have read the Privacy Policy and Terms and Conditions
            </Checkbox>

            {/* <input type="checkbox" name="optiona" id="dd" /> 
            Yes, I have read the Privacy Policy and Terms and Conditions */}

            <Button
                type="primary"
                htmlType="submit"
                className="btn-login-outline complete-btn"
                disabled
                style={{ width: "100%", marginTop: 10, fontSize: '20px', height: '45px' }}
                
            >
                COMPLETE PURCHASE
            </Button>
        </Form>
    )
}

export default ComponentStepFour;