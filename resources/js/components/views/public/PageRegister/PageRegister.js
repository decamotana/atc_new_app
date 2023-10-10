import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import {
    Layout,
    Card,
    Form,
    Button,
    Row,
    Col,
    Image,
    Typography,
    Collapse,
    Alert,
} from "antd";
import { MinusSquareOutlined, PlusSquareOutlined } from "@ant-design/icons";
import moment from "moment";
import { description, fullwidthlogo } from "../../../providers/companyInfo";
import { POST } from "../../../providers/useAxiosQuery";
import FloatInput from "../../../providers/FloatInput";
import FloatInputMaskDate from "../../../providers/FloatInputMaskDate";
import FloatInputMask from "../../../providers/FloatInputMask";
import ComponentHeader from "../Components/ComponentHeader";
// import optionCountryCodes from "../../../providers/optionCountryCodes";

import optionStateCodesUnitedState from "../../../providers/optionStateCodesUnitedState";
import optionStateCodesCanada from "../../../providers/optionStateCodesCanada";

import ReCAPTCHA from "react-google-recaptcha";

import { faEdit } from "@fortawesome/pro-regular-svg-icons";
import FloatSelect from "../../../providers/FloatSelect";
// import FloatDatePicker from "../../../providers/FloatDatePicker";
// import FloatSelectWithDangerouslySetInnerHTML from "../../../providers/FloatSelectWithDangerouslySetInnerHTML";
import validateRules from "../../../providers/validateRules";

