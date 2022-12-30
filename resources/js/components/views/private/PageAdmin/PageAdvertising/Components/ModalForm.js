import { faTimes } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Col, Form, Modal, Row } from "antd";
import { useEffect } from "react";
import FloatInput from "../../../../../providers/FloatInput";
import FloatSelect from "../../../../../providers/FloatSelect";

export default function ModalForm(props) {
	const { toggleModalForm, setToggleModalForm, onFinish, isLoading } = props;

	const [form] = Form.useForm();

	useEffect(() => {
		if (toggleModalForm.data) {
			form.setFieldsValue({
				...toggleModalForm.data,
			});
		} else {
			form.setFieldsValue({
				description: "",
			});
		}

		return () => {};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [toggleModalForm]);

	return (
		<Modal
			closeIcon={<FontAwesomeIcon icon={faTimes} />}
			title="Advertising Form"
			open={toggleModalForm.show}
			footer={null}
			onCancel={() => setToggleModalForm({ show: false, data: null })}
			className="modal-primary-default"
			forceRender
		>
			<Form form={form} onFinish={onFinish}>
				<Row gutter={12}>
					<Col xs={24} sm={24} md={24}>
						<Form.Item
							name="priority"
							hasFeedback
							rules={[
								{
									required: true,
									message: "This field is required.",
								},
							]}
							className="form-select-error"
						>
							<FloatSelect
								label="Priority"
								placeholder="Priority"
								options={[
									{
										value: "High",
										label: "High",
									},
									{
										value: "Medium",
										label: "Medium",
									},
									{
										value: "Low",
										label: "Low",
									},
								]}
							/>
						</Form.Item>
					</Col>

					<Col xs={24} sm={24} md={24}>
						<Form.Item
							name="type"
							hasFeedback
							rules={[
								{
									required: true,
									message: "This field is required.",
								},
							]}
						>
							<FloatSelect
								label="User Type"
								placeholder="User Type"
								options={[
									{
										value: "Both",
										label: "Both",
									},
									{
										value: "Cancer Caregiver",
										label: "Cancer Caregiver",
									},
									{
										value: "Cancer Care Professional",
										label: "Cancer Care Professional",
									},
								]}
							/>
						</Form.Item>
					</Col>

					<Col xs={24} sm={24} md={24}>
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
							<FloatInput label="Name" placeholder="Name" />
						</Form.Item>
					</Col>

					<Col xs={24} sm={24} md={24}>
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
							<FloatInput label="Name" placeholder="Name" />
						</Form.Item>
					</Col>

					<Col xs={24} sm={24} md={24}>
						<Button
							htmlType="submit"
							className="btn-main-invert"
							loading={isLoading}
						>
							SAVE
						</Button>
					</Col>
				</Row>
			</Form>
		</Modal>
	);
}
