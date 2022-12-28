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
    DatePicker,
    Select,
} from "antd";

import {
    DeleteFilled,
    EditFilled,
    PlusCircleOutlined,
    PrinterOutlined,
    UploadOutlined,
    SettingOutlined,
    SearchOutlined,
    FileExcelOutlined,
} from "@ant-design/icons";
const FloatInput = (props) => {
    const [focus, setFocus] = useState(false);
    let { label, value, placeholder, type, required } = props;
    // console.log("value", value);
    if (!placeholder) placeholder = label;

    const isOccupied = focus || (value && value.length !== 0);

    const labelClass = isOccupied ? "label as-label" : "label as-placeholder";

    const requiredMark = required ? (
        <span className="text-danger">*</span>
    ) : null;

    return (
        <div
            className="float-label"
            onBlur={() => setFocus(false)}
            onFocus={() => setFocus(true)}
        >
            <Input
                onChange={props.onChange}
                type={type}
                value={value}
                size="large"
            />
            <label className={labelClass}>
                {isOccupied ? label : placeholder} {requiredMark}
            </label>
        </div>
    );
};

export default FloatInput;
