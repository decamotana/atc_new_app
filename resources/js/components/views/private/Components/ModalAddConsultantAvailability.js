import {
    Button,
    Form,
    Modal,
    Row,
    Typography,
    notification,
    Space,
    TimePicker,
    Col,
} from "antd";

import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
//import FloatInputPasswordStrength from "../../../../providers/FloatInputPasswordStrength";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/pro-solid-svg-icons";
import { POST } from "../../../providers/useAxiosQuery";
import React, { useEffect, useState } from "react";
import moment from "moment";
import { useForm } from "rc-field-form";

export default function ModalAddConsultantAvailability(props) {
    const { toggleModal, setToggleModal, selectedDate, id, reload, data } =
        props;
    const [form] = Form.useForm();

    const format = "HH:mma";

    const { mutate: mutateAddAppointments, isLoading: isLoading } = POST(
        "api/v1/add/appointment",
        "appointment"
    );

    const { mutate: addHistoryLog } = POST(
        "api/v1/historylogs/add",
        "add_history_logs"
    );

    const onFinish = (values) => {
        let slots = form.getFieldsValue("slots");
        let form_data = [];

        if (slots.slots?.length > 0) {
            slots?.slots.map((slot) => {
                if (slot.startTime && slot.endTime) {
                    let startTime = moment(slot.startTime).format("HH:mm");
                    let endTime = moment(slot.endTime).format("HH:mm");
                    if (slot.startTime.isBefore(slot.endTime)) {
                        form_data.push({
                            id: id,
                            endTime: endTime,
                            startTime: startTime,
                            date: selectedDate,
                        });
                    } else {
                        notification.warning({
                            message: "Warning",
                            description: "Invalid time slot.",
                        });
                    }
                }
            });
        }

        if (form_data.length == 0) {
            notification.warning({
                message: "Warning",
                description: "Slot time is needed.",
            });
        }

        let data = {
            data: form_data,
        };

        mutateAddAppointments(data, {
            onSuccess: (res) => {
                if (res.success) {
                    notification.success({
                        message: "Success",
                        description: "Slot successfuly added",
                    });

                    addHistoryLog(
                        {
                            page: "consultant/schedule",
                            key: "appointment slot",
                            consultant: id,
                            old_data: "",
                            new_data: JSON.stringify(data.data),
                            method: "add-slot",
                        },
                        { onSuccess: (res) => {} }
                    );

                    setToggleModal(false);
                    reload();
                }
            },
        });
    };

    useEffect(() => {
        if (!toggleModal) {
            form.resetFields(["slots"]);
        }
    }, [toggleModal]);

    return (
        <Modal
            title={moment(selectedDate).format("LL")}
            closable={true}
            visible={toggleModal}
            // closeIcon={<FontAwesomeIcon icon={faTimes} />}
            footer={
                <Button
                    onClick={() => {
                        form.submit();
                    }}
                    className="atc-btn-opposite"
                    type="primary"
                    //   style={{ width: "100%" }}
                >
                    SUBMIT
                </Button>
            }
            onCancel={() => setToggleModal(false)}
            className="modal-primary-default modal-change-2-factor-authentication modal-consultant-schedule"
        >
            {/* <Row className="m-t-lg">
        <Col
          style={{ display: "flex", justifyContent: "center" }}
          md={24}
          lg={24}
          sm={24}
          xs={24}
        >
          <Typography.Title level={5} style={{ color: "#ba5b25" }}>
            TIME SLOT
          </Typography.Title>
        </Col>
      </Row> */}
            <Row className="m-t-lg">
                <Col md={24} lg={24} sm={24} xs={24}>
                    {" "}
                    <Form
                        name="dynamic_form_nest_item"
                        onFinish={onFinish}
                        autoComplete="off"
                        form={form}
                    >
                        <Form.List name="slots">
                            {(fields, { add, remove }) => (
                                <>
                                    {fields.map(
                                        ({ key, name, ...restField }) => (
                                            <Row>
                                                <Col
                                                    xs={24}
                                                    md={24}
                                                    lg={24}
                                                    sm={24}
                                                    key={key}
                                                    style={{
                                                        display: "flex",
                                                        marginBottom: 8,
                                                    }}
                                                    align="baseline"
                                                >
                                                    <Row
                                                        className="timeslot-select-cont"
                                                        style={{
                                                            width: "100%",
                                                            display: "flex",
                                                            justifyContent:
                                                                "center",
                                                        }}
                                                    >
                                                        <Col
                                                            xs={8}
                                                            md={8}
                                                            lg={8}
                                                            sm={8}
                                                        >
                                                            <Form.Item
                                                                {...restField}
                                                                name={[
                                                                    name,
                                                                    "startTime",
                                                                ]}
                                                                key={[
                                                                    key,
                                                                    "strtTime",
                                                                ]}
                                                                hasFeedback
                                                                rules={[
                                                                    {
                                                                        required: true,
                                                                        message:
                                                                            "Set appointment start time",
                                                                    },
                                                                    {
                                                                        validator:
                                                                            (
                                                                                _,
                                                                                value
                                                                            ) => {
                                                                                let data_start =
                                                                                    data.map(
                                                                                        (
                                                                                            val
                                                                                        ) => {
                                                                                            return val.start;
                                                                                        }
                                                                                    );

                                                                                let date =
                                                                                    moment(
                                                                                        selectedDate
                                                                                    ).format(
                                                                                        "YYYY-MM-DD"
                                                                                    ) +
                                                                                    "T" +
                                                                                    moment(
                                                                                        value
                                                                                    ).format(
                                                                                        "HH:mm"
                                                                                    );
                                                                                if (
                                                                                    !data_start.includes(
                                                                                        date
                                                                                    )
                                                                                ) {
                                                                                    return Promise.resolve();
                                                                                } else {
                                                                                    return Promise.reject();
                                                                                }
                                                                            },
                                                                        message:
                                                                            "Conflict timeslot",
                                                                    },
                                                                ]}
                                                            >
                                                                <TimePicker
                                                                    style={{
                                                                        width: "100%",
                                                                    }}
                                                                    format={
                                                                        format
                                                                    }
                                                                    onChange={(
                                                                        value
                                                                    ) => {
                                                                        let new_data =
                                                                            [];
                                                                        let existing_data =
                                                                            form.getFieldsValue();

                                                                        new_data =
                                                                            existing_data.slots;

                                                                        if (
                                                                            moment(
                                                                                value
                                                                            ).format(
                                                                                "HH"
                                                                            ) !=
                                                                            23
                                                                        ) {
                                                                            new_data[
                                                                                name
                                                                            ] =
                                                                                {
                                                                                    startTime:
                                                                                        value,
                                                                                    endTime:
                                                                                        moment(
                                                                                            value
                                                                                        ).add(
                                                                                            2,
                                                                                            "hours"
                                                                                        ),
                                                                                };
                                                                        } else {
                                                                            let addMinutes =
                                                                                59 -
                                                                                moment(
                                                                                    value
                                                                                ).format(
                                                                                    "mm"
                                                                                );

                                                                            new_data[
                                                                                name
                                                                            ] =
                                                                                {
                                                                                    startTime:
                                                                                        value,
                                                                                    endTime:
                                                                                        moment(
                                                                                            value
                                                                                        ).add(
                                                                                            addMinutes,
                                                                                            "minutes"
                                                                                        ),
                                                                                };
                                                                        }

                                                                        form.setFieldsValue(
                                                                            {
                                                                                slots: new_data,
                                                                            }
                                                                        );
                                                                    }}
                                                                />
                                                            </Form.Item>
                                                        </Col>
                                                        <Col
                                                            xs={4}
                                                            md={4}
                                                            lg={4}
                                                            sm={4}
                                                            style={{
                                                                display: "flex",
                                                                justifyContent:
                                                                    "center",
                                                            }}
                                                        >
                                                            TO
                                                        </Col>

                                                        <Col
                                                            xs={8}
                                                            md={8}
                                                            lg={8}
                                                            sm={8}
                                                        >
                                                            <Form.Item
                                                                {...restField}
                                                                name={[
                                                                    name,
                                                                    "endTime",
                                                                ]}
                                                                key={[
                                                                    key,
                                                                    "endTime",
                                                                ]}
                                                                hasFeedback
                                                                rules={[
                                                                    {
                                                                        required: true,
                                                                        message:
                                                                            "Set appointment end time",
                                                                    },
                                                                    {
                                                                        validator:
                                                                            (
                                                                                _,
                                                                                value
                                                                            ) => {
                                                                                let data_end =
                                                                                    data.map(
                                                                                        (
                                                                                            val
                                                                                        ) => {
                                                                                            return val.end;
                                                                                        }
                                                                                    );

                                                                                let date =
                                                                                    moment(
                                                                                        selectedDate
                                                                                    ).format(
                                                                                        "YYYY-MM-DD"
                                                                                    ) +
                                                                                    "T" +
                                                                                    moment(
                                                                                        value
                                                                                    ).format(
                                                                                        "HH:mm"
                                                                                    );
                                                                                if (
                                                                                    !data_end.includes(
                                                                                        date
                                                                                    )
                                                                                ) {
                                                                                    return Promise.resolve();
                                                                                } else {
                                                                                    return Promise.reject();
                                                                                }
                                                                            },
                                                                        message:
                                                                            "Conflict timeslot",
                                                                    },
                                                                    {
                                                                        validator:
                                                                            (
                                                                                _,
                                                                                value
                                                                            ) => {
                                                                                if (
                                                                                    moment(
                                                                                        value
                                                                                    ).format(
                                                                                        "HH"
                                                                                    ) !=
                                                                                    "00"
                                                                                ) {
                                                                                    return Promise.resolve();
                                                                                } else {
                                                                                    return Promise.reject();
                                                                                }
                                                                            },
                                                                        message:
                                                                            "Invalid end time",
                                                                    },
                                                                ]}
                                                            >
                                                                <TimePicker
                                                                    style={{
                                                                        width: "100%",
                                                                    }}
                                                                    format={
                                                                        format
                                                                    }
                                                                />
                                                            </Form.Item>
                                                        </Col>
                                                        <Col
                                                            xs={2}
                                                            md={2}
                                                            lg={2}
                                                            sm={2}
                                                            style={{
                                                                display: "flex",
                                                                justifyContent:
                                                                    "center",
                                                                marginTop:
                                                                    "10px",
                                                            }}
                                                        >
                                                            <MinusCircleOutlined
                                                                onClick={() =>
                                                                    remove(name)
                                                                }
                                                            />
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            </Row>
                                        )
                                    )}
                                    <Form.Item>
                                        <Button
                                            type="dashed"
                                            onClick={() => add()}
                                            block
                                            icon={<PlusOutlined />}
                                        >
                                            ADD SLOT
                                        </Button>
                                    </Form.Item>
                                </>
                            )}
                        </Form.List>
                    </Form>
                </Col>
            </Row>
        </Modal>
    );
}
