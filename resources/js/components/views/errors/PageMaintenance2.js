import React from "react";
import {
	Layout,
	Card,
	// Form,
	// Input,
	// Button,
	Row,
	Col,
	Image,
	Divider,
	// notification,
	Typography,
	// Alert,
} from "antd";
// import { Link, useHistory, useLocation } from "react-router-dom";
import moment from "moment";
import { logo, description } from "../../providers/companyInfo";
import warningLogo from "../../assets/img/warning.png";

export default function PageMaintenance() {
	// let history = useHistory();

	return (
		<Layout className="public-layout">
			<Layout.Content className="maintenance-layout">
				<Row>
					<Col xs={24} sm={4} md={4} lg={6} xl={8} xxl={9}></Col>
					<Col xs={24} sm={16} md={16} lg={12} xl={8} xxl={6}>
						<Card
							cover={<Image src={logo} preview={false} />}
							bordered={false}
							className="m-t-xl"
						>
							<Row className="flexdirection">
								<Col xs={24} md={24} className="text-center">
									<Typography.Title level={3} className="text-site-maintenance">
										Site Maintenance
									</Typography.Title>

									<img
										src={warningLogo}
										alt="warning.png"
										className="warning-logo"
									/>
								</Col>

								<Divider className="m-t-xxl m-b-xxl" />

								<Col xs={24} md={24} className="text-center m-b-xxl">
									<Typography.Text>
										Our site is currently undergoing scheduled maintenance and
										upgrades, but will return shortly. We apologize for the
										inconveniece, thank you for your patience.
									</Typography.Text>
								</Col>

								<Col xs={24} md={24}>
									<div className="m-t-xxxxl text-center">
										© Copyright {moment().format("YYYY")} {description}. All
										Rights Reserved..
									</div>
								</Col>
							</Row>
						</Card>
					</Col>
					<Col xs={24} sm={4} md={4} lg={6} xl={8} xxl={9}></Col>
				</Row>
			</Layout.Content>
		</Layout>
	);
}
