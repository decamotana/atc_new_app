import React, { useEffect, useState } from "react";
import { Route, Redirect } from "react-router-dom";
import PublicLayout from "../layouts/public/Public";
import { useHistory } from "react-router-dom";
// import getUserData from "../providers/getUserData";
const isLoggedIn = localStorage.getItem("token");

const PublicRoute = ({ component: Component, title: Title, ...rest }) => {
    let message = "";
    let link = window.location.search.substring(1);

    link = link.split("email=");
    let details = link[1] ? link[1].split("&") : "";
    let getMessage = details[1]
        ? details[1].split("message=")[1].replace(/%20/g, " ")
        : "";
    message = getMessage;

    console.log("link", window.location.pathname.split("/"));

    let path = window.location.pathname?.split("/");

    if (path[1] == "email") {
        localStorage.setItem("appointment_id", path[5]);
    }

    return (
        <Route
            {...rest}
            render={(props) =>
                !isLoggedIn ? (
                    <PublicLayout title={Title}>
                        <Component title={Title} {...props} />
                    </PublicLayout>
                ) : (
                    <Redirect
                        to={{
                            pathname: "/dashboard",
                            state: { message: message },
                        }}
                    />
                )
            }
        />
    );

    return "";
};

export default PublicRoute;