export default function PageRegister() {
    const history = useHistory();
    const [collapseActiveKey, setCollapseActiveKey] = useState("1");

    // const [formData, setFormData] = useState([
    //   {
    //     step: "process",
    //     data: null,
    //   },
    //   {
    //     step: "wait",
    //     data: null,
    //   },
    //   {
    //     step: "wait",
    //     data: null,
    //   },
    // ]);

    const stateUS = optionStateCodesUnitedState();
    const stateCA = optionStateCodesCanada();
    const [optionState, setOptionState] = useState([]);
    const [stateLabel, setStateLabel] = useState("State");
    const [optionZip, setOptionZip] = useState();
    const [zipLabel, setZipLabel] = useState("Zip Code");
    const [captchaToken, setCaptchaToken] = useState("");
    const [captchaTokenError, setCaptchaTokenError] = useState(false);

    const [completePurchaseErr, setCompletePurchaseErr] = useState({
        type: "",
        message: "",
    });
    const [windowSize, setWindowSize] = useState(getWindowSize());

    useEffect(() => {
        function handleWindowResize() {
            setWindowSize(getWindowSize());
            //    console.log(getWindowSize().innerWidth);
        }

        window.addEventListener("resize", handleWindowResize);
        return () => window.removeEventListener("resize", handleWindowResize);
    }, []);

    function getWindowSize() {
        const { innerWidth, innerHeight } = window;
        return { innerWidth, innerHeight };
    }

    useEffect(() => {
        console.log(windowSize.innerWidth);
    }, [windowSize]);

    //

    // GET("api/v1/acc_type", "acc_type", (res) => {
    //   if (res.success) {
    //     console.log("acc_type", res.data)
    //     let data = []

    //     res.data.map((item) => {
    //       data.push({
    //         label: item.description,
    //         value: item.id,
    //         policy: item.privacy && item.privacy.privacy_policy,
    //         amount: item.account_plan && item.account_plan.length > 0 ? item.account_plan[0].amount : 0,
    //       })

    //       return ""
    //     })

    //     console.log("acc_type data", data)
    //     setProgramTypes(data)
    //   }
    // })

    const { mutate: mutateRegister, isLoading: isLoadingRegister } = POST(
        "api/v1/register",
        "register"
    );

    useEffect(() => {
        setOptionState(stateUS);
        setStateLabel("State");
        setOptionZip(/(^\d{5}$)|(^\d{5}-\d{4}$)/);
        setZipLabel("Zip Code");
    }, []);

    // const handleCountry = (e, opt) => {
    //   if (e === "United States") {
    //     setOptionState(stateUS);
    //     setStateLabel("State");
    //     setOptionZip(/(^\d{5}$)|(^\d{5}-\d{4}$)/);
    //     setZipLabel("Zip Code");
    //   } else if (e === "Canada") {
    //     setOptionState(stateCA);
    //     setStateLabel("County");
    //     setOptionZip(/^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/);
    //     setZipLabel("Postal Code");
    //   } else {
    //     setOptionState(stateUS);
    //     setStateLabel("State");
    //     setOptionZip(/(^\d{5}$)|(^\d{5}-\d{4}$)/);
    //     setZipLabel("Zip Code");
    //   }

    //   // form2.resetFields(["state"]);
    // };

    // const handleChangeBillingCountry = (e, opt) => {
    //   // console.log("e, opt", e, opt);
    //   if (e === "United States") {
    //     setOptionBillingState(stateUS);
    //     setOptionBillingZip(/(^\d{5}$)|(^\d{5}-\d{4}$)/);
    //     setBillingStateLabel("State");
    //     setBillingZipLabel("Zip Code");
    //   } else if (e === "Canada") {
    //     setOptionBillingState(stateCA);
    //     setOptionBillingZip(/^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/);
    //     setBillingStateLabel("County");
    //     setBillingZipLabel("Postal Code");
    //   } else {
    //     setOptionBillingState(stateUS);
    //     setOptionBillingZip(/(^\d{5}$)|(^\d{5}-\d{4}$)/);
    //     setBillingStateLabel("State");
    //     setBillingZipLabel("Zip Code");
    //   }

    //   // form4.resetFields(["billing_state"]);
    // };

    useEffect(() => {
        if (captchaToken && captchaTokenError) {
            setCaptchaTokenError(false);
        }
    }, [captchaToken]);

    const onFinishInfomation = (values) => {
        if (!captchaToken) {
            setCaptchaTokenError(true);
        } else {
            setCaptchaTokenError(false);

            let data = { ...values, link_origin: window.location.origin };
            mutateRegister(data, {
                onSuccess: (res) => {
                    if (res.success) {
                        setCompletePurchaseErr({
                            type: "success",
                            message:
                                "A confirmation e-mail has been send please check your inbox or your spam folder for the next step.",
                        });
                    } else {
                        setCompletePurchaseErr({
                            type: "error",
                            message: res.message,
                        });
                    }
                },
                onError: (err) => {
                    // console.log(err.response.data);
                    setCompletePurchaseErr({
                        type: "error",
                        message: err.response.data.message,
                    });
                },
            });
        }
    };

    const [form] = Form.useForm();

    return (
        <Layout className="public-layout register-layout">
            <Layout.Content>
                <Row>
                    <Col xs={24} sm={24} md={24}>
                        <Image
                            className="zoom-in-out-box"
                            onClick={() => history.push("/")}
                            src={fullwidthlogo}
                            preview={false}
                        />

                        <div className="register-sub-title"></div>

                        <Card className="card--public-body">
                            <ComponentHeader
                                title="Registration"
                                subtitle="New User"
                                icon={faEdit}
                            />

                            <Collapse
                                accordion
                                expandIconPosition="end"
                                activeKey={collapseActiveKey}
                                onChange={(e) => setCollapseActiveKey(e)}
                                expandIcon={({ isActive }) =>
                                    isActive ? (
                                        <MinusSquareOutlined />
                                    ) : (
                                        <PlusSquareOutlined />
                                    )
                                }
                            >
                                <Collapse.Panel
                                    header={
                                        <>
                                            <div className="title">Step 1</div>
                                            <div className="sub-title">
                                                Complete All Fields Below
                                            </div>
                                        </>
                                    }
                                    key="1"
                                >
                                    <Form
                                        layout="vertical"
                                        autoComplete="off"
                                        onFinish={onFinishInfomation}
                                        // className="text-left"
                                        form={form}
                                    >
                                        <Typography.Text className="form-title">
                                            User's Information
                                        </Typography.Text>
                                        <Form.Item
                                            name="firstname"
                                            className="m-t-sm"
                                            hasFeedback
                                            rules={[validateRules.required]}
                                        >
                                            <FloatInput
                                                label="First Name"
                                                placeholder="First Name"
                                                required
                                            />
                                        </Form.Item>

                                        <Form.Item
                                            name="lastname"
                                            hasFeedback
                                            rules={[validateRules.required]}
                                        >
                                            <FloatInput
                                                label="Last Name"
                                                placeholder="Last Name"
                                                required
                                            />
                                        </Form.Item>

                                        <Form.Item
                                            name="username"
                                            hasFeedback
                                            rules={[
                                                validateRules.required,
                                                validateRules.username,
                                            ]}
                                        >
                                            <FloatInput
                                                label="Username"
                                                placeholder="Username"
                                                required
                                            />
                                        </Form.Item>

                                        <Form.Item name="phone">
                                            <FloatInputMask
                                                label="Phone"
                                                placeholder="Phone"
                                                maskLabel="phone"
                                                maskType="999 999 9999"
                                            />
                                        </Form.Item>

                                        <Form.Item name="bithdate">
                                            {/* <FloatDatePicker
                        label="Date of Birth"
                        placeholder="Date of Birth"
                      /> */}

                                            <FloatInputMaskDate
                                                label="Date of Birth (MM/DD/YYYY)"
                                                placeholder="Date of Birth"
                                                maskLabel="Date of Birth"
                                                maskType="dd/mm/yyyy"
                                            />
                                        </Form.Item>

                                        <Form.Item
                                            name="email"
                                            hasFeedback
                                            rules={[
                                                validateRules.email,
                                                validateRules.required,
                                            ]}
                                        >
                                            <FloatInput
                                                label="Email"
                                                placeholder="Email"
                                                required
                                            />
                                        </Form.Item>

                                        <Form.Item
                                            name="confirm_email"
                                            hasFeedback
                                            rules={[
                                                validateRules.required,
                                                validateRules.email_validate,
                                            ]}
                                        >
                                            <FloatInput
                                                label="Confirm Email"
                                                placeholder="Confirm Email"
                                                required
                                            />
                                        </Form.Item>

                                        <Form.Item
                                            name="address_1"
                                            hasFeedback
                                            rules={[validateRules.required]}
                                        >
                                            <FloatInput
                                                label="Address"
                                                placeholder="Address"
                                                required
                                            />
                                        </Form.Item>

                                        <Form.Item
                                            name="city"
                                            hasFeedback
                                            rules={[validateRules.required]}
                                        >
                                            <FloatInput
                                                label="City"
                                                placeholder="City"
                                                required
                                            />
                                        </Form.Item>
                                        <Form.Item
                                            name="state"
                                            hasFeedback
                                            // className="form-select-error"
                                            className="w-100"
                                            rules={[validateRules.required]}
                                        >
                                            <FloatSelect
                                                label={stateLabel}
                                                placeholder={stateLabel}
                                                options={optionState}
                                                onChange={() => {
                                                    console.log("adasdasd");
                                                    form.setFieldValue(
                                                        "zip_code",
                                                        ""
                                                    );
                                                }}
                                                required
                                                allowClear
                                            />
                                        </Form.Item>

                                        <Form.Item
                                            name="zip_code"
                                            hasFeedback
                                            className="w-100"
                                            rules={[
                                                validateRules.required,
                                                {
                                                    pattern: optionZip,
                                                    message: "Invalid Zip Code",
                                                },
                                            ]}
                                        >
                                            <FloatInput
                                                label={zipLabel}
                                                placeholder={zipLabel}
                                                required
                                            />
                                            {/* /   / <FloatInput label="Zip Code" placeholder="Zip Code" /> */}
                                        </Form.Item>

                                        {/* <Form.Item
                      name="companyName"
                      hasFeedback
                      rules={[
                        // {
                        //   message: "The input is not valid",
                        // },
                        {
                          required: true,
                          message: "Please input your email!",
                        },
                      ]}
                    >
                      <FloatInput
                        label="Company Name"
                        placeholder="Company Name"
                      />
                    </Form.Item> */}

                                        <div>
                                            <Typography.Text>
                                                This page is protected by
                                                reCAPTCHA, and subject to the
                                                Google{" "}
                                                <Typography.Link
                                                    href="https://policies.google.com/privacy?hl=en"
                                                    className="color-1"
                                                    target="new"
                                                >
                                                    Privacy Policy
                                                </Typography.Link>{" "}
                                                and{" "}
                                                <Typography.Link
                                                    href="https://policies.google.com/terms?hl=en"
                                                    className="color-1"
                                                    target="new"
                                                >
                                                    Terms of Services.
                                                </Typography.Link>
                                            </Typography.Text>
                                        </div>
                                        <>
                                            {/* <h1 style={{ fontWeight: "normal " }}>
                  Privacy Policy and Terms & Conditions
                </h1>
                <div className="c-danger" style={{ marginTop: -9 }}>
                  <b>Please read / scroll to the end to continue.</b>
                </div> */}
                                            {/* <Input.TextArea

                                  // value={policy}
                                  id={"policyText"}
                                onScroll={handleScroll}
                  className ="policyDiv"
                                  rows={7}
                                  style={{ marginBottom: 10 }}
                                /> */}
                                            {/* <div
                  onScroll={handleScroll}
                  className="policyDiv"
                  style={{
                    marginBottom: 10,
                    marginTop: 10,
                    height: 170,
                    resize: "vertical",
                    overflow: "auto",
                    border: "1px solid #d9d9d9",
                  }}
                  dangerouslySetInnerHTML={{ __html: policy }}
                ></div> */}

                                            {/* <Checkbox
                  onChange={onChange}
                  name="checkbox_2"
                  className="optiona"
                  id="dd"
                  disabled={yesDisabled}
                >
                  Yes, I have read the Privacy Policy and Terms and Conditions
                </Checkbox> */}

                                            <div className="captchaDiv">
                                                <ReCAPTCHA
                                                    size={
                                                        windowSize.innerWidth <
                                                        350
                                                            ? "compact"
                                                            : "normal"
                                                    }
                                                    style={{ marginTop: 10 }}
                                                    onChange={(token) =>
                                                        setCaptchaToken(token)
                                                    }
                                                    // theme="dark"
                                                    render="explicit"
                                                    className="captcha-registration"
                                                    // render="explicit"
                                                    sitekey="6LfNfXgfAAAAAAbDCNuzI35Cm0hW_YwJ4UC0TYgw"
                                                    // onloadCallback={() => {}}
                                                />

                                                <div
                                                    style={{
                                                        display: "flex",
                                                        justifyContent:
                                                            "center",
                                                        width: "100%",
                                                    }}
                                                >
                                                    {captchaTokenError && (
                                                        <span
                                                            style={{
                                                                color: "#dc3545",
                                                            }}
                                                        >
                                                            Please Verify
                                                            Captcha
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </>

                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                            className="btn-main btn-register-here"
                                            block
                                            size="large"
                                            style={{ marginTop: "10px" }}
                                            loading={isLoadingRegister}
                                        >
                                            SUBMIT
                                        </Button>

                                        {completePurchaseErr.message && (
                                            <Alert
                                                className="m-t-sm m-b-sm register-alert"
                                                type={completePurchaseErr.type}
                                                message={
                                                    completePurchaseErr.message
                                                }
                                            />
                                        )}
                                    </Form>
                                </Collapse.Panel>
                            </Collapse>
                        </Card>
                    </Col>
                </Row>
            </Layout.Content>
            <Layout.Footer className="text-center">
                <Typography.Text className="copyright-txt">
                    © Copyright {moment().format("YYYY")} {description}. All
                    Rights Reserved.
                </Typography.Text>
            </Layout.Footer>
        </Layout>
    );
}
