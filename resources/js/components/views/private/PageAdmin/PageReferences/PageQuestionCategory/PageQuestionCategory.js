import { useEffect, useState } from "react";
import { Button, Card, Col, notification, Popconfirm, Row, Table } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faPencil, faTrashAlt } from "@fortawesome/pro-solid-svg-icons";
import {
	TableGlobalInputSearch,
	TablePageSize,
	TablePagination,
	TableShowingEntries,
} from "../../../Components/ComponentTableFilter";
import { DELETE, GET, POST } from "../../../../../providers/useAxiosQuery";
import ModalForm from "./Component/ModalForm";

export default function PageQuestionCategory() {
	const [toggleModal, setToggleModal] = useState({
		show: false,
		data: null,
	});

	const [tableFilter, setTableFilter] = useState({
		page: 1,
		page_size: 50,
		search: "",
		sort_field: "",
		sort_order: "asc",
	});

	const { data: dataSource, refetch: refetchTable } = GET(
		`api/v1/question_category?${new URLSearchParams(tableFilter)}`,
		"question_category_data_list"
	);

	const {
		mutate: mutateCreateUpdateQuestionCategory,
		isLoading: isLoadingCreateUpdateQuestionCategory,
	} = POST("api/v1/question_category", "question_category_data_list");

	const {
		mutate: mutateDeleteQuestionCategory,
		isLoading: isLoadingDeleteQuestionCategory,
	} = DELETE("api/v1/question_category", "question_category_data_list");

	const onFinishModal = (values) => {
		let data = { ...values, id: toggleModal.data?.id };

		mutateCreateUpdateQuestionCategory(data, {
			onSuccess: (res) => {
				if (res.success) {
					notification.success({
						message: "Question Category",
						description: res.message,
					});

					setToggleModal({
						show: false,
						data: null,
					});
				} else {
					notification.error({
						message: "Question Category",
						description: res.message,
					});
				}
			},
			onError: (err) => {
				notification.error({
					message: "Question Category",
					description: err.response.data.message,
				});
			},
		});
	};

	const handleDelete = (values) => {
		mutateDeleteQuestionCategory(values, {
			onSuccess: (res) => {
				if (res.success) {
					notification.success({
						message: "Question Category",
						description: res.message,
					});
				} else {
					notification.error({
						message: "Question Category",
						description: res.message,
					});
				}
			},
			onError: (err) => {
				notification.error({
					message: "Question Category",
					description: err.response.data.message,
				});
			},
		});
	};

	const onChangeTable = (pagination, filters, sorter) => {
		setTableFilter({
			...tableFilter,
			sort_field: sorter.columnKey,
			sort_order: sorter.order ? sorter.order.replace("end", "") : null,
			page: 1,
		});
	};

	useEffect(() => {
		if (dataSource) {
			refetchTable();
		}
		return () => {};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [tableFilter]);

	return (
		<Card id="PageQuestionCategory">
			<Row gutter={[12, 12]}>
				<Col xs={24} sm={24} md={24} lg={12}>
					<Row gutter={[12, 12]}>
						<Col xs={24} sm={24} md={24}>
							<Button
								className="btn-main-invert-outline b-r-none"
								icon={<FontAwesomeIcon icon={faPlus} className="m-r-xs" />}
								onClick={(e) => {
									setToggleModal({
										show: true,
										data: null,
									});
								}}
								size="large"
							>
								Add Question Category
							</Button>
						</Col>
						<Col xs={24} sm={24} md={24}>
							<div className="ant-space-flex-space-between table-size-table-search">
								<div>
									<TablePageSize
										tableFilter={tableFilter}
										setTableFilter={setTableFilter}
									/>
								</div>

								<div>
									<TableGlobalInputSearch
										tableFilter={tableFilter}
										setTableFilter={setTableFilter}
									/>
								</div>
							</div>
						</Col>

						<Col xs={24} sm={24} md={24}>
							<div className="table-responsive">
								<Table
									className="ant-table-default ant-table-striped"
									dataSource={dataSource && dataSource.data.data}
									rowKey={(record) => record.id}
									pagination={false}
									bordered={false}
									onChange={onChangeTable}
									// rowSelection={{
									//   type: selectionType,
									//   ...rowSelection,
									// }}
									scroll={{ x: "max-content" }}
								>
									<Table.Column
										title="Question Category"
										key="question_category"
										dataIndex="question_category"
										defaultSortOrder={"ascend"}
										// render={(text, record) => moment(text).format("MMMM DD, YYYY")}
										sorter={true}
									/>
									<Table.Column
										title="Action"
										key="action"
										render={(_, record) => {
											return (
												<>
													<Button
														type="link"
														className="color-1"
														onClick={() => {
															setToggleModal({
																show: true,
																data: record,
															});
														}}
														icon={<FontAwesomeIcon icon={faPencil} />}
													/>

													<Popconfirm
														title="Are you sure to delete this data?"
														onConfirm={() => handleDelete(record)}
														onCancel={() => {
															notification.error({
																message: "Question Category",
																description: "Data not deleted",
															});
														}}
														okText="Yes"
														cancelText="No"
													>
														<Button
															type="link"
															className="color-6"
															loading={isLoadingDeleteQuestionCategory}
															icon={<FontAwesomeIcon icon={faTrashAlt} />}
														/>
													</Popconfirm>
												</>
											);
										}}
									/>
								</Table>
							</div>
						</Col>
						<Col xs={24} sm={24} md={24}>
							<div className="ant-space-flex-space-between table-entries-table-pagination">
								<TableShowingEntries />

								<TablePagination
									tableFilter={tableFilter}
									setTableFilter={setTableFilter}
									setPaginationTotal={dataSource?.data.total}
									showLessItems={true}
									showSizeChanger={false}
								/>
							</div>
						</Col>
					</Row>
				</Col>
			</Row>

			<ModalForm
				toggleModal={toggleModal}
				setToggleModal={setToggleModal}
				onFinish={onFinishModal}
				isLoading={isLoadingCreateUpdateQuestionCategory}
			/>
		</Card>
	);
}
