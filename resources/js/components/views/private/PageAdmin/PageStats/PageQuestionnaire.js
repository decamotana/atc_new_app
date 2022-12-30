import { useEffect, useState } from "react";
import { Card, Col, Collapse, Row, Tabs, Typography } from "antd";
import { GET } from "../../../../providers/useAxiosQuery";
import $ from "jquery";
import highchartsSetOptions from "../../../../providers/highchartsSetOptions";
import Highcharts from "highcharts";
import noDataFoundPng from "../../../../assets/img/no-data-found.jpg";

export default function PageQuestionnaire() {
	highchartsSetOptions(Highcharts);

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

	const handleQuestionAnswer = (questions) => {
		let question_options = [];

		questions.question_options.map(
			(questionOptionItem, questionOptionIndex) => {
				// console.log("questionOptionItem", questionOptionItem);
				if (
					questionOptionItem.question.question_type === "Multiple Choice" ||
					questionOptionItem.question.question_type === "True/False" ||
					questionOptionItem.question.question_type === "Yes/No" ||
					questionOptionItem.question.question_type === "Rating"
				) {
					let counter = questions.user_answer.filter(
						(userAnswerFilter) =>
							userAnswerFilter.question_id === questionOptionItem.question_id &&
							parseInt(userAnswerFilter.answer) === questionOptionItem.id
					).length;
					question_options.push({
						name: questionOptionItem.option
							? questionOptionItem.option
							: questionOptionIndex + 1,
						y: counter,
					});
				} else if (
					questionOptionItem.question.question_type === "Open Answer"
				) {
					let counter = questions.user_answer.filter(
						(userAnswerFilter) =>
							userAnswerFilter.question_id === questionOptionItem.question_id &&
							userAnswerFilter.answer === questionOptionItem.option
					).length;
					question_options.push({
						name: questionOptionItem.option,
						y: counter,
					});
				} else if (
					questionOptionItem.question.question_type === "Fill in the Blank"
				) {
					let counter = questions.user_answer.filter(
						(userAnswerFilter) =>
							userAnswerFilter.question_id === questionOptionItem.question_id &&
							userAnswerFilter.answer.includes(questionOptionItem.option)
					).length;
					question_options.push({
						name: questionOptionItem.option,
						y: counter,
					});
				}
				return "";
			}
		);

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
												height: 250,
											},
											title: {
												text: null,
											},
											tooltip: {
												formatter: function () {
													return `<b>${this.key}: ${this.y}`;
												},
											},
											plotOptions: {
												pie: {
													allowPointSelect: true,
													cursor: "pointer",
													dataLabels: {
														enabled: true,
														distance: 10,
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
											exporting: false,
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
		<Card id="PageStatsQuestionnaire">
			<Row gutter={[12, 12]}>
				<Col xs={24} sm={24} md={24} lg={hasCollapse ? 16 : 24} xl={16}>
					<Tabs
						defaultActiveKey="1"
						type="card"
						size="large"
						className="tab-stats-questionaire-result"
						onChange={handleChangeTabQuestionaire}
						items={[
							{
								key: "1",
								label: "Cancer Caregiver",
								children:
									dataSourceQuestionaire.filter(
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
																				height: 250,
																			},
																			title: {
																				text: null,
																			},
																			tooltip: {
																				formatter: function () {
																					return `<b>${this.key}: ${this.y}`;
																				},
																			},
																			plotOptions: {
																				pie: {
																					allowPointSelect: true,
																					cursor: "pointer",
																					dataLabels: {
																						enabled: true,
																						distance: 10,
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
																			exporting: false,
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
																												height: 250,
																											},
																											title: {
																												text: null,
																											},
																											tooltip: {
																												formatter: function () {
																													return `<b>${this.key}: ${this.y}`;
																												},
																											},
																											plotOptions: {
																												pie: {
																													allowPointSelect: true,
																													cursor: "pointer",
																													dataLabels: {
																														enabled: true,
																														distance: 10,
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
																											exporting: false,
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
																									header={
																										questionsItem.question_number
																									}
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
																												<Col
																													xs={24}
																													sm={24}
																													md={8}
																												>
																													<Typography.Title
																														level={5}
																													>
																														Question Type:
																													</Typography.Title>
																												</Col>
																												<Col
																													xs={24}
																													sm={24}
																													md={16}
																												>
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
																												<Col
																													xs={24}
																													sm={24}
																													md={8}
																												>
																													<Typography.Title
																														level={5}
																													>
																														Question:
																													</Typography.Title>
																												</Col>
																												<Col
																													xs={24}
																													sm={24}
																													md={16}
																												>
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
																												<Col
																													xs={24}
																													sm={24}
																													md={8}
																												>
																													<Typography.Title
																														level={5}
																													>
																														Question Option:
																													</Typography.Title>
																												</Col>
																												<Col
																													xs={24}
																													sm={24}
																													md={16}
																												>
																													{questionsItem
																														.question_options
																														.length > 0
																														? questionsItem.question_options.map(
																																(
																																	questionOptionItem,
																																	questionOptionIndex
																																) => {
																																	let questionOptionStatus =
																																		questionsItem.question_options.filter(
																																			(
																																				questionOptionStatusFilter
																																			) =>
																																				parseInt(
																																					questionOptionStatusFilter.status
																																				) === 1
																																		);
																																	if (
																																		questionOptionStatus.length >
																																		0
																																	) {
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
																																						{questionOptionItem.option
																																							? questionOptionItem.option
																																							: questionOptionIndex +
																																							  1}
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
																																						{questionOptionItem.option
																																							? questionOptionItem.option
																																							: questionOptionIndex +
																																							  1}
																																					</Typography.Text>
																																				</div>
																																			);
																																		}
																																	} else {
																																		return (
																																			<div
																																				key={
																																					questionOptionIndex
																																				}
																																			>
																																				<Typography.Text
																																					strong
																																				>
																																					{questionOptionItem.option
																																						? questionOptionItem.option
																																						: questionOptionIndex +
																																						  1}
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
									),
							},
							{
								key: "2",
								label: "Cancer Care Professional",
								children:
									dataSourceQuestionaire.filter(
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
																				height: 250,
																			},
																			title: {
																				text: null,
																			},
																			tooltip: {
																				formatter: function () {
																					return `<b>${this.key}: ${this.y}`;
																				},
																			},
																			plotOptions: {
																				pie: {
																					allowPointSelect: true,
																					cursor: "pointer",
																					dataLabels: {
																						enabled: true,
																						distance: 10,
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
																			exporting: false,
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
																											height: 250,
																										},
																										title: {
																											text: null,
																										},
																										tooltip: {
																											formatter: function () {
																												return `<b>${this.key}: ${this.y}`;
																											},
																										},
																										plotOptions: {
																											pie: {
																												allowPointSelect: true,
																												cursor: "pointer",
																												dataLabels: {
																													enabled: true,
																													distance: 10,
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
																										exporting: false,
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
																												<Col
																													xs={24}
																													sm={24}
																													md={8}
																												>
																													<Typography.Title
																														level={5}
																													>
																														Question Type:
																													</Typography.Title>
																												</Col>
																												<Col
																													xs={24}
																													sm={24}
																													md={16}
																												>
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
																												<Col
																													xs={24}
																													sm={24}
																													md={8}
																												>
																													<Typography.Title
																														level={5}
																													>
																														Question:
																													</Typography.Title>
																												</Col>
																												<Col
																													xs={24}
																													sm={24}
																													md={16}
																												>
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
																												<Col
																													xs={24}
																													sm={24}
																													md={8}
																												>
																													<Typography.Title
																														level={5}
																													>
																														Question Option:
																													</Typography.Title>
																												</Col>
																												<Col
																													xs={24}
																													sm={24}
																													md={16}
																												>
																													{questionsItem
																														.question_options
																														.length > 0
																														? questionsItem.question_options.map(
																																(
																																	questionOptionItem,
																																	questionOptionIndex
																																) => {
																																	let questionOptionStatus =
																																		questionsItem.question_options.filter(
																																			(
																																				questionOptionStatusFilter
																																			) =>
																																				parseInt(
																																					questionOptionStatusFilter.status
																																				) === 1
																																		);
																																	if (
																																		questionOptionStatus.length >
																																		0
																																	) {
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
																																						{questionOptionItem.option
																																							? questionOptionItem.option
																																							: questionOptionIndex +
																																							  1}
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
																																						{questionOptionItem.option
																																							? questionOptionItem.option
																																							: questionOptionIndex +
																																							  1}
																																					</Typography.Text>
																																				</div>
																																			);
																																		}
																																	} else {
																																		return (
																																			<div
																																				key={
																																					questionOptionIndex
																																				}
																																			>
																																				<Typography.Text
																																					strong
																																				>
																																					{questionOptionItem.option
																																						? questionOptionItem.option
																																						: questionOptionIndex +
																																						  1}
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
									),
							},
						]}
					/>
				</Col>

				<Col xs={24} sm={24} md={24} lg={hasCollapse ? 8 : 24} xl={8}></Col>
			</Row>
		</Card>
	);
}
