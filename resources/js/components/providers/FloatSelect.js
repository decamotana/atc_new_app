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
const FloatSelect = (props) => {
    const [focus, setFocus] = useState(false);
    let { label, value, placeholder, type, required, options, mode } = props;

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
            <Select
                style={{ width: "100%" }}
                value={value}
                onChange={props.onChange}
                size="large"
                mode={mode}
            >
                {options.map((item, key) => {
                    return (
                        <Select.Option value={item.value}>
                            {" "}
                            {item.label}
                        </Select.Option>
                    );
                })}
            </Select>
            {/* <Input onChange={props.onChange} type={type} defaultValue={value} /> */}
            <label className={labelClass}>
                {isOccupied ? label : placeholder} {requiredMark}
            </label>
        </div>
    );
};

export default FloatSelect;
