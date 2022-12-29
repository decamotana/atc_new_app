import React from "react";
import { Menu } from "antd";
import { HomeOutlined, UsergroupAddOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

export default function SidemenuList({ defaultOptionKey }) {
    return (
        <Menu
            theme="light"
            mode="inline"
            defaultSelectedKeys={defaultOptionKey}
            defaultOpenKeys={defaultOptionKey}
            className="sideMenu"
        >
            <Menu.Item
                key="dashboard"
                icon={<HomeOutlined />}
                className="notSub"
            >
                <Link to="/dashboard">Dashboard</Link>
            </Menu.Item>

            <Menu.SubMenu
                key="users"
                icon={<UsergroupAddOutlined />}
                title="Users"
            >
                <Menu.Item key="create-user">
                    <Link to="/users/create-user">Create User</Link>
                </Menu.Item>

                <Menu.Item key="current-users">
                    <Link to="/users/current-users">Current Users</Link>
                </Menu.Item>
            </Menu.SubMenu>
        </Menu>
    );
}
