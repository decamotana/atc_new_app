import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import {
	Button,
	Card,
	Col,
	Collapse,
	Form,
	message,
	notification,
	Row,
	Switch,
	Typography,
	Upload,
} from "antd";
import FloatInput from "../../../../../providers/FloatInput";

import {
	formats,
	modulesToolBarV2,
} from "../../../../../providers/reactQuillOptions";

import imagePreviewDefault from "../../../../../assets/img/image_preview-default.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileArrowUp } from "@fortawesome/pro-regular-svg-icons";
import getBase64Image from "../../../../../providers/getBase64Image";
import { GET, POSTFILE } from "../../../../../providers/useAxiosQuery";
import { apiUrl } from "../../../../../providers/companyInfo";
import FloatDatePicker from "../../../../../providers/FloatDatePicker";
import FloatInputNumber from "../../../../../providers/FloatInputNumber";

import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import ImageResize from "quill-image-resize-module-react";
import moment from "moment";
Quill.register("modules/imageResize", ImageResize);

export default function PageResourceLibraryOnlineForm(props) {
	const { location } = props;
	const history = useHistory();

	const [form] = Form.useForm();
	const [fileImage, setFileImage] = useState({
		fileUrl: "",
		file: "",
		fileName: "",
	});
	const [fileImageSponsor, setFileImageSponsor] = useState({
		fileUrl: "",
		file: "",
		fileName: "",
	});

	if (location.state) {
		GET(`api/v1/resource/${location.state}`, "online_resource_info", (res) => {
			if (res.data) {
				let data = res.data;
				form.setFieldsValue({
					...data,
					sponsor_name:
						data.sponsor_name && data.sponsor_name !== "undefined"
							? data.sponsor_name
							: "",
					sponsor_amount:
						data.sponsor_amount && data.sponsor_amount !== "undefined"
							? data.sponsor_amount
							: "",
					priority: data.priority === "High" ? true : false,
				});

				if (data.file_path) {
					setFileImage({
						fileUrl: apiUrl + "storage/" + data.file_path,
						file: "",
						fileName: "",
					});
				}
				if (data.sponsor_file_path) {
					setFileImageSponsor({
						fileUrl: apiUrl + "storage/" + data.sponsor_file_path,
						file: "",
						fileName: "",
					});
				}
			}
		});
	}

	const {
		mutate: mutateCreateUpdateResource,
		isLoading: isLoadingCreateUpdateResource,
	} = POSTFILE("api/v1/resource", "online_resource_create_update");

	const propsUploadImage = {
		name: "file_image",
		accept: "image/tiff,image/jpeg,image/png",
		showUploadList: false,
		beforeUpload: (file) => {
			// console.log("file", file);
			let error = false;
			const isLt2M = file.size / 102400 / 102400 < 10;
			if (!isLt2M) {
				message.error("Image must smaller than 10MB!");
				error = Upload.LIST_IGNORE;
			} else {
				getBase64Image(file, (imageUrl) =>
					setFileImage({
						fileUrl: imageUrl,
						file: file,
						fileName: file.name,
					})
				);
			}
			return error;
		},
	};

	const propsUploadImageSponsor = {
		name: "file_image",
		accept: "image/jpeg,image/jpg,image/png",
		showUploadList: false,
		beforeUpload: (file) => {
			// console.log("file", file);
			let error = false;
			const isLt2M = file.size / 102400 / 102400 < 10;
			if (!isLt2M) {
				message.error("Image must smaller than 10MB!");
				error = Upload.LIST_IGNORE;
			} else {
				getBase64Image(file, (imageUrl) =>
					setFileImageSponsor({
						fileUrl: imageUrl,
						file: file,
						fileName: file.name,
					})
				);
			}
			return error;
		},
	};

	const handleOnFinish = (values) => {
		// console.log("handleOnFinish", values);

		let error = false;

		let data = new FormData();

		data.append("id", location.state ? location.state : "");
		data.append("title", values.title ?? "");
		data.append("description", values.description ?? "");
		data.append("url_link", values.url_link ?? "");
		data.append("sponsor_name", values.sponsor_name ?? "");
		data.append("sponsor_email", values.sponsor_email ?? "");
		data.append("sponsor_url", values.sponsor_url ?? "");
		data.append("sponsor_amount", values.sponsor_amount ?? "");
		data.append("file_path_status", values.file_path_status ? 1 : 0);
		data.append("status", values.status ? 1 : 0);
		data.append("ccg_display", values.ccg_display ? 1 : 0);
		data.append("ccp_display", values.ccp_display ? 1 : 0);
		data.append("resource_type", "Online Resource");
		data.append("priority", values.priority ? "High" : "Low");
		data.append(
			"start_date",
			values.start_date ? moment(values.start_date).format("YYYY-MM-DD") : ""
		);
		data.append(
			"end_date",
			values.end_date ? moment(values.end_date).format("YYYY-MM-DD") : ""
		);

		if (fileImage.file) {
			data.append("image", fileImage.file, fileImage.fileName);
		}
		if (fileImageSponsor.file) {
			data.append(
				"fileImageSponsor",
				fileImageSponsor.file,
				fileImageSponsor.fileName
			);
		}

		if (!location.state && !fileImage.file) {
			error = true;
			notification.error({
				message: "Online Resource Library",
				description: "Please upload IMAGE file to have default preview",
			});
		}

		if (error === false) {
			mutateCreateUpdateResource(data, {
				onSuccess: (res) => {
					if (res.success) {
						notification.success({
							message: "Online Resource",
							description: res.message,
						});
						history.push("/resource-library/online-resources");
					} else {
						notification.error({
							message: "Online Resource",
							description: res.message,
						});
					}
				},
				onError: (err) => {
					notification.error({
						message: "Online Resource",
						description: err.response.data.message,
					});
				},
			});
		}
	};

	return (
		<Card
			className="page-admin-resource-library-online"
			id="PageResourceLibraryOnlineForm"
		>
			<Form
				form={form}
				initialValues={{
					description: "",
					file_path_status: 1,
					status: 1,
					ccg_display: 1,
					ccp_display: 1,
				}}
				onFinish={handleOnFinish}
			>
				<Row gutter={[12, 12]}>
					<Col xs={24} sm={24} md={24} lg={24} xl={12}>
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
								header="ADD NEW ONLINE RESOURCE"
								key="1"
								className="accordion bg-darkgray-form m-b-md border bgcolor-1 white"
							>
								<Row gutter={[12, 12]}>
									<Col xs={24} sm={24} md={24}>
										<Form.Item
											name="title"
											rules={[
												{
													required: true,
													message: "This field is required.",
												},
											]}
										>
											<FloatInput label="Title" placeholder="Title" />
										</Form.Item>
									</Col>
									<Col
										xs={24}
										sm={24}
										md={24}
										className="m-b-mob-resp-15px-468px m-b-mob-resp-50px-375px m-b-mob-resp-50px-320px"
									>
										<Form.Item name="description">
											<ReactQuill
												theme="snow"
												style={{ height: 200 }}
												formats={formats}
												modules={modulesToolBarV2}
												placeholder="Short Description (300 max characters)"
											/>
										</Form.Item>
									</Col>
									<Col xs={24} sm={24} md={24}>
										<Form.Item
											name="url_link"
											rules={[
												{
													required: true,
													message: "This field is required.",
												},
											]}
										>
											<FloatInput label="URL Link" placeholder="URL Link" />
										</Form.Item>
									</Col>
									<Col xs={24} sm={24} md={24}>
										<Row gutter={[12, 12]}>
											<Col xs={24} sm={12} md={12}>
												<div className="ant-space-flex-space-between w-100">
													<div>
														Default to Online Image
														<br />
														or Manually to Online Image <br />
														(tiff, jpeg or png accepted)
													</div>
													<div>
														<Form.Item
															name="file_path_status"
															valuePropName="checked"
															noStyle
														>
															<Switch />
														</Form.Item>
													</div>
												</div>
												<div className="m-t-md section-upload">
													<Upload
														className="upload-w-100"
														{...propsUploadImage}
													>
														<Button
															icon={
																<FontAwesomeIcon
																	icon={faFileArrowUp}
																	className="m-r-xs"
																/>
															}
															className="btn-main-2-outline "
															size="large"
														>
															{"Upload Image"}
														</Button>
													</Upload>
												</div>
											</Col>
											<Col
												xs={24}
												sm={12}
												md={12}
												className="section-image-preview"
											>
												<Typography.Title level={5} className="color-1">
													Image Preview
												</Typography.Title>

												<img
													alt={
														fileImage.fileName
															? fileImage.fileName
															: "image preview"
													}
													src={
														fileImage.fileUrl
															? fileImage.fileUrl
															: imagePreviewDefault
													}
													style={{ width: "150px" }}
												/>
											</Col>
										</Row>
									</Col>

									<Col xs={24} sm={12} md={12}>
										<div className="ant-space-flex-space-between w-100">
											<div>Toggle off to set to draft</div>
											<div>
												<Form.Item
													name="status"
													valuePropName="checked"
													noStyle
												>
													<Switch />
												</Form.Item>
											</div>
										</div>
									</Col>
									<Col xs={24} sm={12} md={12}>
										<Typography.Title level={5} className="color-1">
											Display Resource On:
										</Typography.Title>

										<div className="ant-space-flex-space-between w-100">
											<div>Cancer Caregivers</div>
											<div>
												<Form.Item
													name="ccg_display"
													valuePropName="checked"
													noStyle
												>
													<Switch />
												</Form.Item>
											</div>
										</div>

										<div className="ant-space-flex-space-between w-100 m-t-xs">
											<div>Cancer Care Professional</div>
											<div>
												<Form.Item
													name="ccp_display"
													valuePropName="checked"
													noStyle
												>
													<Switch />
												</Form.Item>
											</div>
										</div>
									</Col>
								</Row>
							</Collapse.Panel>
						</Collapse>
					</Col>

					<Col xs={24} sm={24} md={24} lg={24} xl={12}>
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
								header="ADVERTISEMENT"
								key="1"
								className="accordion bg-darkgray-form m-b-md border bgcolor-1 white"
							>
								<Row gutter={[12, 12]}>
									<Col xs={24} sm={24} md={24}>
										<div className="ant-space-flex-space-between w-100">
											<div>
												<Typography.Title level={5} className="color-1">
													Is Priority?
												</Typography.Title>
											</div>
											<div>
												<Form.Item
													name="priority"
													valuePropName="checked"
													noStyle
												>
													<Switch />
												</Form.Item>
											</div>
										</div>
									</Col>
									<Col xs={24} sm={24} md={24}>
										<div className="flex flex-direction-column flex-justify-content-center flex-align-items-center">
											<img
												alt={
													fileImageSponsor.fileName
														? fileImageSponsor.fileName
														: "image preview"
												}
												src={
													fileImageSponsor.fileUrl
														? fileImageSponsor.fileUrl
														: imagePreviewDefault
												}
												style={{ width: "150px" }}
											/>

											<Upload
												className="upload-w-100 m-t-sm"
												{...propsUploadImageSponsor}
											>
												<Button
													icon={
														<FontAwesomeIcon
															icon={faFileArrowUp}
															className="m-r-xs"
														/>
													}
													className="btn-main-2-outline "
													size="large"
												>
													{"Upload Image"}
												</Button>
											</Upload>
										</div>
									</Col>
									<Col xs={24} sm={24} md={24}>
										<Form.Item name="sponsor_name">
											<FloatInput
												label="Sponsor Name"
												placeholder="Sponsor Name"
											/>
										</Form.Item>
									</Col>
									<Col xs={24} sm={24} md={24}>
										<Form.Item
											name="sponsor_email"
											rules={[
												{
													type: "email",
													message: "The input is not valid email!",
												},
											]}
										>
											<FloatInput
												label="Sponsor Email"
												placeholder="Sponsor Email"
											/>
										</Form.Item>
									</Col>
									<Col xs={24} sm={24} md={24}>
										<Form.Item name="sponsor_url">
											<FloatInput
												label="Sponsor URL"
												placeholder="Sponsor URL"
											/>
										</Form.Item>
									</Col>
									<Col xs={24} sm={24} md={24}>
										<Form.Item name="sponsor_amount">
											<FloatInputNumber
												label="Amount"
												placeholder="Amount"
												addonBefore="$"
												className="has-input-addon-before length-string-1"
											/>
										</Form.Item>
									</Col>
									<Col xs={24} sm={12} md={12}>
										<Form.Item name="start_date">
											<FloatDatePicker
												label="Start Date"
												placeholder="Start Date"
											/>
										</Form.Item>
									</Col>
									<Col xs={24} sm={12} md={12}>
										<Form.Item name="end_date">
											<FloatDatePicker
												label="End Date"
												placeholder="End Date"
											/>
										</Form.Item>
									</Col>
								</Row>
							</Collapse.Panel>
						</Collapse>
					</Col>
					<Col xs={24} sm={24} md={24}>
						<Button
							className="btn-main-invert"
							loading={isLoadingCreateUpdateResource}
							htmlType="submit"
							size="large"
						>
							APPLY
						</Button>
					</Col>
				</Row>
			</Form>
		</Card>
	);
}
