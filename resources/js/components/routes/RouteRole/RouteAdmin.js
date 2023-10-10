import React from "react";
import {
    Route,
    Switch,
    // Route
} from "react-router-dom";
import {
    faChartPie,
    faChartMixed,
    faClockRotateLeft,
} from "@fortawesome/pro-light-svg-icons";
import {
    faHome,
    faUser,
    faUserPlus,
    faBell,
    faEnvelopesBulk,
    faCalendarTime,
    faCalendarTimes,
    faCalendar,
    faChartNetwork,
    faCalendarDays,
    faTableColumns,
    faUsers,
} from "@fortawesome/pro-regular-svg-icons";
import {
    faLaptopMedical,
    faPlay,
    faUserEdit,
    faFileLines,
    faFileCertificate,
    faLock,
} from "@fortawesome/pro-solid-svg-icons";

/** template */
import PrivateRoute from "../PrivateRoute";

import Error404 from "../../views/errors/Error404";
import Error500 from "../../views/errors/Error500";

import PageDashboard from "../../views/private/PageAdmin/PageDashboard/PageDashboard";
import PageUser from "../../views/private/PageAdmin/PageUser/PageUser";
import PageUserForm from "../../views/private/PageAdmin/PageUser/PageUserForm";
import PageConsultantRegister from "../../views/private/PageAdmin/PageConsultant/PageConsultantRegister";
import PageEmailTemplates from "../../views/private/PageAdmin/PageEmailTemplate/PageEmailTemplates";
import PageConsultant from "../../views/private/PageAdmin/PageConsultant/PageConsultant";
import PageStages from "../../views/private/PageAdmin/PageStages/PageStages";
import PageConsultantSchedules from "../../views/private/PageAdmin/PageConsultant/PageConsultantSchedules";
import Page2FA from "../../views/private/Page2fa/Page2fa";
import PageProfile from "../../views/private/PageUser/PageProfile/PageProfile";
import PageNotification from "../../views/private/PageNotification/PageNotification";
import PageCancelledAppointments from "../../views/private/PageAdmin/PageCancelledAppointments/PageCancelledAppointments";
import PageCalendar from "../../views/private/PageAdmin/PageCalendar/PageCalendar";
import PageHistoryLog from "../../views/private/PageAdmin/PageHistoryLog/PageHistoryLog";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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
                pageHeaderIcon={faChartNetwork}
                breadcrumb={[
                    {
                        name: "Dashboard",
                        link: "/dashboard",
                    },
                ]}
            />

            <PrivateRoute
                exact
                path="/clients"
                title="Clients"
                subtitle="View"
                component={PageUser}
                pageHeaderIcon={faUser}
                breadcrumb={[
                    {
                        name: "Clients",
                        link: "/clients",
                    },
                ]}
            />

            <PrivateRoute
                exact
                path="/consultant/register"
                title="Consultant"
                subtitle="Add new"
                component={PageConsultantRegister}
                pageHeaderIcon={faUsers}
                breadcrumb={[
                    {
                        name: "Consultant",
                        link: "/consultants",
                    },
                    {
                        name: "Add Consultant",
                        link: "/consultant/register",
                    },
                ]}
            />

            <PrivateRoute
                exact
                path="/emailtemplate"
                title="Templates"
                subtitle="EMAIL"
                component={PageEmailTemplates}
                pageHeaderIcon={faEnvelopesBulk}
                breadcrumb={[
                    {
                        name: "Email Templates",
                        link: "#",
                    },
                ]}
            />

            <PrivateRoute
                exact
                path="/user/adduser"
                title="ADD USER"
                subtitle="FORM"
                component={PageUserForm}
                pageHeaderIcon={faUserPlus}
                breadcrumb={[
                    {
                        name: "User",
                        link: "/user",
                    },
                    {
                        name: "Add User",
                        link: "/user/adduser",
                    },
                ]}
            />

            <PrivateRoute
                exact
                path="/user/manageuser/:id"
                title="Manage User"
                subtitle="USER"
                component={PageUserForm}
                pageHeaderIcon={faUserPlus}
                breadcrumb={[
                    {
                        name: "User",
                        link: "/user",
                    },
                    {
                        name: "User Details",
                        link: "#",
                    },
                ]}
            />

            <PrivateRoute
                exact
                path="/profile/account"
                title="Profile"
                subtitle="Edit"
                component={PageProfile}
                pageHeaderIcon={faUser}
                breadcrumb={[
                    {
                        name: "Profile",
                        link: "/profile/account",
                    },
                ]}
            />

            <PrivateRoute
                exact
                path="/stages"
                title="Stages"
                subtitle="MANAGE DASHBOARD"
                component={PageStages}
                pageHeaderIcon={faTableColumns}
                breadcrumb={[
                    {
                        name: "Stages",
                        link: "#",
                    },
                ]}
            />

            <PrivateRoute
                exact
                path="/consultants"
                title="Consultants"
                subtitle="MANAGE"
                component={PageConsultant}
                pageHeaderIcon={faUsers}
                breadcrumb={[
                    {
                        name: "Manage Consultants",
                        link: "#",
                    },
                ]}
            />

            <PrivateRoute
                exact
                path="/consultant/schedule/:id"
                title="Schedule"
                subtitle="CONSULTANT"
                component={PageConsultantSchedules}
                pageHeaderIcon={faTableColumns}
                breadcrumb={[
                    {
                        name: "Manage Consultants",
                        link: "/consultants",
                    },
                    {
                        name: "Consultant Schedule",
                        link: "#",
                    },
                ]}
            />

            <PrivateRoute
                exact
                path="/dashboard?code=:token"
                title="Dashboard"
                subtitle="ADMIN"
                component={PageDashboard}
                pageHeaderIcon={faHome}
                breadcrumb={[
                    {
                        name: "Task",
                        link: "/Task",
                    },
                ]}
            />

            <PrivateRoute
                exact
                path="/2fa"
                title="2 Factor Authentication"
                subtitle="ACCOUNT"
                component={Page2FA}
                pageHeaderIcon={faLock}
                breadcrumb={[
                    {
                        name: "User Profile",
                        link: "/",
                    },
                ]}
            />

            <PrivateRoute
                exact
                path="/cancelled-appointments"
                title="Cancelled Appointments"
                subtitle="MANAGE"
                component={PageCancelledAppointments}
                pageHeaderIcon={faCalendarTimes}
                breadcrumb={[
                    {
                        name: "Cancelled Appointments",
                        link: "#",
                    },
                ]}
            />

            <PrivateRoute
                exact
                path="/notification"
                title="Notifications"
                subtitle="VIEW"
                component={PageNotification}
                pageHeaderIcon={faBell}
                breadcrumb={[
                    {
                        name: "Notification",
                        link: "#",
                    },
                ]}
            />

            <PrivateRoute
                exact
                path="/cancelled-appointment"
                title="Cancelled Appointments"
                subtitle="Review and Manage"
                component={PageCancelledAppointments}
                pageHeaderIcon={faBell}
                breadcrumb={[
                    {
                        name: "User Profile",
                        link: "/",
                    },
                ]}
            />

            <PrivateRoute
                exact
                path="/calendar"
                title="Calendar"
                subtitle="ADMIN"
                component={PageCalendar}
                pageHeaderIcon={faCalendarDays}
                breadcrumb={[
                    {
                        name: "Admin Calendar",
                        link: "#",
                    },
                ]}
            />

            <PrivateRoute
                exact
                path="/history/all"
                title="History"
                subtitle="ALL"
                component={PageHistoryLog}
                pageHeaderIcon={faClockRotateLeft}
                breadcrumb={[
                    {
                        name: "All Histories",
                        link: "#",
                    },
                ]}
            />

            {/* this should always in the bottom */}

            <Route exact path="/*" component={Error404} />
            <Route exact path="/500" component={Error500} />
        </Switch>
    );
}
