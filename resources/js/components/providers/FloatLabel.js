import React, { useState, useEffect, useRef } from "react";
import {
    Card,
    Row,
    Col,
    Button,
    Input,
    Divider,
    notification,
    Table,
    Popconfirm,
    Space,
    DatePicker
} from "antd";

import {
    DeleteFilled,
    EditFilled,
    PlusCircleOutlined,
    PrinterOutlined,
    UploadOutlined,
    SettingOutlined,
    SearchOutlined,
    FileExcelOutlined
} from "@ant-design/icons";
const FloatLabel = props => {
    const [focus, setFocus] = useState(false);
    const { children, label, value } = props;

    const labelClass =
        focus || (value && value.length !== 0) ? "label label-float" : "label";

    return (
        <div
            className="float-label"
            onBlur={() => setFocus(false)}
            onFocus={() => setFocus(true)}
        >
            {children}
            <label className={labelClass}>{label}</label>
        </div>
    );
};

export default FloatLabel;
