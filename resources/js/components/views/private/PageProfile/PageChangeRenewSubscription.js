import { useState } from "react";
import { useHistory } from "react-router-dom";
import {
	Button,
	Card,
	Col,
	Collapse,
	notification,
	Row,
	Space,
	Typography,
} from "antd";
import { userData } from "../../../providers/companyInfo";
import ModalDeactivateAcc from "./Components/ModalDeactivateAcc";
import moment from "moment";
import { GET, POST } from "../../../providers/useAxiosQuery";

export default function PageChangeRenewSubscription() {
	const history = useHistory();

	const [toggleModalDeactivateAcc, setToggleModalDeactivateAcc] = useState({
		title: "",
		show: false,
	});

	const [currentProgramType, setCurrentProgramType] = useState(null);
	const [stripeData, setStripData] = useState([]);

	const [upgradeDowngradeBtnStatus, setUpgradeDowngradeBtnStatus] = useState({
		upgrade: false,
		downgrade: false,
	});

	// GET("api/v1/acc_type?user_id=" + userData().id, "acc_type", (res) => {
	// 	if (res.success) {
	// 		let current_plan = res.current_plan;

	// 		let accountPlansTemp = res.data.reduce((a, b) => {
	// 			a.push(b.account_plan);
	// 			return a;
	// 		}, []);

	// 		let account_plans = [].concat(...accountPlansTemp);
	// 		console.log("account_plans", account_plans);

	// 		if (account_plans.length > 0) {
	// 			let upgrade =
	// 				account_plans[account_plans.length - 1].id ===
	// 				current_plan.account_plan_id
	// 					? true
	// 					: false;
	// 			let downgrade =
	// 				account_plans[0].id === current_plan.account_plan_id ? true : false;
	// 			setUpgradeDowngradeBtnStatus({ upgrade, downgrade });
	// 		}

	// 		setStripData(res.stripe_data);
	// 	}
	// });
	GET("api/v1/acc_plan?user_id=" + userData().id, "acc_type", (res) => {
		if (res.success) {
			let current_plan = res.current_plan;
			console.log("res.data", res.data);

			let upgrade =
				res.data[res.data.length - 1].id === current_plan.account_plan_id
					? true
					: false;
			let downgrade =
				res.data[0].id === current_plan.account_plan_id ? true : false;
			setUpgradeDowngradeBtnStatus({ upgrade, downgrade });

			setStripData(res.stripe_data);
		}
	});

	GET(
		`api/v1/user_plan?from_page=profile-upgrade-subscription&user_id=${
			userData().id
		}`,
		"user_plan",
		(res) => {
			if (res.data.length > 0) {
				var currentplanactive = res.data[res.data.length - 1];
				let current_acc_type = `${
					currentplanactive.account_plan.account_type.type
				} - $${parseFloat(currentplanactive.account_plan.amount).toFixed(2)}`;
				setCurrentProgramType(current_acc_type);
			}
		}
	);

	const [autoRenew, setAutoRenew] = useState(0);

	const { mutate: mutateAutoRenew, isLoading: isLoadingAutoRenew } = POST(
		"api/v1/auto_renew",
		"auto_renew"
	);

	const handleRenew = () => {
		mutateAutoRenew(
			{ id: userData().id },
			{
				onSuccess: (res) => {
					if (res.success) {
						notification.success({
							message: "Auto Renew",
							description: res.message,
						});
						setAutoRenew(res.data);
					} else {
						notification.error({
							message: "Auto Renew",
							description: res.message,
						});
					}
				},
				onError: (err) => {
					notification.error({
						message: "Auto Renew",
						description: err.response.data.message,
					});
				},
			}
		);
	};

	return (
		<Card
			className="page-profile-subscription"
			id="PageChangeRenewSubscription"
		>
			<Row>
				<Col xs={24} sm={24} md={24} lg={24} xl={20} xxl={16}>
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
							header="CURRENT MEMBERSHIP"
							key="1"
							className="accordion bg-darkgray-form m-b-md border "
						>
							<Row gutter={[12, 12]}>
								<Col xs={24} sm={24} md={24}>
									<Typography.Text>
										Your current subscription type is:
									</Typography.Text>
									<br />
									<Typography.Text strong className="color-6 fontMontserrat700">
										{currentProgramType}
									</Typography.Text>
								</Col>
								<Col xs={24} sm={24} md={24}>
									<Row gutter={[12, 12]}>
										<Col xs={10} sm={10} md={8} lg={5}>
											<Typography.Text>Created Date:</Typography.Text>
										</Col>
										<Col xs={14} sm={14} md={16} lg={19}>
											<Typography.Text className="fontMontserrat700 color-7">
												{stripeData &&
													moment.unix(stripeData.created).format("YYYY-MM-DD")}
											</Typography.Text>
										</Col>
										<Col xs={10} sm={10} md={8} lg={5}>
											<Typography.Text>Period Start:</Typography.Text>
										</Col>
										<Col xs={14} sm={14} md={16} lg={19}>
											<Typography.Text className="fontMontserrat700 color-7">
												{stripeData &&
													moment
														.unix(stripeData.current_period_start)
														.format("YYYY-MM-DD")}
											</Typography.Text>
										</Col>
										<Col xs={10} sm={10} md={8} lg={5}>
											<Typography.Text>Period To:</Typography.Text>
										</Col>
										<Col xs={14} sm={14} md={16} lg={19}>
											<Typography.Text className="fontMontserrat700 color-7">
												{stripeData &&
													moment
														.unix(stripeData.current_period_end)
														.format("YYYY-MM-DD")}
											</Typography.Text>
										</Col>
										<Col xs={10} sm={10} md={8} lg={5}>
											<Typography.Text>Collection Method:</Typography.Text>
										</Col>
										<Col xs={14} sm={14} md={16} lg={19}>
											<Space direction="vertical" size={0}>
												<Typography.Text
													strong
													className="color-7 fontMontserrat700"
												>
													Auto Renew {autoRenew === 0 ? "Disabled" : "Enabled"}
												</Typography.Text>

												<Button
													type="link"
													onClick={() => {
														if (!isLoadingAutoRenew) {
															handleRenew();
														}
													}}
													className="fontMontserrat700 p-n color-6"
												>
													{autoRenew === 0 ? "Enabled" : "Disabled"} Auto Renew
												</Button>
											</Space>
										</Col>
									</Row>
								</Col>
								<Col xs={24} sm={24} md={24}>
									<div className="btn-list">
										<Button
											size="large"
											className="btn-primary w-100 b-r-none"
											onClick={() =>
												history.push("/profile/account/payment-and-invoices")
											}
										>
											PAYMENTS & INVOICES
										</Button>

										<Button
											size="large"
											className="btn-warning w-100 b-r-none"
											onClick={() =>
												!upgradeDowngradeBtnStatus.upgrade
													? history.push(
															"/profile/account/subscription/upgrade-subscription"
													  )
													: ""
											}
											disabled={upgradeDowngradeBtnStatus.upgrade}
										>
											UPGRADE SUBSCRIPTION
										</Button>

										<Button
											size="large"
											className="btn-main-2-active w-100 b-r-none"
											onClick={() =>
												!upgradeDowngradeBtnStatus.downgrade
													? history.push(
															"/profile/account/subscription/downgrade-subscription"
													  )
													: ""
											}
											disabled={upgradeDowngradeBtnStatus.downgrade}
										>
											DOWNGRADE SUBSCRIPTION
										</Button>

										<Button
											size="large"
											className="btn-main-invert-active w-100 b-r-none"
											onClick={() => {
												let title = currentProgramType;
												setToggleModalDeactivateAcc({ title, show: true });
											}}
										>
											CANCEL SUBSCRIPTION
										</Button>
									</div>
								</Col>
							</Row>
						</Collapse.Panel>
					</Collapse>
				</Col>
			</Row>

			<ModalDeactivateAcc
				toggleModalDeactivateAcc={toggleModalDeactivateAcc}
				setToggleModalDeactivateAcc={setToggleModalDeactivateAcc}
			/>
		</Card>
	);
}
