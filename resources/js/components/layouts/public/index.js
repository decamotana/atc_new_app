import React, { useEffect, useState, useRef, Component, Fragment } from "react";
import { Layout, Button, Modal, Spin } from "antd";
import getUserData from "../../providers/getUserData";
import useAxiosQuery from "../../providers/useAxiosQuery";
import {
    DeleteFilled,
    EditFilled,
    PlusCircleOutlined,
    UploadOutlined,
    SettingOutlined,
    FileExcelOutlined,
    DownOutlined,
    RightOutlined,
    EyeOutlined,
    LoadingOutlined,
    EyeFilled,
    ArrowLeftOutlined
} from "@ant-design/icons";
import { ViewAs } from "../../providers/viewAs";
const key = "PromiseNetwork@2021";
const encryptor = require("simple-encryptor")(key);

import {
    SpinnerCircular,
    SpinnerCircularSplit,
    SpinnerRound,
    SpinnerRoundOutlined,
    SpinnerRoundFilled,
    SpinnerDotted,
    SpinnerInfinity,
    SpinnerDiamond
} from "spinners-react";

export default function Public(props) {
    let userdata = getUserData();

    const [isModalViewAsVisible, setIsModalViewAsVisible] = useState(false);

    const {
        mutate: mutateGenerateToken,
        isLoading: isLoadingGenerateToken
    } = useAxiosQuery(
        "POST",
        "api/v1/generate/token/viewas",
        "mutate_generate_token"
    );

    const handleBackToSuperAdmin = () => {
        let userdata_admin = encryptor.decrypt(localStorage.userdata_admin);
        viewAsBack(userdata_admin.id, true);
    };

    const viewAsBack = (id, backtoadmin = false) => {
        mutateGenerateToken(
            { id: id, viewas: localStorage.viewas },
            {
                onSuccess: res => {
                    if (res.success) {
                        console.log(res);
                        localStorage.token = encryptor.encrypt(res.data.token);
                        localStorage.userdata = encryptor.encrypt(
                            JSON.parse(res.data.userdata)
                        );
                        if (backtoadmin) {
                            localStorage.removeItem("viewas");
                            localStorage.removeItem("userdata_admin");
                        }

                        var url = window.location.origin + "/dashboard";
                        window.location.href = url;
                    }
                }
            }
        );
    };

    return (
        <Layout
            style={{
                border:
                    localStorage.viewas == "true" ? "4px solid orange" : "none"
            }}
        >
            {props.children}
            {localStorage.viewas == "true" && (
                <>
                    <div
                        style={{
                            position: "fixed",
                            bottom: 0,
                            left: "45%",
                            padding: "8px",
                            fontWeight: 900,
                            background: "#ffa500e8",
                            color: "black",
                            zIndex: 9999999999999,
                            textAlign: "center"
                        }}
                    >
                        Viewing As: {userdata.name}
                        <div>
                            <Button
                                // type="primary"
                                style={{ color: "#20a8d8" }}
                                // type="primary"
                                type="link"
                                danger
                                onClick={e => handleBackToSuperAdmin()}
                                // loading={isLoadingGenerateToken}
                                icon={<ArrowLeftOutlined />}
                            >
                                Back to Super Admin View
                            </Button>
                        </div>
                    </div>

                    <div
                        style={{
                            position: "fixed",
                            bottom: 0,
                            left: "3%",
                            bottom: "4%",
                            padding: 5,
                            fontWeight: 900,
                            background: "#ffa50061",
                            color: "black",
                            zIndex: 9999999999999
                        }}
                    >
                        <Button
                            type="primary"
                            icon={<EyeOutlined />}
                            onClick={() => {
                                setIsModalViewAsVisible(true);
                            }}
                        >
                            {" "}
                            View As
                        </Button>
                    </div>

                    <Modal
                        title={null}
                        visible={isModalViewAsVisible}
                        onCancel={() => setIsModalViewAsVisible(false)}
                        footer={null}
                        width={400}
                    >
                        <div
                            style={{
                                textAlign: "center",
                                marginTop: "20px"
                            }}
                        >
                            <ViewAs />
                        </div>
                    </Modal>
                </>
            )}
            <div className="globalLoading hide">
                {/* <Spin size="large" /> */}
                <SpinnerDotted thickness="100" color="0866C6" enabled={true} />
            </div>

            {/* <Layout.Footer style={{ textAlign: "center", display: "inline" }}>
                <div> {process.env.MIX_APP_NAME} ©2022 v1.0</div>
            </Layout.Footer> */}
        </Layout>
    );
}
