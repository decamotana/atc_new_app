import React, { useEffect, useState } from "react";
import { Card, Col, Collapse, Row } from "antd";

import Highcharts from "highcharts";
import { Link } from "react-router-dom";
import DashboardModules from "../../Components/DashboardModules";
import highchartsSetOptions from "../../../../providers/highchartsSetOptions";
import { GET } from "../../../../providers/useAxiosQuery";
import percentage from "../../../../providers/percentage";
import moment from "moment";
import $ from "jquery";
import { userData } from "../../../../providers/companyInfo";
// require("highcharts/modules/exporting")(Highcharts);
require("highcharts/modules/boost")(Highcharts);

export default function PageDashboard() {
	const [moduleFilter, setModuleFilter] = useState({
		filter_module_for: "Cancer Caregiver",
		year: moment(userData().created_at).format("YYYY"),
	});

	const { data: dataUserPayment } = GET(
		`api/v1/user_payment`,
		"user_payment_dashboard_list"
	);

	highchartsSetOptions(Highcharts);

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
		<Card className="page-dashboard-caregiver" id="PageDashboard">
			<Row gutter={[12, 12]}>
				<Col xs={24} sm={24} md={24} lg={24} xl={17}>
					<DashboardModules
						moduleFilter={moduleFilter}
						setModuleFilter={setModuleFilter}
						colSm={12}
						colMd={12}
						colLg={hasCollapse ? 6 : 12}
						colXl={hasCollapse ? 8 : 12}
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
