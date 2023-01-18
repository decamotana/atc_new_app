import React, { useEffect, useState } from "react";
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
	Collapse,
	Checkbox,
	Alert,
	Radio,
} from "antd";
import { MinusSquareOutlined, PlusSquareOutlined } from "@ant-design/icons";
import moment from "moment";
import { description, fullwidthlogo } from "../../../providers/companyInfo";
import { GET, POSTMANUAL, POST } from "../../../providers/useAxiosQuery";
import FloatInput from "../../../providers/FloatInput";
import FloatSelect from "../../../providers/FloatSelect";
import FloatSelectWithDangerouslySetInnerHTML from "../../../providers/FloatSelectWithDangerouslySetInnerHTML";
import FloatInputMask from "../../../providers/FloatInputMask";
import ComponentHeader from "../Components/ComponentHeader";
import optionCountryCodes from "../../../providers/optionCountryCodes";

import optionStateCodesUnitedState from "../../../providers/optionStateCodesUnitedState";
import optionStateCodesCanada from "../../../providers/optionStateCodesCanada";

import ReCAPTCHA from "react-google-recaptcha";

import { faEdit } from "@fortawesome/pro-regular-svg-icons";
import $ from "jquery";

export default function PageRegister({ match }) {
	let tokenReferred =
		match.params && match.params.token
			? "Bearer " + match.params.token
			: process.env.REACT_APP_API_KEY;

	const [form] = Form.useForm();
	const [formProgram] = Form.useForm();

	const history = useHistory();
	const [collapseActiveKey, setCollapseActiveKey] = useState("1");
	const [programPlans, setProgramPlans] = useState([]);
	const [selectedProgramType, setSelectedProgramType] = useState();

	const [formData, setFormData] = useState([
		{
			step: "process",
			data: null,
		},
		{
			step: "wait",
			data: null,
		},
		{
			step: "wait",
			data: null,
		},
	]);

	const stateUS = optionStateCodesUnitedState();
	const stateCA = optionStateCodesCanada();

	const [optionState, setOptionState] = useState([]);
	const [stateLabel, setStateLabel] = useState("State");
	const [optionZip, setOptionZip] = useState();
	const [zipLabel, setZipLabel] = useState("Zip Code");

	const [optionBillingState, setOptionBillingState] = useState([]);
	const [optionBillingZip, setOptionBillingZip] = useState();
	const [billingStateLabel, setBillingStateLabel] = useState("State");
	const [billingZipLabel, setBillingZipLabel] = useState("Zip Code");

	const [expError, setExpError] = useState(false);
	const [cardError, setCardError] = useState(false);

	const [captchaToken, setCaptchaToken] = useState({
		token: "",
		error: "",
	});

	const [completePurchaseErr, setCompletePurchaseErr] = useState({
		type: "",
		message: "",
	});

	GET("api/v1/acc_plan", "acc_plan", (res) => {
		if (res.success) {
			let data = [];

			res.data.map((item, index) => {
				data.push({
					value: item.id,
					label: item.description,
					policy:
						item.account_type.privacy &&
						item.account_type.privacy.privacy_policy,
					amount: item.amount,
					account_type_id: item.account_type_id,
				});
				return "";
			});
			setProgramPlans(data);
			// console.log("acc_type data", data);
		}
	});

	const { mutate: mutateRegister, isLoading: isLoadingRegister } = POSTMANUAL(
		tokenReferred,
		"api/v1/register",
		"register"
	);

	const handleCountry = (e, opt) => {
		if (e === "United States") {
			setOptionState(stateUS);
			setStateLabel("State");
			setOptionZip(/(^\d{5}$)|(^\d{5}-\d{4}$)/);
			setZipLabel("Zip Code");
		} else if (e === "Canada") {
			setOptionState(stateCA);
			setStateLabel("County");
			setOptionZip(/^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/);
			setZipLabel("Postal Code");
		} else {
			setOptionState(stateUS);
			setStateLabel("State");
			setOptionZip(/(^\d{5}$)|(^\d{5}-\d{4}$)/);
			setZipLabel("Zip Code");
		}

		form.resetFields(["state", "zip"]);
	};

	const handleChangeBillingCountry = (e, opt) => {
		// console.log("e, opt", e, opt);
		if (e === "United States") {
			setOptionBillingState(stateUS);
			setOptionBillingZip(/(^\d{5}$)|(^\d{5}-\d{4}$)/);
			setBillingStateLabel("State");
			setBillingZipLabel("Zip Code");
		} else if (e === "Canada") {
			setOptionBillingState(stateCA);
			setOptionBillingZip(/^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/);
			setBillingStateLabel("County");
			setBillingZipLabel("Postal Code");
		} else {
			setOptionBillingState(stateUS);
			setOptionBillingZip(/(^\d{5}$)|(^\d{5}-\d{4}$)/);
			setBillingStateLabel("State");
			setBillingZipLabel("Zip Code");
		}

		// form4.resetFields(["billing_state"]);
	};

	const onFinishInfomation = (values) => {
		let formDataTemp = formData;
		formDataTemp[0] = {
			step: "done",
			data: values,
		};
		formDataTemp[1] = {
			...formDataTemp[1],
			step: "process",
		};
		setFormData(formDataTemp);
		setCollapseActiveKey("2");
		setCompletePurchaseErr({
			type: "",
			message: "",
		});
	};
	const [couponError, setCouponError] = useState(false);
	const [couponLoading, setCouponLoading] = useState(false);
	const [typeCoupon, setTypeCoupon] = useState("");
	const [couponOff, setCouponOff] = useState(0);
	const [discountTotal, setDiscountTotal] = useState(0);

	const { mutate: mutateApplyCoupon } = POST(
		"api/v1/apply_coupon_stripe_system",
		"apply_coupon_stripe_system"
	);
	const handleApplyCoupon = () => {
		var a = selectedProgramType.coupon;
		var amount = parseFloat(selectedProgramType.amount);
		console.log("coupon", selectedProgramType);
		setCouponLoading(true);
		if (a) {
			mutateApplyCoupon(
				{ code: a, account_type_id: selectedProgramType.account_type_id },
				{
					onSuccess: (res) => {
						// console.log("coupon_res ", res);

						if (res.success) {
							if (res.data) {
								if (parseInt(res.data.max) > parseInt(res.data.redemption)) {
									if (res.data.type === "fixed") {
										setCouponError(true);
										setTypeCoupon("fixed");
										setCouponOff(res.data.off);
										setDiscountTotal(amount - res.data.off);
									}
									if (res.data.type === "percent") {
										setCouponError(true);
										setTypeCoupon("percent");
										setCouponOff(res.data.off);

										var percentage = res.data.off / 100;
										setDiscountTotal(amount - amount * percentage);
									}
									setCompletePurchaseErr({
										type: "",
										message: "",
									});
								} else {
									setCompletePurchaseErr({
										type: "error",
										message: "Coupon usage limit has been reached",
									});
									setCouponError(false);
								}
							}
						} else {
							setCompletePurchaseErr({
								type: "error",
								message: "No Such Coupon " + a,
							});
							setCouponError(false);
						}
						setCouponLoading(false);
					},
					onError: (err) => {
						setCompletePurchaseErr({
							type: "error",
							message: err.response.data.message,
						});
						setCouponError(false);
						setCouponLoading(false);
					},
				}
			);
		} else {
			setCouponError(false);
		}
	};

	const handleProceedToCheckout = () => {
		let formProgramTemp = formProgram.getFieldsValue().is_patient;
		console.log("formProgramTemp", formProgramTemp);
		if (formProgramTemp) {
			let formDataTemp = formData;
			formDataTemp[1] = {
				step: "done",
				data: selectedProgramType,
			};
			formDataTemp[2] = {
				...formDataTemp[2],
				step: "process",
			};
			setFormData(formDataTemp);
			setCollapseActiveKey("3");
		} else {
			formProgram.submit();
		}
	};

	const [checkboxYes, setCheckboxYes] = useState(true);
	const handleScroll = (e) => {
		let element = e.target;

		console.log("element", element);
		console.log("element.scrollHeight", element.scrollHeight);
		console.log("element.scrollTop", element.scrollTop);
		console.log("element.clientHeight", element.clientHeight + 10);

		if (element.scrollHeight - element.scrollTop <= element.clientHeight + 10) {
			setCheckboxYes(false);
			console.log("handleScroll", false);
		} else {
			setCheckboxYes(true);
			console.log("handleScroll", true);
		}
	};

	const [checkboxYesStatus, setCheckboxYesStatus] = useState(false);
	const onChangeCheckbox = (e) => {
		// console.log("e.target.checked", e.target.checked);
		setCheckboxYesStatus(e.target.checked);
	};

	const onFinishCompletePurchase = (values) => {
		let data = {
			...formData[0].data,
			...formData[1].data,
			account_type_id: formData[1].data.value,
			...values,
			coupon_status: couponError,
			discountTotal: discountTotal,
			link_origin: window.location.origin,
			is_patient: formProgram.getFieldsValue().is_patient,
		};

		console.log("formData", formData);
		console.log("values", values);
		console.log("data", data);

		mutateRegister(data, {
			onSuccess: (res) => {
				if (res.success) {
					setCompletePurchaseErr({
						type: "success",
						message:
							"A confirmation e-mail has been send please check your inbox or your spam folder for the next step.",
					});
				} else {
					setCompletePurchaseErr({
						type: "error",
						message: res.message,
					});
				}
				setCardError(false);
				setExpError(false);
			},
			onError: (err) => {
				setCompletePurchaseErr({
					type: "error",
					message: err.response.data.message,
				});

				if (
					err.response.data.message ===
					"Your card's expiration year is invalid."
				) {
					setExpError(true);
					setCardError(false);
				}
				if (
					err.response.data.message === "Your card number is incorrect." ||
					err.response.data.message ===
						"The card number is not a valid credit card number."
				) {
					setCardError(true);
					setExpError(false);
				}
			},
		});
	};

	const [width, setWidth] = useState($(window).width());

	useEffect(() => {
		function handleResize() {
			setWidth(500);
		}
		window.addEventListener("resize", handleResize);

		return () => {};
	}, []);

	return (
		<Layout className="public-layout register-layout">
			<Layout.Content>
				<Row>
					<Col xs={24} sm={24} md={24}>
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
								subtitle="New User"
								icon={faEdit}
							/>

							<Collapse
								accordion
								expandIconPosition="end"
								activeKey={collapseActiveKey}
								onChange={(e) => setCollapseActiveKey(e)}
								expandIcon={({ isActive }) =>
									isActive ? <MinusSquareOutlined /> : <PlusSquareOutlined />
								}
							>
								<Collapse.Panel
									header={
										<>
											<div className="title">Step 1</div>
											<div className="sub-title">Complete All Fields Below</div>
										</>
									}
									key="1"
								>
									<Form
										layout="vertical"
										autoComplete="off"
										onFinish={onFinishInfomation}
										form={form}
									>
										<Typography.Text className="form-title">
											User's Information
										</Typography.Text>
										<Form.Item
											name="firstname"
											className="m-t-sm"
											hasFeedback
											rules={[
												{
													required: true,
													message: "This field is required.",
												},
											]}
										>
											<FloatInput label="First Name" placeholder="First Name" />
										</Form.Item>

										<Form.Item
											name="lastname"
											hasFeedback
											rules={[
												{
													required: true,
													message: "This field is required.",
												},
											]}
										>
											<FloatInput label="Last Name" placeholder="Last Name" />
										</Form.Item>

										<Form.Item
											name="username"
											hasFeedback
											rules={[
												{
													required: true,
													message: "This field is required.",
												},
											]}
										>
											<FloatInput
												label="Create Username"
												placeholder="Create Username"
											/>
										</Form.Item>

										<Form.Item
											name="email"
											hasFeedback
											rules={[
												{
													type: "email",
													message: "The input is not valid email!",
												},
												{
													required: true,
													message: "Please input your email!",
												},
											]}
										>
											<FloatInput label="Email" placeholder="Email" />
										</Form.Item>

										<Form.Item
											name="confirm_email"
											hasFeedback
											rules={[
												{
													required: true,
													message: "This field is required.",
												},
												({ getFieldValue }) => ({
													validator(_, value) {
														if (!value || getFieldValue("email") === value) {
															return Promise.resolve();
														}
														return Promise.reject(
															new Error(
																"The two emails that you entered do not match!"
															)
														);
													},
												}),
											]}
										>
											<FloatInput
												label="Confirm Email"
												placeholder="Confirm Email"
											/>
										</Form.Item>

										<Form.Item
											name="country"
											hasFeedback
											className="form-select-error"
											rules={[
												{
													required: true,
													message: "This field is required.",
												},
											]}
										>
											<FloatSelect
												label="Country"
												placeholder="Country"
												options={optionCountryCodes}
												onChange={handleCountry}
											/>
										</Form.Item>

										<Form.Item
											name="state"
											hasFeedback
											className="form-select-error"
											rules={[
												{
													required: true,
													message: "This field is required.",
												},
											]}
										>
											<FloatSelect
												label={stateLabel}
												placeholder={stateLabel}
												options={optionState}
											/>
										</Form.Item>

										<Form.Item
											name="zip"
											hasFeedback
											className="w-100"
											rules={[
												{
													required: true,
													message: "This field is required.",
												},
												{
													pattern: optionZip,
													message: "Invalid Zip",
												},
											]}
										>
											<FloatInput label={zipLabel} placeholder={zipLabel} />
										</Form.Item>

										<Button
											type="primary"
											htmlType="submit"
											className="btn-main b-r-none"
											block
											size="large"
										>
											CONTINUE
										</Button>
									</Form>
								</Collapse.Panel>

								{formData[0].step === "done" ? (
									<Collapse.Panel
										header={
											<>
												<div className="title">Step 2</div>
												<div className="sub-title">
													Select Your Program Plan
												</div>
											</>
										}
										key="2"
									>
										<Form
											layout="vertical"
											autoComplete="off"
											form={formProgram}
										>
											<Form.Item name="program_plan" hasFeedback>
												<FloatSelectWithDangerouslySetInnerHTML
													label="Program Plan"
													placeholder="Program Plan"
													options={programPlans}
													onChange={(e) => {
														let val = programPlans.filter((x) => x.value === e);
														// console.log("val", val);
														if (val.length > 0) {
															setSelectedProgramType({
																...selectedProgramType,
																...val[0],
																account_plan_id: e,
																//   coupon_apply: 0,
																//   coupon: "",
																message: "",
															});
														}
													}}
												/>
											</Form.Item>
											<div className="div_reg_is_patient">
												<span>Are you also the patient?</span>
												<Form.Item
													name="is_patient"
													hasFeedback
													className="m-b-none"
													rules={[
														{
															required: true,
															message: "This field is required.",
														},
													]}
												>
													<Radio.Group>
														<Radio value="No">No</Radio>
														<Radio value="Yes">Yes</Radio>
													</Radio.Group>
												</Form.Item>
											</div>
										</Form>

										{selectedProgramType ? (
											<Form
												layout="vertical"
												autoComplete="off"
												onFinish={handleProceedToCheckout}
											>
												<Form.Item
													name="coupon"
													rules={[
														{
															required: false,
															message: "This field is required.",
														},
													]}
													hasFeedback
													className="m-b-none"
												>
													<FloatInput
														label="Coupon"
														placeholder="Coupon"
														onChange={(e) => {
															setSelectedProgramType({
																...selectedProgramType,
																coupon_apply: 0,
																coupon: e,
																message: "",
															});
														}}
														addonAfter={
															<Button
																style={{
																	height: "46px",
																	marginTop: "-1px",
																}}
																onClick={(e) => handleApplyCoupon(e)}
																disabled={couponLoading}
																className={couponLoading ? "bgcolor-20" : ""}
															>
																APPLY
															</Button>
														}
													/>
												</Form.Item>
												{selectedProgramType && selectedProgramType.message ? (
													selectedProgramType.message === "Invalid Code" ? (
														<>
															<Typography.Text className="color-6">
																{selectedProgramType.message}
															</Typography.Text>
															<br />
														</>
													) : (
														<>
															<Typography.Text className="color-11">
																{selectedProgramType.message}
															</Typography.Text>
															<br />
														</>
													)
												) : null}

												{couponError && (
													<>
														<div
															style={{
																color: "#23BF08",
															}}
														>
															Code Successfully applied (
															{typeCoupon === "fixed" &&
																"$" + couponOff + " off"}
															{typeCoupon === "percent" &&
																"" + couponOff + "% off"}
															{typeCoupon === "offer" &&
																"" + couponOff + " days free"}
															)
														</div>
														<br />
													</>
												)}

												{!couponError && (
													<h3
														style={{
															fontWeight: "bold",
														}}
													>
														Total: ${selectedProgramType.amount}
													</h3>
												)}

												{couponError && (
													<>
														{typeCoupon === "fixed" && (
															<>
																<h4 style={{ marginTop: "-23px" }}>
																	{" "}
																	Subtotal: $
																	{parseFloat(selectedProgramType.amount)}
																</h4>
																<h4 style={{ marginTop: "-10px" }}>
																	Discount: -${`${couponOff}`}
																</h4>
																<h3
																	style={{
																		marginTop: "-10px",
																		fontWeight: "bold",
																	}}
																>
																	Total: ${`${discountTotal.toFixed(2)}`}
																</h3>
															</>
														)}
														{typeCoupon === "percent" && (
															<>
																<h4 style={{ marginTop: "-23px" }}>
																	{" "}
																	Subtotal: $
																	{parseFloat(selectedProgramType.amount)}
																</h4>
																<h4 style={{ marginTop: "-10px" }}>
																	Discount: {`${couponOff}`}%
																</h4>
																<h3
																	style={{
																		marginTop: "-10px",
																		fontWeight: "bold",
																	}}
																>
																	Total: ${`${discountTotal.toFixed(2)}`}
																</h3>
															</>
														)}
													</>
												)}

												{!couponError && completePurchaseErr.message && (
													<Alert
														className="m-t-sm"
														type={completePurchaseErr.type}
														message={completePurchaseErr.message}
													/>
												)}

												<Button
													type="primary"
													className="btn-main b-r-none m-t-sm"
													block
													size="large"
													htmlType="submit"
												>
													PROCEED TO CHECKOUT
												</Button>
											</Form>
										) : null}
									</Collapse.Panel>
								) : null}

								{formData[1].step === "done" ? (
									<Collapse.Panel
										header={
											<>
												<div className="title">Step 3</div>
												<div className="sub-title">
													<div
														dangerouslySetInnerHTML={{
															__html:
																selectedProgramType && selectedProgramType.label
																	? selectedProgramType.label
																	: null,
														}}
													/>
												</div>
											</>
										}
										key="3"
									>
										<Typography.Title
											level={3}
											className="m-t-md font-weight-normal w-100"
										>
											Credit Card Information
										</Typography.Title>

										<Form
											layout="vertical"
											autoComplete="off"
											onFinish={onFinishCompletePurchase}
										>
											<Form.Item
												name="credit_card_name"
												hasFeedback
												className="w-100"
											>
												<FloatInput
													label="Name on Card"
													placeholder="Name on Card"
												/>
											</Form.Item>

											<Form.Item
												name="credit_card_number"
												hasFeedback
												className="w-100"
												validateStatus={cardError ? "error" : "success"}
												help={cardError ? "Your card number is incorrect" : ""}
												rules={[
													{
														required: true,
														message: "This field is required.",
													},
												]}
											>
												<FloatInputMask
													label="Card Number"
													placeholder="Card Number"
													maskLabel="credit_card_number"
													validateStatus={cardError}
													// onChange={handleChangeCreditCardNumber}
													// value={creditCardNumber}
												/>
											</Form.Item>

											<Form.Item
												name="credit_expiry"
												hasFeedback
												className="w-100"
												validateStatus={expError ? "error" : "success"}
												help={
													expError
														? "Your card's expiration year is invalid."
														: ""
												}
												rules={[
													{
														required: true,
														message: "This field is required.",
													},
												]}
											>
												<FloatInputMask
													label="Expiration"
													placeholder="Expiration"
													maskLabel="card_expiry"
													maskType="99/99"
													validateStatus={expError}
												/>
											</Form.Item>

											<Form.Item
												name="credit_cvv"
												hasFeedback
												className="w-100"
												rules={[
													{
														required: true,
														message: "This field is required.",
													},
												]}
											>
												<FloatInputMask
													label="Security Code (CVV)"
													placeholder="Security Code (CVV)"
													maskLabel="cvv"
													maskType="999"
												/>
											</Form.Item>

											<Typography.Title
												level={3}
												className="font-weight-normal w-100"
											>
												Billing Address
											</Typography.Title>

											<Form.Item
												name="billing_street_address1"
												hasFeedback
												className="w-100"
												rules={[
													{
														required: true,
														message: "This field is required.",
													},
												]}
											>
												<FloatInput
													label="Street Address"
													placeholder="Street Address"
												/>
											</Form.Item>

											<Form.Item
												name="billing_street_address2"
												hasFeedback
												className="w-100"
											>
												<FloatInput
													label="Street Address 2"
													placeholder="Street Address 2"
												/>
											</Form.Item>

											<Form.Item
												name="billing_country"
												hasFeedback
												className="form-select-error w-100"
												rules={[
													{
														required: true,
														message: "This field is required.",
													},
												]}
											>
												<FloatSelect
													label="Country"
													placeholder="Country"
													options={optionCountryCodes}
													onChange={handleChangeBillingCountry}
												/>
											</Form.Item>

											<Form.Item
												name="billing_state"
												hasFeedback
												className="form-select-error w-100"
												rules={[
													{
														required: true,
														message: "This field is required.",
													},
												]}
											>
												<FloatSelect
													label={billingStateLabel}
													placeholder={billingStateLabel}
													options={optionBillingState}
												/>
											</Form.Item>

											<Form.Item
												name="billing_city"
												hasFeedback
												className="w-100"
												rules={[
													{
														required: true,
														message: "This field is required.",
													},
												]}
											>
												<FloatInput label="City" placeholder="City" />
											</Form.Item>

											<Form.Item
												name="billing_zip"
												hasFeedback
												className="w-100"
												rules={[
													{
														required: true,
														message: "This field is required.",
													},
													{
														pattern: optionBillingZip,
														message: "Invalid Zip",
													},
												]}
											>
												<FloatInput
													label={billingZipLabel}
													placeholder={billingZipLabel}
												/>
											</Form.Item>
											<br />
											<h1 style={{ fontWeight: "normal " }}>
												Privacy Policy & Terms and Conditions
											</h1>
											<div style={{ marginTop: -9 }} className="c-danger">
												<b>Please read / scroll to the end to continue.</b>
											</div>
											<div
												onScroll={handleScroll}
												className="scrollbar-2"
												style={{
													marginBottom: 10,
													marginTop: 10,
													height: 170,
													resize: "vertical",
													padding: "5px",
													overflow: "auto",
													border: "1px solid #58585a",
												}}
												dangerouslySetInnerHTML={{
													__html:
														selectedProgramType && selectedProgramType.policy,
												}}
											></div>

											<Checkbox
												onChange={onChangeCheckbox}
												name="checkbox_2"
												className="checkbox_yes"
												disabled={checkboxYes}
											>
												Yes, I have read the Privacy Policy and Terms and
												Conditions
											</Checkbox>

											<ReCAPTCHA
												size={width <= 320 ? "compact" : "normal"}
												style={{ marginTop: 10 }}
												onChange={(token) =>
													setCaptchaToken({ ...captchaToken, token })
												}
												className="captcha-registration"
												render="explicit"
												sitekey={`${process.env.REACT_APP_RECAPTCHA_API_KEY}`}
											/>

											{captchaToken.error && (
												<span
													style={{
														color: "#dc3545",
													}}
												>
													Please Verify Captcha
												</span>
											)}

											<Button
												type="primary"
												htmlType="submit"
												loading={isLoadingRegister}
												className="btn-main m-t-sm btn-complete-purchase"
												block
												size="large"
												disabled={
													checkboxYes ? true : checkboxYesStatus ? false : true
												}
											>
												COMPLETE PURCHASE
											</Button>
											{completePurchaseErr.message && (
												<Alert
													className="m-t-sm"
													type={completePurchaseErr.type}
													message={completePurchaseErr.message}
												/>
											)}
										</Form>
									</Collapse.Panel>
								) : null}
							</Collapse>

							<div>
								<Typography.Text>
									This page is protected by reCAPTCHA, and subject to the Google{" "}
									<Typography.Link
										href="https://policies.google.com/privacy?hl=en"
										className="color-1"
										target="new"
									>
										Privacy Policy
									</Typography.Link>{" "}
									and{" "}
									<Typography.Link
										href="https://policies.google.com/terms?hl=en"
										className="color-1"
										target="new"
									>
										Terms of Services.
									</Typography.Link>
								</Typography.Text>
							</div>
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
