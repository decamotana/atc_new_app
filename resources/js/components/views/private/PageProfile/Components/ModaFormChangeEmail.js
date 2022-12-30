import { Button, Col, Form, Modal, notification, Row } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/pro-solid-svg-icons";
import { userData } from "../../../../providers/companyInfo";
import { POST } from "../../../../providers/useAxiosQuery";
import FloatInput from "../../../../providers/FloatInput";

const validator = {
	require: {
		required: true,
		message: "Required",
	},
	email: {
		type: "email",
		message: "The input is not valid email!",
	},
};

export default function ModaFormChangeEmail(props) {
	const {
		toggleModalFormChangeEmail,
		setToggleModalFormChangeEmail,
		onFinishFormEmailCode,
		isLoadingEmailCode,
		changeEmail,
		setChangeEmail,
	} = props;

	const [form1] = Form.useForm();
	const [form2] = Form.useForm();

	const { mutate: mutateEmail, isLoading: isLoadingEmail } = POST(
		"api/v1/profile_change_email",
		"profile_change_email"
	);

	const onFinishForm1 = (values) => {
		let data = {
			...values,
			id: userData().id,
			link_origin: window.location.origin,
		};

		mutateEmail(data, {
			onSuccess: (res) => {
				if (res.success) {
					// console.log(res)
					notification.success({
						message: "Change Email",
						description: res.message,
					});
					setChangeEmail(values.email);
				} else {
					notification.error({
						message: "Change Email",
						description: res.message,
					});
				}
			},
			onError: (err) => {
				notification.error({
					message: "Change Email",
					description: err.response.data.message,
				});
			},
		});
	};

	return (
		<Modal
			title="CHANGE EMAIL"
			open={toggleModalFormChangeEmail}
			closeIcon={<FontAwesomeIcon icon={faTimes} />}
			footer={null}
			onCancel={() => setToggleModalFormChangeEmail(false)}
			className="modal-primary-default modal-change-password"
		>
			{!changeEmail ? (
				<Form layout="vertical" form={form1} onFinish={onFinishForm1}>
					<Row gutter={[12, 12]}>
						<Col xs={24} sm={24} md={24} className="m-b-sm">
							<Form.Item
								name="email"
								rules={[validator.require, validator.email]}
								hasFeedback
							>
								<FloatInput label="New Email" placeholder="New Email" />
							</Form.Item>

							<Button
								size="large"
								className="btn-main-invert-outline"
								loading={isLoadingEmail}
								htmlType="submit"
							>
								SUBMIT
							</Button>
						</Col>
					</Row>
				</Form>
			) : null}

			{changeEmail ? (
				<Form layout="vertical" form={form2} onFinish={onFinishFormEmailCode}>
					<Row gutter={[12, 12]}>
						<Col xs={24} sm={24} md={24}>
							<Form.Item name="code" rules={[validator.require]} hasFeedback>
								<FloatInput label="Code" placeholder="Code" />
							</Form.Item>
							<Button
								size="large"
								className="btn-main-invert-outline"
								loading={isLoadingEmailCode}
								htmlType="submit"
							>
								SUBMIT
							</Button>
						</Col>
					</Row>
				</Form>
			) : null}
		</Modal>
	);
}
