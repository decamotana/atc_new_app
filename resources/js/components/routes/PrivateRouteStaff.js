import React, { useEffect } from "react";
import {
    BrowserRouter as Router,
    Route,
    Switch,
    Redirect,
} from "react-router-dom";
import Content from "../layouts/staff/Content";

const PrivateRouteStaff = ({
    path: path,
    component: Component,
    permission: Permission,
    ...rest
}) => {
    // console.log('permission', Permission)
    let isLoggedIn = localStorage.getItem("token");

    // useEffect(() => {
    //     console.log('isLoggedIn', isLoggedIn)
    // }, [])
    return (
        <Route
            {...rest}
            render={(props) =>
                isLoggedIn ? (
                    <Content>
                        <Component permission={Permission} {...props} />
                    </Content>
                ) : (
                    <Redirect to={{ pathname: "/*" }} />
                )
            }
        />
    );
};

export default PrivateRouteStaff;
