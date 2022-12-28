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
export const widhtAdjustable = pos => {
    var pressed = false;
    var start = undefined;
    var startX;
    var startWidth;
    var selector = $(`table th:nth-child(${pos})`);
    selector.addClass("resizing");

    var _find = $(`table th:nth-child(${pos}) .ant-table-column-title `);
    _find.addClass("cursor-resize");

    if (_find.length == 0) {
        var _text = selector.text();
        selector.text("");
        selector.append(
            "<div className='ant-table-column-title'> " + _text + " </div>"
        );
    }

    return {
        onChange: e => {
            e.stopPropagation();
        },
        onClick: e => {
            e.stopPropagation();
        },
        onMouseDown: e => {
            pressed = true;
            startX = e.pageX;
            startWidth = _find.width();
        },
        onMouseMove: e => {
            if (pressed) {
                _find.width(startWidth + (e.pageX - startX));
            }
        },
        onMouseUp: e => {
            pressed = false;
        }
    };
};
