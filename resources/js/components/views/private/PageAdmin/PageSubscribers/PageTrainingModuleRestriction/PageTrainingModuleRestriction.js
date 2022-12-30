import React, { useEffect, useState } from "react";
import { Card, Col, Row, Table, Button, notification, Switch } from "antd";

import {
	TableGlobalInputSearch,
	TablePageSize,
	TablePagination,
	TableShowingEntries,
} from "../../../Components/ComponentTableFilter";
import { GET, POST } from "../../../../../providers/useAxiosQuery";

export default function PageTrainingModuleRestriction() {
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

	const {
		mutate: mutateModuleVideoRestriction,
		isLoading: isLoadingModuleVideoRestriction,
	} = POST("api/v1/user_module_video_restriction", "users_active_list");

	const handleModuleVideoRestriction = (record) => {
		let data = {
			user_id: record.id,
		};
		mutateModuleVideoRestriction(data, {
			onSuccess: (res) => {
				if (res.success) {
					notification.success({
						message: "Training Module Restriction",
						description: res.message,
					});
				} else {
					notification.error({
						message: "Training Module Restriction",
						description: res.message,
					});
				}
			},
			onError: (err) => {
				notification.error({
					message: "Training Module Restriction",
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
		<Card
			className="page-admin-subscriber-module-restriction"
			id="PageSubscriberModuleRestriction"
		>
			<Row gutter={[12, 12]}>
				<Col xs={24} sm={24} md={24}></Col>
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
							title="Video Restriction"
							key="video_restriction"
							dataIndex="video_restriction"
							sorter={true}
							align="center"
							render={(text, record) => {
								return (
									<Switch
										checked={record.video_restriction === 0 ? false : true}
										loading={isLoadingModuleVideoRestriction}
										onChange={() => handleModuleVideoRestriction(record)}
									/>
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
