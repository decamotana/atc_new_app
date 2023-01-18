import React from "react";
import {
    faChartPie,
    faHome,
    faUsdCircle,
    faChartMixed,
    faBooks,
    faBell,
    faPaperPlane,
    faCogs,
    faBullhorn,
    faUsers,
    faFileCertificate,
    faTicket,
    faTag,
    faScrewdriverWrench,
    faCommentDots,
    faUserTie,
    faQuestion,
    // faNewspaper,
} from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { role } from "../../../../providers/companyInfo";
import { faBook } from "@fortawesome/pro-regular-svg-icons";

const AdminSideMenu = [
    {
        title: "Dashboard",
        path: "/dashboard",
        icon: <FontAwesomeIcon icon={faHome} />,
    },

    {
        title: "References",
        path: "/references",
        icon: <FontAwesomeIcon icon={faBook} />,
        children: [
            {
                title: "Question Category",
                path: "/references/question-category",
            },
            {
                title: "Advertisement Type",
                path: "/references/advertisement-type",
            },
        ],
    },
];

if (role() === "Super Admin") {
    AdminSideMenu.push({
        title: "Admin",
        path: "/admin",
        icon: <FontAwesomeIcon icon={faUserTie} />,
        // permission: "Ticketing",
    });
    AdminSideMenu.push({
        title: "Maintenance",
        path: "/maintenance-configuration",
        icon: <FontAwesomeIcon icon={faScrewdriverWrench} />,
        // permission: "Ticketing",
    });
}

export default AdminSideMenu;
