import React, { useState, useEffect } from "react";
import {
	Row,
	Col,
	Table,
	Space,
	Button,
	Modal,
	Form,
	notification,
	Popconfirm,
	// Divider,
} from "antd";
import { DELETE, GET, POST } from "../../../../../providers/useAxiosQuery";
// import { useHistory } from "react-router-dom";
import FloatInput from "../../../../../providers/FloatInput";
import FloatTextArea from "../../../../../providers/FloatTextArea";
import FloatInputRate from "../../../../../providers/FloatInputRate";
import FloatSelect from "../../../../../providers/FloatSelect";
// import dragula from "dragula";
// import "dragula/dist/dragula.css";

// import { useDrag } from "react-dnd";
// import { HTML5Backend } from "react-dnd-html5-backend";
// import update from "immutability-helper";

import {
	SortableContainer,
	SortableElement,
	SortableHandle,
} from "react-sortable-hoc";
import { MenuOutlined } from "@ant-design/icons";
import { arrayMoveImmutable } from "array-move";
import {
	TableGlobalInputSearch,
	TablePageSize,
	TablePagination,
	TableShowingEntries,
} from "../../../Components/ComponentTableFilter";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil, faTimes } from "@fortawesome/pro-solid-svg-icons";
import { faPlus, faTrashAlt } from "@fortawesome/pro-regular-svg-icons";
// import { log } from "@antv/g2plot/lib/utils";

const DragHandle = SortableHandle(() => (
	<MenuOutlined style={{ cursor: "grab", color: "#999" }} />
));

const SortableItem = SortableElement((props) => <tr {...props} />);
const SortableBody = SortableContainer((props) => <tbody {...props} />);

