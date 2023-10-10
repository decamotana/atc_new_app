import {
  Card,
  Row,
  Col,
  Collapse,
  Button,
  Typography,
  Form,
  Space,
} from "antd";
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faList,
  faHourglassClock,
  faRotateRight,
  faCheckCircle,
  faEyeSlash,
} from "@fortawesome/pro-regular-svg-icons";
import { GET, POST } from "../../../../providers/useAxiosQuery";

import TaskCard from "../../Components/TaskCard";

function PageTask() {
  const [rawTaskData, setTaskData] = useState([]);
  const [lastItem, setLastItem] = useState(null);
  const [id, setID] = useState(0);
  const [filteredTask, setFilteredTask] = useState([]);
  const [filter, setFilter] = useState("all");
  const [form] = Form.useForm();
  const default_task = ["WAIT FOR SALES REP", "PRODUCT PURCHASE", "MNDA"];
  const [isLoading, setIsLoading] = useState(false);
  const { Panel } = Collapse;

  const { mutate: mutateMarkCompleted } = POST(
    "api/v1/task/markcomplete",
    "markcomplete"
  );

  const [tasks, setTasks] = useState({
    completed: [],
    pending: [],
    inactive: [],
  });

  const { refetch: getTaskData, isLoading: isLoadingTask } = GET(
    `api/v1/task/` + { id },
    "get_task",
    (res) => {
      if (res.success) {
        function clean_description(description) {
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
        }

        let task_data = [];
        // res.data.reverse().map((item) => {
        //   if (task_data.length === 0) {
        //     task_data.push({
        //       id: item.id,
        //       title: item.title,
        //       description: clean_description(item.description),
        //       link: item.description.includes("href")
        //         ? item.description.split("\n")[
        //             item.description.split("\n").length - 1
        //           ]
        //         : "",
        //       hasLink: item.description.includes("href") ? true : false,
        //       assignedTo: item.assignedTo,
        //       dueDate: item.dueDate,
        //       hasButton: true,
        //       isCompleted: item.isCompleted,
        //       isActive: true,
        //     });
        //   } else {
        //     task_data.push({
        //       id: item.id,
        //       title: item.title,
        //       description: clean_description(item.description),
        //       link: item.description.includes("href")
        //         ? item.description.split("\n")[
        //             item.description.split("\n").length - 1
        //           ]
        //         : "",
        //       hasLink: item.description.includes("href") ? true : false,
        //       assignedTo: item.assignedTo,
        //       dueDate: item.dueDate,
        //       isCompleted: item.isCompleted,
        //       hasCompleteBtn:
        //         default_task.indexOf(item.title) === -1 ? false : true,
        //       // hasCompleteBtn: false,

        //       isActive: task_data[task_data.length - 1].isCompleted
        //         ? true
        //         : false,
        //     });
        //   }
        // });

        res.data.map((item) => {
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
              isDisabled: true,
              // dueDate: item.dueDate,
              // isCompleted: item.status === "pending" ? false : true,
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
              isDisabled: true,
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

        setTaskData(task_data);

        setTasks({
          completed: task_data.filter((task) => {
            // return (task.isActive === true) & (task.isCompleted === true);
            return task.isCompleted === "completed";
          }),
          pending: task_data.filter((task) => {
            // return (task.isActive === true) & (task.isCompleted === false);
            return task.isCompleted === "pending";
          }),
          inactive: task_data.filter((task) => {
            // return (task.isActive === false) & (task.isCompleted === false);
            return task.isCompleted === "upcoming";
          }),
        });

        setIsLoading(false);
      }
    }
  );

  // useEffect(() => {
  //   getTaskData();

  //   return () => {};
  // }, []);

  // useEffect(() => {
  //   if (isLoading === true) {
  //     $(".globalLoading").removeClass("hide");
  //   } else {
  //     $(".globalLoading").addClass("hide");
  //   }

  //   return () => {};
  // }, [isLoading]);

  //const MINUTE_MS = 15000;

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     getTaskData();
  //   }, MINUTE_MS);

  //   return () => clearInterval(interval);
  // }, []);

  useEffect(() => {
    form.setFieldsValue({
      filter: "All",
    });

    handleFilter("All");
  }, [rawTaskData]);

  const handleFilter = (val) => {
    let filtered = [];
    if (val === "Pending") {
      filtered = rawTaskData.filter((task) => {
        return task.isCompleted === false;
      });
    } else if (val === "Completed") {
      filtered = rawTaskData.filter((task) => {
        return task.isCompleted === true;
      });
    } else if (val === "All") {
      filtered = rawTaskData;
    }

    setFilteredTask(filtered);
  };

  return (
    <Card className="ant-design-dashboard">
      <Row style={{ display: "flex", flexDirection: "column" }}>
        <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
          <Button
            onClick={() => {
              setIsLoading(!isLoading);

              getTaskData();

              //       handRunInterval(true);
              // getTaskData();
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
      <Row gutter={[5, 5]} className="m-t-md">
        <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
          <Space wrap className="task-btn-space">
            <Button
              onClick={() => setFilter("all")}
              size="large"
              className={
                "btn-dashboard-task " +
                (filter === "all"
                  ? "btn-task-primary-active"
                  : "btn-task-primary")
              }
            >
              <FontAwesomeIcon icon={faList} style={{ marginRight: "5px" }} />
              All Tasks
            </Button>

            <Button
              onClick={() => setFilter("completed")}
              size="large"
              className={
                "btn-dashboard-task " +
                (filter === "completed"
                  ? "btn-task-active-active"
                  : "btn-task-active")
              }
            >
              <FontAwesomeIcon
                icon={faCheckCircle}
                style={{ marginRight: "5px" }}
              />
              Completed Tasks
            </Button>

            <Button
              onClick={() => setFilter("pending")}
              size="large"
              className={
                "btn-dashboard-task " +
                (filter === "pending"
                  ? "btn-task-pending-active"
                  : "btn-task-pending")
              }
            >
              <FontAwesomeIcon
                icon={faHourglassClock}
                style={{ marginRight: "5px" }}
              />
              Pending Tasks
            </Button>

            <Button
              onClick={() => setFilter("inactive")}
              size="large"
              className={
                "btn-dashboard-task " +
                (filter === "inactive"
                  ? "btn-task-inactive-active"
                  : "btn-task-inactive")
              }
            >
              <FontAwesomeIcon
                icon={faEyeSlash}
                style={{ marginRight: "5px" }}
              />
              Inactive Tasks
            </Button>
          </Space>
        </Col>
      </Row>
      {/* completed */}

      <Row>
        <Col xs={24} sm={24} md={20} lg={20} xl={20} xxl={20}>
          <Collapse
            className=" border-none panel-bordered"
            // expandIcon={({ isActive }) =>
            //   isActive ? (
            //     <span
            //       className="ant-menu-submenu-arrow"
            //       style={{ color: "#FFF", transform: "rotate(270deg)" }}
            //     ></span>
            //   ) : (
            //     <span
            //       className="ant-menu-submenu-arrow"
            //       style={{ color: "#FFF", transform: "rotate(90deg)" }}
            //     ></span>
            //   )
            // }
            defaultActiveKey={["1", "2", "3"]}
            expandIconPosition="start"
          >
            {(filter === "all" || filter === "completed") && (
              <Panel
                key="1"
                className="accordion bg-darkgray-form m-t-md bottom-padding-none the-completed-tasks"
                header="COMPLETED TASKS"
              >
                <Row gutter={[12, 12]} className="task-row">
                  {rawTaskData.length > 0 && tasks.completed.length !== 0 ? (
                    tasks.completed.map((item, index) => {
                      return (
                        <Col xs={24} sm={24} md={24} lg={12} key={index}>
                          {/* {!item.isActive && <div style={{background:'rgba(0, 0, 0, 0.5)',width:'100%', height:'100%', position:'absolute', zIndex:'1'}}></div>} */}
                          <TaskCard item={item} isDisabled={item.isDisabled} />
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
                        <Typography.Text>
                          NO COMPLETED TASKS FOUND
                        </Typography.Text>
                      </Col>
                    </>
                  )}
                </Row>
              </Panel>
            )}
            {(filter === "all" || filter === "pending") && (
              <Panel
                key="2"
                className="accordion bg-darkgray-form m-t-md bottom-padding-none the-pending-tasks"
                header="PENDING TASKS"
              >
                {" "}
                <Row gutter={[12, 12]} className="task-row">
                  {rawTaskData.length > 0 && tasks.pending.length !== 0 ? (
                    tasks.pending.map((item, index) => {
                      return (
                        <Col xs={24} sm={24} md={24} lg={12} key={index}>
                          {/* {!item.isActive && <div style={{background:'rgba(0, 0, 0, 0.5)',width:'100%', height:'100%', position:'absolute', zIndex:'1'}}></div>} */}
                          <TaskCard item={item} />
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
                        <Typography.Text>
                          NO PENDING TASKS FOUND
                        </Typography.Text>
                      </Col>
                    </>
                  )}
                </Row>
              </Panel>
            )}

            {(filter === "all" || filter === "inactive") && (
              <Panel
                key="3"
                className="accordion bg-darkgray-form m-t-md bottom-padding-none the-inactive-tasks"
                header="INACTIVE TASKS"
              >
                {" "}
                <Row gutter={[12, 12]} className="task-row">
                  {rawTaskData.length > 0 && tasks.inactive.length !== 0 ? (
                    <Col xs={24} sm={24} md={24} lg={12}>
                      {/* {!item.isActive && <div style={{background:'rgba(0, 0, 0, 0.5)',width:'100%', height:'100%', position:'absolute', zIndex:'1'}}></div>} */}
                      <TaskCard
                        item={tasks?.inactive[0]}
                        isDisabled={tasks?.inactive[0]?.isDisabled}
                      />
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
                        <Typography.Text>
                          NO INACTIVE TASKS FOUND
                        </Typography.Text>
                      </Col>
                    </>
                  )}
                </Row>
              </Panel>
            )}
          </Collapse>
        </Col>
      </Row>

      {/* end */}
    </Card>
  );
}

export default PageTask;
