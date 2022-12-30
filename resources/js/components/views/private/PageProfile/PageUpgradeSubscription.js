import { useState } from "react";
import { useHistory } from "react-router-dom";
import {
	Button,
	Card,
	Checkbox,
	Col,
	Collapse,
	Form,
	notification,
	Radio,
	// Radio,
	Row,
	Typography,
} from "antd";
import { userData } from "../../../providers/companyInfo";
// import FloatSelect from "../../../providers/FloatSelect";
import FloatInputMask from "../../../providers/FloatInputMask";
import FloatInput from "../../../providers/FloatInput";
import FloatSelectWithDangerouslySetInnerHTML from "../../../providers/FloatSelectWithDangerouslySetInnerHTML";
import { GET, POST } from "../../../providers/useAxiosQuery";
import toCurrency from "../../../providers/toCurrency";

export default function PageUpgradeSubscription() {
	const history = useHistory();
	const [form] = Form.useForm();
	const [programPlans, setProgramPlans] = useState([]);
	const [selectedProgramType, setSelectedProgramType] = useState();
	const [currentProgramPlan, setCurrentProgramPlan] = useState(null);
	const [differentCard, setDifferentCard] = useState(false);

	GET(`api/v1/acc_plan?user_id=${userData().id}`, "acc_plan", (res) => {
		if (res.success) {
			let current_plan = res.current_plan;

			let dataFilterIndex = res.data.findIndex(
				(f) => f.id === current_plan.account_plan_id
			);

			let data = [];
			res.data.map((item, index) => {
				if (dataFilterIndex < index) {
					data.push({
						value: item.id,
						label: item.plan,
						policy:
							item.account_type.privacy &&
							item.account_type.privacy.privacy_policy,
						amount: item.amount,
						account_type_id: item.account_type_id,
					});
				}
				return "";
			});
			setProgramPlans(data);
		}
	});

	GET(
		`api/v1/user_plan?from_page=profile-upgrade-subscription&user_id=${
			userData().id
		}`,
		"user_plan",
		(res) => {
			if (res.data.length > 0) {
				// res.data.reverse().map((item, index) => {
				// 	if (index === 0) {
				// 		console.log(item.account_plan.amount)
				// 		let current_acc_type = `${item.account_plan.account_type.type} - $${
				// 			parseFloat(item.account_plan.amount).toFixed(2)
				// 		}`;

				// 		setCurrentProgramPlan(current_acc_type);
				// 	}
				// 	return "";
				// });
				var currentplanactive = res.data[res.data.length - 1];
				let current_acc_type = `${
					currentplanactive.account_plan.account_type.type
				} - $${parseFloat(currentplanactive.account_plan.amount).toFixed(2)}`;
				setCurrentProgramPlan(current_acc_type);
			}
		}
	);

	// const [isLoadingSubscription, setIsLoadingSubscription] = useState(false);
	// const { mutate: mutateSubscription } = POST(
	// 	"api/v1/user_plan",
	// 	"user_plan_subscription"
	// );

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

	const [appliedBalance, setAppliedBalance] = useState(0);
	const [totalPrice, setToTalPrice] = useState(0);
	const [unUsedTime, setUsedTime] = useState(0);
	const [myBalance, setMybalance] = useState(0);

	const {
		mutate: mutateCheckLastSubscription,
		// isLoading: isLoadingCheckLastSubscription,
	} = POST("api/v1/check_last_subscription", "check_last_subscription");

	const handleAccountPlan = (e) => {
		let programPlansTemp = programPlans.filter((f) => f.value === e);
		if (programPlansTemp.length > 0) {
			setSelectedProgramType(programPlansTemp[0]);
			mutateCheckLastSubscription(
				{
					user_id: userData().id,
					email: userData().email,
					account_plan_id: e,
					account_type_id: programPlansTemp[0].account_type_id,
				},
				{
					onSuccess: (res) => {
						if (res.success) {
							var priceRemaining = Math.abs(
								res.data.lines.data[1].amount / 100
							);
							var prevUseTime = Math.abs(res.data.lines.data[0].amount / 100);
							var creditBal = Math.abs(res.data.starting_balance / 100);
							var total = priceRemaining - prevUseTime;

							setUsedTime(Math.abs(res.data.lines.data[0].amount / 100));
							setMybalance(creditBal);

							if (total < creditBal) {
								var a = creditBal - total;
								var applied_balance = creditBal - a;
								setAppliedBalance(applied_balance);
								setToTalPrice(total - applied_balance);
							} else {
								setAppliedBalance(creditBal);
								setToTalPrice(total - creditBal);
							}
						}
					},
					onError: (res) => {},
				}
			);
		}
	};

	const { mutate: mutateChangePlan, isLoading: isLoadingMutateChangePlan } =
		POST("api/v1/subscription_change", "subscription_change");

	const onFinishSubscription = (values) => {
		let programPlansTemp = programPlans.filter(
			(f) => f.value === values.account_plan_id
		);

		let data = {
			...values,
			user_id: userData().id,
			email: userData().email,
			link_origin: window.location.origin,
			total_price: totalPrice,
			use_diff_card: differentCard,
			account_type_id: programPlansTemp[0].account_type_id,
			description: "Upgrade Subscription Payment",
		};
		console.log("data", data);

		mutateChangePlan(data, {
			onSuccess: (res) => {
				if (res.success) {
					console.log(res);
					notification.success({
						message: "Subscription",
						description: "Plan Successfully Subscribed",
					});
					history.push("/profile/account/subscription");
				}
			},
			onError: (err) => {
				notification.error({
					message: "Error",
					description: err.response.data.message,
				});
			},
		});
	};

	return (
		<Card
			id="PageUpgradeSubscription"
			className="page-profile-upgrade-subscription"
		>
			<Form form={form} onFinish={onFinishSubscription}>
				<Row>
					<Col xs={24} sm={24} md={24} lg={18} xl={14}>
						<Collapse
							className="main-1-collapse border-none"
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
								header="SELECT SUBSCRIPTION PLAN"
								key="1"
								className="accordion bg-darkgray-form m-b-md border"
							>
								<Row gutter={[12, 12]}>
									<Col xs={24} sm={24} md={24}>
										<Typography.Text>
											Your current subscription plan is:
										</Typography.Text>
										<br />
										<Typography.Text
											strong
											className="color-6 fontMontserrat700"
										>
											{currentProgramPlan}
										</Typography.Text>
									</Col>
									<Col xs={24} sm={24} md={24}>
										<Form.Item name="account_plan_id" hasFeedback>
											<FloatSelectWithDangerouslySetInnerHTML
												label="Select Subscription Plan"
												placeholder="Select Subscription Plan"
												options={programPlans}
												onChange={handleAccountPlan}
											/>
										</Form.Item>
									</Col>
									<Col xs={24} sm={24} md={24}>
										<div className="div_up_sub_is_patient">
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
									</Col>
									<Col xs={24} sm={24} md={24}>
										{unUsedTime !== 0 && (
											<h4>
												Unused time on previous subscription: -$
												{toCurrency(unUsedTime)}
											</h4>
										)}

										{appliedBalance !== 0 && (
											<>
												<h4>My Credited Balance : ${toCurrency(myBalance)}</h4>
												<h4>
													Applied Credited Balance -$
													{toCurrency(appliedBalance)}
												</h4>
											</>
										)}
										<Typography.Text className="fontMontserrat700">
											TOTAL AMOUNT:${toCurrency(totalPrice)}
										</Typography.Text>
										{/* <Typography.Text className="fontMontserrat700">
											TOTAL AMOUNT $
											{selectedProgramType
												? parseFloat(selectedProgramType.amount).toFixed(2)
												: 0}
										</Typography.Text> */}
									</Col>
								</Row>
							</Collapse.Panel>
						</Collapse>

						<div className="different_card m-b-md">
							<Checkbox
								onChange={(e) => {
									setDifferentCard(e.target.checked);
								}}
							>
								Use a different card
							</Checkbox>
						</div>

						{differentCard ? (
							<Collapse
								className="main-1-collapse border-none"
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
									header="CREDIT CARD INFORMATION"
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
						) : null}

						{selectedProgramType && (
							<Collapse
								className="main-1-collapse border-none"
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
									header="PRIVACY POLICY AND TERMS AND CONDITIONS"
									key="1"
									className="accordion bg-darkgray-form m-b-md border "
								>
									<Row gutter={[12, 12]}>
										<Col xs={24} sm={24} md={24}>
											<Typography.Text className="color-6" strong>
												Please read/scroll to the end to continue.
											</Typography.Text>
										</Col>
										<Col xs={24} sm={24} md={24}>
											<div
												onScroll={handleScroll}
												className="scrollbar-2"
												style={{
													height: 100,
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
										</Col>
										<Col xs={24} sm={24} md={24}>
											<Checkbox
												onChange={onChangeCheckbox}
												name="checkbox_2"
												className="checkbox_yes"
												disabled={checkboxYes}
											>
												Yes, I have read the Privacy Policy and Terms and
												Conditions
											</Checkbox>
										</Col>
									</Row>
								</Collapse.Panel>
							</Collapse>
						)}

						<Button
							type="primary"
							htmlType="submit"
							loading={isLoadingMutateChangePlan}
							className="btn-main-invert-outline b-r-none"
							block
							size="large"
							disabled={checkboxYes ? true : checkboxYesStatus ? false : true}
						>
							COMPLETE PURCHASE
						</Button>
					</Col>
				</Row>
			</Form>
		</Card>
	);
}
