import { faBan, faEdit, faPlus } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	Button,
	Card,
	Col,
	notification,
	Popconfirm,
	Row,
	Space,
	Table,
} from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { GET, POST } from "../../../../providers/useAxiosQuery";
import {
	TableGlobalInputSearch,
	TablePageSize,
	TablePagination,
	TableShowingEntries,
} from "../../Components/ComponentTableFilter";

export default function PageAdmin() {
	const history = useHistory();
	const [tableFilter, setTableFilter] = useState({
		page: 1,
		page_size: 50,
		search: "",
		sort_field: "id",
		sort_order: "desc",
		role: JSON.stringify(["Admin"]),
	});

	const { data: dataSource, refetch: refetchSource } = GET(
		`api/v1/users?${new URLSearchParams(tableFilter)}`,
		"users_active_list"
	);

	const { mutate: mutateUserDeactivated, isLoading: isLoadingUserDeactivated } =
		POST("api/v1/user_deactive", "users_active_list");

	const handleTableChange = (pagination, filters, sorter) => {
		setTableFilter({
			...tableFilter,
			sort_field: sorter.columnKey,
			sort_order: sorter.order ? sorter.order.replace("end", "") : null,
			page: 1,
			page_size: "50",
			loading: true,
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

	useEffect(() => {
		if (dataSource) {
			refetchSource();
		}

		return () => {};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [tableFilter]);

	return (
		<Card id="PageAdmin">
			<Row gutter={[12, 12]}>
				<Col xs={24} sm={24} md={24}>
					<Button
						className="btn-main-invert b-r-none"
						onClick={() => history.push("/admin/add")}
						size="large"
						icon={<FontAwesomeIcon icon={faPlus} className="m-r-sm" />}
					>
						ADD ADMIN
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
						dataSource={dataSource && dataSource.data.data}
						rowKey={(record) => record.id}
						pagination={false}
						bordered={false}
						onChange={handleTableChange}
						scroll={{ x: "max-content" }}
					>
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
							title="Action"
							key="edit_view_action"
							dataIndex="edit_view_action"
							align="center"
							render={(text, record) => {
								return (
									<Space>
										<Button
											type="link"
											className="color-1"
											onClick={() =>
												history.push({
													pathname: "/admin/edit",
													state: record.id,
												})
											}
											icon={<FontAwesomeIcon icon={faEdit} />}
										/>
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
												icon={<FontAwesomeIcon icon={faBan} />}
											/>
										</Popconfirm>
									</Space>
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
