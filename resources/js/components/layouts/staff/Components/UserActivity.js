import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import {
    Layout,
    Menu,
    Popover,
    Badge,
    Row,
    Col,
    Card,
    Button,
    notification,
    AutoComplete,
    Input,
    Tag
} from "antd";
import Select, { SelectProps } from "antd/es/select";

import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    LogoutOutlined,
    SettingOutlined,
    SolutionOutlined,
    BellOutlined,
    CloseSquareOutlined
} from "@ant-design/icons";

import getUserData from "../../../../providers/getUserData";
import useAxiosQuery from "../../../../providers/useAxiosQuery";
import { dateDiff } from "../../../../providers/dateDiff";
import { values } from "lodash";

const UserActivity = () => {
    const userdata = getUserData();

    const {
        data: dataRecentAcitivities,
        iseLoading: iseLoadingRecentAcitivities
    } = useAxiosQuery(`GET`, `api/v1/user/recent`, `user_recent`, res => {
        // if (res.success) {
        //     console.log(res)
        // }
    });

    const urlShortcut = url => {
        var indices = [];
        for (var i = 0; i < url.length; i++) {
            if (url[i] === "/") indices.push(i);
        }
        return url.substring(indices[2]);
    };

    return dataRecentAcitivities ? (
        <Card
            className="text-center userRecentPopUp"
            // headStyle={{height: '50px'}}
            bodyStyle={{ padding: 0 }}
            title={<strong>Recent Acitivty</strong>}
            style={{ width: 300 }}
        >
            {dataRecentAcitivities.data.map((activity, index) => {
                let bcolor =
                    activity.type == "Boarding" ? "#faad14" : "#52c41a";
                return (
                    <Link
                        to={urlShortcut(activity.url)}
                        key={index}
                        onClick={() => (window.location.href = activity.url)}
                    >
                        <Button
                            style={{ width: "100%", height: "70px" }}
                            type="text"
                        >
                            <Row gutter={24}>
                                <Col span={16}>
                                    <div
                                        style={{
                                            whiteSpace: "break-spaces",
                                            fontSize: "12px",
                                            textAlign: "left"
                                        }}
                                        dangerouslySetInnerHTML={{
                                            __html: activity.title
                                        }}
                                    ></div>
                                </Col>
                                <Col span={8}>
                                    <Badge
                                        count={activity.type}
                                        style={{
                                            backgroundColor: bcolor,
                                            marginTop: "-10px"
                                        }}
                                    />
                                    <br />
                                    <span
                                        style={{
                                            fontWeight: "500",
                                            letterSpacing: "-1px",
                                            fontSize: "10px"
                                        }}
                                    >
                                        {dateDiff(activity.updated_at)}
                                    </span>
                                </Col>
                            </Row>
                        </Button>
                    </Link>
                );
            })}
        </Card>
    ) : (
        ""
    );
};

export default UserActivity;
