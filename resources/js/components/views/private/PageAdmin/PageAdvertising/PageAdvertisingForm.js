import { useState } from "react";
import { useHistory } from "react-router-dom";
import {
	Alert,
	Button,
	Card,
	Col,
	Collapse,
	Form,
	notification,
	Popconfirm,
	Row,
	Select,
	Typography,
	Upload,
} from "antd";
import FloatInput from "../../../../providers/FloatInput";
import FloatInputNumber from "../../../../providers/FloatInputNumber";
import FloatSelect from "../../../../providers/FloatSelect";
import { DELETE, GET, POSTFILE } from "../../../../providers/useAxiosQuery";
import FloatInputMask from "../../../../providers/FloatInputMask";
import optionCountryCodes from "../../../../providers/optionCountryCodes";
import optionStateCodesUnitedState from "../../../../providers/optionStateCodesUnitedState";
import optionStateCodesCanada from "../../../../providers/optionStateCodesCanada";
import getBase64Image from "../../../../providers/getBase64Image";
import { apiUrl } from "../../../../providers/companyInfo";
import FloatDatePicker from "../../../../providers/FloatDatePicker";
import moment from "moment";
import AdvertisingGraph from "./Components/AdvertisingGraph";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrashAlt } from "@fortawesome/pro-regular-svg-icons";

