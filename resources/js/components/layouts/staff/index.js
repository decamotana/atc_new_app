import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Card, Layout, Menu } from "antd";
import {
	HomeOutlined,
	ProfileOutlined,
	CalendarOutlined,
	LogoutOutlined,
	AuditOutlined,
} from "@ant-design/icons";

const Private = (props) => {
	const [current, setCurrent] = useState("dashboard");
	const history = useHistory();

	const handleMenu = (e) => {
		console.log("click ", e);
		if(e.key == 'logout'){
			localStorage.removeItem('userdata')
			window.location.reload(false)
		} else {
			setCurrent(e.key);
			history.push("/" + e.key);
		}
	};

	return (
		<Layout className="ant-layout-private">
			<Layout.Content className="ant-layout-private-container" style={{ marginBottom: "50px"}}>
				{/* <Card style={{ minHeight: `${window.screen.height - 60}px` }}> */}
				{/* <Card > */}
					{props.children}
				{/* </Card> */}
			</Layout.Content>

			<Menu
				style={{ 
					position: "fixed", 
					bottom: "0", zIndex: 
					"1", 
					width: "100%",
					display: 'flex',
    				justifyContent: 'center', 
				}}
				onClick={handleMenu}
				selectedKeys={[current]}
				mode="horizontal"
			>
				<Menu.Item key="home" icon={<HomeOutlined />}>
					HOME
				</Menu.Item>
				<Menu.Item key="appointment" icon={<CalendarOutlined />}>
					APPOINTMENT
				</Menu.Item>
				<Menu.Item key="profile" icon={<ProfileOutlined />}>
					PROFILE
				</Menu.Item>
				<Menu.Item key="logout" icon={<LogoutOutlined />}>
					LOGOUT
				</Menu.Item>
				{/* <Menu.Item key="activity" icon={<AuditOutlined />}>
					ACTIVITIES
				</Menu.Item> */}
			</Menu>
		</Layout>
	);
};

export default Private;
