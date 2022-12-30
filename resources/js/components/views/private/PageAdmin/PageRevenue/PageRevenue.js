import React, { useEffect, useState } from "react";
import { Button, Card, Col, Collapse, Form, Row, Table } from "antd";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint, faEye } from "@fortawesome/pro-regular-svg-icons";

import NumberFormat from "react-number-format";

import FloatInput from "../../../../providers/FloatInput";
import FloatSelect from "../../../../providers/FloatSelect";
import FloatDatePicker from "../../../../providers/FloatDatePicker";

import numericConvertToPercentage from "../../../../providers/numericConvertToPercentage";

import highchartsSetOptions from "../../../../providers/highchartsSetOptions";
import Highcharts from "highcharts";
import highcharts3d from "highcharts/highcharts-3d";
import hcexporting from "highcharts/modules/exporting";
import moment from "moment";

import { GET } from "../../../../providers/useAxiosQuery";

import {
	TableGlobalInputSearch,
	TablePageSize,
	TablePagination,
	TableShowingEntries,
} from "../../Components/ComponentTableFilter";

import RevenueReport from "./Component/RevenueReport";
import ModalCustomerInvoice from "./Component/ModalCustomerInvoice";
import html2pdf from "html2pdf.js";

import $ from "jquery";

highcharts3d(Highcharts);
hcexporting(Highcharts);

const validator = {
	require: {
		required: true,
		message: "Required",
	},
};

