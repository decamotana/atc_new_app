import React from "react";
import { Route, Switch } from "react-router-dom";

import { faChartPie, faChartMixed } from "@fortawesome/pro-light-svg-icons";
import {
    faBullhorn,
    faPaperPlane,
    faHome,
    faUsers,
    faUserCog,
    faClipboardQuestion,
    faRectangleAd,
    faTag,
} from "@fortawesome/pro-regular-svg-icons";
import {
    faLaptopMedical,
    faDollarSign,
    faPlay,
    faBell,
    faUserEdit,
    faFileLines,
    faFileCertificate,
    faUserTie,
    faScrewdriverWrench,
} from "@fortawesome/pro-solid-svg-icons";

/** template */
import PrivateRoute from "../PrivateRoute";

import Error404 from "../../views/errors/Error404";
import Error500 from "../../views/errors/Error500";

import PageDashboard from "../../views/private/PageAdmin/PageDashboard/PageDashboard";

export default function RouteAdmin() {
    // console.log("RouteAdmin");
    return (
        <Switch>
            <PrivateRoute
                exact
                path="/dashboard"
                title="Dashboard"
                subtitle="ADMIN"
                component={PageDashboard}
                pageHeaderIcon={faHome}
                breadcrumb={[
                    {
                        name: "Dashboard",
                        link: "/dashboard",
                    },
                ]}
            />

            {/* this should always in the bottom */}

            <Route exact path="/*" component={Error404} />
            <Route exact path="/500" component={Error500} />
        </Switch>
    );
}
