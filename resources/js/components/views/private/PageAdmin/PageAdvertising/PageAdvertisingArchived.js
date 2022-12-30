import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import {
	Button,
	Card,
	Col,
	Row,
	Table,
	Image,
	notification,
	Popconfirm,
	Typography,
	Space,
} from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	TableGlobalInputSearch,
	TablePageSize,
	TablePagination,
	TableShowingEntries,
} from "../../Components/ComponentTableFilter";
import { faPencil, faTrashAlt } from "@fortawesome/pro-solid-svg-icons";
import { DELETE, GET } from "../../../../providers/useAxiosQuery";
import { apiUrl } from "../../../../providers/companyInfo";
import encryptText from "../../../../providers/encryptText";
import NumberFormat from "react-number-format";
import ModalGraph from "./Components/ModalGraph";
import { faChartColumn } from "@fortawesome/pro-regular-svg-icons";

export default function PageAdvertisingArchived() {
	const history = useHistory();

	const [tableFilter, setTableFilter] = useState({
		page: 1,
		page_size: 50,
		search: "",
		sort_field: "title",
		sort_order: "desc",
		status: "archived",
	});

	const [toogleModalGraph, setToogleModalGraph] = useState({
		show: false,
		id: "",
		title: "",
	});

	const { data: dataSource, refetch: refetchAdvertisements } = GET(
		`api/v1/advertisement?${new URLSearchParams(tableFilter)}`,
		"advertisement_data_list"
	);

	const { mutate: mutateDeleteAdvert, isLoading: isLoadingDeleteAdvert } =
		DELETE("api/v1/advertisement", "advertisement_data_list");

	const handleTableChange = (pagination, filters, sorter) => {
		setTableFilter({
			...tableFilter,
			sort_field: sorter.columnKey,
			sort_order: sorter.order ? sorter.order.replace("end", "") : null,
			page: 1,
			page_size: "50",
		});
	};

	const handleDelete = (values) => {
		mutateDeleteAdvert(values, {
			onSuccess: (res) => {
				if (res.success) {
					notification.success({
						message: "Advertising",
						description: res.message,
					});
				} else {
					notification.error({
						message: "Advertising",
						description: res.message,
					});
				}
			},
			onError: (err) => {
				notification.error({
					message: "Advertising",
					description: err.response.data.message,
				});
			},
		});
	};

	useEffect(() => {
		if (dataSource) {
			refetchAdvertisements();
		}

		return () => {};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [tableFilter]);

	return (
		<Card id="PageAdvertising">
			<Row gutter={[12, 12]}>
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
							title="Image"
							key="file_path"
							dataIndex="file_path"
							render={(text, _) => (
								<Image
									src={apiUrl + "storage/" + text}
									style={{ width: "100%" }}
								/>
							)}
							width="8%"
						/>
						<Table.Column
							title="Title"
							key="title"
							dataIndex="title"
							sorter={true}
							defaultSortOrder="descend"
							render={(text, record) => {
								return (
									<Button type="link" className="color-1 cursor-auto">
										{text}
									</Button>
								);
							}}
						/>

						<Table.Column
							title="Amount"
							key="amount"
							dataIndex="amount"
							sorter={true}
							render={(text, record) =>
								text !== "undefined" && text !== undefined ? (
									<NumberFormat
										value={parseFloat(text).toFixed(2)}
										displayType={"text"}
										thousandSeparator={true}
										prefix={"$"}
									/>
								) : (
									""
								)
							}
						/>
						<Table.Column
							title="Start Date"
							key="p_start_date"
							dataIndex="p_start_date"
							sorter={true}
							render={(text, record) => (text != null ? text : "")}
						/>
						<Table.Column
							title="End Date"
							key="p_end_date"
							dataIndex="p_end_date"
							sorter={true}
							render={(text, record) => (text != null ? text : "")}
						/>
						<Table.Column
							title="Business Information"
							key="business_name"
							dataIndex="business_name"
							width={400}
							sorter={true}
							render={(_, record) => {
								return (
									<span>
										Name: {record.business_name} <br />
										URL Link{" "}
										<Typography.Link
											href={record.url_link}
											target="new"
											className="color-1"
										>
											{record.url_type}
											{record.url_link}
										</Typography.Link>
										<br />
										<Space>
											<div>Public URL:</div>
											<Typography.Paragraph
												className="color-1 m-b-none"
												copyable
												style={{ width: "250px" }}
												ellipsis={{
													rows: 1,
													expandable: false,
												}}
												onClick={() =>
													window.open(
														`/advert-stats/${encryptText(
															"CancerCaregiver",
															`CancerCaregiver${record.id}---CCG---${record.title}`
														)}`,
														"_blank"
													)
												}
											>
												{window.location.origin +
													`/advert-stats/${encryptText(
														"CancerCaregiver",
														`CancerCaregiver${record.id}---CCG---${record.title}`
													)}`}
											</Typography.Paragraph>
										</Space>
									</span>
								);
								// return <div dangerouslySetInnerHTML={{ __html: str }} />;
							}}
						/>
						<Table.Column
							title="Ad Type"
							key="position"
							dataIndex="position"
							sorter={true}
						/>
						<Table.Column
							title="Advert For"
							key="advert_for"
							dataIndex="advert_for"
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
												setToogleModalGraph({
													show: true,
													id: record.id,
													title: record.title,
												})
											}
											icon={<FontAwesomeIcon icon={faChartColumn} />}
										/>
										<Button
											type="link"
											className="color-1"
											onClick={() =>
												history.push({
													state: record.id,
													pathname: "/advertising/archived/edit",
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
												loading={isLoadingDeleteAdvert}
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
			<ModalGraph
				toogleModalGraph={toogleModalGraph}
				setToogleModalGraph={setToogleModalGraph}
			/>
		</Card>
	);
}
