import { Button, Col, Form, Modal, Row, Typography } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/pro-solid-svg-icons";
import FloatSelect from "../../../../../../providers/FloatSelect";
import { GET } from "../../../../../../providers/useAxiosQuery";
import { useEffect } from "react";

export default function ModalCloneLesson(props) {
	const { cloneLessonTo, setCloneLessonTo, onFinish, isLoading } = props;
	const [form] = Form.useForm();

	const { data: dataModules, refetch: refetchModules } = GET(
		`api/v1/module?filter_module_for=${cloneLessonTo.clone_to}`,
		"module_select"
	);

	useEffect(() => {
		if (dataModules) {
			refetchModules();
		}

		return () => {};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [cloneLessonTo]);

	return (
		<Modal
			open={cloneLessonTo.open}
			onCancel={() =>
				setCloneLessonTo({
					open: false,
					data: null,
					clone_to: null,
				})
			}
			footer={null}
			className="modal-clone-lesson"
			centered
			closeIcon={<FontAwesomeIcon icon={faTimes} />}
		>
			<Form form={form} onFinish={onFinish}>
				<Row gutter={[12, 12]}>
					<Col xs={24} sm={24} md={24}>
						<Typography.Title
							level={5}
							className="text-center m-t-md"
							style={{ fontWeight: 600 }}
						>
							You are about to clone this lesson to{" "}
							<div className="color-6">{cloneLessonTo.clone_to}</div>
						</Typography.Title>
					</Col>

					<Col xs={24} sm={24} md={24}>
						<Form.Item
							name="module_id"
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
								label="Select module to clone to"
								placeholder="Select module to clone to"
								options={
									dataModules
										? dataModules.data.map((item) => {
												return {
													value: item.id,
													label: `${item.module_number} - ${item.module_name}`,
												};
										  })
										: []
								}
							/>
						</Form.Item>
					</Col>

					<Col xs={24} sm={24} md={24} className="text-right">
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
