import {
	Alert,
	Button,
	Card,
	Col,
	Collapse,
	Form,
	Modal,
	notification,
	Row,
} from "antd";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { userData } from "../../../providers/companyInfo";
import FloatInputMask from "../../../providers/FloatInputMask";
import FloatInputPassword from "../../../providers/FloatInputPassword";
import { GET, POST } from "../../../providers/useAxiosQuery";

const validator = {
	require: {
		required: true,
		message: "Required",
	},
	require_false: {
		required: false,
		message: "Required",
	},
	email: {
		type: "email",
		message: "please enter a valid email",
	},
};

export default function Page2fa() {
	const history = useHistory();
	const [toggleModalPassword, setToggleModalPassword] = useState(true);
	const [authenticated, setAuthenticated] = useState(true);
	const [isEnable2fa, setEnable2fa] = useState(false);
	const [showQr, setShowQr] = useState(false);
	const [keyData, setKeyData] = useState("");
	const [qrImage, setQrImage] = useState("");

	GET(`api/v1/get_by_id?id=${userData().id}`, "get_by_id", (res) => {
		if (res.success) {
			// console.log("get_by_id res", res);
			setEnable2fa(res.data?.google2fa_enable === 1 ? true : false);
		}
	});

	const { mutate: mutateVerifyPassword, isLoading: isLoadingVerifyPassword } =
		POST("api/v1/verifypassword", `verifypassword`);

	const { mutate: mutateGenerateKey, isLoading: isLoadingGenerateKey } = POST(
		"api/v1/generate2faSecret",
		`generate_2fakey`
	);

	const { mutate: mutateEnable2fa, isLoading: isLoadingEnable2fa } = POST(
		"api/v1/enable2fa",
		`enable2fa`
	);

	const { mutate: mutateDisable2fa, isLoading: isLoadingDisable2fa } = POST(
		"api/v1/disable2fa",
		`disable2fa`
	);

	const onFinishPasswordVerify = (values) => {
		console.log("onFinishPasswordVerify", values);
		let data = { password: values.password, user_id: userData().id };
		mutateVerifyPassword(data, {
			onSuccess: (res) => {
				console.log("mutateVerifyPassword res", res);
				if (res.success) {
					notification.success({
						message: "Verify Password",
						description: res.message,
					});

					setToggleModalPassword(false);
					setAuthenticated(true);
				} else {
					notification.error({
						message: "Verify Password",
						description: "Incorrect Password, Please try again",
					});
				}
			},
			onError: (err) => {
				// console.log(err);
				notification.error({
					message: "Verify Password",
					description: err.response.data.message,
				});
			},
		});
	};

	const handleGenerateKey = () => {
		// console.log(data);
		mutateGenerateKey(
			{},
			{
				onSuccess: (res) => {
					if (res.success) {
						console.log("mutateGenerateKey res", res);
						setShowQr(true);
						setQrImage(res.google_url);
						setKeyData(res.data);
					}
				},
				onError: (err) => {
					console.log(err);
					notification.error({
						message: "Error",
						description: err.response.data.message,
					});
				},
			}
		);
	};

	const onFinish = (values) => {
		let code = values.code.replace(/-/g, "");
		let data = { code: code };

		mutateEnable2fa(data, {
			onSuccess: (res) => {
				if (res.success) {
					notification.success({
						message: "2FA",
						description: "2FA Enabled Successfully",
					});
					setEnable2fa(true);
				} else {
					notification.error({
						message: "2FA",
						description: "Invalid Authenticator Code, Please try again",
					});
				}
			},
			onError: (err) => {
				console.log(err);
				notification.error({
					message: "Error",
					description: err.response.data.message,
				});
			},
		});
	};

	const handleDisable = () => {
		mutateDisable2fa(
			{},
			{
				onSuccess: (res) => {
					if (res.success) {
						notification.success({
							message: "Success",
							description: "2FA Disabled Successfully",
						});
						setEnable2fa(false);
					}
				},
				onError: (err) => {
					notification.error({
						message: "Error",
						description: err.response.data.message,
					});
				},
			}
		);
	};

	return (
		<Card id="Page2fa">
			{authenticated ? (
				<Row gutter={4}>
					<Col xs={24} sm={24} md={24}>
						{!isEnable2fa && (
							<Collapse
								className="main-1-collapse"
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
								defaultActiveKey={["1"]}
							>
								<Collapse.Panel
									header="Two factor authentication (2FA)"
									key="1"
									className="accordion bg-darkgray-form"
								>
									<p>
										Two Factor Authentication (2FA) strengthens access security
										by requiring two methods (also referred to as factors) to
										verify your identity. Two factor authentication protects
										against phishing, social engineering and password brute
										force attacks and secures your logins from attackers
										exploiting weak or stolen credentials.
									</p>
									{!showQr ? (
										<Button
											size="large"
											className="btn-main"
											style={{
												marginTop: "20px",
												marginRight: 10,
											}}
											loading={isLoadingGenerateKey}
											onClick={handleGenerateKey}
										>
											Setup Google Authenticator
										</Button>
									) : (
										<>
											<div>
												<b>
													{" "}
													1. Scan this QR code with your Google Authenticator
													App{" "}
												</b>
												<br />
												<div>
													<div dangerouslySetInnerHTML={{ __html: qrImage }} />
													<b> or you can use the code: </b>
													<code className="c-lightorange">{keyData}</code>
												</div>
											</div>
											<br></br>
											<br></br>
											<div>
												<b>2. Enter the Code from Google Authenticator App</b>
												<Form
													name="basic"
													layout="vertical"
													className="login-form"
													onFinish={onFinish}
												>
													<br></br>
													<Form.Item
														name="code"
														rules={[validator.require]}
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
														htmlType="submit"
														loading={isLoadingEnable2fa}
														size="large"
														className="btn-main"
													>
														Enable 2FA
													</Button>
												</Form>
											</div>
										</>
									)}
								</Collapse.Panel>
							</Collapse>
						)}

						{isEnable2fa && (
							<Collapse
								className="main-1-collapse"
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
								defaultActiveKey={["1"]}
							>
								<Collapse.Panel
									header={`Two factor authentication (2FA)`}
									key="1"
									className="accordion bg-darkgray-form"
								>
									<p>
										Two Factor Authentication (2FA) strengthens access security
										by requiring two methods (also referred to as factors) to
										verify your identity. Two factor authentication protects
										against phishing, social engineering and password brute
										force attacks and secures your logins from attackers
										exploiting weak or stolen credentials.
									</p>

									<Alert
										message="2FA is currenlty enabled on your account"
										type="success"
										showIcon
									/>
									<Button
										size="large"
										className="btn-main"
										style={{
											marginTop: "20px",
											marginRight: 10,
										}}
										loading={isLoadingDisable2fa}
										onClick={handleDisable}
									>
										Disable 2FA
									</Button>
								</Collapse.Panel>
							</Collapse>
						)}
					</Col>
				</Row>
			) : null}

			<Modal
				title="Please enter your password to continue"
				open={toggleModalPassword}
				// onOk={showModal}
				className="modal-primary-default modal-change-2-factor-authentication"
				onCancel={() => {
					history.goBack();
				}}
				footer={null}
				style={{ top: 20 }}
			>
				<Form onFinish={onFinishPasswordVerify}>
					<p>
						The page you are trying to visit requires that you re-enter your
						password.
					</p>
					<Row gutter={16}>
						<Col xs={24} sm={24} md={24} lg={24}>
							<Form.Item
								name="password"
								rules={[validator.require]}
								hasFeedback
							>
								<FloatInputPassword
									label="Current Password"
									placeholder="Current Password"
									className="remove-double-border"
								/>
							</Form.Item>
						</Col>
					</Row>

					<Row gutter={24} justify="end">
						<Col className="gutter-row" xs={24} sm={24} md={12} lg={12}>
							<Button
								size="large"
								htmlType="submit"
								className="btn-main"
								style={{ width: "100%", marginTop: "10px" }}
								loading={isLoadingVerifyPassword}
							>
								Verify
							</Button>
						</Col>
					</Row>
				</Form>
			</Modal>
		</Card>
	);
}
