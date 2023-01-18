import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Layout, Menu, Badge, Image, Typography, Dropdown } from "antd";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { userData, role, apiUrl } from "../../providers/companyInfo";
import NotificationsAlert from "./Components/NotificationsAlert";
import MessagesAlert from "./Components/MessagesAlert";
import defaultImage from "../../assets/img/default.png";
// import { GET } from "../../../../providers/useAxiosQuery";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faBell,
    faCommentDots,
    faEdit,
    faPowerOff,
    faTableCellsLarge,
} from "@fortawesome/pro-regular-svg-icons";
import { faFileInvoiceDollar } from "@fortawesome/pro-solid-svg-icons";

import { GET } from "../../providers/useAxiosQuery";

import {
    menuLeft as adminHeaderMenuLeft,
    dropDownMenuLeft as adminHeaderDropDownMenuLeft,
} from "./RoleMenu/admin/AdminHeader";

export default function Header(props) {
    const { width, sideMenuCollapse, setSideMenuCollapse } = props;

    const [menuLeft, setMenuLeft] = useState(null);
    const [dropDownMenuLeft, setDropDownMenuLeft] = useState(null);

    useEffect(() => {
        if (role() === "Admin" || role() === "Super Admin") {
            setMenuLeft(adminHeaderMenuLeft);
            setDropDownMenuLeft(adminHeaderDropDownMenuLeft);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("userdata");
        localStorage.removeItem("token");
        localStorage.removeItem("viewas");
        window.location.replace("/");
    };

    const [unreadMessages, setUnreadMessages] = useState(0);
    const [messages, setMessages] = useState([]);

    const { refetch: refetchMessages } = GET(
        "api/v1/get_messages_alert",
        "get_messages_alert",
        (res) => {
            if (res.success) {
                // console.log("dataMessages", res);
                setMessages(res.data);
                setUnreadMessages(res.unread);
            }
        },
        false
    );

    const [notification, setNotification] = useState({
        count: 0,
        data: [],
    });
    const { refetch: refetchNotification } = GET(
        "api/v1/get_notification_alert",
        "get_notification_alert",
        (res) => {
            if (res.success) {
                setNotification({
                    data: res.data,
                    count: res.unread,
                });
            }
        },
        false
    );

    const [imageProfile, setImageProfile] = useState(defaultImage);

    GET(
        `api/v1/users/${userData().id}`,
        "update_profile",
        (res) => {
            if (res.success) {
                if (res.data.profile_image) {
                    let avatarImage = res.data.profile_image.split("/");
                    if (avatarImage[0] === "https:") {
                        setImageProfile(res.data.profile_image);
                    } else {
                        setImageProfile(apiUrl + res.data.profile_image);
                    }
                }
            }
        },
        false
    );

    const onClickMenuProfile = (e) => {
        // console.log("e", e);
    };

    const menuProfile = () => {
        const items = [
            {
                key: "/profile/details",
                className: "ant-menu-item-profile-details",
                label: (
                    <div className="ant-menu-item-child ant-menu-item-profile">
                        <Image
                            src={imageProfile}
                            style={{
                                width:
                                    parseInt(userData().photo_crop) === 2
                                        ? "55px"
                                        : "50px",
                            }}
                            preview={false}
                        />

                        <Typography.Text>
                            <Typography.Text className="ant-typography-profile-details-name-info">
                                {userData().firstname} {userData().lastname}
                            </Typography.Text>
                            <br />
                            <Typography.Text>{role()}</Typography.Text>
                        </Typography.Text>
                    </div>
                ),
            }, // remember to pass the key prop
            {
                key: "/profile/account",
                icon: <FontAwesomeIcon icon={faEdit} />,
                label: <Link to="/profile/account">Edit Account Profile</Link>,
            }, // which is required
        ];

        if (
            role() === "Cancer Caregiver" ||
            role() === "Cancer Care Professional"
        ) {
            items.push({
                key: "/profile/account/payment-and-invoices",
                icon: <FontAwesomeIcon icon={faFileInvoiceDollar} />,
                label: (
                    <Link to="/profile/account/payment-and-invoices">
                        Invoices & Account
                    </Link>
                ),
            });
        }

        items.push({
            key: "/profile/signout",
            className: "ant-menu-item-logout",
            icon: <FontAwesomeIcon icon={faPowerOff} />,
            label: (
                <Typography.Link onClick={handleLogout}>
                    Sign Out
                </Typography.Link>
            ),
        });

        return <Menu items={items} onClick={onClickMenuProfile} />;
    };

    return (
        <Layout.Header>
            <div className="ant-header-left-menu">
                {width <= 767 && (
                    <div className="ant-menu-left-icon ant-menu-left-icon-menu-collapse-on-close">
                        {sideMenuCollapse ? (
                            <MenuUnfoldOutlined
                                onClick={() => setSideMenuCollapse(false)}
                                className="menuCollapseOnClose"
                            />
                        ) : (
                            <MenuFoldOutlined
                                onClick={() => setSideMenuCollapse(true)}
                                className="menuCollapseOnClose"
                            />
                        )}
                    </div>
                )}

                {width <= 575 && (
                    <Dropdown
                        overlay={dropDownMenuLeft}
                        placement="bottomRight"
                        overlayClassName="ant-menu-submenu-left-menus-popup"
                    >
                        <div className="ant-menu-left-icon ant-menu-submenu-left-menus">
                            <FontAwesomeIcon icon={faTableCellsLarge} />
                        </div>
                    </Dropdown>
                )}

                {width >= 768 && menuLeft !== null ? menuLeft : null}
            </div>
            <div className="ant-header-right-menu">
                <Dropdown
                    overlay={menuProfile}
                    placement="bottomRight"
                    overlayClassName="ant-menu-submenu-profile-popup"
                >
                    <Image
                        className="ant-menu-submenu-profile"
                        src={imageProfile}
                        style={{
                            width:
                                parseInt(userData().photo_crop) === 2
                                    ? "55px"
                                    : "50px",
                        }}
                        preview={false}
                    />
                </Dropdown>

                <Dropdown
                    overlay={
                        <NotificationsAlert
                            notification={notification.data}
                            refetch={refetchNotification}
                        />
                    }
                    placement="bottomRight"
                    overlayClassName="ant-menu-submenu-notification-popup"
                >
                    <Badge
                        count={
                            notification.count < 99 ? notification.count : "99+"
                        }
                        className="ant-menu-submenu-notification"
                    >
                        <FontAwesomeIcon icon={faBell} />
                    </Badge>
                </Dropdown>

                <Dropdown
                    overlay={
                        <MessagesAlert
                            messages={messages}
                            refetch={refetchMessages}
                        />
                    }
                    placement="bottomRight"
                    overlayClassName="ant-menu-submenu-message-alert-popup scrollbar-2"
                >
                    <Badge
                        count={unreadMessages < 99 ? unreadMessages : "99+"}
                        className="ant-menu-submenu-message-alert"
                    >
                        <FontAwesomeIcon icon={faCommentDots} />
                    </Badge>
                </Dropdown>

                {width < 768 && width > 575 && dropDownMenuLeft !== null ? (
                    <Dropdown
                        overlay={dropDownMenuLeft}
                        placement="bottomRight"
                        overlayClassName="ant-menu-submenu-left-menus-popup"
                    >
                        <span className="ant-menu-submenu-left-menus">
                            <FontAwesomeIcon icon={faTableCellsLarge} />
                        </span>
                    </Dropdown>
                ) : null}
            </div>
        </Layout.Header>
    );
}
