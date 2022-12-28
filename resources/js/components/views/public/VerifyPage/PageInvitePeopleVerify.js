import React from "react";

import {
    Layout,
    Card,
    Form,
    Input,
    Button,
    Alert,
    Divider,
    Row,
    Col,
    notification
} from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";

import assessmentBannerLogo from "../../../assets/img/assessment-banner.png";
import ally_image from "../../../assets/img/ally_image.png";
import reportGraphicLogo from "../../../assets/img/report-graphic.png";
import tmcLogo from "../../../assets/img/TMC-logo.png";

import useAxiosQuery from "../../../providers/useAxiosQuery";
import Title from "antd/lib/typography/Title";
import Text from "antd/lib/typography/Text";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";

const key = "PromiseNetwork@2021";
const encryptor = require("simple-encryptor")(key);

export default function PageInvitePeopleVerify({ match }) {
    let history = useHistory();
    let token = match.params.token;
    let apiUrl = `${window.location.origin}/api/v1/`;
    let url = `newpassword/auth`;
    console.log(token);

    React.useEffect(() => {
        axios
            .post(
                `${apiUrl}${url}`,
                {},
                {
                    headers: {
                        Authorization: "Bearer " + token
                    }
                }
            )
            .then(res => {
                console.log("success");
            })
            .catch(err => {
                if (err.response.status === 401) {
                    history.push("/404");
                }
            });
    }, []);

    const [errorMessage, setErrorMessage] = React.useState();
    const [successMessage, setSuccessMessage] = React.useState();
    const [loadButton, setLoadButton] = React.useState(false);

    const onFinish = values => {
        console.log(values);
        setLoadButton(true);
        axios
            .put(
                `${apiUrl}invitepeople/1`,
                { password: values.password },
                {
                    headers: {
                        Authorization: "Bearer " + token
                    }
                }
            )
            .then(res => {
                notification.success({
                    message: "Password Updated !"
                });
                setLoadButton(false);
                localStorage.token = encryptor.encrypt(token);
                localStorage.userdata = encryptor.encrypt(res.data.data);
                window.location.replace(window.location.origin);
            });
    };

    return (
        <Layout className="login-layout">
            <br />
            <br />
            <br />
            <br />
            <Row>
                <Col xs={0} md={9}></Col>
                <Col xs={24} md={6}>
                    <Card>
                        <Row>
                            <Col xs={24} md={24}>
                                <Card.Meta className="m-b-md text-center" />

                                <Form
                                    name="normal_login"
                                    className="login-form"
                                    onFinish={onFinish}
                                    style={{
                                        maxWidth: "600px",

                                        margin: "auto",
                                        textAlign: "center"
                                    }}
                                >
                                    <p style={{ fontSize: "22px" }}>
                                        Thank you for accepting our invitation.
                                        your account is now verified
                                    </p>
                                    <p style={{ fontSize: "15px" }}>
                                        Please Create Your Password
                                    </p>
                                    <Form.Item
                                        name="password"
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Please input your Password!"
                                            }
                                        ]}
                                    >
                                        <Input.Password
                                            size="large"
                                            prefix={
                                                <LockOutlined className="site-form-item-icon" />
                                            }
                                            placeholder="Password"
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
                                                    "Please confirm your password!"
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
                                                }
                                            })
                                        ]}
                                    >
                                        <Input.Password
                                            size="large"
                                            prefix={
                                                <LockOutlined className="site-form-item-icon" />
                                            }
                                            placeholder="Confirm Password"
                                        />
                                    </Form.Item>

                                    {errorMessage && (
                                        <Alert
                                            className="mt-10"
                                            type="error"
                                            message={errorMessage}
                                            style={{ marginBottom: 10 }}
                                        />
                                    )}

                                    {successMessage && (
                                        <Alert
                                            className="mt-10"
                                            type="success"
                                            message={successMessage}
                                            style={{ marginBottom: 10 }}
                                        />
                                    )}

                                    <Form.Item>
                                        <Button
                                            size="large"
                                            type="primary"
                                            htmlType="submit"
                                            loading={loadButton}
                                            style={{
                                                width: "50%",
                                                background:
                                                    process.env.MIX_APP_NAME ==
                                                    "Promise Network"
                                                        ? "#3cb4ca"
                                                        : process.env
                                                              .MIX_NAV_BG_COLOR
                                            }}
                                        >
                                            SUBMIT
                                        </Button>
                                    </Form.Item>
                                </Form>
                            </Col>
                        </Row>
                    </Card>
                </Col>
                <Col xs={0} md={3}></Col>
            </Row>
            <br />
            <Row>
                <Col xs={0} md={9}></Col>
                <Col xs={24} md={6} className="text-center">
                    <b>
                        {process.env.MIX_APP_NAME} can only be accessed by
                        invitation and is the most direct link to
                        <br />
                        outstanding support and service.
                    </b>
                    <br />
                    <br />
                    <br />
                    <br />
                    <div>
                        <span>
                            {" "}
                            <a href="https://my.splashtop.com/team_deployment/download/77WP3P75S5SL">
                                Remote Log in
                            </a>
                        </span>
                        <span style={{ marginLeft: 20 }}>
                            <a href="https://merchant.status.tsys.com">
                                TSYS Uptime Status
                            </a>
                        </span>
                    </div>
                </Col>
                <Col xs={24} md={6}></Col>
            </Row>
        </Layout>
    );
}
