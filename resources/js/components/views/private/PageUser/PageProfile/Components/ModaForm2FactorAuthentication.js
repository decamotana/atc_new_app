import React from "react";
import { Button, Col, Form, Modal, Row, Typography } from "antd";
import FloatInputPasswordStrength from "../../../../../providers/FloatInputPasswordStrength";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/pro-solid-svg-icons";

export default function ModaForm2FactorAuthentication(props) {
    const {
        toggleModalForm2FactorAuthentication,
        setToggleModalForm2FactorAuthentication,
    } = props;

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

    const [form] = Form.useForm();

    return (
        <Modal
            title="ENABLE 2-FACTOR AUTHENTICATION"
            visible={toggleModalForm2FactorAuthentication}
            closeIcon={<FontAwesomeIcon icon={faTimes} />}
            footer={
                <>
                    <Button size="large" className="atc-btn">
                        VERIFY
                    </Button>
                </>
            }
            onCancel={() => setToggleModalForm2FactorAuthentication(false)}
            className="modal-primary-default modal-change-2-factor-authentication"
        >
            <Form layout="vertical" form={form}>
                <Row gutter={[12, 12]}>
                    <Col xs={24} sm={24} md={24}>
                        <Typography.Text strong>
                            PLEASE ENTER YOUR PASSWORD TO CONTINUE.
                        </Typography.Text>
                    </Col>

                    <Col xs={24} sm={24} md={24}>
                        <Form.Item
                            name="password_1"
                            rules={[validator.require, validator.password]}
                            hasFeedback
                        >
                            <FloatInputPasswordStrength
                                label="Current Password"
                                placeholder="Current Password"
                            />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
}
