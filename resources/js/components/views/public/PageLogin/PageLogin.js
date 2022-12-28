import React, { useEffect, useState } from "react";

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
    Modal,
    message,
    notification,
    Image,
} from "antd";
import { UserOutlined, LockOutlined, CloseOutlined } from "@ant-design/icons";

import imageLogo from "/resources/assets/img/brand/logo_placeholder_dark.png";

import useAxiosQuery from "../../../providers/useAxiosQuery";
import moment from "moment";
import { DragDropContext } from "react-beautiful-dnd";
import { Link, useLocation, useHistory } from "react-router-dom";

const key = "DavidInvoice@2022";
const encryptor = require("simple-encryptor")(key);
export default function PageLogin() {
    let history = useHistory();
    const [errorMessage, setErrorMessage] = useState();

    const [form] = Form.useForm();
    const [formPassword] = Form.useForm();

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const { mutate: mutateLogin, isLoading: isLoadingButtonLogin } =
        useAxiosQuery("POST", "api/v1/login", "login");

    useEffect(() => {
        if (urlParams.get("token")) {
            let token = urlParams.get("token");
            let userdata = JSON.parse(urlParams.get("userdata"));
            userdata.email = userdata.email.replace(" ", "+");

            localStorage.token = encryptor.encrypt(token);
            localStorage.userdata = encryptor.encrypt(userdata);
            location.href = `${window.location.origin}/welcome`;
        }
        return () => {};
    }, []);

    const onFinish = (values) => {
        setErrorMessage(undefined);
        let data = { email: values.email, password: values.password };
        // console.log(values.password)
        mutateLogin(data, {
            onSuccess: (res) => {
                if (res.token) {
                    console.log("permission", res);
                    localStorage.token = encryptor.encrypt(res.token);
                    localStorage.userdata = encryptor.encrypt(res.data);
                    if (urlParams.get("redirect")) {
                        location.href = urlParams.get("redirect");
                    } else {
                        location.reload();
                    }
                } else {
                    setErrorMessage("Username or Password is Invalid");
                }
            },
            onError: (err) => {
                setErrorMessage(err.response.data.error);
                countDownModal(err.response.data.error);
            },
        });
    };

    function countDownModal(message) {
        let secondsToGo = 5;
        const modal = Modal.error({
            title: message,
            // content: `This modal will be destroyed after ${secondsToGo} second.`
        });
        const timer = setInterval(() => {
            secondsToGo -= 1;
            // modal.update({
            //     content: `This modal will be destroyed after ${secondsToGo} second.`
            // });
        }, 1000);
        setTimeout(() => {
            clearInterval(timer);
            modal.destroy();
        }, secondsToGo * 1000);
    }

    const onFinishPassword = (values) => {
        console.log("onFinishPassword", values);
    };

    const handleRegistrationLink = () => {
        history.push("/registration");
    };

    const [showPassword, setShowPassword] = useState(false);
    const hadleShowPassword = () => {
        // $('.forgot-password').show()
        setShowPassword(!showPassword);
    };

    return (
        <Layout.Content
            className="login-layout"
            style={{
                paddingBottom: "10vh",
                height: "100vh",
                // background:
                //     "linear-gradient(to bottom, #ffffff 0%, #105b7d 100%);",
            }}
        >
            <title> David Invoices </title>
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
                        title={
                            <Image
                                src={imageLogo}
                                preview={false}
                                style={{ marginTop: 20, marginBottom: 20 }}
                            />
                        }
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
                                    <br />
                                    <div style={{ marginBottom: 10 }}>
                                        Sign In to your account
                                    </div>
                                    <Form.Item
                                        name="email"
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "This field field is required.",
                                            },
                                        ]}
                                    >
                                        <Input
                                            placeholder="Username / E-mail"
                                            className="login-input"
                                            size="large"
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        name="password"
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "This field field is required.",
                                            },
                                        ]}
                                    >
                                        <Input.Password
                                            className="login-input"
                                            size="large"
                                            placeholder="Password"
                                        />
                                    </Form.Item>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        // loading={isLoadingButtonLogin}
                                        className="btn-login-outline"
                                        // onClick={() => {
                                        //     form.submit();
                                        // }}
                                        style={{
                                            width: "100%",
                                            marginTop: 10,
                                            fontSize: "20px",
                                            height: "45px",
                                        }}
                                    >
                                        SUBMIT
                                    </Button>
                                    <br />
                                    <br />
                                    <div
                                        className="forgot text-right"
                                        style={{
                                            textAlign: "center",
                                            color: "#343a40",
                                            // fontSize: "13px",
                                        }}
                                    >
                                        <Link
                                            type="link"
                                            className="login-form-button"
                                            size="small"
                                            style={{
                                                color: "#293a56",
                                                fontWeight: "bold",
                                                // fontSize: "13px",
                                            }}
                                            to="#"
                                            onClick={hadleShowPassword}
                                        >
                                            Forgot Password ?
                                        </Link>
                                    </div>
                                </Form>

                                {showPassword && (
                                    <Form
                                        name="basic"
                                        layout="vertical"
                                        className="login-form"
                                        style={{
                                            marginTop: "-70px",
                                        }}
                                        onFinish={onFinishPassword}
                                        form={formPassword}
                                        autoComplete="off"
                                    >
                                        <br />
                                        <br />
                                        <br />
                                        <br />
                                        <Form.Item
                                            name="email"
                                            rules={[
                                                {
                                                    required: true,
                                                    message:
                                                        "This field field is required.",
                                                },
                                            ]}
                                        >
                                            <Input
                                                placeholder="Enter your e-mail"
                                                className="login-input"
                                                size="large"
                                                type="email"
                                            />
                                        </Form.Item>
                                        <div
                                            style={{
                                                textAlign: "left",
                                                marginTop: "-13px",
                                                lineHeight: "1",
                                            }}
                                        >
                                            <span
                                                type="link"
                                                className="login-form-button"
                                                size="small"
                                                style={{
                                                    color: "#293a56",
                                                    fontWeight: "bold",
                                                    fontSize: "13px",
                                                }}
                                            >
                                                Enter your User ID or E-mail
                                                address and we will email you a
                                                link to reset your password
                                            </span>
                                        </div>

                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                            // loading={isLoadingButtonLogin}
                                            className="btn-login-outline"
                                            // onClick={() => {
                                            //     form.submit();
                                            // }}
                                            style={{
                                                width: "100%",
                                                marginTop: 10,
                                                fontSize: "20px",
                                                height: "45px",
                                            }}
                                        >
                                            SUBMIT
                                        </Button>
                                    </Form>
                                )}
                                <br />
                                <br />
                                <span>
                                    © {moment().format("YYYY")}. David Invoice.
                                    All Rights Reserved.
                                </span>
                            </Col>
                        </Row>
                    </Card>
                </Col>
            </Row>
        </Layout.Content>
    );
}