export default function TableAccountTypesPlan({ id }) {
	// const sub_title = "View";
	// const history = useHistory();
	const [form] = Form.useForm();
	const [dataTableInfo, setDataTableInfo] = useState({
		search: "",
		state: "",
		page: 1,
		page_size: "50",
		sort_field: "index",
		sort_order: "asc",
		account_type_id: id,
	});
	// const [data, setData] = useState([]);
	const [data, setData] = useState([]);
	const {
		data: dataAccountPlan,
		isLoading: isLoadingAccountPlan,
		refetch: refetchDataAccountPlan,
	} = GET(
		`api/v1/account_plan?${new URLSearchParams(dataTableInfo)}`,
		"account_plan_lists",
		(res) => {
			if (res.success) {
				// setData(dataGetProfiles ? dataGetProfiles.data.data : []);
				// console.log("account_plan", res);
				let arr = [];
				res.data.data.map((item, index) => {
					arr.push({
						...item,
						key: item.id,
						index: item.index ? item.index : index,
					});
					return "";
				});
				setData(arr);
				return "";
			}
		}
	);

	useEffect(() => {
		const timeoutId = setTimeout(() => {
			setDataTableInfo({
				...dataTableInfo,
				account_type_id: id,
			});
		});
		return () => {
			clearTimeout(timeoutId);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [id]);

	const handleTableChange = (pagination, filters, sorter) => {
		setDataTableInfo({
			...dataTableInfo,
			sort_field: sorter.columnKey,
			sort_order: sorter.order ? sorter.order.replace("end", "") : null,
			page: 1,
			page_size: "50",
		});
	};

	useEffect(() => {
		refetchDataAccountPlan();
		return () => {};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dataTableInfo]);

	const validator = {
		require: {
			required: true,
			message: "Required",
		},
	};

	const handleEdit = (record) => {
		// console.log("handleEdit", record);
		form.setFieldsValue({
			id: record.id,
			plan: record.plan,
			description: record.description,
			amount: record.amount,
			type: record.type,
			up_to: record.up_to,
		});
		setModal(true);
	};

	const { mutate: mutateDelete, isLoading: isLoadingDelete } = DELETE(
		"api/v1/account_plan",
		"account_plan_delete"
	);

	const handleDelete = (record) => {
		let data = {
			id: record.id,
		};

		mutateDelete(data, {
			onSuccess: (res) => {
				if (res.success) {
					refetchDataAccountPlan();
					notification.success({
						message: "Account Plan",
						description: res.message,
					});
				}
			},
			onError: (err) => {
				notification.error({
					message: "Account Plan",
					description: err.response.data.message,
				});
			},
		});
	};

	const [modal, setModal] = useState(false);
	const onFinish = (value) => {
		// console.log("onfinish value", value);
		let data = {
			...value,
			id: value.id ? value.id : "",
			account_type_id: id,
		};
		// console.log("onFinish data", data);
		mutateAccountType(data, {
			onSuccess: (res) => {
				if (res.success) {
					refetchDataAccountPlan();
					notification.success({
						message: "Account Plan",
						description: res.message,
					});
					form.resetFields();
					setModal(false);
				}
			},
			onError: (err) => {
				notification.error({
					message: "Account Plan",
					description: err.response.data.message,
				});
			},
		});
	};

	const { mutate: mutateAccountType, isLoading: isLoadingAccountType } = POST(
		"api/v1/account_plan",
		"account_plan_create"
	);

	const {
		mutate: mutateSort,
		// isLoading: isLoadingSort
	} = POST("api/v1/plan_sort", "plan_sort");

	const onSortEnd = ({ oldIndex, newIndex }) => {
		// const { dataSource } = data;
		if (oldIndex !== newIndex) {
			const newData = arrayMoveImmutable(
				[].concat(data),
				oldIndex,
				newIndex
			).filter((el) => !!el);
			// console.log("Sorted items: ", newData);
			let data_sort = { sorted_data: JSON.stringify(newData) };
			mutateSort(data_sort, {
				onSuccess: (res) => {
					if (res.success) {
						// console.log(res);
						notification.success({
							message: "Account Plan",
							description: "Sort updated successfully",
						});
					}
				},
			});
			setData(newData);
		}
	};

	const DraggableContainer = (props) => (
		<SortableBody
			useDragHandle
			disableAutoscroll
			helperClass="row-dragging"
			onSortEnd={onSortEnd}
			{...props}
		/>
	);

	const DraggableBodyRow = ({ className, style, ...restProps }) => {
		// const { dataSource } = data;
		// console.log("dataSource", dataSource);
		// function findIndex base on Table rowKey props and should always be a right array index
		const index = data.findIndex((x) => x.index === restProps["data-row-key"]);
		return <SortableItem index={index} {...restProps} />;
	};

	const columns = [
		{
			title: "Sort",
			dataIndex: "sort",
			width: 30,
			className: "drag-visible",
			render: () => <DragHandle />,
		},
		{
			title: "Plan",
			dataIndex: "plan",
			key: "plan",
			className: "drag-visible",
			width: "200px",
		},
		{
			title: "Description",
			dataIndex: "description",
			key: "description",
			className: "drag-visible",
			width: "250px",
		},
		{
			title: "Amount",
			key: "amount",
			className: "drag-visible",
			width: "150px",
			dataIndex: "amount",
			render: (text, _) => "$" + text,
		},
		{
			title: "Up To",
			dataIndex: "up_to",
			key: "up_to",
			className: "drag-visible",
			width: "200px",
		},
		{
			title: "Type",
			dataIndex: "type",
			key: "type",
			className: "drag-visible",
			width: "200px",
		},
		{
			title: "Action",
			dataIndex: "action",
			key: "action",
			className: "drag-visible",
			width: "150px",
			align: "center",
			render: (text, record) => {
				return (
					<Space>
						<Button
							type="link"
							className="color-1"
							icon={<FontAwesomeIcon icon={faPencil} />}
							onClick={(e) => handleEdit(record)}
						/>

						<Popconfirm
							title="Are you sure to delete this Plan?"
							onConfirm={(e) => {
								if (record.user_plan.length === 0) {
									handleDelete(record);
								} else {
									notification.error({
										message: "Account Plan",
										description:
											"This Plan is already in use and cannot be deleted.",
									});
								}
							}}
							okText="Yes"
							cancelText="No"
						>
							<Button
								type="link"
								className="color-6"
								icon={<FontAwesomeIcon icon={faTrashAlt} />}
								loading={isLoadingDelete}
							/>
						</Popconfirm>
					</Space>
				);
			},
		},
	];

	return (
		<>
			<Row gutter={[12, 12]}>
				<Col xs={24} sm={24} md={24}>
					<Button
						className="btn-main-invert-outline b-r-none"
						icon={<FontAwesomeIcon icon={faPlus} className="m-r-sm" />}
						onClick={(e) => {
							setModal(true);
						}}
						size="large"
					>
						Add Plan
					</Button>
				</Col>
				<Col xs={24} sm={24} md={24}>
					<div className="ant-space-flex-space-between table-size-table-search">
						<div>
							<TablePageSize
								tableFilter={dataTableInfo}
								setTableFilter={setDataTableInfo}
							/>
						</div>

						<div>
							<TableGlobalInputSearch
								tableFilter={dataTableInfo}
								setTableFilter={setDataTableInfo}
							/>
						</div>
					</div>
				</Col>
				<Col xs={24} sm={24} md={24}>
					<div className="table-responsive">
						<Table
							size="small"
							// rowKey={(record) => record.id}
							rowKey="index"
							className="ant-table-default ant-table-striped"
							loading={isLoadingAccountPlan}
							dataSource={data}
							columns={columns}
							pagination={false}
							onChange={handleTableChange}
							components={{
								body: {
									wrapper: DraggableContainer,
									row: DraggableBodyRow,
								},
							}}
							scroll={{ x: "max-content" }}
						/>
					</div>
				</Col>
				<Col xs={24} sm={24} md={24}>
					<div className="ant-space-flex-space-between table-entries-table-pagination">
						<TableShowingEntries />

						<TablePagination
							tableFilter={dataTableInfo}
							setTableFilter={setDataTableInfo}
							setPaginationTotal={dataAccountPlan && dataAccountPlan.data.total}
							showLessItems={true}
							showSizeChanger={false}
							parentClass="table1"
						/>
					</div>
				</Col>
			</Row>

			<Modal
				title="Plan Form"
				className="modal-primary-default modal-admin-account-plan-form"
				closeIcon={<FontAwesomeIcon icon={faTimes} />}
				open={modal}
				width="700px"
				onCancel={(e) => {
					setModal(false);
					form.resetFields();
				}}
				footer={
					<Space>
						<Button
							onClick={(e) => {
								setModal(false);
								form.resetFields();
							}}
							className="btn-main-invert-outline-active b-r-none"
							size="large"
						>
							CANCEL
						</Button>
						<Button
							className="btn-main-invert-outline b-r-none"
							onClick={(e) => form.submit()}
							loading={isLoadingAccountType}
							size="large"
						>
							SUBMIT
						</Button>
					</Space>
				}
			>
				<Form layout="horizontal" form={form} onFinish={onFinish}>
					<Row gutter={24}>
						<Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
							<Form.Item name="id" style={{ display: "none" }}>
								<FloatInput label="id" placeholder="id" />
							</Form.Item>
							<Form.Item name="plan" rules={[validator.require]} hasFeedback>
								<FloatInput label="Plan" placeholder="Plan" />
							</Form.Item>
						</Col>
						<Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
							<Form.Item name="amount" rules={[validator.require]} hasFeedback>
								<FloatInputRate label="Amount" placeholder="Amount" />
							</Form.Item>
						</Col>
						<Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
							<Form.Item name="description" rules={[validator.require]}>
								<FloatTextArea label="Description" placeholder="Description" />
							</Form.Item>
						</Col>
						<Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
							<Form.Item name="up_to" rules={[validator.require]} hasFeedback>
								<FloatInput label="Up To" placeholder="Up To" />
							</Form.Item>
						</Col>
						<Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
							<Form.Item
								name="type"
								rules={[validator.require]}
								hasFeedback
								className="form-select-error"
							>
								<FloatSelect
									label="Type"
									placeholder="Type"
									options={[
										{
											label: "Monthly",
											value: "Monthly",
										},
										{
											label: "Yearly",
											value: "Yearly",
										},
									]}
								/>
							</Form.Item>
						</Col>
					</Row>
				</Form>
			</Modal>
		</>
	);
}
