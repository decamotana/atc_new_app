import React, { useState, useEffect } from "react";
import {
    Card,
    Row,
    Col,
    Button,
    Table,
    Input,
    Divider,
    Popconfirm,
    notification,
    Modal,
    Form,
    Select
} from "antd";
import useAxiosQuery from "../../../../providers/useAxiosQuery";
import { arrayColumn } from "../../../../providers/arrayColumn";
import { number_format } from "../../../../providers/number_format";
import moment from "moment";
import { CSVLink } from "react-csv";
import {
    DeleteFilled,
    EditFilled,
    PlusCircleOutlined,
    UploadOutlined,
    SettingOutlined,
    FileExcelOutlined,
    ReloadOutlined
} from "@ant-design/icons";
const PagePaysafeBatchDetailModal = ({
    showTooltipModal,
    selector,
    formDataTooltip,
    setFormDataTooltip,
    getToolTips,
    setShowTooltipModal
}) => {
    const [form] = Form.useForm();
    const formItemLayout = {
        labelCol: { span: 7 },
        wrapperCol: { span: 14 }
    };

    const {
        mutate: mutateToolTip,
        isLoading: isLoadingmutateToolTip
    } = useAxiosQuery(
        formDataTooltip.id ? "UPDATE" : "POST",
        formDataTooltip.id
            ? `api/v1/tooltips/${formDataTooltip.id}`
            : `api/v1/tooltips`
    );

    const handleSubmitToolTip = data => {
        let _data = { ...data, selector: selector };
        mutateToolTip(_data, {
            onSuccess: res => {
                formDataTooltip.id
                    ? notification.success({
                          message: "ToolTip Successfully Updated"
                      })
                    : notification.success({
                          message: "ToolTip Successfully Created"
                      });
                setShowTooltipModal(false);
                window.location.reload();
            },
            onError: err => {
                console.log(err);
            }
        });
    };

    useEffect(
        () =>
            form.setFieldsValue({
                ...formDataTooltip
            }),
        [formDataTooltip]
    );

    const {
        mutate: mutateDeleteToolTip,
        isLoading: isLoadingMutateDeleteToolTip
    } = useAxiosQuery("DELETE", "api/v1/tooltips", "boarding_table");

    const handleTooltipDelete = id => {
        mutateDeleteToolTip(
            { id: formDataTooltip.id },
            {
                onSuccess: res => {
                    if (res.success) {
                        notification.success({
                            message: "ToolTip Successfully Deleted"
                        });
                        window.location.reload();
                    }
                }
            }
        );
    };

    return (
        <>
            <Modal
                visible={showTooltipModal}
                onCancel={() => {
                    setShowTooltipModal(false);
                }}
                width={500}
                title={
                    formDataTooltip.id ? (
                        <>
                            <span> Tool Tip</span>
                            <Button
                                key="back"
                                type="primary"
                                wid
                                htmlType="submit"
                                style={{
                                    background: "rgb(248, 107, 107)",
                                    border: "rgb(248, 107, 107",
                                    marginLeft: "10px"
                                }}
                                loading={isLoadingMutateDeleteToolTip}
                                icon={<DeleteFilled />}
                                onClick={() => handleTooltipDelete()}
                            >
                                Delete
                            </Button>
                        </>
                    ) : (
                        "Tool Tip"
                    )
                }
                footer={false}
            >
                <Form
                    {...formItemLayout}
                    layout={"horizontal"}
                    onFinish={handleSubmitToolTip}
                    form={form}
                >
                    <Form.Item name="position" label="Tooltip Position">
                        <Select>
                            <Select.Option value="Top">Top</Select.Option>
                            <Select.Option value="Bottom">Bottom</Select.Option>
                            <Select.Option value="Left">Left</Select.Option>
                            <Select.Option value="Right">Right</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item name="tooltip_type" label="Tooltip Type">
                        <Select>
                            <Select.Option value="Classic">
                                Classic
                            </Select.Option>
                            <Select.Option value="Critical">
                                Critical
                            </Select.Option>
                            <Select.Option value="Help">Help</Select.Option>
                            <Select.Option value="Information">
                                Information
                            </Select.Option>
                            <Select.Option value="Warning">
                                Warning
                            </Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name="tooltip_for" label="Tooltip For">
                        <Select>
                            <Select.Option value="Both">Both</Select.Option>
                            <Select.Option value="Employee">
                                Employee
                            </Select.Option>
                            <Select.Option value="Merchant">
                                Merchant
                            </Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name="tooltip" label="Tooltip Message">
                        <Input.TextArea />
                    </Form.Item>
                    <Form.Item name="video_url" label="Embeded Video">
                        <Input.TextArea />
                    </Form.Item>
                    <Form.Item
                        label={<div>Click Save</div>}
                        style={{ textAlign: "center" }}
                    >
                        <Button
                            key="back"
                            type="primary"
                            wid
                            htmlType="submit"
                            style={{ width: "150px" }}
                            loading={isLoadingmutateToolTip}
                        >
                            Save
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default PagePaysafeBatchDetailModal;
