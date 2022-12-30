import { Button, Col, Form, Modal, Row } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes, faTrashAlt } from "@fortawesome/pro-solid-svg-icons";
import FloatInput from "../../../../../providers/FloatInput";

export default function ModalFormInvitePeople(props) {
	const {
		toggleModalInvitePeople,
		setToggleModalInvitePeople,
		onFinish,
		isLoading,
	} = props;
	const [form] = Form.useForm();

	return (
		<Modal
			closeIcon={<FontAwesomeIcon icon={faTimes} />}
			title="INVITE PEOPLE"
			visible={toggleModalInvitePeople}
			footer={null}
			onCancel={() => setToggleModalInvitePeople(false)}
			className="modal-primary-default"
		>
			<Form form={form} onFinish={onFinish} initialValues={{ list: [""] }}>
				<Row gutter={12}>
					<Col xs={24} sm={24} md={24}>
						<Form.List
							name="list"
							rules={[
								{
									validator: async (_, names) => {
										if (!names || names.length < 1) {
											return Promise.reject(new Error("At least 1 email"));
										}
									},
								},
							]}
						>
							{(fields, { add, remove }) => (
								<>
									{fields.map((field) => (
										<div key={field.key} className="div-form-list-option">
											<Form.Item
												{...field}
												rules={[
													{
														required: true,
														message: "Missing Email",
														type: "email",
													},
												]}
												style={{ width: "100%" }}
											>
												<FloatInput label="Email" placeholder="Email" />
											</Form.Item>
											{fields.length > 1 ? (
												<div className="ant-row ant-form-item">
													<Button
														type="link"
														className="dynamic-delete-button"
														loading={isLoading}
														onClick={() => remove(field.name)}
													>
														<FontAwesomeIcon icon={faTrashAlt} />
													</Button>
												</div>
											) : null}
										</div>
									))}

									<Form.Item>
										<Button
											type="dashed"
											onClick={() => add()}
											block
											icon={<FontAwesomeIcon icon={faPlus} />}
										>
											Add Email
										</Button>
									</Form.Item>
								</>
							)}
						</Form.List>
					</Col>

					<Col xs={24} sm={24} md={24}>
						<Button
							htmlType="submit"
							className="btn-main-invert"
							loading={isLoading}
						>
							SUBMIT
						</Button>
					</Col>
				</Row>
			</Form>
		</Modal>
	);
}
