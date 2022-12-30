import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, Col, Collapse, Row, Table, Typography } from "antd";

import Highcharts from "highcharts";
import moment from "moment";
import highchartsSetOptions from "../../../../providers/highchartsSetOptions";
import { GET } from "../../../../providers/useAxiosQuery";
import percentage from "../../../../providers/percentage";
import DashboardModules from "../../Components/DashboardModules";
import { userData } from "../../../../providers/companyInfo";
// require("highcharts/modules/exporting")(Highcharts);
require("highcharts/modules/boost")(Highcharts);

export default function PageDashboard() {
	const [moduleFilter, setModuleFilter] = useState({
		filter_module_for: "Cancer Care Professional",
		year: moment(userData().created_at).format("YYYY"),
	});
	const [referredUserFilter, setReferredUserFilter] = useState({
		page: 1,
		page_size: 50,
		search: "",
		sort_field: "",
		sort_order: "asc",
		referred_by: userData().id,
	});
	const [dataReferredUser, setDataReferredUser] = useState([]);

	highchartsSetOptions(Highcharts);

	const { refetch: refetchData } = GET(
		`api/v1/users?${new URLSearchParams(referredUserFilter)}`,
		"referred_user_dashboard_list",
		(res) => {
			// console.log("referred_user_dashboard_list", res.data);
			if (res.data) {
				let data = res.data.data;
				setDataReferredUser(data);
			}
		}
	);

	const { data: dataUserPayment } = GET(
		`api/v1/user_payment`,
		"user_payment_dashboard_list"
	);

	GET(
		`api/v1/module?${new URLSearchParams(moduleFilter)}`,
		"module_dashboard_list",
		(res) => {
			// console.log("module", res.data);
			if (res.data) {
				let data = [];
				res.data
					.filter(
						(moduleFiltered) =>
							moduleFiltered.lessons &&
							moduleFiltered.lessons.length > 0 &&
							moduleFiltered.lessons.filter(
								(lessonsFilter) =>
									lessonsFilter.questions && lessonsFilter.questions.length > 0
							).length > 0
					)
					.map((itemModule, indexModule) => {
						let questionCount = 0;
						let answerCount = 0;
						let lessons = [];

						itemModule.lessons
							.filter(
								(lessonsFilter) =>
									lessonsFilter.questions && lessonsFilter.questions.length > 0
							)
							.map((itemLesson, indexLesson) => {
								let status = "Up Next";
								let questionsCount = itemLesson.questions.length;

								let userAnswersCount = 0;

								itemLesson.questions.map((itemLessonQuestions) => {
									let itemLessonUserAnswersCount =
										itemLesson.user_answers.filter(
											(userAnswerFilter) =>
												itemLessonQuestions.id ===
													userAnswerFilter.question_id &&
												userAnswerFilter.module_id === itemLesson.module_id &&
												userAnswerFilter.lesson_id === itemLesson.id
										);
									if (itemLessonUserAnswersCount.length > 0) {
										userAnswersCount++;
									}
									return "";
								});

								if (indexLesson === 0) {
									if (questionsCount === userAnswersCount) {
										status = "Completed";
									} else if (
										userAnswersCount !== 0 &&
										questionsCount > userAnswersCount
									) {
										status = "In Progress";
									} else if (userAnswersCount === 0) {
										status = "In Progress";
									}
								}
								if (indexLesson !== 0) {
									if (lessons[indexLesson - 1].status === "Completed") {
										if (questionsCount === userAnswersCount) {
											status = "Completed";
										} else if (
											userAnswersCount !== 0 &&
											questionsCount > userAnswersCount
										) {
											status = "In Progress";
										} else if (userAnswersCount === 0) {
											status = "In Progress";
										}
									} else {
										status = "Up Next";
									}
								}
								lessons.push({
									...itemLesson,
									status,
								});
								questionCount += questionsCount;
								answerCount += userAnswersCount;
								return "";
							});

						let newStatus = "Up Next";
						if (indexModule === 0) {
							if (questionCount === answerCount) {
								newStatus = "Completed";
							} else if (questionCount > answerCount) {
								newStatus = "In Progress";
							}
						}
						if (indexModule !== 0) {
							if (data[indexModule - 1].status === "Completed") {
								if (questionCount === answerCount) {
									newStatus = "Completed";
								} else if (questionCount > answerCount) {
									newStatus = "In Progress";
								} else if (answerCount === 0) {
									newStatus = "In Progress";
								}
							} else {
								newStatus = "Up Next";
							}
						}

						data.push({
							...itemModule,
							questionCount,
							answerCount,
							status: newStatus,
							lessons,
						});

						return "";
					});

				let total = data.length;
				let completed = data.filter(
					(itemFilter) => itemFilter.status === "Completed"
				).length;
				let incomplete = data.filter(
					(itemFilter) => itemFilter.status !== "Completed"
				).length;

				Highcharts.chart("div_module_status", {
					chart: {
						plotBackgroundColor: null,
						plotBorderWidth: null,
						plotShadow: false,
						type: "pie",
						height: 300,
					},
					title: {
						text: null,
					},
					tooltip: {
						formatter: function () {
							return `<b>${this.key}: ${Math.round(this.percentage)}%`;
						},
					},
					accessibility: {
						point: {
							valueSuffix: "%",
						},
					},
					plotOptions: {
						pie: {
							allowPointSelect: true,
							cursor: "pointer",
							dataLabels: {
								enabled: false,
								format: "<b>{point.percentage:.0f}%</b>",
								distance: -50,
							},
							showInLegend: true,
						},
					},
					series: [
						{
							name: "MODULE STATUS",
							colorByPoint: true,
							data: [
								{
									name: "Completed",
									y: percentage(completed, total),
									color: "#027273",
								},
								{
									name: "Incomplete",
									y: percentage(incomplete, total),
									color: "#e4151f",
								},
							],
						},
					],
					legend: {
						align: "center",
						verticalAlign: "top",
						layout: "vertical",
						y: 35,
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
		}
	);

	const onChangeTable = (pagination, filters, sorter) => {
		setReferredUserFilter({
			...referredUserFilter,
			sort_field: sorter.columnKey,
			sort_order: sorter.order ? sorter.order.replace("end", "") : null,
			page: 1,
		});
	};

	useEffect(() => {
		refetchData();

		return () => {};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [referredUserFilter]);

	return (
		<Card className="page-dashboard-care-professional" id="PageDashboard">
			<Row gutter={[12, 12]}>
				<Col xs={24} sm={24} md={24}>
					<Typography.Title level={4} className="color-1 font-normal">
						Subscriptions
					</Typography.Title>
				</Col>
				<Col xs={24} sm={24} md={24} lg={24} xl={17}>
					<Table
						className="ant-table-default ant-table-striped"
						dataSource={dataReferredUser && dataReferredUser}
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
							title="Start Date"
							key="created_at"
							dataIndex="created_at"
							defaultSortOrder="descend"
							sorter={true}
							render={(text, _) =>
								text ? moment(text).format("MM/DD/YYYY") : ""
							}
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
						/>
						<Table.Column
							key="moduleStatus"
							title="Status"
							dataIndex="moduleStatus"
							align="center"
							sorter={true}
							render={(_, record) => {
								let color = "";

								// console.log("record", record);

								if (record.moduleStatus === "In Progress") {
									color = "color-1";
								} else if (record.moduleStatus === "Not Started") {
									color = "color-7";
								} else if (record.moduleStatus === "Completed") {
									color = "color-5";
								}

								return (
									<Typography.Text className={`font-600 ${color}`}>
										{record.moduleStatus}
									</Typography.Text>
								);
							}}
						/>
					</Table>

					<Typography.Title level={4} className="color-1 font-normal m-t-lg">
						My Modules
					</Typography.Title>

					<DashboardModules
						moduleFilter={moduleFilter}
						setModuleFilter={setModuleFilter}
						colSm={12}
					/>
				</Col>

				<Col xs={24} sm={24} md={24} lg={24} xl={7}>
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
							header="MODULE STATUS"
							key="1"
							className="accordion bg-darkgray-form m-b-md border "
						>
							<div id="div_module_status" className="highchart-responsive" />
						</Collapse.Panel>
					</Collapse>

					{dataUserPayment && dataUserPayment.data.length > 0 ? (
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
								header="MY INVOICES"
								key="1"
								className="accordion bg-darkgray-form m-b-md border collapse-recent-invoices"
							>
								<table className="table table-striped m-b-n">
									<thead>
										<tr>
											<th>Invoice</th>
											<th>Date</th>
											<th>Amount</th>
										</tr>
									</thead>
									<tbody>
										{dataUserPayment.data.map((item, index) => {
											let total = item.amount ? parseFloat(item.amount) : 0;

											if (item.coupon) {
												if (item.coupon.type === "fixed") {
													total = parseFloat(item.amount) - item.coupon.off;
												}
												if (item.coupon.type === "percent") {
													var percentage = item.coupon.off / 100;
													total =
														parseFloat(item.amount) -
														parseFloat(item.amount) * percentage;
												}
											}

											return (
												<tr key={index}>
													<td>
														<Link
															className="color-6"
															to={{
																pathname:
																	"/profile/account/payment-and-invoices",
																state: item,
															}}
														>
															#{item.invoice_id}
														</Link>
													</td>
													<td>
														{moment(item.date_paid).format("MMMM DD, YYYY")}
													</td>
													<td>${parseFloat(total).toFixed(2)}</td>
												</tr>
											);
										})}
									</tbody>
								</table>
							</Collapse.Panel>
						</Collapse>
					) : null}
				</Col>
			</Row>
		</Card>
	);
}
