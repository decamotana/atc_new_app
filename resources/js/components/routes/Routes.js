import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { userData } from "../providers/companyInfo";
import {
    faTicket,
    faLightbulbOn,
    faUserEdit,
    faCreditCard,
    faFileInvoiceDollar,
    faCommentDots,
    faLock,
} from "@fortawesome/pro-solid-svg-icons";

import "antd/dist/antd.css";

/** sass */
import "../assets/css/ui/helper/helper.css";
import "../assets/css/ui/card/card.css";
import "../assets/css/ui/input/input.css";
import "../assets/css/ui/button/button.css";
import "../assets/css/ui/tooltip/tooltip.css";
import "../assets/css/ui/checkbox/checkbox.css";
import "../assets/css/ui/datepicker/datepicker.css";
import "../assets/css/ui/steps/steps.css";
import "../assets/css/ui/radio/radio.css";
import "../assets/css/ui/quill/quill.css";
import "../assets/css/ui/typography/typography.css";
import "../assets/css/ui/spinner/spinner.css";
import "../assets/css/ui/collapse/collapse.css";
import "../assets/css/ui/accordion/accordion.css";
import "../assets/css/ui/navigation/navigation.css";
import "../assets/css/ui/pagination/pagination.css";
import "../assets/css/ui/tabs/tabs.css";
import "../assets/css/ui/modal/modal.css";
import "../assets/css/ui/table/table.css";
import "../assets/css/ui/header/header.css";
import "../assets/css/ui/sidemenu/sidemenu.css";
import "../assets/css/ui/breadcrumb/breadcrumb.css";
import "../assets/css/ui/page_header/page_header.css";
import "../assets/css/ui/table-filter/table-filter.css";
import "../assets/css/ui/footer/footer.css";
import "../assets/css/ui/public-layout/public-layout.css";
import "../assets/css/ui/private-layout/private-layout.css";

import "../assets/css/main/main.css";

import "../assets/css/errors/maintenance/maintenance.css";

import "../assets/css/pages/login/login.css";
import "../assets/css/pages/create-password/create-password.css";
import "../assets/css/pages/dashboard/dashboard.css";
import "../assets/css/pages/profile/profile.css";
import "../assets/css/pages/revenue/revenue.css";
import "../assets/css/pages/subscriber/subscriber.css";
import "../assets/css/pages/training_module/training_module.css";
import "../assets/css/pages/resource-online/resource-online.css";
import "../assets/css/pages/resource-video/resource-video.css";
import "../assets/css/pages/resource-document/resource-document.css";
import "../assets/css/pages/page-certificate-template/page-certificate-template.css";
import "../assets/css/pages/payment-and-invoices/payment-and-invoices.css";
import "../assets/css/pages/messages/messages.css";
import "../assets/css/pages/task/task.css";
import "../assets/css/pages/appointment/appointment.css";
import "../assets/css/pages/documents/documents.css";
import "../assets/css/pages/consultant-register/consultant-register.css";
import "../assets/css/pages/clients/clients.css";
import "../assets/css/pages/video/video.css";
import "../assets/css/pages/admin-calendar/admin-calendar.css";

/** end sass */

/** errors */

import Error404 from "../views/errors/Error404";
import Error500 from "../views/errors/Error500";
// import PageMaintenance from "../views/errors/PageMaintenance";

/** end errors */

/** public views */

import PageLogin from "../views/public/PageLogin/PageLogin";
import PageCreatePassword from "../views/public/PageCreatePassword/PageCreatePassword";
import PageRegister from "../views/public/PageRegister/PageRegister";
import PageRegistrationSetPassword from "../views/public/PageRegister/PageRegistrationSetPassword";
import PageForgotPassword from "../views/public/ForgotPassword/PageForgotPassword";

/** end public views */

/** private views */

import RouteAdmin from "./RouteRole/RouteAdmin";
import RouteUser from "./RouteRole/RouteUser";
import RouteConsultant from "./RouteRole/RouteConsultant";

import PublicRoute from "./PublicRoute";
import PrivateRoute from "./PrivateRoute";
import { GiftOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useEffect } from "react";

import { ClearCacheProvider, useClearCache } from "react-clear-cache";
import PageMaintenance from "../views/errors/PageMaintenance";

/** end private views */

// const token = localStorage.token;
const queryClient = new QueryClient();

// console.log("userData", userData());

export default function Routes() {
    return (
        // <ClearCacheProvider>
        <QueryClientProvider client={queryClient}>
            <Router>
                <Switch>
                    {/* public route */}
                    <PublicRoute
                        exact
                        path="/"
                        component={PageLogin}
                        title="Login"
                    />
                    <PublicRoute
                        exact
                        path="/create-password"
                        component={PageCreatePassword}
                        title="Create Password"
                    />

                    <PublicRoute
                        exact
                        path="/register"
                        component={PageRegister}
                        title="Register"
                    />

                    <PublicRoute
                        exact
                        path="/forgot-password/:token/:id"
                        component={PageForgotPassword}
                        title="Forgot Password"
                    />

                    {/* <PublicRoute exact path="/register/setup-password/:token" component={PageRegistrationSetPassword} title="Register - Setup Password" /> */}
                    {/* end public route */}
                    <PublicRoute
                        exact
                        path="/register/setup-password/:token"
                        component={PageRegistrationSetPassword}
                        title="Register - Setup Password"
                    />

                    <PublicRoute
                        exact
                        path="/myatc/user/autologin/:token"
                        component={PageLogin}
                        title="autologin"
                    />

                    <PublicRoute
                        exact
                        path="/email/notification/autologin/:token/:id"
                        component={PageLogin}
                        title="autologin"
                    />
                    <PublicRoute
                        exact
                        path="/maintenance-login"
                        component={PageLogin}
                        title="maintenance"
                    />

                    <Route
                        exact
                        path="/maintenance"
                        component={PageMaintenance}
                        title="maintenance"
                    />

                    {/* private route */}
                    {/* {token && <RoutePrivateNoLayout />} */}

                    {/* support/faqs */}

                    {userData() && userData().role === "Admin" && (
                        <RouteAdmin />
                    )}
                    {userData() && userData().role === "User" && <RouteUser />}
                    {userData() && userData().role === "Consultant" && (
                        <RouteConsultant />
                    )}
                    {/* end private route */}

                    {/* this should always in the bottom */}

                    <Route exact path="/*" component={Error404} />
                    <Route exact path="/500" component={Error500} />
                </Switch>
            </Router>
        </QueryClientProvider>
        // </ClearCacheProvider>
    );
}
