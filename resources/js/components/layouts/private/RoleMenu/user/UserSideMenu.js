import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faListCheck,
    faVideo,
    faFileArrowUp,
    faFilePdf,
    faChartNetwork,
    faCalendarDays,
} from "@fortawesome/pro-regular-svg-icons";

const UserSideMenu = [
    {
        title: "Dashboard",
        path: "/dashboard",
        icon: <FontAwesomeIcon icon={faChartNetwork} />,
    },
    {
        title: "Tasks",
        path: "/task",
        icon: <FontAwesomeIcon icon={faListCheck} />,
    },

    {
        title: "Calendars",
        path: "#",
        icon: <FontAwesomeIcon icon={faCalendarDays} />,
        children: [
            {
                title: "Book a Consultant",
                path: "/appointment/book-a-consultant",
            },
            {
                title: "My Schedule",
                path: "/appointment/myschedule",
            },
        ],
    },
    {
        title: "Video",
        path: "/Video",
        icon: <FontAwesomeIcon icon={faVideo} />,
        className: "video-link",
    },
    {
        title: "MNDA",
        path: "/mnda",
        icon: <FontAwesomeIcon icon={faFilePdf} />,
        className: "MNDA",
    },
    {
        title: "Upload Docs",
        path: "/documents",
        icon: <FontAwesomeIcon icon={faFileArrowUp} />,
    },
    // {
    //   title: "News",
    //   path: "/news",
    //   icon: <FontAwesomeIcon icon={faClipboardList} />,
    // },
];

export default UserSideMenu;
