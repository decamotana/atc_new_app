import React, { useState, useEffect } from "react";
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
import { apiUrl, description, encrypt } from "../../../providers/companyInfo";
import axios from "axios";
import { fullwidthlogo } from "../../../providers/companyInfo";
import FloatInputPasswordStrength from "../../../providers/FloatInputPasswordStrength";

export default function PageForgotPassword({ match }) {
	let history = useHistory();
	let token = match.params.token;
	const [form] = Form.useForm();
	const [isLoadingChangePass, setIsLoadingChangePass] = useState(false);

	useEffect(() => {
		axios
			.post(
				`${apiUrl}api/v1/check_auth`,
				{},
				{
					headers: {
						Authorization: "Bearer " + token,
					},
				}
			)
			.then((res) => {
				console.log("success");
			})
			.catch((err) => {
				if (err.response.status === 401) {
					history.push("/error-500");
				}
			});
	}, [token, history]);

	const [errorMessageLogin, setErrorMessageLogin] = useState({
		type: "success",
		message: "",
	});

	const onFinishLogin = (values) => {
		let data = {
			...values,
			link_origin: window.location.origin,
		};

		setIsLoadingChangePass(true);

		axios
			.post(`${apiUrl}api/v1/forgot_password_set_password`, data, {
				headers: {
					Authorization: "Bearer " + token,
				},
			})
			.then((res) => {
				console.log("res", res);
				if (res.data.success) {
					localStorage.userdata = encrypt(res.data.data);
					localStorage.token = res.data.token;

					setErrorMessageLogin({
						type: "success",
						message: "Successfully updated",
					});

					setTimeout(() => {
						window.location.reload();
					}, 1000);
				} else {
					setErrorMessageLogin({
						type: "error",
						message: "This email already verified!",
					});
				}
				setIsLoadingChangePass(false);
			});
	};

	return (
		<Layout className="public-layout login-layout">
			<Layout.Content>
				<Row>
					<Col span={24}>
						<Image
							className="zoom-in-out-box"
							onClick={() => history.push("/")}
							src={fullwidthlogo}
							preview={false}
						/>

						<div className="register-sub-title">
							Educating Cancer CareGivers for their wellbeing & improved patient
							outcomes
						</div>

						<Card>
							<Form
								layout="vertical"
								name="new-password-form"
								className="new-password-form"
								onFinish={onFinishLogin}
								form={form}
								autoComplete="off"
							>
								<Typography.Title
									level={3}
									className="text-center text-create-user-account"
								>
									Create a New Password
									<br />
									<small>
										Your password must be at least 8 characters long and contain
										at least one number and one character.
									</small>
								</Typography.Title>
								<Form.Item
									name="new_password"
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
									name="new_password_confirm"
									rules={[
										{
											required: true,
											message: "This field field is required.",
										},
										({ getFieldValue }) => ({
											validator(_, value) {
												if (!value || getFieldValue("new_password") === value) {
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
								>
									<FloatInputPasswordStrength
										label="Confirm Password"
										placeholder="Confirm Password"
									/>
								</Form.Item>

								<Button
									type="primary"
									htmlType="submit"
									loading={isLoadingChangePass}
									className="btn-primary-default m-t-sm"
									block
									size="large"
								>
									Submit
								</Button>

								{errorMessageLogin.message && (
									<Alert
										className="m-t-sm"
										type={errorMessageLogin.type}
										message={errorMessageLogin.message}
									/>
								)}
							</Form>
						</Card>

						<footer>
							© Copyright {moment().format("YYYY")} {description}. All Rights
							Reserved.
						</footer>
					</Col>
				</Row>
			</Layout.Content>
		</Layout>
	);
}
