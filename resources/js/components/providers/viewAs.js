import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useAxiosQuery from "./useAxiosQuery";
import getUserData from "./getUserData";
import { Button, Layout, Menu, Select, Tooltip } from "antd";
const key = "PromiseNetwork@2021";
const encryptor = require("simple-encryptor")(key);
import {
    DeleteFilled,
    EditFilled,
    PlusCircleOutlined,
    FileExcelOutlined,
    SettingOutlined,
    EyeOutlined,
    UsergroupDeleteOutlined,
    UserAddOutlined,
    ArrowLeftOutlined
} from "@ant-design/icons";
export const ViewAs = () => {
    const userdata = getUserData();
    const [optionsU, setOptionsU] = useState([]);
    const [valuesU, setValuesU] = useState();

    const {
        mutate: mutateGetUserList,
        isLoading: isLoadingGetUserList
    } = useAxiosQuery("POST", "api/v1/users/userList", "mutate_get_user_list");

    useEffect(() => {
        mutateGetUserList(
            { role: ["Merchant", "Gift Only"] },
            {
                onSuccess: res => {
                    if (res.success) {
                        var arr = [];
                        res.data.forEach(element => {
                            var _mn = element.user_fields
                                ? element.user_fields.merchant_name
                                : "None";

                            arr.push({
                                value: element.id,
                                label:
                                    element.name +
                                    " (" +
                                    element.email +
                                    ")" +
                                    " (" +
                                    _mn +
                                    ")"
                            });
                        });
                        setOptionsU(arr);
                    }
                }
            }
        );
    }, []);

    const {
        mutate: mutateGenerateToken,
        isLoading: isLoadingGenerateToken
    } = useAxiosQuery(
        "POST",
        "api/v1/generate/token/viewas",
        "mutate_generate_token"
    );

    const updateFieldSearch = id => {
        viewAsSelect(id);
    };

    const viewAsSelect = id => {
        mutateGenerateToken(
            { id: id, viewas: localStorage.viewas },
            {
                onSuccess: res => {
                    console.log(res);
                    localStorage.token = encryptor.encrypt(res.data.token);
                    if (!localStorage.viewas) {
                        localStorage.userdata_admin = localStorage.userdata;
                    }
                    localStorage.userdata = encryptor.encrypt(
                        JSON.parse(res.data.userdata)
                    );
                    localStorage.permission = encryptor.encrypt(
                        res.data.permission
                    );
                    localStorage.viewas = true;
                    var url = window.location.origin;
                    window.location.href = url;
                }
            }
        );
    };

    return (
        <div>
            <div className="select-nav-userlist">
                <Select
                    name="assigned_merchant"
                    placeholder="Select Profile"
                    onChange={e => updateFieldSearch(e)}
                    style={{ width: "100%" }}
                    showSearch
                    filterOption={(input, option) =>
                        option.children
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
                    }
                    filterSort={(optionA, optionB) =>
                        optionA.children
                            .toLowerCase()
                            .localeCompare(optionB.children.toLowerCase())
                    }
                >
                    {optionsU.length != 0 &&
                        optionsU.map((el, key) => {
                            return (
                                <Select.Option value={el.value} key={key}>
                                    {el.label}
                                </Select.Option>
                            );
                        })}
                </Select>
            </div>
        </div>
    );
};
