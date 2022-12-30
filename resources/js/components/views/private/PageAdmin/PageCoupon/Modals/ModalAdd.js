import React, { useEffect, useState } from "react";
import {
	Modal,
	Form,
	Button,
	Row,
	Col,
	notification,
	Space,
	Radio,
} from "antd";
import FloatDatePicker from "../../../../../providers/FloatDatePicker";
import FloatInput from "../../../../../providers/FloatInput";
import FloatInputNumber from "../../../../../providers/FloatInputNumber";
import FloatSelect from "../../../../../providers/FloatSelect";
import { POST } from "../../../../../providers/useAxiosQuery";
export default function ModalAdd({ isModalAdd, setIsModalAdd }) {
	const [form] = Form.useForm();

	const validator = {
		require: {
			required: true,
			message: "Required",
		},
	};

	const { mutate: mutateCoupon, isLoading: isLoadingCoupon } = POST(
		"api/v1/add_coupon_system",
		"get_coupons_system"
	);

	const onFinish = (values) => {
		let data = {
			...values,
			type: isFixed,
			duration_from: values.duration_from.format("YYYY-MM-DD"),
			duration_to: values.duration_to.format("YYYY-MM-DD"),
			max_redemptions: values.max_redemptions
				? Math.floor(values.max_redemptions)
				: null,
		};
		// console.log("onFinish", values.duration_from.format("YYYY-MM-DD"));
		mutateCoupon(data, {
			onSuccess: (res) => {
				if (res.success) {
					// console.log(res)

					notification.success({
						message: "Sucess",
						description: "Coupon Sucessfully Added",
					});
					setIsModalAdd(false);
					setIsFixed("percent");
					form.resetFields();
				} else {
					notification.error({
						message: "Error",
						description: "Coupon Already Exists",
					});
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

	const [
		// isRepeating,
		setIsRepeating,
	] = useState(false);
	const [isFixed, setIsFixed] = useState("percent");

	useEffect(() => {
		// console.log(isFixed);
	}, [isFixed]);
	return (
		<Modal
			title="Add Coupon"
			open={isModalAdd}
			//   onOk={showModal}
			className="modal-admin-coupon"
			onCancel={() => {
				setIsModalAdd(false);
			}}
			footer={
				<Space>
					<Button
						onClick={(e) => {
							setIsModalAdd(false);
						}}
						size="large"
					>
						CANCEL
					</Button>
					<Button
						className="btn-main-invert-outline b-r-none"
						onClick={(e) => form.submit()}
						loading={isLoadingCoupon}
						size="large"
					>
						SUBMIT
					</Button>
				</Space>
			}
			style={{ top: 20 }}
		>
			<Form
				layout="horizontal"
				form={form}
				onFinish={onFinish}
				onValuesChange={(change, values) => {
					if (change.duration) {
						if (change.duration === "repeating") {
							setIsRepeating(true);
						} else {
							setIsRepeating(false);
						}
					}
					if (change.type) {
						if (change.type === "a") {
							setIsFixed("percent");
						}
						if (change.type === "b") {
							setIsFixed("fixed");
						}
						if (change.type === "c") {
							setIsFixed("offer");
						}
					}
				}}
				initialValues={{ type: "a" }}
			>
				<Row gutter={24}>
					<Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
						<Form.Item
							name="coupon_code"
							rules={[validator.require]}
							hasFeedback
						>
							<FloatInput label="Coupon Code" placeholder=" Coupon Code" />
						</Form.Item>
					</Col>
					<Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
						<Form.Item
							name="coupon_name"
							rules={[validator.require]}
							hasFeedback
						>
							<FloatInput label="Coupon Name" placeholder="Coupon Name" />
						</Form.Item>
					</Col>
					<Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
						<Space direction="vertical">
							<Form.Item name="type" label="Type Discount">
								<Radio.Group>
									<Radio value="a">Percentage </Radio>
									<Radio value="b">Fixed </Radio>
									{/* <Radio value="c">Offer Free Days</Radio> */}
								</Radio.Group>
							</Form.Item>
						</Space>
					</Col>
					{isFixed === "percent" && (
						<Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
							<Form.Item name="off" rules={[validator.require]} hasFeedback>
								<FloatInputNumber
									label="Percentege off"
									placeholder="Percentege off"
								/>
							</Form.Item>
						</Col>
					)}

					{isFixed === "fixed" && (
						<Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
							<Form.Item name="off" rules={[validator.require]} hasFeedback>
								<FloatInputNumber label="Amount off" placeholder="Amount off" />
							</Form.Item>
						</Col>
					)}
					{isFixed === "offer" && (
						<Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
							<Form.Item name="off" rules={[validator.require]} hasFeedback>
								<FloatInputNumber
									label="No. of Days"
									placeholder="No. of Days"
								/>
							</Form.Item>
						</Col>
					)}

					<Col xs={24} md={12}>
						<Form.Item
							name="duration_from"
							rules={[validator.require]}
							hasFeedback
						>
							<FloatDatePicker
								label={"Duration From"}
								// placeholder={"Date and Start Time"}
								mode
							/>
						</Form.Item>
					</Col>
					<Col xs={24} md={12}>
						{" "}
						<Form.Item
							name="duration_to"
							rules={[validator.require]}
							hasFeedback
						>
							<FloatDatePicker label={"Duration To"} mode />
						</Form.Item>
					</Col>

					<Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
						<Form.Item
							name="role"
							rules={[validator.require]}
							hasFeedback
							className="form-select-error-multi"
						>
							<FloatSelect
								label="Applied on Account type"
								placeholder="Applied on Account type"
								multi="multiple"
								options={[
									{
										label: "Cancer Caregiver",
										value: "Cancer Caregiver",
									},
									{
										label: "Cancer Care Professional",
										value: "Cancer Care Professional",
									},
								]}
							/>
						</Form.Item>
					</Col>
					<Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
						<Form.Item name="max" hasFeedback>
							<FloatInputNumber
								label="Max redemptions"
								placeholder="Max redemptions"
								rules={[validator.require]}
							/>
						</Form.Item>
					</Col>
					{/* <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
            <Form.Item name="days_free" hasFeedback>
              <FloatInputNumber label="Days Free" placeholder="Days Free" />
            </Form.Item>
          </Col> */}
				</Row>
			</Form>
		</Modal>
	);
}
