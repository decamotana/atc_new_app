import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Layout, Breadcrumb } from "antd";

import Sidemenu from "./Sidemenu";
import Header from "./Header";

import Footer from "./Footer";
// import IdleTimer from "react-idle-timer";

// import { socketio } from "../../../../socketio";

// import getCheckPermission from "../../../providers/getCheckPermission";
// import getPermission from "../../../providers/getPermission";

import { SpinnerDotted } from "spinners-react";

export default function Content(props) {
    const { Content } = Layout;
    const [state, setState] = React.useState({ collapsed: false });
    const history = useHistory();

    const toggle = () => setState({ collapsed: !state.collapsed });
    const [dataBread, setDataBread] = useState([]);
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    useEffect(() => {
        console.log("props", props.children.props.location.pathname);
        let pathname = props.children.props.location.pathname;
        var _pathname = pathname.split("/");
        var routes = [];

        _pathname.map(($a, $key) => {
            if ($a !== "") {
                //big letter nag first letter
                const str = $a;
                let str2 = str.charAt(0).toUpperCase() + str.slice(1);
                str2 = str2.replace(/-/g, " ");
                str2 = str2.split(" ");
                str2 = str2.map((str) => capitalizeFirstLetter(str));
                str2 = str2.join(" ");
                routes.push({
                    path: "/" + $a,
                    breadcrumbName: str2,
                });
            }
        });

        setDataBread(routes);

        console.log(routes);
    }, [props]);

    // const [sideMenuCollapse, setSideMenuCollapse] = useState(false);
    const [sideMenuCollapse, setSideMenuCollapse] = useState(
        $(window).width() <= 768 ? true : false
    );
    const [width, setWidth] = useState($(window).width());
    useEffect(() => {
        function handleResize() {
            setWidth($(window).width());
            if ($(window).width() <= 768) {
                setSideMenuCollapse(true);
            } else {
                setSideMenuCollapse(false);
            }
        }
        window.addEventListener("resize", handleResize);

        $(".ant-btn-quick-link-svg-512-448").attr("viewBox", "0 0 512 448");

        return () => window.removeEventListener("resize", handleResize);
    }, [dataBread]);

    return (
        <Layout hasSider>
            <title> {process.env.MIX_APP_NAME} </title>
            {props && (
                <>
                    <Sidemenu
                        history={history}
                        state={state}
                        sideMenuCollapse={sideMenuCollapse}
                        setSideMenuCollapse={setSideMenuCollapse}
                        // permission={props.children.props.permission}
                        // dataPermission={getPermission()}
                    />
                    <Layout
                        className="site-layout layout-main"
                        style={{ marginLeft: !sideMenuCollapse ? 240 : 52 }}
                    >
                        <Header
                            state={state}
                            toggle={toggle}
                            sideMenuCollapse={sideMenuCollapse}
                            setSideMenuCollapse={setSideMenuCollapse}
                            width={width}
                        />
                        {/* {console.log("wew", dataBread)} */}
                        <Breadcrumb
                            style={{
                                borderBottom: "1px solid #f0f0f0",
                                marginTop: "100px",
                                padding: "10px 14px",
                            }}
                            className="breadTest"
                        >
                            <Breadcrumb.Item>
                                <a href={"/"}>Home</a>
                            </Breadcrumb.Item>
                            {dataBread &&
                                dataBread.map((item, $key) => {
                                    return (
                                        <Breadcrumb.Item key={$key}>
                                            <a href={item.path}>
                                                {item.breadcrumbName}
                                            </a>
                                        </Breadcrumb.Item>
                                    );
                                })}
                        </Breadcrumb>
                        <div className="globalLoading hide">
                            {/* <Spin size="large" /> */}
                            <SpinnerDotted
                                thickness="100"
                                color="0866C6"
                                enabled={true}
                            />
                        </div>
                        <Content
                            // permission={props.children.props.permission}
                            style={{ marginTop: "0px" }}
                            className="mobileWidthContent"
                        >
                            {props.children}
                        </Content>
                        {/* <Footer /> */}
                    </Layout>
                </>
            )}
        </Layout>
    );
}
