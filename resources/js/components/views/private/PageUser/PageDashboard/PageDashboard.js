import {
  Card,
  Steps,
  TimePicker,
  Row,
  Col,
  Typography,
  Button,
  notification,
  Alert,
  Modal,
  Progress,
  Space,
} from "antd";
import React, { useEffect, useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import {
  faChevronLeft,
  faChevronRight,
  faClock,
  faRotate,
  faUserCheck,
  faUserClock,
  faUserVneckHair,
  faUserXmark,
  faRotateRight,
  faHourglassClock,
  faEyeSlash,
  faList,
  faArrowRight,
} from "@fortawesome/pro-regular-svg-icons";

import $, { data } from "jquery";
import {
  GET,
  GETMANUAL,
  GETWITHOUTLOADING,
  POST,
} from "../../../../providers/useAxiosQuery";
import { useHistory } from "react-router";
import TaskCard from "../../Components/TaskCard";
import {
  faCartArrowUp,
  faCartCirclePlus,
  faHourglass1,
  faLoveseat,
} from "@fortawesome/pro-solid-svg-icons";
import {
  OpportunitySteps,
  OpportunitySubSteps,
} from "../../Components/OpportunitySteps";
import moment from "moment";
import { ComponentLoading } from "../../Components/ComponentLoading";
import { userData } from "../../../../providers/companyInfo";

function PageDashboard({ match }) {
  // const userData = userData;
  const appointment_id = localStorage.getItem("appointment_id");
  const history = useHistory();
  const { Step } = Steps;
  const [current, setCurrent] = useState();
  const [userCurrentStage, setUserCurrentStage] = useState();
  const [stage, setStages] = useState([]);
  const [stageDetails, setStageDetails] = useState([]);
  const [allTags, setAllTags] = useState([]);

  const [count, setCount] = useState(4);
  const [addOn, setAddOn] = useState(0);
  const [completedTask, setCompletedTask] = useState([]);
  const [oldTask, setOldTask] = useState("");
  const [id, setID] = useState(0);
  const [currentTask, setCurrentTask] = useState("");
  const [upcomingTask, setUpcomingTask] = useState("");
  const [message, setMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasFreeUpdate, setHasFreeUpdate] = useState(true);
  const [showTellUs, setShowTellUs] = useState(false);
  const [windowSize, setWindowSize] = useState(getWindowSize());
  const [showUpdateChoices, setUpdateChoices] = useState(false);
  const [showConfirmBookModal, setShowConfirmBookModal] = useState(false);
  const [bookingData, setBookingData] = useState([]);
  const [hasPurchased, setHasPurchased] = useState(false);

  const upcomingRef = useRef(null);
  const pendingRef = useRef(null);

  const stage_name = [
    "APP ANALYSIS",
    "CLIENT STAGE",
    "SET APPT.",
    "DEVELOPMENT",
    "PUBLISH",
    "COMPLETE",
  ];

  const scrollToSection = (ref) => {
    if (ref == "pending") {
      pendingRef.current?.scrollIntoView({ behavior: "smooth" });
    } else {
      upcomingRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (history.location) {
      let message = history.location.state
        ? history.location.state.message
        : "";

      if (message != "") {
        setMessage(message);
        setShowMessage(true);
        setUpdateChoices(false);
        setHasPurchased(true);
      }
    }
  }, [match]);

  useEffect(() => {
    if (appointment_id) {
      refetchAppointment();
    }
  }, [appointment_id]);

  useEffect(() => {
    function handleWindowResize() {
      setWindowSize(getWindowSize());
    }

    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  function getWindowSize() {
    const { innerWidth, innerHeight } = window;
    return { innerWidth, innerHeight };
  }

  useEffect(() => {
    if (windowSize.innerWidth <= 1440 && windowSize.innerWidth > 1024) {
      setCount(4);
      setAddOn(0);
    } else if (windowSize.innerWidth <= 1024 && windowSize.innerWidth > 426) {
      setCount(3);
      setAddOn(0);
    } else if (windowSize.innerWidth <= 426) {
      setCount(1);
      setAddOn(0);
    }
  }, [windowSize.innerWidth]);

  const { data: dataOpportunity, refetch: refetchOpportunity } =
    GETWITHOUTLOADING("api/v1/user/opportunity", "opportunity", (res) => {
      if (res.success) {
        res.pipeline_stages.forEach((item, index) => {
          if (item.status == "process") {
            setCurrent(index);
            setUserCurrentStage(index);

            if (index < 2) {
              setAddOn(index);
            } else if (index > 2 && index < 6) {
              setAddOn(2);
            }

            setCurrent(index);
            if (index <= 2) {
              setAddOn(index);
            } else if (
              index > 2 &&
              windowSize.innerWidth <= 1440 &&
              windowSize.innerWidth > 1024
            ) {
              setAddOn(2);
            } else if (
              index > 2 &&
              windowSize.innerWidth <= 1024 &&
              windowSize.innerWidth > 426
            ) {
              setAddOn(3);
            } else if (windowSize.innerWidth <= 426) {
              setAddOn(index);
            }
          }
        });

        console.log("opportunity__", res);

        setStages(res.pipeline_stages);
      }
    });

  const { refetch: refetchAllTags, isLoading: isLoadingTags } =
    GETWITHOUTLOADING(
      `api/v1/user/getalltags?user_id=${userData().id}`,
      ["dataAllTask", "get_task"],
      (res) => {
        if (res.success) {
          if (res.dataAllTask.includes("status")) {
            setShowTellUs(true);
            // setRunInterval(false);
          } else if (res.dataAllTask[0] === "still waiting") {
            setShowTellUs(true);
            // setRunInterval(false);
          } else if (res.dataAllTask[0] === "interview soon") {
            setShowTellUs(true);
            // setRunInterval(false);
          } else if (res.dataAllTask.includes("pre publish")) {
            if (!hasPurchased) {
              setUpdateChoices(true);
              localStorage.setItem("currentTask", "update choice");
            }
          } else if (res.dataAllTask.includes("end of job search")) {
            setShowTellUs(false);
          }

          if (res.dataAllTask.includes("book (current task)")) {
            if (currentTask[0].title.toUpperCase() !== "BOOK APPOINTMENT")
              refetchStages();
          } else {
            setAllTags(res.dataAllTask);
            // if (
            //   res.dataAllTask.includes("hired") ||
            //   res.dataAllTask.includes("still waiting") ||
            //   res.dataAllTask.includes("interview soon") ||
            //   res.dataAllTask.includes("end of job search")
            // ) {
            //   setRunInterval(false);
            // }
          }

          console.log("currentData", res.dataAllTask);
          // console.log("currentData", res.dataAllTask.includes("pre publish"));
        }
      }
    );

  // useEffect(() => {
  //   if (allTags.length > 0) {
  //     getTaskData();
  //   }
  // }, [allTags]);

  const { data: freeOneHourUpdate, refetch: refetchOneHourUpdate } =
    GETWITHOUTLOADING(
      "api/v1/user/get_one_hour_update",
      "freeOneHourUpdate",
      (res) => {
        if (res.success) {
          res.freeOneHourUpdate == 1
            ? setHasFreeUpdate(true)
            : setHasFreeUpdate(false);
        }
      }
    );

  const { refetch: refetchStages } = GETWITHOUTLOADING(
    "api/v1/user/stages",
    "stages",
    (res) => {
      if (res.success) {
        setStageDetails(res.data);
      }
    }
  );

  //GET ALL APPOINTMENTS
  const { data: newOpenedAppointment, refetch: refetchAppointment } = GETMANUAL(
    "api/v1/appointments/" + appointment_id,
    "appointment_details",
    (res) => {
      if (res.success) {
        setShowConfirmBookModal(true);
        setBookingData(res.data);
      } else {
        notification.warning({
          message: "Warning",
          description: res.message,
          onClose: () => {
            localStorage.removeItem("appointment_id");
          },
        });
      }
    }
  );

  const MINUTE_MS = 10000;
  const [loadInterval, setLoadInterval] = useState();
  const [runInterval, setRunInterval] = useState(false);

  //this is running interval on reload
  // useEffect(() => {
  //   if (runInterval) {
  //     var interval = setInterval(() => {
  //       fetchAll();
  //     }, MINUTE_MS);

  //     setLoadInterval(interval);
  //     return () => clearInterval(interval);
  //   } else {
  //     setIsLoading(false);
  //     clearInterval(loadInterval);
  //   }
  // }, [runInterval]);

  const onChange = (value) => {
    setCurrent(value + addOn);
  };

  const {
    mutate: mutateNotifyConsultant,
    isLoading: isLoadingNotifyConsultant,
  } = POST("api/v1/user/add_selected_tag", [
    "selected_tag",
    "opportunity",
    "get_task",
  ]);

  const onClickedIamSelected = () => {
    Modal.confirm({
      title: "Confirm",
      icon: <ExclamationCircleOutlined />,
      content: "Notify ATC Consultant that you have been selected?",
      okText: "Yes",
      cancelText: "Cancel",
      onOk: () => {
        let data = {
          user_id: userData().id,
        };
        mutateNotifyConsultant(data, {
          onSuccess: (res) => {
            if (res.success) {
              setUpdateChoices(false);
              notification.success({
                message: "Success",
                description: res.message,
              });
            } else {
              notification.success({
                message: "Warning",
                description: res.message,
              });
            }
          },
        });
      },
    });
  };

  const { mutate: mutateAddAppointments, isLoading: isLoadingAddAppointments } =
    POST("api/v1/appointment", "book_appointment");

  const appointmentNotifModal = (data) => {};

  const onClickedNotify = (value) => {
    Modal.confirm({
      title: "Confirm",
      icon: <ExclamationCircleOutlined />,
      content: "Confirm status " + value + " ?",
      okText: "Yes",
      cancelText: "Cancel",
      onOk: () => {
        let data = {
          tag: value,
          user_id: userData().id,
        };

        mutateInterviewFeedback(data, {
          onSuccess: (res) => {
            if (value == "hired") {
              setShowTellUs(false);
            }

            if (res.success) {
              notification.success({
                message: "Success",
                description: res.message,
              });

              refetchAllTags();
            } else {
              notification.success({
                message: "Warning",
                description: res.message,
              });
            }
          },
        });
      },
    });
  };

  const handleAddOneHourUpdateTag = () => {
    Modal.confirm({
      title: "Confirm",
      icon: <ExclamationCircleOutlined />,
      content: "Use Free One Hour Update?",
      okText: "Yes",
      cancelText: "Cancel",
      onOk: () => {
        mutateAddOneHourUpdateTag("", {
          onSuccess: (res) => {
            if (res.success) {
              setUpdateChoices(false);
              notification.success({
                message: "Success",
                description: res.message,
              });
              fetchAll();
              setRunInterval(true);
            } else {
              notification.success({
                message: "Warning",
                description: res.message,
              });
            }
          },
        });
      },
    });
  };

  const {
    mutate: mutateInterviewFeedback,
    isLoading: isLoadingInterviewFeedback,
  } = POST("api/v1/user/add_interview_feedback", [
    "interview_feedback",
    "dataAllTask",
  ]);

  useEffect(() => {
    // Check if the item exists in local storage
    const item = localStorage.getItem("currentTask");

    if (!item) {
      // If the item doesn't exist, create it and set its value
      localStorage.setItem("currentTask", "");
    }
  }, []);

  const clean_description = (description) => {
    let newDescription = "";

    if (description.includes("<br/>")) {
      newDescription = description.split("<br/>")[0];
    } else if (description.includes("<a")) {
      newDescription = description.split("<a")[0];
    } else if (description.includes("Click here to")) {
      newDescription = description.split("Click")[0];
    } else if (description.includes("click here")) {
      newDescription = description.split("click")[0];
    } else {
      newDescription = description;
    }

    return newDescription;
  };

  const { refetch: getTaskData, isLoading: isLoadingTask } = GETMANUAL(
    `api/v1/task/` + { id },
    "get_task",
    (res) => {
      if (res.success) {
        let task_data = [];
        let all_tag = res.tags;
        res.data.reverse().map((item) => {
          if (task_data.length === 0) {
            task_data.push({
              id: item.id,
              title: item.title,
              description: clean_description(item.description),
              link: item.description.includes("href")
                ? item.description.split("\n")[
                    item.description.split("\n").length - 1
                  ]
                : "",
              hasLink: item.description.includes("href") ? true : false,
              assignedTo: item.assignedTo,
              isCompleted: item.status,
              // dueDate: item.dueDate,
              // isCompleted: item.status === "pending" ? false : true,
              // isActive: true,
            });
          } else {
            task_data.push({
              id: item.id,
              title: item.title,
              description: clean_description(item.description),
              link: item.description.includes("href")
                ? item.description.split("\n")[
                    item.description.split("\n").length - 1
                  ]
                : "",
              hasLink: item.description.includes("href") ? true : false,
              assignedTo: item.assignedTo,
              isCompleted: item.status,
              // dueDate: item.dueDate,
              // isCompleted: item.status === "pending" ? false : true,
              // isActive: task_data[task_data.length - 1].isCompleted
              //   ? true
              //   : false,
            });
          }
        });

        task_data.sort((a, b) =>
          a.isActive > b.isActive ? 1 : b.isCompleted > a.isCompleted ? -1 : 0
        );

        let current_task = task_data.filter((task) => {
          // return (task.isActive == true) & (task.isCompleted == false);
          return task.isCompleted === "pending";
        });

        let upcoming_task = task_data.filter((task) => {
          // return (task.isActive == false) & (task.isCompleted == false);
          return task.isCompleted === "upcoming";
        });

        let completed_task = task_data.filter((task) => {
          // return (task.isActive == true) & (task.isCompleted == true);
          return task.isCompleted === "completed";
        });

        // console.log("get_task", current_task);

        if (
          current_task.filter((p) =>
            [
              "BOOK APPOINTMENT",
              "UPLOAD REQUIREMENTS / HOMEWORK",
              "CONSULTATION CALL",
            ].includes(p.title.toUpperCase())
          ).length > 0
        ) {
          if (
            current_task.find(
              (p) => p.title.toUpperCase() == "BOOK APPOINTMENT"
            ) &&
            all_tag.find((p) => p.includes("book (current task"))
          ) {
            console.log("here");
            setCurrentTask(current_task);
            setUpcomingTask(upcoming_task);
            setCompletedTask(completed_task);
          }
          if (
            current_task.find(
              (p) => p.title.toUpperCase() == "UPLOAD REQUIREMENTS / HOMEWORK"
            ) &&
            all_tag.find((p) =>
              p.includes("upload requirements (current task)")
            )
          ) {
            setCurrentTask(current_task);
            setUpcomingTask(upcoming_task);
            setCompletedTask(completed_task);
          }
          if (
            current_task.find(
              (p) => p.title.toUpperCase() == "CONSULTATION CALL"
            ) &&
            all_tag.find((p) => p.includes("call (current task)"))
          ) {
            setCurrentTask(current_task);
            setUpcomingTask(upcoming_task);
            setCompletedTask(completed_task);
          }
        } else {
          setCurrentTask(current_task);
          setUpcomingTask(upcoming_task);
          setCompletedTask(completed_task);
        }

        if (
          current_task.find((p) => p.title.toUpperCase() !== "PRODUCT PURCHASE")
        ) {
          setShowMessage(false);
          setHasPurchased(false);
        }

        // console.log("oldTask: ", oldTask);
        // console.log("current_task: ", current_task);

        let oldTask = localStorage.getItem("currentTask");
        let fetchedTask = task_data.length != 0 ? current_task[0]?.title : null;

        if (fetchedTask) {
          {
            if (oldTask !== "" || oldTask !== "undefined") {
              if (oldTask !== fetchedTask) {
                localStorage.setItem("currentTask", fetchedTask);
                setRunInterval(false);
              }
            } else {
              localStorage.setItem("currentTask", fetchedTask);
            }
          }
        }
      }
    }
  );

  const {
    mutate: mutateAddOneHourUpdateTag,
    isLoading: isLoadingUpdateFreeHourUpdate,
  } = POST("api/v1/user/add_one_hour_update_tag", "freeOneHourUpdate");

  const fetchAll = () => {
    refetchAllTags();
    refetchOpportunity();
    refetchStages();
    getTaskData();
    refetchOneHourUpdate();
  };

  useEffect(() => {
    fetchAll();
    return () => {};
  }, []);

  return (
    <>
      <Card className="ant-design-dashboard">
        {showMessage && (
          <Row>
            <Col xs={24} sm={24} md={24} lg={24} xl={12} xxl={12}>
              <Alert
                message={message}
                style={{ maxWidth: "100%", marginBottom: "20px" }}
                type="success"
                showIcon
              />
            </Col>
          </Row>
        )}

        <Row
          style={{ display: "flex", flexDirection: "column" }}
          className="m-b-md"
        >
          <Col
            xs={24}
            sm={24}
            md={24}
            lg={24}
            xl={24}
            xxl={24}
            // className="m-b-lg"
          >
            <Button
              onClick={() => {
                setIsLoading(true);
                setRunInterval(true);
                fetchAll();

                setInterval(() => {
                  setIsLoading(false);
                }, 2000);
              }}
              size="medium"
              className="btn-warning btn-dashboard-reload"
              loading={isLoading}
            >
              {" "}
              {!isLoading && (
                <FontAwesomeIcon
                  icon={faRotateRight}
                  style={{ marginRight: "5px" }}
                />
              )}
              Reload
            </Button>

            {/* <Typography.Paragraph style={{ marginTop: "5px" }}>
              Update & Refresh Page Data
            </Typography.Paragraph> */}
          </Col>
        </Row>

        {showTellUs && (
          <Row gutter={16} className="client-status ">
            <Col
              sm={24}
              md={24}
              lg={
                windowSize.innerWidth <= 1024 && windowSize.innerWidth > 768
                  ? 24
                  : 12
              }
            >
              <Card
                className="m-t-sm"
                headStyle={{
                  marginTop: "10px",
                }}
              >
                <Row>
                  <Col sm={24} md={24}>
                    <Typography.Text className="task-card-category ">
                      Let us know how the interview went
                    </Typography.Text>
                  </Col>
                </Row>
                <Row gutter={16} className="m-t-md">
                  <Col xs={24} sm={24} md={24}>
                    <Row gutter={[12, 12]}>
                      <Col xs={24} sm={24} md={12} lg={12}>
                        <Button
                          onClick={() => {
                            onClickedNotify("hired");
                          }}
                          size="small"
                          className="btn-primary btn-dashboard-interview"
                        >
                          {" "}
                          <FontAwesomeIcon
                            style={{ marginRight: "5px" }}
                            icon={faUserCheck}
                          />
                          HIRED !
                        </Button>
                      </Col>{" "}
                      <Col xs={24} sm={24} md={12} lg={12}>
                        <Button
                          onClick={() => {
                            onClickedNotify("interview soon");
                          }}
                          size="small"
                          className="btn-primary btn-dashboard-interview"
                        >
                          {" "}
                          <FontAwesomeIcon
                            style={{ marginRight: "5px" }}
                            icon={faUserVneckHair}
                          />
                          INTERVIEW SOON
                        </Button>
                      </Col>{" "}
                      <Col xs={24} sm={24} md={12} lg={12}>
                        <Button
                          onClick={() => {
                            onClickedNotify("still waiting");
                          }}
                          size="small"
                          className="btn-primary btn-dashboard-interview"
                        >
                          {" "}
                          <FontAwesomeIcon
                            style={{ marginRight: "5px" }}
                            icon={faUserClock}
                          />
                          STILL WAITING
                        </Button>
                      </Col>{" "}
                      <Col xs={24} sm={24} md={12} lg={12}>
                        <Button
                          onClick={() => {
                            onClickedNotify("end of job search");
                          }}
                          size="small"
                          className="btn-primary btn-dashboard-interview"
                        >
                          {" "}
                          <FontAwesomeIcon
                            style={{ marginRight: "5px" }}
                            icon={faUserXmark}
                          />
                          END OF JOB SEARCH
                        </Button>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
        )}

        {showUpdateChoices && (
          <Row gutter={8}>
            <Col xs={24} sm={24} md={24} lg={6} className="m-b-lg">
              <Row>
                <Col xs={24} sm={24} md={24} lg={24} className="m-b-lg">
                  <Button
                    onClick={() => {
                      onClickedIamSelected();

                      if (isLoading) {
                        setRunInterval(false);
                      }

                      // getTaskData();
                    }}
                    size="small"
                    className="btn-primary btn-dashboard"
                    loading={isLoadingNotifyConsultant}
                  >
                    {" "}
                    <FontAwesomeIcon
                      style={{ marginRight: "5px" }}
                      icon={faUserCheck}
                    />
                    GOT SELECTED !
                  </Button>
                </Col>
              </Row>
              <Row>
                {hasFreeUpdate === false ? (
                  <Col xs={24} sm={24} md={24} lg={24}>
                    <Button
                      onClick={() => {
                        setUpdateChoices(false);
                        window.open(
                          "https://myairlinetc.com/product/1-hour-update/",
                          "_blank"
                        );

                        if (isLoading) {
                          setRunInterval(false);
                        }

                        // getTaskData();
                      }}
                      size="small"
                      className="btn-primary btn-dashboard"
                    >
                      <FontAwesomeIcon
                        style={{ marginRight: "5px" }}
                        icon={faCartCirclePlus}
                      />
                      Purchase One hour update
                    </Button>
                  </Col>
                ) : (
                  <Col xs={24} sm={24} md={24} lg={24}>
                    <Button
                      onClick={() => {
                        handleAddOneHourUpdateTag();

                        if (isLoading) {
                          setRunInterval(false);
                        }
                      }}
                      size="small"
                      className="btn-primary btn-dashboard"
                    >
                      <FontAwesomeIcon
                        style={{ marginRight: "5px" }}
                        icon={faClock}
                      />
                      Free One Hour Update
                    </Button>
                  </Col>
                )}
              </Row>
            </Col>
          </Row>
        )}

        <Row className="btn-dashboard-row">
          <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
            <Space wrap className="dash-btn-space">
              <Button
                type="link"
                onClick={() => {
                  history.push("/task");
                }}
                size="large"
                className="btn-dashboard-task btn-task-primary"
              >
                <FontAwesomeIcon icon={faList} style={{ marginRight: "5px" }} />
                All Tasks
              </Button>
              <Button
                type="link"
                onClick={() => {
                  scrollToSection("pending");
                }}
                size="large"
                className="btn-dashboard-task btn-task-pending"
              >
                <FontAwesomeIcon
                  icon={faHourglassClock}
                  style={{ marginRight: "5px" }}
                />
                Pending Tasks
              </Button>

              <Button
                type="link"
                onClick={() => {
                  scrollToSection("upcoming");
                }}
                size="large"
                className="btn-dashboard-task btn-task-upcoming"
              >
                <FontAwesomeIcon
                  icon={faArrowRight}
                  style={{ marginRight: "5px" }}
                />
                Upcoming Tasks
              </Button>
            </Space>
          </Col>

          {/* <Col></Col>

          <Col></Col> */}
        </Row>

        {/* progress timeline */}
        <Row className="m-t-lg">
          <Col xs={24} sm={24} md={20} lg={20} xl={20} xxl={20}>
            <Card
              headStyle={{ backgroundColor: "#fbfbfb", color: "#325db8" }}
              bodyStyle={{
                minHeight: 200,
                paddingBottom: 10,
              }}
              title="PROGRESS TIMELINE"
              className="card-primary-new-primary"
            >
              {stage.length > 0 && userCurrentStage != undefined ? (
                <>
                  {" "}
                  <Row>
                    <Col
                      xs={24}
                      sm={24}
                      md={24}
                      lg={24}
                      xl={24}
                      xxl={24}
                      className="stage-desc "
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        marginBottom: "20px",
                      }}
                    >
                      <Progress
                        style={{ width: "80%" }}
                        percent={
                          stage &&
                          userCurrentStage &&
                          (((userCurrentStage + 1) / 6) * 100).toFixed(2)
                        }
                      />
                    </Col>
                  </Row>
                  <OpportunitySteps
                    stage={stage}
                    count={count}
                    addOn={addOn}
                    current={current}
                    limit={stage && stage.length}
                    stageName={stage_name}
                    setCurrent={setCurrent}
                    onChange={onChange}
                    setAddOn={setAddOn}
                  />
                  {[2, 3, 4].includes(current) &&
                    dataOpportunity &&
                    dataOpportunity.pipeline_stages_appointment.length != 0 && (
                      <OpportunitySubSteps
                        current={current}
                        dataOpportunity={dataOpportunity}
                        windowSize={windowSize}
                      />
                    )}
                  <Row className="m-t-lg">
                    <Col
                      xs={24}
                      sm={24}
                      md={24}
                      lg={24}
                      xl={12}
                      xxl={12}
                      className="stage-desc"
                    >
                      <Card
                        style={{
                          // height: "300px",
                          width: "100%",
                          border: "1px solid #c1c1c1",
                        }}
                        title={
                          stageDetails.length > 0 &&
                          (stageDetails[current]?.title === "Set Appt." ? (
                            <>
                              <strong>STEP{" " + (current + 1)} </strong>
                              <span className="stage-title">
                                {" - Set Appointment"}
                              </span>
                            </>
                          ) : (
                            <>
                              <strong>STEP{" " + (current + 1)} </strong>
                              <span className="stage-title">
                                {" - " + stageDetails[current]?.title}
                              </span>
                            </>
                          ))
                        }
                        className="dash-step-card"
                        headStyle={{
                          background: "#d5e2fe",
                          color: "#325db8",
                          fontSize: "18px",
                          display: "flex",

                          alignItems: "center",
                        }}
                      >
                        <div className="dash-step-description">
                          {stageDetails.length > 0 && (
                            <div
                              style={{ overflowWrap: "anywhere" }}
                              dangerouslySetInnerHTML={{
                                __html: stageDetails[current].description,
                              }}
                            />
                          )}
                        </div>
                      </Card>
                    </Col>
                  </Row>{" "}
                </>
              ) : (
                <ComponentLoading />
              )}
            </Card>
          </Col>
        </Row>

        <Row className="m-t-lg">
          <Col xs={24} sm={24} md={20} lg={20} xl={20} xxl={20}>
            <Card
              loading={isLoadingTask || isLoadingTags}
              ref={pendingRef}
              bodyStyle={{ paddingBottom: 10 }}
              title="PENDING TASKS"
              className="card-primary-new-pending"
            >
              <Row gutter={[12, 12]} className="task-row">
                {currentTask.length > 0 ? (
                  currentTask
                    .filter((task) => {
                      return (
                        // task.isActive === true && task.isCompleted === false
                        task.isCompleted === "pending"
                      );
                    })
                    .map((item, index) => {
                      return (
                        <Col
                          xs={24}
                          sm={24}
                          md={24}
                          lg={24}
                          xl={12}
                          xxl={12}
                          key={index}
                        >
                          {/* {!item.isActive && <div style={{background:'rgba(0, 0, 0, 0.5)',width:'100%', height:'100%', position:'absolute', zIndex:'1'}}></div>} */}
                          <TaskCard item={item} showButton={showMessage} />
                        </Col>
                      );
                    })
                ) : (
                  <>
                    <Col
                      xs={24}
                      sm={24}
                      md={24}
                      lg={24}
                      className="no-task-found"
                    >
                      {/* {!item.isActive && <div style={{background:'rgba(0, 0, 0, 0.5)',width:'100%', height:'100%', position:'absolute', zIndex:'1'}}></div>} */}
                      <Typography.Text>NO PENDING TASKS FOUND</Typography.Text>
                    </Col>
                  </>
                )}
              </Row>
            </Card>
          </Col>
        </Row>

        <Row className="m-t-lg">
          <Col xs={24} sm={24} md={20} lg={20} xl={20} xxl={20}>
            <Card
              loading={isLoadingTask || isLoadingTags}
              ref={upcomingRef}
              headStyle={{ backgroundColor: "#fbfbfb", color: "#881dd6" }}
              bodyStyle={{ paddingBottom: 10 }}
              title="UPCOMING TASKS"
              className="card-primary-new-upcoming"
            >
              <Row gutter={[12, 12]} className="task-row">
                {upcomingTask.length > 0 ? (
                  <Col xs={24} sm={24} md={24} lg={24} xl={12} xxl={12}>
                    {/* {!item.isActive && <div style={{background:'rgba(0, 0, 0, 0.5)',width:'100%', height:'100%', position:'absolute', zIndex:'1'}}></div>} */}
                    <TaskCard item={upcomingTask[0]} isDisabled={true} />
                  </Col>
                ) : (
                  <>
                    <Col
                      xs={24}
                      sm={24}
                      md={24}
                      lg={24}
                      className="no-task-found"
                    >
                      {/* {!item.isActive && <div style={{background:'rgba(0, 0, 0, 0.5)',width:'100%', height:'100%', position:'absolute', zIndex:'1'}}></div>} */}
                      <Typography.Text>NO UPCOMING TASKS FOUND</Typography.Text>
                    </Col>
                  </>
                )}
              </Row>
            </Card>
          </Col>
        </Row>
        <Modal
          visible={showConfirmBookModal}
          title="Confirm"
          onCancel={() => {
            setShowConfirmBookModal(false);
            localStorage.removeItem("appointment_id");
          }}
          footer={
            <Space>
              <Button
                type="primary"
                className="atc-btn-opposite"
                onClick={() => {
                  let timeslot =
                    moment(bookingData?.schedule_date).format("YYYY-MM-DD") +
                    "T" +
                    moment(bookingData?.time_start, "HH:mm").format("HH:mm:ss");

                  let appointment_data = {
                    appointmentDate: data?.date,
                    // timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                    timezone: "US/Mountain",
                    timeslot: timeslot + "-06:00",
                    slot_id: bookingData?.id,
                    calendarID: bookingData?.user.go_high_level_id,
                  };

                  mutateAddAppointments(appointment_data, {
                    onSuccess: (res) => {
                      if (res.success) {
                        notification.success({
                          message: "Success",
                          description: "Successfully booked",
                        });

                        history.push({
                          pathname: "/appointment/myschedule",
                        });
                        localStorage.removeItem("appointment_id");
                      } else if (res.success == false) {
                        notification.warning({
                          message: "Not allowed",
                          description: res.message,
                        });
                        localStorage.removeItem("appointment_id");
                      }
                    },
                  });
                }}
              >
                Yes
              </Button>
            </Space>
          }
        >
          <>
            {" "}
            <div style={{ fontSize: "15px", color: "#3f5fac" }}>
              <strong> Do you want to book this appointment? </strong>
            </div>
            <div> </div>
            <div style={{ fontSize: "14px", marginTop: "10px" }}>
              <strong>Consultant: </strong>

              {bookingData?.user?.firstname + " " + bookingData?.user?.lastname}
            </div>{" "}
            <div style={{ fontSize: "14px" }}>
              <strong>Date: </strong>

              {moment(bookingData?.schedule_date).format("dddd, MMMM Do")}
            </div>
            <div style={{ fontSize: "14px" }}>
              <strong>Time start: </strong> {bookingData?.time_start}
            </div>
            <div style={{ fontSize: "14px" }}>
              <strong>Time end: </strong> {bookingData?.time_end}
            </div>
          </>
        </Modal>
      </Card>
    </>
  );
}

export default PageDashboard;
