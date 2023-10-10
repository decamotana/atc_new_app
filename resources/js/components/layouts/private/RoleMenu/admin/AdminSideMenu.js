import React from "react";
import { faEnvelopesBulk } from "@fortawesome/pro-light-svg-icons";
import {
    faBell,
    faCalendarDays,
    faChartNetwork,
    faTableColumns,
    faUser,
    faUsers,
    faCalendarTimes,
    faClockRotateLeft,
} from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const AdminSideMenu = [
    {
        title: "Dashboard",
        path: "/dashboard",
        icon: <FontAwesomeIcon icon={faChartNetwork} />,
    },
    {
        title: "Clients",
        path: "/clients",
        icon: <FontAwesomeIcon icon={faUser} />,
    },
    {
        title: "Consultants",
        path: "/consultants",
        icon: <FontAwesomeIcon icon={faUsers} />,
    },
    {
        title: "Calendar",
        path: "/calendar",
        icon: <FontAwesomeIcon icon={faCalendarDays} />,
    },
    {
        title: "Email Templates",
        path: "/emailtemplate",
        icon: <FontAwesomeIcon icon={faEnvelopesBulk} />,
    },
    {
        title: "Stages",
        path: "/stages",
        icon: <FontAwesomeIcon icon={faTableColumns} />,
    },
    {
        title: "Notifications",
        path: "/notification",
        icon: <FontAwesomeIcon icon={faBell} />,
    },
    {
        title: "Cancelled Appt.",
        path: "/cancelled-appointments",
        icon: <FontAwesomeIcon icon={faCalendarTimes} />,
    },
    {
        title: "History Log",
        path: "/history/all",
        icon: <FontAwesomeIcon icon={faClockRotateLeft} />,
    },
];

export default AdminSideMenu;
