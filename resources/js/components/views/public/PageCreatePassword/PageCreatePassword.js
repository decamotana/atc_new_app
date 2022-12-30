import React, { useState } from "react";
import {
	Layout,
	Card,
	Form,
	Button,
	Row,
	Col,
	Image,
	Typography,
	Alert,
} from "antd";
import { useHistory } from "react-router-dom";
import moment from "moment";
import { logo, description } from "../../../providers/companyInfo";
import FloatInputPasswordStrength from "../../../providers/FloatInputPasswordStrength";

export default function PageCreatePassword() {
	let history = useHistory();
	const [errorMessage, setErrorMessage] = useState({
		type: "success",
		message: "",
	});

	console.log("window.location.origin", window.location.origin);

	const [form] = Form.useForm();

	const onFinish = (values) => {
		console.log("values", values);
		setErrorMessage({
			type: "success",
			message: "Password created successfully.",
		});
		history.push("/");
		// mutateLogin(values, {
		// 	onSuccess: (res) => {
		// 		if (res.token) {
		// 			localStorage.setItem("token", res.token);
		// 			localStorage.setItem("userdata", JSON.stringify(res.data));
		// 			if (res.data.one_time_modal === 1) {
		// 				localStorage.setItem("one_time_modal", 1);
		// 			}
		// 			if (res.data.role === "SUPER ADMIN") {
		// 				window.location.href = "/admin/dashboard";
		// 			} else if (res.data.role === "EVENT PROVIDER") {
		// 				window.location.href = "/event-provider/dashboard";
		// 			} else if (res.data.role === "VENUE PROVIDER") {
		// 				window.location.href = "/venue-provider/dashboard";
		// 			} else if (res.data.role === "MEMBER") {
		// 				window.location.href = "/member/dashboard";
		// 			} else if (res.data.role === "SPEAKER") {
		// 				window.location.href = "/speaker/dashboard";
		// 			}
		// 		} else {
		// 			notification.warning({
		// 				message: res.message,
		// 				description: res.description,
		// 			});
		// 		}
		// 	},
		// 	onError: (err) => {
		// 		console.log(err);
		// 	},
		// });
	};

	return (
		<Layout className="public-layout">
			<Layout.Content className="create-password-layout">
				<Row>
					<Col xs={24} sm={4} md={4} lg={6} xl={8} xxl={9}></Col>
					<Col xs={24} sm={16} md={16} lg={12} xl={8} xxl={6}>
						<Card
							cover={<Image src={logo} preview={false} />}
							bordered={false}
							className="m-t-xl"
						>
							<Row className="flexdirection">
								<Col xs={24} md={24}>
									<Form
										layout="vertical"
										className="create-password-form"
										onFinish={onFinish}
										form={form}
										autoComplete="off"
									>
										<Typography.Title
											level={3}
											className="text-center text-create-new-password"
										>
											Create a New Password
										</Typography.Title>

										<Typography.Text
											level={3}
											type="secondary"
											className="text-center m-t-none"
										>
											Your password must be at least 8 characters long and
											contain at least one number and one character.
										</Typography.Text>

										<Form.Item
											name="password"
											rules={[
												{
													required: true,
													message: "This field field is required.",
												},
												{
													pattern:
														/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,64}$/,
													message: "Invalid Password",
												},
											]}
											hasFeedback
											className="m-b-sm"
										>
											<FloatInputPasswordStrength
												label="Password"
												placeholder="Password"
											/>
										</Form.Item>

										<Form.Item
											name="confirm-password"
											dependencies={["password"]}
											rules={[
												{
													required: true,
													message: "This field field is required.",
												},
												{
													pattern:
														/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,64}$/,
													message: "Invalid Password",
												},
												({ getFieldValue }) => ({
													validator(_, value) {
														if (!value || getFieldValue("password") === value) {
															return Promise.resolve();
														}
														return Promise.reject(
															new Error(
																"The two passwords that you entered do not match!"
															)
														);
													},
												}),
											]}
											hasFeedback
											className="m-b-sm"
										>
											<FloatInputPasswordStrength
												label="Confirm Password"
												placeholder="Confirm Password"
											/>
										</Form.Item>

										<Button
											type="primary"
											htmlType="submit"
											// loading={isLoadingButtonLogin}
											className="btn-public-outline m-t-sm"
											block
											size="large"
										>
											SUBMIT
										</Button>

										{errorMessage.message && (
											<Alert
												className="m-t-sm"
												type={errorMessage.type}
												message={errorMessage.message}
											/>
										)}
									</Form>
								</Col>
							</Row>
						</Card>
					</Col>
					<Col xs={24} sm={4} md={4} lg={6} xl={8} xxl={9}></Col>
					<Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
						<div className="m-t-xxxxl text-center">
							© Copyright {moment().format("YYYY")} {description}. All Rights
							Reserved..
						</div>
					</Col>
				</Row>
			</Layout.Content>
		</Layout>
	);
}
