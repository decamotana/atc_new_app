import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCalendarDays,
    faChartNetwork,
    faUser,
} from "@fortawesome/pro-regular-svg-icons";

const ConsultantSideMenu = [
    //   {
    //     title: "Dashboard",
    //     path: "/dashboard",
    //     icon: <FontAwesomeIcon icon={faHome} />,
    //   },

    {
        title: "Dashboard",
        path: "/dashboard",
        icon: <FontAwesomeIcon icon={faChartNetwork} />,
    },

    {
        title: "Calendars",
        path: "/appointment",
        icon: <FontAwesomeIcon icon={faCalendarDays} />,
        children: [
            {
                title: "My Availability",
                path: "/appointment/schedules",
            },
            {
                title: "My Bookings",
                path: "/appointment/bookings",
            },
        ],
    },
    {
        title: "Clients",
        path: "/user",
        icon: <FontAwesomeIcon icon={faUser} />,
    },
];

export default ConsultantSideMenu;
