import { useState } from "react";
import { useHistory } from "react-router-dom";
import {
	Button,
	Card,
	Col,
	Collapse,
	Form,
	notification,
	Row,
	Typography,
} from "antd";
import { GET, POST } from "../../../../providers/useAxiosQuery";
import { userData } from "../../../../providers/companyInfo";
import FloatInput from "../../../../providers/FloatInput";
import FloatSelect from "../../../../providers/FloatSelect";
import FloatInputMask from "../../../../providers/FloatInputMask";
import FloatInputNumber from "../../../../providers/FloatInputNumber";
import toCurrency from "../../../../providers/toCurrency";

export default function PageReferenceCodeAdd() {
	const history = useHistory();
	const [form] = Form.useForm();

	const [programPlans, setProgramPlans] = useState([]);
	const [totalAmount, setTotalAmount] = useState(null);

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
		mutate: mutateCreateReferenceCode,
		isLoading: isLoadingCreateReferenceCode,
	} = POST("api/v1/reference_code", "reference_code_create");

	const onFinish = (values) => {
		let data = {
			...values,
			email: userData().email,
			user_id: userData().id,
			id: "",
		};

		mutateCreateReferenceCode(data, {
			onSuccess: (res) => {
				if (res.success) {
					notification.success({
						message: "Reference Code",
						description: res.message,
					});

					history.push("/subscribers/reference-code");
				} else {
					notification.error({
						message: "Reference Code",
						description: res.message,
					});
				}
			},
			onError: (err) => {
				notification.error({
					message: "Reference Code",
					description: err.response.data.message,
				});
			},
		});
	};

	return (
		<Card id="PageCareProfessionalReferenceCodeAdd">
			<Form form={form} onFinish={onFinish}>
				<Row gutter={[12, 12]}>
					<Col xs={24} sm={24} md={24} lg={12}>
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
								header="REFERENCE CODE INFROMATION"
								key="1"
								className="accordion bg-darkgray-form m-b-md border bgcolor-1 white"
							>
								<Row gutter={[12, 12]}>
									<Col xs={24} sm={24} md={24} lg={24}>
										<Form.Item
											name="title"
											hasFeedback
											rules={[
												{
													required: true,
													message: "This field is required.",
												},
											]}
										>
											<FloatInput
												label="Title"
												placeholder="Title"
												className="remove-double-border"
											/>
										</Form.Item>
									</Col>
									<Col xs={24} sm={24} md={24} lg={24}>
										<Form.Item
											name="account_plan_id"
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
												label="Select Subscription Plan"
												placeholder="Select Subscription Plan"
												options={programPlans}
												onChange={(e) => {
													let quantity = form.getFieldsValue().quantity;
													let programPlansTemp = programPlans.filter(
														(f) => f.value === e
													);

													if (quantity && programPlansTemp.length > 0) {
														setTotalAmount(
															parseFloat(programPlansTemp[0].amount) *
																parseInt(quantity)
														);
													}
												}}
											/>
										</Form.Item>
									</Col>
									<Col xs={24} sm={24} md={24} lg={24}>
										<Form.Item
											name="code_name"
											hasFeedback
											rules={[
												{
													required: true,
													message: "This field is required.",
												},
											]}
										>
											<FloatInput
												label="Start of Code Name"
												placeholder="Start of Code Name"
												className="remove-double-border"
											/>
										</Form.Item>
									</Col>
									<Col xs={24} sm={24} md={24} lg={24}>
										<Form.Item
											name="quantity"
											hasFeedback
											rules={[
												{
													required: true,
													message: "This field is required.",
												},
											]}
										>
											<FloatInputNumber
												label="Quantity"
												placeholder="Quantity"
												className="remove-double-border"
												onChange={(e) => {
													let quantity = e;
													let account_plan_id =
														form.getFieldsValue().account_plan_id;

													if (account_plan_id && quantity) {
														let programPlansTemp = programPlans.filter(
															(f) => f.value === account_plan_id
														);
														if (programPlansTemp.length > 0) {
															setTotalAmount(
																parseFloat(programPlansTemp[0].amount) *
																	quantity
															);
														}
													}
												}}
											/>
										</Form.Item>
									</Col>
									<Col xs={24} sm={24} md={24} lg={24}>
										{totalAmount ? (
											<Typography.Text className="fontMontserrat700 ">
												TOTAL AMOUNT: ${toCurrency(totalAmount)}
											</Typography.Text>
										) : null}
									</Col>
								</Row>
							</Collapse.Panel>
						</Collapse>
					</Col>

					<Col xs={24} sm={24} md={24} lg={12}>
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
												className="remove-double-border"
											/>
										</Form.Item>
									</Col>
									<Col xs={24} sm={24} md={24} lg={24}>
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
									<Col xs={24} sm={24} md={24} lg={24}>
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
									<Col xs={24} sm={24} md={24} lg={24}>
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
					</Col>

					<Col xs={24} sm={24} md={24} lg={24}>
						<Button
							htmlType="submit"
							className="btn-main-invert"
							loading={isLoadingCreateReferenceCode}
							size="large"
						>
							SUBMIT
						</Button>
					</Col>
				</Row>
			</Form>
		</Card>
	);
}
