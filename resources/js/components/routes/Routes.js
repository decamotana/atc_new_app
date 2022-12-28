import React from "react";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";

import "antd/dist/antd.css";

// import '../assets/css/page.css'
// import '../assets/css/cards.css'

// from sass
import "../assets/css/main/main.css";
import "../assets/css/main-mobile/main-mobile.css";
import "../assets/css/accordion/accordion.css";
import "../assets/css/card/card.css";
import "../assets/css/button/button.css";
import "../assets/css/navigation/navigation.css";
import "../assets/css/tooltip/tooltip.css";
import "../assets/css/typography/typography.css";
import "../assets/css/login/login.css";
import "../assets/css/input/input.css";
import "../assets/css/layout/layout.css";
import "../assets/css/helper/helper.css";

import getUserData from "../providers/getUserData";

import PublicRoute from "./PublicRoute";
import PrivateRoute from "./PrivateRoute";

import Error404 from "../views/public/Widgets/Error404";
import Error500 from "../views/public/Widgets/Error500";

import PageLogin from "../views/public/PageLogin/PageLogin";
import PageLogout from "../views/public/PageLogin/PageLogout";
import PageForgotPassword from "../views/public/ForgotPassword/PageForgotPassword";
import Page2FA from "../views/public/ForgotPassword/Page2FA";
import PageRegistration from "../views/public/PageRegistration/PageRegistration";

// Dashboard
import RouteAdmin from "./RoleRoute/RouteAdmin";

const queryClient = new QueryClient();
const userdata = getUserData();

// const isLoggedIn = localStorage.getItem("token");
export default function Routes() {
    // if (userdata) {
    //     H.identify(userdata.email, {
    //         id: userdata.id,
    //         name: userdata.name,
    //         phone: userdata.phone_number
    //     });
    // }
    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <Switch>
                    <PublicRoute exact path="/" component={PageLogin} />

                    <PublicRoute exact path="/logout" component={PageLogout} />

                    <PublicRoute
                        exact
                        path="/registration"
                        component={PageRegistration}
                    />

                    <PublicRoute
                        exact
                        path="/forgot-password"
                        component={PageForgotPassword}
                    />

                    <PublicRoute exact path="/2fa" component={Page2FA} />

                    {userdata?.role === "Super Admin" && <RouteAdmin />}

                    {/* this should always in the bottom */}
                    <Redirect from="/dashboard" to="/login" />
                    <Route exact path="/*" component={Error404} />
                    <PublicRoute exact path="/error-500" component={Error500} />
                </Switch>
            </BrowserRouter>
        </QueryClientProvider>
    );
}
