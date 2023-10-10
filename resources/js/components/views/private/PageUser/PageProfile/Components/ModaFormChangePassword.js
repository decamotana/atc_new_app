import React from "react";
import { Button, Col, Form, Modal, notification, Row, Typography } from "antd";
import FloatInputPasswordStrength from "../../../../../providers/FloatInputPasswordStrength";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/pro-solid-svg-icons";
import { userData } from "../../../../../providers/companyInfo";
import { POST } from "../../../../../providers/useAxiosQuery";
import validateRules from "../../../../../providers/validateRules";

export default function ModaFormChangePassword(props) {
    const { toggleModalFormChangePassword, setToggleModalFormChangePassword } =
        props;

    const validator = {
        require: {
            required: true,
            message: "Required",
        },
        password: {
            min: 8,
            message: "Password must be minimum 8 characters.",
        },
    };

    const { mutate: mutatePassword, isLoading: isLoadingPassword } = POST(
        "api/v1/profile_change_password",
        "profile_change_password"
    );

    const [form] = Form.useForm();

    const onFinishForm = (values) => {
        let data = {
            ...values,
            id: userData().id,
        };

        mutatePassword(data, {
            onSuccess: (res) => {
                if (res.success) {
                    // console.log(res)
                    notification.success({
                        message: "Success",
                        description: "Successfully updated",
                    });
                    setToggleModalFormChangePassword(false);
                    // if (userdata.role !== "Admin" && userdata.role !== "Manager") {
                    localStorage.removeItem("userdata");
                    localStorage.removeItem("token");
                    window.location.replace("/");
                }
            },
        });
    };

    return (
        <Modal
            title="CHANGE PASSWORD"
            visible={toggleModalFormChangePassword}
            closeIcon={<FontAwesomeIcon icon={faTimes} />}
            bodyStyle={{ paddingBottom: "0px" }}
            footer={
                <>
                    <Button
                        size="large"
                        className="atc-btn the-change-pass"
                        onClick={() => {
                            form.validateFields()
                                .then((values) => {
                                    onFinishForm(values);
                                })
                                .catch((info) => {
                                    console.log("Validate Failed:", info);
                                });
                        }}
                        loading={isLoadingPassword}
                    >
                        UPDATE
                    </Button>
                </>
            }
            onCancel={() => setToggleModalFormChangePassword(false)}
            className="modal-primary-default modal-change-password"
        >
            <Form layout="vertical" form={form}>
                <Row>
                    <Col xs={24} sm={24} md={24}>
                        <Typography.Text strong>
                            Your password must be at least 8 characters long and
                            contain at least one number and one character.
                        </Typography.Text>
                    </Col>

                    <Col xs={24} sm={24} md={24} style={{ marginTop: "25px" }}>
                        <Form.Item
                            name="new_password"
                            className="new-password-input"
                            rules={[
                                validateRules.required,
                                validateRules.password,
                            ]}
                            hasFeedback
                        >
                            <FloatInputPasswordStrength
                                label="New Password"
                                placeholder="New Password"
                            />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={24} md={24}>
                        <Form.Item
                            name="new_password_confirm"
                            className="new-password-input"
                            dependencies={["new_password"]}
                            rules={[
                                validateRules.required,
                                validateRules.password,
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (
                                            !value ||
                                            getFieldValue("new_password") ===
                                                value
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
                            hasFeedback
                        >
                            <FloatInputPasswordStrength
                                label="Confirm New Password"
                                placeholder="Confirm New Password"
                            />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
}
