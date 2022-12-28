import { useHistory } from "react-router-dom";
import {
	Layout,
	Card,
	Form,
	Input,
	Button,
	Divider,
	Row,
	Col,
	message,
} from "antd";
import { KeyOutlined } from "@ant-design/icons";
import { POST } from "../../../providers/useAxiosQuery";
import companyInfo from "../../../providers/companyInfo";

const logo = companyInfo().logo;
const title = companyInfo().title;
const description = companyInfo().description;
const encryptor = companyInfo().encryptor;

const PageLoginConfirm = () => {
	const history = useHistory();
	const dataHist = history.location.state;

	message.config({ top: 200 });

	const { mutate: mutateRequest, isLoading: isLoadingRequest } = POST(
		"api/login/request_new"
	);

	const { mutate: mutateConfirm, isLoading: isLoadingConfirm } =
		POST("api/login/confirm");

	const handleRequest = () => {
		mutateRequest(dataHist, {
			onSuccess: (res) => {
				if (res.success) {
					message.success("Request new access key success!");
				}
			},
			onError: (err) => {
				message.error(err.response.data.error);
			},
		});
	};

	const onFinish = (values) => {
		const data = { ...values, ...dataHist, system: 1 };
		mutateConfirm(data, {
			onSuccess: (res) => {
				if (res.role === "1" || res.role === "2") {
					if (res.token) {
						const userdata = {
							token: res.token,
							data: res.data,
							usersec: res.usersec,
						};
						localStorage.userdata = encryptor.encrypt(userdata);

						window.location.reload();
					}
				} else {
					message.error("Unauthorized login!");
				}
			},
			onError: (err) => {
				message.error(err.response.data.error);
			},
		});
	};

	return (
		<Layout className="ant-layout-login">
			<Card cover={<img alt={title} src={logo} />}>
				<Card.Meta
					className="text-center m-b-md"
					title={<Divider className="m-n">{title} CONFIRM</Divider>}
					description={description}
				/>

				<Form
					name="normal_login"
					className="ant-form-login"
					onFinish={onFinish}
				>
					<Form.Item
						name="access_key"
						rules={[
							{ required: true, message: "Please input your access key!" },
						]}
						className="m-b-sm"
					>
						<Input
							prefix={<KeyOutlined className="site-form-item-icon" />}
							placeholder="Access key"
						/>
					</Form.Item>

					<Row gutter={12} className="m-b-md">
						<Col span={12}>
							<Button
								style={{ width: "100%" }}
								loading={isLoadingRequest}
								onClick={() => handleRequest()}
							>
								REQUEST
							</Button>
						</Col>
						<Col span={12}>
							<Button
								type="primary"
								htmlType="submit"
								style={{ width: "100%" }}
								loading={isLoadingConfirm}
							>
								CONFIRM
							</Button>
						</Col>
					</Row>
				</Form>

				<Card.Meta
					className="text-center"
					description={`${title} © 2021 V. 2.0`}
				/>
			</Card>
		</Layout>
	);
};

export default PageLoginConfirm;
