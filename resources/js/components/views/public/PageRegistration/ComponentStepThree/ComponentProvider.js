import React, {useState} from "react";

import { 
    Layout, Card, Form, Input, Button, Row, Col, Image, Divider,
    Collapse,
    Select
} from "antd";

import $ from 'jquery'

const ComponentProvider = ({
    setShowStepFour,
    setDataStepThree,
    setCollapse,
}) => {
    const [form] = Form.useForm();

    const onFinishStepThree = (values) => {
        setDataStepThree(values)
        setShowStepFour(true)
        setCollapse(['4'])
    };

    const [coupon, setCoupon] = useState(false)
    const [program, setProgram] = useState(0)
    const handlerMemberProgram = ({value, options}) => {
        setCoupon(true)
        setProgram(options['data-price'])
        form.setFieldsValue({
            price: options['data-price']
        })
        // setProgram
        // const price = e.target.getAttribute('data-price');
        // let selectedIndex = e.target.selectedOptions[0].dataset.index];
        // var uid = obj.options[obj.selectedIndex].getAttribute('data');

        
        // console.log('price', event.target[event.target.selectedIndex].getAttribute('data-price'))
        // console.log('index', index)
        
        // console.log('price', event.currentTarget.getAttribute('data-price').value)
    }

    const [couponError, setCouponError] = useState(false)
    const handleApplyCoupon = (e) => {
        let coupon = $('#form-member_coupon').val()
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
            <span>Select Your Program</span><br/>
            <Form.Item
                name="program_plan"
                rules={[
                    {
                        required: true,
                        message: "This field field is required."
                    }
                ]}
            >
                <Select
                    className="login-input login-select"
                    placeholder="SELECT CE MEMBER PROGRAM"
                    size="large"
                    // onChange={handlerMemberProgram.bind(this)}
                    onChange={(value, options)=>handlerMemberProgram({value, options})}
                >
                    <Select.Option
                        key="1"
                        value="TIER 1 Yearly - $1,295 (Up to 4 Events per Year)"
                        data-price="1,295"
                    >
                        TIER 1 Yearly - $1,295 (Up to 4 Events per Year)
                    </Select.Option>
                    <Select.Option
                        key="2"
                        value="TIER 2 Yearly - $3,500 (Up to 12 Events per Year)"
                        data-price="3,500"
                    >
                        TIER 2 Yearly - $3,500 (Up to 12 Events per Year)
                    </Select.Option>
                    <Select.Option
                        key="3"
                        value="TIER 3 Monthly - $5,000 (Unlimited Events Per Year)"
                        data-price="5,000"
                    >
                        TIER 3 Monthly - $5,000 (Unlimited Events Per Year)
                    </Select.Option>
                    
                </Select>
            </Form.Item>

            {coupon && <div>
                <Form.Item
                    name="coupon"
                >
                    <Input 
                        size="large"
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
                <Form.Item
                    name="price"
                >
                    <Input 
                        style={{
                            display: 'none'
                        }}
                        size="large" 
                    />
                </Form.Item>

                <h3>Total: ${program}</h3>

                <Button
                    type="primary"
                    htmlType="submit"
                    className="btn-login-outline"
                    style={{ width: "100%", marginTop: 10, fontSize: '20px', height: '45px' }}
                >
                    CONTINUE
                </Button>
            </div>}
        </Form>
    )
}

export default ComponentProvider;