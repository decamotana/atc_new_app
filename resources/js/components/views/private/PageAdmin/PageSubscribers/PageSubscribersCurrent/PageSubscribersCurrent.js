import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import {
	Card,
	Col,
	Row,
	Table,
	Checkbox,
	Button,
	notification,
	Popconfirm,
} from "antd";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faBan } from "@fortawesome/pro-solid-svg-icons";

import {
	TableGlobalInputSearch,
	TablePageSize,
	TablePagination,
	TableShowingEntries,
} from "../../../Components/ComponentTableFilter";
import { GET, POST } from "../../../../../providers/useAxiosQuery";
import moment from "moment";

export default function PageSubscribersCurrent() {
	const history = useHistory();
	const [tableFilter, setTableFilter] = useState({
		page: 1,
		page_size: 50,
		search: "",
		sort_field: "id",
		sort_order: "desc",
		status: "Active",
		role: JSON.stringify(["Cancer Caregiver", "Cancer Care Professional"]),
	});

	const { data: dataSource, refetch: refetchSource } = GET(
		`api/v1/users?${new URLSearchParams(tableFilter)}`,
		"users_active_list"
	);

	const { mutate: mutateDeactivated, isLoading: isLoadingDeactivated } = POST(
		"api/v1/users_deactivated",
		"users_active_list"
	);
	const { mutate: mutateUserDeactivated, isLoading: isLoadingUserDeactivated } =
		POST("api/v1/user_deactive", "users_active_list");

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

	const handleRemoveData = () => {
		let data = {
			selected: selectedChecked,
		};
		mutateDeactivated(data, {
			onSuccess: (res) => {
				if (res.success) {
					notification.success({
						message: "User Deactivated",
						description: res.message,
					});
				}
			},
		});
	};

	const handleUserDeactivate = (id) => {
		let data = {
			id,
		};
		mutateUserDeactivated(data, {
			onSuccess: (res) => {
				if (res.success) {
					notification.success({
						message: "User Deactivated",
						description: res.message,
					});
				}
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
		<Card className="page-admin-subscriber-current" id="PageSubscribersCurrent">
			<Row gutter={[12, 12]}>
				<Col xs={24} sm={24} md={24}></Col>
				<Col xs={24} sm={24} md={24}>
					<div className="ant-space-flex-space-between table-size-table-search">
						<div>
							<TablePageSize
								tableFilter={tableFilter}
								setTableFilter={setTableFilter}
							/>
							{selectedChecked.length > 0 && (
								<Popconfirm
									title="Are you sure to deactivate selected data?"
									onConfirm={() => handleRemoveData()}
									onCancel={() => {
										notification.error({
											message: "User Deactivate",
											description: "Data selected not deactivate",
										});
									}}
									okText="Yes"
									cancelText="No"
								>
									<Button
										type="primary"
										loading={isLoadingDeactivated}
										className="btn-main-invert m-l-md"
										icon={<FontAwesomeIcon icon={faBan} className="m-r-xs" />}
									>
										DEACTIVATE
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
										className="ant-checkbox-red single-checkbox"
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
							title="Deactivate"
							key="deactivate_action"
							dataIndex="deactivate_action"
							align="center"
							render={(text, record) => {
								return (
									<Popconfirm
										title="Are you sure to deactivate this data?"
										onConfirm={() => handleUserDeactivate(record.id)}
										onCancel={() => {
											notification.error({
												message: "User Deactivate",
												description: "Data not deactivate",
											});
										}}
										okText="Yes"
										cancelText="No"
									>
										<Button
											type="link"
											className="color-6"
											loading={isLoadingUserDeactivated}
										>
											<FontAwesomeIcon icon={faBan} />
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
