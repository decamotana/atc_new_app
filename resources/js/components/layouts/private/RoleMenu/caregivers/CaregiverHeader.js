import React from "react";
import { Link } from "react-router-dom";
import { Menu, Typography } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faChartPieAlt,
	faLightbulbOn,
	faChartMixed,
} from "@fortawesome/pro-light-svg-icons";

export const menuLeft = (
	<>
		<div className="ant-menu-left-icon">
			<Link to="/course-status/certificate-of-completion">
				<span className="anticon">
					<FontAwesomeIcon icon={faChartPieAlt} />
				</span>
				<Typography.Text>Course Status</Typography.Text>
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
					<FontAwesomeIcon icon={faChartMixed} />
				</span>
				<Typography.Text>Training Modules</Typography.Text>
			</Link>
		</div>
	</>
);

export const dropDownMenuLeft = () => {
	const items = [
		{
			key: "/course-status/certificate-of-completion",
			icon: <FontAwesomeIcon icon={faChartPieAlt} />,
			label: (
				<Link to="/course-status/certificate-of-completion">Course Status</Link>
			),
		},
		{
			key: "/support/faqs",
			icon: <FontAwesomeIcon icon={faLightbulbOn} />,
			label: <Link to="/support/faqs">FAQ's</Link>,
		},
		{
			key: "/training-modules",
			icon: <FontAwesomeIcon icon={faChartMixed} />,
			label: <Link to="/training-modules">Training Modules</Link>,
		},
	];

	return <Menu items={items} />;
};
