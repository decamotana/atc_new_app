import { useEffect, useState } from "react";
import { Button, Col, Row, Typography } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faArrowUp,
	faForward,
	faDial,
	faCheckCircle,
} from "@fortawesome/pro-solid-svg-icons";

import { GET } from "../../../providers/useAxiosQuery";
import DashboardModulesModal from "./DashboardModulesModal";
import noDataFoundPng from "../../../assets/img/no-data-found.jpg";

export default function DashboardModules(props) {
	const { moduleFilter, colSm, colMd, colLg, colXl, colXXL } = props;
	const [dataSource, setDataSource] = useState([]);
	const [toggleModalModule, setToggleModalModule] = useState({
		show: false,
		data: null,
		index: 0,
	});

	const { refetch: refetchModule } = GET(
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

						// console.log("itemModule.lessons", itemModule.lessons);
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

				setDataSource(data);
			}
		}
	);

	useEffect(() => {
		refetchModule();
		return () => {};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [moduleFilter]);

	return (
		<>
			<Row gutter={[12, 12]} className="ant-row-modules">
				{dataSource.length > 0 ? (
					dataSource.map((item, index) => {
						let btn_class = "up-next";
						let btn_icon = faForward;
						let status = "Up Next";

						if (item.status === "Completed") {
							btn_class = "completed";
							btn_icon = faCheckCircle;
							status = "Completed";
						} else if (item.status === "In Progress") {
							btn_class = "in-progress";
							btn_icon = faDial;
							status = "In Progress";
						} else {
							btn_class = "up-next";
							btn_icon = faForward;
							status = "Up Next";
						}

						return (
							<Col
								xs={24}
								sm={colSm ? colSm : 24}
								md={colMd ? colMd : 12}
								lg={colLg ? colLg : 8}
								xl={colXl ? colXl : 8}
								xxl={colXXL ? colXXL : 8}
								key={index}
							>
								<Button
									type="link"
									className={`ant-btn-modules ${btn_class}`}
									onClick={() => {
										if (index === 0) {
											setToggleModalModule({
												show: true,
												data: dataSource.filter(
													(itemFilter) => itemFilter.status !== "Up Next"
												),
												index,
											});
										} else {
											if (item.status !== "Up Next") {
												setToggleModalModule({
													show: true,
													data: dataSource,
													index,
												});
											}
										}
									}}
								>
									<div className="ant-btn-modules-icon">
										<FontAwesomeIcon icon={btn_icon} />
									</div>
									<span>
										<Typography.Title level={2} className="title">
											{item.module_number}
										</Typography.Title>
										<Typography.Title level={4} className="status">
											{status}
										</Typography.Title>
									</span>
									<div className="icon-bottom">
										<FontAwesomeIcon icon={faArrowUp} className="rotate-45" />
									</div>
								</Button>
							</Col>
						);
					})
				) : (
					<Col xs={24} sm={24} md={24} className="text-center">
						<img
							alt="no data found"
							src={noDataFoundPng}
							style={{ width: "100%" }}
						/>
					</Col>
				)}
			</Row>

			<DashboardModulesModal
				toggleModalModule={toggleModalModule}
				setToggleModalModule={setToggleModalModule}
				moduleFilter={moduleFilter}
			/>
		</>
	);
}
