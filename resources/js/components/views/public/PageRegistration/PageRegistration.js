import React, { useEffect, useState } from "react";

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
    Collapse,
    Select,
    notification,
} from "antd";
import { FormOutlined, PlusOutlined, MinusOutlined } from "@ant-design/icons";

// import { Link, useHistory } from "react-router-dom";
import imageLogo from "/resources/assets/img/brand/logo_placeholder_dark.png";

import useAxiosQuery from "../../../providers/useAxiosQuery";
import notificationErrors from "../../../providers/notificationErrors";
import moment from "moment";

const key = "DavidInvoice@2022";
const encryptor = require("simple-encryptor")(key);
export default function PageRegistration() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    // let history = useHistory();
    // const [errorMessage, setErrorMessage] = useState();

    const [form] = Form.useForm();
    const { Panel } = Collapse;

    const [accountType, setAccountType] = useState("");
    const [collapse, setCollapse] = useState(["1", "2", "3", "4"]);
    const halderAccountType = (values) => {
        setAccountType(values);
        setCollapse(["2", "3", "4"]);
    };

    function callback(key) {
        setCollapse(key);
    }

    let member_type = [
        {
            value: "Real Estate Agent",
            label: "Real Estate Agent",
        },
        {
            value: "Transaction Coordinator",
            label: "Transaction Coordinator",
        },
    ];

    const {
        data: dataLoanOfficerUsers,
        isLoading: isLoadingDataLoanOfficerUsers,
    } = useAxiosQuery(
        "GET",
        "api/v1/getLoanOfficers",
        "loan_officer_users",
        (res) => {
            console.log("loan_officer_users", res);
        }
    );

    const {
        mutate: mutateRegisterUser,
        isLoading: isLoadingMutateRegisterUser,
    } = useAxiosQuery("POST", "api/v1/register");
    const onFinishRegistration = (values) => {
        let data = { ...values, role: accountType };
        mutateRegisterUser(data, {
            onSuccess: (res) => {
                if (res.success) {
                    notification.success({
                        message: "Registration Success",
                        description:
                            "A WELCOME EMAIL WILL BE SENT ONCE YOUR ACCOUNT IS APPROVED",
                    });
                    form.resetFields();
                    setAccountType("");
                    // localStorage.token = encryptor.encrypt(res.token);
                    // localStorage.userdata = encryptor.encrypt(res.data);
                    // if (urlParams.get("redirect")) {
                    //     location.href = urlParams.get("redirect");
                    // } else {
                    //     location.reload();
                    // }
                }
            },
            onError: (err) => {
                // setErrorMessage(err.response.data.error);
                notificationErrors(err);
            },
        });
    };

    return (
        <Layout.Content
            className="login-layout"
            style={{
                paddingBottom: "10vh",
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
                        title={<Image src={imageLogo} preview={false} />}
                        className="login"
                    >
                        <Row className="flexdirection">
                            <Col xs={24} md={24}>
                                <br />
                                <br />
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "row",
                                    }}
                                >
                                    <div
                                        size="large"
                                        shape="circle"
                                        type="link"
                                        className="editIcon"
                                    >
                                        <FormOutlined />
                                    </div>
                                    <div
                                        style={{
                                            textAlign: "left",
                                            lineHeight: "1.3",
                                            paddingTop: "7px",
                                        }}
                                    >
                                        <span style={{ fontSize: "16px" }}>
                                            New User
                                        </span>
                                        <br />
                                        <span className="newMemberTitle">
                                            Registration
                                        </span>
                                        <br />
                                    </div>
                                </div>
                                <Divider
                                    style={{
                                        background: "#293a56",
                                        height: "2px",
                                    }}
                                />

                                <Collapse
                                    defaultActiveKey={collapse}
                                    // defaultActiveKey={['1', '2', '3', '4']}
                                    activeKey={collapse}
                                    expandIconPosition="right"
                                    expandIcon={({ isActive }) =>
                                        isActive ? (
                                            <MinusOutlined />
                                        ) : (
                                            <PlusOutlined />
                                        )
                                    }
                                    className="login-collapse"
                                    onChange={callback}
                                >
                                    <Panel
                                        header={
                                            <span style={{ fontSize: "26px" }}>
                                                Step 1
                                            </span>
                                        }
                                        key="1"
                                    >
                                        <div style={{ marginBottom: 8 }}>
                                            Please select your user type below.
                                            <span style={{ color: "red" }}>
                                                *
                                            </span>
                                        </div>
                                        <Select
                                            className="login-input login-select"
                                            placeholder="SELECT"
                                            size="large"
                                            onChange={(e) =>
                                                halderAccountType(e)
                                            }
                                        >
                                            {member_type.map((row, index) => {
                                                return (
                                                    <Select.Option
                                                        key={index}
                                                        value={row.value}
                                                        // label={row.label}
                                                    >
                                                        {row.label}
                                                    </Select.Option>
                                                );
                                            })}
                                        </Select>
                                    </Panel>
                                    {accountType && (
                                        <Panel
                                            header={
                                                <span
                                                    style={{ fontSize: "26px" }}
                                                >
                                                    Step 2 - {accountType}
                                                </span>
                                            }
                                            key="2"
                                        >
                                            <Form
                                                name="basic"
                                                layout="vertical"
                                                className="login-form"
                                                onFinish={onFinishRegistration}
                                                form={form}
                                                autoComplete="off"
                                            >
                                                <div
                                                    style={{ marginBottom: 8 }}
                                                >
                                                    Selecting this Loan Officer
                                                    will not restrict you from
                                                    working with other Loan
                                                    Officers.
                                                </div>
                                                <Form.Item
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message:
                                                                "This field field is required.",
                                                        },
                                                    ]}
                                                    name="primary_loan_officer_id"
                                                >
                                                    <Select
                                                        style={{
                                                            width: "100%",
                                                        }}
                                                        className="login-input login-select"
                                                        size="large"
                                                        placeholder="Select your primary loan officer"
                                                    >
                                                        {dataLoanOfficerUsers &&
                                                            dataLoanOfficerUsers.data.map(
                                                                (
                                                                    loan_officer,
                                                                    key
                                                                ) => {
                                                                    return (
                                                                        <Select.Option
                                                                            value={
                                                                                loan_officer.id
                                                                            }
                                                                            key={
                                                                                key
                                                                            }
                                                                        >
                                                                            {
                                                                                loan_officer.first_name
                                                                            }{" "}
                                                                            {
                                                                                loan_officer.last_name
                                                                            }
                                                                        </Select.Option>
                                                                    );
                                                                }
                                                            )}
                                                    </Select>
                                                </Form.Item>
                                                <div
                                                    style={{
                                                        fontWeight: "normal ",
                                                        marginBottom: 8,
                                                    }}
                                                >
                                                    All fields required
                                                </div>
                                                <Form.Item
                                                    name="first_name"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message:
                                                                "This field field is required.",
                                                        },
                                                    ]}
                                                >
                                                    <Input
                                                        placeholder="First Name"
                                                        className="login-input"
                                                        size="large"
                                                    />
                                                </Form.Item>
                                                <Form.Item
                                                    name="last_name"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message:
                                                                "This field field is required.",
                                                        },
                                                    ]}
                                                >
                                                    <Input
                                                        placeholder="Last Name"
                                                        className="login-input"
                                                        size="large"
                                                    />
                                                </Form.Item>
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
                                                            message:
                                                                "E-mail is not a valid email",
                                                        },
                                                    ]}
                                                    hasFeedback
                                                >
                                                    <Input
                                                        placeholder="E-mail"
                                                        className="login-input"
                                                        size="large"
                                                        type="email"
                                                    />
                                                </Form.Item>
                                                <Form.Item
                                                    name="username"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message:
                                                                "This field field is required.",
                                                        },
                                                    ]}
                                                >
                                                    <Input
                                                        placeholder="Username"
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
                                                                "Please input your password!",
                                                        },
                                                    ]}
                                                    hasFeedback
                                                >
                                                    <Input.Password
                                                        size="large"
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
                                                                "Please confirm your password!",
                                                        },
                                                        ({
                                                            getFieldValue,
                                                        }) => ({
                                                            validator(
                                                                _,
                                                                value
                                                            ) {
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
                                                    <Input.Password
                                                        size="large"
                                                        placeholder="Confirm Password"
                                                    />
                                                </Form.Item>
                                                This page is protected by
                                                reCAPTCHA, and subject to the
                                                <a
                                                    href="https://policies.google.com/privacy?hl=en-US"
                                                    target="_blank"
                                                >
                                                    Google Privacy Policy
                                                </a>
                                                and{" "}
                                                <a href="https://policies.google.com/terms?hl=en-US">
                                                    Terms of service
                                                </a>
                                                <Button
                                                    type="primary"
                                                    htmlType="submit"
                                                    className="btn-login-outline complete-btn"
                                                    style={{
                                                        width: "100%",
                                                        marginTop: 10,
                                                        fontSize: "20px",
                                                        height: "45px",
                                                    }}
                                                >
                                                    SUBMIT REGISTRATION
                                                </Button>
                                                <div
                                                    style={{
                                                        textAlign: "center",
                                                    }}
                                                >
                                                    A WELCOME EMAIL WILL BE SENT
                                                    ONCE YOUR ACCOUNT IS
                                                    APPROVED.
                                                </div>
                                            </Form>
                                        </Panel>
                                    )}
                                </Collapse>
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
