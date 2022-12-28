import React, { useEffect, useState } from "react";
import {
    Redirect,
    Route,
    Switch,
    // Route
} from "react-router-dom";

/** template as */
import PrivateRoute from "../PrivateRoute";
// import PrivateRouteNew from "../PrivateRouteNew";
import PageDashboard from "../../views/private/PageDashboard/PageDashboard";
import PageCreateUser from "../../views/private/PageUsers/PageCreateUser/PageCreateUser";
import PageEditUser from "../../views/private/PageUsers/PageEditUser/PageEditUser";
import PageCurrentClients from "../../views/private/PageClients/PageCurrentClients/PageCurrentClients";
import PageCurrentUsers from "../../views/private/PageUsers/PageCurrentUsers/PageCurrentUsers";
import PageCreateClient from "../../views/private/PageClients/PageCreateClient/PageCreateClient";
import PageEditClient from "../../views/private/PageClients/PageEditClient/PageEditClient";
import Error404 from "../../views/public/Widgets/Error404";
import Error500 from "../../views/public/Widgets/Error500";

export default function RouteAdmin(props) {
    return (
        <Switch>
            {/* Dashboard */}
            <PrivateRoute
                exact
                path="/dashboard"
                component={PageDashboard}
                permission="Dashboard"
            />

            {/* Dashboard */}
            <PrivateRoute
                exact
                path="/dashboard"
                component={PageDashboard}
                permission="Dashboard"
            />

            {/* USERS */}
            <PrivateRoute
                exact
                path="/users/create-user"
                component={PageCreateUser}
                permission="Create User"
            />
            <PrivateRoute
                exact
                path="/users/edit-user/:id"
                component={PageEditUser}
                permission="Edit User"
            />
            <PrivateRoute
                exact
                path="/users"
                component={PageCurrentClients}
                permission="Current Users"
            />
            <PrivateRoute
                exact
                path="/users/current-users"
                component={PageCurrentUsers}
                permission="Current Users"
            />

            {/* USERS */}
            <PrivateRoute
                exact
                path="/clients/create-client"
                component={PageCreateClient}
                permission="Create Client"
            />
            <PrivateRoute
                exact
                path="/clients/edit-client/:id"
                component={PageEditClient}
                permission="Edit Client"
            />
            <PrivateRoute
                exact
                path="/clients"
                component={PageCurrentClients}
                permission="Current Clients"
            />
            <PrivateRoute
                exact
                path="/clients/current-clients"
                component={PageCurrentClients}
                permission="Current Clients"
            />

            <Redirect from="/" to="/" />
            <Route exact path={"/*"} component={Error404} />
            <Route exact path={"/error-500"} component={Error500} />
        </Switch>
    );
}
