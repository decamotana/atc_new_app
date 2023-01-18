import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import {
	Button,
	Card,
	Col,
	notification,
	// Popconfirm,
	Row,
	Table,
} from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faEye,
	faPencil,
	// faPencil,
	faPlus,
	// faTrashAlt,
} from "@fortawesome/pro-regular-svg-icons";
import {
	//  DELETE,
	GET,
	POST,
} from "../../../../providers/useAxiosQuery";
import {
	TableGlobalInputSearch,
	TablePageSize,
	TablePagination,
	TableShowingEntries,
} from "../../Components/ComponentTableFilter";
import ModalFormEdit from "./ModalFormEdit";
import { role } from "../../../../providers/companyInfo";
import ModalView from "./ModalView";

export default function PageReferenceCode() {
	const history = useHistory();
	const [toggleModalReferenceCode, setToggleModalReferenceCode] = useState({
		open: false,
		data: null,
	});
	const [toggleModalReferenceCodeView, setToggleModalReferenceCodeView] =
		useState({
			open: false,
			data: null,
		});

	const [tableFilter, setTableFilter] = useState({
		page: 1,
		page_size: 50,
		search: "",
		sort_field: "",
		sort_order: "asc",
		from_page: role(),
	});

	const { data: dataSource, refetch: refetchTable } = GET(
		`api/v1/reference_code?${new URLSearchParams(tableFilter)}`,
		"reference_code_data_list"
	);

	const {
		mutate: mutateCreateReferenceCode,
		isLoading: isLoadingCreateReferenceCode,
	} = POST("api/v1/reference_code", "reference_code_data_list");

	const onFinishModalReferenceCode = (values) => {
		let data = { ...values, id: toggleModalReferenceCode.data.id };

		mutateCreateReferenceCode(data, {
			onSuccess: (res) => {
				if (res.success) {
					notification.success({
						message: "Reference Code",
						description: res.message,
					});

					setToggleModalReferenceCode({ open: false, data: null });
				} else {
					notification.error({
						message: "Reference Code",
						description: res.message,
					});
				}
			},
			onError: (err) => {
				notification.error({
					message: "Reference Code",
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
		<Card id="PageCareProfessionalReferenceCode">
			<Row gutter={[12, 12]}>
				<Col xs={24} sm={24} md={24} lg={12}>
					<Row gutter={[12, 12]}>
						<Col xs={24} sm={24} md={24}>
							<Button
								className="btn-main-invert-outline b-r-none"
								icon={<FontAwesomeIcon icon={faPlus} className="m-r-xs" />}
								onClick={() => history.push("/subscribers/reference-code/add")}
								size="large"
							>
								Buy a Reference Code
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
										title="Title"
										key="title"
										dataIndex="title"
										defaultSortOrder={"ascend"}
										sorter={true}
									/>
									<Table.Column
										title="Account Plan"
										key="plan"
										dataIndex="plan"
										defaultSortOrder={"ascend"}
										sorter={true}
									/>
									<Table.Column
										title="Quantity"
										key="quantity"
										dataIndex="quantity"
										defaultSortOrder={"ascend"}
										sorter={true}
									/>
									<Table.Column
										title="Start of Code Name"
										key="code_name"
										dataIndex="code_name"
										defaultSortOrder={"ascend"}
										sorter={true}
									/>
									<Table.Column
										title="Action"
										key="action"
										render={(_, record) => {
											return (
												<>
													<Button
														type="link"
														className="color-1"
														onClick={() => {
															setToggleModalReferenceCode({
																open: true,
																data: record,
															});
														}}
														icon={<FontAwesomeIcon icon={faPencil} />}
													/>

													<Button
														type="link"
														className="color-4"
														onClick={() => {
															setToggleModalReferenceCodeView({
																open: true,
																data: record,
															});
														}}
														icon={<FontAwesomeIcon icon={faEye} />}
													/>
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
				</Col>
			</Row>

			<ModalFormEdit
				toggleModal={toggleModalReferenceCode}
				setToggleModal={setToggleModalReferenceCode}
				onFinish={onFinishModalReferenceCode}
				isLoading={isLoadingCreateReferenceCode}
			/>
			<ModalView
				toggleModal={toggleModalReferenceCodeView}
				setToggleModal={setToggleModalReferenceCodeView}
			/>
		</Card>
	);
}
