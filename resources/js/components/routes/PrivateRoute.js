import React, { useEffect } from "react";
import {
    BrowserRouter as Router,
    Route,
    Switch,
    Redirect,
} from "react-router-dom";
// import PrivateContent from "../layouts/private/admins/Content";
import Content from "../layouts/private/Content";
// import PrivateMerchantLayout from "../layouts/private/merchant/Content";
// import PrivateMerchantTicketsOnlyLayout from "../layouts/private/merchantTicketsOnly/Content";
// import PrivateGiftOnlyLayout from "../layouts/private/gift/Content";
// import getUserData from "../providers/getUserData";
// const userdata = getUserData();

const PrivateRoute = ({
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

export default PrivateRoute;
