import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
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
import moment from "moment";
import axios from "axios";
import {
	apiUrl,
	description,
	encrypt,
	fullwidthlogo,
} from "../../../providers/companyInfo";
import ComponentHeader from "../Components/ComponentHeader";

import { faEdit } from "@fortawesome/pro-regular-svg-icons";
import FloatInputPasswordStrength from "../../../providers/FloatInputPasswordStrength";

export default function PageRegistrationSetPassword(props) {
	let token = props.match.params.token;
	let history = useHistory();

	let stepData = localStorage.bfssRegStepData
		? JSON.parse(localStorage.bfssRegStepData)
		: null;

	const [errorMessagePassword, setErrorMessagePassword] = useState({
		type: "success",
		message: "",
		already_verified: false,
	});

	useEffect(() => {
		if (token) {
			axios
				.post(
					`${apiUrl}api/v1/set_password`,
					{},
					{
						headers: {
							Authorization: "Bearer " + token,
						},
					}
				)
				.then((res) => {
					// console.log("success", res);
					setErrorMessagePassword({
						type: "error",
						message: res.data.message,
						already_verified: res.data.already_verified,
					});
				})
				.catch((err) => {
					if (err.response.status === 401) {
						history.push("/error-500");
					}
				});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [token]);

	const onFinishPassword = (values) => {
		// console.log("apiUrl", apiUrl);
		let data = { ...values };
		axios
			.post(`${apiUrl}api/v1/set_password`, data, {
				headers: {
					Authorization: "Bearer " + token,
				},
			})
			.then((res) => {
				// console.log("res.data", res);
				if (res.data.success) {
					localStorage.userdata = encrypt(res.data.authUser.data);
					localStorage.token = res.data.authUser.token;

					setErrorMessagePassword({
						type: "success",
						message: "Set password successfully.",
					});

					setTimeout(() => {
						window.location.reload();
					}, 1000);
				} else {
					setErrorMessagePassword({
						type: "error",
						message: "This email already verified!",
					});
				}
			});
	};

	return (
		<Layout className="public-layout register-layout register-layout-set-password">
			<Layout.Content>
				<Row>
					<Col xs={24} sm={24} md={24} lg={24} xl={24}>
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
							<ComponentHeader
								title="Registration"
								sub_title={
									stepData && stepData.step1.data
										? `${
												stepData.step1.data !== "Coach" ? "Athlete" : "Coach"
										  }'s`
										: "New User"
								}
								icon={faEdit}
							/>
							{errorMessagePassword.already_verified === false ? (
								<Form
									layout="vertical"
									className="form-create-password"
									onFinish={onFinishPassword}
									autoComplete="off"
								>
									<Typography.Title level={3} className="font-weight-normal">
										Set up Password
									</Typography.Title>

									<Typography.Text>
										Your password must be at least 8 characters and contain at
										least one number, one uppercase letter and one special
										character.
									</Typography.Text>

									<Form.Item
										style={{ marginTop: 10 }}
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
									>
										<FloatInputPasswordStrength
											placeholder="Password"
											label="Password"
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
										// className="m-b-sm"
									>
										<FloatInputPasswordStrength
											label="Confirm Password"
											placeholder="Confirm Password"
										/>
									</Form.Item>

									<Button
										type="primary"
										htmlType="submit"
										className="btn-main m-t-sm"
										block
										size="large"
									>
										SUBMIT
									</Button>

									{errorMessagePassword.message && (
										<>
											<Alert
												className="m-t-sm"
												type={errorMessagePassword.type}
												message={errorMessagePassword.message}
											/>
										</>
									)}
								</Form>
							) : (
								<Alert
									className="m-t-sm"
									type={errorMessagePassword.type}
									message={errorMessagePassword.message}
								/>
							)}
						</Card>
					</Col>
				</Row>
			</Layout.Content>
			<Layout.Footer className="text-center">
				<Typography.Text>
					© Copyright {moment().format("YYYY")} {description}. All Rights
					Reserved..
				</Typography.Text>
			</Layout.Footer>
		</Layout>
	);
}
