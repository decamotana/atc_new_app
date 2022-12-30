import { Button, Col, Form, Modal, Row } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/pro-solid-svg-icons";

import FloatInput from "../../../../providers/FloatInput";
import { useEffect } from "react";

export default function ModalFormEdit(props) {
	const { toggleModal, setToggleModal, onFinish, isLoading } = props;
	const [form] = Form.useForm();

	useEffect(() => {
		if (toggleModal.open) {
			if (toggleModal.data) {
				form.setFieldsValue({ ...toggleModal.data });
			} else {
				form.resetFields();
			}
		} else {
			form.resetFields();
		}

		return () => {};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [toggleModal]);

	return (
		<Modal
			closeIcon={<FontAwesomeIcon icon={faTimes} />}
			title="Edit Reference Code"
			open={toggleModal.open}
			footer={null}
			onCancel={() => setToggleModal({ open: false, data: null })}
			className="modal-primary-default"
			forceRender
		>
			<Form form={form} onFinish={onFinish}>
				<Row gutter={12}>
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
							<FloatInput
								label="Title"
								placeholder="Title"
								className="remove-double-border"
							/>
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
