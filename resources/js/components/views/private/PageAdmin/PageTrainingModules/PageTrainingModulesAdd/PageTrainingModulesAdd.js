import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import {
	Button,
	Card,
	Col,
	Collapse,
	Form,
	notification,
	Row,
	Typography,
} from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/pro-regular-svg-icons";

import FloatInput from "../../../../../providers/FloatInput";
import FloatSelect from "../../../../../providers/FloatSelect";
import optionYear from "../../../../../providers/optionYear";
import { GET, POST } from "../../../../../providers/useAxiosQuery";

export default function PageTrainingModulesAdd() {
	const history = useHistory();
	const [form] = Form.useForm();
	const [selectedButton, setSelectedButton] = useState();
	const [selectedButtonFor, setSelectedButtonFor] = useState();

	const [lastModule, setLastModule] = useState("");
	const [lastLesson, setLastLesson] = useState("");

	const { data: optionModule, refetch: refetchModule } = GET(
		`api/v1/module?filter_module_for=${selectedButtonFor}`,
		"module_data_select"
	);

	const { mutate: mutateCreateModule, isLoading: isLoadingCreateModule } = POST(
		"api/v1/module",
		"module_create"
	);
	const { mutate: mutateCheckModule } = POST(
		"api/v1/module_check",
		"module_check"
	);

	const { mutate: mutateCreateLesson, isLoading: isLoadingCreateLesson } = POST(
		"api/v1/lesson",
		"lesson_create"
	);
	const { mutate: mutateCheckLesson } = POST(
		"api/v1/lesson_check",
		"lesson_check"
	);

	const onFinish = (values) => {
		let data = {
			...values,
			module_for: selectedButtonFor,
		};

		if (selectedButtonFor) {
			if (selectedButton === 1) {
				mutateCreateModule(data, {
					onSuccess: (res) => {
						if (res.success) {
							notification.success({
								message: "Module",
								description: res.message,
							});

							history.push("/training-modules/edit");
						} else {
							notification.error({
								message: "Module",
								description: res.message,
							});
						}
					},
					onError: (err) => {
						notification.error({
							message: "Module",
							description: err.response.data.message,
						});
					},
				});
			} else {
				mutateCreateLesson(data, {
					onSuccess: (res) => {
						if (res.success) {
							notification.success({
								message: "Lesson",
								description: res.message,
							});

							history.push("/training-modules/edit");
						} else {
							notification.error({
								message: "Lesson",
								description: res.message,
							});
						}
					},
					onError: (err) => {
						notification.error({
							message: "Lesson",
							description: err.response.data.message,
						});
					},
				});
			}
		} else {
			notification.error({
				message: selectedButton === 1 ? "Module" : "Lesson",
				description: "Please select Caregiver or Care Professional",
			});
		}
	};

	const handleCheckModule = (module_for) => {
		if (module_for) {
			mutateCheckModule(
				{ module_for },
				{
					onSuccess: (res) => {
						if (res.data) {
							setLastModule(res.data);
						}
					},
					onError: (err) => {
						notification.error({
							message: "Module",
							description: err.response.data.message,
						});
					},
				}
			);
		}
	};

	const handleCheckLesson = (module_id) => {
		if (module_id) {
			mutateCheckLesson(
				{ module_id },
				{
					onSuccess: (res) => {
						if (res.data) {
							setLastLesson(res.data);
						}
					},
					onError: (err) => {
						notification.error({
							message: "Module",
							description: err.response.data.message,
						});
					},
				}
			);
		}
	};

	const onValuesChange = (values) => {
		if (values.lesson_module_number !== undefined) {
			handleCheckLesson(values.lesson_module_number);
		}
	};

	useEffect(() => {
		if (optionModule) {
			refetchModule();
		}

		return () => {};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedButtonFor]);

	return (
		<Card
			id="PageTrainingModulesAdd"
			className="page-admin-training-module-add"
		>
			<Form
				form={form}
				onFinish={onFinish}
				initialValues={{ year: new Date().getFullYear() }}
				onValuesChange={onValuesChange}
			>
				<Row gutter={[12, 12]}>
					<Col xs={24} sm={24} md={24} lg={24} xl={14} xxl={12}>
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
								header="NEW MODULE OR LESSON"
								key="1"
								className="accordion bg-darkgray-form m-b-md border "
							>
								<Row gutter={[12, 12]}>
									<Col
										xs={24}
										sm={24}
										md={24}
										lg={12}
										xl={12}
										className="text-center"
									>
										<Button
											className={`b-r-none ${
												selectedButton === 1
													? "btn-main-2-active"
													: "btn-main-2"
											}`}
											size="large"
											onClick={() => {
												handleCheckModule();
												setSelectedButton(1);
												setSelectedButtonFor();
												form.setFieldsValue({
													module_number: "",
													module_name: "",
													lesson_module_number: "",
													lesson_name: "",
													lesson_number: "",
												});
											}}
										>
											<FontAwesomeIcon icon={faPlus} className="m-r-sm" />{" "}
											CREATE A NEW MODULE
										</Button>
									</Col>
									<Col
										xs={24}
										sm={24}
										md={24}
										lg={12}
										xl={12}
										className="text-center"
									>
										<Button
											className={`b-r-none ${
												selectedButton === 2
													? "btn-main-2-active"
													: "btn-main-2"
											}`}
											size="large"
											onClick={() => {
												setSelectedButton(2);
												setSelectedButtonFor();
												form.setFieldsValue({
													module_number: "",
													module_name: "",
													lesson_module_number: "",
													lesson_name: "",
													lesson_number: "",
												});
											}}
										>
											<FontAwesomeIcon icon={faPlus} className="m-r-sm" />{" "}
											CREATE A NEW LESSON
										</Button>
									</Col>
								</Row>
							</Collapse.Panel>
						</Collapse>

						{selectedButton ? (
							<>
								<div className="btn-select-role">
									{/* <Button
										className={`m-r-sm b-r-none ${
											selectedButtonFor === "Both"
												? "btn-main-2-active"
												: "btn-main-2"
										}`}
										size="large"
										onClick={() => {
											if (selectedButton === 1) {
												handleCheckModule("Both");
											}

											setSelectedButtonFor("Both");
											form.setFieldsValue({
												module_number: "",
												module_name: "",
												lesson_module_number: "",
												lesson_name: "",
												lesson_number: "",
											});
										}}
									>
										BOTH
									</Button> */}

									<Button
										className={`m-r-sm b-r-none ${
											selectedButtonFor === "Cancer Caregiver"
												? "btn-main-2-active"
												: "btn-main-2"
										}`}
										size="large"
										onClick={() => {
											if (selectedButton === 1) {
												handleCheckModule("Cancer Caregiver");
											}

											setSelectedButtonFor("Cancer Caregiver");
											form.setFieldsValue({
												module_number: "",
												module_name: "",
												lesson_module_number: "",
												lesson_name: "",
												lesson_number: "",
											});
										}}
									>
										CAREGIVER
									</Button>

									<Button
										className={`b-r-none ${
											selectedButtonFor === "Cancer Care Professional"
												? "btn-main-2-active"
												: "btn-main-2"
										}`}
										size="large"
										onClick={() => {
											if (selectedButton === 1) {
												handleCheckModule("Cancer Care Professional");
											}

											setSelectedButtonFor("Cancer Care Professional");
											form.setFieldsValue({
												module_number: "",
												module_name: "",
												lesson_module_number: "",
												lesson_name: "",
												lesson_number: "",
											});
										}}
									>
										CARE PROFESSIONAL
									</Button>
								</div>

								{selectedButton === 1 ? (
									<Collapse
										className="main-1-collapse border-none m-t-lg"
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
											header="CREATE NEW MODULE"
											key="1"
											className="accordion bg-darkgray-form m-b-md border "
										>
											<Row gutter={[12, 12]}>
												<Col xs={24} sm={24} md={24}>
													<Typography.Text strong className="color-6">
														LAST MODULE: {lastModule}
													</Typography.Text>
													<Form.Item
														name="module_number"
														rules={[
															{
																required: true,
																message: "This field is required.",
															},
														]}
													>
														<FloatInput
															label="Module #"
															placeholder="Module #"
														/>
													</Form.Item>
												</Col>
												<Col xs={24} sm={24} md={24}>
													<Form.Item
														name="module_name"
														rules={[
															{
																required: true,
																message: "This field is required.",
															},
														]}
													>
														<FloatInput
															label="Module Name"
															placeholder="Module Name"
														/>
													</Form.Item>
												</Col>
												<Col xs={24} sm={24} md={24}>
													<Form.Item name="year" className="form-select-error">
														<FloatSelect
															label="Year"
															placeholder="Year"
															options={optionYear}
														/>
													</Form.Item>
												</Col>
												<Col xs={24} sm={24} md={24}>
													<Button
														className="btn-main-invert b-r-none"
														size="large"
														htmlType="submit"
														loading={isLoadingCreateModule}
													>
														ADD
													</Button>
												</Col>
											</Row>
										</Collapse.Panel>
									</Collapse>
								) : (
									<Collapse
										className="main-1-collapse border-none m-t-lg"
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
											header="CREATE NEW LESSON"
											key="1"
											className="accordion bg-darkgray-form m-b-md border "
										>
											<Row gutter={[12, 12]}>
												<Col xs={24} sm={24} md={24}>
													<Form.Item
														name="lesson_module_number"
														className="form-select-error"
														rules={[
															{
																required: true,
																message: "This field is required.",
															},
														]}
													>
														<FloatSelect
															label="Module #"
															placeholder="Module #"
															options={
																optionModule
																	? optionModule.data.map((item) => {
																			return {
																				label: item.module_number,
																				value: item.id,
																			};
																	  })
																	: []
															}
														/>
													</Form.Item>
												</Col>
												<Col xs={24} sm={24} md={24}>
													<Typography.Text strong className="color-6">
														LAST LESSON: {lastLesson}
													</Typography.Text>
													<Form.Item
														name="lesson_number"
														rules={[
															{
																required: true,
																message: "This field is required.",
															},
														]}
													>
														<FloatInput
															label="Lesson #"
															placeholder="Lesson #"
														/>
													</Form.Item>
												</Col>
												<Col xs={24} sm={24} md={24}>
													<Form.Item
														name="lesson_name"
														rules={[
															{
																required: true,
																message: "This field is required.",
															},
														]}
													>
														<FloatInput
															label="Lesson Name"
															placeholder="Lesson Name"
														/>
													</Form.Item>
												</Col>
												<Col xs={24} sm={24} md={24}>
													<Button
														className="btn-main-invert b-r-none"
														size="large"
														htmlType="type"
														loading={isLoadingCreateLesson}
													>
														ADD
													</Button>
												</Col>
											</Row>
										</Collapse.Panel>
									</Collapse>
								)}
							</>
						) : null}
					</Col>
				</Row>
			</Form>
		</Card>
	);
}
