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
import SidemenuList from "./Components/SidemenuList";

export default function Sidemenu({
    history,
    state,
    sideMenuCollapse,
    setSideMenuCollapse,
}) {
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

    return (
        <>
            <Layout.Sider
                trigger={null}
                collapsible={true}
                collapsed={sideMenuCollapse}
                className={`sidemenuDark scrollbar-2 ${
                    !sideMenuCollapse ? "" : "ant-layout-sider-collapse"
                }`}
                key="desktop"
                style={{
                    height: "100vh",
                    position: "fixed",
                    left: 0,
                    top: 0,
                    bottom: 0,
                    overflowY: "auto",
                    overflowX: "hidden",
                    width: !sideMenuCollapse ? "240px" : "52px",
                    maxWidth: !sideMenuCollapse ? "240px" : "52px",
                    minWidth: !sideMenuCollapse ? "240px" : "52px",
                    // zIndex: 100,
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

                    {!sideMenuCollapse && (
                        <img
                            className="sideMenuLogoImage"
                            src={imageLogo}
                        ></img>
                    )}
                </div>

                {defaultOptionKey && (
                    <SidemenuList defaultOptionKey={defaultOptionKey} />
                )}
            </Layout.Sider>
        </>
    );
}
