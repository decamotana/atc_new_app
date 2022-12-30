import React from "react";
import { Link } from "react-router-dom";
import { Menu, Typography } from "antd";
import {
	faUsers,
	faLightbulbOn,
	faAnalytics,
} from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const menuLeft = (
	<>
		<div className="ant-menu-left-icon">
			<Link to="/subscribers/current-completed">
				<span className="anticon">
					<FontAwesomeIcon icon={faUsers} />
				</span>
				<Typography.Text>My Employees</Typography.Text>
			</Link>
		</div>

		<div className="ant-menu-left-icon">
			<Link to="/support/faqs">
				<span className="anticon">
					<FontAwesomeIcon icon={faLightbulbOn} />
				</span>
				<Typography.Text>FAQ's</Typography.Text>
			</Link>
		</div>

		<div className="ant-menu-left-icon">
			<Link to="/training-modules">
				<span className="anticon">
					<FontAwesomeIcon icon={faAnalytics} />
				</span>
				<Typography.Text>Training Modules</Typography.Text>
			</Link>
		</div>
	</>
);

export const dropDownMenuLeft = () => {
	const items = [
		{
			key: "/subscribers/current-completed",
			icon: <FontAwesomeIcon icon={faUsers} />,
			label: <Link to="/subscribers/current-completed">My Employees</Link>,
		},
		{
			key: "/support/faq",
			icon: <FontAwesomeIcon icon={faLightbulbOn} />,
			label: <Link to="/support/faqs">FAQ's</Link>,
		},
		{
			key: "/training-modules",
			icon: <FontAwesomeIcon icon={faAnalytics} />,
			label: <Link to="/training-modules">Training Modules</Link>,
		},
	];

	return <Menu items={items} />;
};
