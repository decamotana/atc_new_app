import React from "react";
import { Link } from "react-router-dom";
import { Layout, Menu, Badge, Row, Col, Divider, Image } from "antd";
import {
    LogoutOutlined,
    SettingOutlined,
    BellOutlined,
    InboxOutlined,
    FolderOutlined,
    ScheduleOutlined,
    EditOutlined,
    DownloadOutlined,
    StarOutlined,
    MenuUnfoldOutlined,
    AppstoreOutlined,
    CalendarOutlined,
    TeamOutlined,
    BankOutlined,
    SelectOutlined,
} from "@ant-design/icons";
import $ from "jquery";

import getUserData from "../../providers/getUserData";
import useAxiosQuery from "../../providers/useAxiosQuery";

export default function Header({ state, toggle }) {
    // let history = useHistory();
    const userdata = getUserData();
    console.log("userdata", userdata);
    // useEffect(() => {
    //     // console.log("@header user", userdata);
    //     // socketio.on("message", message => {
    //     //     refetchNotif();
    //     // });
    //     return () => {};
    // }, []);

    const handleLogout = (e) => {
        mutateLogout(
            { user_id: userdata.id },
            {
                onSuccess: (res) => {
                    if (res.success) {
                        if (e) {
                            e.preventDefault();
                        }
                        localStorage.viewas = false;
                        localStorage.removeItem("token");
                        localStorage.removeItem("userdata");
                        localStorage.removeItem("viewas");
                        location.href = window.location.origin;
                    }
                },
            }
        );
    };

    const { mutate: mutateLogout, isLoading: isLoadingLogout } = useAxiosQuery(
        "POST",
        "api/v1/logout",
        "logout"
    );

    const onCollapseToggle = () => {
        $(".sidemenuDark").removeClass("transitionhide");
        $(".layout-main").removeClass("transtionGrow");
        $(".menuCollapseOnopen").addClass("menu-hide");
        $(".colheaderNavs").removeClass("noMarginLeft");
        $(".ant-layout-content").addClass("mobileWidthContent");
    };

    return (
        <Layout.Header
            className="site-layout-background c-layout-header"
            style={{
                padding: 0,
                position: "fixed",
                zIndex: 99,
                width: "100%",
                boxShadow: "0px 0px 11px 0px rgba(105 107 112 / 60%)",
            }}
        >
            <Row gutter={24}>
                <Col xs={12} md={12}>
                    <div className="headerNavleftDiv">
                        <Row>
                            {/* mobile ni  */}
                            <Col className="menuCollapseOnopen menu-hide">
                                <div className="headerNavleftHover">
                                    <span className="headerNavsLeft">
                                        <MenuUnfoldOutlined
                                            style={{
                                                fontSize: 22,
                                                position: "relative",
                                                top: 0,
                                            }}
                                            onClick={() => onCollapseToggle()}
                                        />
                                    </span>
                                </div>
                            </Col>
                            {/* mobile ni  dri taman*/}
                        </Row>
                    </div>
                </Col>
                <Col
                    xs={12}
                    md={12}
                    style={{ marginLeft: "-260px" }}
                    className="colheaderNavs"
                >
                    <Menu
                        mode="horizontal"
                        style={{
                            float: "right",
                        }}
                        className="headerNavs headerNavsMobile"
                    >
                        {/* <Menu.SubMenu
                            key="notification"
                            title={
                                <Badge count={1}>
                                    <BellOutlined
                                        className="backgroundColorHeadernavs"
                                        style={{
                                            fontSize: "22px",
                                        }}
                                    />
                                </Badge>
                            }
                        ></Menu.SubMenu> */}

                        <Menu.SubMenu
                            key="img"
                            title={
                                <Image
                                    src={`${window.origin}/${userdata.profile_picture}`}
                                    style={{
                                        width: "60px",
                                        height: "60px",
                                        borderRadius: "50%",
                                        marginBottom: "7px",
                                        marginLeft: "5px",
                                    }}
                                    preview={false}
                                />
                            }
                            className="profilePop"
                        >
                            <div
                                style={{
                                    width: 250,
                                    padding: 15,
                                }}
                            >
                                <Row gutter={2}>
                                    <Col md={8}>
                                        <div>
                                            <Image
                                                src={`${window.origin}/${userdata.profile_picture}`}
                                                style={{
                                                    width: "50px",
                                                    height: "50px",
                                                    borderRadius: "50%",
                                                    marginBottom: "7px",
                                                    marginLeft: "5px",
                                                }}
                                                preview={false}
                                            />
                                        </div>
                                    </Col>
                                    <Col md={16}>
                                        <div
                                            style={{
                                                marginTop: "15px",
                                            }}
                                        >
                                            {`${userdata.first_name} ${userdata.last_name}`}
                                        </div>
                                        <div
                                            style={{
                                                marginTop: "20px",
                                                fontSize: 12,
                                            }}
                                        >
                                            {userdata.title}
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                            <Divider style={{ padding: 0, margin: 0 }} />
                            <Menu.Item
                                key="edit_profile"
                                icon={<EditOutlined />}
                                className="profile_hover"
                            >
                                <Link to="#">Edit Profile</Link>
                            </Menu.Item>

                            <Menu.Item
                                icon={<LogoutOutlined />}
                                key="/logout"
                                className="profile_hover"
                            >
                                <Link to="#" onClick={handleLogout}>
                                    Logout
                                </Link>
                            </Menu.Item>
                        </Menu.SubMenu>
                    </Menu>
                </Col>
            </Row>
        </Layout.Header>
    );
}
