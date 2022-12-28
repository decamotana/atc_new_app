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
    ReloadOutlined,
    WarningOutlined
} from "@ant-design/icons";
const ModalAlerMobileViewing = ({
    showModalMobileViewing,
    setShowModalMobileViewing
}) => {
    return (
        <>
            <Modal
                visible={showModalMobileViewing}
                onCancel={() => {
                    setShowModalMobileViewing(false);
                }}
                width={500}
                footer={false}
            >
                <div className="warningMobileViewing">
                    <WarningOutlined />
                </div>
                <div className="warningMobileViewingText">
                    Mobile/small device detected. We highly recommend viewing on
                    larger device such as a laptop or desktop. By proceeding you
                    acknowledge there may be limited views readily available
                </div>
                <div
                    style={{
                        textAlign: "center",
                        marginTop: "20px"
                    }}
                >
                    <Button
                        type="primary"
                        size="large"
                        onClick={() => {
                            setShowModalMobileViewing(false);
                        }}
                    >
                        {" "}
                        {"I Acknowledge >>"}
                    </Button>
                </div>
            </Modal>
        </>
    );
};

export default ModalAlerMobileViewing;
