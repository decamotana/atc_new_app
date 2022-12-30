import { faPlus, faTrashAlt } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	Button,
	Card,
	Col,
	Collapse,
	Form,
	notification,
	Row,
	Typography,
	Checkbox,
} from "antd";
import { useState } from "react";
import FloatInput from "../../../../providers/FloatInput";
import FloatSelectWithDangerouslySetInnerHTML from "../../../../providers/FloatSelectWithDangerouslySetInnerHTML";
import { GET, POST } from "../../../../providers/useAxiosQuery";
import FloatInputMask from "../../../../providers/FloatInputMask";

import { userData } from "../../../../providers/companyInfo";
export default function PageNewSubscriber() {
	const [form] = Form.useForm();

	const [programPlans, setProgramPlans] = useState([]);

	GET("api/v1/acc_plan", "acc_plan", (res) => {
		if (res.success) {
			let data = [];

			res.data.map((item, index) => {
				data.push({
					value: item.id,
					label: item.plan,
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

	const {
		mutate: mutateCreateSubscriber,
		isLoading: isLoadingCreateSubscriber,
	} = POST("api/v1/invite_people", "invite_people_create");

	const onFinish = (values) => {
		console.log("onFinish values", values);
		let list = values.list;

		let amount = programPlans.filter(
			(itemFilter) => itemFilter.value === values.account_plan_id
		);

		let subscripberCount = list?.filter(
			(itemFilter) =>
				itemFilter !== "" &&
				itemFilter !== undefined &&
				itemFilter?.email !== ""
		);
		let total_amount = 0;
		if (amount.length > 0) {
			subscripberCount.map((item) => {
				if (item.coupon_info) {
					let total =
						parseFloat(amount[0].amount) -
						parseFloat(item.coupon_info.reference_code.account_plan.amount);
					total_amount += total;
				} else {
					total_amount += parseFloat(amount[0].amount);
				}
				return "";
			});
		}

		let data = {
			...values,
			link_origin: window.location.origin,
			email: userData().email,
			user_id: userData().id,
			total_amount: total_amount,
		};

		mutateCreateSubscriber(data, {
			onSuccess: (res) => {
				if (res.success) {
					notification.success({
						message: "Subscription",
						description: res.message,
					});
					form.resetFields();
					setCheckboxYesStatus(false);
				} else {
					notification.error({
						message: "Subscription",
						description: res.message,
					});
				}
			},
			onError: (err) => {
				notification.error({
					message: "Subscription",
					description: err.response.data.message,
				});
			},
		});
	};

	const [checkboxYes, setCheckboxYes] = useState(true);
	const handleScroll = (e) => {
		// console.log("values");
		let element = e.target;
		// console.log("element.scrollHeight", element.scrollHeight);
		// console.log("element.scrollTop", element.scrollTop);
		// console.log("element.clientHeight", element.clientHeight);

		if (element.scrollHeight - element.scrollTop <= element.clientHeight) {
			setCheckboxYes(false);
		} else {
			setCheckboxYes(true);
		}
	};

	const [checkboxYesStatus, setCheckboxYesStatus] = useState(false);
	const onChangeCheckbox = (e) => {
		// console.log("e.target.checked", e.target.checked);
		setCheckboxYesStatus(e.target.checked);
	};
	const [selectedProgramType, setSelectedProgramType] = useState("");

	const {
		mutate: mutateReferenceCodeInfo,
		isLoading: isLoadingReferenceCodeInfo,
	} = POST("api/v1/check_coupon", "check_coupon");

	const handleApplyCoupon = (index) => {
		let account_plan_id = form.getFieldsValue().account_plan_id;
		let list = form.getFieldsValue().list;
		let listFilter = list.filter((f) => f.coupon === list[index].coupon);

		let error = false;

		if (!account_plan_id) {
			error = true;
			notification.error({
				message: "Coupon",
				description: "Please select account plan",
			});
		}

		if (listFilter.length === 0) {
			error = true;
			notification.error({
				message: "Coupon",
				description: "Coupon already in use",
			});
		}

		let listindex = list[index];
		if (!listindex.coupon) {
			error = true;
			notification.error({
				message: "Coupon",
				description: "Coupon required",
			});
		}

		if (error === false) {
			let data = { coupon: listindex.coupon, account_plan_id };

			mutateReferenceCodeInfo(data, {
				onSuccess: (res) => {
					let coupon_applied = 0;
					let coupon_applied_class = "";
					if (res.success) {
						notification.success({
							message: "Coupon",
							description: res.message,
						});
						coupon_applied = 1;
						coupon_applied_class = "coupon-success";
					} else {
						notification.error({
							message: "Coupon",
							description: res.message,
						});
						coupon_applied_class = "coupon-error";
					}
					list[index] = {
						...listindex,
						coupon_applied,
						coupon_info: res.data,
						coupon_applied_class,
					};
					form.setFieldValue({ list });
				},
				onError: (err) => {
					notification.error({
						message: "Coupon",
						description: err.response.data.message,
					});
				},
			});
		}
	};

	return (
		<Card className="page-form-subscriber" id="PageNewSubscriber">
			<Form form={form} onFinish={onFinish} initialValues={{ list: [""] }}>
				<Row gutter={[12, 12]}>
					<Col xs={24} sm={24} md={24} lg={24} xl={18} xxl={14}>
						<Typography.Paragraph>
							After subscription purchases, a registration link will be sent to
							each new subscriber's email address. They will be required to
							complete registration by setting up a password, once completed
							they will have access to the system.
						</Typography.Paragraph>

						<Collapse
							className="main-1-collapse border-none m-t-md"
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
							defaultActiveKey={["1"]}
							expandIconPosition="start"
						>
							<Collapse.Panel
								header="SUBSCRIPTION"
								key="1"
								className="accordion bg-darkgray-form m-b-md border bgcolor-1 white"
							>
								<Row gutter={[12, 12]}>
									<Col xs={24} sm={24} md={24}>
										<Form.Item
											name="account_plan_id"
											rules={[
												{
													required: true,
													message: "This field is required.",
												},
											]}
											className="form-select-error"
											hasFeedback
										>
											<FloatSelectWithDangerouslySetInnerHTML
												label="Subscription Plan"
												placeholder="Subscription Plan"
												options={programPlans}
												onChange={(e) => {
													let val = programPlans.filter((x) => x.value === e);

													setSelectedProgramType(val[0].policy);
												}}
											/>
										</Form.Item>
									</Col>
									<Col xs={24} sm={24} md={24}>
										<Form.List
											name="list"
											rules={[
												{
													validator: async (_, names) => {
														if (!names || names.length < 1) {
															return Promise.reject(
																new Error("At least 1 subscriber")
															);
														}
													},
												},
											]}
										>
											{(fields, { add, remove }) => (
												<>
													{fields.map(({ key, name, ...restField }) => (
														<Row gutter={[12, 12]} key={key}>
															<Col
																xs={24}
																sm={24}
																md={24}
																lg={24}
																style={{
																	display: "flex",
																	justifyContent: "space-between",
																}}
															>
																<Typography.Text>
																	Who is this subscription for?
																</Typography.Text>

																{fields.length > 1 ? (
																	<Button
																		type="link"
																		className="dynamic-delete-button color-6"
																		// loading={
																		// 	isLoadingDeleteQuestionOption
																		// }
																		onClick={() => remove(name)}
																	>
																		<FontAwesomeIcon icon={faTrashAlt} />
																	</Button>
																) : null}
															</Col>

															<Col xs={24} sm={24} md={24} lg={12}>
																<Form.Item
																	{...restField}
																	name={[name, "firstname"]}
																	rules={[
																		{
																			required: true,
																			message: "Missing First Name",
																		},
																	]}
																>
																	<FloatInput
																		label="First Name"
																		placeholder="First Name"
																	/>
																</Form.Item>
															</Col>

															<Col xs={24} sm={24} md={24} lg={12}>
																<Form.Item
																	{...restField}
																	name={[name, "lastname"]}
																	rules={[
																		{
																			required: true,
																			message: "Missing Last Name",
																		},
																	]}
																>
																	<FloatInput
																		label="Last Name"
																		placeholder="Last Name"
																	/>
																</Form.Item>
															</Col>
															<Col xs={24} sm={24} md={24} lg={12}>
																<Form.Item
																	{...restField}
																	name={[name, "email"]}
																	rules={[
																		{
																			required: true,
																			message: "Missing Email",
																			type: "email",
																		},
																	]}
																>
																	<FloatInput
																		label="Email"
																		placeholder="Email"
																	/>
																</Form.Item>
															</Col>
															<Col xs={24} sm={24} md={24} lg={12}>
																<Form.Item
																	{...restField}
																	name={[name, "coupon"]}
																>
																	<FloatInput
																		label="Coupon"
																		placeholder="Coupon"
																		className={`input-coupon-code ${
																			form.getFieldsValue() &&
																			form.getFieldsValue().list &&
																			form.getFieldsValue().list[name]
																				.coupon_applied_class
																		}`}
																		addonAfter={
																			<Button
																				onClick={() => handleApplyCoupon(name)}
																				disabled={isLoadingReferenceCodeInfo}
																				// className={couponLoading ? "bgcolor-20" : ""}
																			>
																				APPLY
																			</Button>
																		}
																	/>
																</Form.Item>
															</Col>
														</Row>
													))}

													<Form.Item>
														<Button
															type="link"
															onClick={() => add()}
															icon={
																<FontAwesomeIcon
																	icon={faPlus}
																	className="m-r-xs"
																/>
															}
															className="color-6 p-l-none"
														>
															Add Additional Caregiver Subscriptions
														</Button>
													</Form.Item>
												</>
											)}
										</Form.List>
									</Col>
									<Col xs={24} sm={24} md={24}>
										<Form.Item shouldUpdate>
											{() => {
												let amount = programPlans.filter(
													(itemFilter) =>
														itemFilter.value ===
														form.getFieldValue().account_plan_id
												);

												let list = form.getFieldValue().list;
												console.log("list", list);

												let subscripberCount = list?.filter(
													(itemFilter) =>
														itemFilter !== "" &&
														itemFilter !== undefined &&
														itemFilter?.email !== ""
												);
												console.log("subscripberCount", subscripberCount);
												let total_amount = 0;
												if (amount.length > 0) {
													subscripberCount.map((item) => {
														if (item.coupon_info) {
															let total =
																parseFloat(amount[0].amount) -
																parseFloat(
																	item.coupon_info.reference_code.account_plan
																		.amount
																);
															console.log("total", total);
															total_amount += total;
														} else {
															total_amount += parseFloat(amount[0].amount);
														}
														return "";
													});
												}

												return (
													<Typography.Text strong>
														{"TOTAL AMOUNT $" + total_amount}
													</Typography.Text>
												);
											}}
										</Form.Item>
									</Col>
								</Row>
							</Collapse.Panel>
						</Collapse>

						<Collapse
							className="main-1-collapse border-none m-t-md"
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
							defaultActiveKey={["1"]}
							expandIconPosition="start"
						>
							<Collapse.Panel
								header="CREDIT CARD INFROMATION"
								key="1"
								className="accordion bg-darkgray-form m-b-md border bgcolor-1 white"
							>
								<Row gutter={[12, 12]}>
									<Col xs={24} sm={24} md={24} lg={24}>
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
									</Col>
									<Col xs={24} sm={24} md={8} lg={8}>
										<Form.Item
											name="credit_card_number"
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
												label="Card Number"
												placeholder="Card Number"
												maskLabel="credit_card_number"
												// onChange={handleChangeCreditCardNumber}
												// value={creditCardNumber}
											/>
										</Form.Item>
									</Col>
									<Col xs={24} sm={24} md={8} lg={8}>
										<Form.Item
											name="credit_expiry"
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
												label="Expiration"
												placeholder="Expiration"
												maskLabel="card_expiry"
												maskType="99/99"
											/>
										</Form.Item>
									</Col>
									<Col xs={24} sm={24} md={8} lg={8}>
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
									</Col>
								</Row>
							</Collapse.Panel>
						</Collapse>

						<Collapse
							className="main-1-collapse border-none m-t-md"
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
							defaultActiveKey={["1"]}
							expandIconPosition="start"
						>
							<Collapse.Panel
								header="Privacy Policy & Terms and Conditions"
								key="1"
								className="accordion bg-darkgray-form m-b-md border bgcolor-1 white"
							>
								<Row gutter={[12, 12]}>
									<Col xs={24} sm={24} md={24} lg={24}>
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

												overflow: "auto",
												border: "1px solid #58585a",
											}}
											dangerouslySetInnerHTML={{
												__html: selectedProgramType && selectedProgramType,
											}}
										></div>

										<Checkbox
											onChange={onChangeCheckbox}
											name="checkbox_2"
											className="checkbox_yes"
											disabled={checkboxYes}
											checked={checkboxYesStatus}
										>
											Yes, I have read the Privacy Policy and Terms and
											Conditions
										</Checkbox>
									</Col>
								</Row>
							</Collapse.Panel>
						</Collapse>
					</Col>
					<Col xs={24} sm={24} md={24} lg={24} xl={18} xxl={14}>
						<Button
							disabled={checkboxYesStatus ? false : true}
							style={{ width: "100%" }}
							size="large"
							htmlType="submit"
							className="btn-main-invert"
							loading={isLoadingCreateSubscriber}
						>
							COMPLETE PURCHASE
						</Button>
					</Col>
				</Row>
			</Form>
		</Card>
	);
}