export default function PageRevenue() {
	highchartsSetOptions(Highcharts);

	const [hasCollapse, setHasCollapse] = useState(
		$(".private-layout > .ant-layout").hasClass("ant-layout-has-collapse")
			? true
			: false
	);

	const [formFilter] = Form.useForm();

	const [revenueFilter, setRevenueFilter] = useState({
		date_from: moment(1, "DD").format("YYYY-MM-DD"),
		date_to: moment().format("YYYY-MM-DD"),
		name: "",
		type: "ALL",
	});
	const [tableFilter, setTableFilter] = useState({
		page: 1,
		page_size: 50,
		search: "",
		sort_field: "date_paid",
		sort_order: "desc",
		date_from: moment(1, "DD").format("YYYY-MM-DD"),
		date_to: moment().format("YYYY-MM-DD"),
		name: "",
		type: "ALL",
	});

	const [toggleModalInvoice, setToggleModalInvoice] = useState({
		show: false,
		data: null,
	});

	const [dataRevenue, setDataRevenue] = useState([]);

	const [revenueReport, setRevenueReport] = useState(null);

	const { refetch: refetchRevenue } = GET(
		`api/v1/revenue_by_filter?${new URLSearchParams(revenueFilter)}`,
		"revenue_by_filter",
		(res) => {
			if (res.data) {
				setRevenueReport(res.data);

				let total_revenue = 0;
				let total_caregiver = 0;
				let total_carepro = 0;

				res.data.map((item) => {
					if (item.invite_status === 0) {
						let total = item.amount ? parseFloat(item.amount) : 0;

						if (item.coupon) {
							if (item.coupon.type === "fixed") {
								total = parseFloat(item.amount) - item.coupon.off;
							}
							if (item.coupon.type === "percent") {
								let percentage = item.coupon.off / 100;
								total =
									parseFloat(item.amount) -
									parseFloat(item.amount) * percentage;
							}
						}

						total_revenue += total;
					}

					if (item.role === "Cancer Caregiver") {
						total_caregiver++;
					}
					if (item.role === "Cancer Care Professional") {
						total_carepro++;
					}
					return "";
				});

				let data = [
					{
						key: 0,
						from_date: revenueFilter.date_from,
						to_date: revenueFilter.date_to,
						total_subscriber: res.data.length,
						total_revenue,
						total_caregiver,
						total_carepro,
						type: revenueFilter.type,
					},
				];
				setDataRevenue(data);

				if (revenueFilter.date_from && revenueFilter.date_to) {
					let date_from = moment(revenueFilter.date_from);
					let date_to = moment(revenueFilter.date_to);
					var date_from_clone = date_from.clone();
					var timeValues = [];

					let year_from = date_from.format("Y");
					let year_to = date_to.format("Y");

					while (
						date_to > date_from_clone ||
						date_from_clone.format("M") === date_to.format("M")
					) {
						timeValues.push(date_from_clone.format("YYYY-MM"));
						date_from_clone.add(1, "month");
					}

					let xAxisTitleText = "DAILY";
					let subtitleText = "REVENUE DAILY";

					let data_series_name = [];
					let data_series_value = [];

					if (timeValues.length > 1) {
						if (parseInt(year_to) - parseInt(year_from) >= 2) {
							xAxisTitleText = "YEAR";
							subtitleText = "REVENUE YEARLY";

							for (let x = parseInt(year_from); x <= parseInt(year_to); x++) {
								data_series_name.push(x);

								let filterItem = res.data.filter(
									(f) => parseInt(moment(f.date_paid).format("YYYY")) === x
								);

								let amount = filterItem.reduce((a, b) => {
									if (b.invite_status === 0) {
										let total = b.amount ? parseFloat(b.amount) : 0;

										if (b.coupon) {
											if (b.coupon.type === "fixed") {
												total = parseFloat(b.amount) - b.coupon.off;
											}
											if (b.coupon.type === "percent") {
												var percentage = b.coupon.off / 100;
												total =
													parseFloat(b.amount) -
													parseFloat(b.amount) * percentage;
											}
										}

										a += total;
									}
									return a;
								}, 0);

								data_series_value.push(amount);
							}
						} else {
							xAxisTitleText = "MONTH";
							subtitleText = "REVENUE MONTHLY";

							for (let x = 0; x < timeValues.length; x++) {
								const elem = timeValues[x];
								data_series_name.push(elem);

								let filterItem = res.data.filter(
									(f) => moment(f.date_paid).format("YYYY-MM") === elem
								);

								let amount = filterItem.reduce((a, b) => {
									if (b.invite_status === 0) {
										let total = b.amount ? parseFloat(b.amount) : 0;

										if (b.coupon) {
											if (b.coupon.type === "fixed") {
												total = parseFloat(b.amount) - b.coupon.off;
											}
											if (b.coupon.type === "percent") {
												var percentage = b.coupon.off / 100;
												total =
													parseFloat(b.amount) -
													parseFloat(b.amount) * percentage;
											}
										}

										a += total;
									}
									return a;
								}, 0);

								data_series_value.push(amount);
							}
						}
					} else {
						xAxisTitleText = "DAY";
						subtitleText = "REVENUE DAILY";

						let days = Array.from(
							{ length: moment(timeValues[0]).daysInMonth() },
							(x, i) => moment().startOf("month").add(i, "days").format("DD")
						);
						for (
							let x = 0;
							x < moment(timeValues[0], "YYYY-MM").daysInMonth();
							x++
						) {
							let elem =
								moment(timeValues[0]).format("YYYY-MM") + "-" + days[x];
							data_series_name.push(elem);

							let filterItem = res.data.filter((f) => f.date_paid === elem);

							let amount = filterItem.reduce((a, b) => {
								if (b.invite_status === 0) {
									let total = b.amount ? parseFloat(b.amount) : 0;

									if (b.coupon) {
										if (b.coupon.type === "fixed") {
											total = parseFloat(b.amount) - b.coupon.off;
										}
										if (b.coupon.type === "percent") {
											var percentage = b.coupon.off / 100;
											total =
												parseFloat(b.amount) -
												parseFloat(b.amount) * percentage;
										}
									}

									a += total;
								}
								return a;
							}, 0);

							data_series_value.push(amount);
						}
					}

					Highcharts.chart("chart_revenue", {
						chart: {
							type: "column",
							options3d: {
								enabled: true,
								alpha: 0,
								beta: 0,
								depth: 40,
								viewDistance: 25,
							},
						},
						title: {
							text: null,
						},
						subtitle: {
							text: subtitleText,
						},
						xAxis: {
							title: {
								text: xAxisTitleText,
							},
							categories: data_series_name,
							crosshair: true,
							type: "category",
						},
						yAxis: {
							title: {
								text: null,
							},
							labels: {
								formatter: function () {
									return `$${Highcharts.numberFormat(this.value, 0, "", ",")}`;
								},
							},
						},
						tooltip: {
							headerFormat: "",
							formatter: function () {
								return `<span style="color:${this.color}; font-size:14px;">${
									this.x
								}</span><br/>TOTAL: <b>$${this.y.toFixed(2)}</b>`;
							},
							// pointFormat: `<span style="color:{point.color}; font-size:14px;">{point.name}</span><br/>TOTAL: <b>{point.y:.f}</b>`,
						},
						legend: {
							enabled: false,
						},
						plotOptions: {
							series: {
								borderWidth: 0,
								dataLabels: {
									enabled: false,
									// format: "{point.y:.2f}",
								},
							},
							column: {
								pointPadding: 0.2,
								borderWidth: 0,
								depth: 25,
								dataLabels: {
									enabled: false,
									// format: "{point.y:.0f}",
									formatter: function () {
										if (this.y === 0) {
											return null;
										}
										return this.y.toFixed(2);
									},
								},
							},
						},
						exporting: {
							enabled: false,
						},
						series: [
							{
								colorByPoint: true,
								data: data_series_value,
							},
						],
					});
				}
			}
		}
	);

	const { data: dataRevenueTable, refetch: refetchRevenueTable } = GET(
		`api/v1/revenue_table_by_filter?${new URLSearchParams(tableFilter)}`,
		"revenue_table_by_filter"
	);

	useEffect(() => {
		refetchRevenue();

		return () => {};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [revenueFilter]);

	useEffect(() => {
		if (dataRevenueTable) {
			refetchRevenueTable();
		}

		return () => {};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [tableFilter]);

	const handleOnFinishSearch = (values) => {
		// console.log(values);
		setRevenueFilter({
			...revenueFilter,
			date_from: moment(values.date_from).format("YYYY-MM-DD"),
			date_to: moment(values.date_to).format("YYYY-MM-DD"),
			name: values.name !== undefined ? values.name : "",
			type: values.type,
		});
		setTableFilter({
			...tableFilter,
			page: 1,
			date_from: moment(values.date_from).format("YYYY-MM-DD"),
			date_to: moment(values.date_to).format("YYYY-MM-DD"),
			name: values.name !== undefined ? values.name : "",
			type: values.type,
		});
	};

	const handleFormClear = () => {
		formFilter.resetFields();
		setRevenueFilter({
			...revenueFilter,
			date_from: moment(1, "DD").format("YYYY-MM-DD"),
			date_to: moment().format("YYYY-MM-DD"),
			name: "",
			type: "ALL",
			loading: true,
		});
		setTableFilter({
			...tableFilter,
			page: 1,
			page_size: 50,
			search: "",
			sort_field: "date_paid",
			sort_order: "desc",
			date_from: moment(1, "DD").format("YYYY-MM-DD"),
			date_to: moment().format("YYYY-MM-DD"),
			name: "",
			type: "ALL",
			loading: true,
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

	const handleDownloadRevenueReport = () => {
		html2pdf(document.getElementById("revenue_report_wrapper"), {
			margin: 0.2,
			filename: "revenue-ccg" + moment().format("YYYY-MM") + ".pdf",
			image: { type: "jpeg", quality: 0.95 },
			html2canvas: {
				width: 900,
				height:
					document.getElementById("revenue_report_wrapper").offsetHeight + 500,
				scale: 1,
				windowWidth: 700,
				windowHeight:
					document.getElementById("revenue_report_wrapper").offsetHeight *
					document.getElementById("revenue_report_wrapper").offsetHeight,
			},
			jsPDF: {
				unit: "in",
				format: "a4",
				orientation: "portrait",
			},
		});
	};

	useEffect(() => {
		$("#btn_sidemenu_collapse_unfold").on("click", function () {
			setHasCollapse(false);
			// console.log("btn_sidemenu_collapse_unfold");
		});
		$("#btn_sidemenu_collapse_fold").on("click", function () {
			setHasCollapse(true);
			// console.log("btn_sidemenu_collapse_fold");
		});

		return () => {};
	}, []);

	return (
		<Card className="page-admin-revenue" id="PageRevenue">
			<Row gutter={[12, 12]}>
				<Col
					xs={24}
					sm={24}
					md={24}
					lg={24}
					xl={hasCollapse ? 12 : 24}
					xxl={12}
				>
					<Collapse
						className="main-1-collapse border-none"
						expandIcon={({ isActive }) =>
							isActive ? (
								<span
									className="ant-menu-submenu-arrow"
									style={{ color: "#FFF", transform: "rotate(270deg)" }}
								></span>
							) : (
								<span
									className="ant-menu-submenu-arrow"
									style={{ color: "#FFF", transform: "rotate(90deg)" }}
								></span>
							)
						}
						defaultActiveKey={["1"]}
						expandIconPosition="start"
					>
						<Collapse.Panel
							header="FILTERS"
							key="1"
							className="accordion bg-darkgray-form m-b-md border bgcolor-1 white"
						>
							<Form
								form={formFilter}
								onFinish={handleOnFinishSearch}
								initialValues={{
									date_from: moment(1, "DD"),
									date_to: moment(),
									type: "ALL",
									name: "",
								}}
							>
								<Row gutter={8}>
									<Col xs={24} sm={24} md={12}>
										<Form.Item name="date_from" rules={[validator.require]}>
											<FloatDatePicker
												label="From Date"
												placeholder="From Date"
												format="MM/DD/YYYY"
											/>
										</Form.Item>
									</Col>
									<Col xs={24} sm={24} md={12}>
										<Form.Item name="date_to" rules={[validator.require]}>
											<FloatDatePicker
												label="To Date"
												placeholder="To Date"
												format="MM/DD/YYYY"
												disabledDate={(current) => {
													return (
														current &&
														current < formFilter.getFieldValue().date_from
													);
												}}
											/>
										</Form.Item>
									</Col>
									<Col xs={24} sm={24} md={12}>
										<Form.Item name="name">
											<FloatInput label="Name" placeholder="Name" />
										</Form.Item>
									</Col>
									<Col xs={24} sm={24} md={12}>
										<Form.Item name="type" className="form-select-error">
											<FloatSelect
												label="Select Type"
												placeholder="Select Type"
												options={[
													{
														value: "ALL",
														label: "All",
													},
													{
														value: "Cancer Caregiver",
														label: "Cancer Caregiver",
													},
													{
														value: "Cancer Care Professional",
														label: "Cancer Care Professional",
													},
												]}
											/>
										</Form.Item>
									</Col>

									<Col xs={24} sm={24} md={12}>
										<Button
											size="large"
											className="btn-main-invert b-r-none m-r-sm"
											htmlType="submit"
										>
											SEARCH
										</Button>
										<Button
											size="large"
											className="btn-main-outline-active b-r-none"
											onClick={handleFormClear}
										>
											CLEAR
										</Button>
									</Col>
								</Row>
							</Form>
						</Collapse.Panel>
					</Collapse>
				</Col>
				<Col
					xs={24}
					sm={24}
					md={24}
					lg={24}
					xl={hasCollapse ? 12 : 24}
					xxl={12}
				>
					<Collapse
						className="main-1-collapse border-none"
						expandIcon={({ isActive }) =>
							isActive ? (
								<span
									className="ant-menu-submenu-arrow"
									style={{ color: "#FFF", transform: "rotate(270deg)" }}
								></span>
							) : (
								<span
									className="ant-menu-submenu-arrow"
									style={{ color: "#FFF", transform: "rotate(90deg)" }}
								></span>
							)
						}
						defaultActiveKey={["1"]}
						expandIconPosition="start"
					>
						<Collapse.Panel
							header="REVENUE CHART"
							key="1"
							className="accordion bg-darkgray-form m-b-md border bgcolor-1 white"
						>
							<div id="chart_revenue" className="highchart-responsive" />
						</Collapse.Panel>
					</Collapse>
				</Col>
				<Col xs={24} sm={24} md={24}>
					<Collapse
						className="main-1-collapse border-none collapse-result-total"
						expandIcon={({ isActive }) =>
							isActive ? (
								<span
									className="ant-menu-submenu-arrow"
									style={{ color: "#FFF", transform: "rotate(270deg)" }}
								></span>
							) : (
								<span
									className="ant-menu-submenu-arrow"
									style={{ color: "#FFF", transform: "rotate(90deg)" }}
								></span>
							)
						}
						defaultActiveKey={["1"]}
						expandIconPosition="start"
					>
						<Collapse.Panel
							header="RESULTS TOTAL"
							key="1"
							className="accordion bg-darkgray-form m-b-md border-none bgcolor-1 white"
						>
							<Table
								className="thead-light ant-table-striped"
								dataSource={dataRevenue}
								rowKey={(record) => record.key}
								pagination={false}
								bordered={false}
								scroll={{ x: "max-content" }}
							>
								<Table.Column
									title="From Date"
									key="from_date"
									dataIndex="from_date"
									render={(text, _) =>
										text ? moment(text).format("MM/DD/YYYY") : "MM/DD/YYYY"
									}
								/>
								<Table.Column
									title="To Date"
									key="to_date"
									dataIndex="to_date"
									render={(text, _) =>
										text ? moment(text).format("MM/DD/YYYY") : "MM/DD/YYYY"
									}
								/>
								<Table.Column
									title="Total Subscribers"
									key="total_subscriber"
									dataIndex="total_subscriber"
									// sorter={true}
								/>
								<Table.Column
									title="Total Revenue"
									key="total_revenue"
									dataIndex="total_revenue"
									// sorter={true}
									render={(text, _) =>
										text ? (
											<NumberFormat
												value={text.toFixed(2)}
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
									title="Caregivers % / Care Professional %"
									key="caregivers_careproviders"
									dataIndex="caregivers_careproviders"
									render={(_, record) => {
										// console.log("record", record);
										let data = "";
										let numericConvertToPercentageData =
											numericConvertToPercentage(Highcharts, [
												record.total_caregiver,
												record.total_carepro,
											]);
										if (revenueFilter.type === "ALL") {
											data =
												numericConvertToPercentageData[0] +
												"% / " +
												numericConvertToPercentageData[1] +
												"%";
										} else if (revenueFilter.type === "Cancer Caregiver") {
											data = numericConvertToPercentageData[0] + "%";
										} else if (
											revenueFilter.type === "Cancer Care Professional"
										) {
											data = numericConvertToPercentageData[1] + "%";
										}

										return data;
									}}
									// sorter={true}
								/>
								<Table.Column
									title="Print"
									key="print"
									align="center"
									render={(_, record) => {
										return (
											<Button
												type="link"
												className="color-1"
												onClick={() => handleDownloadRevenueReport()}
												icon={<FontAwesomeIcon icon={faPrint} />}
											/>
										);
									}}
								/>
							</Table>
						</Collapse.Panel>
					</Collapse>
				</Col>
				<Col xs={24} sm={24} md={24} className="m-t-md">
					<Row gutter={12}>
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
					</Row>
					<Row gutter={12}>
						<Col xs={24} sm={24} md={24} className="m-t-sm m-b-sm">
							<Table
								className="thead-light ant-table-striped"
								dataSource={dataRevenueTable?.data?.data}
								rowKey={(record) => record.id}
								pagination={false}
								bordered={false}
								// rowSelection={{
								//   type: selectionType,
								//   ...rowSelection,
								// }}
								scroll={{ x: "max-content" }}
								onChange={onChangeTable}
							>
								<Table.Column
									title="Date"
									key="date_paid"
									dataIndex="date_paid"
									render={(text, _) => moment(text).format("MM/DD/YYYY")}
									sorter={true}
								/>
								<Table.Column
									title="First Name"
									key="firstname"
									dataIndex="firstname"
									defaultSortOrder="descend"
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
									title="Last Name"
									key="lastname"
									dataIndex="lastname"
									defaultSortOrder="descend"
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
									title="Revenue"
									key="amount"
									dataIndex="amount"
									sorter={true}
									render={(_, record) => {
										let total = 0;
										if (record.invite_status === 0) {
											total = record.amount ? parseFloat(record.amount) : 0;

											if (record.coupon) {
												if (record.coupon.type === "fixed") {
													total = parseFloat(record.amount) - record.coupon.off;
												}
												if (record.coupon.type === "percent") {
													var percentage = record.coupon.off / 100;
													total =
														parseFloat(record.amount) -
														parseFloat(record.amount) * percentage;
												}
											}
										}

										return (
											<NumberFormat
												value={parseFloat(total).toFixed(2)}
												displayType={"text"}
												thousandSeparator={true}
												prefix={"$"}
											/>
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
									title="State"
									key="state"
									dataIndex="state"
									sorter={true}
								/>
								<Table.Column
									title="Invoice"
									key="invoice"
									dataIndex="invoice"
									render={(text, record) => {
										return (
											<Button
												type="link"
												className="color-1"
												onClick={() =>
													setToggleModalInvoice({
														show: true,
														data: record,
													})
												}
											>
												<FontAwesomeIcon icon={faEye} />
											</Button>
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
									setPaginationTotal={dataRevenueTable?.data?.total}
									showLessItems={true}
									showSizeChanger={false}
								/>
							</div>
						</Col>
					</Row>
				</Col>
			</Row>
			<div
				style={{
					width: 900,
					height: 0,
					overflow: "hidden",
				}}
			>
				<div
					className="revenue_report_wrapper"
					id="revenue_report_wrapper"
					style={{
						width: 900,
						padding: "10px",
						display: "flex",
						flexDirection: "column",
						gap: "24px",
					}}
				>
					{revenueReport && (
						<RevenueReport
							revenueReport={revenueReport}
							setRevenueReport={setRevenueReport}
							revenueFilter={revenueFilter}
						/>
					)}
				</div>
			</div>

			<ModalCustomerInvoice
				toggleModalInvoice={toggleModalInvoice}
				setToggleModalInvoice={setToggleModalInvoice}
			/>
		</Card>
	);
}
