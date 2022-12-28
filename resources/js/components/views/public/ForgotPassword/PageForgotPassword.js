import React, { useState } from "react";
import $ from "jquery";
import {
    Layout,
    Card,
    Form,
    Input,
    Button,
    Row,
    Col,
    Image,
    Divider,
} from "antd";

import { Link, useHistory } from "react-router-dom";
import imageLogo from "../../../assets/img/logo.png";
import { PasswordInput } from "antd-password-input-strength";

export default function PageForgotPassword() {
    let history = useHistory();

    const [form] = Form.useForm();
    const [formPassword] = Form.useForm();

    const onFinish = (values) => {};

    return (
        <Layout.Content
            className="login-layout"
            style={{
                paddingBottom: "18vh",
                background: "linear-gradient(180deg, white 0%, #e2c991 80%)",
                height: "100%",
            }}
        >
            <Row>
                <Col xs={24} sm={4} md={4} lg={6} xl={8} xxl={9}></Col>
                <Col
                    xs={24}
                    sm={16}
                    md={16}
                    lg={12}
                    xl={8}
                    xxl={6}
                    style={{ padding: 10 }}
                >
                    <Card
                        style={{
                            background: "transparent",
                            border: "0px solid",
                            textAlign: "center",
                            height: "auto",
                        }}
                        headStyle={{
                            borderBottom: "none",
                            background: "transparent!important",
                        }}
                        title={<Image src={imageLogo} preview={false} />}
                        className="login"
                    >
                        <Row className="flexdirection">
                            <Col xs={24} md={24}>
                                <Form
                                    name="basic"
                                    layout="vertical"
                                    className="login-form"
                                    style={{
                                        marginTop: "-50px",
                                    }}
                                    onFinish={onFinish}
                                    form={form}
                                    autoComplete="off"
                                >
                                    <span style={{ fontSize: "20px" }}>
                                        Create Your Membership Account
                                    </span>
                                    <br />
                                    <span>
                                        Your password must be at least 8
                                        characters and contain at least one
                                        number, one uppercase letter and one
                                        special character.
                                    </span>
                                    <br />
                                    <br />

                                    <Form.Item
                                        name="password"
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Please input your password!",
                                            },
                                            // { validator: validatePassword }
                                        ]}
                                        hasFeedback
                                    >
                                        <PasswordInput
                                            placeholder="Password"
                                            size="large"
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        name="confirm"
                                        dependencies={["password"]}
                                        hasFeedback
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Please confirm your password!",
                                            },
                                            ({ getFieldValue }) => ({
                                                validator(_, value) {
                                                    if (
                                                        !value ||
                                                        getFieldValue(
                                                            "password"
                                                        ) === value
                                                    ) {
                                                        return Promise.resolve();
                                                    }
                                                    return Promise.reject(
                                                        new Error(
                                                            "The two passwords that you entered do not match!"
                                                        )
                                                    );
                                                },
                                            }),
                                        ]}
                                    >
                                        <PasswordInput
                                            placeholder="Confirm Password"
                                            size="large"
                                        />
                                    </Form.Item>

                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        // loading={isLoadingButtonLogin}
                                        className="btn-login-outline"
                                        style={{
                                            width: "100%",
                                            fontSize: "20px",
                                            height: "45px",
                                        }}
                                    >
                                        SUBMIT
                                    </Button>
                                </Form>

                                <br />
                                <br />
                                <span>
                                    © {moment().format("YYYY")} CE.LIYA. All
                                    Rights Reserved.
                                </span>
                            </Col>
                        </Row>
                    </Card>
                </Col>
            </Row>
        </Layout.Content>
    );
}
