import React, { useState } from "react";
import { Card, Collapse, Form, Input, notification } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faAngleDown, faAngleUp } from "@fortawesome/pro-regular-svg-icons";

import FloatInput from "../../../../providers/FloatInput";

import {
	formats,
	modulesToolBar,
} from "../../../../providers/reactQuillOptions";
import { GET, POST } from "../../../../providers/useAxiosQuery";

import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import ImageResize from "quill-image-resize-module-react";
Quill.register("modules/imageResize", ImageResize);

export default function PageEmailTemplates() {
	const [dataSource, setDataSource] = useState([]);

	const [form] = Form.useForm();

	GET(`api/v1/email_template`, "email_template_list", (res) => {
		if (res.success) {
			let newdata = res.data;
			let data = [
				{ title: "ACCOUNT CANCELLATION", body: "" },
				// { title: "FORGOT / CHANGE PASSWORD", body: "" },
				{ title: "PASSWORD RESET", body: "" },
				{ title: "PASSWORD RESET NOTIFICATION", body: "" },
				{ title: "REGISTRATION EMAIL - CANCER CAREGIVER", body: "" },
				{ title: "REGISTRATION EMAIL - CANCER CARE PROFESSIONAL", body: "" },
				{ title: "TICKET CREATED (TO ADMIN)", body: "" },
				{ title: "TICKET CREATED (TO USER)", body: "" },
				{ title: "TICKET HAS BEEN CLOSED (TO BOTH USER & ADMIN)", body: "" },
				{ title: "WE REPLIED TO YOUR TICKET", body: "" },
				{ title: "YOU HAVE A NEW INSTANT MESSAGE", body: "" },
				{ title: "INVITE PEOPLE", body: "" },
				{ title: "ACCOUNT DEACTIVATION - (BY ADMIN)", body: "" },
				{ title: "ACCOUNT ACTIVATION - (BY ADMIN)", body: "" },
				{ title: "CUSTOMER UPDATED TICKET EMAIL", body: "" },
				{ title: "THANK YOU FOR YOUR ORDER EMAIL", body: "" },
				{ title: "CHANGE EMAIL VERIFICATION", body: "" },
			];

			data.forEach(
				(dataItem) =>
					newdata.find(({ title }) => title === dataItem.title) ||
					newdata.push(dataItem)
			);

			// console.log("newdata", newdata);

			setDataSource(newdata);

			form.setFieldsValue({
				list: newdata,
			});
		}
	});

	const {
		mutate: mutateEmailTemplate,
		// isLoading: isLoadingEmailTemplate,
	} = POST("api/v1/email_template", "email_template_list");

	const onFinish = (values) => {
		// console.log("onFinish", values);

		mutateEmailTemplate(values, {
			onSuccess: (res) => {
				// console.log("mutateEmailTemplate", res);
				if (res.success) {
					notification.success({
						message: "Email Template",
						description: "Successfully Updated",
					});
				} else {
					notification.error({
						message: "Email Template",
						description: "Data not updated!",
					});
				}
			},
			onError: (err) => {
				notification.error({
					message: "Email Template",
					description: err.response.data.message,
				});
			},
		});
	};

	const handleBlurSave = (value, index, field) => {
		// console.log("value", value);
		// console.log("field", field);
		// console.log("dataSource", dataSource);
		// console.log("dataSource[index]", dataSource[index]);
		// console.log("dataSource[index][field]", dataSource[index][field]);

		if (dataSource[index][field] !== value) {
			form.submit();
		}
	};

	return (
		<Card id="PageEmailTemplates" className="page_admin_email_template">
			<Form form={form} onFinish={onFinish}>
				<Form.List name="list">
					{(fields, { add, remove }) => (
						<>
							{fields.map(({ key, name, ...restField }, index) => (
								<Collapse
									accordion
									expandIconPosition="end"
									expandIcon={({ isActive }) =>
										isActive ? (
											<FontAwesomeIcon icon={faAngleUp} />
										) : (
											<FontAwesomeIcon icon={faAngleDown} />
										)
									}
									className="ant-collapse-primary"
									key={`${index}`}
									defaultActiveKey={["0"]}
								>
									<Collapse.Panel
										header={dataSource[index].title}
										key={index === 0 ? "0" : "1"}
									>
										<Form.Item
											{...restField}
											name={[name, "id"]}
											className="m-b-md hide"
										>
											<Input />
										</Form.Item>

										<Form.Item
											{...restField}
											name={[name, "title"]}
											className="m-b-md hide"
										>
											<FloatInput label="Title" placeholder="Title" />
										</Form.Item>

										<Form.Item
											{...restField}
											name={[name, "subject"]}
											className="m-b-sm form-select-error"
											hasFeedback
											rules={[
												{
													required: true,
													message: "This field is required.",
												},
											]}
										>
											<FloatInput
												label="Subject"
												placeholder="Subject"
												onBlurInput={(e) => handleBlurSave(e, name, "subject")}
											/>
										</Form.Item>

										<Form.Item
											{...restField}
											name={[name, "body"]}
											className="m-b-sm"
											hasFeedback
											rules={[
												{
													required: true,
													message: "This field is required.",
												},
											]}
										>
											<ReactQuill
												className="ticket-quill"
												theme="snow"
												style={{ height: 250 }}
												modules={modulesToolBar}
												formats={formats}
												// onChange={(e) => console.log(e)}
												onBlur={(range, source, quill) =>
													handleBlurSave(quill.getHTML(), name, "body")
												}
											/>
										</Form.Item>
									</Collapse.Panel>
								</Collapse>
							))}
						</>
					)}
				</Form.List>
			</Form>
		</Card>
	);
}
