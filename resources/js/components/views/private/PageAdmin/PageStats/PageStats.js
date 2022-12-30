import React, { useEffect, useState } from "react";
import {
	Button,
	Card,
	Col,
	Collapse,
	Form,
	Row,
	Table,
	Tabs,
	Typography,
} from "antd";
import moment from "moment";
import FloatDatePicker from "../../../../providers/FloatDatePicker";
import FloatSelect from "../../../../providers/FloatSelect";
import optionYear from "../../../../providers/optionYear";
import optionMonth from "../../../../providers/optionMonth";
import optionStateCodes from "../../../../providers/optionStateCodes";
import $ from "jquery";
import highchartsSetOptions from "../../../../providers/highchartsSetOptions";
import Highcharts from "highcharts";
import { GET } from "../../../../providers/useAxiosQuery";

import {
	TableGlobalInputSearch,
	TablePageSize,
	TablePagination,
	TableShowingEntries,
} from "../../Components/ComponentTableFilter";

import noDataFoundPng from "../../../../assets/img/no-data-found.jpg";

// require("highcharts/modules/exporting")(Highcharts);
require("highcharts/modules/boost")(Highcharts);

export default function PageStats() {
	const [hasCollapse, setHasCollapse] = useState(false);

	highchartsSetOptions(Highcharts);

	// revenue_graph_per_year
	GET(
		`api/v1/revenue_graph_per_year`,
		"dashboard_revenue_graph_per_year",
		(res) => {
			// console.log("res", res);
			if (res.data) {
				let data = res.data;

				Highcharts.chart("div_revenue_by_year", {
					chart: {
						type: "column",
					},
					title: {
						text: null,
					},
					xAxis: {
						categories: data.data_series_name.reverse(),
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
								this.key
							}</span><br/>TOTAL: <b>$${Highcharts.numberFormat(
								this.y,
								0,
								"",
								","
							)}</b>`;
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
							dataLabels: {
								enabled: false,
								// format: "{point.y:.0f}",
								formatter: function () {
									if (this.y === 0) {
										return null;
									}
									return this.y;
								},
							},
						},
					},
					exporting: {
						enabled: false,
					},
					series: [
						{
							name: "REVENUE BY YEAR",
							data: data.data_series_value.reverse(),
						},
					],
				});
			}
		}
	);
	// end revenue_graph_per_year

	// revenue_per_month
	const [filterRevenuePerMonth, setFilterRevenuePerMonth] = useState({
		year: moment().format("YYYY"),
		month: moment().format("MM"),
	});
	const { refetch: refetchRevenuePerMonth } = GET(
		`api/v1/revenue_per_month?${new URLSearchParams(filterRevenuePerMonth)}`,
		"dashboard_revenue_per_month",
		(res) => {
			// console.log("res", res);
			if (res.data) {
				Highcharts.chart("div_revenue_by_month", {
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
							return `<b>${this.key}: ${this.percentage}%`;
						},
					},
					plotOptions: {
						pie: {
							allowPointSelect: true,
							cursor: "pointer",
							dataLabels: {
								enabled: true,
								distance: -50,
								formatter: function () {
									return `<b style="font-size:16px;">$${Highcharts.numberFormat(
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
					legend: {
						align: "center",
						verticalAlign: "top",
					},
					accessibility: {
						enabled: false,
					},
					series: [
						{
							name: "REVENUE BY MONTH",
							colorByPoint: true,
							data: res.data,
						},
					],
				});
			}
		}
	);

	const handleOnValuesChangePerMonth = (e) => {
		// console.log("handleOnValuesChangePerMonth", e);
		if (e.year) {
			setFilterRevenuePerMonth({
				...filterRevenuePerMonth,
				year: e.year,
			});
		}
		if (e.month) {
			setFilterRevenuePerMonth({
				...filterRevenuePerMonth,
				month: e.month,
			});
		}
	};

	useEffect(() => {
		refetchRevenuePerMonth();

		return () => {};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [filterRevenuePerMonth]);
	// end revenue_per_month

	// revenue_per_state
	const [filterRevenuePerState, setFilterRevenuePerState] = useState({
		type: "ALL",
		state: "AZ",
	});
	const { refetch: refetchRevenuePerState } = GET(
		`api/v1/revenue_per_state?${new URLSearchParams(filterRevenuePerState)}`,
		"dashboard_revenue_per_state",
		(res) => {
			// console.log("res", res);
			if (res.data) {
				Highcharts.chart("div_revenue_by_state", {
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
							// console.log("this", this);
							return `<b>${this.key}: ${this.percentage}%`;
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
									return `<b style="font-size:16px;">$${Highcharts.numberFormat(
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
					legend: {
						align: "center",
						verticalAlign: "top",
					},
					series: [
						{
							name: "REVENUE BY STATE",
							colorByPoint: true,
							data: res.data,
						},
					],
				});
			}
		}
	);

	const handleOnValuesChangePerState = (e) => {
		// console.log("handleOnValuesChangePerState", e);
		if (e.type) {
			setFilterRevenuePerState({
				...filterRevenuePerState,
				type: e.type,
			});
		}
		if (e.state) {
			setFilterRevenuePerState({
				...filterRevenuePerState,
				state: e.state,
			});
		}
	};

	useEffect(() => {
		refetchRevenuePerState();

		return () => {};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [filterRevenuePerState]);
	// end revenue_per_state

	// questionaire
	const [dataSourceQuestionaire, setDataSourceQuestionaire] = useState([]);
	GET(`api/v1/questionaire_result`, "questionaire_result", (res) => {
		// console.log("questionaire_result data", res);
		if (res.data) {
			let tempDataSourceQuestinaire = res.data.map((item) => {
				let lessons = item.lessons.map((item2) => {
					let questions = item2.questions.map((item3) => {
						let questionAnswerRes = handleQuestionAnswer(item3);
						let tempItem3 = { ...item3, questionAnswerRes };
						return tempItem3;
					});
					let tempItem2 = {
						...item2,
						questions,
					};
					return tempItem2;
				});
				let tempItem = {
					...item,
					lessons,
				};
				// console.log("tempItem", tempItem);
				return tempItem;
			});

			// console.log("tempDataSourceQuestinaire", tempDataSourceQuestinaire);
			setDataSourceQuestionaire(tempDataSourceQuestinaire);
		}
	});
	// end questionaire

	// Subscriber Status
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
	const [dataSourceSubscriberStatus, setDataSourceSubscriberStatus] = useState(
		[]
	);

	const { refetch: refetchSourceSubscriberStatus } = GET(
		`api/v1/users?${new URLSearchParams(tableSubscriberStatusFilter)}`,
		"users_active_user_type_list",
		(res) => {
			if (res.data) {
				// console.log("users res.data", res);
				setDataSourceSubscriberStatus(res.data);
			}
		}
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
		refetchSourceSubscriberStatus();

		return () => {};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [tableSubscriberStatusFilter]);
	// end Subscriber Status

	// User Type
	const [tableUserTypeFilter, setTableUserTypeFilter] = useState({
		page: 1,
		page_size: 50,
		search: "",
		sort_field: "id",
		sort_order: "desc",
		status: "Active",
		role: JSON.stringify(["Cancer Caregiver", "Cancer Care Professional"]),
	});
	const [dataSourceUserType, setDataSourceUserType] = useState([]);

	const { refetch: refetchSourceUserType } = GET(
		`api/v1/users?${new URLSearchParams(tableUserTypeFilter)}`,
		"users_active_user_type_list",
		(res) => {
			if (res.data) {
				// console.log("users res.data", res);
				setDataSourceUserType(res.data);
			}
		}
	);

	const onChangeTableUserType = (pagination, filters, sorter) => {
		setTableUserTypeFilter({
			...tableUserTypeFilter,
			sort_field: sorter.columnKey,
			sort_order: sorter.order ? sorter.order.replace("end", "") : null,
			page: 1,
		});
	};

	useEffect(() => {
		refetchSourceUserType();

		return () => {};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [tableUserTypeFilter]);
	// end User Type

	// revenue_all
	const [filterRevenueAll, setFilterRevenueAll] = useState({
		date_start: "2021-01-01",
		date_end: moment().format("YYYY-MM-DD"),
		type: "ALL",
	});
	const { data: dataRevenueAll, refetch: refetchRevenueAll } = GET(
		`api/v1/revenue_all?${new URLSearchParams(filterRevenueAll)}`,
		"dashboard_revenue_all",
		(res) => {
			// console.log("res", res);
		}
	);

	const handleOnValuesChangeAll = (e) => {
		// console.log("handleOnValuesChange", e);
		if (e.date_start) {
			setFilterRevenueAll({
				...filterRevenueAll,
				date_start: moment(e.date_start).format("YYYY-MM-DD"),
			});
		}
		if (e.date_end) {
			setFilterRevenueAll({
				...filterRevenueAll,
				date_end: moment(e.date_end).format("YYYY-MM-DD"),
			});
		}
		if (e.type) {
			setFilterRevenueAll({
				...filterRevenueAll,
				type: e.type,
			});
		}
	};

	useEffect(() => {
		refetchRevenueAll();

		return () => {};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [filterRevenueAll]);
	// end revenue_all

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

	const handleQuestionAnswer = (questions) => {
		let question_options = [];

		questions.question_options.map((questionOptionItem) => {
			// console.log("questionOptionItem", questionOptionItem);
			if (
				questionOptionItem.question.question_type === "Multiple Choice" ||
				questionOptionItem.question.question_type === "True/False" ||
				questionOptionItem.question.question_type === "Yes/No" ||
				questionOptionItem.question.question_type === "Rating"
			) {
				let counter = 0;
				questions.user_answer
					.filter(
						(userAnswerFilter) =>
							userAnswerFilter.question_id === questionOptionItem.question_id &&
							parseInt(userAnswerFilter.answer) === questionOptionItem.id
					)
					.map((questionUserAnswerItem) => {
						// console.log("questionUserAnswerItem", questionUserAnswerItem);
						counter++;
						return "";
					});
				question_options.push({
					name: questionOptionItem.option,
					y: counter,
				});
			} else if (questionOptionItem.question.question_type === "Open Answer") {
				let counter = 0;
				questions.user_answer
					.filter(
						(userAnswerFilter) =>
							userAnswerFilter.question_id === questionOptionItem.question_id &&
							userAnswerFilter.answer === questionOptionItem.option
					)
					.map((questionUserAnswerItem) => {
						// console.log("questionUserAnswerItem", questionUserAnswerItem);
						counter++;
						return "";
					});
				question_options.push({
					name: questionOptionItem.option,
					y: counter,
				});
			} else if (
				questionOptionItem.question.question_type === "Fill in the Blank"
			) {
				let counter = 0;
				questions.user_answer
					.filter(
						(userAnswerFilter) =>
							userAnswerFilter.question_id === questionOptionItem.question_id &&
							userAnswerFilter.answer.includes(questionOptionItem.option)
					)
					.map((questionUserAnswerItem) => {
						// console.log("questionUserAnswerItem", questionUserAnswerItem);
						counter++;
						return "";
					});
				question_options.push({
					name: questionOptionItem.option,
					y: counter,
				});
			}
			return "";
		});

		return question_options;
	};

	const handleChangeTabQuestionaire = (key) => {
		// console.log("key", key);
		if (key === "1") {
		} else if (key === "2") {
			let dataSourceQuestionaireFiltered = dataSourceQuestionaire.filter(
				(questionaireFilter) =>
					questionaireFilter.module_for === "Cancer Care Professional" &&
					questionaireFilter.lessons &&
					questionaireFilter.lessons.length > 0 &&
					questionaireFilter.lessons.filter(
						(lessonsFilter) =>
							lessonsFilter.questions && lessonsFilter.questions.length > 0
					).length > 0
			);
			dataSourceQuestionaireFiltered.length > 0 &&
				dataSourceQuestionaireFiltered.map((item, index) => {
					item.lessons
						.filter(
							(lessonsFilter) =>
								lessonsFilter.questions && lessonsFilter.questions.length > 0
						)
						.map((lessonsItem, lessonsIndex) => {
							lessonsItem.questions.map((questionsItem, questionsIndex) => {
								// console.log("questionsItem", questionsItem);
								let questionAnswerRes = handleQuestionAnswer(questionsItem);
								if (index === 0) {
									setTimeout(() => {
										Highcharts.chart(`pro_question_chart_${questionsItem.id}`, {
											chart: {
												plotBackgroundColor: null,
												plotBorderWidth: null,
												plotShadow: false,
												type: "pie",
												height: 200,
											},
											title: {
												text: null,
											},
											tooltip: {
												formatter: function () {
													return `<b>${this.key}: ${this.percentage}%`;
												},
											},
											plotOptions: {
												pie: {
													allowPointSelect: true,
													cursor: "pointer",
													dataLabels: {
														enabled: true,
														distance: -50,
														formatter: function () {
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
											legend: {
												align: "center",
												verticalAlign: "top",
											},
											accessibility: {
												enabled: false,
											},
											series: [
												{
													name: questionsItem.question,
													colorByPoint: true,
													data: questionAnswerRes,
												},
											],
										});
									}, 5000);
								}
								return "";
							});
							return "";
						});
					return "";
				});
		}
	};

	return (
		<Card id="PageStats">
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
							header="REVENUE"
							key="1"
							className="accordion bg-darkgray-form m-b-md border bgcolor-1 white"
						>
							<Row gutter={[12, 12]}>
								<Col xs={24} sm={24} md={24}>
									<div
										id="div_revenue_by_year"
										style={{
											display: "flex",
											justifyContent: "center",
											width: "100%",
										}}
									></div>
								</Col>
								<Col xs={24} sm={24} md={hasCollapse ? 24 : 12}>
									<Typography.Title level={4} className="color-1">
										REVENUE BY MONTH
									</Typography.Title>

									<Form
										initialValues={{
											year: moment().format("YYYY"),
											month: moment().format("MM"),
										}}
										onValuesChange={handleOnValuesChangePerMonth}
									>
										<Row gutter={8}>
											<Col xs={24} sm={12} md={12}>
												<Form.Item name="year" className="form-select-error">
													<FloatSelect
														label="Year"
														placeholder="Year"
														options={optionYear}
													/>
												</Form.Item>
											</Col>
											<Col xs={24} sm={12} md={12}>
												<Form.Item name="month" className="form-select-error">
													<FloatSelect
														label="Month"
														placeholder="Month"
														options={optionMonth}
													/>
												</Form.Item>
											</Col>
											<Col xs={24} sm={24} md={24}>
												<div
													id="div_revenue_by_month"
													className="highchart-responsive"
												/>
											</Col>
										</Row>
									</Form>
								</Col>
								<Col xs={24} sm={24} md={hasCollapse ? 24 : 12}>
									<Typography.Title level={4} className="color-1">
										REVENUE BY STATE
									</Typography.Title>

									<Form
										initialValues={{
											type: "ALL",
											state: "AZ",
										}}
										onValuesChange={handleOnValuesChangePerState}
									>
										<Row gutter={8}>
											<Col xs={24} sm={12} md={12}>
												<Form.Item
													name="type"
													className="m-b-sm form-select-error"
													hasFeedback
													rules={[
														{
															required: true,
															message: "This field is required.",
														},
													]}
												>
													<FloatSelect
														label="Select"
														placeholder="Select"
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
											<Col xs={24} sm={12} md={12}>
												<Form.Item name="state" className="form-select-error">
													<FloatSelect
														label="State"
														placeholder="State"
														options={optionStateCodes}
													/>
												</Form.Item>
											</Col>
											<Col xs={24} sm={24} md={24}>
												<div
													id="div_revenue_by_state"
													className="highchart-responsive"
												/>
											</Col>
										</Row>
									</Form>
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
							header="QUESTIONAIRE RESULTS"
							key="1"
							className="accordion bg-darkgray-form m-b-md border "
						>
							<Tabs
								defaultActiveKey="1"
								type="card"
								size="large"
								className="tab-stats-questionaire-result"
								onChange={handleChangeTabQuestionaire}
							>
								<Tabs.TabPane tab="Cancer Caregiver" key="1">
									{dataSourceQuestionaire.filter(
										(questionaireFilter) =>
											questionaireFilter.module_for === "Cancer Caregiver" &&
											questionaireFilter.lessons &&
											questionaireFilter.lessons.length > 0 &&
											questionaireFilter.lessons.filter(
												(lessonsFilter) =>
													lessonsFilter.questions &&
													lessonsFilter.questions.length > 0
											).length > 0
									).length > 0 ? (
										dataSourceQuestionaire
											.filter(
												(questionaireFilter) =>
													questionaireFilter.module_for ===
														"Cancer Caregiver" &&
													questionaireFilter.lessons &&
													questionaireFilter.lessons.length > 0 &&
													questionaireFilter.lessons.filter(
														(lessonsFilter) =>
															lessonsFilter.questions &&
															lessonsFilter.questions.length > 0
													).length > 0
											)
											.map((item, index) => {
												return (
													<Collapse
														className="main-1-collapse border-none"
														expandIcon={({ isActive }) =>
															isActive ? (
																<span
																	className="ant-menu-submenu-arrow"
																	style={{
																		color: "#FFF",
																		transform: "rotate(270deg)",
																	}}
																></span>
															) : (
																<span
																	className="ant-menu-submenu-arrow"
																	style={{
																		color: "#FFF",
																		transform: "rotate(90deg)",
																	}}
																></span>
															)
														}
														defaultActiveKey={index === 0 ? [index] : []}
														expandIconPosition="start"
														key={index}
														onChange={(e) => {
															let questions = [];

															item.lessons
																.filter(
																	(lessonsFilter) =>
																		lessonsFilter.questions &&
																		lessonsFilter.questions.length > 0
																)
																.map((lessonsItem) => {
																	let questionsItems =
																		lessonsItem.questions.reduce((a2, b2) => {
																			a2.push(b2);
																			return a2;
																		}, []);
																	// console.log("questionsItems", questionsItems);
																	questions.push(...questionsItems);
																	return "";
																});

															setTimeout(() => {
																questions.map((questionItem, questionIndex) => {
																	// console.log("questionItem", questionItem);
																	let questionAnswerRes =
																		handleQuestionAnswer(questionItem);
																	Highcharts.chart(
																		`question_chart_${questionItem.id}`,
																		{
																			chart: {
																				plotBackgroundColor: null,
																				plotBorderWidth: null,
																				plotShadow: false,
																				type: "pie",
																				height: 200,
																			},
																			title: {
																				text: null,
																			},
																			tooltip: {
																				formatter: function () {
																					return `<b>${this.key}: ${this.percentage}%`;
																				},
																			},
																			plotOptions: {
																				pie: {
																					allowPointSelect: true,
																					cursor: "pointer",
																					dataLabels: {
																						enabled: true,
																						distance: -50,
																						formatter: function () {
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
																			legend: {
																				align: "center",
																				verticalAlign: "top",
																			},
																			accessibility: {
																				enabled: false,
																			},
																			series: [
																				{
																					name: "Question " + questionIndex,
																					colorByPoint: true,
																					data: questionAnswerRes,
																				},
																			],
																		}
																	);
																	return "";
																});
															}, 1000);
														}}
													>
														<Collapse.Panel
															header={item.module_number}
															key={index}
															className="accordion bg-darkgray-form m-b-md border "
														>
															<Typography.Title level={5} className="m-b-lg">
																{`${item.module_name} - ${item.module_for}`}
															</Typography.Title>

															{item.lessons
																.filter(
																	(lessonsFilter) =>
																		lessonsFilter.questions &&
																		lessonsFilter.questions.length > 0
																)
																.map((lessonsItem, lessonsIndex) => {
																	return (
																		<Collapse
																			className="main-1-collapse border-none"
																			expandIcon={({ isActive }) =>
																				isActive ? (
																					<span
																						className="ant-menu-submenu-arrow"
																						style={{
																							color: "#FFF",
																							transform: "rotate(270deg)",
																						}}
																					></span>
																				) : (
																					<span
																						className="ant-menu-submenu-arrow"
																						style={{
																							color: "#FFF",
																							transform: "rotate(90deg)",
																						}}
																					></span>
																				)
																			}
																			defaultActiveKey={["1"]}
																			expandIconPosition="start"
																			key={`${index}-${lessonsIndex}`}
																		>
																			<Collapse.Panel
																				header={`${lessonsItem.lesson_number}`}
																				key="1"
																				className="accordion bg-darkgray-form m-b-md border "
																			>
																				<Typography.Title
																					level={5}
																					className="m-b-lg"
																				>
																					{`${lessonsItem.lesson_name}`}
																				</Typography.Title>

																				{lessonsItem.questions.map(
																					(questionsItem, questionsIndex) => {
																						// console.log(
																						// 	`questionsItem`,
																						// 	questionsItem
																						// );
																						let questionAnswerRes =
																							handleQuestionAnswer(
																								questionsItem
																							);
																						// console.log(
																						// 	"questionAnswerRes",
																						// 	questionAnswerRes
																						// );

																						if (index === 0) {
																							setTimeout(() => {
																								let question_chart =
																									document.getElementById(
																										`question_chart_${questionsItem.id}`
																									);
																								if (question_chart) {
																									Highcharts.chart(
																										`question_chart_${questionsItem.id}`,
																										{
																											chart: {
																												plotBackgroundColor:
																													null,
																												plotBorderWidth: null,
																												plotShadow: false,
																												type: "pie",
																												height: 200,
																											},
																											title: {
																												text: null,
																											},
																											tooltip: {
																												formatter: function () {
																													return `<b>${this.key}: ${this.percentage}%`;
																												},
																											},
																											plotOptions: {
																												pie: {
																													allowPointSelect: true,
																													cursor: "pointer",
																													dataLabels: {
																														enabled: true,
																														distance: -50,
																														formatter:
																															function () {
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
																											legend: {
																												align: "center",
																												verticalAlign: "top",
																											},
																											accessibility: {
																												enabled: false,
																											},
																											series: [
																												{
																													name: questionsItem.question,
																													colorByPoint: true,
																													data: questionAnswerRes,
																												},
																											],
																										}
																									);
																								}
																							}, 3000);
																						}

																						return (
																							<Collapse
																								className="main-1-collapse border-none"
																								expandIcon={({ isActive }) =>
																									isActive ? (
																										<span
																											className="ant-menu-submenu-arrow"
																											style={{
																												color: "#FFF",
																												transform:
																													"rotate(270deg)",
																											}}
																										></span>
																									) : (
																										<span
																											className="ant-menu-submenu-arrow"
																											style={{
																												color: "#FFF",
																												transform:
																													"rotate(90deg)",
																											}}
																										></span>
																									)
																								}
																								defaultActiveKey={["1"]}
																								expandIconPosition="start"
																								key={`${index}-${lessonsIndex}-${questionsIndex}`}
																							>
																								<Collapse.Panel
																									header={`Question ${
																										questionsIndex + 1
																									}`}
																									key="1"
																									className="accordion bg-darkgray-form m-b-md border "
																								>
																									<Row gutter={[12, 12]}>
																										<Col
																											xs={24}
																											sm={24}
																											md={24}
																											lg={12}
																										>
																											<Row>
																												<Col xs={8}>
																													<Typography.Title
																														level={5}
																													>
																														Question Type:
																													</Typography.Title>
																												</Col>
																												<Col xs={16}>
																													<Typography.Title
																														level={5}
																													>
																														{
																															questionsItem.question_type
																														}
																													</Typography.Title>
																												</Col>
																											</Row>
																											<Row>
																												<Col xs={8}>
																													<Typography.Title
																														level={5}
																													>
																														Question:
																													</Typography.Title>
																												</Col>
																												<Col xs={16}>
																													<Typography.Title
																														level={5}
																													>
																														<span
																															dangerouslySetInnerHTML={{
																																__html:
																																	questionsItem.question,
																															}}
																														/>
																													</Typography.Title>
																												</Col>
																											</Row>
																											<Row>
																												<Col xs={8}>
																													<Typography.Title
																														level={5}
																													>
																														Question Option:
																													</Typography.Title>
																												</Col>
																												<Col xs={16}>
																													{questionsItem
																														.question_options
																														.length > 0
																														? questionsItem.question_options.map(
																																(
																																	questionOptionItem,
																																	questionOptionIndex
																																) => {
																																	if (
																																		parseInt(
																																			questionOptionItem.status
																																		) === 1
																																	) {
																																		return (
																																			<div
																																				key={
																																					questionOptionIndex
																																				}
																																			>
																																				<Typography.Text
																																					strong
																																				>
																																					{
																																						questionOptionItem.option
																																					}
																																				</Typography.Text>
																																			</div>
																																		);
																																	} else {
																																		return (
																																			<div
																																				key={
																																					questionOptionIndex
																																				}
																																			>
																																				<Typography.Text>
																																					{
																																						questionOptionItem.option
																																					}
																																				</Typography.Text>
																																			</div>
																																		);
																																	}
																																}
																														  )
																														: null}
																												</Col>
																											</Row>
																										</Col>
																										<Col
																											xs={24}
																											sm={24}
																											md={24}
																											lg={12}
																										>
																											<div
																												id={`question_chart_${questionsItem.id}`}
																												className="highchart-responsive"
																											/>
																										</Col>
																									</Row>
																								</Collapse.Panel>
																							</Collapse>
																						);
																					}
																				)}
																			</Collapse.Panel>
																		</Collapse>
																	);
																})}
														</Collapse.Panel>
													</Collapse>
												);
											})
									) : (
										<img
											alt="no data found"
											src={noDataFoundPng}
											style={{ width: "100%" }}
										/>
									)}
								</Tabs.TabPane>
								<Tabs.TabPane tab="Cancer Care Professional" key="2">
									{dataSourceQuestionaire.filter(
										(questionaireFilter) =>
											questionaireFilter.module_for ===
												"Cancer Care Professional" &&
											questionaireFilter.lessons &&
											questionaireFilter.lessons.length > 0 &&
											questionaireFilter.lessons.filter(
												(lessonsFilter) =>
													lessonsFilter.questions &&
													lessonsFilter.questions.length > 0
											).length > 0
									).length > 0 ? (
										dataSourceQuestionaire
											.filter(
												(questionaireFilter) =>
													questionaireFilter.module_for ===
														"Cancer Care Professional" &&
													questionaireFilter.lessons &&
													questionaireFilter.lessons.length > 0 &&
													questionaireFilter.lessons.filter(
														(lessonsFilter) =>
															lessonsFilter.questions &&
															lessonsFilter.questions.length > 0
													).length > 0
											)
											.map((item, index) => {
												return (
													<Collapse
														className="main-1-collapse border-none"
														expandIcon={({ isActive }) =>
															isActive ? (
																<span
																	className="ant-menu-submenu-arrow"
																	style={{
																		color: "#FFF",
																		transform: "rotate(270deg)",
																	}}
																></span>
															) : (
																<span
																	className="ant-menu-submenu-arrow"
																	style={{
																		color: "#FFF",
																		transform: "rotate(90deg)",
																	}}
																></span>
															)
														}
														defaultActiveKey={index === 0 ? [index] : []}
														expandIconPosition="start"
														key={index}
														onChange={() => {
															let questions = [];

															item.lessons
																.filter(
																	(lessonsFilter) =>
																		lessonsFilter.questions &&
																		lessonsFilter.questions.length > 0
																)
																.map((lessonsItem) => {
																	let questionsItems =
																		lessonsItem.questions.reduce((a2, b2) => {
																			a2.push(b2);
																			return a2;
																		}, []);
																	// console.log("questionsItems", questionsItems);
																	questions.push(...questionsItems);
																	return "";
																});

															setTimeout(() => {
																questions.map((questionItem, questionIndex) => {
																	// console.log("questionItem", questionItem);
																	let questionAnswerRes =
																		handleQuestionAnswer(questionItem);

																	Highcharts.chart(
																		`pro_question_chart_${questionItem.id}`,
																		{
																			chart: {
																				plotBackgroundColor: null,
																				plotBorderWidth: null,
																				plotShadow: false,
																				type: "pie",
																				height: 200,
																			},
																			title: {
																				text: null,
																			},
																			tooltip: {
																				formatter: function () {
																					return `<b>${this.key}: ${this.percentage}%`;
																				},
																			},
																			plotOptions: {
																				pie: {
																					allowPointSelect: true,
																					cursor: "pointer",
																					dataLabels: {
																						enabled: true,
																						distance: -50,
																						formatter: function () {
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
																			legend: {
																				align: "center",
																				verticalAlign: "top",
																			},
																			accessibility: {
																				enabled: false,
																			},
																			series: [
																				{
																					name: "Question " + questionIndex,
																					colorByPoint: true,
																					data: questionAnswerRes,
																				},
																			],
																		}
																	);
																	return "";
																});
															}, 1000);
														}}
													>
														<Collapse.Panel
															header={item.module_number}
															key={index}
															className="accordion bg-darkgray-form m-b-md border "
														>
															<Typography.Title level={5} className="m-b-lg">
																{`${item.module_name} - ${item.module_for}`}
															</Typography.Title>

															{item.lessons
																.filter(
																	(lessonsFilter) =>
																		lessonsFilter.questions &&
																		lessonsFilter.questions.length > 0
																)
																.map((lessonsItem, lessonsIndex) => {
																	return (
																		<Collapse
																			className="main-1-collapse border-none"
																			expandIcon={({ isActive }) =>
																				isActive ? (
																					<span
																						className="ant-menu-submenu-arrow"
																						style={{
																							color: "#FFF",
																							transform: "rotate(270deg)",
																						}}
																					></span>
																				) : (
																					<span
																						className="ant-menu-submenu-arrow"
																						style={{
																							color: "#FFF",
																							transform: "rotate(90deg)",
																						}}
																					></span>
																				)
																			}
																			defaultActiveKey={["1"]}
																			expandIconPosition="start"
																			key={`${index}-${lessonsIndex}`}
																		>
																			<Collapse.Panel
																				header={`${lessonsItem.lesson_number}`}
																				key="1"
																				className="accordion bg-darkgray-form m-b-md border "
																			>
																				<Typography.Title
																					level={5}
																					className="m-b-lg"
																				>
																					{`${lessonsItem.lesson_name}`}
																				</Typography.Title>

																				{lessonsItem.questions.map(
																					(questionsItem, questionsIndex) => {
																						let questionAnswerRes =
																							handleQuestionAnswer(
																								questionsItem
																							);
																						// console.log(
																						// 	"questionsItem",
																						// 	lessonsItem.questions,
																						// 	questionsItem
																						// );
																						if (index === 0) {
																							setTimeout(() => {
																								Highcharts.chart(
																									`pro_question_chart_${questionsItem.id}`,
																									{
																										chart: {
																											plotBackgroundColor: null,
																											plotBorderWidth: null,
																											plotShadow: false,
																											type: "pie",
																											height: 200,
																										},
																										title: {
																											text: null,
																										},
																										tooltip: {
																											formatter: function () {
																												return `<b>${this.key}: ${this.percentage}%`;
																											},
																										},
																										plotOptions: {
																											pie: {
																												allowPointSelect: true,
																												cursor: "pointer",
																												dataLabels: {
																													enabled: true,
																													distance: -50,
																													formatter:
																														function () {
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
																										legend: {
																											align: "center",
																											verticalAlign: "top",
																										},
																										accessibility: {
																											enabled: false,
																										},
																										series: [
																											{
																												name: questionsItem.question,
																												colorByPoint: true,
																												data: questionAnswerRes,
																											},
																										],
																									}
																								);
																							}, 10000);
																						}

																						return (
																							<Collapse
																								className="main-1-collapse border-none"
																								expandIcon={({ isActive }) =>
																									isActive ? (
																										<span
																											className="ant-menu-submenu-arrow"
																											style={{
																												color: "#FFF",
																												transform:
																													"rotate(270deg)",
																											}}
																										></span>
																									) : (
																										<span
																											className="ant-menu-submenu-arrow"
																											style={{
																												color: "#FFF",
																												transform:
																													"rotate(90deg)",
																											}}
																										></span>
																									)
																								}
																								defaultActiveKey={["1"]}
																								expandIconPosition="start"
																								key={`${index}-${lessonsIndex}-${questionsIndex}`}
																							>
																								<Collapse.Panel
																									header={`Question ${
																										questionsIndex + 1
																									}`}
																									key="1"
																									className="accordion bg-darkgray-form m-b-md border "
																								>
																									<Row gutter={[12, 12]}>
																										<Col
																											xs={24}
																											sm={24}
																											md={24}
																											lg={12}
																										>
																											<Row>
																												<Col xs={8}>
																													<Typography.Title
																														level={5}
																													>
																														Question Type:
																													</Typography.Title>
																												</Col>
																												<Col xs={16}>
																													<Typography.Title
																														level={5}
																													>
																														{
																															questionsItem.question_type
																														}
																													</Typography.Title>
																												</Col>
																											</Row>
																											<Row>
																												<Col xs={8}>
																													<Typography.Title
																														level={5}
																													>
																														Question:
																													</Typography.Title>
																												</Col>
																												<Col xs={16}>
																													<Typography.Title
																														level={5}
																													>
																														<span
																															dangerouslySetInnerHTML={{
																																__html:
																																	questionsItem.question,
																															}}
																														/>
																													</Typography.Title>
																												</Col>
																											</Row>
																											<Row>
																												<Col xs={8}>
																													<Typography.Title
																														level={5}
																													>
																														Question Option:
																													</Typography.Title>
																												</Col>
																												<Col xs={16}>
																													{questionsItem
																														.question_options
																														.length > 0
																														? questionsItem.question_options.map(
																																(
																																	questionOptionItem,
																																	questionOptionIndex
																																) => {
																																	if (
																																		parseInt(
																																			questionOptionItem.status
																																		) === 1
																																	) {
																																		return (
																																			<div
																																				key={
																																					questionOptionIndex
																																				}
																																			>
																																				<Typography.Text
																																					strong
																																				>
																																					{
																																						questionOptionItem.option
																																					}
																																				</Typography.Text>
																																			</div>
																																		);
																																	} else {
																																		return (
																																			<div
																																				key={
																																					questionOptionIndex
																																				}
																																			>
																																				<Typography.Text>
																																					{
																																						questionOptionItem.option
																																					}
																																				</Typography.Text>
																																			</div>
																																		);
																																	}
																																}
																														  )
																														: null}
																												</Col>
																											</Row>
																										</Col>
																										<Col
																											xs={24}
																											sm={24}
																											md={24}
																											lg={12}
																										>
																											<div
																												id={`pro_question_chart_${questionsItem.id}`}
																												className="highchart-responsive"
																											/>
																										</Col>
																									</Row>
																								</Collapse.Panel>
																							</Collapse>
																						);
																					}
																				)}
																			</Collapse.Panel>
																		</Collapse>
																	);
																})}
														</Collapse.Panel>
													</Collapse>
												);
											})
									) : (
										<img
											alt="no data found"
											src={noDataFoundPng}
											style={{ width: "100%" }}
										/>
									)}
								</Tabs.TabPane>
							</Tabs>
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
											dataSourceSubscriberStatus.data
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
													<Button type="link" className="color-1">
														{text}
													</Button>
												);
											}}
										/>
										<Table.Column
											title="First Name"
											key="lastname"
											dataIndex="lastname"
											sorter={true}
											render={(text, record) => {
												return (
													<Button type="link" className="color-1">
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
											setPaginationTotal={dataSourceSubscriberStatus.total}
											showLessItems={true}
											showSizeChanger={false}
										/>
									</div>
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
							header="USER TYPES"
							key="1"
							className="accordion bg-darkgray-form m-b-md border "
						>
							<Row gutter={12}>
								<Col xs={24} sm={24} md={24}>
									<div className="ant-space-flex-space-between table-size-table-search">
										<div>
											<TablePageSize
												tableFilter={tableUserTypeFilter}
												setTableFilter={setTableUserTypeFilter}
											/>
										</div>
										<div>
											<TableGlobalInputSearch
												tableFilter={tableUserTypeFilter}
												setTableFilter={setTableUserTypeFilter}
											/>
										</div>
									</div>
								</Col>
								<Col xs={24} sm={24} md={24} className="m-t-sm m-b-sm">
									<Table
										className="ant-table-default ant-table-striped"
										dataSource={dataSourceUserType && dataSourceUserType.data}
										rowKey={(record) => record.id}
										pagination={false}
										bordered={false}
										// rowSelection={{
										//   type: selectionType,
										//   ...rowSelection,
										// }}
										onChange={onChangeTableUserType}
										scroll={{ x: "max-content" }}
									>
										<Table.Column
											title="Last Name"
											key="lastname"
											dataIndex="lastname"
											sorter={true}
											render={(text, record) => {
												return (
													<Button type="link" className="color-1">
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
													<Button type="link" className="color-1">
														{text}
													</Button>
												);
											}}
										/>
										<Table.Column
											title="Type"
											key="role"
											dataIndex="role"
											sorter={true}
										/>
									</Table>
								</Col>
								<Col xs={24} sm={24} md={24}>
									<div className="ant-space-flex-space-between table-entries-table-pagination">
										<TableShowingEntries />
										<TablePagination
											tableFilter={tableUserTypeFilter}
											setTableFilter={setTableUserTypeFilter}
											setPaginationTotal={dataSourceUserType.total}
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
							header="REVENUE"
							key="1"
							className="accordion bg-darkgray-form m-b-md border "
						>
							<Form
								initialValues={{
									date_start: moment(1, "DD"),
									date_end: moment(),
									type: "ALL",
								}}
								onValuesChange={handleOnValuesChangeAll}
							>
								<Row gutter={8}>
									<Col
										xs={24}
										sm={8}
										md={8}
										lg={8}
										xl={hasCollapse ? 8 : 24}
										xxl={8}
									>
										<Form.Item name="date_start">
											<FloatDatePicker
												label="Date Start"
												placeholder="Date Start"
												format="MM/DD/YYYY"
											/>
										</Form.Item>
									</Col>
									<Col
										xs={24}
										sm={8}
										md={8}
										lg={8}
										xl={hasCollapse ? 8 : 24}
										xxl={8}
									>
										<Form.Item name="date_end">
											<FloatDatePicker
												label="Date End"
												placeholder="Date End"
												format="MM/DD/YYYY"
											/>
										</Form.Item>
									</Col>
									<Col
										xs={24}
										sm={8}
										md={8}
										lg={8}
										xl={hasCollapse ? 8 : 24}
										xxl={8}
									>
										<Form.Item
											name="type"
											className="m-b-sm form-select-error"
											hasFeedback
											rules={[
												{
													required: true,
													message: "This field is required.",
												},
											]}
										>
											<FloatSelect
												label="Select"
												placeholder="Select"
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
								</Row>
							</Form>

							<Typography.Text strong>
								TOTAL: ${dataRevenueAll?.data}
							</Typography.Text>
						</Collapse.Panel>
					</Collapse>
				</Col>
			</Row>
		</Card>
	);
}
