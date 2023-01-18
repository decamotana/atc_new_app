import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Card, Col, Row, Table, Button } from "antd";
import { faArrowAltFromLeft, faPlus } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { GET } from "../../../providers/useAxiosQuery";
import { role } from "../../../providers/companyInfo";
import {
	TablePageSize,
	TableGlobalInputSearch,
	TableShowingEntries,
	TablePagination,
} from "../Components/ComponentTableFilter";
import moment from "moment";

export default function PageTicketing() {
	const history = useHistory();

	const [tableFilter, setTableFilter] = useState({
		page: 1,
		page_size: 50,
		search: "",
		sort_field: "subject",
		sort_order: "desc",
	});

	const { data: dataSource, refetch: refetchTable } = GET(
		`api/v1/ticket?${new URLSearchParams(tableFilter)}`,
		"ticket"
	);

	const handleTableChange = (pagination, filters, sorter) => {
		setTableFilter({
			...tableFilter,
			sort_field: sorter.columnKey,
			sort_order: sorter.order ? sorter.order.replace("end", "") : null,
			page_number: 1,
		});
	};

	const handleAddTicket = () => {
		if (role() === "Admin" || role() === "Super Admin") {
			history.push("/ticketing/create");
		} else {
			history.push("/support/ticketing/create");
		}
	};

	useEffect(() => {
		if (dataSource) {
			refetchTable();
		}
		return () => {};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [tableFilter]);

	return (
		<Card id="PageTicketing">
			<Row gutter={[12, 12]}>
				<Col xs={24} sm={24} md={24}>
					<Button
						size="large"
						className="btn-main-invert-outline b-r-none"
						onClick={handleAddTicket}
					>
						<FontAwesomeIcon icon={faPlus} className="m-r-sm" /> Add Ticket
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
							title="Subject & Description"
							key="subject"
							dataIndex="subject"
							defaultSortOrder="descend"
							sorter={true}
						/>
						<Table.Column
							title="View/Reply"
							key="reply"
							dataIndex="reply"
							render={(_, record) => {
								return (
									<Button
										type="link"
										onClick={() => {
											if (role() === "Admin" || role() === "Super Admin") {
												history.push({
													pathname: `/ticketing/reply`,
													state: { id: record.id },
												});
											} else {
												history.push({
													pathname: `/support/ticketing/reply`,
													state: { id: record.id },
												});
											}
										}}
										icon={<FontAwesomeIcon icon={faArrowAltFromLeft} />}
										className="color-6"
									/>
								);
							}}
						/>
						<Table.Column
							title="Created"
							key="created_at_str"
							dataIndex="created_at_str"
							sorter={true}
						/>
						<Table.Column
							title="Last Replied"
							key="last_replied"
							dataIndex="last_replied"
							sorter={true}
							render={(text, record) =>
								text ? moment(text).format("MMMM DD, YYYY hh:mm A") : ""
							}
						/>
						<Table.Column
							title="Requester"
							key="requester_user"
							dataIndex="requester_user"
							sorter={true}
						/>
						{role() === "Admin" || role() === "Super Admin" ? (
							<Table.Column
								title="Assigned"
								key="assigned_user"
								dataIndex="assigned_user"
								sorter={true}
							/>
						) : null}

						<Table.Column
							title="Status"
							key="status"
							dataIndex="status"
							sorter={true}
						/>
						<Table.Column
							title="Priority"
							key="priority"
							dataIndex="priority"
							sorter={true}
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
				<Col xs={24} sm={24} md={24}></Col>
			</Row>
		</Card>
	);
}
