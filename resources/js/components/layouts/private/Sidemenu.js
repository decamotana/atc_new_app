import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Layout, Menu, Image } from "antd";
import {
    MenuFoldOutlined,
    HomeOutlined,
    UsergroupAddOutlined,
    MenuUnfoldOutlined,
} from "@ant-design/icons";
import $ from "jquery";
import imageLogo from "/resources/assets/img/brand/logo_placeholder_dark.png";

export default function Sidemenu({ history, state }) {
    const { SubMenu } = Menu;

    // const [onCollapse, setOnCollapse] = useState(false);
    const onCollapseToggle = () => {
        console.log("wew");
        $(".sidemenuDark").addClass("transitionhide");
        $(".layout-main").addClass("transtionGrow");
        $(".menuCollapseOnopen").removeClass("menu-hide");
        $(".colheaderNavs").addClass("noMarginLeft");
        $(".ant-layout-content").removeClass("mobileWidthContent");
    };

    const [defaultOptionKey, setDefaultOptionKey] = useState("");

    useEffect(() => {
        let pathname = history.location.pathname;
        pathname = pathname.split("/");
        // pathname = "/" + pathname[1];
        setDefaultOptionKey(pathname);
        console.log("wew", pathname);
    }, []);

    const [sideMenuCollapse, setSideMenuCollapse] = useState(false);

    return (
        <>
            <Layout.Sider
                trigger={null}
                collapsible={true}
                collapsed={sideMenuCollapse}
                className="sidemenuDark scrollbar-2"
                key="desktop"
                style={{
                    height: "100vh",
                    position: "fixed",
                    left: 0,
                    top: 0,
                    bottom: 0,
                    overflowY: "auto",
                    overflowX: "hidden",
                }}
            >
                <div className="sideMenuLogo">
                    <MenuUnfoldOutlined
                        className="sideMenuLogoIcon"
                        id="btn_sidemenu_collapse_unfold"
                        onClick={() => setSideMenuCollapse(false)}
                        style={{ display: sideMenuCollapse ? "block" : "none" }}
                    />

                    <MenuFoldOutlined
                        className="sideMenuLogoIcon"
                        id="btn_sidemenu_collapse_fold"
                        onClick={() => setSideMenuCollapse(true)}
                        style={{
                            display: !sideMenuCollapse ? "block" : "none",
                        }}
                    />
                    <img className="sideMenuLogoImage" src={imageLogo}></img>
                </div>

                {defaultOptionKey != "" && (
                    <Menu
                        theme="light"
                        mode="inline"
                        defaultSelectedKeys={defaultOptionKey}
                        defaultOpenKeys={defaultOptionKey}
                        className="sideMenu"
                    >
                        {/* --------------------- */}

                        <Menu.Item
                            key="dashboard"
                            icon={<HomeOutlined />}
                            className="notSub"
                        >
                            <Link to="/dashboard">Dashboard</Link>
                        </Menu.Item>

                        <SubMenu
                            key="users"
                            icon={<UsergroupAddOutlined />}
                            title="Users"
                        >
                            <Menu.Item key="create-user">
                                <Link to="/users/create-user">Create User</Link>
                            </Menu.Item>

                            <Menu.Item key="current-users">
                                <Link to="/users/current-users">
                                    Current Users
                                </Link>
                            </Menu.Item>
                        </SubMenu>

                        {/* <Menu.Item
                            key="reports"
                            icon={<FlagOutlined />}
                            className="notSub"
                        >
                            <Link to="/reports">Reports</Link>
                        </Menu.Item> */}
                    </Menu>
                )}
            </Layout.Sider>
        </>
    );
}
