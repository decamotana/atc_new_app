import React, { useEffect, useState } from "react";
import {
    Layout,
    Card,
    Form,
    Button,
    Row,
    Col,
    Image,
    Divider,
    Typography,
    Alert,
    notification,
    Space,
    Spin,
} from "antd";
import axios from "axios";
import { Link, useHistory } from "react-router-dom";
import moment from "moment";
import $ from "jquery";
import {
    fullwidthlogo,
    description,
    encrypt,
    apiUrl,
} from "../../../providers/companyInfo";
import { GET, POST } from "../../../providers/useAxiosQuery";
import FloatInput from "../../../providers/FloatInput";
import FloatInputPassword from "../../../providers/FloatInputPassword";
import FloatInputMask from "../../../providers/FloatInputMask";
import { H } from "highlight.run";

export default function PageLogin({ match }) {
    let token = match.params.token;
    let appointment_id = match.params.id;
    let history = useHistory();

    const { refetch: getMentainance } = GET(
        "api/v1/maintenance",
        "maintenance",

        (res) => {
            console.log("here", res.data);
            if (match.url == "/login" || match.url == "/") {
                if (res.data?.in_maintenance === 1) {
                    history.push("/maintenance");
                }
            }
        },
        false
    );

    const [showAuthCodeForm, setShowAuthCodeForm] = useState(false);
    const [isLoadingAutologIn, setIsLoadingAutoLogin] = useState(false);
    const [message, setMessage] = useState("");
    const [uId, setUid] = useState(0);
    const [form] = Form.useForm();
    const [formPassword] = Form.useForm();

    const validator = {
        require: {
            required: true,
            message: "Required",
        },
        require_false: {
            required: false,
            message: "Required",
        },
        email: {
            type: "email",
            message: "please enter a valid email",
        },
    };

    const [errorMessageLogin, setErrorMessageLogin] = useState({
        type: "success",
        message: "",
    });

    const [errorMessageForgot, setErrorMessageForgot] = useState({
        type: "success",
        message: "",
    });

    const { mutate: mutateLogin, isLoading: isLoadingButtonLogin } = POST(
        "api/v1/login",
        "login"
    );
    let screenWitdh = window.innerWidth;

    const onFinishLogin = (values) => {
        mutateLogin(values, {
            onSuccess: (res) => {
                // console.log("res", res);
                if (res) {
                    if (match.url == "/maintenance-login") {
                        localStorage.fromMaintenance = "true";
                    }

                    if (res.data.google2fa_enable === 1) {
                        setUid(res.data.id);
                        setShowAuthCodeForm(true);
                    } else {
                        H.identify(
                            res.data.firstname + " " + res.data.lastname,
                            {
                                id: res.data.id,
                                email: res.data.email,
                                username: res.data.username,
                            }
                        );

                        localStorage.userdata = encrypt(res.data);
                        localStorage.token = res.token;
                        localStorage.hasLoggedIn = true;

                        window.location.reload();
                    }
                } else {
                    setErrorMessageLogin({
                        type: "error",
                        message: res.message,
                    });
                }
            },
            onError: (err) => {
                setErrorMessageLogin({
                    type: "error",
                    message: (
                        <>
                            Unrecognized username or password.{" "}
                            <b>Forgot your password?</b>
                        </>
                    ),
                });
            },
        });
    };

    useEffect(() => {
        if (token) {
            axios
                .post(
                    `${apiUrl}api/v1/myatc/autologin/auth`,
                    {},
                    {
                        headers: {
                            Authorization: "Bearer " + token,
                        },
                    }
                )
                .then((res) => {
                    localStorage.userdata = encrypt(res.data.data);
                    localStorage.token = res.data.token;

                    H.identify(res.data.firstname + " " + res.data.lastname, {
                        id: res.data.id,
                        email: res.data.email,
                        username: res.data.username,
                    });

                    window.location.reload();
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }, []);

    useEffect(() => {
        let link = window.location.search.substring(1);
        link = link.split("email=");

        let details = link[1] ? link[1].split("&") : "";

        let getMessage = details[1] ? details[1].split("message=")[1] : "";

        if (getMessage[1]) {
            setMessage(getMessage.replace(/%20/g, " "));
        }

        if (details[0]) {
            autoLogin(details[0]);
            setIsLoadingAutoLogin(true);
        }
    }, [match]);

    const { mutate: mutateAutoLogin } = POST("api/v1/auto_login", "auto_login");

    const autoLogin = (values) => {
        console.log("match autoLogin", values);

        mutateAutoLogin(
            { email: values },
            {
                onSuccess: (res) => {
                    if (res.success) {
                        if (res.data.google2fa_enable === 1) {
                            setUid(res.data.id);
                            setShowAuthCodeForm(true);
                        } else {
                            console.log("match res", res);

                            console.log("message", message);
                            setIsLoadingAutoLogin(false);
                            localStorage.userdata = encrypt(res.data);
                            localStorage.token = res.token;
                            localStorage.hasLoggedIn = true;

                            H.identify(
                                res.data.firstname + " " + res.data.lastname,
                                {
                                    id: res.data.id,
                                    email: res.data.email,
                                    username: res.data.username,
                                }
                            );

                            window.location.reload();
                        }
                    } else {
                        //persistent
                        setTimeout(() => {
                            autoLogin(values);
                        }, 2000);
                    }
                },
                onError: (err) => {
                    setIsLoadingAutoLogin(false);
                    console.log("match err", err);
                    setErrorMessageLogin({
                        type: "error",
                        message: (
                            <>
                                Unrecognized username or password.{" "}
                                <b>Forgot your password?</b>
                            </>
                        ),
                    });
                },
            }
        );
    };

    const { mutate: mutateverify2fa, isLoading: isLoadingverify2fa } = POST(
        "api/v1/verify2fa",
        `verify2fa`
    );

    const verifyCode = (val) => {
        var code = val.code.replace(/-/g, "");

        mutateverify2fa(
            { code: code, id: uId },
            {
                onSuccess: (res) => {
                    if (res.success) {
                        console.log(res);
                        // setShowAuthCodeForm(false);
                        localStorage.userdata = encrypt(res.data);
                        localStorage.token = res.token;
                        localStorage.hasLoggedIn = true;

                        H.identify(
                            res.data.firstname + " " + res.data.lastname,
                            {
                                id: res.data.id,
                                email: res.data.email,
                                username: res.data.username,
                            }
                        );

                        window.location.reload();
                    } else {
                        notification.error({
                            message: "Error",
                            description:
                                "Invalid Authenticator Code, Please try again",
                        });
                    }
                },
                onError: (err) => {
                    console.log(err);
                },
            }
        );
    };

    const onFinishForgotPassword = (values) => {
        console.log("onFinishForgotPassword", values);

        let data = {
            ...values,
            link: window.location.origin,
        };
        mutateForgot(data, {
            onSuccess: (res) => {
                if (res.success) {
                    setErrorMessageForgot({
                        type: "success",
                        message:
                            "An e-mail has been sent, please check your inbox or your spam folder.",
                    });
                }
            },
            onError: (err) => {
                setErrorMessageForgot({
                    type: "error",
                    message: "Unrecognized email.",
                });
            },
        });
    };

    const { mutate: mutateForgot, isLoading: isLoadingForgot } = POST(
        "api/v1/forgot_password",
        "forgot_password"
    );

    const hadleShowPassword = () => {
        $("#login-form-forget").slideToggle();
    };

    return (
        <Layout className="public-layout login-layout">
            <Layout.Content>
                <Row>
                    <Col xs={24} sm={24} md={24}>
                        <Image
                            className="zoom-in-out-box"
                            src={fullwidthlogo}
                            preview={false}
                        />
                        <div className="login-sub-title"></div>
                        {!isLoadingAutologIn ? (
                            !showAuthCodeForm && (
                                <Card className="card--public-body">
                                    <Form
                                        layout="vertical"
                                        className="login-form"
                                        onFinish={onFinishLogin}
                                        form={form}
                                        autoComplete="off"
                                    >
                                        <Typography.Title
                                            level={3}
                                            className="text-center text-create-account"
                                        >
                                            Create an Account
                                        </Typography.Title>

                                        <Button
                                            type="primary"
                                            size="large"
                                            className="btn-main btn-register-here"
                                            onClick={() =>
                                                history.push("/register")
                                            }
                                            block
                                        >
                                            REGISTER HERE
                                        </Button>

                                        <Divider />

                                        <Typography.Title
                                            level={3}
                                            className="text-center text-sign-in-here"
                                        >
                                            Already Have an Account? Sign in
                                            Here
                                        </Typography.Title>
                                        <Form.Item
                                            name="email"
                                            rules={[
                                                {
                                                    required: true,
                                                    message:
                                                        "This field field is required.",
                                                },
                                            ]}
                                            hasFeedback
                                        >
                                            <FloatInput
                                                label="Username / E-mail"
                                                placeholder="Username / E-mail"
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
                                            hasFeedback
                                        >
                                            <FloatInputPassword
                                                label="Password"
                                                placeholder="Password"
                                            />
                                        </Form.Item>

                                        <div>
                                            <Typography.Text>
                                                This page is protected by
                                                reCAPTCHA, and subject to the
                                                Google{" "}
                                                <Typography.Link
                                                    href="https://policies.google.com/privacy?hl=en"
                                                    className="color-1"
                                                    target="new"
                                                    style={{
                                                        fontWeight: "500",
                                                    }}
                                                >
                                                    Privacy Policy
                                                </Typography.Link>{" "}
                                                and{" "}
                                                <Typography.Link
                                                    href="https://policies.google.com/terms?hl=en"
                                                    className="color-1"
                                                    target="new"
                                                    style={{
                                                        fontWeight: "500",
                                                    }}
                                                >
                                                    Terms of Services.
                                                </Typography.Link>
                                            </Typography.Text>
                                        </div>

                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                            loading={isLoadingButtonLogin}
                                            className="btn-primary m-t-sm btn-sign-in"
                                            block
                                            size="large"
                                        >
                                            SIGN IN
                                        </Button>

                                        {errorMessageLogin.message && (
                                            <Alert
                                                className="m-t-sm"
                                                type={errorMessageLogin.type}
                                                message={
                                                    errorMessageLogin.message
                                                }
                                            />
                                        )}

                                        <div className="forgot">
                                            <Link
                                                type="link"
                                                className="login-form-button color-1"
                                                size="small"
                                                to="#"
                                                onClick={hadleShowPassword}
                                            >
                                                Forgot Password ?
                                            </Link>
                                        </div>
                                    </Form>

                                    <Form
                                        name="basic"
                                        layout="vertical"
                                        id="login-form-forget"
                                        className="login-form m-t-sm"
                                        style={{ display: "none" }}
                                        onFinish={onFinishForgotPassword}
                                        form={formPassword}
                                        autoComplete="off"
                                    >
                                        <Form.Item
                                            name="email"
                                            rules={[
                                                {
                                                    required: true,
                                                    message:
                                                        "This field field is required.",
                                                },
                                                {
                                                    type: "email",
                                                    message: "Invalid email.",
                                                },
                                            ]}
                                            hasFeedback
                                        >
                                            <FloatInput
                                                label="Enter your e-mail"
                                                placeholder="Enter your e-mail"
                                            />
                                        </Form.Item>

                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                            className="btn-main  btn-register-here"
                                            block
                                            size="large"
                                            loading={isLoadingForgot}
                                        >
                                            SUBMIT
                                        </Button>

                                        {errorMessageForgot.message && (
                                            <Alert
                                                className="m-t-sm"
                                                type={errorMessageForgot.type}
                                                message={
                                                    errorMessageForgot.message
                                                }
                                            />
                                        )}
                                    </Form>
                                </Card>
                            )
                        ) : (
                            <div style={{ marginTop: "170px" }}>
                                <Row
                                    style={{
                                        display: "flex",
                                        justifyContent: "center",
                                    }}
                                >
                                    <Space size="middle">
                                        <Spin size="large" />
                                    </Space>
                                </Row>
                                <Row>
                                    <Space size="middle">
                                        <Typography.Title
                                            level={4}
                                            className="text-center text-sign-in-here color-16"
                                        >
                                            Saving your credentials, Please
                                            wait.
                                        </Typography.Title>
                                    </Space>
                                </Row>
                            </div>
                        )}

                        {showAuthCodeForm && (
                            <Card
                                style={{
                                    // background: "transparent",
                                    border: "0px solid",
                                    textAlign: "center",
                                    height: "auto",
                                    borderRadius: "10px",
                                    margin: "0px 10px",
                                }}
                                headStyle={{
                                    borderBottom: "none",
                                    background: "transparent!important",
                                }}
                                bodyStyle={{
                                    padding:
                                        screenWitdh < 720
                                            ? "35px 35px"
                                            : "35px 55px",
                                }}
                                className="login"
                            >
                                <Row className="flexdirection">
                                    <Col xs={24} md={24}>
                                        <Form
                                            name="basic"
                                            layout="vertical"
                                            className="login-form"
                                            // style={{
                                            //   marginTop: "-50px",
                                            // }}
                                            onFinish={verifyCode}
                                            autoComplete="off"
                                        >
                                            <div
                                                style={{ textAlign: "center" }}
                                            >
                                                {" "}
                                                <h3>
                                                    Two-Factor Authentication
                                                    Required
                                                </h3>
                                                <p>Enter Authenticator Code </p>
                                            </div>

                                            <Form.Item
                                                name="code"
                                                rules={[validator.require]}
                                                hasFeedback
                                            >
                                                <FloatInputMask
                                                    label="Authenticator Code"
                                                    placeholder="Authenticator Code"
                                                    maskLabel="code"
                                                    maskType="999-999"
                                                />
                                            </Form.Item>

                                            <Button
                                                type="primary"
                                                htmlType="submit"
                                                loading={isLoadingverify2fa}
                                                className="btn-loginNew-outline"
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
                                    </Col>
                                </Row>
                            </Card>
                        )}
                    </Col>
                </Row>
            </Layout.Content>
            <Layout.Footer className="text-center m-t-lg">
                <Typography.Text class="copyright-txt">
                    © Copyright {moment().format("YYYY")} {description}. All
                    Rights Reserved.
                </Typography.Text>
            </Layout.Footer>
        </Layout>
    );
}
