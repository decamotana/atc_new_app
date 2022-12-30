import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Button, Card, Collapse, notification, Popconfirm, Tabs } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faPencil,
	faClone,
	faTrashAlt,
} from "@fortawesome/pro-solid-svg-icons";
import {
	DELETE,
	GET,
	POST,
	UPDATE,
} from "../../../../../providers/useAxiosQuery";
import ModalFormEditTrainingModule from "./Component/ModalFormEditTrainingModule";
import noDataFoundPng from "../../../../../assets/img/no-data-found.jpg";
import ModalCloneLesson from "./Component/ModalCloneLesson";

export default function PageTrainingModulesEdit() {
	const history = useHistory();

	const [toggleModalEdit, setToggleModalEdit] = useState({
		show: false,
		data: null,
	});

	const [dataSourceModuleCaregiver, setDataSourceModuleCaregiver] = useState(
		[]
	);
	const [
		dataSourceModuleCareProfessional,
		setDataSourceModuleCareProfessional,
	] = useState([]);

	GET(`api/v1/module`, "module_data_list", (res) => {
		if (res.data) {
			setDataSourceModuleCaregiver(
				res.data.filter(
					(itemFiltered) => itemFiltered.module_for === "Cancer Caregiver"
				)
			);
			setDataSourceModuleCareProfessional(
				res.data.filter(
					(itemFiltered) =>
						itemFiltered.module_for === "Cancer Care Professional"
				)
			);
		}
	});

	const { mutate: mutateUpdateModule, isLoading: isLoadingUpdateModule } =
		UPDATE("api/v1/module", "module_data_list");

	const { mutate: mutateDeleteModule, isLoading: isLoadingDeleteModule } =
		DELETE("api/v1/module", "module_data_list");

	const { mutate: mutateDeleteLesson, isLoading: isLoadingDeleteLesson } =
		DELETE("api/v1/lesson", "module_data_list");

	const { mutate: mutateModuleClone, isLoading: isLoadingModuleClone } = POST(
		"api/v1/module_clone",
		"module_data_list"
	);

	const { mutate: mutateLessonClone, isLoading: isLoadingLessonClone } = POST(
		"api/v1/lesson_clone",
		"module_data_list"
	);

	const { mutate: mutateSortModule } = POST(
		"api/v1/module_sort",
		"module_data_list"
	);

	const onFinishModalModule = (values) => {
		let data = {
			...values,
			module_for: toggleModalEdit.data.module_for,
			id: toggleModalEdit.data.id,
		};

		mutateUpdateModule(data, {
			onSuccess: (res) => {
				if (res.success) {
					notification.success({
						message: "Module",
						description: res.message,
					});

					setToggleModalEdit({
						show: false,
						data: null,
					});
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
	};

	const handleDeleteModule = (values) => {
		mutateDeleteModule(values, {
			onSuccess: (res) => {
				if (res.success) {
					notification.success({
						message: "Module",
						description: res.message,
					});
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
	};

	const handleDeleteLesson = (values) => {
		mutateDeleteLesson(values, {
			onSuccess: (res) => {
				if (res.success) {
					notification.success({
						message: "Module Lesson",
						description: res.message,
					});
				} else {
					notification.error({
						message: "Module Lesson",
						description: res.message,
					});
				}
			},
			onError: (err) => {
				notification.error({
					message: "Module Lesson",
					description: err.response.data.message,
				});
			},
		});
	};

	const handleCloneModule = (values, clone_to) => {
		// console.log("handleCloneModule values", values);
		mutateModuleClone(
			{ ...values, clone_to },
			{
				onSuccess: (res) => {
					// console.log("handleCloneModule res", res);
					if (res.success) {
						notification.success({
							message: "Module",
							description: res.message,
						});
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
			}
		);
	};

	const [cloneLessonTo, setCloneLessonTo] = useState({
		open: false,
		data: null,
		clone_to: null,
	});
	const handleCloneLesson = (values) => {
		// console.log("handleCloneLesson", values);
		let data = { ...values, ...cloneLessonTo };
		// console.log("data", data);
		mutateLessonClone(data, {
			onSuccess: (res) => {
				// console.log("handleCloneModule res", res);
				if (res.success) {
					notification.success({
						message: "Lesson",
						description: res.message,
					});

					setCloneLessonTo({
						open: false,
						data: null,
						clone_to: null,
					});
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
	};
	// useEffect(() => {
	// 	refetchModule();

	// 	return () => {};
	// 	// eslint-disable-next-line react-hooks/exhaustive-deps
	// }, []);

	// Function to update list on drop
	const handleDropCaregiver = (droppedItem) => {
		// Ignore drop outside droppable container
		if (!droppedItem.destination) return;
		var updatedList = [...dataSourceModuleCaregiver];
		// Remove dragged item
		const [reorderedItem] = updatedList.splice(droppedItem.source.index, 1);
		// Add dropped item
		updatedList.splice(droppedItem.destination.index, 0, reorderedItem);
		// Update State
		setDataSourceModuleCaregiver(updatedList);

		mutateSortModule(
			{ list: updatedList },
			{
				onSuccess: (res) => {
					if (res.success) {
						notification.success({
							message: "Module",
							description: res.message,
						});
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
			}
		);
	};

	// Function to update list on drop
	const handleDropCareProfessional = (droppedItem) => {
		// Ignore drop outside droppable container
		if (!droppedItem.destination) return;
		var updatedList = [...dataSourceModuleCareProfessional];
		// Remove dragged item
		const [reorderedItem] = updatedList.splice(droppedItem.source.index, 1);
		// Add dropped item
		updatedList.splice(droppedItem.destination.index, 0, reorderedItem);
		// Update State
		setDataSourceModuleCareProfessional(updatedList);

		mutateSortModule(
			{ list: updatedList },
			{
				onSuccess: (res) => {
					if (res.success) {
						notification.success({
							message: "Module",
							description: res.message,
						});
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
			}
		);
	};

	return (
		<Card className="page-admin-training-module" id="PageTrainingModulesEdit">
			<Tabs
				defaultActiveKey="1"
				type="card"
				size="large"
				className="tab-training-module"
				items={[
					{
						key: "1",
						label: "Cancer Caregiver",
						children:
							dataSourceModuleCaregiver &&
							dataSourceModuleCaregiver.length > 0 ? (
								<DragDropContext onDragEnd={handleDropCaregiver}>
									<Droppable droppableId="list-container-care">
										{(provided) => (
											<div
												className="list-container-care"
												{...provided.droppableProps}
												ref={provided.innerRef}
											>
												{dataSourceModuleCaregiver.map((item, index) => (
													<Draggable
														key={item.module_name + "-" + item.order_no}
														draggableId={item.module_name + "-" + item.order_no}
														index={index}
													>
														{(provided) => (
															<div
																className="item-container-care"
																ref={provided.innerRef}
																{...provided.dragHandleProps}
																{...provided.draggableProps}
															>
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
																>
																	<Collapse.Panel
																		header={
																			<div>
																				<div>{item.module_number}</div>
																				<div>{item.module_name}</div>
																				<div className="text-right">
																					{item.year}
																				</div>
																			</div>
																		}
																		key="1"
																		className="accordion bg-darkgray-form m-b-md border bgcolor-1 white"
																	>
																		<table className="table table-striped">
																			<tbody>
																				<tr className="bgcolor-12">
																					<td className="color-1 font-600">
																						{item.module_number}
																					</td>
																					<td className="font-600">
																						{item.module_name}
																					</td>
																					<td className="text-right">
																						<Button
																							type="link"
																							className="color-1"
																							onClick={() => {
																								setToggleModalEdit({
																									show: true,
																									data: item,
																								});
																							}}
																							icon={
																								<FontAwesomeIcon
																									icon={faPencil}
																								/>
																							}
																						/>

																						<Popconfirm
																							title={
																								<div className="text-center">
																									Are you sure you want to clone
																									this module to{" "}
																									<div
																										className="color-6"
																										style={{ fontSize: "15px" }}
																									>
																										Cancer Care Professional
																									</div>
																								</div>
																							}
																							onConfirm={() =>
																								handleCloneModule(
																									item,
																									"Cancer Care Professional"
																								)
																							}
																							onCancel={() =>
																								notification.success({
																									message: "Module",
																									description:
																										"Cancelled clone",
																								})
																							}
																							okText="Yes"
																							cancelText="No"
																							placement="topRight"
																							okButtonProps={{
																								className:
																									"bgcolor-6 border-color-6",
																							}}
																						>
																							<Button
																								type="link"
																								className="color-17"
																								loading={isLoadingModuleClone}
																								icon={
																									<FontAwesomeIcon
																										icon={faClone}
																									/>
																								}
																							/>
																						</Popconfirm>

																						<Popconfirm
																							title="Are you sure to delete this module?"
																							onConfirm={() =>
																								handleDeleteModule(item)
																							}
																							onCancel={() =>
																								notification.success({
																									message: "Module",
																									description:
																										"Module not deleted",
																								})
																							}
																							okText="Yes"
																							cancelText="No"
																						>
																							<Button
																								type="link"
																								className="color-6"
																								loading={isLoadingDeleteModule}
																								icon={
																									<FontAwesomeIcon
																										icon={faTrashAlt}
																									/>
																								}
																							/>
																						</Popconfirm>
																					</td>
																				</tr>
																				{item.lessons &&
																					item.lessons.map((item2, index2) => {
																						return (
																							<tr key={index2}>
																								<td className="color-1">
																									{item2.lesson_number}
																								</td>
																								<td>{item2.lesson_name}</td>
																								<td className="text-right">
																									<Button
																										type="link"
																										className="color-1"
																										onClick={() => {
																											history.push({
																												pathname:
																													"/training-modules/edit/lesson",
																												state: item2.id,
																											});
																										}}
																										icon={
																											<FontAwesomeIcon
																												icon={faPencil}
																											/>
																										}
																									/>

																									<Button
																										type="link"
																										className="color-17"
																										loading={
																											isLoadingDeleteModule
																										}
																										icon={
																											<FontAwesomeIcon
																												icon={faClone}
																											/>
																										}
																										onClick={() =>
																											setCloneLessonTo({
																												open: true,
																												data: item2.id,
																												clone_to:
																													"Cancer Care Professional",
																											})
																										}
																									/>

																									<Popconfirm
																										title="Are you sure to delete this lesson?"
																										onConfirm={() =>
																											handleDeleteLesson(item2)
																										}
																										onCancel={() =>
																											notification.success({
																												message:
																													"Module Lesson",
																												description:
																													"Lesson not deleted",
																											})
																										}
																										okText="Yes"
																										cancelText="No"
																									>
																										<Button
																											type="link"
																											className="color-6"
																											loading={
																												isLoadingDeleteLesson
																											}
																											icon={
																												<FontAwesomeIcon
																													icon={faTrashAlt}
																												/>
																											}
																										/>
																									</Popconfirm>
																								</td>
																							</tr>
																						);
																					})}
																			</tbody>
																		</table>
																	</Collapse.Panel>
																</Collapse>
															</div>
														)}
													</Draggable>
												))}
												{provided.placeholder}
											</div>
										)}
									</Droppable>
								</DragDropContext>
							) : (
								<div className="text-center">
									<img
										alt="no data found"
										src={noDataFoundPng}
										className="w-100"
									/>
								</div>
							),
					},
					{
						key: "2",
						label: "Cancer Care Professional",
						children:
							dataSourceModuleCareProfessional &&
							dataSourceModuleCareProfessional.length > 0 ? (
								<DragDropContext onDragEnd={handleDropCareProfessional}>
									<Droppable droppableId="list-container-care-pro">
										{(provided) => (
											<div
												className="list-container-care-pro"
												{...provided.droppableProps}
												ref={provided.innerRef}
											>
												{dataSourceModuleCareProfessional.map((item, index) => (
													<Draggable
														key={item.module_name + "-" + item.order_no}
														draggableId={item.module_name + "-" + item.order_no}
														index={index}
													>
														{(provided) => (
															<div
																className="item-container-care-pro"
																ref={provided.innerRef}
																{...provided.dragHandleProps}
																{...provided.draggableProps}
															>
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
																>
																	<Collapse.Panel
																		header={
																			<div>
																				<div>{item.module_number}</div>
																				<div>{item.module_name}</div>
																				<div className="text-right">
																					{item.year}
																				</div>
																			</div>
																		}
																		key="1"
																		className="accordion bg-darkgray-form m-b-md border bgcolor-1 white"
																	>
																		<table className="table table-striped">
																			<tbody>
																				<tr className="bgcolor-12">
																					<td className="color-1 font-600">
																						{item.module_number}
																					</td>
																					<td className="font-600">
																						{item.module_name}
																					</td>
																					<td className="text-right">
																						<Button
																							type="link"
																							className="color-1"
																							onClick={() => {
																								setToggleModalEdit({
																									show: true,
																									data: item,
																								});
																							}}
																							icon={
																								<FontAwesomeIcon
																									icon={faPencil}
																								/>
																							}
																						/>

																						<Popconfirm
																							title={
																								<div className="text-center">
																									Are you sure you want to clone
																									this module to{" "}
																									<div
																										className="color-6"
																										style={{ fontSize: "15px" }}
																									>
																										Cancer Caregiver
																									</div>
																								</div>
																							}
																							onConfirm={() =>
																								handleCloneModule(
																									item,
																									"Cancer Caregiver"
																								)
																							}
																							onCancel={() =>
																								notification.success({
																									message: "Module",
																									description:
																										"Cancelled clone",
																								})
																							}
																							okText="Yes"
																							cancelText="No"
																							placement="topRight"
																							okButtonProps={{
																								className:
																									"bgcolor-6 border-color-6",
																							}}
																						>
																							<Button
																								type="link"
																								className="color-17"
																								loading={isLoadingModuleClone}
																								icon={
																									<FontAwesomeIcon
																										icon={faClone}
																									/>
																								}
																							/>
																						</Popconfirm>

																						<Popconfirm
																							title="Are you sure to delete this module?"
																							onConfirm={() =>
																								handleDeleteModule(item)
																							}
																							onCancel={() =>
																								notification.success({
																									message: "Module",
																									description:
																										"Module not deleted",
																								})
																							}
																							okText="Yes"
																							cancelText="No"
																						>
																							<Button
																								type="link"
																								className="color-6"
																								loading={isLoadingDeleteModule}
																								icon={
																									<FontAwesomeIcon
																										icon={faTrashAlt}
																									/>
																								}
																							/>
																						</Popconfirm>
																					</td>
																				</tr>
																				{item.lessons &&
																					item.lessons.map((item2, index2) => {
																						return (
																							<tr key={index2}>
																								<td className="color-1">
																									{item2.lesson_number}
																								</td>
																								<td>{item2.lesson_name}</td>
																								<td className="text-right">
																									<Button
																										type="link"
																										className="color-1"
																										onClick={() => {
																											history.push({
																												pathname:
																													"/training-modules/edit/lesson",
																												state: item2.id,
																											});
																										}}
																										icon={
																											<FontAwesomeIcon
																												icon={faPencil}
																											/>
																										}
																									/>

																									<Button
																										type="link"
																										className="color-17"
																										loading={
																											isLoadingDeleteModule
																										}
																										icon={
																											<FontAwesomeIcon
																												icon={faClone}
																											/>
																										}
																										onClick={() =>
																											setCloneLessonTo({
																												open: true,
																												data: item2.id,
																												clone_to:
																													"Cancer Caregiver",
																											})
																										}
																									/>

																									<Popconfirm
																										title="Are you sure to delete this lesson?"
																										onConfirm={() =>
																											handleDeleteLesson(item2)
																										}
																										onCancel={() =>
																											notification.success({
																												message:
																													"Module Lesson",
																												description:
																													"Lesson not deleted",
																											})
																										}
																										okText="Yes"
																										cancelText="No"
																									>
																										<Button
																											type="link"
																											className="color-6"
																											loading={
																												isLoadingDeleteLesson
																											}
																											icon={
																												<FontAwesomeIcon
																													icon={faTrashAlt}
																												/>
																											}
																										/>
																									</Popconfirm>
																								</td>
																							</tr>
																						);
																					})}
																			</tbody>
																		</table>
																	</Collapse.Panel>
																</Collapse>
															</div>
														)}
													</Draggable>
												))}
												{provided.placeholder}
											</div>
										)}
									</Droppable>
								</DragDropContext>
							) : (
								<div className="text-center">
									<img
										alt="no data found"
										src={noDataFoundPng}
										className="w-100"
									/>
								</div>
							),
					},
				]}
			></Tabs>

			<ModalFormEditTrainingModule
				toggleModalEdit={toggleModalEdit}
				setToggleModalEdit={setToggleModalEdit}
				onFinish={onFinishModalModule}
				isLoading={isLoadingUpdateModule}
			/>
			<ModalCloneLesson
				cloneLessonTo={cloneLessonTo}
				setCloneLessonTo={setCloneLessonTo}
				onFinish={handleCloneLesson}
				isLoading={isLoadingLessonClone}
			/>
		</Card>
	);
}
