import React, { useEffect, useState } from "react";
import {
    Redirect,
    Route,
    Switch,
    // Route
} from "react-router-dom";

/** template as */
import PrivateRouteStaff from "../PrivateRouteStaff";
import PageDashboard from "../../views/private/PageDashboard/PageDashboard";
import Error404 from "../../views/public/Widgets/Error404";
import Error500 from "../../views/public/Widgets/Error500";

export default function RouteStaff(props) {
    return (
        <Switch>
            {/* Dashboard */}
            <PrivateRouteStaff
                exact
                path="/dashboard"
                component={PageDashboard}
                permission="Dashboard"
            />

            <Redirect from="/" to="/" />
            <Route exact path={"/*"} component={Error404} />
            <Route exact path={"/error-500"} component={Error500} />
        </Switch>
    );
}
