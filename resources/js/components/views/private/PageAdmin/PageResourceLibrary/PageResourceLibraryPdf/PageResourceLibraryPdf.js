import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import {
	Button,
	Card,
	Col,
	Form,
	notification,
	Popconfirm,
	Row,
	Table,
} from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faPencil,
	faFileLines,
	faTrashAlt,
} from "@fortawesome/pro-solid-svg-icons";
import {
	TableGlobalInputSearch,
	TablePageSize,
	TablePagination,
	TableShowingEntries,
} from "../../../Components/ComponentTableFilter";
import { DELETE, GET } from "../../../../../providers/useAxiosQuery";
import moment from "moment";
import FloatSelect from "../../../../../providers/FloatSelect";

export default function PageResourceLibraryPdf() {
	const history = useHistory();
	const [tableFilter, setTableFilter] = useState({
		page: 1,
		page_size: 50,
		search: "",
		sort_field: "id",
		sort_order: "desc",
		resource_type: "PDF Resource",
		resource_for: "Both",
	});

	const { data: dataSource, refetch: refetchSource } = GET(
		`api/v1/resource?${new URLSearchParams(tableFilter)}`,
		"pdf_resource_data_list"
	);

	const { mutate: mutateDeleteResources, isLoading: isLoadingDeleteResources } =
		DELETE("api/v1/resource", "pdf_resource_data_list");

	const handleDelete = (values) => {
		mutateDeleteResources(values, {
			onSuccess: (res) => {
				if (res.success) {
					notification.success({
						message: "Resource Library PDF",
						description: res.message,
					});
				} else {
					notification.error({
						message: "Resource Library PDF",
						description: res.message,
					});
				}
			},
			onError: (err) => {
				notification.error({
					message: "Resource Library PDF",
					description: err.response.data.message,
				});
			},
		});
	};

	const handleTableChange = (pagination, filters, sorter) => {
		setTableFilter({
			...tableFilter,
			sort_field: sorter.columnKey,
			sort_order: sorter.order ? sorter.order.replace("end", "") : null,
			page: 1,
			page_size: "50",
		});
	};

	useEffect(() => {
		if (dataSource) {
			refetchSource();
		}

		return () => {};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [tableFilter]);

	return (
		<Card id="PageResourceLibraryPdf">
			<Row gutter={[12, 12]}>
				<Col xs={24} sm={24} md={24}>
					<Button
						className="btn-main-invert b-r-none"
						onClick={() => history.push("/resource-library/pdf-resources/add")}
						size="large"
						icon={<FontAwesomeIcon icon={faFileLines} className="m-r-sm" />}
					>
						ADD PDF RESOURCE
					</Button>
				</Col>
				<Col xs={24} sm={24} md={24}>
					<Row gutter={[12, 12]}>
						<Col xs={24} sm={24} md={24} lg={8} xl={14}>
							<TablePageSize
								tableFilter={tableFilter}
								setTableFilter={setTableFilter}
							/>
						</Col>
						<Col xs={24} sm={24} md={24} lg={8} xl={5}>
							<Row gutter={[12, 12]}>
								<Col xs={24} sm={24} md={12} lg={24}>
									<Form>
										<Form.Item>
											<FloatSelect
												label="Resource For"
												placeholder="Resource For"
												value={tableFilter.resource_for}
												options={[
													{ label: "Both", value: "Both" },
													{
														label: "Cancer Caregiver",
														value: "Cancer Caregiver",
													},
													{
														label: "Cancer Care Professional",
														value: "Cancer Care Professional",
													},
												]}
												onChange={(e) =>
													setTableFilter({ ...tableFilter, resource_for: e })
												}
											/>
										</Form.Item>
									</Form>
								</Col>
							</Row>
						</Col>
						<Col xs={24} sm={24} md={24} lg={8} xl={5}>
							<Row gutter={[12, 12]}>
								<Col xs={24} sm={24} md={12} lg={24}>
									<TableGlobalInputSearch
										tableFilter={tableFilter}
										setTableFilter={setTableFilter}
									/>
								</Col>
							</Row>
						</Col>
					</Row>
				</Col>
				<Col xs={24} sm={24} md={24}>
					<Table
						className="ant-table-default ant-table-striped"
						dataSource={dataSource && dataSource.data.data}
						rowKey={(record) => record.id}
						pagination={false}
						bordered={false}
						onChange={handleTableChange}
						scroll={{ x: "max-content" }}
					>
						<Table.Column
							title="Add Date"
							key="created_at"
							dataIndex="created_at"
							render={(text, _) => moment(text).format("MM/DD/YYYY")}
							defaultSortOrder="descend"
							sorter={true}
						/>
						<Table.Column
							title="Resource Title"
							key="title"
							dataIndex="title"
							sorter={true}
							render={(text, _) => {
								return (
									<Button type="link" className="color-1">
										{text}
									</Button>
								);
							}}
						/>
						<Table.Column
							title="Resource Category"
							key="resource_for"
							dataIndex="resource_for"
							sorter={true}
						/>
						<Table.Column
							title="Priority"
							key="priority"
							dataIndex="priority"
							align="center"
							sorter={true}
						/>
						<Table.Column
							title="Start Date"
							key="start_date"
							dataIndex="start_date"
							align="center"
							sorter={true}
							render={(text, record) =>
								text ? moment(text).format("MMMM DD, YYYY") : ""
							}
						/>
						<Table.Column
							title="End Date"
							key="end_date"
							dataIndex="end_date"
							align="center"
							sorter={true}
							render={(text, record) =>
								text ? moment(text).format("MMMM DD, YYYY") : ""
							}
						/>
						<Table.Column
							title="Status"
							key="status"
							dataIndex="status"
							align="center"
							render={(text) => (text === 1 ? "Public" : "Draft")}
							sorter={true}
						/>
						<Table.Column
							title="Action"
							key="action"
							dataIndex="action"
							align="center"
							render={(_, record) => {
								return (
									<>
										<Button
											type="link"
											className="color-1"
											onClick={() =>
												history.push({
													pathname: "/resource-library/pdf-resources/edit",
													state: record.id,
												})
											}
											icon={<FontAwesomeIcon icon={faPencil} />}
										/>
										<Popconfirm
											title="Are you sure to delete this data?"
											onConfirm={(e) => handleDelete(record)}
											// onCancel={cancel}
											okText="Yes"
											cancelText="No"
										>
											<Button
												type="link"
												className="color-6"
												loading={isLoadingDeleteResources}
												icon={<FontAwesomeIcon icon={faTrashAlt} />}
											/>
										</Popconfirm>
									</>
								);
							}}
						/>
					</Table>
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
		</Card>
	);
}
