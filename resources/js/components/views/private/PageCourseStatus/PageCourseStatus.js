import { useState } from "react";
import { Button, Card, Col, Collapse, Row } from "antd";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf } from "@fortawesome/pro-regular-svg-icons";

import pdfImg from "../../../assets/img/CCG-certificateofcompletion.png";
import highchartsSetOptions from "../../../providers/highchartsSetOptions";
import percentage from "../../../providers/percentage";
import { GET } from "../../../providers/useAxiosQuery";
import { role, userData } from "../../../providers/companyInfo";
import Highcharts from "highcharts";
import pdfCertificateOfCompletion from "../../../providers/pdf/pdfCertificateOfCompletion";
import moment from "moment";
// require("highcharts/modules/exporting")(Highcharts);
require("highcharts/modules/boost")(Highcharts);

export default function PageCourseStatus() {
	const name = `${userData().firstname} ${userData().lastname}`;

	const [
		moduleFilter,
		// setModuleFilter
	] = useState({
		filter_module_for: role(),
	});

	const [isCompleted, setIsCompleted] = useState(false);

	highchartsSetOptions(Highcharts);

	const { isLoading: isLoadingModule } = GET(
		`api/v1/module?${new URLSearchParams(moduleFilter)}`,
		"module_dashboard_list",
		(res) => {
			// console.log("module", res);
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

				let tempIsCompleted =
					percentage(completed, total) === 100 ? true : false;

				setIsCompleted(tempIsCompleted);

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

				if (tempIsCompleted) {
					setTimeout(() => {
						addTextToImage({
							imagePath: pdfImg,
							signature: res.cert_image,
							canvasOutput: "canvasOutput",
							date: moment().format("MM/DD/YYYY"),
							name: `${name}`,
						});
					}, 1000);
				}
			}
		}
	);

	// addTextToImage(signatureVal, "test test");
	function addTextToImage(props) {
		const { imagePath, signature, date, name, canvasOutput } = props;
		// console.log("props", props);

		let width = 1000;
		let height = 720;

		let circle_canvas = document.getElementById(canvasOutput);
		circle_canvas.width = width;
		circle_canvas.height = height;
		let context = circle_canvas.getContext("2d");

		// Draw Image function
		let img = new Image();
		img.src = imagePath;
		let signatureImg = new Image();
		signatureImg.src = signature;

		let nameX = width / 2 - 60;
		img.onload = function () {
			context.drawImage(img, 0, 0);
			context.drawImage(signatureImg, 130, 420, 250, 100);
			// context.lineWidth = 1;
			// context.fillStyle = "#CC00FF";
			// context.lineStyle = "#ffff00";
			context.font = "25px sans-serif";
			context.textAlign = "center";
			context.fillText(name, nameX, height / 2 - 50);

			context.font = "16px sans-serif";
			context.textAlign = "center";
			context.fillText(date, width / 2 + 182, height / 2 + 140);
		};
	}

	const handleDownloadCertificateOfCompletion = () => {
		let circle_canvas = document.getElementById("canvasOutput");

		pdfCertificateOfCompletion({
			imagePath: circle_canvas.toDataURL("image/png"),
		});
	};

	return (
		<Card className="page-course-status" id="PageCourseStatus">
			<Row gutter={[12, 12]}>
				<Col xs={24} sm={24} md={24} lg={24} xl={17}>
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
							header="CERTIFICATION OF COMPLETION"
							key="1"
							className="accordion bg-darkgray-form m-b-md border"
						>
							<Row>
								<Col xs={24} sm={24} md={24} className="text-right">
									{isCompleted && (
										<Button
											type="link"
											icon={
												<FontAwesomeIcon icon={faFilePdf} className="m-r-xs" />
											}
											className="color-7"
											loading={isLoadingModule}
											onClick={handleDownloadCertificateOfCompletion}
										>
											<span style={{ fontWeight: "600" }}>Download PDF</span>
										</Button>
									)}
								</Col>
								<Col
									xs={24}
									sm={24}
									md={24}
									className="cert-complete-container"
								>
									{isCompleted ? (
										<div className="cert-complete">
											<canvas
												id="canvasOutput"
												style={{ width: "100%", height: "100%" }}
											></canvas>
										</div>
									) : (
										<img
											className="cert-incomplete"
											src={pdfImg}
											alt="img-cert-incomplete"
											style={{ width: "100%" }}
										/>
									)}
								</Col>
							</Row>
						</Collapse.Panel>
					</Collapse>
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
							header="MY MODULE STATUS"
							key="1"
							className="accordion bg-darkgray-form m-b-md border "
						>
							<div id="div_module_status" className="highchart-responsive" />
						</Collapse.Panel>
					</Collapse>
				</Col>
			</Row>
		</Card>
	);
}
