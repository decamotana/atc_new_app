import { useEffect } from "react";
import { Button, Col, Collapse, Form, notification, Row } from "antd";
import { POST } from "../../../providers/useAxiosQuery";

import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import ImageResize from "quill-image-resize-module-react";
import {
	formats,
	modulesToolBarV2,
} from "../../../providers/reactQuillOptions";
Quill.register("modules/imageResize", ImageResize);

export default function PageCookiePolicyForm(props) {
	const { dataSource } = props;
	const [form] = Form.useForm();

	useEffect(() => {
		form.setFieldsValue({
			content:
				dataSource && dataSource.data && dataSource.data.content
					? dataSource.data.content
					: "",
		});

		return () => {};
	}, [form, dataSource]);

	const { mutate: mutateUpdate, isLoading: isLoadingUpdate } = POST(
		"api/v1/cookie_policy",
		"cookie_policy"
	);

	const onFinish = (values) => {
		let data = { id: dataSource?.data?.id, ...values };
		mutateUpdate(data, {
			onSuccess: (res) => {
				if (res.success) {
					notification.success({
						message: "Cookie Policy",
						description: res.message,
					});
				} else {
					notification.error({
						message: "Cookie Policy",
						description: res.message,
					});
				}
			},
			onError: (err) => {
				notification.error({
					message: "Cookie Policy",
					description: err.response.data.message,
				});
			},
		});
	};

	return (
		<Row gutter={[12, 12]}>
			<Col xs={24} sm={24} md={24} lg={14}>
				<Collapse
					className="main-1-collapse border-none"
					expandIcon={({ isActive }) =>
						isActive ? (
							<span
								className="ant-menu-submenu-arrow"
								style={{ color: "#FFF", transform: "rotate(270deg)" }}
							></span>
						) : (
							<span
								className="ant-menu-submenu-arrow"
								style={{ color: "#FFF", transform: "rotate(90deg)" }}
							></span>
						)
					}
					defaultActiveKey={["1"]}
					expandIconPosition="start"
				>
					<Collapse.Panel
						header="COOKIE POLICY"
						key="1"
						className="accordion bg-darkgray-form m-b-md border "
					>
						<Form
							form={form}
							onFinish={onFinish}
							initialValues={{ content: "" }}
						>
							<Form.Item name="content">
								<ReactQuill
									theme="snow"
									style={{ height: 200 }}
									formats={formats}
									modules={modulesToolBarV2}
								/>
							</Form.Item>
							<Button
								htmlType="submit"
								className="btn-main-invert"
								loading={isLoadingUpdate}
								size="large"
							>
								SUBMIT
							</Button>
						</Form>
					</Collapse.Panel>
				</Collapse>
			</Col>
		</Row>
	);
}
