import { Button, Card, Col, Collapse, Row, Table } from "antd";
import { useEffect, useState } from "react";
import $ from "jquery";
import {
	TableGlobalInputSearch,
	TablePageSize,
	TablePagination,
	TableShowingEntries,
} from "../../Components/ComponentTableFilter";
import { GET } from "../../../../providers/useAxiosQuery";
import highchartsSetOptions from "../../../../providers/highchartsSetOptions";
import Highcharts from "highcharts";

export default function PageSubscribers() {
	highchartsSetOptions(Highcharts);

	const [tableSubscriberStatusFilter, setTableSubscriberStatusFilter] =
		useState({
			page: 1,
			page_size: 50,
			search: "",
			sort_field: "id",
			sort_order: "desc",
			status: "Active",
			role: JSON.stringify(["Cancer Caregiver", "Cancer Care Professional"]),
		});

	const {
		data: dataSourceSubscriberStatus,
		refetch: refetchSourceSubscriberStatus,
	} = GET(
		`api/v1/users?${new URLSearchParams(tableSubscriberStatusFilter)}`,
		"users_active_user_type_list"
	);

	const onChangeTableSubscriberStatus = (pagination, filters, sorter) => {
		setTableSubscriberStatusFilter({
			...tableSubscriberStatusFilter,
			sort_field: sorter.columnKey,
			sort_order: sorter.order ? sorter.order.replace("end", "") : null,
			page: 1,
		});
	};

	useEffect(() => {
		if (dataSourceSubscriberStatus) {
			refetchSourceSubscriberStatus();
		}

		return () => {};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [tableSubscriberStatusFilter]);

	GET(
		`api/v1/stats_chart_subscribers`,
		"stats_chart_subscribers",
		(res) => {
			// console.log("res", res);
			if (res.data) {
				Highcharts.chart("div_chart_subscriber_caregiver", {
					chart: {
						plotBackgroundColor: null,
						plotBorderWidth: null,
						plotShadow: false,
						type: "pie",
						height: 330,
					},
					title: {
						text: null,
					},
					tooltip: {
						formatter: function () {
							// console.log("this", this);
							return `<b>${this.key}: ${Highcharts.numberFormat(
								this.y,
								0,
								"",
								","
							)}`;
						},
					},
					plotOptions: {
						pie: {
							allowPointSelect: true,
							cursor: "pointer",
							dataLabels: {
								enabled: true,
								// format: "<b>{point.name}</b><br>{point.y:.0f}",
								distance: -50,
								formatter: function () {
									// console.log("this", this);
									return `<b style="font-size:16px;">${Highcharts.numberFormat(
										this.y,
										0,
										"",
										","
									)}</b>`;
								},
							},
							showInLegend: true,
						},
					},
					series: [
						{
							name: "CANCERGIVER'S PROGRESS",
							data: res.data.caregiver,
						},
					],
					legend: {
						align: "center",
						verticalAlign: "top",
						layout: "vertical",
						y: 40,
					},
					exporting: {
						buttons: {
							contextButton: {
								align: "center",
								symbolStroke: "#13f4f1",
							},
						},
					},
				});

				Highcharts.chart("div_chart_subscriber_careprofessional", {
					chart: {
						plotBackgroundColor: null,
						plotBorderWidth: null,
						plotShadow: false,
						type: "pie",
						height: 330,
					},
					title: {
						text: null,
					},
					tooltip: {
						formatter: function () {
							// console.log("this", this);
							return `<b>${this.key}: ${Highcharts.numberFormat(
								this.y,
								0,
								"",
								","
							)}`;
						},
					},
					plotOptions: {
						pie: {
							allowPointSelect: true,
							cursor: "pointer",
							dataLabels: {
								enabled: true,
								// format: "<b>{point.name}</b><br>{point.y:.0f}",
								distance: -50,
								formatter: function () {
									// console.log("this", this);
									return `<b style="font-size:16px;">${Highcharts.numberFormat(
										this.y,
										0,
										"",
										","
									)}</b>`;
								},
							},
							showInLegend: true,
						},
					},
					series: [
						{
							name: "CARE PROFESSIONAL'S PROGRESS",
							data: res.data.careprofessional,
						},
					],
					legend: {
						align: "center",
						verticalAlign: "top",
						layout: "vertical",
						y: 40,
					},
					exporting: {
						buttons: {
							contextButton: {
								align: "center",
								symbolStroke: "#13f4f1",
							},
						},
					},
				});
			}
		},
		false
	);

	const [hasCollapse, setHasCollapse] = useState(false);

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
		<Card id="PageStatsSubscribers">
			<Row gutter={[12, 12]}>
				<Col xs={24} sm={24} md={24} lg={hasCollapse ? 16 : 24} xl={16}>
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
							header="SUBSCRIBER STATUS"
							key="1"
							className="accordion bg-darkgray-form m-b-md border "
						>
							<Row gutter={12}>
								<Col xs={24} sm={24} md={24}></Col>
								<Col xs={24} sm={24} md={24}>
									<div className="ant-space-flex-space-between table-size-table-search">
										<div>
											<TablePageSize
												tableFilter={tableSubscriberStatusFilter}
												setTableFilter={setTableSubscriberStatusFilter}
											/>
										</div>
										<div>
											<TableGlobalInputSearch
												tableFilter={tableSubscriberStatusFilter}
												setTableFilter={setTableSubscriberStatusFilter}
											/>
										</div>
									</div>
								</Col>
								<Col xs={24} sm={24} md={24} className="m-t-sm m-b-sm">
									<Table
										className="ant-table-default ant-table-striped"
										dataSource={
											dataSourceSubscriberStatus &&
											dataSourceSubscriberStatus.data.data
										}
										rowKey={(record) => record.id}
										pagination={false}
										bordered={false}
										onChange={onChangeTableSubscriberStatus}
										// rowSelection={{
										//   type: selectionType,
										//   ...rowSelection,
										// }}
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
											title="User Type"
											key="role"
											dataIndex="role"
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
											title="Status"
											key="moduleStatus"
											dataIndex="moduleStatus"
											sorter={true}
										/>
									</Table>
								</Col>
								<Col xs={24} sm={24} md={24}>
									<div className="ant-space-flex-space-between table-entries-table-pagination">
										<TableShowingEntries />
										<TablePagination
											tableFilter={tableSubscriberStatusFilter}
											setTableFilter={setTableSubscriberStatusFilter}
											setPaginationTotal={
												dataSourceSubscriberStatus?.data.total
											}
											showLessItems={true}
											showSizeChanger={false}
										/>
									</div>
								</Col>
							</Row>
						</Collapse.Panel>
					</Collapse>
				</Col>

				<Col xs={24} sm={24} md={24} lg={hasCollapse ? 8 : 24} xl={8}>
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
							header="CAREGIVER'S PROGRESS"
							key="1"
							className="accordion bg-darkgray-form m-b-md border "
						>
							<Row gutter={12}>
								<Col xs={24} sm={24} md={24}>
									<div
										id="div_chart_subscriber_caregiver"
										className="highchart-responsive"
									/>
								</Col>
							</Row>
						</Collapse.Panel>
					</Collapse>

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
							header="CARE PROFESSIONAL'S PROGRESS"
							key="1"
							className="accordion bg-darkgray-form m-b-md border "
						>
							<Row gutter={12}>
								<Col xs={24} sm={24} md={24}>
									<div
										id="div_chart_subscriber_careprofessional"
										className="highchart-responsive"
									/>
								</Col>
							</Row>
						</Collapse.Panel>
					</Collapse>
				</Col>
			</Row>
		</Card>
	);
}
