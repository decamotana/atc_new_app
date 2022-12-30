import { Button, Col, Form, Modal, Radio, Row, Space } from "antd";
import moment from "moment";
import React, { useEffect } from "react";
import FloatDatePicker from "../../../../../providers/FloatDatePicker";
import FloatInput from "../../../../../providers/FloatInput";
import FloatInputNumber from "../../../../../providers/FloatInputNumber";
import FloatSelect from "../../../../../providers/FloatSelect";

const validator = {
	require: {
		required: true,
		message: "This field is required",
	},
};

export default function ModalForm(props) {
	const {
		toggleModalForm,
		setToggleModalForm,
		onFinish,
		isLoading,
		isFixed,
		setIsFixed,
	} = props;

	const [form] = Form.useForm();

	useEffect(() => {
		if (!toggleModalForm.open) {
			form.resetFields();
		} else {
			if (toggleModalForm.data) {
				setIsFixed(toggleModalForm.data.type);
				let type = "a";
				if (toggleModalForm.data.type === "percent") {
					type = "a";
				}
				if (toggleModalForm.data.type === "fixed") {
					type = "b";
				}
				if (toggleModalForm.data.type === "offer") {
					type = "c";
				}
				form.setFieldsValue({
					...toggleModalForm.data,
					role: JSON.parse(toggleModalForm.data.role),
					type,
					duration_from: moment(toggleModalForm.data.duration_from),
					duration_to: moment(toggleModalForm.data.duration_to),
				});
			}
		}

		return () => {};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [form, toggleModalForm]);

	return (
		<Modal
			title="Coupon Form"
			open={toggleModalForm.open}
			//   onOk={showModal}
			className="modal-admin-coupon"
			onCancel={() =>
				setToggleModalForm({
					open: false,
					data: null,
				})
			}
			footer={
				<Space>
					<Button
						onClick={(e) =>
							setToggleModalForm({
								open: false,
								data: null,
							})
						}
						loading={isLoading}
						size="large"
					>
						CANCEL
					</Button>
					<Button
						className="btn-main-invert-outline b-r-none"
						onClick={(e) => form.submit()}
						loading={isLoading}
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
					// if (change.duration) {
					// 	if (change.duration === "repeating") {
					// 		setIsRepeating(true);
					// 	} else {
					// 		setIsRepeating(false);
					// 	}
					// }
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
									label="Percentage off"
									placeholder="Percentage off"
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
