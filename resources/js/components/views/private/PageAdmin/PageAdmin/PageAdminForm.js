import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import {
	Card,
	Col,
	Row,
	Form,
	Collapse,
	Radio,
	Divider,
	message,
	Upload,
	Typography,
	notification,
	Button,
} from "antd";

import ImgCrop from "antd-img-crop";

import FloatInput from "../../../../providers/FloatInput";
import FloatSelect from "../../../../providers/FloatSelect";
import FloatInputMask from "../../../../providers/FloatInputMask";
import FloatInputPasswordStrength from "../../../../providers/FloatInputPasswordStrength";
import { GET, POSTFILE } from "../../../../providers/useAxiosQuery";
import { apiUrl } from "../../../../providers/companyInfo";

export default function PageAdminForm(props) {
	const { location } = props;
	const [form] = Form.useForm();
	const history = useHistory();

	const [fileList, setFileList] = useState([]);
	const [radioData, setRadioData] = useState(1);
	const [imageCrop, setImageCrop] = useState({
		width: 1,
		height: 1,
	});

	if (location.state) {
		GET(`api/v1/users/${location.state}`, "subscriber_current_edit", (res) => {
			// console.log("res", res);
			if (res.data) {
				let data = { ...res.data, ...res.data.company };

				if (Number(data.photo_crop) === 1) {
					setImageCrop({
						width: 1,
						height: 1,
					});
					setRadioData(1);
				} else if (Number(data.photo_crop) === 2) {
					setImageCrop({
						width: 3.9,
						height: 2.6,
					});
					setRadioData(2);
				} else if (Number(data.photo_crop) === 3) {
					setImageCrop({
						width: 1,
						height: 1.5,
					});
					setRadioData(3);
				} else {
					setImageCrop({
						width: 1,
						height: 1,
					});
					setRadioData(1);
				}

				let profile_image = data.profile_image.split("//");
				let imgPath = "";
				if (profile_image[0] === "https:") {
					imgPath = data.profile_image;
				} else {
					imgPath = apiUrl + data.profile_image;
				}

				setFileList([
					{
						uid: "-1",
						name: "profile.png",
						status: "done",
						url: imgPath,
					},
				]);

				form.setFieldsValue({
					email: data.email,
					username: data.username,
					firstname: data.firstname,
					lastname: data.lastname,
					contact_number: data.contact_number,
					gender: data.gender,
					status: data.status,
				});
			}
		});
	}

	const { mutate: mutateUpdateCreate, isLoading: isLoadingUpdateCreate } =
		POSTFILE("api/v1/update_create_admin", "update_create_admin");

	const handleResize = (val) => {
		// console.log("val", val.target.value);
		setRadioData(val.target.value);
		if (val.target.value === 1) {
			setImageCrop({
				width: 1,
				height: 1,
			});
		} else if (val.target.value === 2) {
			setImageCrop({
				width: 3.9,
				height: 2.6,
			});
		} else if (val.target.value === 3) {
			setImageCrop({
				width: 1,
				height: 1.5,
			});
		}
	};

	const onChangeUpload = ({ fileList: newFileList }) => {
		var _file = newFileList;
		if (_file.length !== 0) {
			const isLt2M = _file[0].size / 1024 ** 2 > 2;
			if (isLt2M) {
				setFileList([]);
			} else {
				_file[0].status = "done";
				setFileList(_file);
				setTimeout(() => form.submit(), 500);
			}
		} else {
			setFileList([]);
		}
	};

	const onPreviewUpload = async (file) => {
		let src = file.url;
		if (!src) {
			src = await new Promise((resolve) => {
				const reader = new FileReader();
				reader.readAsDataURL(file.originFileObj);
				reader.onload = () => resolve(reader.result);
			});
		}
		const image = new Image();
		image.src = src;
		const imgWindow = window.open(src);
		imgWindow.document.write(image.outerHTML);
	};

	const beforeUpload = (file) => {
		const isJpgOrPng =
			file.type === "image/jpeg" ||
			file.type === "image/png" ||
			file.type === "image/gif" ||
			file.type === "image/jpg";
		if (!isJpgOrPng) {
			message.error("You can only upload JPG, PNG, GIF, JPEG file!");
			setFileList([]);
			return;
		}
		// const isLt2M = file.size / 1024 ** 2 > 2;
		// if (isLt2M) {
		// 	message.error("Image must smaller than 2MB!");
		// 	setFileList([]);
		// 	return;
		// }

		return isJpgOrPng;
		// return isJpgOrPng && isLt2M;
	};

	const beforeCrop = (file) => {
		const isLt2M = file.size / 1024 ** 2 > 2;
		if (isLt2M) {
			message.error("Image must smaller than 2MB!");
			setFileList([]);
			return false;
		} else {
			return true;
		}
	};

	const onFinish = (values) => {
		// console.log("values", values);
		let data = new FormData();
		let error = false;

		data.append("id", location.state ? location.state : "");
		data.append("email", values.email);
		data.append("username", values.username);
		data.append("password", values.password);
		data.append("firstname", values.firstname);
		data.append("lastname", values.lastname);
		data.append("gender", values.gender);
		data.append("status", values.status);

		data.append("role", "Admin");

		if (values.contact_number !== "" && values.contact_number !== undefined) {
			let newval = values.contact_number.split("_").join("");
			newval = newval.split(" ").join("");

			if (newval.length === 10) {
				data.append("contact_number", newval);
			} else {
				error = true;
				notification.error({
					message: "Profile Info",
					description: "Contact Number should 10 digits",
				});
			}
		}

		if (fileList.length > 0) {
			if (fileList[0].originFileObj !== undefined) {
				data.append(
					"profile_image",
					fileList[0].originFileObj,
					fileList[0].name
				);
				data.append("photo_crop", radioData);
			}
		}

		if (error === false) {
			mutateUpdateCreate(data, {
				onSuccess: (res) => {
					if (res.success) {
						notification.success({
							message: "User Admin",
							description: res.message,
						});

						history.push("/admin");
					} else {
						notification.error({
							message: "User Admin",
							description: res.message,
						});
					}
				},
				onError: (err) => {
					notification.error({
						message: "User Admin",
						description: err.response.data.message,
					});
				},
			});
		}
	};

	return (
		<Card className="page-admin-subscriber-edit" id="PageAdmin">
			<Form form={form} onFinish={onFinish}>
				<Row gutter={[12, 12]}>
					<Col xs={24} sm={24} md={24} lg={24} xl={16}>
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
							defaultActiveKey={["1", "2"]}
							expandIconPosition="start"
						>
							<Collapse.Panel
								header="ACCOUNT INFORMATION"
								key="1"
								className="accordion bg-darkgray-form m-b-md border "
							>
								<Row gutter={[12, 12]}>
									<Col xs={24} sm={24} md={24} lg={24}>
										<Form.Item
											name="email"
											hasFeedback
											rules={[
												{
													type: "email",
													message: "The input is not valid email!",
												},
												{
													required: true,
													message: "Please input your email!",
												},
											]}
										>
											<FloatInput
												label="Email"
												placeholder="Email"
												className="remove-double-border"
											/>
										</Form.Item>
									</Col>
									<Col xs={24} sm={24} md={24} lg={24}>
										<Form.Item
											name="username"
											rules={[
												{
													required: true,
													message: "This field is required.",
												},
											]}
										>
											<FloatInput
												label="Username"
												placeholder="Username"
												rules={[
													{
														required: true,
														message: "This field is required.",
													},
												]}
											/>
										</Form.Item>
									</Col>
									<Col xs={24} sm={24} md={24} lg={24}>
										<Form.Item
											name="password"
											rules={
												props.location.state
													? []
													: [
															{
																required: true,
																message: "Required",
															},
															{
																min: 8,
																message:
																	"Password must be minimum 8 characters.",
															},
													  ]
											}
											hasFeedback
										>
											<FloatInputPasswordStrength
												label="Password"
												placeholder="Password"
												className="remove-double-border"
											/>
										</Form.Item>
									</Col>
								</Row>
							</Collapse.Panel>

							<Collapse.Panel
								header="PERSONAL INFORMATION"
								key="2"
								className="accordion bg-darkgray-form m-b-md border "
							>
								<Row gutter={[12, 12]}>
									<Col xs={24} sm={24} md={24} lg={12}>
										<Form.Item
											name="firstname"
											rules={[
												{
													required: true,
													message: "This field is required.",
												},
											]}
										>
											<FloatInput label="First Name" placeholder="First Name" />
										</Form.Item>
									</Col>
									<Col xs={24} sm={24} md={24} lg={12}>
										<Form.Item
											name="lastname"
											rules={[
												{
													required: true,
													message: "This field is required.",
												},
											]}
										>
											<FloatInput label="Last Name" placeholder="Last Name" />
										</Form.Item>
									</Col>
									<Col xs={24} sm={24} md={24} lg={12}>
										<Form.Item name="contact_number">
											<FloatInputMask
												label="Cell Phone"
												placeholder="Cell Phone"
												maskLabel="contact_number"
												maskType="999 999 9999"
											/>
										</Form.Item>
									</Col>
									<Col xs={24} sm={24} md={24} lg={12}>
										<Form.Item name="gender" className="form-select-error">
											<FloatSelect
												label="Gender"
												placeholder="Gender"
												options={[
													{
														value: "Male",
														label: "Male",
													},
													{
														value: "Female",
														label: "Female",
													},
												]}
											/>
										</Form.Item>
									</Col>
									<Col xs={24} sm={24} md={24} lg={12}>
										<Form.Item
											name="status"
											className="form-select-error"
											rules={[
												{
													required: true,
													message: "This field is required.",
												},
											]}
										>
											<FloatSelect
												label="Status"
												placeholder="Status"
												options={[
													{
														value: "Active",
														label: "Active",
													},
													{
														value: "Deactive",
														label: "Deactive",
													},
												]}
											/>
										</Form.Item>
									</Col>
								</Row>
							</Collapse.Panel>
						</Collapse>
					</Col>

					<Col xs={24} sm={24} md={24} lg={24} xl={8}>
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
								header="PROFILE PHOTO"
								key="1"
								className="accordion bg-darkgray-form m-b-md border "
							>
								<Row gutter={[12, 12]}>
									<Col xs={24} sm={24} md={24} className="text-center">
										<label className="font-red">
											<b>Photo upload & cropping: select image orientation</b>
										</label>
										<br />
										<Radio.Group onChange={handleResize} value={radioData}>
											<Radio value={1}>Square</Radio>
											<Radio value={2}>Rectangle</Radio>
											<Radio value={3}>Portrait</Radio>
										</Radio.Group>
									</Col>
									<Divider />
									<Col xs={24} sm={24} md={24}>
										<div className="flex">
											<ImgCrop
												rotate
												aspect={imageCrop.width / imageCrop.height}
												modalTitle="Crop Image"
												beforeCrop={beforeCrop}
											>
												<Upload
													accept="image/*"
													listType="picture-card"
													style={{ width: "200px" }}
													maxCount={1}
													action={false}
													customRequest={false}
													fileList={fileList}
													onChange={onChangeUpload}
													onPreview={onPreviewUpload}
													beforeUpload={beforeUpload}
													className="profilePhoto"
												>
													{fileList.length < 1 && "+ Upload"}
												</Upload>
											</ImgCrop>
										</div>
									</Col>
									<Divider />
									<Col xs={24} sm={24} md={24}>
										<Typography.Text>
											Only 1 file. 2 MB limit.
											<br />
											Allowed types: png, gif, jpg, jpeg
											<br />
											You selected profile photo will be visible to all users.
										</Typography.Text>
									</Col>
								</Row>
							</Collapse.Panel>
						</Collapse>
					</Col>
					<Col xs={24} sm={24} md={24}>
						<Button
							className="btn-main-invert"
							loading={isLoadingUpdateCreate}
							htmlType="submit"
							size="large"
						>
							SUBMIT
						</Button>
					</Col>
				</Row>
			</Form>
		</Card>
	);
}
