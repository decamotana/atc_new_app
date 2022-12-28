import React, { useEffect} from "react";

import {
    Layout,
    Card,
    Form,
    Input,
    Button,
    Alert,
    Divider,
    Row,
    Col,
    Modal,
    message,
    notification
} from "antd";
import { UserOutlined, LockOutlined, CloseOutlined } from "@ant-design/icons";

import ally_image from "../../../assets/img/ally_image.png";

import useAxiosQuery from "../../../providers/useAxiosQuery";
import Title from "antd/lib/typography/Title";
import moment from "moment";
import { DragDropContext } from "react-beautiful-dnd";
import { Link, useLocation, useHistory } from "react-router-dom";
import getUserData from "../../../providers/getUserData";

const key = "PromiseNetwork@2021";
const encryptor = require("simple-encryptor")(key);
export default function PageLogout() {
    const userdata = getUserData();
    const { mutate: mutateLogout, isLoading: isLoadingLogout } = useAxiosQuery(
        "POST",
        "api/v1/logout",
        "logout"
    );

    useEffect(() => {
        // signOut()
        localStorage.viewas = false;
        localStorage.removeItem("permission")
        localStorage.removeItem("token");
        localStorage.removeItem("userdata");
        localStorage.removeItem("profile_image");
        localStorage.removeItem("viewas");
        localStorage.removeItem("user_role");
        location.href = window.location.origin;
        window.location.href = location.href;
    }, [])
    return ('');
}
