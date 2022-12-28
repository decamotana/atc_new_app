// import { useHistory } from "react-router-dom";
import { Layout, Card, Form, Input, Button, Divider, message } from "antd";
import { UserOutlined, LockOutlined, LoginOutlined } from "@ant-design/icons";
// import { POST, UPDATE, DELETE, POSTFILE } from "../../../providers/useAxiosQuery";
import companyInfo from "../../../providers/companyInfo";

const logo = companyInfo().logo;
const title = companyInfo().title;
const description = companyInfo().description;

const PagePortal = () => {
	// const history = useHistory();

	// const { mutate: mutateLogin, isLoading: isLoadingLogin } = POST("api/login", "asdasd");

	message.config({ top: 200 });

	const onFinish = (values) => {
		
	};

	return (
		<Layout className="ant-layout-login">
			<Card className="p-t-md p-b-sm" cover={<img alt={title} src={logo} />}>
				<Card.Meta
					className="text-center m-b-md"
					title={<Divider className="m-n">{title} LOGIN</Divider>}
					description={description}
				/>

				<Form
					name="normal_login"
					className="ant-form-login"
					onFinish={onFinish}
				>
					<Form.Item
						name="member_user"
						rules={[{ required: true, message: "Please input your username!" }]}
						className="m-b-sm"
					>
						<Input
							prefix={<UserOutlined className="site-form-item-icon" />}
							placeholder="Username"
						/>
					</Form.Item>
					<Form.Item
						name="member_pass"
						rules={[{ required: true, message: "Please input your password!" }]}
						className="m-b-sm"
					>
						<Input.Password
							prefix={<LockOutlined className="site-form-item-icon" />}
							placeholder="Password"
						/>
					</Form.Item>

					<Form.Item className="text-center m-t-sm">
						<Button
							type="primary"
							htmlType="submit"
							style={{ width: "100%" }}
							// loading={isLoadingLogin}
							icon={<LoginOutlined />}
						>
							LOGIN
						</Button>
					</Form.Item>
				</Form>

				<Divider />

				<Card.Meta
					className="text-center"
					description={`${title} © 2021 V. 2.0`}
				/>
			</Card>
		</Layout>
	);
};

export default PagePortal;
