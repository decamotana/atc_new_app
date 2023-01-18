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
	// Divider,
	Popconfirm,
} from "antd";
// import ComponentFaqs from "../Components/ComponentFaqs";
import $ from "jquery";
import { DELETE, GET, POST } from "../../../../../providers/useAxiosQuery";
// import { useHistory } from "react-router-dom";
import FloatInput from "../../../../../providers/FloatInput";

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
import { faPencil, faPlus, faTimes } from "@fortawesome/pro-solid-svg-icons";
import { faTrashAlt } from "@fortawesome/pro-regular-svg-icons";

import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import ImageResize from "quill-image-resize-module-react";
Quill.register("modules/imageResize", ImageResize);

const DragHandle = SortableHandle(() => (
	<MenuOutlined style={{ cursor: "grab", color: "#999" }} />
));

const SortableItem = SortableElement((props) => <tr {...props} />);
const SortableBody = SortableContainer((props) => <tbody {...props} />);

export default function TableFaqs({ id }) {
	// const sub_title = "View";
	// const history = useHistory();
	const [form] = Form.useForm();

	const modulesToolBar = {
		toolbar: [
			[{ header: [1, 2, false] }],
			["bold", "italic", "underline", "strike", "blockquote"],
			[
				{ list: "ordered" },
				{ list: "bullet" },
				{ indent: "-1" },
				{ indent: "+1" },
			],
			["image", "video"],
			["clean"],
		],
		imageResize: {
			modules: ["Resize", "DisplaySize"],
		},
	};

	const formats = [
		"header",
		"font",
		"size",
		"bold",
		"italic",
		"underline",
		"strike",
		"blockquote",
		"list",
		"bullet",
		"indent",
		"link",
		"image",
		"video",
	];
	const [responseData, setResponseData] = useState({
		response: "",
	});
	const [tableTotal, setTableTotal] = useState(0);
	const [dataTableInfo, setDataTableInfo] = useState({
		search: "",
		state: "",
		page: 1,
		page_size: "50",
		column: "index",
		order: "asc",
		account_type_id: id,
	});
	const [data, setData] = useState([]);
	const {
		// data: dataGetProfiles,
		isLoading: isLoadingGetProfiles,
		refetch: refetchGetProfiles,
	} = GET(`api/v1/faq?${$.param(dataTableInfo)}`, "faq", (res) => {
		if (res.success) {
			// console.log("faq", res);
			let arr = [];
			res.data.data.map((row, key) => {
				arr.push({
					key: row.id,
					index: key,
					account_type_id: row.account_type_id,
					title: row.title,
					description: row.description,
					id: row.id,
				});
				return "";
			});
			setTableTotal(res.data.total);
			setData(arr);
		}
	});

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
			column: sorter.columnKey,
			order: sorter.order ? sorter.order.replace("end", "") : null,
			page: 1,
			page_size: "50",
		});
	};

	useEffect(() => {
		refetchGetProfiles();
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
			title: record.title,
			description: record.description,
		});
		setResponseData({ ...responseData, response: record.description });
		setModal(true);
	};

	const handleDelete = (record) => {
		let data = {
			id: record.id,
		};

		mutateDelete(data, {
			onSuccess: (res) => {
				if (res.success) {
					refetchGetProfiles();
					notification.success({
						message: "Account FAQ's",
						description: "Succesfully Deleted",
					});
				}
			},
			onError: (err) => {
				notification.error({
					message: "Account FAQ's",
					description: err.response.data.message,
				});
			},
		});
	};

	const { mutate: mutateDelete, isLoading: isLoadingDelete } = DELETE(
		"api/v1/faq",
		"faq"
	);

	const [modal, setModal] = useState(false);
	const onFinish = (value) => {
		let data = {
			...value,
			account_type_id: id,
		};
		// console.log("onFinish", data);
		mutateAccountType(data, {
			onSuccess: (res) => {
				if (res.success) {
					refetchGetProfiles();
					notification.success({
						message: "Account FAQ's",
						description: "Data submitted successfully.",
					});
					form.resetFields();
					setModal(false);
				}
			},
			onError: (err) => {
				notification.error({
					message: "Account FAQ's",
					description: err.response.data.message,
				});
			},
		});
	};

	const { mutate: mutateAccountType, isLoading: isLoadingAccountType } = POST(
		"api/v1/faq",
		"faq"
	);

	const {
		mutate: mutateSort,
		// isLoading: isLoadingSort
	} = POST("api/v1/faq_sort", "faq_sort");

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
							message: "Account FAQ's",
							description: "Sort updated successfully",
						});
					}
				},
				onError: (err) => {
					notification.error({
						message: "Account FAQ's",
						description: err.response.data.message,
					});
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
			title: "Title",
			dataIndex: "title",
			key: "title",
			className: "drag-visible",
			width: "200px",
		},
		{
			title: "Description",
			dataIndex: "description",
			key: "description",
			className: "drag-visible",
			render: (text, record) => (
				<div
					dangerouslySetInnerHTML={{
						__html: text,
					}}
				/>
			),
			width: "350px",
		},
		{
			title: "Action",
			dataIndex: "action",
			key: "action",
			align: "center",
			width: "150px",
			className: "drag-visible",
			render: (text, record) => {
				return (
					<Space>
						<Button
							type="link"
							className="color-1"
							onClick={(e) => handleEdit(record)}
							icon={<FontAwesomeIcon icon={faPencil} />}
						/>
						<Popconfirm
							title="Are you sure to delete this FAQ?"
							onConfirm={(e) => handleDelete(record)}
							// onCancel={cancel}
							okText="Yes"
							cancelText="No"
						>
							<Button
								type="link"
								className="color-6"
								loading={isLoadingDelete}
								icon={<FontAwesomeIcon icon={faTrashAlt} />}
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
						onClick={(e) => {
							setModal(true);
							setResponseData({
								response: "",
							});
						}}
						size="large"
						icon={<FontAwesomeIcon icon={faPlus} className="m-r-sm" />}
					>
						Add FAQ's
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
							rowKey="index"
							className="ant-table-default ant-table-striped"
							loading={isLoadingGetProfiles}
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
					<div className="ant-space-flex-space-between table-entries-table-pagination account_type_faqs_pagination">
						<TableShowingEntries />

						<TablePagination
							tableFilter={dataTableInfo}
							setTableFilter={setDataTableInfo}
							setPaginationTotal={tableTotal}
							showLessItems={true}
							showSizeChanger={false}
							parentClass="account_type_faqs_pagination"
						/>
					</div>
				</Col>
			</Row>

			<Modal
				closeIcon={<FontAwesomeIcon icon={faTimes} />}
				title="FAQ Form"
				className="modal-primary-default modal-admin-faq"
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
							onClick={(e) => form.submit()}
							loading={isLoadingAccountType}
							className="btn-main-invert-outline b-r-none"
							size="large"
						>
							SUBMIT
						</Button>
					</Space>
				}
			>
				<Form
					layout="horizontal"
					form={form}
					onFinish={onFinish}
					initialValues={{
						description: "",
					}}
				>
					<Row gutter={24}>
						<Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
							<Form.Item name="id" style={{ display: "none" }}>
								<FloatInput label="id" placeholder="id" />
							</Form.Item>
							<Form.Item name="title" rules={[validator.require]} hasFeedback>
								<FloatInput label="Title" placeholder="Title" />
							</Form.Item>
						</Col>

						<Col
							xs={24}
							sm={24}
							md={24}
							lg={24}
							xl={24}
							xxl={24}
							className="quill-input"
						>
							<Form.Item
								name="description"
								rules={[validator.require]}
								hasFeedback
							>
								<ReactQuill
									theme="snow"
									style={{ height: 200 }}
									modules={modulesToolBar}
									formats={formats}
									placeholder="Description"
								/>
							</Form.Item>
							<br />
							<br />
						</Col>
					</Row>
				</Form>
			</Modal>
		</>
	);
}
