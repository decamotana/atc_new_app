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

export default function PageAdvertisementType() {
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
		`api/v1/advertisementtype?${new URLSearchParams(tableFilter)}`,
		"advertisement_type_data_list"
	);

	const {
		mutate: mutateCreateUpdateAdvertisementType,
		isLoading: isLoadingCreateUpdateAdvertisementType,
	} = POST("api/v1/advertisementtype", "advertisement_type_data_list");

	const {
		mutate: mutateDeleteAdvertisementType,
		isLoading: isLoadingDeleteAdvertisementType,
	} = DELETE("api/v1/advertisementtype", "advertisement_type_data_list");

	const onFinishModal = (values) => {
		let data = { ...values, id: toggleModal.data?.id };

		mutateCreateUpdateAdvertisementType(data, {
			onSuccess: (res) => {
				if (res.success) {
					notification.success({
						message: "Advertisement Type",
						description: res.message,
					});

					setToggleModal({
						show: false,
						data: null,
					});
				} else {
					notification.error({
						message: "Advertisement Type",
						description: res.message,
					});
				}
			},
			onError: (err) => {
				notification.error({
					message: "Advertisement Type",
					description: err.response.data.message,
				});
			},
		});
	};

	const handleDelete = (values) => {
		mutateDeleteAdvertisementType(values, {
			onSuccess: (res) => {
				if (res.success) {
					notification.success({
						message: "Advertisement Type",
						description: res.message,
					});
				} else {
					notification.error({
						message: "Advertisement Type",
						description: res.message,
					});
				}
			},
			onError: (err) => {
				notification.error({
					message: "Advertisement Type",
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
		<Card id="PageAdvertisementType">
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
						Add Advertisement Type
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
								title="Advertisement Type"
								key="advert_type"
								dataIndex="advert_type"
								defaultSortOrder={"ascend"}
								// render={(text, record) => moment(text).format("MMMM DD, YYYY")}
								sorter={true}
								align="center"
							/>
							<Table.Column
								title="Action"
								key="action"
								align="center"
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
											>
												<FontAwesomeIcon icon={faPencil} />
											</Button>

											<Popconfirm
												title="Are you sure to delete this data?"
												onConfirm={() => handleDelete(record)}
												onCancel={() => {
													notification.error({
														message: "Advertisement Type",
														description: "Data not deleted",
													});
												}}
												okText="Yes"
												cancelText="No"
											>
												<Button
													type="link"
													className="color-6"
													loading={isLoadingDeleteAdvertisementType}
												>
													<FontAwesomeIcon icon={faTrashAlt} />
												</Button>
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

			<ModalForm
				toggleModal={toggleModal}
				setToggleModal={setToggleModal}
				onFinish={onFinishModal}
				isLoading={isLoadingCreateUpdateAdvertisementType}
			/>
		</Card>
	);
}
