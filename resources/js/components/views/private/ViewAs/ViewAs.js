import React, { useState } from "react";

import { Layout, Form, Row, Col, Collapse } from "antd";

import FloatSelect from "../../../providers/FloatSelect";

import { GET, POST } from "../../../providers/useAxiosQuery";
import { encrypt } from "../../../providers/companyInfo";
export default function ViewAs({ showModalNew, permission }) {
	// const [tableFilter, setTableFilter] = useState({
	//   page: 1,
	//   page_size: 50,
	//   search: "",
	//   sort_field: "subject",
	//   sort_order: "desc",
	// });

	// const [tableTotal, setTableTotal] = useState(0);
	// const [dataSource, setDataSource] = useState([]);
	const [dataUsers, setDataUsers] = useState([]);
	GET(`api/v1/member_options`, "ticket", (res) => {
		if (res.success) {
			// console.log("dataTable", res);
			if (res.success) {
				// console.log("member_options", res);
				let arr = [];
				res.data &&
					res.data.map((row, index) => {
						let val =
							row.firstname + " " + row.lastname + " - (" + row.role + ")";
						arr.push({
							value: row.id,
							label: val,
							json: row,
						});
						return "";
					});
				// console.log(arr);
				setDataUsers(arr);
			}
		}
	});

	const { Panel } = Collapse;
	const [form] = Form.useForm();

	const { mutate: mutateGenerateToken } = POST(
		"api/v1/generate/token/viewas",
		"viewas_mutate"
	);

	const handleFinish = (val) => {
		console.log(val.users);
		mutateGenerateToken(
			{ id: val.users, viewas: localStorage.viewas },
			{
				onSuccess: (res) => {
					console.log(res);
					localStorage.token = res.token;
					if (!localStorage.viewas) {
						localStorage.userdata_admin = localStorage.userdata;
					}
					localStorage.userdata = encrypt(res.data);
					localStorage.viewas = true;
					var url = window.location.origin;
					window.location.href = url;
				},
			}
		);
	};

	const onChangeSelectUser = () => {
		form.submit();
	};
	return (
		<Layout
			className="site-layout-background"
			style={{
				padding: "0px 0px 20px 0px",
				background: "#fff",
			}}
			id="ViewAs"
		>
			<Layout.Content style={{ padding: "30px", paddingTop: "0px" }}>
				<Row gutter={24}>
					<Col xs={24} sm={24} md={16} lg={16} xl={16} xxl={16}>
						<Collapse
							defaultActiveKey={["1"]}
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
							className="ant-collapse-primary border-none collapse-account-type"
						>
							<Panel
								header="Select User To View"
								key="1"
								className="card-dark-head card-main"
							>
								<Form
									wrapperCol={{ span: 24 }}
									layout="horizontal"
									form={form}
									onFinish={handleFinish}
								>
									<Form.Item
										name="users"
										rules={[{ required: true, message: "required!" }]}
										className="form-select-error"
										hasFeedback
									>
										<FloatSelect
											label="Select User"
											placeholder="Select User"
											options={dataUsers}
											onChange={() => onChangeSelectUser()}
										/>
									</Form.Item>
								</Form>
							</Panel>
						</Collapse>
					</Col>
				</Row>
			</Layout.Content>
		</Layout>
	);
}
