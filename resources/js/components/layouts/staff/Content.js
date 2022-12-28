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

    return (
        <Layout hasSider>
            <title> David Invoices </title>
            {props && (
                <>
                    <Sidemenu
                        history={history}
                        state={state}
                        // permission={props.children.props.permission}
                        // dataPermission={getPermission()}
                    />
                    <Layout
                        className="site-layout layout-main "
                        style={{ marginLeft: 240 }}
                    >
                        <Header state={state} toggle={toggle} />
                        {/* {console.log("wew", dataBread)} */}
                        <Breadcrumb
                            style={{
                                borderBottom: "1px solid #f0f0f0",
                                marginTop: "100px",
                                padding: "10px",
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
