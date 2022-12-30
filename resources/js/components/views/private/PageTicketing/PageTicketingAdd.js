import React from "react";
import { Button, Card, Col, Form, notification, Row } from "antd";
import FloatSelect from "../../../providers/FloatSelect";
import FloatInput from "../../../providers/FloatInput";
import FloatTextArea from "../../../providers/FloatTextArea";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/pro-regular-svg-icons";
import { POST } from "../../../providers/useAxiosQuery";
import { useHistory } from "react-router-dom";
import { role } from "../../../providers/companyInfo";

export default function PageTicketingAdd() {
	const history = useHistory();
	const [form] = Form.useForm();

	const { mutate: mutateCreate, isLoading: isLoadingCreate } = POST(
		"api/v1/ticket",
		"ticket"
	);

	const onFinish = (values) => {
		let data = { ...values, link_origin: window.location.origin };
		mutateCreate(data, {
			onSuccess: (res) => {
				if (res.success) {
					notification.success({
						message: "Success",
						description: "Successfully created",
					});
					form.resetFields();

					if (role === "Athlete") {
						history.push("/support/ticketing");
					} else {
						history.push("/ticketing");
					}
				}
			},
		});
	};

	return (
		<Card id="PageTicketingAdd">
			<Form layout="vertical" form={form} onFinish={onFinish}>
				<Row gutter={[12, 12]}>
					<Col xs={24} sm={24} md={24} lg={24} xl={14}>
						<Card
							title="TICKETING INFORMATION"
							className="card-dark-head card-main"
						>
							<Row gutter={12}>
								<Col xs={24} sm={24} md={24}>
									<Form.Item
										name="priority"
										className="form-select-error"
										rules={[
											{
												required: true,
												message: "This field is required.",
											},
										]}
									>
										<FloatSelect
											label="Priority"
											placeholder="Priority"
											options={[
												{
													label: "Low",
													value: "Low",
												},
												{
													label: "Medium",
													value: "Medium",
												},
												{
													label: "High",
													value: "High",
												},
												{
													label: "Urgent",
													value: "Urgent",
												},
											]}
										/>
									</Form.Item>
								</Col>

								<Col xs={24} sm={24} md={24}>
									<Form.Item
										name="subject"
										rules={[
											{
												required: true,
												message: "This field is required.",
											},
										]}
									>
										<FloatInput label="Subject" placeholder="Subject" />
									</Form.Item>
								</Col>

								<Col xs={24} sm={24} md={24}>
									<Form.Item
										name="comments"
										rules={[
											{
												required: true,
												message: "This field is required.",
											},
										]}
									>
										<FloatTextArea
											label="Description"
											placeholder="Description"
										/>
									</Form.Item>
								</Col>

								<Col xs={24} sm={24} md={24}>
									<Button
										htmlType="submit"
										className="btn-main-invert-outline b-r-none"
										size="large"
										loading={isLoadingCreate}
									>
										<FontAwesomeIcon icon={faSave} /> &nbsp; CREATE
									</Button>
								</Col>
							</Row>
						</Card>
					</Col>
				</Row>
			</Form>
		</Card>
	);
}
