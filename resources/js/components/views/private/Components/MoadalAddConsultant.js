import React from "react";
import { Button, Col, Form, Modal, notification } from "antd";
//import FloatInputPasswordStrength from "../../../../providers/FloatInputPasswordStrength";
import { POST, GET } from "../../../providers/useAxiosQuery";
import { useState } from "react";
import FloatSelect from "../../../providers/FloatSelect";

export default function MoadalAddConsultant(props) {
    const { toggleModal, setToggleModal, userID, toggleRefetch } = props;
    const [consultants, setConsultants] = useState([]);
    const [form] = Form.useForm();

    GET(`api/v1/consultant/getrecord`, "get_consultants", (res) => {
        if (res.success) {
            let select_data = [];
            res.data.map((item) => {
                // console.log("item-id", item.id);
                select_data.push({
                    label: item.firstname + " " + item.lastname,
                    value: item.id,
                });
            });

            // console.log("consultant:", select_data);

            setConsultants(select_data);
            // setTableTotal(res.data.total);
        }
    });

    const { mutate: mutateAddConsultants, isLoading: isLoading } = POST(
        "api/v1/consultant/addconsultant",
        "addconsultant"
    );

    const onFinishForm = () => {
        // console.log(form.getFieldValue("consultant"));
        let data = {
            user_id: props.userID,
            consultant: form.getFieldValue("consultant"),
        };

        mutateAddConsultants(data, {
            onSuccess: (res) => {
                if (res.success) {
                    // console.log(res.data);
                    notification.success({
                        message: "Success",
                        description: "Consultant successfully added",
                    });
                    setToggleModal(false);
                    toggleRefetch();
                }
            },
        });
    };

    return (
        <Modal
            title="ASSIGN CONSULTANT"
            visible={toggleModal}
            // closeIcon={<FontAwesomeIcon icon={faTimes} />}
            footer={
                <Button
                    className="atc-btn-opposite"
                    onClick={() => {
                        onFinishForm();
                    }}
                    type="primary"
                    style={{ width: "100%" }}
                >
                    Add Consultant
                </Button>
            }
            onCancel={() => setToggleModal(false)}
            className="modal-primary-default modal-change-2-factor-authentication modal-appointment"
        >
            <div>
                <Form form={form}>
                    <Col xs={24} sm={24} md={24}>
                        <Form.Item name="consultant">
                            <FloatSelect
                                label="Consultants"
                                placeholder="Choose Consultants"
                                options={consultants}
                            />
                        </Form.Item>
                    </Col>
                </Form>
            </div>
        </Modal>
    );
}
