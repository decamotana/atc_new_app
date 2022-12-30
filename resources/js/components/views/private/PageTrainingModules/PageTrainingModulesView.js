import { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import {
	Alert,
	Anchor,
	Button,
	Card,
	Col,
	Collapse,
	Form,
	Modal,
	notification,
	Progress,
	Radio,
	Row,
	Space,
	Tooltip,
	Typography,
} from "antd";
import $ from "jquery";
import { GETMANUAL, POST } from "../../../providers/useAxiosQuery";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faAngleLeft,
	faAngleRight,
	faArrowLeft,
	faArrowRight,
	faCirclePause,
	faCirclePlay,
	faExpandArrows,
	faFileAlt,
	faPlay,
	faPlus,
	faQuestion,
	faRotateRight,
} from "@fortawesome/pro-solid-svg-icons";
import ReactPlayer from "react-player";
import { apiUrl } from "../../../providers/companyInfo";
import FloatInput from "../../../providers/FloatInput";

export default function PageTrainingModulesView(props) {
	const { location } = props;
	const [lessonId, setLessonId] = useState(location.state);
	const history = useHistory();

	useEffect(() => {
		console.log("lessonId", lessonId);

		return () => {};
	}, [lessonId]);

	const [width, setWidth] = useState($(window).width());
	const [height, setHeight] = useState($(window).height());

	useEffect(() => {
		function handleResize() {
			setWidth($(window).width());
			setHeight($(window).height());
		}
		window.addEventListener("resize", handleResize);

		return () => {};
	}, []);

	const refReactPlayer = useRef(null);
	const refReactPlayerModal = useRef(null);
	const [videoDuration, setVideoDuration] = useState({
		seconds: 0,
		duration: 0,
		last_played: 0,
		played: 0,
		seeking: false,
		seekingVal: 0,
	});
	const [isPlaying, setIsPlaying] = useState(false);
	const [isPlayingVideoModal, setIsPlayingVideoModal] = useState(false);
	const [toogleModalVideoFullscreen, setToogleModalVideoFullscreen] =
		useState(false);

	const [dataSourceAudio, setDataSourceAudio] = useState([]);
	const [dataSourceDocument, setDataSourceDocument] = useState([]);

	const [dataQuestionaireProgress, setDataQuestionaireProgress] = useState({
		progressPercent: 0,
		activeContent: 0,
		percent: 0,
		errMessage: "",
	});
	const [dataQuestionaire, setDataQuestionaire] = useState([]);

	const [videoIsReady, setVideoIsReady] = useState(false);
	const [modalVideoIsReady, setModalVideoIsReady] = useState(false);

	const { data: dataSource, refetch: refetchDataLesson } = GETMANUAL(
		`api/v1/lesson/${lessonId}`,
		"cc_lessons_info",
		(res) => {
			if (res.data) {
				let data = res.data;
				// console.log("data.user_lessons", data.user_lessons);

				if (data.user_lessons.length > 0) {
					setVideoDuration({
						...videoDuration,
						seconds: parseFloat(data.user_lessons[0].video_seconds),
						duration: parseFloat(data.user_lessons[0].video_duration),
						last_played: data.user_lessons[0].video_last_played
							? parseFloat(data.user_lessons[0].video_last_played)
							: 0,
						played: data.user_lessons[0].video_played
							? parseFloat(data.user_lessons[0].video_played)
							: 0,
					});
				}

				$(".module_no_lesson_no").html(
					`${data.module.module_number} - ${data.lesson_name}`
				);

				setDataSourceAudio(
					data.attachments.filter(
						(itemFilter) =>
							itemFilter.file_path !== "" &&
							itemFilter.file_path !== null &&
							itemFilter.type === "Audio" &&
							itemFilter.status === 1
					)
				);
				setDataSourceDocument(
					data.attachments.filter(
						(itemFilter) =>
							itemFilter.file_path !== "" &&
							itemFilter.file_path !== null &&
							itemFilter.type === "Document" &&
							itemFilter.status === 1
					)
				);

				if (data.questions) {
					setDataQuestionaireProgress({
						...dataQuestionaireProgress,
						progressPercent: 0,
						percent: 100 / data.questions.length,
						data: data.questions,
					});
					let dataQuestions = data.questions.map((item, index) => {
						let answer = "";

						let filtered_user_answers = data.user_answers.filter(
							(userAnswerFilter) => userAnswerFilter.question_id === item.id
						);

						if (
							item.question_type === "Multiple Choice" ||
							item.question_type === "True/False" ||
							item.question_type === "Yes/No" ||
							item.question_type === "Rating"
						) {
							answer = filtered_user_answers[filtered_user_answers.length - 1]
								? parseInt(
										filtered_user_answers[filtered_user_answers.length - 1]
											.answer
								  )
								: "";
						} else if (item.question_type === "Open Answer") {
							answer = filtered_user_answers[filtered_user_answers.length - 1]
								? filtered_user_answers[filtered_user_answers.length - 1].answer
								: "";
						} else if (item.question_type === "Fill in the Blank") {
							answer = filtered_user_answers[filtered_user_answers.length - 1]
								? JSON.parse(
										filtered_user_answers[filtered_user_answers.length - 1]
											.answer
								  )
								: [];
						}

						let check_answer = "";
						if (item.question_type === "Multiple Choice") {
							let correct = item.question_options.filter(
								(questionOptionFilter) =>
									parseInt(questionOptionFilter.status) === 1
							);

							if (answer !== "") {
								if (correct.length > 0) {
									if (answer === correct[0].id) {
										check_answer = "Correct Answer";
									} else {
										check_answer = "Wrong Answer";
									}
								} else {
									check_answer = "Correct Answer";
								}
							}
						} else if (item.question_type === "True/False") {
							let correct = item.question_options.filter(
								(questionOptionFilter) =>
									parseInt(questionOptionFilter.status) === 1 &&
									parseInt(questionOptionFilter.id) === parseInt(answer)
							);
							if (correct.length > 0) {
								check_answer = "Correct Answer";
							} else {
								check_answer = "Wrong Answer";
							}
						} else if (item.question_type === "Yes/No") {
							let correct = item.question_options.filter(
								(questionOptionFilter) =>
									parseInt(questionOptionFilter.status) === 1 &&
									parseInt(questionOptionFilter.id) === parseInt(answer)
							);
							if (correct.length > 0) {
								check_answer = "Correct Answer";
							} else {
								check_answer = "Wrong Answer";
							}
						} else if (item.question_type === "Open Answer") {
							let correct = item.question_options.filter(
								(questionOptionFilter) =>
									parseInt(questionOptionFilter.status) === 1 &&
									questionOptionFilter.option === answer
							);
							if (correct.length > 0) {
								check_answer = "Correct Answer";
							} else {
								check_answer = "Wrong Answer";
							}
						} else if (item.question_type === "Fill in the Blank") {
							if (answer !== "" && Array.isArray(answer) && answer.length > 0) {
								let counter = 0;
								answer.map((answerItem, answerIndex) => {
									let correct = item.question_options[answerIndex].option;
									if (answerItem === correct) {
										counter++;
									} else {
										counter--;
									}
									return "";
								});

								if (counter === item.question_options.length) {
									check_answer = "Correct Answer";
								} else {
									check_answer = "Wrong Answer";
								}
							}
						} else if (item.question_type === "Rating") {
							if (answer !== "") {
								check_answer = "Correct Answer";
							} else {
								check_answer = "Wrong Answer";
							}
						} else {
							check_answer = "Correct Answer";
						}

						return {
							...item,
							check_answer,
							answer,
						};
					});

					setDataQuestionaire(dataQuestions);
				}
			}

			if (res.modules) {
				let userdata = res.userdata;

				let modulesLessons = res.modules
					.filter(
						(dataModuleFilter) =>
							dataModuleFilter.lessons.length > 0 &&
							dataModuleFilter.lessons.filter(
								(lessonsFilter) => lessonsFilter.questions.length > 0
							).length > 0
					)
					.reduce((a, b) => {
						a.push(b.lessons);
						return a;
					}, [])
					.reduce((a, b) => {
						return a.concat(b);
					}, []);

				let lesson_index;
				for (let index = 0; index < modulesLessons.length; index++) {
					if (modulesLessons[index]["id"] === location.state) {
						lesson_index = index;
					}
				}

				/** button lesson previous */
				if (lesson_index === 0) {
					$("#btn_lesson_prev")
						.removeClass("btn-main-invert")
						.addClass("btn-grey");
				} else {
					$("#btn_lesson_prev")
						.removeClass("btn-grey")
						.addClass("btn-main-invert");
				}
				/** end button lesson previous */
				// console.log(
				// 	"modulesLessons[lesson_index].user_answers",
				// 	modulesLessons[lesson_index].user_answers
				// );
				/** button lesson next */
				if (userdata.video_restriction) {
					if (modulesLessons[lesson_index].user_answers.length !== 0) {
						if (res.data.user_lessons.length > 0) {
							if (
								parseFloat(res.data.user_lessons[0].video_seconds) ===
								parseFloat(res.data.user_lessons[0].video_duration)
							) {
								if (res.data.user_answers.length > 0) {
									$("#btn_lesson_next")
										.removeClass("btn-grey")
										.addClass("btn-main-invert");
								} else {
									$("#btn_lesson_next")
										.removeClass("btn-main-invert")
										.addClass("btn-grey");
								}
							} else {
								$("#btn_lesson_next")
									.removeClass("btn-main-invert")
									.addClass("btn-grey");
							}
						} else {
							$("#btn_lesson_next")
								.removeClass("btn-main-invert")
								.addClass("btn-grey");
						}
					} else {
						$("#btn_lesson_next")
							.removeClass("btn-main-invert")
							.addClass("btn-grey");
					}
				} else {
					$("#btn_lesson_next")
						.removeClass("btn-grey")
						.addClass("btn-main-invert");
				}

				/** end button lesson next */
			}
		}
	);

	useEffect(() => {
		refetchDataLesson();
		return () => {};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [lessonId]);

	const {
		mutate: mutateCreateUpdateUserLesson,
		isLoading: isLoadingCreateUpdateUserLesson,
	} = POST("api/v1/user_lesson", "user_lesson_create_update");

	const handlePauseVideo = (e, option) => {
		let seconds = 0;

		if (videoDuration.seconds) {
			if (videoDuration.duration === videoDuration.seconds) {
				seconds = videoDuration.duration;
			} else {
				if (option === 1) {
					if (
						parseInt(refReactPlayer.current.getDuration()) ===
						parseInt(refReactPlayer.current.getCurrentTime())
					) {
						seconds = refReactPlayer.current.getDuration();
					} else {
						seconds = refReactPlayer.current.getCurrentTime();
					}
				} else if (option === 2) {
					if (
						parseInt(refReactPlayerModal.current.getDuration()) ===
						parseInt(refReactPlayerModal.current.getCurrentTime())
					) {
						seconds = refReactPlayerModal.current.getDuration();
					} else {
						seconds = refReactPlayerModal.current.getCurrentTime();
					}
				}
			}
		} else {
			if (option === 1) {
				if (
					parseInt(refReactPlayer.current.getDuration()) ===
					parseInt(refReactPlayer.current.getCurrentTime())
				) {
					seconds = refReactPlayer.current.getDuration();
				} else {
					seconds = refReactPlayer.current.getCurrentTime();
				}
			} else if (option === 2) {
				if (
					parseInt(refReactPlayerModal.current.getDuration()) ===
					parseInt(refReactPlayerModal.current.getCurrentTime())
				) {
					seconds = refReactPlayerModal.current.getDuration();
				} else {
					seconds = refReactPlayerModal.current.getCurrentTime();
				}
			}
		}

		let data = {
			duration:
				option === 1
					? refReactPlayer.current.getDuration()
					: refReactPlayerModal.current.getDuration(),
			seconds,
			last_played:
				videoDuration.last_played > videoDuration.played
					? videoDuration.last_played
					: videoDuration.played,
			played: videoDuration.played,
			module_id: dataSource?.data.module_id,
			lesson_id: dataSource?.data.id,
		};

		mutateCreateUpdateUserLesson(data, {
			onSuccess: (res) => {
				if (res.success) {
					setVideoDuration({ ...videoDuration, ...data });
					notification.success({
						message: "Training Module",
						description: res.message,
					});
				} else {
					notification.error({
						message: "Training Module",
						description: res.message,
					});
				}
				setIsPlaying(false);
			},
			onError: (err) => {
				notification.error({
					message: "Training Module",
					description: err.response.data.message,
				});
				setIsPlaying(false);
			},
		});
	};

	const handleEndedVideo = (option) => {
		let duration = 0;
		if (videoDuration.duration) {
			duration = videoDuration.duration;
		} else {
			if (option === 1) {
				duration = refReactPlayer.current.getDuration();
			} else {
				duration = refReactPlayerModal.current.getDuration();
			}
		}

		let data = {
			duration: duration,
			seconds: duration,
			last_played:
				videoDuration.last_played > videoDuration.played
					? videoDuration.last_played
					: videoDuration.played,
			played: videoDuration.played,
			module_id: dataSource?.data.module_id,
			lesson_id: dataSource?.data.id,
		};

		mutateCreateUpdateUserLesson(data, {
			onSuccess: (res) => {
				if (res.success) {
					setVideoDuration({
						...videoDuration,
						...data,
					});
					setIsPlaying(false);

					notification.success({
						message: "Training Module",
						description: res.message,
					});
				} else {
					notification.error({
						message: "Training Module",
						description: res.message,
					});
				}
				setIsPlaying(false);
			},
			onError: (err) => {
				notification.error({
					message: "Training Module",
					description: err.response.data.message,
				});
				setIsPlaying(false);
			},
		});
	};

	const handleClickPrev = () => {
		if (dataQuestionaireProgress.activeContent !== 0) {
			let progressPercent = dataQuestionaireProgress.progressPercent;
			if (dataQuestionaireProgress.activeContent !== 0) {
				progressPercent =
					dataQuestionaireProgress.progressPercent -
					dataQuestionaireProgress.percent;
			} else {
				progressPercent = dataQuestionaireProgress.percent;
			}
			setDataQuestionaireProgress({
				...dataQuestionaireProgress,
				progressPercent: progressPercent,
				activeContent: dataQuestionaireProgress.activeContent - 1,
			});

			$(".step3-questionaire-carousel .contents .content").addClass("hide");
			$(
				`.step3-questionaire-carousel .contents .content-${
					dataQuestionaireProgress.activeContent - 1
				}`
			).removeClass("hide");
		}
	};

	const handleClickNext = () => {
		let dataQuestionaireTemp = [...dataQuestionaire];
		let checkAnswer =
			dataQuestionaireTemp[dataQuestionaireProgress.activeContent];
		// console.log("checkAnswer", checkAnswer);

		if (
			checkAnswer.question_type === "Option 1 (More Questions)" ||
			checkAnswer.question_type === "Option 2 (No More Questions)"
		) {
			// console.log("a");
			let activeContent = dataQuestionaireProgress.activeContent + 1;

			if (activeContent !== dataQuestionaire.length) {
				// console.log("next");
				setDataQuestionaireProgress({
					...dataQuestionaireProgress,
					progressPercent:
						dataQuestionaireProgress.progressPercent +
						dataQuestionaireProgress.percent,
					activeContent: activeContent,
					errMessage: "",
				});

				$(".step3-questionaire-carousel .contents .content").addClass("hide");
				$(
					`.step3-questionaire-carousel .contents .content-${activeContent}`
				).removeClass("hide");
			}
		} else {
			if (checkAnswer.answer !== "") {
				let activeContent = dataQuestionaireProgress.activeContent + 1;

				if (activeContent !== dataQuestionaire.length) {
					// console.log("next");
					setDataQuestionaireProgress({
						...dataQuestionaireProgress,
						progressPercent:
							dataQuestionaireProgress.progressPercent +
							dataQuestionaireProgress.percent,
						activeContent: activeContent,
						errMessage: "",
					});

					$(".step3-questionaire-carousel .contents .content").addClass("hide");
					$(
						`.step3-questionaire-carousel .contents .content-${activeContent}`
					).removeClass("hide");
				}
			} else {
				setDataQuestionaireProgress({
					...dataQuestionaireProgress,
					errMessage: "Please answer this question.",
				});
			}
		}
	};

	const [isLoadingCreateUserAnswer, setIsLoadingCreateUserAnswer] =
		useState(false);
	const {
		mutate: mutateCreateUserAnswer,
		// isLoading: isLoadingCreateUserAnswer,
	} = POST("api/v1/user_answer", "user_answer_create");

	const handleClickSubmit = () => {
		let activeContent = dataQuestionaireProgress.activeContent;
		if (dataQuestionaireProgress.activeContent === dataQuestionaire.length) {
			activeContent += 1;
		}

		setDataQuestionaireProgress({
			...dataQuestionaireProgress,
			progressPercent:
				dataQuestionaireProgress.progressPercent +
				dataQuestionaireProgress.percent,
			activeContent: activeContent,
			errMessage: "",
		});
		// console.log("handleClickSubmit");

		setIsLoadingCreateUserAnswer(true);

		setTimeout(() => {
			// console.log("videoDuration", videoDuration);
			let userdata = dataSource.userdata;
			let error = false;

			if (userdata.video_restriction) {
				if (!videoDuration.duration) {
					error = true;
					notification.error({
						message: "Training Module",
						description: "Please finish watch the video first",
					});
					setIsLoadingCreateUserAnswer(false);
				} else {
					if (videoDuration.duration !== videoDuration.seconds) {
						error = true;
						notification.error({
							message: "Training Module",
							description: "Please finish watch the video first",
						});
						setIsLoadingCreateUserAnswer(false);
					}
				}
			}

			if (error === false) {
				let dataCreateUserAnswer = {
					answer: dataQuestionaire,
					module_id: dataSource?.data.module_id,
					lesson_id: dataSource?.data.id,
				};
				mutateCreateUserAnswer(dataCreateUserAnswer, {
					onSuccess: (res) => {
						if (res.success) {
							notification.success({
								message: "Training Module",
								description: res.message,
							});

							let modulesLessons = dataSource.modules
								.filter(
									(modulesLessonFilter) =>
										modulesLessonFilter.lessons.length > 0 &&
										modulesLessonFilter.lessons.filter(
											(lessonsFilter) => lessonsFilter.questions.length > 0
										).length > 0
								)
								.reduce((a, b) => {
									a.push(b.lessons);
									return a;
								}, [])
								.reduce((a, b) => {
									return a.concat(b);
								}, []);

							if (modulesLessons.length > 0) {
								let last_lesson = false;
								let lesson_index;
								for (let index = 0; index < modulesLessons.length; index++) {
									if (modulesLessons[index]["id"] === location.state) {
										lesson_index = index;
										if (index === modulesLessons.length - 1) {
											last_lesson = true;
										}
									}
								}

								if (!last_lesson) {
									setLessonId(modulesLessons[lesson_index + 1]["id"]);
									history.push({
										pathname: "/training-modules/view",
										state: modulesLessons[lesson_index + 1]["id"],
									});
								} else {
									history.push("/course-status/certificate-of-completion");
								}

								setDataQuestionaireProgress({
									...dataQuestionaireProgress,
									progressPercent: 0,
									percent: 0,
									activeContent: 0,
									data: [],
								});
								setDataQuestionaire([]);
								setDataSourceAudio([]);
								setDataSourceDocument([]);
								setVideoDuration({
									...videoDuration,
									duration: 0,
									seconds: 0,
									last_played: 0,
									played: 0,
								});
								refReactPlayer.current.seekTo(0);
								setIsPlaying(false);
							} else {
								history.push("/training-modules");
							}
						} else {
							notification.error({
								message: "Training Module",
								description: res.message,
							});
						}
						setIsLoadingCreateUserAnswer(false);
					},
					onError: (err) => {
						notification.error({
							message: "Training Module",
							description: err.response.data.message,
						});
						setIsLoadingCreateUserAnswer(false);
					},
				});
			}
		}, 1000);
	};

	useEffect(() => {
		const ant_range = document.getElementById("ant_range");
		if (ant_range) {
			const min = 0;
			const max = 0.999999;
			const val = videoDuration.played ? parseFloat(videoDuration.played) : 0;
			// console.log(((val - min) * 100) / (max - min) + "% 100%");
			ant_range.style.backgroundSize =
				((val - min) * 100) / (max - min) + "% 100%";
		}
		return () => {};
	}, [videoDuration]);

	return (
		<Card
			className="page-caregiver-training-module"
			id="PageTrainingModulesView"
		>
			<Anchor
				offsetTop={height - 40}
				className="previous-lesson"
				style={{
					position: "fixed",
					left: width > 575 ? 20 : 10,
					zIndex: 999999,
				}}
			>
				<Button
					className="btn-main-invert"
					id="btn_lesson_prev"
					onClick={() => {
						let modulesLessons = dataSource.modules
							.filter(
								(modulesLessonFilter) =>
									modulesLessonFilter.lessons.length > 0 &&
									modulesLessonFilter.lessons.filter(
										(lessonsFilter) => lessonsFilter.questions.length > 0
									).length > 0
							)
							.reduce((a, b) => {
								a.push(b.lessons);
								return a;
							}, [])
							.reduce((a, b) => {
								return a.concat(b);
							}, []);

						let lesson_index;
						for (let index = 0; index < modulesLessons.length; index++) {
							if (modulesLessons[index]["id"] === location.state) {
								lesson_index = index;
							}
						}

						if (lesson_index !== 0) {
							setLessonId(modulesLessons[lesson_index - 1]["id"]);
							history.push({
								pathname: "/training-modules/view",
								state: modulesLessons[lesson_index - 1]["id"],
							});
						} else {
							$("#btn_lesson_prev")
								.removeClass("btn-main-invert")
								.addClass("btn-grey");
						}
					}}
				>
					<FontAwesomeIcon icon={faAngleLeft} className="m-r-xs" />
					PREVIOUS LESSON
				</Button>
			</Anchor>
			<Anchor
				offsetTop={height - 40}
				className="next-lesson"
				style={{
					position: "fixed",
					right: width > 575 ? 20 : 10,
					zIndex: 999999,
				}}
			>
				<Button
					className="btn-main-invert"
					id="btn_lesson_next"
					onClick={() => {
						let userdata = dataSource.userdata;

						let modulesLessons = dataSource.modules
							.filter(
								(modulesLessonFilter) =>
									modulesLessonFilter.lessons.length > 0 &&
									modulesLessonFilter.lessons.filter(
										(lessonsFilter) => lessonsFilter.questions.length > 0
									).length > 0
							)
							.reduce((a, b) => {
								a.push(b.lessons);
								return a;
							}, [])
							.reduce((a, b) => {
								return a.concat(b);
							}, []);

						let last_lesson = false;
						let lesson_index;
						for (let index = 0; index < modulesLessons.length; index++) {
							if (modulesLessons[index]["id"] === location.state) {
								lesson_index = index;
								if (index === modulesLessons.length - 1) {
									if (userdata.video_restriction) {
										if (modulesLessons[index].user_answers.length > 0) {
											last_lesson = true;
										}
									} else {
										last_lesson = true;
									}
								}
							}
						}

						if (!last_lesson) {
							if (userdata.video_restriction) {
								if (modulesLessons[lesson_index].user_answers.length > 0) {
									if (videoDuration.duration === videoDuration.seconds) {
										setLessonId(modulesLessons[lesson_index + 1]["id"]);
										history.push({
											pathname: "/training-modules/view",
											state: modulesLessons[lesson_index + 1]["id"],
										});
									} else {
										notification.error({
											message: "Training Module",
											description: "Please finish watch the video first",
										});
									}
								} else {
									notification.error({
										message: "Training Module",
										description: "Please answer the questions first",
									});
								}
							} else {
								if (videoDuration.duration === videoDuration.seconds) {
									setLessonId(modulesLessons[lesson_index + 1]["id"]);
									history.push({
										pathname: "/training-modules/view",
										state: modulesLessons[lesson_index + 1]["id"],
									});
								} else {
									notification.error({
										message: "Training Module",
										description: "Please finish watch the video first",
									});
								}
							}
						} else {
							history.push("/course-status/certificate-of-completion");
						}
					}}
				>
					NEXT LESSON <FontAwesomeIcon icon={faAngleRight} className="m-l-xs" />
				</Button>
			</Anchor>

			<Row gutter={[12, 12]}>
				<Col xs={24} sm={24} md={24} lg={24} xl={16} xxl={14}>
					<Typography.Title level={4} className="color-4 m-b-xs">
						{dataSource?.data.lesson_name}
					</Typography.Title>

					{dataSource?.data.description_status === 1 ? (
						<Typography.Text>
							<span
								dangerouslySetInnerHTML={{
									__html: dataSource.data.description,
								}}
							/>
						</Typography.Text>
					) : null}

					{dataSource?.data.embed_video_status === 1 ? (
						<Collapse
							className="main-1-collapse border-none m-t-lg collapse-step collapse-step-1"
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
							expandIconPosition="end"
						>
							<Collapse.Panel
								header={
									<>
										<div className="step-icon">
											<FontAwesomeIcon icon={faPlay} />
										</div>
										<div className="step-text">WATCH VIDEO</div>
									</>
								}
								key="1"
								className="accordion bg-darkgray-form m-b-md border bgcolor-1 white"
							>
								<Row gutter={[12, 12]}>
									<Col xs={24} sm={24} md={24}>
										<div className="react-player-video-wrapper">
											<ReactPlayer
												className="react-player-video"
												width="100%"
												ref={refReactPlayer}
												url={dataSource?.data.embed_video}
												onPause={(e) => handlePauseVideo(e, 1)}
												playing={isPlaying}
												onEnded={() => handleEndedVideo(1)}
												playsinline
												volume={1}
												controls={false}
												config={{
													youtube: {
														playerVars: {
															disablekb: 1,
														},
													},
													vimeo: {
														playerOptions: {
															keyboard: false,
														},
													},
												}}
												onReady={() => {
													setVideoIsReady(true);
												}}
												onProgress={(e) => {
													if (e.played !== 0) {
														if (!videoDuration.seeking) {
															setVideoDuration({
																...videoDuration,
																played: e.played,
															});
														}
													}
												}}
											/>
										</div>

										<div className="ant-range-wrapper">
											<input
												type="range"
												className="ant-range"
												id="ant_range"
												min={0}
												max={0.999999}
												step="any"
												value={videoDuration.played}
												onMouseDown={(e) => {
													setVideoDuration({
														...videoDuration,
														seeking: true,
														seekingVal:
															videoDuration.last_played > e.target.value
																? videoDuration.last_played
																: e.target.value,
													});
												}}
												onMouseUp={(e) => {
													setVideoDuration({
														...videoDuration,
														seeking: false,
													});

													if (videoDuration.seekingVal >= e.target.value) {
														refReactPlayer.current.seekTo(
															parseFloat(e.target.value)
														);
													}
												}}
												onChange={(e) => {
													if (videoDuration.seekingVal >= e.target.value) {
														setVideoDuration({
															...videoDuration,
															played: parseFloat(e.target.value),
														});
													}

													const min = e.target.min;
													const max = e.target.max;
													const val = e.target.value;

													e.target.style.backgroundSize =
														((val - min) * 100) / (max - min) + "% 100%";
												}}
											/>
										</div>

										<div className="text-center m-t-sm">
											<Space size={3} className="space-video-buttons">
												{isPlaying ? (
													<Button
														type="link"
														icon={
															<FontAwesomeIcon icon={faCirclePause} size="lg" />
														}
														className="color-1"
														onClick={() => {
															if (!isLoadingCreateUpdateUserLesson) {
																setIsPlaying(false);
															}
														}}
														loading={isLoadingCreateUpdateUserLesson}
													/>
												) : (
													<Button
														type="link"
														icon={
															<FontAwesomeIcon icon={faCirclePlay} size="lg" />
														}
														className="color-1"
														onClick={() => {
															if (videoIsReady) {
																setIsPlaying(true);
																if (videoDuration.played) {
																	refReactPlayer.current.seekTo(
																		videoDuration.played
																	);
																}
															}
														}}
													/>
												)}

												<Button
													type="link"
													icon={
														<FontAwesomeIcon
															icon={faRotateRight}
															size="lg"
															flip="horizontal"
														/>
													}
													className="color-1"
													onClick={() => {
														refReactPlayer.current.seekTo(0);
														setIsPlaying(true);
													}}
												/>

												<Button
													type="link"
													icon={
														<FontAwesomeIcon icon={faExpandArrows} size="lg" />
													}
													className="color-1"
													onClick={() => {
														setIsPlaying(false);
														setToogleModalVideoFullscreen(true);

														setTimeout(() => {
															if (modalVideoIsReady) {
																const ant_range_modal =
																	document.getElementById("ant_range_modal");
																// console.log(ant_range_modal);
																if (ant_range_modal) {
																	const min = 0;
																	const max = 0.999999;
																	const val = videoDuration.played
																		? parseFloat(videoDuration.played)
																		: 0;
																	ant_range_modal.style.backgroundSize =
																		((val - min) * 100) / (max - min) +
																		"% 100%";
																}

																refReactPlayerModal.current.seekTo(
																	videoDuration.played
																);
															}
														}, 1000);
													}}
												/>
											</Space>
										</div>
									</Col>
								</Row>
							</Collapse.Panel>
						</Collapse>
					) : null}

					{dataSourceAudio.length > 0 || dataSourceDocument.length > 0 ? (
						<Collapse
							className="main-1-collapse border-none m-t-lg collapse-step collapse-step-2"
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
								header={
									<>
										<div className="step-icon">
											<FontAwesomeIcon icon={faPlus} />
										</div>
										<div className="step-text">OTHER RESOURCES</div>
									</>
								}
								key="1"
								className="accordion bg-darkgray-form m-b-md border bgcolor-1 white"
							>
								<Row gutter={[12, 12]}>
									{dataSourceAudio.length > 0 ? (
										<Col xs={24} sm={24} md={24} lg={12}>
											<Card className="card-main card-audio" title="AUDIO">
												{dataSourceAudio.map((item, index) => {
													return (
														<div key={index}>
															<div className="color-1">{item.title}</div>
															<audio controls className="w-100">
																<source
																	src={apiUrl + "storage/" + item.file_path}
																	type="audio/mpeg"
																/>
																Your browser does not support the audio element.
															</audio>
														</div>
													);
												})}
											</Card>
										</Col>
									) : null}

									{dataSourceDocument.length > 0 ? (
										<Col xs={24} sm={24} md={24} lg={12}>
											<Card
												className="card-main card-document"
												title="DOCUMENTS"
											>
												<ol>
													{dataSourceDocument.map((item, index) => {
														return (
															<li key={index}>
																<Typography.Link
																	target="new"
																	href={apiUrl + "storage/" + item.file_path}
																>
																	<FontAwesomeIcon
																		icon={faFileAlt}
																		className="m-r-xs color-7 icon"
																	/>{" "}
																	<span className="color-7 text">
																		{item.title}
																	</span>
																</Typography.Link>
															</li>
														);
													})}
												</ol>
											</Card>
										</Col>
									) : null}

									{dataSource &&
									dataSource.data &&
									dataSource.data.instructions_status &&
									parseInt(dataSource.data.instructions_status) === 1 ? (
										<Col xs={24} sm={24} md={24}>
											<Card
												className="card-main card-document"
												title="INSTRUCTIONS"
											>
												<div
													className="color-7 p-xs"
													dangerouslySetInnerHTML={{
														__html: dataSource?.data.instructions,
													}}
												/>
											</Card>
										</Col>
									) : null}
								</Row>
							</Collapse.Panel>
						</Collapse>
					) : null}

					<Collapse
						className="main-1-collapse border-none collapse-step collapse-step-3"
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
						expandIconPosition="end"
					>
						<Collapse.Panel
							header={
								<>
									<div className="step-icon">
										<FontAwesomeIcon icon={faQuestion} />
									</div>
									<div className="step-text">QUESTIONAIRE</div>
								</>
							}
							key="1"
							className="accordion bg-darkgray-form m-b-md border bgcolor-1 white"
						>
							<Form>
								<div className="step3-questionaire-carousel">
									<Row className="row-questions">
										<Col xs={24} sm={24} md={12} lg={14}>
											<Typography.Title level={4} className="color-1">
												{dataQuestionaire &&
													dataQuestionaire[
														dataQuestionaireProgress.activeContent
													]?.question_number}
											</Typography.Title>
										</Col>
										<Col xs={24} sm={24} md={12} lg={10}>
											<div className="bgcolor-16 question-step">
												<div className="out-of-number-question">
													{`${dataQuestionaireProgress.activeContent + 1} of ${
														dataQuestionaire.length
													}`}
												</div>
												<div className="ant-progress-wrapper">
													<Progress
														strokeColor="#027273"
														trailColor="#949599"
														percent={dataQuestionaireProgress.progressPercent}
														showInfo={false}
													/>
												</div>
											</div>
										</Col>

										<Col xs={24} sm={24} md={24} className="m-t-md contents">
											{dataQuestionaire.map((item, index) => {
												let questionOption = "";
												if (item.question_type === "Multiple Choice") {
													questionOption = (
														<Radio.Group
															value={dataQuestionaire[index].answer}
															onChange={(e) => {
																let dataQuestionaireTemp = [
																	...dataQuestionaire,
																];
																let dataQuestionaireTempIndex =
																	dataQuestionaireTemp[index];

																let correct =
																	dataQuestionaireTempIndex.question_options.filter(
																		(questionOptionFilter) =>
																			parseInt(questionOptionFilter.status) ===
																			1
																	);

																let check_answer = "";
																if (e.target.value) {
																	if (correct.length > 0) {
																		if (e.target.value === correct[0].id) {
																			check_answer = "Correct Answer";
																		} else {
																			check_answer = "Wrong Answer";
																		}
																	} else {
																		check_answer = "Correct Answer";
																	}
																}
																dataQuestionaireTemp[index] = {
																	...dataQuestionaireTemp[index],
																	answer: e.target.value,
																	check_answer,
																};

																setDataQuestionaire(dataQuestionaireTemp);
															}}
														>
															<Space direction="vertical">
																{item.question_options.map((item, index) => {
																	return (
																		<Radio value={item.id} key={index}>
																			{item.option}
																		</Radio>
																	);
																})}
															</Space>
														</Radio.Group>
													);
												} else if (item.question_type === "True/False") {
													questionOption = (
														<Radio.Group
															value={dataQuestionaire[index].answer}
															onChange={(e) => {
																let dataQuestionaireTemp = [
																	...dataQuestionaire,
																];
																let dataQuestionaireTempIndex =
																	dataQuestionaireTemp[index];

																let correct =
																	dataQuestionaireTempIndex.question_options.filter(
																		(questionOptionFilter) =>
																			parseInt(questionOptionFilter.status) ===
																				1 &&
																			parseInt(questionOptionFilter.id) ===
																				e.target.value
																	);

																let check_answer = "";
																if (e.target.value) {
																	if (correct.length > 0) {
																		check_answer = "Correct Answer";
																	} else {
																		check_answer = "Wrong Answer";
																	}
																}
																dataQuestionaireTemp[index] = {
																	...dataQuestionaireTemp[index],
																	answer: e.target.value,
																	check_answer,
																};

																setDataQuestionaire(dataQuestionaireTemp);
															}}
														>
															<Space direction="vertical">
																<Radio value={item.question_options[0].id}>
																	True
																</Radio>
																<Radio value={item.question_options[1].id}>
																	False
																</Radio>
															</Space>
														</Radio.Group>
													);
												} else if (item.question_type === "Yes/No") {
													questionOption = (
														<Radio.Group
															value={dataQuestionaire[index].answer}
															onChange={(e) => {
																let dataQuestionaireTemp = [
																	...dataQuestionaire,
																];
																let dataQuestionaireTempIndex =
																	dataQuestionaireTemp[index];

																let correct =
																	dataQuestionaireTempIndex.question_options.filter(
																		(questionOptionFilter) =>
																			parseInt(questionOptionFilter.status) ===
																				1 &&
																			parseInt(questionOptionFilter.id) ===
																				e.target.value
																	);

																let check_answer = "";
																if (e.target.value) {
																	if (correct.length > 0) {
																		check_answer = "Correct Answer";
																	} else {
																		check_answer = "Wrong Answer";
																	}
																}
																dataQuestionaireTemp[index] = {
																	...dataQuestionaireTemp[index],
																	answer: e.target.value,
																	check_answer,
																};

																setDataQuestionaire(dataQuestionaireTemp);
															}}
														>
															<Space direction="vertical">
																<Radio value={item.question_options[0].id}>
																	Yes
																</Radio>
																<Radio value={item.question_options[1].id}>
																	No
																</Radio>
															</Space>
														</Radio.Group>
													);
												} else if (item.question_type === "Open Answer") {
													questionOption = (
														<FloatInput
															label="Answer"
															placeholder="Answer"
															value={dataQuestionaire[index].answer}
															onChange={(e) => {
																let dataQuestionaireTemp = [
																	...dataQuestionaire,
																];
																let dataQuestionaireTempIndex =
																	dataQuestionaireTemp[index];

																let correct =
																	dataQuestionaireTempIndex.question_options.filter(
																		(questionOptionFilter) =>
																			parseInt(questionOptionFilter.status) ===
																				1 && questionOptionFilter.option === e
																	);

																let check_answer = "";
																if (e) {
																	if (correct.length > 0) {
																		check_answer = "Correct Answer";
																	} else {
																		check_answer = "Wrong Answer";
																	}
																}
																dataQuestionaireTemp[index] = {
																	...dataQuestionaireTemp[index],
																	answer: e,
																	check_answer,
																};

																setDataQuestionaire(dataQuestionaireTemp);
															}}
														/>
													);
												} else if (item.question_type === "Fill in the Blank") {
													let fillInTheBlankInput = [];
													for (
														let x = 0;
														x < item.question_options.length;
														x++
													) {
														fillInTheBlankInput.push(
															<div key={x} className={x !== 0 ? "m-t-md" : ""}>
																<FloatInput
																	label="Answer"
																	placeholder="Answer"
																	value={dataQuestionaire[index].answer[x]}
																	onChange={(e) => {
																		let dataQuestionaireTemp = [
																			...dataQuestionaire,
																		];
																		let answer =
																			dataQuestionaireTemp[index].answer;
																		answer[x] = e;

																		let check_answer = "";
																		if (
																			answer !== "" &&
																			Array.isArray(answer) &&
																			answer.length > 0
																		) {
																			let counter = 0;
																			answer.map((answerItem, answerIndex) => {
																				let correct =
																					dataQuestionaireTemp[index]
																						.question_options[answerIndex]
																						.option;
																				if (answerItem === correct) {
																					counter++;
																				} else {
																					counter--;
																				}
																				return "";
																			});

																			if (
																				counter ===
																				dataQuestionaireTemp[index]
																					.question_options.length
																			) {
																				check_answer = "Correct Answer";
																			} else {
																				check_answer = "Wrong Answer";
																			}
																		}

																		dataQuestionaireTemp[index] = {
																			...dataQuestionaireTemp[index],
																			answer,
																			check_answer,
																		};

																		setDataQuestionaire(dataQuestionaireTemp);
																	}}
																/>
															</div>
														);
													}

													questionOption = fillInTheBlankInput;
												} else if (item.question_type === "Rating") {
													let fillInTheBlankInput = [];

													if (item.question_options.length > 0) {
														item.question_options.map(
															(questionOptionItem, questionOptionIndex) => {
																fillInTheBlankInput.push(
																	<Tooltip
																		key={questionOptionIndex}
																		placement="top"
																		title={
																			questionOptionItem.option
																				? questionOptionItem.option
																				: questionOptionIndex + 1
																		}
																	>
																		<Radio.Button value={questionOptionItem.id}>
																			{questionOptionIndex + 1}
																		</Radio.Button>
																	</Tooltip>
																);

																return "";
															}
														);
													}

													questionOption = (
														<Radio.Group
															optionType="button"
															className="btn-radio-group-rating"
															value={dataQuestionaire[index].answer}
															onChange={(e) => {
																let dataQuestionaireTemp = [
																	...dataQuestionaire,
																];

																dataQuestionaireTemp[index] = {
																	...dataQuestionaireTemp[index],
																	answer: e.target.value,
																	check_answer: e.target.value
																		? "Correct Answer"
																		: "Wrong Answer",
																};
																setDataQuestionaire(dataQuestionaireTemp);
															}}
														>
															{fillInTheBlankInput}
														</Radio.Group>
													);
												}

												return (
													<div
														className={`content content-${index} ${
															index !== 0 ? "hide" : ""
														}`}
														key={index}
													>
														<span
															dangerouslySetInnerHTML={{
																__html: item.question,
															}}
														/>
														<Form.Item>{questionOption}</Form.Item>

														{dataQuestionaire[index].answer !== "" ? (
															<div
																className={`text-right ${
																	dataQuestionaire[index].check_answer ===
																	"Correct Answer"
																		? "color-1"
																		: "color-6"
																}`}
															>
																{dataQuestionaire[index].check_answer}
															</div>
														) : (
															""
														)}
													</div>
												);
											})}
										</Col>

										<Col xs={24} sm={24} md={24} className="m-t-md control">
											<div className="prev">
												<Button
													type="link"
													className={
														dataQuestionaireProgress.activeContent !== 0
															? "btn-main-invert"
															: "btn-main-invert-disabled-question"
													}
													onClick={handleClickPrev}
												>
													<FontAwesomeIcon
														icon={faArrowLeft}
														className="m-r-xs "
													/>{" "}
													<span>PREVIOUS</span>
												</Button>
											</div>

											<div className="next">
												{dataQuestionaireProgress.activeContent + 1 ===
												dataQuestionaire.length ? (
													<Button
														type="link"
														className={
															dataQuestionaire &&
															(dataQuestionaire[
																dataQuestionaireProgress.activeContent
															]?.question_type ===
																"Option 1 (More Questions)" ||
																dataQuestionaire[
																	dataQuestionaireProgress.activeContent
																]?.question_type ===
																	"Option 2 (No More Questions)")
																? "btn-main-invert"
																: dataQuestionaire[
																		dataQuestionaireProgress.activeContent
																  ]?.check_answer === "Correct Answer"
																? "btn-main-invert"
																: "btn-grey"
														}
														onClick={() => {
															// console.log(
															// 	"isLoadingCreateUserAnswer",
															// 	isLoadingCreateUserAnswer
															// );
															if (!isLoadingCreateUserAnswer) {
																let dataQuestionaireTemp =
																	dataQuestionaire[
																		dataQuestionaireProgress.activeContent
																	];

																let ifdataQuestionaireTemp =
																	dataQuestionaireTemp &&
																	(dataQuestionaireTemp.question_type ===
																		"Option 1 (More Questions)" ||
																		dataQuestionaireTemp.question_type ===
																			"Option 2 (No More Questions)");

																if (ifdataQuestionaireTemp) {
																	handleClickSubmit();
																} else {
																	if (
																		dataQuestionaireTemp.check_answer ===
																		"Correct Answer"
																	) {
																		handleClickSubmit();
																	}
																}
															}
														}}
														loading={isLoadingCreateUserAnswer}
													>
														<span>SUBMIT</span>
													</Button>
												) : (
													<Button
														type="link"
														className={
															dataQuestionaire &&
															(dataQuestionaire[
																dataQuestionaireProgress.activeContent
															]?.question_type ===
																"Option 1 (More Questions)" ||
																dataQuestionaire[
																	dataQuestionaireProgress.activeContent
																]?.question_type ===
																	"Option 2 (No More Questions)")
																? "btn-main-invert"
																: dataQuestionaire[
																		dataQuestionaireProgress.activeContent
																  ]?.check_answer === "Correct Answer"
																? "btn-main-invert"
																: "btn-grey"
														}
														onClick={() => {
															let dataQuestionaireTemp =
																dataQuestionaire[
																	dataQuestionaireProgress.activeContent
																];

															let ifdataQuestionaireTemp =
																dataQuestionaireTemp &&
																dataQuestionaireTemp.question_type !==
																	undefined &&
																(dataQuestionaireTemp.question_type ===
																	"Option 1 (More Questions)" ||
																	dataQuestionaireTemp.question_type ===
																		"Option 2 (No More Questions)");

															if (ifdataQuestionaireTemp) {
																handleClickNext();
															} else {
																if (
																	dataQuestionaireTemp.check_answer ===
																	"Correct Answer"
																) {
																	handleClickNext();
																}
															}
														}}
													>
														<span>NEXT</span>{" "}
														<FontAwesomeIcon
															icon={faArrowRight}
															className="m-l-xs"
														/>
													</Button>
												)}
											</div>
										</Col>
										{dataQuestionaireProgress.errMessage !== "" ? (
											<Col xs={24} sm={24} md={24} className="m-t-md control">
												<Alert
													message={dataQuestionaireProgress.errMessage}
													type="error"
													className="w-100 text-center"
												/>
											</Col>
										) : (
											""
										)}
									</Row>
								</div>
							</Form>
						</Collapse.Panel>
					</Collapse>
				</Col>
			</Row>

			<Modal
				open={toogleModalVideoFullscreen}
				className="modal-training-module-video-fullscreen"
				footer={null}
				onCancel={() => {
					setIsPlayingVideoModal(false);
					refReactPlayer.current.seekTo(
						refReactPlayerModal.current.getCurrentTime()
					);
					setTimeout(() => setToogleModalVideoFullscreen(false), 500);
				}}
				centered
			>
				<div className="react-player-modal-video-fullscreen-wrapper">
					<ReactPlayer
						className="react-player-modal-video-fullscreen"
						ref={refReactPlayerModal}
						url={dataSource?.data.embed_video}
						onPause={(e) => handlePauseVideo(e, 2)}
						playing={isPlayingVideoModal}
						width="100%"
						onEnded={() => handleEndedVideo(2)}
						playsinline
						volume={1}
						controls={false}
						config={{
							youtube: {
								playerVars: {
									disablekb: 1,
								},
							},
							vimeo: {
								playerOptions: {
									keyboard: false,
								},
							},
						}}
						onReady={() => {
							setModalVideoIsReady(true);
						}}
						onProgress={(e) => {
							if (e.played !== 0) {
								if (!videoDuration.seeking) {
									setVideoDuration({
										...videoDuration,
										played: e.played,
									});
								}
							}
						}}
					/>
				</div>

				<div className="ant-range-wrapper">
					<input
						type="range"
						className="ant-range"
						id="ant_range_modal"
						min={0}
						max={0.999999}
						step="any"
						value={videoDuration.played}
						onMouseDown={(e) => {
							setVideoDuration({
								...videoDuration,
								seeking: true,
								seekingVal:
									videoDuration.last_played > e.target.value
										? videoDuration.last_played
										: e.target.value,
							});
						}}
						onMouseUp={(e) => {
							setVideoDuration({
								...videoDuration,
								seeking: false,
							});

							if (videoDuration.seekingVal >= e.target.value) {
								refReactPlayerModal.current.seekTo(parseFloat(e.target.value));
							}
						}}
						onChange={(e) => {
							if (videoDuration.seekingVal >= e.target.value) {
								setVideoDuration({
									...videoDuration,
									played: parseFloat(e.target.value),
								});
							}
						}}
					/>
				</div>
				<div className="text-center m-t-sm">
					<Space size={3} className="space-video-buttons">
						{isPlayingVideoModal ? (
							<Button
								type="link"
								icon={<FontAwesomeIcon icon={faCirclePause} size="lg" />}
								className="color-1"
								onClick={() => {
									if (!isLoadingCreateUpdateUserLesson) {
										setIsPlayingVideoModal(false);
										refReactPlayer.current.seekTo(
											refReactPlayerModal.current.getCurrentTime()
										);
									}
								}}
								loading={isLoadingCreateUpdateUserLesson}
							/>
						) : (
							<Button
								type="link"
								icon={<FontAwesomeIcon icon={faCirclePlay} size="lg" />}
								className="color-1"
								onClick={() => {
									if (modalVideoIsReady) {
										setIsPlayingVideoModal(true);

										if (videoDuration.played) {
											refReactPlayerModal.current.seekTo(videoDuration.played);
										}
									}
								}}
							/>
						)}

						<Button
							type="link"
							icon={
								<FontAwesomeIcon
									icon={faRotateRight}
									size="lg"
									flip="horizontal"
								/>
							}
							className="color-1"
							onClick={() => {
								if (modalVideoIsReady) {
									refReactPlayerModal.current.seekTo(0);
									setIsPlayingVideoModal(true);
								}
							}}
						/>
					</Space>
				</div>
			</Modal>
		</Card>
	);
}
