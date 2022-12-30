import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import {
	Button,
	Card,
	Col,
	Collapse,
	Form,
	message,
	notification,
	Popconfirm,
	Row,
	Switch,
	Upload,
} from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faTrashAlt,
	faPlus,
	faFileArrowUp,
	// faSpinnerThird,
} from "@fortawesome/pro-regular-svg-icons";
import $ from "jquery";
import FloatInput from "../../../../../providers/FloatInput";
import FloatSelect from "../../../../../providers/FloatSelect";
import FloatTextArea from "../../../../../providers/FloatTextArea";
import optionQuestionType from "../../../../../providers/optionQuestionType";

import {
	formats,
	modulesToolBarV2,
} from "../../../../../providers/reactQuillOptions";
import { apiUrl } from "../../../../../providers/companyInfo";

import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import ImageResize from "quill-image-resize-module-react";
import { DELETE, GET, POSTFILE } from "../../../../../providers/useAxiosQuery";
Quill.register("modules/imageResize", ImageResize);

export default function PageTrainingModulesLessonEdit(props) {
	const { location } = props;
	const history = useHistory();

	const [form] = Form.useForm();
	const [selectedData, setSelectedData] = useState();
	const [questionsData, setQuestionsData] = useState([]);
	const [optionQuestionCategory, setOptionQuestionCategory] = useState([]);

	GET(
		`api/v1/lesson/${location.state}`,
		`lesson_info_data_${location.state}`,
		(res) => {
			if (res.data) {
				// console.log("res.data", res.data);
				setSelectedData(res.data);
			}
		}
	);

	GET(`api/v1/question_category`, "question_category_select", (res) => {
		if (res.data) {
			let data = [];
			res.data.map((item) => {
				data.push({ value: item.id, label: item.question_category });
				return "";
			});
			setOptionQuestionCategory(data);
		}
	});

	const { mutate: mutateUpdateLesson, isLoading: isLoadingUpdateLesson } =
		POSTFILE("api/v1/update_lesson", "lesson_update");
	const { mutate: mutateDeleteQuestion, isLoading: isLoadingDeleteQuestion } =
		DELETE("api/v1/question", "lesson_info_data");
	const {
		mutate: mutateDeleteQuestionOption,
		isLoading: isLoadingDeleteQuestionOption,
	} = DELETE("api/v1/question_option", "lesson_info_data");
	const {
		mutate: mutateDeleteAttachment,
		isLoading: isLoadingDeleteAttachment,
	} = DELETE("api/v1/lesson_attachment", "lesson_info_data");

	const onFinish = (values) => {
		// console.log("onFinish values", values);
		let data = new FormData();

		let questions = [];

		if (values.questions.length > 0) {
			values.questions.map((item) => {
				let options = [];
				if (item.question_options !== undefined) {
					if (item.question_options.length > 0) {
						item.question_options.map((item2) => {
							options.push({
								...item2,
								status: item2.status ? 1 : 0,
							});
							return "";
						});
					}
				}
				questions.push({
					...item,
					id: item.id ? item.id : "",
					question_options: options,
				});
				return "";
			});
		}

		data.append("id", location.state ? location.state : "");
		data.append("lesson_name", values.lesson_name);
		data.append("lesson_number", values.lesson_number);
		data.append("embed_video", values.embed_video);
		data.append("embed_video_status", values.embed_video_status ? 1 : 0);
		data.append("description", values.description);
		data.append("description_status", values.description_status ? 1 : 0);
		data.append("instructions", values.instructions);
		data.append("instructions_status", values.instructions_status ? 1 : 0);
		data.append("questions", JSON.stringify(questions));

		let audioCounter = 0;
		let audio_info = [];
		if (values.audios.length > 0) {
			for (let x = 0; x < values.audios.length; x++) {
				const elem = values.audios[x];
				audioCounter++;
				audio_info.push({
					status: elem.audio_status ? 1 : 0,
					title: elem.audio_title,
					id: elem.id ? elem.id : "",
				});

				if (
					elem.audio_file !== undefined &&
					elem.audio_file.length > 0 &&
					elem.audio_file[0].originFileObj !== undefined
				) {
					data.append(
						`audio_file_${x}`,
						elem.audio_file[0].originFileObj,
						elem.audio_file[0].name
					);
				}
			}
		}
		data.append("audioCounter", audioCounter);
		data.append("audio_info", JSON.stringify(audio_info));

		let documentCounter = 0;
		let document_info = [];
		if (values.documents.length > 0) {
			for (let x = 0; x < values.documents.length; x++) {
				const elem = values.documents[x];
				documentCounter++;
				document_info.push({
					status: elem.document_status ? 1 : 0,
					title: elem.document_name,
					id: elem.id ? elem.id : "",
				});

				if (
					elem.document_file !== undefined &&
					elem.document_file.length > 0 &&
					elem.document_file[0].originFileObj !== undefined
				) {
					data.append(
						`document_file_${x}`,
						elem.document_file[0].originFileObj,
						elem.document_file[0].name
					);
				}
			}
		}
		data.append("documentCounter", documentCounter);
		data.append("document_info", JSON.stringify(document_info));

		mutateUpdateLesson(data, {
			onSuccess: (res) => {
				if (res.success) {
					notification.success({
						message: "Training Module",
						description: res.message,
					});
					history.push("/training-modules/edit");
				} else {
					notification.error({
						message: "Training Module",
						description: res.message,
					});
				}
			},
			onError: (err) => {
				notification.error({
					message: "Training Module",
					description: err.response.data.message,
				});
			},
		});
	};

	const handleDeleteQuestion = (index) => {
		let tempQuestionsData = questionsData[index];

		if (tempQuestionsData && tempQuestionsData.id !== "") {
			mutateDeleteQuestion(tempQuestionsData, {
				onSuccess: (res) => {
					if (res.success) {
						notification.success({
							message: "Training Module",
							description: res.message,
						});
					} else {
						notification.error({
							message: "Training Module",
							description: res.message,
						});
					}
				},
				onError: (err) => {
					notification.error({
						message: "Training Module",
						description: err.response.data.message,
					});
				},
			});
		}
	};

	const handleDeleteQuestionOption = (index1, index2) => {
		let tempQuestionsData = questionsData[index1];
		let tempQuestionOptionsData = tempQuestionsData.question_options[index2];

		if (
			tempQuestionOptionsData.id !== undefined &&
			tempQuestionOptionsData.id !== ""
		) {
			mutateDeleteQuestionOption(tempQuestionOptionsData, {
				onSuccess: (res) => {
					if (res.success) {
						notification.success({
							message: "Training Module",
							description: res.message,
						});
					} else {
						notification.error({
							message: "Training Module",
							description: res.message,
						});
					}
				},
				onError: (err) => {
					notification.error({
						message: "Training Module",
						description: err.response.data.message,
					});
				},
			});
		}
	};

	const handleDeleteAttachment = (fileIndex, type) => {
		// console.log("handleDeleteAttachment", fileIndex, type);
		// console.log("form", form.getFieldValue().audios);
		let tempFilteList = [];
		if (selectedData.attachments.length > 0) {
			selectedData.attachments
				.filter((itemFilter) => itemFilter.type === type)
				.map((item, index) => {
					tempFilteList.push({
						audio_file: [
							{
								id: item.id,
								type: item.type,
								uid: index,
								name: item.file_name,
								status: "done",
								url: apiUrl + item.file_path,
							},
						],
						id: item.id,
						audio_status: item.status,
						audio_title: item.title,
					});
					return "";
				});
		}

		// console.log("handleDeleteAttachment tempFilteList", tempFilteList);
		if (tempFilteList.length > 0) {
			if (tempFilteList[fileIndex].id !== "") {
				mutateDeleteAttachment(tempFilteList[fileIndex], {
					onSuccess: (res) => {
						if (res.success) {
							notification.success({
								message: "Training Module",
								description: res.message,
							});
						} else {
							notification.error({
								message: "Training Module",
								description: res.message,
							});
						}
					},
					onError: (err) => {
						notification.error({
							message: "Training Module",
							description: err.response.data.message,
						});
					},
				});
			}
		}
	};

	useEffect(() => {
		if (selectedData) {
			$(
				".ant-page-header .ant-page-header-heading .ant-page-header-text .title"
			).html(
				`${selectedData.module ? selectedData.module.module_number : ""}/${
					selectedData.lesson_number ? selectedData.lesson_number : ""
				}`
			);

			let questions = [];

			if (selectedData.questions.length > 0) {
				selectedData.questions.map((item) => {
					let options = [];
					if (item.question_options.length > 0) {
						item.question_options.map((item2, index2) => {
							let optionsData = {
								...item2,
								key: index2,
								status: parseInt(item2.status) ? true : false,
							};
							options.push(optionsData);
							return "";
						});
					}
					questions.push({ ...item, question_options: options });
					return "";
				});
			} else {
				questions.push({
					question: "",
				});
			}

			let tempFilteListAudio = [];
			let tempFilteListDocument = [];
			if (selectedData.attachments.length > 0) {
				selectedData.attachments
					.filter((itemFilter) => itemFilter.type === "Audio")
					.map((item, index) => {
						let tempFilteListAudioData = {
							id: item.id,
							audio_status: item.status,
							audio_title: item.title,
						};

						if (item.file_path) {
							tempFilteListAudioData = {
								audio_file: [
									{
										id: item.id,
										type: item.type,
										uid: index,
										name: item.file_name,
										status: "done",
										url: apiUrl + "storage/" + item.file_path,
									},
								],
								id: item.id,
								audio_status: item.status,
								audio_title: item.title,
							};
						}
						tempFilteListAudio.push(tempFilteListAudioData);
						return "";
					});

				selectedData.attachments
					.filter((itemFilter) => itemFilter.type === "Document")
					.map((item, index) => {
						let tempFilteListDocumentData = {
							id: item.id,
							document_status: item.status,
							document_name: item.title,
						};

						if (item.file_path) {
							tempFilteListDocumentData = {
								document_file: [
									{
										id: item.id,
										type: item.type,
										uid: index,
										name: item.file_name,
										status: "done",
										url: apiUrl + "storage/" + item.file_path,
									},
								],
								id: item.id,
								document_status: item.status,
								document_name: item.title,
							};
						}

						tempFilteListDocument.push(tempFilteListDocumentData);
						return "";
					});
			}

			form.setFieldsValue({
				lesson_name: selectedData.lesson_name ? selectedData.lesson_name : "",
				lesson_number: selectedData.lesson_number
					? selectedData.lesson_number
					: "",
				embed_video: selectedData.embed_video ? selectedData.embed_video : "",
				description: selectedData.description ? selectedData.description : "",
				description_status: selectedData.description_status,
				instructions: selectedData.instructions
					? selectedData.instructions
					: "",
				instructions_status: selectedData.instructions_status,
				questions: questions,
				embed_video_status: selectedData.embed_video_status,
				audios: tempFilteListAudio.length > 0 ? tempFilteListAudio : [""],
				documents:
					tempFilteListDocument.length > 0 ? tempFilteListDocument : [""],
			});

			setQuestionsData(questions);
		}
		return () => {};
	}, [form, selectedData]);

	return (
		<Card
			className="page-admin-training-module-lesson-edit"
			id="PageTrainingModulesLessonEdit"
		>
			<Form
				form={form}
				onFinish={onFinish}
				initialValues={{ description: "", instructions: "" }}
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
								header="LESSON NAME"
								key="1"
								className="accordion bg-darkgray-form m-b-md border bgcolor-1 white"
							>
								<Row gutter={[12, 12]}>
									<Col xs={24} sm={24} md={12}>
										<Form.Item name="lesson_number">
											<FloatInput label="Lesson #" placeholder="Lesson #" />
										</Form.Item>
									</Col>
									<Col xs={24} sm={24} md={12}>
										<Form.Item name="lesson_name">
											<FloatInput
												label="Lesson Name"
												placeholder="Lesson Name"
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
								header="DESCRIPTION"
								key="1"
								className="accordion bg-darkgray-form m-b-md border bgcolor-1 white"
							>
								<Row gutter={[12, 12]}>
									<Col xs={24} sm={24} md={24} className="show_hide_option">
										<Form.Item
											name="description_status"
											valuePropName="checked"
											label="Hide/Show Description"
											className="m-b-none"
										>
											<Switch />
										</Form.Item>
									</Col>
									<Col xs={24} sm={24} md={24} className="m-t-md">
										<Form.Item name="description">
											<ReactQuill
												theme="snow"
												style={{ height: 200 }}
												formats={formats}
												modules={modulesToolBarV2}
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
								header="VIDEO"
								key="1"
								className="accordion bg-darkgray-form m-b-md border bgcolor-1 white"
							>
								<Row>
									<Col xs={24} sm={24} md={24} className="show_hide_option">
										<Form.Item
											name="embed_video_status"
											valuePropName="checked"
											label="Hide/Show Video"
											className="m-b-none"
										>
											<Switch />
										</Form.Item>
									</Col>
									<Col xs={24} sm={24} md={24} className="m-t-md">
										<Form.Item name="embed_video">
											<FloatTextArea
												label="Video URL"
												placeholder="Video URL"
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
								header="INSTRUCTIONS"
								key="1"
								className="accordion bg-darkgray-form m-b-md border bgcolor-1 white"
							>
								<Row>
									<Col xs={24} sm={24} md={24} className="show_hide_option">
										<Form.Item
											name="instructions_status"
											valuePropName="checked"
											label="Hide/Show Instructions"
											className="m-b-none"
										>
											<Switch />
										</Form.Item>
									</Col>
									<Col xs={24} sm={24} md={24} className="m-t-md">
										<Form.Item name="instructions">
											<ReactQuill
												theme="snow"
												style={{ height: 200 }}
												formats={formats}
												modules={modulesToolBarV2}
											/>
										</Form.Item>
									</Col>
								</Row>
							</Collapse.Panel>
						</Collapse>

						<Form.List name="questions">
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
											defaultActiveKey={["0"]}
											expandIconPosition="start"
											key={field.key}
										>
											<Collapse.Panel
												header="QUESTIONS"
												className="accordion bg-darkgray-form m-b-md border"
												extra={
													fields.length > 1 ? (
														<Popconfirm
															title="Are you sure to delete this question?"
															onConfirm={() => {
																handleDeleteQuestion(field.name);
																remove(field.name);
															}}
															onCancel={() => {
																notification.success({
																	message: "Training Module",
																	description: "Question not deleted",
																});
															}}
															okText="Yes"
															cancelText="No"
														>
															<Button
																type="link"
																loading={isLoadingDeleteQuestion}
																className="form-list-remove-button"
															>
																<FontAwesomeIcon
																	icon={faTrashAlt}
																	className="fa-lg"
																/>
															</Button>
														</Popconfirm>
													) : null
												}
												key="0"
											>
												<Form.Item
													{...field}
													name={[field.name, "id"]}
													className="m-b-md hide"
												>
													<FloatInput label="ss" placeholder="ss" />
												</Form.Item>

												<Row gutter={12}>
													<Col xs={24} sm={24} md={12}>
														<Form.Item
															{...field}
															name={[field.name, "question_number"]}
															className="m-b-sm input_question_number"
															hasFeedback
														>
															<FloatInput
																label="Question #"
																placeholder="Question #"
															/>
														</Form.Item>
													</Col>

													<Col xs={24} sm={24} md={12}>
														<Form.Item
															{...field}
															name={[field.name, "question_type"]}
															className="m-b-sm form-select-error"
															hasFeedback
															rules={[
																{
																	required: true,
																	message: "This field is required.",
																},
															]}
														>
															<FloatSelect
																label="Question Type"
																placeholder="Question Type"
																options={optionQuestionType}
																onChange={(e) => {
																	let tempQuestion =
																		form.getFieldsValue().questions;
																	if (e === "Multiple Choice") {
																		tempQuestion[field.name] = {
																			...tempQuestion[field.name],
																			question_options: [
																				{
																					key: 0,
																					id: "",
																					option: "",
																					status: 0,
																				},
																				{
																					key: 1,
																					id: "",
																					option: "",
																					status: 0,
																				},
																			],
																		};
																	} else if (e === "True/False") {
																		tempQuestion[field.name] = {
																			...tempQuestion[field.name],
																			question_options: [
																				{
																					key: 0,
																					id: "",
																					option: "True",
																					status: 0,
																				},
																				{
																					key: 1,
																					id: "",
																					option: "False",
																					status: 0,
																				},
																			],
																		};
																	} else if (e === "Yes/No") {
																		tempQuestion[field.name] = {
																			...tempQuestion[field.name],
																			question_options: [
																				{
																					key: 0,
																					id: "",
																					option: "Yes",
																					status: 1,
																				},
																				{
																					key: 1,
																					id: "",
																					option: "No",
																					status: 1,
																				},
																			],
																		};
																	} else if (e === "Open Answer") {
																		tempQuestion[field.name] = {
																			...tempQuestion[field.name],
																			question_options: [
																				{
																					key: 0,
																					id: "",
																					option: "",
																					status: 1,
																				},
																			],
																		};
																	} else if (e === "Fill in the Blank") {
																		tempQuestion[field.name] = {
																			...tempQuestion[field.name],
																			question_options: [
																				{
																					key: 0,
																					id: "",
																					option: "",
																					status: 1,
																				},
																			],
																		};
																	} else if (e === "Rating") {
																		tempQuestion[field.name] = {
																			...tempQuestion[field.name],
																			question_options: [
																				{
																					key: 0,
																					id: "",
																					option: "",
																					status: 1,
																				},
																				{
																					key: 1,
																					id: "",
																					option: "",
																					status: 1,
																				},
																				{
																					key: 2,
																					id: "",
																					option: "",
																					status: 1,
																				},
																				{
																					key: 3,
																					id: "",
																					option: "",
																					status: 1,
																				},
																				{
																					key: 4,
																					id: "",
																					option: "",
																					status: 1,
																				},
																			],
																		};
																	} else if (
																		e === "Option 1 (More Questions)"
																	) {
																		tempQuestion[field.name] = {
																			...tempQuestion[field.name],
																			question_options: [
																				{
																					key: 0,
																					id: "",
																					option: "NONE",
																					status: 1,
																				},
																			],
																		};
																	} else if (
																		e === "Option 2 (No More Questions)"
																	) {
																		tempQuestion[field.name] = {
																			...tempQuestion[field.name],
																			question_options: [
																				{
																					key: 0,
																					id: "",
																					option: "NONE",
																					status: 1,
																				},
																			],
																		};
																	}

																	form.setFieldsValue({
																		questions: tempQuestion,
																	});
																	// console.log("tempQuestion", tempQuestion);
																	setQuestionsData(tempQuestion);
																}}
															/>
														</Form.Item>
													</Col>

													<Col xs={24} sm={24} md={12}>
														<Form.Item
															{...field}
															name={[field.name, "question_category_id"]}
															className="m-b-sm form-select-error"
															hasFeedback
														>
															<FloatSelect
																label="Question Category"
																placeholder="Question Category"
																options={optionQuestionCategory}
															/>
														</Form.Item>
													</Col>

													<Col
														xs={24}
														sm={24}
														md={24}
														className="m-b-mob-resp-15px-468px m-b-mob-resp-50px-375px m-b-mob-resp-50px-320px"
													>
														<Form.Item
															{...field}
															name={[field.name, "question"]}
															className="m-b-sm form-select-error"
															hasFeedback
															rules={[
																{
																	required: true,
																	message: "This field is required.",
																},
															]}
														>
															<ReactQuill
																theme="snow"
																style={{ height: 200 }}
																formats={formats}
																modules={modulesToolBarV2}
																placeholder="Question"
															/>
														</Form.Item>
													</Col>

													{questionsData &&
													questionsData[field.name] &&
													questionsData[field.name].question_type ===
														"Multiple Choice" ? (
														<Col xs={24} sm={24} md={24}>
															<Form.List
																{...field}
																name={[field.name, "question_options"]}
																rules={[
																	{
																		validator: async (_, names2) => {
																			if (!names2 || names2.length < 1) {
																				return Promise.reject(
																					new Error("At least 1 answer")
																				);
																			}
																		},
																	},
																]}
															>
																{(fields2, { add, remove }) => (
																	<>
																		{fields2.map((field2) => (
																			<div
																				key={`${field2.key}-${field.name}`}
																				className="div-form-list-option"
																			>
																				<Form.Item
																					{...field2}
																					name={[field2.name, "id"]}
																					key={`${field2.key}-${field.name}-1`}
																					className="hide"
																				>
																					<FloatInput label="" placeholder="" />
																				</Form.Item>
																				<Form.Item
																					{...field2}
																					name={[field2.name, "option"]}
																					rules={[
																						{
																							required: true,
																							message: "Missing Answer",
																						},
																					]}
																					key={`${field2.key}-${field.name}-2`}
																				>
																					<FloatInput
																						label="Choices"
																						placeholder="Choices"
																					/>
																				</Form.Item>
																				<Form.Item
																					{...field2}
																					name={[field2.name, "status"]}
																					valuePropName="checked"
																					key={`${field2.key}-${field.name}-3`}
																				>
																					<Switch
																						className={
																							form.getFieldsValue().questions[
																								field.name
																							].question_options[field2.name]
																								.status === true
																								? "bgcolor-11"
																								: ""
																						}
																						onChange={(e) => {
																							// console.log("e", e);
																							let questions =
																								form.getFieldsValue().questions;
																							let question_options =
																								questions[field.name]
																									.question_options;
																							question_options =
																								question_options.map(
																									(qoItem) => {
																										let status = false;
																										let _this_option =
																											question_options[
																												field2.name
																											];
																										if (
																											qoItem.key ===
																											_this_option.key
																										) {
																											status = e;
																										}
																										return {
																											...qoItem,
																											status,
																										};
																									}
																								);
																							questions[field.name] = {
																								...questions[field.name],
																								question_options,
																							};

																							form.setFieldsValue({
																								questions,
																							});
																						}}
																					/>
																				</Form.Item>

																				{fields2.length > 1 ? (
																					<div className="ant-row ant-form-item">
																						<Popconfirm
																							title="Are you sure to delete this option?"
																							onConfirm={() => {
																								handleDeleteQuestionOption(
																									field.name,
																									field2.name
																								);
																								remove(field2.name);
																							}}
																							onCancel={() =>
																								notification.success({
																									message: "Training Module",
																									description:
																										"Question not deleted",
																								})
																							}
																							okText="Yes"
																							cancelText="No"
																						>
																							<Button
																								type="link"
																								className="dynamic-delete-button"
																								loading={
																									isLoadingDeleteQuestionOption
																								}
																							>
																								<FontAwesomeIcon
																									icon={faTrashAlt}
																								/>
																							</Button>
																						</Popconfirm>
																					</div>
																				) : null}
																			</div>
																		))}

																		<Form.Item>
																			<Button
																				type="dashed"
																				onClick={() => {
																					let tempQuestion =
																						form.getFieldsValue().questions;
																					let tempQuestionOption =
																						tempQuestion[field.name]
																							.question_options;
																					tempQuestionOption.push({
																						key:
																							tempQuestionOption[
																								tempQuestionOption.length - 1
																							].key + 1,
																						id: "",
																						option: "",
																						status: false,
																					});
																					tempQuestion[field.name] = {
																						...tempQuestion[field.name],
																						question_options:
																							tempQuestionOption,
																					};

																					setQuestionsData(tempQuestion);
																					add();

																					form.setFieldsValue({
																						questions: tempQuestion,
																					});
																				}}
																				block
																				icon={<FontAwesomeIcon icon={faPlus} />}
																			>
																				Add Question Option
																			</Button>
																		</Form.Item>
																	</>
																)}
															</Form.List>
														</Col>
													) : null}

													{questionsData &&
													questionsData[field.name] &&
													questionsData[field.name].question_type ===
														"True/False" ? (
														<Col xs={24} sm={24} md={24}>
															<Form.List
																{...field}
																name={[field.name, "question_options"]}
															>
																{(fields2, { add, remove }) => (
																	<>
																		{fields2.map((field2) => (
																			<div
																				key={`${field2.key}-${field.name}`}
																				className="div-form-list-option div-form-list-option-true-false"
																			>
																				<Form.Item
																					{...field2}
																					name={[field2.name, "id"]}
																					key={`${field2.key}-${field.name}-1`}
																					className="hide"
																				>
																					<FloatInput label="" placeholder="" />
																				</Form.Item>
																				<Form.Item
																					// {...field2}
																					key={`${field2.key}-${field.name}-2`}
																					shouldUpdate
																				>
																					{() => {
																						return (
																							<div>
																								{
																									form.getFieldsValue()
																										.questions[field.name]
																										.question_options[
																										field2.key
																									].option
																								}
																							</div>
																						);
																					}}
																				</Form.Item>
																				<Form.Item
																					{...field2}
																					name={[field2.name, "status"]}
																					valuePropName="checked"
																					key={`${field2.key}-${field.name}-3`}
																				>
																					<Switch
																						className={
																							form.getFieldsValue().questions[
																								field.name
																							].question_options[field2.name]
																								.status === true
																								? "bgcolor-11"
																								: ""
																						}
																						onChange={(e) => {
																							// console.log("field2", field2);
																							let questions =
																								form.getFieldsValue().questions;
																							let question_options =
																								questions[field.name]
																									.question_options;
																							question_options =
																								question_options.map(
																									(qoItem) => {
																										let _this_option =
																											question_options[
																												field2.name
																											];
																										if (
																											qoItem.key ===
																											_this_option.key
																										) {
																											return {
																												...qoItem,
																												status: e,
																											};
																										} else {
																											return qoItem;
																										}
																									}
																								);
																							questions[field.name] = {
																								...questions[field.name],
																								question_options,
																							};

																							form.setFieldsValue({
																								questions,
																							});
																						}}
																					/>
																				</Form.Item>
																			</div>
																		))}
																	</>
																)}
															</Form.List>
														</Col>
													) : null}

													{questionsData &&
													questionsData[field.name] &&
													questionsData[field.name].question_type ===
														"Yes/No" ? (
														<Col xs={24} sm={24} md={24}>
															<Form.List
																{...field}
																name={[field.name, "question_options"]}
															>
																{(fields2, { add, remove }) => (
																	<>
																		{fields2.map((field2) => (
																			<div
																				key={`${field2.key}-${field.name}`}
																				className="div-form-list-option div-form-list-option-true-false"
																			>
																				<Form.Item
																					{...field2}
																					name={[field2.name, "id"]}
																					key={`${field2.key}-${field.name}-1`}
																					className="hide"
																				>
																					<FloatInput label="" placeholder="" />
																				</Form.Item>
																				<Form.Item
																					// {...field2}
																					key={`${field2.key}-${field.name}-2`}
																					shouldUpdate
																				>
																					{() => {
																						return (
																							<div>
																								{
																									form.getFieldsValue()
																										.questions[field.name]
																										.question_options[
																										field2.key
																									].option
																								}
																							</div>
																						);
																					}}
																				</Form.Item>
																				<Form.Item
																					{...field2}
																					name={[field2.name, "status"]}
																					valuePropName="checked"
																					key={`${field2.key}-${field.name}-3`}
																				>
																					<Switch
																						className={
																							form.getFieldsValue().questions[
																								field.name
																							].question_options[field2.name]
																								.status === true
																								? "bgcolor-11"
																								: ""
																						}
																						onChange={(e) => {
																							// console.log("field2", field2);
																							let questions =
																								form.getFieldsValue().questions;
																							let question_options =
																								questions[field.name]
																									.question_options;
																							question_options =
																								question_options.map(
																									(qoItem) => {
																										let _this_option =
																											question_options[
																												field2.name
																											];
																										if (
																											qoItem.key ===
																											_this_option.key
																										) {
																											return {
																												...qoItem,
																												status: e,
																											};
																										} else {
																											return qoItem;
																										}
																									}
																								);
																							questions[field.name] = {
																								...questions[field.name],
																								question_options,
																							};

																							form.setFieldsValue({
																								questions,
																							});
																						}}
																					/>
																				</Form.Item>
																			</div>
																		))}
																	</>
																)}
															</Form.List>
														</Col>
													) : null}

													{questionsData &&
													questionsData[field.name] &&
													questionsData[field.name].question_type ===
														"Open Answer" ? (
														<Col xs={24} sm={24} md={24}>
															<Form.List
																{...field}
																name={[field.name, "question_options"]}
																rules={[
																	{
																		validator: async (_, names2) => {
																			if (!names2 || names2.length < 1) {
																				return Promise.reject(
																					new Error("At least 1 answer")
																				);
																			}
																		},
																	},
																]}
															>
																{(fields2, { add, remove }) => (
																	<>
																		{fields2.map((field2) => (
																			<div
																				key={`${field2.key}-${field.name}`}
																				className="div-form-list-option"
																			>
																				<Form.Item
																					{...field2}
																					name={[field2.name, "id"]}
																					key={`${field2.key}-${field.name}-1`}
																					className="hide"
																				>
																					<FloatInput label="" placeholder="" />
																				</Form.Item>
																				<Form.Item
																					{...field2}
																					name={[field2.name, "option"]}
																					rules={[
																						{
																							required: true,
																							message: "Missing Answer",
																						},
																					]}
																					key={`${field2.key}-${field.name}-2`}
																					style={{
																						width: "100%",
																					}}
																				>
																					<FloatInput
																						label="Choices"
																						placeholder="Choices"
																					/>
																				</Form.Item>
																				<Form.Item
																					{...field2}
																					name={[field2.name, "status"]}
																					valuePropName="checked"
																					key={`${field2.key}-${field.name}-3`}
																					className="hide"
																				>
																					<Switch />
																				</Form.Item>
																				{fields2.length > 1 ? (
																					<div className="ant-row ant-form-item">
																						<Popconfirm
																							title="Are you sure to delete this option?"
																							onConfirm={() => {
																								handleDeleteQuestionOption(
																									field.name,
																									field2.name
																								);
																								remove(field2.name);
																							}}
																							onCancel={() =>
																								notification.success({
																									message: "Training Module",
																									description:
																										"Question not deleted",
																								})
																							}
																							okText="Yes"
																							cancelText="No"
																						>
																							<Button
																								type="link"
																								className="dynamic-delete-button"
																								loading={
																									isLoadingDeleteQuestionOption
																								}
																							>
																								<FontAwesomeIcon
																									icon={faTrashAlt}
																								/>
																							</Button>
																						</Popconfirm>
																					</div>
																				) : null}
																			</div>
																		))}

																		<Form.Item>
																			<Button
																				type="dashed"
																				onClick={() => {
																					let tempQuestion =
																						form.getFieldsValue().questions;
																					let tempQuestionOption =
																						tempQuestion[field.name]
																							.question_options;
																					tempQuestionOption.push({
																						key:
																							tempQuestionOption[
																								tempQuestionOption.length - 1
																							].key + 1,
																						id: "",
																						option: "",
																						status: 1,
																					});
																					tempQuestion[field.name] = {
																						...tempQuestion[field.name],
																						question_options:
																							tempQuestionOption,
																					};

																					setQuestionsData(tempQuestion);
																					add();

																					form.setFieldsValue({
																						questions: tempQuestion,
																					});
																				}}
																				block
																				icon={<FontAwesomeIcon icon={faPlus} />}
																			>
																				Add Question Option
																			</Button>
																		</Form.Item>
																	</>
																)}
															</Form.List>
														</Col>
													) : null}

													{questionsData &&
													questionsData[field.name] &&
													questionsData[field.name].question_type ===
														"Fill in the Blank" ? (
														<Col xs={24} sm={24} md={24}>
															<Form.List
																{...field}
																name={[field.name, "question_options"]}
																rules={[
																	{
																		validator: async (_, names2) => {
																			if (!names2 || names2.length < 1) {
																				return Promise.reject(
																					new Error("At least 1 answer")
																				);
																			}
																		},
																	},
																]}
															>
																{(fields2, { add, remove }) => (
																	<>
																		{fields2.map((field2) => (
																			<div
																				key={`${field2.key}-${field.name}`}
																				className="div-form-list-option"
																			>
																				<Form.Item
																					{...field2}
																					name={[field2.name, "id"]}
																					key={`${field2.key}-${field.name}-1`}
																					className="hide"
																				>
																					<FloatInput label="" placeholder="" />
																				</Form.Item>
																				<Form.Item
																					{...field2}
																					name={[field2.name, "option"]}
																					rules={[
																						{
																							required: true,
																							message: "Missing Answer",
																						},
																					]}
																					key={`${field2.key}-${field.name}-2`}
																					style={{
																						width: "100%",
																					}}
																				>
																					<FloatInput
																						label="Choices"
																						placeholder="Choices"
																					/>
																				</Form.Item>
																				<Form.Item
																					{...field2}
																					name={[field2.name, "status"]}
																					valuePropName="checked"
																					key={`${field2.key}-${field.name}-3`}
																					className="hide"
																				>
																					<Switch />
																				</Form.Item>
																				{fields2.length > 1 ? (
																					<div className="ant-row ant-form-item">
																						<Popconfirm
																							title="Are you sure to delete this option?"
																							onConfirm={() => {
																								handleDeleteQuestionOption(
																									field.name,
																									field2.name
																								);
																								remove(field2.name);
																							}}
																							onCancel={() =>
																								notification.success({
																									message: "Training Module",
																									description:
																										"Question not deleted",
																								})
																							}
																							okText="Yes"
																							cancelText="No"
																						>
																							<Button
																								type="link"
																								className="dynamic-delete-button"
																								loading={
																									isLoadingDeleteQuestionOption
																								}
																							>
																								<FontAwesomeIcon
																									icon={faTrashAlt}
																								/>
																							</Button>
																						</Popconfirm>
																					</div>
																				) : null}
																			</div>
																		))}

																		<Form.Item>
																			<Button
																				type="dashed"
																				onClick={() => {
																					let tempQuestion =
																						form.getFieldsValue().questions;
																					let tempQuestionOption =
																						tempQuestion[field.name]
																							.question_options;
																					tempQuestionOption.push({
																						key:
																							tempQuestionOption[
																								tempQuestionOption.length - 1
																							].key + 1,
																						id: "",
																						option: "",
																						status: 1,
																					});

																					tempQuestion[field.name] = {
																						...tempQuestion[field.name],
																						question_options:
																							tempQuestionOption,
																					};

																					setQuestionsData(tempQuestion);
																					add();

																					form.setFieldsValue({
																						questions: tempQuestion,
																					});
																				}}
																				block
																				icon={<FontAwesomeIcon icon={faPlus} />}
																			>
																				Add Question Option
																			</Button>
																		</Form.Item>
																	</>
																)}
															</Form.List>
														</Col>
													) : null}

													{questionsData &&
													questionsData[field.name] &&
													questionsData[field.name].question_type ===
														"Rating" ? (
														<Col xs={24} sm={24} md={24}>
															<Form.List
																{...field}
																name={[field.name, "question_options"]}
															>
																{(fields2, { add, remove }) => (
																	<>
																		{fields2.map((field2) => (
																			<div
																				key={`${field2.key}-${field.name}`}
																				className="div-form-list-option div-form-list-option-rating"
																			>
																				<Form.Item
																					{...field2}
																					name={[field2.name, "id"]}
																					key={`${field2.key}-${field.name}-1`}
																					className="hide"
																				>
																					<FloatInput label="" placeholder="" />
																				</Form.Item>
																				<div
																					// {...field2}
																					key={`${field2.key}-${field.name}-2`}
																					style={{
																						width: "100%",
																					}}
																				>
																					<div className="wrap-input-rating">
																						<div className="number">
																							{form.getFieldsValue().questions[
																								field.name
																							].question_options[field2.name]
																								.key + 1}
																						</div>
																						<Form.Item
																							{...field2}
																							name={[field2.name, "option"]}
																							key={`${field2.key}-${field.name}-2`}
																							noStyle
																						>
																							<FloatInput
																								label="Tool Tip (if none, leave blank)"
																								placeholder="Tool Tip (if none, leave blank)"
																							/>
																						</Form.Item>
																					</div>
																				</div>
																				<Form.Item
																					{...field2}
																					name={[field2.name, "status"]}
																					valuePropName="checked"
																					key={`${field2.key}-${field.name}-3`}
																					className="hide"
																				>
																					<Switch />
																				</Form.Item>
																				{fields2.length > 5 ? (
																					<div className="ant-row ant-form-item ant-form-item-dynamic-delete-button">
																						<Popconfirm
																							title="Are you sure to delete this option?"
																							onConfirm={() => {
																								handleDeleteQuestionOption(
																									field.name,
																									field2.name
																								);
																								remove(field2.name);
																							}}
																							onCancel={() =>
																								notification.success({
																									message: "Training Module",
																									description:
																										"Question not deleted",
																								})
																							}
																							okText="Yes"
																							cancelText="No"
																						>
																							<Button
																								type="link"
																								className="dynamic-delete-button"
																								loading={
																									isLoadingDeleteQuestionOption
																								}
																							>
																								<FontAwesomeIcon
																									icon={faTrashAlt}
																								/>
																							</Button>
																						</Popconfirm>
																					</div>
																				) : null}
																			</div>
																		))}

																		<Form.Item>
																			<Button
																				type="dashed"
																				onClick={() => {
																					let tempQuestion =
																						form.getFieldsValue().questions;
																					let tempQuestionOption =
																						tempQuestion[field.name]
																							.question_options;
																					tempQuestionOption.push({
																						key:
																							tempQuestionOption[
																								tempQuestionOption.length - 1
																							].key + 1,
																						id: "",
																						option: "",
																						status: 1,
																					});
																					tempQuestion[field.name] = {
																						...tempQuestion[field.name],
																						question_options:
																							tempQuestionOption,
																					};

																					// console.log(tempQuestionOption);

																					setQuestionsData(tempQuestion);
																					add();

																					form.setFieldsValue({
																						questions: tempQuestion,
																					});
																				}}
																				block
																				icon={<FontAwesomeIcon icon={faPlus} />}
																			>
																				Add Question Rating Option
																			</Button>
																		</Form.Item>
																	</>
																)}
															</Form.List>
														</Col>
													) : null}
												</Row>
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
											onClick={() => {
												let tempQuestion = form.getFieldsValue().questions;
												tempQuestion.push({ question: "" });

												setQuestionsData(tempQuestion);
												add();

												form.setFieldsValue({
													questions: tempQuestion,
												});
											}}
										>
											<span className="color-1">Add Another Question</span>
										</Button>
									</Form.Item>
								</>
							)}
						</Form.List>
					</Col>

					<Col xs={24} sm={24} md={24} lg={24} xl={10}>
						<Form.List name="audios">
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
												header="UPLOAD AUDIO"
												key="1"
												className="accordion bg-darkgray-form m-b-md border bgcolor-1 white"
												extra={
													fields.length > 1 ? (
														<Popconfirm
															title="Are you sure to delete this audio?"
															onConfirm={() => {
																handleDeleteAttachment(field.name, "Audio");
																remove(field.name);
															}}
															onCancel={() => {
																notification.success({
																	message: "Training Module",
																	description: "Audio not deleted",
																});
															}}
															okText="Yes"
															cancelText="No"
														>
															<Button
																type="link"
																loading={isLoadingDeleteAttachment}
																className="form-list-remove-button"
															>
																<FontAwesomeIcon
																	icon={faTrashAlt}
																	className="fa-lg"
																/>
															</Button>
														</Popconfirm>
													) : null
												}
											>
												<Form.Item
													{...field}
													name={[field.name, "id"]}
													className="m-b-md hide"
												>
													<FloatInput label="ss" placeholder="ss" />
												</Form.Item>

												<Row>
													<Col
														xs={24}
														sm={24}
														md={24}
														className="show_hide_option"
													>
														<Form.Item
															{...field}
															name={[field.name, "audio_status"]}
															valuePropName="checked"
															label="Hide/Show Audio"
															className="m-b-none"
														>
															<Switch />
														</Form.Item>
													</Col>
													<Col xs={24} sm={24} md={24}>
														<Form.Item
															{...field}
															name={[field.name, "audio_title"]}
															className="m-b-sm form-select-error"
														>
															<FloatInput
																label="Audio Title"
																placeholder="Audio Title"
															/>
														</Form.Item>
													</Col>
													<Col xs={24} sm={24} md={24}>
														<Form.Item
															{...field}
															name={[field.name, "audio_file"]}
															className="m-b-sm "
															valuePropName="fileList"
															getValueFromEvent={(e) => {
																if (Array.isArray(e)) {
																	return e;
																}

																return e?.fileList;
															}}
														>
															<Upload
																className="upload-w-100 upload-hide-remove-icon"
																accept="audio/mp3,audio/*"
																beforeUpload={(file) => {
																	let error = false;
																	const isLt2M =
																		file.size / 102400 / 102400 < 10;
																	if (!isLt2M) {
																		message.error(
																			"Audio must smaller than 10MB!"
																		);
																		error = Upload.LIST_IGNORE;
																	}
																	return error;
																}}
																maxCount={1}
															>
																<Button
																	icon={
																		<FontAwesomeIcon
																			icon={faFileArrowUp}
																			className="m-r-xs"
																		/>
																	}
																	className="btn-main-2-outline w-100"
																	block
																	size="large"
																>
																	Upload Audio
																</Button>
															</Upload>
														</Form.Item>
													</Col>
												</Row>
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
											onClick={() => {
												// let tempQuestion = form.getFieldsValue().questions;
												// // console.log("tempQuestion", tempQuestion);
												// tempQuestion.push({ question: "" });

												// setQuestionsData(tempQuestion);
												add();

												// form.setFieldsValue({
												// 	questions: tempQuestion,
												// });
											}}
										>
											<span className="color-1">Add Another Audio</span>
										</Button>
									</Form.Item>
								</>
							)}
						</Form.List>

						<Form.List name="documents">
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
												header="UPLOAD DOCUMENT"
												key="1"
												className="accordion bg-darkgray-form m-b-md border bgcolor-1 white"
												extra={
													fields.length > 1 ? (
														<Popconfirm
															title="Are you sure to delete this document?"
															onConfirm={() => {
																handleDeleteAttachment(field.name, "Document");
																remove(field.name);
															}}
															onCancel={() => {
																notification.success({
																	message: "Training Module",
																	description: "Audio not deleted",
																});
															}}
															okText="Yes"
															cancelText="No"
														>
															<Button
																type="link"
																loading={isLoadingDeleteAttachment}
																className="form-list-remove-button"
															>
																<FontAwesomeIcon
																	icon={faTrashAlt}
																	className="fa-lg"
																/>
															</Button>
														</Popconfirm>
													) : null
												}
											>
												<Form.Item
													{...field}
													name={[field.name, "id"]}
													className="m-b-md hide"
												>
													<FloatInput label="ss" placeholder="ss" />
												</Form.Item>

												<Row>
													<Col
														xs={24}
														sm={24}
														md={24}
														className="show_hide_option"
													>
														<Form.Item
															{...field}
															name={[field.name, "document_status"]}
															valuePropName="checked"
															label="Hide/Show Document"
															className="m-b-none"
														>
															<Switch />
														</Form.Item>
													</Col>
													<Col xs={24} sm={24} md={24}>
														<Form.Item
															{...field}
															name={[field.name, "document_name"]}
															className="m-b-sm form-select-error"
														>
															<FloatInput
																label="PDF Name"
																placeholder="PDF Name"
															/>
														</Form.Item>
													</Col>
													<Col xs={24} sm={24} md={24}>
														<Form.Item
															{...field}
															name={[field.name, "document_file"]}
															className="m-b-sm "
															valuePropName="fileList"
															getValueFromEvent={(e) => {
																if (Array.isArray(e)) {
																	return e;
																}

																return e?.fileList;
															}}
														>
															<Upload
																className="upload-w-100 upload-hide-remove-icon"
																accept="application/pdf"
																beforeUpload={(file) => {
																	let error = false;
																	const isLt2M =
																		file.size / 102400 / 102400 < 10;
																	if (!isLt2M) {
																		message.error(
																			"Document must smaller than 10MB!"
																		);
																		error = Upload.LIST_IGNORE;
																	}
																	return error;
																}}
																maxCount={1}
															>
																<Button
																	icon={
																		<FontAwesomeIcon
																			icon={faFileArrowUp}
																			className="m-r-xs"
																		/>
																	}
																	className="btn-main-2-outline w-100"
																	block
																	size="large"
																>
																	Upload Document
																</Button>
															</Upload>
														</Form.Item>
													</Col>
												</Row>
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
											onClick={() => {
												add();
											}}
										>
											<span className="color-1">Add Another Document</span>
										</Button>
									</Form.Item>
								</>
							)}
						</Form.List>
					</Col>
					<Col xs={24} sm={24} md={24}>
						<Button
							htmlType="submit"
							className="btn-main-invert"
							loading={isLoadingUpdateLesson}
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
