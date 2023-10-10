import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Layout, Menu, Typography } from "antd";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";

import {
    name,
    role,
    fullwidthwhitelogo,
    userData,
} from "../../providers/companyInfo";

import AdminSideMenu from "./RoleMenu/admin/AdminSideMenu";
import UserSideMenu from "./RoleMenu/user/UserSideMenu";
import ConsultantSideMenu from "./RoleMenu/consultant/ConsultantSideMenu";

export default function SideMenu(props) {
    const {
        history,
        sideMenuCollapse,
        setSideMenuCollapse,
        width,
        hideLink,
        userInfo,
    } = props;

    const [menuItems, setMenuItems] = useState([]);
    // const [userInfo, setUserInfo] = useState(userData());

    // console.log(window.location.origin);
    // console.log("role", role());
    // console.log("CaregiverSideMenu", CaregiverSideMenu);

    useEffect(() => {
        if (role() === "Admin") {
            setMenuItems(AdminSideMenu);
        } else if (role() === "User") {
            setMenuItems(UserSideMenu);
            console.log(userInfo);
        } else if (role() === "Consultant") {
            setMenuItems(ConsultantSideMenu);
        }

        return () => {};
    }, []);

    let pathname = history.location.pathname;
    pathname = pathname.split("/");
    pathname = "/" + pathname[1];

    const [openKeys, setOpenKeys] = useState();

    useEffect(() => {
        setOpenKeys(
            menuItems
                .filter((item) => item.path === pathname)
                .map((item) => item.path)
        );
    }, [pathname, menuItems]);

    const onOpenChange = (keys) => {
        const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
        const menuItemsFilter = menuItems
            .filter((item) => item.path === latestOpenKey)
            .map((item) => item.path);

        if (menuItemsFilter.indexOf(latestOpenKey) === -1) {
            setOpenKeys(menuItemsFilter);
        } else {
            setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
        }
    };

    const activeRoute = (routeName) => {
        const pathname = history.location.pathname;
        return pathname === routeName ? "ant-menu-item-selected" : "";
    };

    const activeSubRoute = (routeName) => {
        const pathname1 = history.location.pathname.split("/")[2];
        const pathname2 = routeName.split("/")[2];
        return pathname2 === pathname1 ? "ant-menu-item-selected" : "";
    };

    const handleMenuRender = () => {
        let items = [];

        menuItems.map((item, index) => {
            if (item.children && item.children.length > 0) {
                let children_list = item.children.map((item2) => {
                    let link = "";

                    if (item2.targetNew === 1) {
                        link = (
                            <Typography.Link
                                target="new"
                                href={window.location.origin + item2.path}
                            >
                                {item2.title ?? item2.permission}
                            </Typography.Link>
                        );
                    } else {
                        link = (
                            <Link to={item2.path}>
                                {item2.title ?? item2.permission}
                            </Link>
                        );
                    }

                    return {
                        key: item2.path,
                        className: activeSubRoute(item2.path),
                        label: link,
                        onClick: () => {
                            if (width < 768) {
                                setSideMenuCollapse(true);
                            }
                        },
                    };
                });

                if (children_list && children_list.length > 0) {
                    items.push({
                        key: item.path,
                        icon: item.icon,
                        label: item.title,
                        className: item.className ?? "",
                        children: children_list,
                    });
                    return "";
                }
            } else {
                if (item.targetNew === 1) {
                    items.push({
                        key: item.path,
                        icon: item.icon,
                        label: (
                            <Typography.Link
                                target="new"
                                href={window.location.origin + item.path}
                            >
                                {item.title ?? item.permission}
                            </Typography.Link>
                        ),
                        className:
                            activeRoute(item.path) +
                            " " +
                            (item.className ?? ""),
                    });
                } else {
                    items.push({
                        key: item.path,
                        icon: item.icon,
                        label: (
                            <Link
                                onClick={() => {
                                    setOpenKeys([]);
                                }}
                                to={
                                    hideLink.link === item.className &&
                                    hideLink.isHide
                                        ? "#!"
                                        : item.className === "MNDA" &&
                                          userInfo.has_mnda === 0
                                        ? "#!"
                                        : item.path
                                }
                            >
                                {item.title ?? item.permission}
                            </Link>
                        ),
                        className:
                            activeRoute(item.path) +
                            " " +
                            (item.className ?? "") +
                            " " +
                            (hideLink.link === item.className &&
                            hideLink.hasDisabledClass !== ""
                                ? hideLink.hasDisabledClass
                                : "") +
                            (item.className === "MNDA" &&
                            userInfo.has_mnda === 0
                                ? "isDisabled"
                                : ""),
                        onClick: () => {
                            if (width < 768) {
                                setSideMenuCollapse(true);
                            }
                        },
                    });
                }

                return "";
            }

            return "";
        });

        return items;
    };

    return (
        <Layout.Sider
            trigger={null}
            collapsible
            collapsed={sideMenuCollapse}
            className="scrollbar-2"
        >
            <div className="ant-side-header">
                <MenuUnfoldOutlined
                    id="btn_sidemenu_collapse_unfold"
                    onClick={() => setSideMenuCollapse(false)}
                    style={{ display: sideMenuCollapse ? "block" : "none" }}
                />
                <MenuFoldOutlined
                    id="btn_sidemenu_collapse_fold"
                    onClick={() => setSideMenuCollapse(true)}
                    style={{ display: !sideMenuCollapse ? "block" : "none" }}
                />

                {!sideMenuCollapse && width > 480 && (
                    <img src={fullwidthwhitelogo} alt={name} width="180px" />
                )}
            </div>

            <Menu
                mode="inline"
                theme="light"
                className="sideMenu"
                openKeys={openKeys}
                selectedKeys={[pathname]}
                onOpenChange={onOpenChange}
                items={handleMenuRender()}
            />
        </Layout.Sider>
    );
}
