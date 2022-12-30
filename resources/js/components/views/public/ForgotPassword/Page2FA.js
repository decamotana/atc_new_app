import React from "react";
import {
	Layout,
	Card,
	Form,
	Input,
	Button,
	Row,
	Col,
	Image,
	Divider,
} from "antd";

import { CheckOutlined } from "@ant-design/icons";

import imageLogo from "../../../assets/img/logo.png";

export default function Page2FA() {
	const [form] = Form.useForm();

	const onFinish = (values) => {};

	return (
		<Layout className="public-layout login-layout">
			<Layout.Content className="p-t-xl p-b-xl">
				<Row>
					<Col xs={24} sm={4} md={4} lg={6} xl={8} xxl={9}></Col>
					<Col
						xs={24}
						sm={16}
						md={16}
						lg={12}
						xl={8}
						xxl={6}
						style={{ padding: 10 }}
					>
						<Card
							style={{
								background: "transparent",
								border: "0px solid",
								textAlign: "left",
								height: "auto",
							}}
							headStyle={{
								borderBottom: "none",
								background: "transparent!important",
							}}
							title={<Image src={imageLogo} preview={false} />}
							className="login"
						>
							<Row className="flexdirection">
								<Col xs={24} md={24}>
									<br />
									<br />
									<div
										style={{
											display: "flex",
											flexDirection: "row",
										}}
									>
										<div
											size="large"
											shape="circle"
											type="link"
											className="editIcon"
										>
											<CheckOutlined />
										</div>
										<div
											style={{
												textAlign: "left",
												lineHeight: "1.3",
												paddingTop: "7px",
											}}
										>
											<span style={{ fontSize: "16px" }}>Two Factor</span>
											<br />
											<span className="newMemberTitle">Authentication</span>
											<br />
										</div>
									</div>
									<Divider style={{ background: "#293a56", height: "2px" }} />

									<Form
										name="basic"
										layout="vertical"
										className="login-form"
										onFinish={onFinish}
										form={form}
										autoComplete="off"
									>
										<span style={{ fontSize: "20px" }}>
											Create Your Membership Account{" "}
											<span style={{ color: "red" }}>*</span>
										</span>
										<br />
										<Form.Item
											name="password"
											rules={[
												{
													required: true,
													message: "Please input your password!",
												},
												// { validator: validatePassword }
											]}
											hasFeedback
										>
											<Input size="large" />
											<span>
												Verification code is application generated and 6 digits
												long.
											</span>
										</Form.Item>

										<Button
											type="primary"
											htmlType="submit"
											// loading={isLoadingButtonLogin}
											className="btn-login-outline"
											style={{ fontSize: "20px", height: "45px" }}
										>
											VERIFY
										</Button>
									</Form>

									<br />
									<br />
									<br />
									<div style={{ textAlign: "center" }}>
										<span>© 2022 CE.LIYA. All Rights Reserved.</span>
									</div>
								</Col>
							</Row>
						</Card>
					</Col>
				</Row>
			</Layout.Content>
		</Layout>
	);
}
