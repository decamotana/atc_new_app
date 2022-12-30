import React, { useState } from "react";
import {
	Layout,
	Card,
	Form,
	Button,
	Row,
	Col,
	Image,
	Divider,
	Typography,
	Alert,
} from "antd";
import { Link, useHistory } from "react-router-dom";
import moment from "moment";
import $ from "jquery";
import {
	fullwidthlogo,
	description,
	encrypt,
} from "../../../providers/companyInfo";
import { POST } from "../../../providers/useAxiosQuery";
import FloatInput from "../../../providers/FloatInput";
import FloatInputPassword from "../../../providers/FloatInputPassword";
import FloatInputMask from "../../../providers/FloatInputMask";

export default function PageLoginMaintenance() {
	let history = useHistory();
	const [form] = Form.useForm();
	const [formPassword] = Form.useForm();
	const [errorMessageLogin, setErrorMessageLogin] = useState({
		type: "success",
		message: "",
	});
	const [errorMessageForgot, setErrorMessageForgot] = useState({
		type: "success",
		message: "",
	});

	const { mutate: mutateLogin, isLoading: isLoadingButtonLogin } = POST(
		"api/v1/login",
		"login"
	);

	const { mutate: mutateForgot, isLoading: isLoadingForgot } = POST(
		"api/v1/forgot_password",
		"forgot_password"
	);

	const { mutate: mutateVerify2fa, isLoading: isLoadingverify2fa } = POST(
		"api/v1/verify2fa",
		`verify2fa`
	);

	const [uId, setUId] = useState(0);
	const [isGGAuth, setIsGGAuth] = useState(false);

	const [errMessage2fa, setErrMessage2fa] = useState({
		type: "",
		message: "",
	});

	const onFinishLogin = (values) => {
		mutateLogin(values, {
			onSuccess: (res) => {
				// console.log("res", res);
				if (res.data) {
					if (res.data && res.data.google2fa_enable === 1) {
						setUId(res.data.id);
						setIsGGAuth(true);
					} else {
						localStorage.userdata = encrypt(res.data);
						localStorage.token = res.token;
						window.location.reload();
					}
				} else {
					setErrorMessageLogin({
						type: "error",
						message: res.message,
					});
				}
			},
			onError: (err) => {
				setErrorMessageLogin({
					type: "error",
					message: (
						<>
							Unrecognized username or password. <b>Forgot your password?</b>
						</>
					),
				});
			},
		});
	};

	const onFinishForgotPassword = (values) => {
		// console.log("onFinishForgotPassword", values);

		let data = {
			...values,
			link_origin: window.location.origin,
		};
		mutateForgot(data, {
			onSuccess: (res) => {
				if (res.success) {
					setErrorMessageForgot({
						type: "success",
						message:
							"An e-mail has been sent, please check your inbox or your spam folder.",
					});
				}
			},
			onError: (err) => {
				setErrorMessageForgot({
					type: "error",
					message: "Unrecognized email.",
				});
			},
		});
	};

	const onFinishVerifyCode = (values) => {
		// console.log("onFinishVerifyCode", values);

		var code = values.code.replace(/-/g, "");

		mutateVerify2fa(
			{ code: code, id: uId },
			{
				onSuccess: (res) => {
					if (res.data) {
						localStorage.userdata = encrypt(res.data);
						localStorage.token = res.token;
						window.location.reload();
					} else {
						setErrMessage2fa({
							type: "error",
							message: "Invalid Authenticator Code, Please try again",
						});
					}
				},
				onError: (err) => {
					console.log(err);
				},
			}
		);
	};

	const hadleShowPassword = () => {
		$("#login-form-forget").slideToggle();
	};

	return (
		<Layout className="public-layout login-layout">
			<Layout.Content>
				<Row>
					<Col xs={24} sm={24} md={24}>
						<Image
							className="zoom-in-out-box"
							src={fullwidthlogo}
							preview={false}
						/>

						<div className="login-sub-title">
							Educating Cancer CareGivers for their wellbeing & improved patient
							outcomes
						</div>

						<Card>
							{!isGGAuth ? (
								<>
									<Form
										layout="vertical"
										className="login-form"
										onFinish={onFinishLogin}
										form={form}
										autoComplete="off"
									>
										<Typography.Title
											level={3}
											className="text-center text-create-account"
										>
											Create an Account
										</Typography.Title>

										<Button
											type="primary"
											size="large"
											className="btn-main btn-register-here"
											onClick={() => history.push("/register")}
											block
										>
											REGISTER HERE
										</Button>

										<Divider />

										<Typography.Title
											level={3}
											className="text-center text-sign-in-here"
										>
											Already Have an Account? Sign in Here
										</Typography.Title>
										<Form.Item
											name="email"
											rules={[
												{
													required: true,
													message: "This field is required.",
												},
											]}
											hasFeedback
										>
											<FloatInput
												label="Username / E-mail"
												placeholder="Username / E-mail"
											/>
										</Form.Item>
										<Form.Item
											name="password"
											rules={[
												{
													required: true,
													message: "This field is required.",
												},
											]}
											hasFeedback
										>
											<FloatInputPassword
												label="Password"
												placeholder="Password"
											/>
										</Form.Item>

										<div>
											<Typography.Text>
												This page is protected by reCAPTCHA, and subject to the
												Google{" "}
												<Typography.Link
													href="https://policies.google.com/privacy?hl=en"
													className="color-1"
													target="new"
													style={{ fontWeight: "500" }}
												>
													Privacy Policy
												</Typography.Link>{" "}
												and{" "}
												<Typography.Link
													href="https://policies.google.com/terms?hl=en"
													className="color-1"
													target="new"
													style={{ fontWeight: "500" }}
												>
													Terms of Services.
												</Typography.Link>
											</Typography.Text>
										</div>

										<Button
											type="primary"
											htmlType="submit"
											loading={isLoadingButtonLogin}
											className="btn-main m-t-sm btn-sign-in"
											block
											size="large"
										>
											SIGN IN
										</Button>

										{errorMessageLogin.message && (
											<Alert
												className="m-t-sm"
												type={errorMessageLogin.type}
												message={errorMessageLogin.message}
											/>
										)}

										<div className="forgot">
											<Link
												type="link"
												className="login-form-button color-1"
												size="small"
												to="#"
												onClick={hadleShowPassword}
											>
												Forgot Password ?
											</Link>
										</div>
									</Form>

									<Form
										name="basic"
										layout="vertical"
										id="login-form-forget"
										className="login-form m-t-sm"
										style={{ display: "none" }}
										onFinish={onFinishForgotPassword}
										form={formPassword}
										autoComplete="off"
									>
										<Form.Item
											name="email"
											rules={[
												{
													required: true,
													message: "This field is required.",
												},
												{ type: "email", message: "Invalid email." },
											]}
											hasFeedback
										>
											<FloatInput
												label="Enter your e-mail"
												placeholder="Enter your e-mail"
											/>
										</Form.Item>

										<Button
											type="primary"
											htmlType="submit"
											className="btn-main"
											block
											size="large"
											loading={isLoadingForgot}
										>
											SUBMIT
										</Button>

										{errorMessageForgot.message && (
											<Alert
												className="m-t-sm"
												type={errorMessageForgot.type}
												message={errorMessageForgot.message}
											/>
										)}
									</Form>
								</>
							) : (
								<Form
									layout="vertical"
									className="login-form"
									// style={{
									//   marginTop: "-50px",
									// }}
									onFinish={onFinishVerifyCode}
									autoComplete="off"
								>
									<div style={{ textAlign: "center" }}>
										{" "}
										<h3>Two-Factor Authentication Required</h3>
										<p>Enter Authenticator Code </p>
									</div>

									<Form.Item
										name="code"
										rules={[
											{
												required: true,
												message: "Required",
											},
										]}
										hasFeedback
									>
										<FloatInputMask
											label="Authenticator Code"
											placeholder="Authenticator Code"
											maskLabel="code"
											maskType="999-999"
										/>
									</Form.Item>

									<Button
										type="primary"
										className="btn-main m-t-sm"
										block
										size="large"
										htmlType="submit"
										loading={isLoadingverify2fa}
									>
										SUBMIT
									</Button>

									{errMessage2fa.message && (
										<Alert
											className="m-t-sm"
											type={errMessage2fa.type}
											message={errMessage2fa.message}
										/>
									)}
								</Form>
							)}
						</Card>
					</Col>
				</Row>
			</Layout.Content>
			<Layout.Footer className="text-center m-t-lg">
				<Typography.Text>
					© Copyright {moment().format("YYYY")} {description}. All Rights
					Reserved.
				</Typography.Text>
			</Layout.Footer>
		</Layout>
	);
}
