import React, { useState, useEffect } from "react";
import {
	Row,
	Col,
	Table,
	Button,
	notification,
	Popconfirm,
	Card,
	Space,
} from "antd";

import { GET, POST } from "../../../../providers/useAxiosQuery";
import {
	TablePageSize,
	TableShowingEntries,
	TablePagination,
	TableGlobalInputSearch,
} from "../../Components/ComponentTableFilter";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faPencil,
	faPlus,
	faTrashAlt,
} from "@fortawesome/pro-regular-svg-icons";
import ModalForm from "./Modals/ModalForm";

export default function PageCoupon() {
	const [dataTableInfo, setDataTableInfo] = useState({
		page: 1,
		search: "",
		page_size: 50,
		sort_field: "id",
		sort_order: "desc",
	});

	const { data: dataCoupons, refetch: refetchDataCoupons } = GET(
		`api/v1/get_coupons_system?${new URLSearchParams(dataTableInfo)}`,
		"get_coupons_system"
	);

	useEffect(() => {
		if (dataCoupons) {
			refetchDataCoupons();
		}
		// console.log("dataTableInfo", dataTableInfo);
		return () => {};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dataTableInfo]);

	const [isFixed, setIsFixed] = useState("percent");

	const [toggleModalForm, setToggleModalForm] = useState({
		open: false,
		data: null,
	});

	const {
		mutate: mutateUpdateCreateCoupon,
		isLoading: isLoadingUpdateCreateCoupon,
	} = POST("api/v1/add_coupon_system", "get_coupons_system");

	const {
		mutate: mutateDeleteCoupon,
		// isLoading: isLoadingCoupon
	} = POST("api/v1/delete_coupon_system", "get_coupons_system");

	const deleteCoupon = (id) => {
		mutateDeleteCoupon(
			{ id: id },
			{
				onSuccess: (res) => {
					if (res.success) {
						// console.log(res)
						notification.success({
							message: "Coupon",
							description: "Data sucessfully deleted",
						});
					}
				},
				onError: (err) => {
					// console.log(err);
				},
			}
		);
	};

	function convertDollar(x) {
		return Number.parseFloat(x).toFixed(2);
	}

	const onChangeTable = (pagination, filters, sorter) => {
		setDataTableInfo({
			...dataTableInfo,
			sort_field: sorter.columnKey,
			sort_order: sorter.order ? sorter.order.replace("end", "") : null,
			page: 1,
		});
	};

	const onFinish = (values) => {
		let data = {
			...values,
			id: toggleModalForm.data?.id ?? "",
			type: isFixed,
			duration_from: values.duration_from.format("YYYY-MM-DD"),
			duration_to: values.duration_to.format("YYYY-MM-DD"),
			max_redemptions: values.max_redemptions
				? Math.floor(values.max_redemptions)
				: null,
		};
		// console.log("onFinish", values.duration_from.format("YYYY-MM-DD"));
		mutateUpdateCreateCoupon(data, {
			onSuccess: (res) => {
				if (res.success) {
					// console.log(res)

					notification.success({
						message: "Coupon",
						description: res.message,
					});
					setToggleModalForm({
						open: false,
						data: null,
					});
					setIsFixed("percent");
				} else {
					notification.error({
						message: "Coupon",
						description: res.message,
					});
				}
			},
			onError: (err) => {
				notification.error({
					message: "Error",
					description: err.response.data.message,
				});
			},
		});
	};

	return (
		<Card id="PageCoupon" className="webMT">
			<Row gutter={[12, 12]}>
				<Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
					<Button
						className="btn-main-invert-outline b-r-none"
						size="large"
						icon={<FontAwesomeIcon icon={faPlus} className="m-r-sm" />}
						onClick={() =>
							setToggleModalForm({
								open: true,
								data: null,
							})
						}
					>
						Add Coupon
					</Button>
				</Col>

				<Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
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
					<Table
						className="ant-table-default ant-table-striped"
						size="small"
						rowKey={(record) => record.id}
						dataSource={dataCoupons && dataCoupons.data.data}
						pagination={false}
						onChange={onChangeTable}
						scroll={{ x: "max-content" }}
					>
						<Table.Column
							key="coupon_code"
							title="Coupon Code"
							dataIndex="coupon_code"
							sorter={(a, b) => a.coupon_code.localeCompare(b.coupon_code)}
						/>
						<Table.Column
							key="coupon_name"
							title="Coupon Name"
							dataIndex="coupon_name"
							sorter={(a, b) => a.coupon_name.localeCompare(b.coupon_name)}
						/>

						<Table.Column
							key="off"
							title="Discount"
							dataIndex="off"
							sorter={(a, b) => a.off - b.off}
							render={(text, record) => {
								return (
									<div key={record.id}>
										{record.type === "percent" && record.off + "%"}
										{record.type === "fixed" &&
											"$" + convertDollar(record.off) + " off"}
										{record.type === "offer" && record.off + " days"}
									</div>
								);
							}}
							// sorter
						/>
						<Table.Column
							key="duration_from"
							title="Duration"
							dataIndex="duration_from"
							sorter={(a, b) => a.duration_from.localeCompare(b.duration_from)}
							render={(text, record) => {
								return (
									<div key={record.id}>
										{"" + record.duration_from + " - " + record.duration_to}
									</div>
								);
							}}
						/>

						<Table.Column
							key="role"
							title="Account type"
							dataIndex="role"
							sorter={(a, b) => a.role.localeCompare(b.role)}
							render={(text, record) => {
								return (
									<div key={record.id}>
										{JSON.parse(record.role).join(", ")}
									</div>
								);
							}}
						/>
						<Table.Column
							key="redemption"
							title="Redemption"
							dataIndex="redemption"
							sorter={(a, b) => a.redemption - b.redemption}
							render={(text, record) => {
								return (
									<div key={record.id}>
										{record.redemption
											? record.redemption + "/" + record.max
											: record.redemption}
									</div>
								);
							}}
						/>
						<Table.Column
							key="action"
							title="Action"
							className="couponAction"
							// sorter
							align="center"
							render={(text, record) => {
								return (
									<Space>
										<Button
											disabled={
												parseFloat(record.redemption) > 0 ? true : false
											}
											type="link"
											size="small"
											className={
												parseFloat(record.redemption) > 0 ? "" : "color-1"
											}
											icon={<FontAwesomeIcon icon={faPencil} />}
											onClick={() => {
												setToggleModalForm({
													open: true,
													data: record,
												});
											}}
										/>

										{parseFloat(record.redemption) > 0 ? (
											<Button
												disabled={true}
												type="link"
												size="small"
												className={
													parseFloat(record.redemption) > 0 ? "" : "color-6"
												}
												icon={<FontAwesomeIcon icon={faTrashAlt} />}
											/>
										) : (
											<Popconfirm
												placement="topRight"
												title={
													"Are you sure you want to deactivate this coupon?"
												}
												onConfirm={() => deleteCoupon(record.id)}
												okText="Yes"
												cancelText="No"
											>
												<Button
													disabled={
														parseFloat(record.redemption) > 0 ? true : false
													}
													type="link"
													size="small"
													className="color-6"
													icon={<FontAwesomeIcon icon={faTrashAlt} />}
												/>
											</Popconfirm>
										)}
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
							tableFilter={dataTableInfo}
							setTableFilter={setDataTableInfo}
							setPaginationTotal={dataCoupons?.data.total}
							showLessItems={true}
							showSizeChanger={false}
						/>
					</div>
				</Col>
			</Row>
			<ModalForm
				toggleModalForm={toggleModalForm}
				setToggleModalForm={setToggleModalForm}
				onFinish={onFinish}
				isLoading={isLoadingUpdateCreateCoupon}
				isFixed={isFixed}
				setIsFixed={setIsFixed}
			/>
		</Card>
	);
}
