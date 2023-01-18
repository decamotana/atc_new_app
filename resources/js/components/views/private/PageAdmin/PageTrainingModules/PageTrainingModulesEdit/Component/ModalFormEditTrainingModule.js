import { Button, Col, Form, Modal, Row } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/pro-solid-svg-icons";

import FloatInput from "../../../../../../providers/FloatInput";
import { useEffect } from "react";

export default function ModalFormEditTrainingModule(props) {
	const { toggleModalEdit, setToggleModalEdit, onFinish, isLoading } = props;
	const [form] = Form.useForm();

	useEffect(() => {
		// console.log(toggleModalEdit.data);
		if (toggleModalEdit.data) {
			form.setFieldsValue({
				...toggleModalEdit.data,
			});
		}

		return () => {};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [toggleModalEdit]);

	return (
		<Modal
			closeIcon={<FontAwesomeIcon icon={faTimes} />}
			title="EDIT MODULE"
			open={toggleModalEdit.show}
			footer={null}
			onCancel={() => setToggleModalEdit({ show: false, data: null })}
			className="modal-primary-default modal-admin-edit-module"
		>
			<Form form={form} onFinish={onFinish}>
				<Row gutter={12}>
					<Col xs={24} sm={24} md={10}>
						<Form.Item
							name="module_number"
							hasFeedback
							rules={[
								{
									required: true,
									message: "This field is required.",
								},
							]}
						>
							<FloatInput label="Module #" placeholder="Module #" />
						</Form.Item>
					</Col>

					<Col xs={24} sm={24} md={14}>
						<Form.Item
							name="module_name"
							hasFeedback
							rules={[
								{
									required: true,
									message: "This field is required.",
								},
							]}
						>
							<FloatInput label="Module Name" placeholder="Module Name" />
						</Form.Item>
					</Col>

					<Col xs={24} sm={24} md={24}>
						<Button
							htmlType="submit"
							className="btn-main-invert"
							loading={isLoading}
							size="large"
						>
							SUBMIT
						</Button>
					</Col>
				</Row>
			</Form>
		</Modal>
	);
}
