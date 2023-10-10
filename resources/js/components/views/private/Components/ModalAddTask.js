import React, { useState } from "react";
import { Button, Col, Form, Modal, Row, Typography, notification } from "antd";
//import FloatInputPasswordStrength from "../../../../providers/FloatInputPasswordStrength";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/pro-solid-svg-icons";
import FloatInput from "../../../providers/FloatInput";
import FloatTextArea from "../../../providers/FloatTextArea";
import FloatDatePicker from "../../../providers/FloatDatePicker";
import { POST } from "../../../providers/useAxiosQuery";

export default function ModalAddTask(props) {
    const { toggleModal, setToggleModal, user } = props;

    const { mutate: mutateTask, isLoading: isLoadingPassword } = POST(
        "api/v1/task",
        "store"
    );

    const [form] = Form.useForm();

    const onFinishForm = (values) => {
        let data = {
            ...values,
            id: user.id,
        };
        console.log("onFinishForm", data);

        mutateTask(data, {
            onSuccess: (res) => {
                if (res.success) {
                    // console.log(res)
                    notification.success({
                        message: "Success",
                        description: "Successfully updated",
                    });
                    setToggleModal(false);
                    // if (userdata.role !== "Admin" && userdata.role !== "Manager") {
                    // localStorage.removeItem("userdata");
                    // localStorage.removeItem("token");
                    // window.location.replace("/");
                }
            },
        });
    };

    return (
        <Modal
            title={
                "Add new task for contact: " +
                user.firstname +
                " " +
                user.lastname
            }
            visible={toggleModal}
            footer={
                <>
                    <Button
                        size="large"
                        onClick={() => {
                            form.validateFields()
                                .then((values) => {
                                    onFinishForm(values);
                                })
                                .catch((info) => {
                                    console.log("Validate Failed:", info);
                                });
                        }}
                        className="btn-main-invert-outline"
                    >
                        Add New Task
                    </Button>
                </>
            }
            onCancel={() => setToggleModal(false)}
            className="modal-primary-default modal-change-2-factor-authentication"
        >
            <Form layout="vertical" form={form}>
                <Row gutter={[12, 12]}>
                    <Col xs={24} sm={24} md={24}>
                        <Form.Item name="title">
                            <FloatInput label="Title" placeholder="Title" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={24}>
                        <Form.Item name="description">
                            <FloatTextArea
                                label="Description"
                                placeholder="Description"
                            />
                        </Form.Item>
                        <Form.Item name="dueDate">
                            <FloatDatePicker
                                label="Due Date"
                                placeholder="Due Date"
                            />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={24} md={24}>
                        <Form.Item
                            name="password_1"
                            //	rules={[validator.require, validator.password]}
                            hasFeedback
                        >
                            {/* <FloatInputPasswordStrength
								label="Current Password"
								placeholder="Current Password"
							/> */}
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
}
