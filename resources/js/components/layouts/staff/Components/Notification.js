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

import { CloseSquareOutlined } from "@ant-design/icons";

import useAxiosQuery from "../../../../providers/useAxiosQuery";
import { dateDiff } from "../../../../providers/dateDiff";

const Notification = ({ userdata, notif }) => {
    const {
        mutate: mutateCloseNotif,
        iseLoading: isLoadingCloseNotif
    } = useAxiosQuery("POST", "api/v1/notification/removeNotif", "user_notif");

    const removeNotif = (id, type) => {
        // console.log(id, type)
        mutateCloseNotif(
            {
                id: id,
                type: type
            },
            {
                onSuccess: res => {
                    // console.log(res)
                    if (res.success) {
                        notification.success({
                            message: "Successfuly closed!"
                        });
                    }
                },
                onError: res => {
                    // console.log(res)
                }
            }
        );
    };

    const urlShortcut = url => {
        var indices = [];
        for (var i = 0; i < url.length; i++) {
            if (url[i] === "/") indices.push(i);
        }
        return url.substring(indices[2]);
    };

    const windowLocation = (url, id) => {
        mutateIsOpen(
            { id: id },
            {
                onSuccess: res => {
                    if (res.success) {
                        let wUrl = `${window.location.origin}`;
                        window.location.href = wUrl + url;
                    }
                }
            }
        );
    };

    const { mutate: mutateIsOpen, isLoading: isLoadingIsOpen } = useAxiosQuery(
        "POST",
        "api/v1/notification/isOpen",
        `user_notif`
    );

    return (
        <Card
            className="text-center notifCardPopUp"
            // headStyle={{height: '50px'}}
            bodyStyle={{ padding: 0 }}
            title={
                <div>
                    <strong>Notification</strong>
                    <Button
                        danger
                        type="link"
                        style={{
                            float: "right"
                        }}
                        onClick={e => removeNotif(notif, "byAll")}
                    >
                        dismiss
                    </Button>
                </div>
            }
            style={{ width: 300 }}
        >
            {notif.map((item, index) => {
                let bcolor = item.type == "Boarding" ? "#faad14" : "#52c41a";
                return (
                    <div key={index}>
                        <Link
                            to={urlShortcut(item.url)}
                            to={item.url}
                            onClick={() => windowLocation(item.url, item.id)}
                        >
                            <Button
                                style={{ width: "100%", height: "70px" }}
                                type="text"
                            >
                                {/* <a
                                    style={{position: 'absolute', right: 5, color: 'red', zIndex: 99999}}
                                    onClick={e => {
                                        removeNotif(item.id, "byId")
                                    }}
                                    href="#"
                                >
                                <CloseSquareOutlined />
                                </a> */}
                                <Row gutter={24}>
                                    <Col span={16}>
                                        <div
                                            style={{
                                                whiteSpace: "break-spaces",
                                                fontSize: "12px",
                                                textAlign: "left"
                                            }}
                                            // dangerouslySetInnerHTML={{ __html: item.title}}
                                        >
                                            <strong>{item.title}</strong>
                                            <br />
                                            {item.name} {item.id}
                                        </div>
                                    </Col>
                                    <Col span={8}>
                                        <Badge
                                            count={item.type}
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
                                            {dateDiff(item.created_at)}
                                        </span>
                                    </Col>
                                </Row>
                            </Button>
                        </Link>
                    </div>
                );
            })}
        </Card>
    );
};

export default Notification;
