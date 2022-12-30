import React, { useEffect, useState } from "react";
import { Modal, Form, Button, Row, Col, notification, Space } from "antd";

import FloatInput from "../../../../../providers/FloatInput";

import { POST } from "../../../../../providers/useAxiosQuery";
export default function ModalUpdate({
	isModalUpdate,
	setIsModalUpdate,
	isModalUpdateData,
}) {
	useEffect(() => {
		if (isModalUpdateData) {
			if (isModalUpdateData.duration === "repeating") {
				setIsRepeating(true);
			} else {
				setIsRepeating(false);
			}
			// console.log(isModalUpdateData);
			form.setFieldsValue(isModalUpdateData);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isModalUpdateData]);

	const [form] = Form.useForm();

	const validator = {
		require: {
			required: true,
			message: "Required",
		},
	};

	const { mutate: mutateCoupon, isLoading: isLoadingCoupon } = POST(
		"api/v1/update_coupon",
		"get_coupons"
	);

	const onFinish = (values) => {
		let data = {
			...values,
		};
		// console.log("onFinish", data);
		mutateCoupon(data, {
			onSuccess: (res) => {
				if (res.success) {
					// console.log(res)
					notification.success({
						message: "Sucess",
						description: "Coupon Sucessfully Added",
					});
					setIsModalUpdate(false);
					form.resetFields();
				}
			},
			onError: (err) => {
				// console.log(err);
			},
		});
	};

	const [
		// isRepeating,
		setIsRepeating,
	] = useState(false);

	return (
		<Modal
			title="Update Coupon"
			open={isModalUpdate}
			//   onOk={showModal}
			className="modal-admin-coupon"
			onCancel={() => {
				setIsModalUpdate(false);
			}}
			footer={
				<Space>
					<Button
						onClick={(e) => {
							setIsModalUpdate(false);
						}}
						size="large"
					>
						CANCEL
					</Button>
					<Button
						className="btn-login-outline"
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
					// console.log(change);
				}}
			>
				<Row gutter={24}>
					<Col
						xs={24}
						sm={24}
						md={24}
						lg={24}
						xl={24}
						xxl={24}
						style={{ display: "none" }}
					>
						<Form.Item name="id" rules={[validator.require]} hasFeedback>
							<FloatInput label="Coupon Code" placeholder=" Coupon Code" />
						</Form.Item>
					</Col>
					<Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
						<Form.Item name="name" rules={[validator.require]} hasFeedback>
							<FloatInput label="Coupon Name" placeholder="Coupon Name" />
						</Form.Item>
					</Col>
				</Row>
			</Form>
		</Modal>
	);
}
