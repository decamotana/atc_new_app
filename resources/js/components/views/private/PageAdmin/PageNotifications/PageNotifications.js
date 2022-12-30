import React, { useEffect, useState } from "react";
import { Button, Card, Col, notification, Popconfirm, Row, Table } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	TableGlobalInputSearch,
	TablePageSize,
	TablePagination,
	TableShowingEntries,
} from "../../Components/ComponentTableFilter";
import { faPlus, faPencil, faTrashAlt } from "@fortawesome/pro-solid-svg-icons";
import ModalForm from "./Components/ModalForm";
import { DELETE, GET, POST } from "../../../../providers/useAxiosQuery";

export default function PageNotifications() {
	const [toggleModalForm, setToggleModalForm] = useState({
		show: false,
		data: null,
	});

	const [dataSource, setDataSource] = useState([]);
	const [tableFilter, setTableFilter] = useState({
		page: 1,
		page_size: 50,
		search: "",
		sort_field: "title",
		sort_order: "desc",
	});

	const { refetch: refetchNotifications } = GET(
		`api/v1/notification?${new URLSearchParams(tableFilter)}`,
		"notification_data_list",
		(res) => {
			if (res.data) {
				// console.log("res.data", res);
				setDataSource(res.data);
			}
		}
	);

	const {
		mutate: mutateCreateNotification,
		isLoading: isLoadingCreateNotification,
	} = POST("api/v1/notification", "notification_data_list");

	const { mutate: mutateDeleteNotif, isLoading: isLoadingDeleteNotif } = DELETE(
		"api/v1/notification",
		"notification_data_list"
	);

	const onFinish = (values) => {
		let data = {
			...values,
			id:
				toggleModalForm.data && toggleModalForm.data.id
					? toggleModalForm.data.id
					: "",
			old_type:
				toggleModalForm.data && toggleModalForm.data.type
					? toggleModalForm.data.type
					: "",
		};

		mutateCreateNotification(data, {
			onSuccess: (res) => {
				if (res.success) {
					notification.success({
						message: "Notification",
						description: res.message,
					});
					setToggleModalForm({ show: false, data: null });
				} else {
					notification.error({
						message: "Notification",
						description: res.message,
					});
				}
			},
			onError: (err) => {
				notification.error({
					message: "Notification",
					description: err.response.data.message,
				});
			},
		});
	};

	const handleDelete = (values) => {
		mutateDeleteNotif(values, {
			onSuccess: (res) => {
				if (res.success) {
					notification.success({
						message: "Notification",
						description: res.message,
					});
				} else {
					notification.error({
						message: "Notification",
						description: res.message,
					});
				}
			},
			onError: (err) => {
				notification.error({
					message: "Notification",
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
		refetchNotifications();

		return () => {};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [tableFilter]);

	return (
		<Card id="PageNotifications">
			<Row gutter={[12, 12]}>
				<Col xs={24} sm={24} md={24}>
					<Button
						className="btn-main-invert b-r-none"
						onClick={() => setToggleModalForm({ show: true, data: null })}
						size="large"
					>
						<FontAwesomeIcon icon={faPlus} className="m-r-sm" />{" "}
						<span>ADD NOTIFICATIONS</span>
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
					<Table
						className="ant-table-default ant-table-striped"
						dataSource={dataSource && dataSource.data}
						rowKey={(record) => record.id}
						pagination={false}
						bordered={false}
						onChange={handleTableChange}
						scroll={{ x: "max-content" }}
					>
						<Table.Column
							title="Title"
							key="title"
							dataIndex="title"
							sorter={true}
							render={(text, record) => {
								return (
									<Button type="link" className="color-1 cursor-auto">
										{text}
									</Button>
								);
							}}
						/>
						<Table.Column
							title="Description"
							key="description"
							dataIndex="description"
							sorter={true}
							render={(text, _) => (
								<div
									dangerouslySetInnerHTML={{ __html: text }}
									style={{
										width: "350px",
									}}
									className="ellipsis-line-2"
								/>
							)}
						/>
						<Table.Column
							title="Priority"
							key="priority"
							dataIndex="priority"
							sorter={true}
						/>
						<Table.Column
							title="User Type"
							key="type"
							dataIndex="type"
							sorter={true}
						/>
						<Table.Column
							title="Created"
							key="created_str"
							dataIndex="created_str"
							defaultSortOrder="descend"
							sorter={true}
						/>
						<Table.Column
							title="Action"
							key="action"
							dataIndex="action"
							align="center"
							render={(text, record) => {
								return (
									<>
										<Button
											type="link"
											className="color-1"
											onClick={() =>
												setToggleModalForm({ show: true, data: record })
											}
										>
											<FontAwesomeIcon icon={faPencil} />
										</Button>
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
												loading={isLoadingDeleteNotif}
											>
												<FontAwesomeIcon icon={faTrashAlt} />
											</Button>
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
							setPaginationTotal={dataSource.total}
							showLessItems={true}
							showSizeChanger={false}
						/>
					</div>
				</Col>
			</Row>

			<ModalForm
				toggleModalForm={toggleModalForm}
				setToggleModalForm={setToggleModalForm}
				onFinish={onFinish}
				isLoading={isLoadingCreateNotification}
			/>
		</Card>
	);
}
