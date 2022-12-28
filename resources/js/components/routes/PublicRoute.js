import React, { useEffect } from "react";
import {
    BrowserRouter as Router,
    Route,
    Switch,
    Redirect,
} from "react-router-dom";
import PublicLayout from "../layouts/public";
import getUserData from "../providers/getUserData";

const isLoggedIn = localStorage.getItem("token");
const userdata = getUserData();
const PublicRoute = ({ component: Component, ...rest }) => {
    return (
        <div>
            <Route
                {...rest}
                render={(props) =>
                    !isLoggedIn ||
                    props.match.path.split("/")[1] == "logout" ||
                    props.match.path.split("/")[1] == "error" ? (
                        <PublicLayout>
                            <Component {...props} />
                        </PublicLayout>
                    ) : (
                        <div>
                            <Redirect to={{ pathname: "/dashboard" }} />
                        </div>
                    )
                }
            />
        </div>
    );
};

export default PublicRoute;
