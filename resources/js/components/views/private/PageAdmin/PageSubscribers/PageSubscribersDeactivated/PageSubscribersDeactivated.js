import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import {
	Button,
	Card,
	Checkbox,
	Col,
	notification,
	Popconfirm,
	Row,
	Table,
} from "antd";
import {
	TableGlobalInputSearch,
	TablePageSize,
	TablePagination,
	TableShowingEntries,
} from "../../../Components/ComponentTableFilter";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faEdit } from "@fortawesome/pro-solid-svg-icons";
import { GET, POST } from "../../../../../providers/useAxiosQuery";
import moment from "moment";

export default function PageSubscribersDeactivated() {
	const history = useHistory();
	const [tableFilter, setTableFilter] = useState({
		page: 1,
		page_size: 50,
		search: "",
		sort_field: "id",
		sort_order: "desc",
		status: "Deactive",
		role: JSON.stringify(["Cancer Caregiver", "Cancer Care Professional"]),
	});

	const { data: dataSource, refetch: refetchSource } = GET(
		`api/v1/users?${new URLSearchParams(tableFilter)}`,
		"users_deactivated_list"
	);

	const { mutate: mutateActivated, isLoading: isLoadingActivated } = POST(
		"api/v1/users_activated",
		"users_deactivated_list"
	);
	const { mutate: mutateUserReactivated, isLoading: isLoadingUserReactivated } =
		POST("api/v1/user_reactive", "users_deactivated_list");

	const [selectedChecked, setSelectedChecked] = useState([]);

	const handleCheckboxSelected = (e, key) => {
		if (e.target.checked) {
			let selectedCheckedTemp = [...selectedChecked, key];
			setSelectedChecked(selectedCheckedTemp);
		} else {
			let selectedCheckedTemp = [...selectedChecked];
			let newselectedCheckedTemp = selectedCheckedTemp.filter(
				(item) => item !== key
			);
			setSelectedChecked(newselectedCheckedTemp);
		}
	};

	const handleRemoveData = () => {
		let data = {
			selected: selectedChecked,
		};
		mutateActivated(data, {
			onSuccess: (res) => {
				if (res.success) {
					notification.success({
						message: "User Reactivated",
						description: res.message,
					});
				}
			},
		});
	};

	const handleUserReactivate = (id) => {
		let data = {
			id,
		};
		mutateUserReactivated(data, {
			onSuccess: (res) => {
				if (res.success) {
					notification.success({
						message: "User Reactivated",
						description: res.message,
					});
				}
			},
		});
	};

	const handleCheckboxAll = (e) => {
		// console.log("handleCheckboxAll", e.target.checked);
		if (e.target.checked) {
			if (dataSource && dataSource.data.data) {
				let dataSourceTemp = dataSource.data.data.reduce((a, b) => {
					a.push(b.id);
					return a;
				}, []);
				setSelectedChecked(dataSourceTemp);
			}
		} else {
			setSelectedChecked([]);
		}
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
		<Card id="PageSubscribersDeactivated">
			<Row gutter={12}>
				<Col xs={24} sm={24} md={24}>
					<div className="ant-space-flex-space-between table-size-table-search">
						<div>
							<TablePageSize
								tableFilter={tableFilter}
								setTableFilter={setTableFilter}
							/>
							{selectedChecked.length > 0 && (
								<Popconfirm
									title="Are you sure to reactivate selected data?"
									onConfirm={() => handleRemoveData()}
									onCancel={() => {
										notification.error({
											message: "User Reactivate",
											description: "Data selected not reactivate",
										});
									}}
									okText="Yes"
									cancelText="No"
								>
									<Button
										type="primary"
										loading={isLoadingActivated}
										className="btn-main-invert m-l-md"
										icon={
											<FontAwesomeIcon
												icon={faCheckCircle}
												className="m-r-xs"
											/>
										}
									>
										REACTIVATE
									</Button>
								</Popconfirm>
							)}
						</div>
						<div>
							<TableGlobalInputSearch
								tableFilter={tableFilter}
								setTableFilter={setTableFilter}
							/>
						</div>
					</div>
				</Col>
				<Col xs={24} sm={24} md={24} className="m-t-sm m-b-sm">
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
							title={
								<Checkbox
									className="ant-checkbox-red all-checkbox"
									onChange={handleCheckboxAll}
									checked={
										dataSource?.data.total > 0 &&
										selectedChecked.length === dataSource?.data.total
											? true
											: false
									}
								/>
							}
							key="date"
							dataIndex="date"
							render={(_, record) => {
								return (
									<Checkbox
										className="ant-checkbox-red"
										onChange={(e) => handleCheckboxSelected(e, record.id)}
										checked={
											selectedChecked.filter(
												(itemFilter) => itemFilter === record.id
											).length > 0
												? true
												: false
										}
									/>
								);
							}}
						/>
						<Table.Column
							title="Start Date"
							key="created_at"
							dataIndex="created_at"
							render={(text, _) =>
								text ? moment(text).format("MM/DD/YYYY") : ""
							}
							defaultSortOrder="descend"
							sorter={true}
						/>
						<Table.Column
							title="Last Name"
							key="lastname"
							dataIndex="lastname"
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
							title="First Name"
							key="firstname"
							dataIndex="firstname"
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
							title="Type"
							key="role"
							dataIndex="role"
							sorter={true}
						/>
						<Table.Column
							title="Edit/View"
							key="edit_view_action"
							dataIndex="edit_view_action"
							align="center"
							render={(text, record) => {
								return (
									<Button
										type="link"
										className="color-1"
										onClick={() =>
											history.push({
												pathname: "/subscribers/current/edit",
												state: record.id,
											})
										}
									>
										<FontAwesomeIcon icon={faEdit} />
									</Button>
								);
							}}
						/>
						<Table.Column
							title="Reactivate"
							key="reactivate_action"
							dataIndex="reactivate_action"
							align="center"
							render={(text, record) => {
								return (
									<Popconfirm
										title="Are you sure to reactivate this data?"
										onConfirm={() => handleUserReactivate(record.id)}
										onCancel={() => {
											notification.error({
												message: "User Reactivate",
												description: "Data not reactivate",
											});
										}}
										okText="Yes"
										cancelText="No"
									>
										<Button
											type="link"
											className="color-6"
											loading={isLoadingUserReactivated}
										>
											<FontAwesomeIcon icon={faCheckCircle} />
										</Button>
									</Popconfirm>
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
