import React, { useEffect, useState } from "react";

import {
	Layout,
	Row,
	Col,
	Collapse,
	notification,
	Switch,
	Space,
	Typography,
} from "antd";

import { GET, POST } from "../../../../providers/useAxiosQuery";

export default function PageMaintenance({ showModalNew, permission }) {
	const { Panel } = Collapse;
	// const [form] = Form.useForm();
	const [change, setChange] = useState(false);
	const [data, setData] = useState({
		system_maintenance: 0,
	});

	GET("api/v1/maintenance", "maintenance", (res) => {
		if (res.success) {
			// console.log("config", res);
			setData({
				system_maintenance: res.data.system_maintenance,
			});

			// form.setFieldsValue({
			// 	system_maintenance: res.data.system_maintenance,
			// });
		}
	});

	const { mutate: mutateConfig, isLoading: isLoadingConfig } = POST(
		"api/v1/maintenance",
		"maintenance"
	);

	useEffect(() => {
		const timeoutId = setTimeout(() => {
			if (change) {
				// console.log("data", data);
				mutateConfig(data, {
					onSuccess: (res) => {
						if (res.success) {
							notification.success({
								message: "Maintenance",
								description: "Successfully updated.",
							});
							setChange(false);
						}
					},
				});
			}
		}, 3000);
		return () => {
			clearTimeout(timeoutId);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [change]);

	return (
		<Layout
			className="site-layout-background"
			style={{
				padding: "0px 0px 20px 0px",
				background: "#fff",
			}}
			id="ViewAs"
		>
			{/* <ComponentFaqs
      linkVid={"https://player.vimeo.com/video/644213846?autoplay=0&muted=1"}
    /> */}
			<br></br>
			<Layout.Content style={{ padding: "30px", paddingTop: "0px" }}>
				<Row gutter={24}>
					<Col xs={24} sm={24} md={24} lg={16} xl={16} xxl={16}>
						<Collapse
							className="ant-collapse-primary"
							expandIcon={({ isActive }) =>
								isActive ? (
									<span
										className="ant-menu-submenu-arrow"
										style={{ color: "#FFF", transform: "rotate(270deg)" }}
									></span>
								) : (
									<span
										className="ant-menu-submenu-arrow"
										style={{ color: "#FFF", transform: "rotate(90deg)" }}
									></span>
								)
							}
							expandIconPosition="end"
							defaultActiveKey={["1", "2", "3"]}
						>
							<Panel
								header="Website Maintenance"
								key="1"
								className="accordion bg-darkgray-form"
							>
								<Space wrap>
									<Typography.Text>
										Toggle it <span className="font-bold">ON</span> so that the
										users will know that the Website is under maintenance
									</Typography.Text>
									<Switch
										loading={isLoadingConfig ? true : false}
										checked={data.system_maintenance === 1 ? true : false}
										onChange={(e) => {
											setData({ ...data, system_maintenance: e ? 1 : 0 });
											setChange(true);
										}}
									/>
								</Space>
							</Panel>
						</Collapse>
					</Col>
				</Row>
			</Layout.Content>
		</Layout>
	);
}