export default function PageAdvertisingForm({ location }) {
	const history = useHistory();
	const [form] = Form.useForm();
	const [selectedData, setSelectedData] = useState();
	const [imageUrl, setImageUrl] = useState(null);
	const [imageFile, setImageFile] = useState(null);
	const [placement, setPlacement] = useState(null);

	const stateUS = optionStateCodesUnitedState();
	const stateCA = optionStateCodesCanada();

	const [optionState, setOptionState] = useState([]);
	const [stateLabel, setStateLabel] = useState("State");
	const [optionZip, setOptionZip] = useState();
	const [zipLabel, setZipLabel] = useState("Zip Code");

	if (location.state) {
		GET(
			`api/v1/advertisement/${location.state}`,
			"advertisement_data_info",
			(res) => {
				if (res.data) {
					let data = res.data;
					// console.log("res.data", res);
					setSelectedData(data);

					let advert_payments = [];
					if (data.advert_payments && data.advert_payments.length > 0) {
						data.advert_payments.map((item) => {
							advert_payments.push({
								...item,
								start_date: item.start_date ? moment(item.start_date) : "",
								end_date: item.end_date ? moment(item.end_date) : "",
							});
							return "";
						});
					}

					form.setFieldsValue({
						title: data.title,
						url_link: data.url_link,
						advert_for: data.advert_for,
						position: data.position,
						business_name: data.business_name,
						business_email: data.business_email,
						business_phone: data.business_phone,
						business_country: data.business_country,
						business_state: data.business_state,
						business_city: data.business_city,
						business_address1: data.business_address1,
						business_address2: data.business_address2,
						business_zip: data.business_zip,
						advert_payments,
					});

					setPlacement(data.position);

					setImageUrl(apiUrl + "storage/" + data.file_path);
				}
			}
		);
	}

	const {
		mutate: mutateCreateUpdateAdvertising,
		isLoading: isLoadingCreateUpdateAdvertising,
	} = POSTFILE("api/v1/advertisement", "advertisement_data_list");

	const {
		mutate: mutateDeleteAdvertPayment,
		isLoading: isLoadingDeleteAdvertPayment,
	} = DELETE("api/v1/advertpayment", "advertpayment_delete");

	const onFinish = (values) => {
		// console.log("onFinish values", values);
		let error = false;
		let data = new FormData();

		data.append("id", selectedData ? selectedData.id : "");
		data.append("title", values.title ?? "");
		data.append("url_link", values.url_link ?? "");
		data.append("advert_for", values.advert_for ?? "");
		data.append("position", values.position ?? "");
		data.append("business_name", values.business_name ?? "");
		data.append("business_email", values.business_email ?? "");
		data.append("business_phone", values.business_phone ?? "");
		data.append("business_country", values.business_country ?? "");
		data.append("business_state", values.business_state ?? "");
		data.append("business_city", values.business_city ?? "");
		data.append("business_address1", values.business_address1 ?? "");
		data.append("business_address2", values.business_address2 ?? "");
		data.append("business_zip", values.business_zip ?? "");

		data.append("amount", values.amount ?? "");
		data.append("url_type", values.url_type ?? "");

		let advert_payments = [];
		values.advert_payments.map((item) => {
			advert_payments.push({
				...item,
				start_date: item.start_date.format("YYYY-MM-DD"),
				end_date: item.end_date.format("YYYY-MM-DD"),
			});
			return "";
		});
		data.append("advert_payments", JSON.stringify(advert_payments));

		if (imageFile !== null) {
			data.append(`advertisement_file`, imageFile, imageFile.name);
		} else {
			if (!selectedData) {
				notification.error({
					message: "Advertising",
					description: "Please select Image",
				});
				error = true;
			}
		}

		if (error === false) {
			mutateCreateUpdateAdvertising(data, {
				onSuccess: (res) => {
					if (res.success) {
						notification.success({
							message: "Advertising",
							description: res.message,
						});
						history.push("/advertising/current");
					} else {
						notification.error({
							message: "Advertising",
							description: res.message,
						});
					}
				},
				onError: (err) => {
					notification.error({
						message: "Advertising",
						description: err.response.data.message,
					});
				},
			});
		}
	};

	const handleCountry = (e, opt) => {
		if (e === "United States") {
			setOptionState(stateUS);
			setStateLabel("State");
			setOptionZip(/(^\d{5}$)|(^\d{5}-\d{4}$)/);
			setZipLabel("Zip Code");
		} else if (e === "Canada") {
			setOptionState(stateCA);
			setStateLabel("County");
			setOptionZip(/^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/);
			setZipLabel("Postal Code");
		} else {
			setOptionState(stateUS);
			setStateLabel("State");
			setOptionZip(/(^\d{5}$)|(^\d{5}-\d{4}$)/);
			setZipLabel("Zip Code");
		}

		// form2.resetFields(["state"]);
	};

	const onValuesChange = (values) => {
		if (values.position !== undefined) {
			setPlacement(values.position);
			setImageFile(null);
			setImageUrl(null);
		}
	};

	const handleDeleteAdvertPayment = (index) => {
		let advert_payments = form.getFieldsValue().advert_payments;
		if (advert_payments) {
			let advert_payments_temp = advert_payments[index];
			if (advert_payments_temp && advert_payments_temp.id) {
				mutateDeleteAdvertPayment(advert_payments_temp, {
					onSuccess: (res) => {
						if (res.success) {
							notification.success({
								message: "Advertising Payment",
								description: res.message,
							});
						} else {
							notification.error({
								message: "Advertising Payment",
								description: res.message,
							});
						}
					},
					onError: (err) => {
						notification.error({
							message: "Advertising Payment",
							description: err.response.data.message,
						});
					},
				});
			}
		}
	};

	return (
		<Card className="page-admin-advertising-form" id="PageAdvertisingForm">
			<Form
				form={form}
				onFinish={onFinish}
				onValuesChange={onValuesChange}
				initialValues={{ url_type: "https://", advert_payments: [""] }}
			>
				<Row gutter={[12, 12]}>
					<Col xs={24} sm={24} md={24} lg={24} xl={14}>
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
								header="ADD NEW ADVERTISEMENT"
								key="1"
								className="accordion bg-darkgray-form m-b-md border bgcolor-1 white"
							>
								<Row gutter={[12, 12]}>
									<Col xs={24} sm={24} md={24}>
										<Form.Item
											name="title"
											hasFeedback
											rules={[
												{
													required: true,
													message: "This field is required.",
												},
											]}
										>
											<FloatInput label="Name" placeholder="Name" />
										</Form.Item>
									</Col>

									<Col xs={24} sm={24} md={24}>
										<Form.Item
											name="url_link"
											hasFeedback
											rules={[
												{
													required: true,
													message: "This field is required.",
												},
											]}
										>
											<FloatInput
												label="URL Link"
												placeholder="URL Link"
												className="has-input-addon-before"
												addonBefore={
													<Form.Item
														name="url_type"
														noStyle
														rules={[
															{
																required: true,
																message: "Province is required",
															},
														]}
													>
														<Select className="select-before">
															<Select.Option value="http://">
																http://
															</Select.Option>
															<Select.Option value="https://">
																https://
															</Select.Option>
														</Select>
													</Form.Item>
												}
											/>
										</Form.Item>
									</Col>

									<Col xs={24} sm={24} md={24}>
										<Form.Item
											name="advert_for"
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
												label="Display On"
												placeholder="Display On"
												options={[
													{
														value: "Both",
														label: "Both",
													},
													{
														value: "Cancer Caregiver",
														label: "Cancer Caregiver",
													},
													{
														value: "Cancer Care Professional",
														label: "Cancer Care Professional",
													},
												]}
											/>
										</Form.Item>
									</Col>

									<Col xs={24} sm={24} md={24}>
										<Form.Item
											name="position"
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
												label="Ad Type"
												placeholder="Ad Type"
												options={[
													{
														value: "Banner / Top",
														label: "Banner / Top",
													},
													{
														value: "Banner / Right",
														label: "Banner / Right",
													},
												]}
											/>
										</Form.Item>
									</Col>
								</Row>
							</Collapse.Panel>
						</Collapse>

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
								header="BUSINESS INFORMATION"
								key="1"
								className="accordion bg-darkgray-form m-b-md border bgcolor-1 white"
							>
								<Row gutter={[12, 12]}>
									<Col xs={24} sm={24} md={24}>
										<Form.Item
											name="business_name"
											hasFeedback
											rules={[
												{
													required: true,
													message: "This field is required.",
												},
											]}
										>
											<FloatInput label="Name" placeholder="Name" />
										</Form.Item>
									</Col>
									<Col xs={24} sm={24} md={12}>
										<Form.Item name="business_email" hasFeedback>
											<FloatInput label="Email" placeholder="Email" />
										</Form.Item>
									</Col>
									<Col xs={24} sm={24} md={12}>
										<Form.Item name="business_phone" hasFeedback>
											<FloatInputMask
												label="Phone"
												placeholder="Phone"
												maskLabel="business_phone"
												maskType="999 999 9999"
											/>
										</Form.Item>
									</Col>
									<Col xs={24} sm={24} md={12}>
										<Form.Item
											name="business_country"
											hasFeedback
											className="form-select-error"
										>
											<FloatSelect
												label="Country"
												placeholder="Country"
												options={optionCountryCodes}
												onChange={handleCountry}
											/>
										</Form.Item>
									</Col>
									<Col xs={24} sm={24} md={12}>
										<Form.Item
											name="business_state"
											hasFeedback
											className="form-select-error"
										>
											<FloatSelect
												label={stateLabel}
												placeholder={stateLabel}
												options={optionState}
											/>
										</Form.Item>
									</Col>
									<Col xs={24} sm={24} md={12}>
										<Form.Item name="business_address1" hasFeedback>
											<FloatInput label="Address 1" placeholder="Address 1" />
										</Form.Item>
									</Col>
									<Col xs={24} sm={24} md={12}>
										<Form.Item name="business_address2" hasFeedback>
											<FloatInput label="Address 2" placeholder="Address 2" />
										</Form.Item>
									</Col>
									<Col xs={24} sm={24} md={12}>
										<Form.Item name="business_city" hasFeedback>
											<FloatInput label="City" placeholder="City" />
										</Form.Item>
									</Col>
									<Col xs={24} sm={24} md={12}>
										<Form.Item
											name="business_zip"
											hasFeedback
											className="w-100"
											rules={[
												{
													required: optionZip ? true : false,
													message: "This field is required.",
												},
												{
													pattern: optionZip,
													message: "Invalid Zip",
												},
											]}
										>
											<FloatInput label={zipLabel} placeholder={zipLabel} />
										</Form.Item>
									</Col>
								</Row>
							</Collapse.Panel>
						</Collapse>
					</Col>

					<Col xs={24} sm={24} md={24} lg={24} xl={10}>
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
								header="ADS IMAGE"
								key="1"
								className="accordion bg-darkgray-form m-b-md border bgcolor-1 white"
							>
								<Row gutter={[12, 12]}>
									<Col xs={24} sm={24} md={24}>
										{placement === null ? (
											<Alert
												message={
													<span>
														<Typography.Text strong>NOTE:</Typography.Text>
														{` Please select "Ad Type" first.`}
													</span>
												}
												type="warning"
												showIcon
												className="m-b-md"
											/>
										) : (
											<Alert
												message={
													<span>
														<Typography.Text strong>NOTE:</Typography.Text>
														{placement === "Banner / Top"
															? ` Please upload image 800px X 80px`
															: ` Please upload image 550px X 350px`}
													</span>
												}
												type="info"
												showIcon
												className="m-b-md"
											/>
										)}

										<Form.Item
											name="advertisement_file"
											className="m-b-sm flex-upload"
											valuePropName="fileList"
											getValueFromEvent={(e) => {
												if (Array.isArray(e)) {
													return e;
												}

												return e?.fileList;
											}}
										>
											<Upload
												className="upload-w-100"
												listType="picture-card"
												accept="image/jpg,image/jpeg,image/png"
												showUploadList={false}
												beforeUpload={(file) => {
													let _URL = window.URL || window.webkitURL;
													const img = new Image();
													let objectUrl = _URL.createObjectURL(file);
													img.onload = function () {
														let error = false;
														const isLt2M = file.size / 102400 / 102400 < 10;
														if (!isLt2M) {
															notification.error({
																message: "Advertising",
																description: "Image must smaller than 10MB!",
															});

															error = true;
														}

														if (placement === "Banner / Top") {
															if (
																parseInt(this.width) !== 800 &&
																parseInt(this.height) !== 80
															) {
																notification.error({
																	message: "Advertising",
																	description:
																		"Image width and height must be 800px X 80px",
																});
																error = true;
															}
														} else if (placement === "Banner / Right") {
															if (
																parseInt(this.width) !== 550 &&
																parseInt(this.height) !== 350
															) {
																notification.error({
																	message: "Advertising",
																	description:
																		"Image width and height must be 550px X 350px",
																});
																error = true;
															}
														}

														if (error === false) {
															getBase64Image(file, (url) => {
																// console.log("url", url);
																setImageUrl(url);
															});

															setImageFile(file);
														}

														_URL.revokeObjectURL(objectUrl);
													};
													img.src = objectUrl;

													return false;
												}}
												maxCount={1}
												disabled={placement === null ? true : false}
											>
												{imageUrl ? (
													<img
														src={imageUrl}
														alt="avatar"
														style={{ maxWidth: "100%" }}
													/>
												) : (
													"Upload"
												)}
											</Upload>
										</Form.Item>
									</Col>
								</Row>
							</Collapse.Panel>
						</Collapse>

						<Form.List name="advert_payments">
							{(fields, { add, remove }) => (
								<>
									{fields.map((field) => (
										<Collapse
											className="main-1-collapse border-none"
											expandIcon={({ isActive }) =>
												isActive ? (
													<span
														className="ant-menu-submenu-arrow"
														style={{
															color: "#FFF",
															transform: "rotate(270deg)",
														}}
													></span>
												) : (
													<span
														className="ant-menu-submenu-arrow"
														style={{
															color: "#FFF",
															transform: "rotate(90deg)",
														}}
													></span>
												)
											}
											defaultActiveKey={["1"]}
											expandIconPosition="start"
											key={field.key}
										>
											<Collapse.Panel
												header="PAYMENT"
												key="1"
												className="accordion bg-darkgray-form m-b-md border bgcolor-1 white advert_payments"
												extra={
													fields.length > 1 ? (
														<Popconfirm
															title="Are you sure to delete this payment?"
															onConfirm={() => {
																handleDeleteAdvertPayment(field.name);
																remove(field.name);
															}}
															onCancel={() => {
																notification.success({
																	message: "Advertising Payment",
																	description: "Payment not deleted",
																});
															}}
															okText="Yes"
															cancelText="No"
														>
															<Button
																type="link"
																loading={isLoadingDeleteAdvertPayment}
																className="form-list-remove-button"
																icon={
																	<FontAwesomeIcon
																		icon={faTrashAlt}
																		className="fa-lg"
																	/>
																}
															/>
														</Popconfirm>
													) : null
												}
											>
												<Form.Item
													{...field}
													name={[field.name, "id"]}
													className="m-b-md hide"
													key={`0-${field.key}`}
												>
													<FloatInput label="ss" placeholder="ss" />
												</Form.Item>

												<Form.Item
													{...field}
													name={[field.name, "amount"]}
													key={`1-${field.key}`}
												>
													<FloatInputNumber
														label="Amount"
														placeholder="Amount"
														addonBefore="$"
														className="has-input-addon-before length-string-1"
													/>
												</Form.Item>

												<Form.Item
													{...field}
													name={[field.name, "start_date"]}
													rules={[
														{
															required: true,
															message: "This field is required.",
														},
													]}
													key={`2-${field.key}`}
												>
													<FloatDatePicker
														label="Start Date"
														placeholder="Start Date"
														format="MM/DD/YYYY"
														onChange={(e) => {
															let advert_payments_temp =
																form.getFieldValue().advert_payments;
															advert_payments_temp[field.name] = {
																...advert_payments_temp[field.name],
																end_date: "",
															};
															form.setFieldsValue({
																advert_payments: advert_payments_temp,
															});
														}}
													/>
												</Form.Item>

												<Form.Item
													{...field}
													name={[field.name, "end_date"]}
													rules={[
														{
															required: true,
															message: "This field is required.",
														},
													]}
													key={`3-${field.key}`}
												>
													<FloatDatePicker
														label="End Date"
														placeholder="End Date"
														format="MM/DD/YYYY"
														disabled={
															form.getFieldValue().advert_payments[
																field.name
															] &&
															form.getFieldValue().advert_payments[field.name]
																.start_date
																? false
																: true
														}
														disabledDate={(current) => {
															return (
																current &&
																current <
																	(form.getFieldValue().advert_payments[
																		field.name
																	] &&
																		form.getFieldValue().advert_payments[
																			field.name
																		].start_date)
															);
														}}
													/>
												</Form.Item>
											</Collapse.Panel>
										</Collapse>
									))}

									<Form.Item>
										<Button
											type="link"
											icon={
												<FontAwesomeIcon
													icon={faPlus}
													className="m-r-sm color-1"
												/>
											}
											className="m-l-n"
											onClick={() => add()}
										>
											<span className="color-1">Add Another Payment</span>
										</Button>
									</Form.Item>
								</>
							)}
						</Form.List>

						{location.state ? (
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
									header="STATISTICS"
									key="1"
									className="accordion bg-darkgray-form m-b-md border bgcolor-1 white"
								>
									<AdvertisingGraph
										id={location.state}
										title={
											selectedData && selectedData.title
												? selectedData.title
												: ""
										}
									/>
								</Collapse.Panel>
							</Collapse>
						) : null}
					</Col>

					<Col xs={24} sm={24} md={24} lg={24}>
						<Button
							htmlType="submit"
							className="btn-main-invert"
							loading={isLoadingCreateUpdateAdvertising}
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
