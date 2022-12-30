import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Card, Col, Row, Table, Button, Typography } from "antd";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileCertificate, faPlus } from "@fortawesome/pro-solid-svg-icons";

import { GET } from "../../../../providers/useAxiosQuery";
import moment from "moment";
import { userData } from "../../../../providers/companyInfo";

export default function PageSubscriberCurrentCompleted() {
	const [dataSourceCurrent, setDataSourceCurrent] = useState([]);
	const [dataSourceCompleted, setDataSourceCompleted] = useState([]);
	const [referredUserCurrentFilter, setReferredUserCurrentFilter] = useState({
		page: 1,
		page_size: 50,
		search: "",
		sort_field: "",
		sort_order: "asc",
		referred_by: userData().id,
		moduleStatusFilter: "Not Completed",
	});
	const [referredUserCompletedFilter, setReferredUserCompletedFilter] =
		useState({
			page: 1,
			page_size: 50,
			search: "",
			sort_field: "",
			sort_order: "asc",
			referred_by: userData().id,
			moduleStatusFilter: "Completed",
		});

	const history = useHistory();

	const { refetch: refetchCurrent } = GET(
		`api/v1/users?${new URLSearchParams(referredUserCurrentFilter)}`,
		"current_referred_user_dashboard_list",
		(res) => {
			// console.log("current_referred_user_dashboard_list", res.data);
			if (res.data) {
				setDataSourceCurrent(res.data.data);
			}
		}
	);
	const { refetch: refetchCompleted } = GET(
		`api/v1/users?${new URLSearchParams(referredUserCompletedFilter)}`,
		"completed_referred_user_dashboard_list",
		(res) => {
			// console.log("completed_referred_user_dashboard_list", res.data);
			if (res.data) {
				setDataSourceCompleted(res.data.data);
			}
		}
	);

	const onChangeTableCurrent = (pagination, filters, sorter) => {
		setReferredUserCurrentFilter({
			...referredUserCurrentFilter,
			sort_field: sorter.columnKey,
			sort_order: sorter.order ? sorter.order.replace("end", "") : null,
			page: 1,
		});
	};

	const onChangeTableCompleted = (pagination, filters, sorter) => {
		setReferredUserCompletedFilter({
			...referredUserCompletedFilter,
			sort_field: sorter.columnKey,
			sort_order: sorter.order ? sorter.order.replace("end", "") : null,
			page: 1,
		});
	};

	useEffect(() => {
		refetchCurrent();
		refetchCompleted();
		return () => {};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [referredUserCurrentFilter, referredUserCompletedFilter]);

	return (
		<Card
			className="page-careprofessional-subscriber-current-completed"
			id="PageSubscriberCurrentCompleted"
		>
			<Row gutter={[12, 12]}>
				<Col xs={24} sm={24} md={24}>
					<Button
						className="btn-main-invert"
						icon={<FontAwesomeIcon icon={faPlus} className="m-r-xs" />}
						onClick={() =>
							history.push("/subscribers/current-completed/new-subscriber")
						}
						size="large"
					>
						New Subscriber
					</Button>
				</Col>
				<Col xs={24} sm={24} md={24}>
					<Typography.Title level={4} className="color-1 font-normal">
						Current Subscribers
					</Typography.Title>
					<Table
						className="ant-table-default ant-table-striped"
						dataSource={dataSourceCurrent && dataSourceCurrent}
						rowKey={(record) => record.id}
						pagination={false}
						bordered={false}
						onChange={onChangeTableCurrent}
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
							title="First Name"
							key="firstname"
							dataIndex="firstname"
							sorter={true}
						/>
						<Table.Column
							title="Last Name"
							key="lastname"
							dataIndex="lastname"
							sorter={true}
							render={(text, record) => {
								return (
									<Button
										type="link"
										className="color-6"
										onClick={() =>
											history.push({
												pathname: "/subscribers/current-completed/module",
												state: record.id,
											})
										}
									>
										{text}
									</Button>
								);
							}}
						/>
						<Table.Column
							title="Status"
							key="moduleStatus"
							align="center"
							sorter={true}
							dataIndex="moduleStatus"
							render={(_, record) => {
								let color = "color-7";

								if (record.moduleStatus === "In Progress") {
									color = "color-1";
								}

								return (
									<Typography.Text className={`font-600 ${color}`}>
										{record.moduleStatus}
									</Typography.Text>
								);
							}}
						/>
					</Table>
				</Col>

				<Col xs={24} sm={24} md={24} className="m-t-lg">
					<Typography.Title level={4} className="color-1 font-normal">
						Completed Subscribers
					</Typography.Title>
					<Table
						className="ant-table-default ant-table-striped"
						dataSource={dataSourceCompleted && dataSourceCompleted}
						rowKey={(record) => record.id}
						pagination={false}
						bordered={false}
						onChange={onChangeTableCompleted}
						// rowSelection={{
						//   type: selectionType,
						//   ...rowSelection,
						// }}
						scroll={{ x: "max-content" }}
					>
						<Table.Column
							title="Start Date"
							key="created_at"
							dataIndex="created_at"
							render={(text, _) => moment(text).format("MM/DD/YYYY")}
							defaultSortOrder="descend"
							sorter={true}
						/>
						<Table.Column
							title="First Name"
							key="firstname"
							dataIndex="firstname"
							sorter={true}
							// render={(text, record) => {
							// 	return (
							// 		<Button type="link" className="color-1">
							// 			{text}
							// 		</Button>
							// 	);
							// }}
						/>
						<Table.Column
							title="Last Name"
							key="lastname"
							dataIndex="lastname"
							sorter={true}
							render={(text, record) => {
								return (
									<Button type="link" className="color-6">
										{text}
									</Button>
								);
							}}
						/>
						<Table.Column
							title="Cert. of Completion"
							key="cert_of_completion"
							align="center"
							render={(_, record) => {
								// console.log("record", record);
								return record.user_modules.length > 0 ? (
									<Typography.Text>
										{moment(record.user_modules.reverse()[0].created_at).format(
											"MM/DD/YYYY"
										)}{" "}
										<FontAwesomeIcon
											className="color-6 m-l-sm"
											icon={faFileCertificate}
										/>
									</Typography.Text>
								) : (
									""
								);
							}}
						/>
					</Table>
				</Col>
			</Row>
		</Card>
	);
}
