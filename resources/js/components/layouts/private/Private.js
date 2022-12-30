import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import {
    Layout,
    Breadcrumb,
    PageHeader,
    Button,
    Row,
    Col,
    // Space
} from "antd";
import $ from "jquery";
import { SpinnerDotted } from "spinners-react";

// import { SpinnerDotted } from "spinners-react";

import {
    name,
    // fullwidthlogo,
    // description,
    encrypt,
    userData,
    decrypt,
    role,
} from "../../providers/companyInfo";
import Footer from "./Footer";

import { RightOutlined } from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faTimes } from "@fortawesome/pro-regular-svg-icons";
import SideMenu from "./SideMenu";
import Header from "./Header";
import { POST } from "../../providers/useAxiosQuery";
export default function Private(props) {
    const { children, title, subtitle, breadcrumb, pageHeaderIcon } = props;
    // console.log(role(), userData());

    const history = useHistory();
    const [sideMenuCollapse, setSideMenuCollapse] = useState(
        $(window).width() <= 768 ? true : false
    );
    const [width, setWidth] = useState($(window).width());

    useEffect(() => {
        if (title) {
            document.title = title + " | " + name;
        }

        if (subtitle !== "EDIT ACCOUNT") {
            $(".top-banner-adss").hide();
        } else {
            $(".top-banner-adss").css("display", "flex");
        }

        function handleResize() {
            setWidth($(window).width());

            if ($(window).width() === 768) {
                setSideMenuCollapse(true);
            }
            if ($(window).width() > 768) {
                setSideMenuCollapse(false);
            }
        }
        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, [title, subtitle]);

    const { mutate: mutateGenerateToken } = POST(
        "api/v1/generate/token/viewas",
        "viewas_mutate"
    );

    const handleBackToSuperAdmin = () => {
        let userdata_admin = decrypt(localStorage.userdata_admin);
        viewAsBack(userdata_admin.id, true);
    };

    const viewAsBack = (id, backtoadmin = false) => {
        mutateGenerateToken(
            { id: id, viewas: localStorage.viewas },
            {
                onSuccess: (res) => {
                    if (res.success) {
                        // console.log(res);
                        localStorage.token = res.token;
                        localStorage.userdata = encrypt(res.data);
                        if (backtoadmin) {
                            localStorage.removeItem("viewas");
                            localStorage.removeItem("userdata_admin");
                        }

                        var url =
                            window.location.origin + "/subscribers/viewas";
                        window.location.href = url;
                    }
                },
            }
        );
    };

    return (
        <>
            <div className="globalLoading hide">
                <SpinnerDotted thickness="100" color="027273" enabled={true} />
            </div>

            <Layout hasSider className="private-layout">
                <SideMenu
                    history={history}
                    sideMenuCollapse={sideMenuCollapse}
                    setSideMenuCollapse={setSideMenuCollapse}
                    width={width}
                />

                <Layout
                    className={
                        sideMenuCollapse ? "ant-layout-has-collapse" : ""
                    }
                >
                    <Header
                        sideMenuCollapse={sideMenuCollapse}
                        setSideMenuCollapse={setSideMenuCollapse}
                        width={width}
                    />

                    <Layout.Content
                        onClick={() => {
                            if (width <= 767) {
                                setSideMenuCollapse(true);
                            }
                        }}
                    >
                        <Breadcrumb separator={<RightOutlined />}>
                            <Breadcrumb.Item key="/home">
                                <a href="/">
                                    <FontAwesomeIcon icon={faHome} />
                                </a>
                            </Breadcrumb.Item>
                            {breadcrumb &&
                                breadcrumb.map((item, index) => {
                                    let colorRed = "";
                                    if (breadcrumb.length > 1) {
                                        if (breadcrumb.length === index + 1) {
                                            colorRed =
                                                "breadcrumb-item-text-last";
                                        }
                                    }

                                    return (
                                        <Breadcrumb.Item
                                            key={index}
                                            onClick={() => {
                                                if (item.link) {
                                                    history.push(item.link);
                                                }
                                            }}
                                            className={`cursor-pointer font-14px breadcrumb-item-text ${colorRed} ${
                                                item.className
                                                    ? ` ${item.className}`
                                                    : ""
                                            }`}
                                            id={item.id ?? ""}
                                        >
                                            {item.name}
                                        </Breadcrumb.Item>
                                    );
                                })}
                        </Breadcrumb>

                        {localStorage.viewas === "true" && (
                            <>
                                <div>
                                    <div
                                        style={{
                                            position: "fixed",
                                            left: "50%",
                                            bottom: "4%",
                                            transform: "translate(-50%, 0)",
                                            padding: 10,
                                            fontWeight: 900,
                                            background: "#027273",
                                            color: "white",
                                            zIndex: 2,
                                            textAlign: "center",
                                        }}
                                    >
                                        Viewing As:{" "}
                                        {userData().firstname +
                                            " " +
                                            userData().lastname}
                                        <br></br>
                                        <Button
                                            className="btn-main-invert"
                                            style={{ marginTop: "10px" }}
                                            onClick={handleBackToSuperAdmin}
                                        >
                                            Back to Super Admin View
                                        </Button>
                                    </div>
                                </div>
                                <div className="viewAsBoxTop"></div>
                                <div className="viewAsBoxRight"></div>
                                <div className="viewAsBoxLeft"></div>
                                <div className="viewAsBoxBottom"></div>
                            </>
                        )}

                        {role() !== "Admin" && role() !== "Super Admin" ? (
                            <div className="top-banner-adss">
                                <Row justify="center">
                                    <Col xs={23} sm={21} md={22} lg={22}>
                                        <div className="top-banner-adss-inner">
                                            <div
                                                className="icon-close"
                                                onClick={() =>
                                                    $(".top-banner-adss").hide()
                                                }
                                            >
                                                <FontAwesomeIcon
                                                    icon={faTimes}
                                                />
                                            </div>
                                            <div className="top-banner-adss-inner-image" />
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        ) : null}

                        <PageHeader
                            title={
                                <>
                                    <div className="ant-page-header-icon">
                                        <FontAwesomeIcon
                                            icon={pageHeaderIcon}
                                        />
                                    </div>
                                    <div className="ant-page-header-text">
                                        <span className="sub-title">
                                            {subtitle}
                                        </span>
                                        <span className="title">{title}</span>
                                    </div>
                                </>
                            }
                        />

                        {children}
                    </Layout.Content>

                    <Footer
                        onClick={() => {
                            if (width <= 767) {
                                setSideMenuCollapse(true);
                            }
                        }}
                    />
                </Layout>
            </Layout>
        </>
    );
}
