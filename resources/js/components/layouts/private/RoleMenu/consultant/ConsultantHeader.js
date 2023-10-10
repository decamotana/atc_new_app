import React from "react";
import { Link } from "react-router-dom";
import { Menu, Typography } from "antd";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faUsers,
    faChartPie,
    faChartMixed,
} from "@fortawesome/pro-light-svg-icons";

export const menuLeft = <></>;

export const dropDownMenuLeft = () => {
    const items = [];

    return <Menu items={items} />;
};
