import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import {
  Form,
  Col,
  Card,
  Row,
  Collapse,
  Typography,
  Divider,
  Button,
  Table,
  Steps,
  List,
  Modal,
  Space,
  notification,
  Image,
  Tag,
  Tooltip,
  Upload,
  message,
} from "antd";

import {
  faArrowUpRightFromSquare,
  faEye,
  faRotateRight,
  faArrowUpFromBracket,
} from "@fortawesome/pro-regular-svg-icons";

import { GET, POST } from "../../../../providers/useAxiosQuery";
import { userData } from "../../../../providers/companyInfo";

import FloatInput from "../../../../providers/FloatInput";
import FloatSelect from "../../../../providers/FloatSelect";
import FloatTextArea from "../../../../providers/FloatTextArea";
import FloatInputWithButttons from "../../../../providers/FloatInputWithButttons";
import optionStateCodesUnitedState from "../../../../providers/optionStateCodesUnitedState";
import optionStateCodesCanada from "../../../../providers/optionStateCodesCanada";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ExclamationCircleOutlined, WindowsFilled } from "@ant-design/icons";

import { faPlus, faTrash, faDownload } from "@fortawesome/pro-solid-svg-icons";

import {
  TablePageSize,
  TableGlobalSearch,
  TableShowingEntries,
  TablePagination,
} from "../../Components/ComponentTableFilter";
import $ from "jquery";

import TaskCard from "../../Components/TaskCard";
import moment from "moment";

import {
  OpportunitySteps,
  OpportunitySubSteps,
} from "../../Components/OpportunitySteps";
import ModalFileView from "../../Components/ModalFileView";

function PageUserForm() {
  // const history = useHistory();
  const { Step } = Steps;
  const { id } = useParams();
  const [user, setUsersData] = useState([]);
  const [form] = Form.useForm();
  const [stage, setStages] = useState([]);
  const [notes, setNotes] = useState("");
  const [tags, setUserTags] = useState([]);
  const [count, setCount] = useState(4);
  const [addOn, setAddOn] = useState(0);
  const [currentTask, setCurrentTask] = useState("");
  const [upcomingTask, setUpcomingTask] = useState("");
  const [current, setCurrent] = useState(0);
  const [user_notes, setUserNotes] = useState([]);
  const [visible, setVisible] = useState(false);
  const [fileSrc, setFileSrc] = useState("");
  const [fileExt, setFileExt] = useState("");
  const [base64File, setBase64File] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [windowSize, setWindowSize] = useState(getWindowSize());
  const [uploadFields, setUploadFields] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const userdata = userData();

  const stage_name = [
    "APP ANALYSIS",
    "CLIENT STAGE",
    "SET APPT.",
    "DEVELOPMENT",
    "PUBLISH",
    "COMPLETE",
  ];

  const [tableFilter, setTableFilter] = useState({
    id: id,
    page: 1,
    page_size: 15,
    search: "",
    sort_field: "id",
    sort_order: "desc",
  });

  const [tableTotal, setTableTotal] = useState(0);

  const { data: dataGetFileList, refetch: getfilelist } = GET(
    `api/v1/dropbox/getfilelist?${$.param(tableFilter)}`,
    "get_list",
    (res) => {
      if (res.success) {
        setDataSource(res.data.data);
        setTableTotal(res.data.total);
      }
    }
  );

  const { refetch: getAndUpdateUsersTags } = GET(
    `api/v1/admin/updateusertags/${id}`,
    "get_and_update_user_tags",
    (res) => {
      if (res.success) {
        console.log(res.data);
      }
    }
  );

  const [initialDataSource, setInitialDataSource] = useState([]);
  useEffect(() => {
    // console.log(
    // 	"dataSource.length > 0 && uploadFields",
    // 	dataSource.length > 0 && uploadFields
    // );
    if (dataSource.length > 0 && uploadFields.add_your_document_url) {
      let _dataSource = [];
      // console.log("dataSource", dataSource);
      // console.log("dataSource.reverse()", dataSource.reverse());
      dataSource.map((val, key) => {
        let fields = Object.values(uploadFields);
        let keys = Object.keys(uploadFields);
        let stage_name = null;
        fields.map((value, key) => {
          // console.log("key", key);
          // console.log("value", value);
          if (value.includes(val.file_name.toLowerCase())) {
            stage_name = keys[key];
          }
        });

        // console.log("stage_name", stage_name);

        let stages = {
          add_your_document_url: "Document Url",
          requirements_or_homework1: "Call 1",
          requirements_or_homework2: "Call 2",
          requirements_or_homework3: "Follow-Up Call",
          requirements_or_homework4: "Timeline Call",
          requirements_or_homework5: "Pre-Publish Call",
          requirements_or_homework6: "Pre-Interview",
          "1_hour_update_upload_1": "One Hour Update",
          "1_hour_update_upload_2": "One Hour Update",
          "1_hour_update_upload_3": "One Hour Update",
          "1_hour_update_upload_4": "One Hour Update",
          "1_hour_update_upload_5": "One Hour Update",
          "1_hour_update_upload_6": "One Hour Update",
        };
        let stage = "";
        if (stage_name == null) {
          stage = _dataSource[key - 1] ? _dataSource[key - 1]["stage"] : "";
        } else {
          stage = stages[stage_name];
        }
        // console.log(stages[stage_name]);
        _dataSource.push({ ...val, stage });
      });

      if (initialDataSource.length == 0) {
        setInitialDataSource(_dataSource);
      }
      console.log("_dataSource", _dataSource);
    }

    return () => {};
  }, [dataSource, uploadFields, initialDataSource]);

  useEffect(() => {
    if (dataGetFileList) {
      getfilelist();
    }
    return () => {};
  }, [tableFilter]);

  const refetchAll = () => {
    getUser();
    getOpportunity();
    getTaskData();
    getExistingFiles();
    getfilelist();
  };

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

  const { refetch: getUser, isLoading: isLoadingUser } = GET(
    `api/v1/users/${id}`,
    "user_details",
    (res) => {
      if (res.success) {
        // console.log("user_details", res.data);
        form.setFieldsValue({
          ...res.data,
          ...res.data.user_address,
        });
      }
    }
  );

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

  const truncateString = (str, num) => {
    if (str.length > num) {
      return str.slice(0, num) + "...";
    } else {
      return str;
    }
  };

  const {
    data: dataOpportunity,
    refetch: getOpportunity,
    isLoading: isLoadingOpportunity,
  } = GET(`api/v1/consultant/opportunity/${id}`, "opportunity", (res) => {
    console.log("id: ", id);
    if (res.success) {
      res.pipeline_stages.forEach((item, index) => {
        if (item.status == "process") {
          setCurrent(index);
          if (index < 2) {
            setAddOn(index);
          } else if (index > 2 && index < 6) {
            setAddOn(2);
          }
        }
      });

      setStages(res.pipeline_stages);
    }
  });

  const { refetch: refetchNotes, isLoading: isLoadingNotes } = GET(
    `api/v1/consultant/get_user_note/${id}`,
    "user_notes",
    (res) => {
      if (res.success) {
        let temp_notes = [];
        res.data.map((item) => {
          temp_notes.push({
            id: item.id,
            body: item.body,
            date: moment(item.createdAt).format("dddd, MMMM Do"),
          });
        });

        setUserNotes(temp_notes);
      }
    }
  );

  const {
    data: dataGetExistingFiles,
    refetch: getExistingFiles,
    isLoading: isLoadingFiles,
  } = GET(`api/v1/user/get_existing_files/${id}`, "ghl_files", (res) => {
    if (res.success) {
      console.log("get_existing_files", res);
      let upload_field = [];
      res.data.custom_fields.map((item) => {
        let key_name = item.key.split(".")[1];
        let val = item.value.toString();

        if (key_name === "product_purchase_details") {
          val = "Eight Hour Application Construction";
        }

        form.setFieldValue(key_name, val);
        upload_field[key_name] = val;
      });

      setUploadFields(upload_field);
      setUserTags(res.data.tags);

      form.setFieldsValue({ tags: res.data.tags });
    }
  });

  // useEffect(() => {
  //   if (tags.includes("checked and verified")) {
  //     refetchAll();
  //   }
  // }, [tags]);

  const onSubmitNotes = () => {
    let data = {
      id: id,
      note: notes,
    };

    submitNotes(data, {
      onSuccess: (res) => {
        if (res.success) {
          notification.success({
            message: "Success",
            description: "Note successfully added",
          });

          addHistoryLog(
            {
              page: "User/User Details/Note",
              key: "Add User Note",
              user_id: id,
              old_data: "",
              new_data: notes,
              method: "add-user-notes",
            },
            { onSuccess: (res) => {} }
          );

          setNotes("");
          setToggleModal(false);
          refetchNotes();
        }
      },
    });
  };

  const { mutate: addTag, isLoading: isLoadingAddTag } = POST(
    "api/v1/consultant/add_tag",
    ["user_tag", "get_task", "opportunity", "ghl_files"]
  );

  const addCallDone = () => {
    let data = {
      id: id,
      tag: [
        "waiting for atc rep call (done)",
        "product purchase (current task)",
      ],
    };

    addTag(data, {
      onSuccess: (res) => {
        if (res.success) {
          notification.success({
            message: "Success",
            description: "Tag successfully added",
          });
          // refetchAll();
        }
      },
    });
  };

  const { mutate: submitNotes, isLoading: isLoadingAddNotes } = POST(
    "api/v1/consultant/add_user_note",
    "user_note"
  );

  const { mutate: deleteNotes, isLoading: isLoadingDeleteNotes } = POST(
    "api/v1/consultant/delete_user_note",
    "user_note"
  );

  const onApproval = (value) => {
    Modal.confirm({
      title: "Confirm",
      icon: <ExclamationCircleOutlined />,
      content:
        "Are you sure this requirement has been " + value.toUpperCase() + " ?",
      okText: "Yes",
      cancelText: "No",
      onOk: () => {
        let data = {
          id: id,
          tag: value,
        };

        submitApproval(data, {
          onSuccess: (res) => {
            if (res.success) {
              notification.success({
                message: "Success",
                description: "Tag successfully added",
              });
              refetchAll();
            }
          },
        });
      },
    });
  };

  const { mutate: submitApproval, isLoading: isLoadingApproval } = POST(
    "api/v1/consultant/add_approval",
    "user_note"
  );

  const { refetch: getTaskData } = GET(
    `api/v1/task/${id}`,
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
              // hasLink: item.description.includes("href") ? true : false,
              assignedTo: item.assignedTo,
              isCompleted: item.status,
              // dueDate: item.dueDate,
              // isCompleted: item.status === "pending" ? false : true,
              isActive: true,
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
              // hasLink: item.description.includes("href") ? true : false,
              assignedTo: item.assignedTo,
              isCompleted: item.status,
              // dueDate: item.dueDate,
              // isCompleted: item.status === "pending" ? false : true,
              isActive: true,
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

        setCurrentTask(current_task);
        setUpcomingTask(upcoming_task);

        console.log(current_task);
      }
    }
  );

  const onChangeNotes = (value) => {
    setNotes(value);
  };

  const onChange = (value) => {
    setCurrent(value + addOn);
  };

  const onRightBtnPressed = () => {
    if (current + addOn != 5 && current > 2 && addOn < 2) setAddOn(addOn + 1);

    // setCurrent(addOn + 1)
  };

  const onLeftBtnPressed = () => {
    if (addOn != 0) setAddOn(addOn - 1);
  };

  const { refetch: refetchTable } = GET(
    //	`api/v1/users?${$.param(tableFilter)}`,
    "users",
    (res) => {
      if (res.success) {
        setDataSource(res.data && res.data.data);
        setTableTotal(res.data.total);
      }
    }
  );

  const stateUS = optionStateCodesUnitedState();
  const stateCA = optionStateCodesCanada();

  const [optionState, setOptionState] = useState([]);
  const [stateLabel, setStateLabel] = useState("State");
  const [optionZip, setOptionZip] = useState();
  const [zipLabel, setZipLabel] = useState("Zip Code");

  const handleTableChange = (pagination, filters, sorter) => {
    setTableFilter({
      ...tableFilter,
      sort_field: sorter.columnKey,
      sort_order: sorter.order ? sorter.order.replace("end", "") : null,
      page_number: 1,
    });
  };

  const [toggleModal, setToggleModal] = useState(false);

  const confirmDelete = (value) => {
    Modal.confirm({
      title: "Confirm",
      icon: <ExclamationCircleOutlined />,
      content: "Are you sure you want to delete this note?",
      okText: "Yes",
      cancelText: "Cancel",
      onOk: () => {
        let data = {
          id: id,
          note_id: value,
        };
        //  console.log("onFinishForm", data);
        deleteNotes(data, {
          onSuccess: (res) => {
            if (res.success) {
              console.log(res);
              notification.success({
                message: "Success",
                description: "Note successfully deleted",
              });

              refetchNotes();
            }
          },
        });
      },
    });
  };
  const { mutate: mutateDownloadFile } = POST(
    "api/v1/dropbox/download",
    "savetoken"
  );

  const { mutate: mutatePreviewFile } = POST(
    "api/v1/dropbox/preview",
    "savetoken"
  );

  const handleDownloadFile = (id) => {
    let data = {
      id: id,
    };

    mutateDownloadFile(data, {
      onSuccess: (res) => {
        if (res.success) {
          window.location.replace(res.data);
          console.log("link:", res.data);
        }
      },
    });
  };

  const [showPdfDoc, setShowPdfDoc] = useState(false);

  const handlePreviewFile = (id) => {
    let data = {
      id: id,
    };

    mutatePreviewFile(data, {
      onSuccess: (res) => {
        if (res.success) {
          // window.location.replace(res.data);
          setFileSrc("");
          setFileExt("");
          setFileExt(res.filename);
          setBase64File(res.data);

          var file_type = ["docx", "pdf", "doc"];

          if (file_type.includes(res.filename)) {
            // setFileSrc(
            //   "data:application/" + `${res.filename}` + ";base64," + res.data
            // );

            setFileSrc(res.data);
          } else {
            setFileSrc(
              "data:image/" + `${res.filename}` + ";base64," + res.data
            );
          }
        }
      },
    });
  };

  useEffect(() => {
    if (fileSrc != "") {
      var file_type = ["docx", "pdf", "doc"];

      if (file_type.includes(fileExt)) {
        console.log("filesource :", fileSrc);

        setShowPdfDoc(true);

        // var win = window.open();
        // win.document.write(
        //   '<iframe src="' +
        //     fileSrc +
        //     '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>'
        // );
      } else {
        setVisible(true);
      }
    }
  }, [fileSrc]);

  const { mutate: addHistoryLog } = POST(
    "api/v1/historylogs/add",
    "add_history_logs"
  );

  const { mutate: mutateCreate, isLoading: isLoadingCreate } = POST(
    "api/v1/user/upload",
    "upload"
  );

  const [multifileList, setMultiFileList] = useState([]);
  const onFinish = (values) => {
    const data = new FormData();

    data.append("user_id", id);

    multifileList.map((item, index) => {
      data.append("images_" + index, item.originFileObj, item.name);
    });
    data.append("images_count", multifileList ? multifileList.length : 0);
    data.append("images", multifileList);

    data.append("current_task", JSON.stringify(currentTask));

    if (multifileList.length > 0) {
      mutateCreate(data, {
        onSuccess: (res) => {
          if (res.success) {
            notification.success({
              message: "Success",
              description: "Successfully created",
            });

            var filename = multifileList.map((item) => item.name);

            addHistoryLog(
              {
                page: "documents",
                key: "upload document",
                old_data: "",
                user_id: id,
                new_data: JSON.stringify(filename),
                method: "upload-document-admin",
                // consultant: details[0].eventInfo.title,
              },
              { onSuccess: (res) => {} }
            );

            getfilelist();
            setMultiFileList([]);
            // form.resetFields();

            // history.push(`/view/restaurants/edit/${table_id}`);
          }
        },
        onError: (res) => {},
      });
    } else {
      notification.warning({
        message: "Warning",
        description: "Please choose files to upload",
      });
    }
  };

  return (
    <Card className="manageUserPage">
      <Row gutter={8} style={{ display: "flex" }}>
        <Col xs={24} lg={windowSize.innerWidth <= 1024 ? 24 : 16}>
          {currentTask && (
            <Row gutter={[12, 12]}>
              <Col className="col-s-md" xs={24} sm={24} md={24} lg={12}>
                {currentTask &&
                currentTask.filter((task) => {
                  return (
                    // task.isActive === true && task.isCompleted === false
                    task.isCompleted === "pending"
                  );
                }).length > 0 ? (
                  <Typography.Text className="task-card-category">
                    Client's Active Task
                  </Typography.Text>
                ) : null}

                <Row gutter={[12, 12]} className="task-row">
                  {currentTask &&
                    currentTask
                      .filter((task) => {
                        return (
                          // task.isActive === true && task.isCompleted === false
                          task.isCompleted === "pending"
                        );
                      })
                      .map((item, index) => {
                        return (
                          <Col xs={24} sm={24} md={24} lg={24} key={index}>
                            {/* {!item.isActive && <div style={{background:'rgba(0, 0, 0, 0.5)',width:'100%', height:'100%', position:'absolute', zIndex:'1'}}></div>} */}
                            <TaskCard key={index} item={item} />
                          </Col>
                        );
                      })}
                </Row>
              </Col>
              {upcomingTask.length > 0 && (
                <Col className="col-s-md" xs={24} sm={24} md={24} lg={12}>
                  <Typography.Text className="task-card-category">
                    Client's Upcoming Task
                  </Typography.Text>
                  <Row gutter={[12, 12]} className="task-row">
                    <Col xs={24} sm={24} md={24} lg={24}>
                      {/* {!item.isActive && <div style={{background:'rgba(0, 0, 0, 0.5)',width:'100%', height:'100%', position:'absolute', zIndex:'1'}}></div>} */}
                      <TaskCard item={upcomingTask[0]} />
                    </Col>
                  </Row>
                </Col>
              )}
            </Row>
          )}
        </Col>

        <Col
          className="col-s-lg"
          xs={24}
          lg={windowSize.innerWidth <= 1024 ? 24 : 8}
          md={24}
        >
          <Row>
            <Col xs={24} sm={24} md={24} className="client-note-cont">
              <Typography.Text className="task-card-category">
                Client's Notes
              </Typography.Text>
              <Collapse
                className="main-4-collapse border-none notes-collapse"
                defaultActiveKey={["1"]}
                expandIconPosition="end"
                expandIcon={({ isActive }) => (
                  <FontAwesomeIcon
                    icon={faPlus}
                    style={{ color: "#325db8", fontSize: 18 }}
                  />
                )}
              >
                <Collapse.Panel
                  header={
                    <div className="flex">
                      <div style={{ width: "175px" }}>Client Notes</div>
                    </div>
                  }
                  key="1"
                  className="accordion bg-darkgray-form m-b-md white client-note"
                >
                  <Row gutter={[12, 12]}>
                    <Col xs={24} sm={24} md={24}>
                      <Button
                        size="large"
                        className="atc-btn-opposite b-r-none "
                        onClick={() => {
                          setToggleModal(true);
                        }}
                      >
                        <FontAwesomeIcon icon={faPlus} className="m-r-sm" /> Add
                        Note
                      </Button>
                    </Col>
                  </Row>
                  <Row className="m-t-md" gutter={[12, 12]}>
                    <Col xs={24} sm={24} md={24}>
                      <List
                        bordered
                        dataSource={user_notes}
                        style={{ maxHeight: "160px", overflowY: "scroll" }}
                        renderItem={(item) => (
                          <List.Item key={item.id}>
                            <div>
                              <div>
                                <Typography.Text>
                                  <strong>{item.body}</strong>
                                </Typography.Text>{" "}
                              </div>
                              <div>
                                <Typography.Text>
                                  Added on: {item.date}
                                </Typography.Text>{" "}
                              </div>
                            </div>
                            <div>
                              <Button
                                className="btn-warning"
                                onClick={() => {
                                  confirmDelete(item.id);
                                }}
                              >
                                <FontAwesomeIcon
                                  icon={faTrash}
                                ></FontAwesomeIcon>
                              </Button>
                            </div>
                          </List.Item>
                        )}
                      />
                    </Col>
                  </Row>
                </Collapse.Panel>
              </Collapse>
            </Col>
          </Row>
        </Col>
      </Row>

      <Row gutter={6} className="m-t-lg m-b-sm">
        <Col sm={24} md={24}>
          <Typography.Text className="task-card-category">
            Client's Progress Timeline
          </Typography.Text>
        </Col>
      </Row>

      <OpportunitySteps
        stage={stage}
        count={count}
        addOn={addOn}
        limit={stage && stage.length}
        stageName={stage_name}
        setCurrent={setCurrent}
        onChange={onChange}
        setAddOn={setAddOn}
      />

      {[2, 3, 4].includes(current) && (
        <OpportunitySubSteps
          current={current}
          dataOpportunity={dataOpportunity}
          windowSize={windowSize}
        />
      )}

      <Row className="m-t-lg ">
        <Col xs={24} sm={24} md={24} lg={24}>
          <Form form={form}>
            <Collapse
              className="main-4-collapse border-none client-info-collapse"
              defaultActiveKey={["1"]}
              expandIconPosition="start"
              collapsible="disabled"
            >
              <Collapse.Panel
                showArrow={false}
                header={
                  <div
                    className="task-flex"
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    <Typography.Text
                      className="task-collapse-title"
                      ellipsis={{ rows: 2 }}
                    >
                      Client's Information
                    </Typography.Text>
                    {/* {scrollHeight.scrollY < maxScrollHeight && ( */}

                    {/* )} */}
                  </div>
                }
                key="1"
                className="accordion bg-darkgray-form m-b-md white"
                extra={
                  <>
                    {" "}
                    <div className="task-card-title">
                      <Button
                        size="medium"
                        className="btn-warning btn-with-svg btn-ant-header btn-dashboard-reload"
                        loading={isLoading}
                        onClick={(e) => {
                          refetchAll();
                          e.target.blur();
                        }}
                        icon={
                          <FontAwesomeIcon
                            icon={faRotateRight}
                            style={{ marginRight: "5px" }}
                          />
                        }
                      >
                        {windowSize.innerWidth > 425 && "Reload"}
                      </Button>
                    </div>
                  </>
                }
              >
                <Card
                  headStyle={{
                    marginTop: "10px",
                    minHeight: 40,
                    paddingBottom: 0,
                  }}
                  bodyStyle={{ paddingBottom: "0px" }}
                  title="Contact"
                >
                  <Row gutter={8}>
                    <Col xs={24} sm={24} md={12} lg={8}>
                      <Form.Item name="firstname">
                        <FloatInput
                          label="First Name"
                          placeholder="First Name"
                          readOnly={true}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={8}>
                      <Form.Item name="lastname">
                        <FloatInput
                          label="Last Name"
                          placeholder="Last Name"
                          readOnly={true}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={8}>
                      <Form.Item name="birthdate" hasFeedback>
                        <FloatInput
                          label="Birthdate"
                          placeholder="Birthdate"
                          readOnly={true}
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={24} md={12} lg={8}>
                      <Form.Item name="phone" hasFeedback>
                        <FloatInput
                          label="Phone number"
                          placeholder="Phone Number"
                          readOnly={true}
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={24} md={12} lg={8}>
                      <Form.Item
                        name="email"
                        hasFeedback
                        rules={[
                          {
                            type: "email",
                            message: "The input is not valid email!",
                          },
                          {
                            required: true,
                            message: "Please input your email!",
                          },
                        ]}
                      >
                        <FloatInput
                          label="Email"
                          placeholder="Email"
                          readOnly={true}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Card>
                <Card
                  className="m-t-sm"
                  headStyle={{
                    marginTop: "10px",
                    minHeight: 40,
                    paddingBottom: 0,
                  }}
                  bodyStyle={{ paddingBottom: "0px" }}
                  title="General Information"
                >
                  <Row gutter={8}>
                    <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={8}>
                      <Form.Item
                        name="address1"
                        hasFeedback
                        rules={[
                          // {
                          //   message: "The input is not valid",
                          // },
                          {
                            required: true,
                            message: "Please input your address!",
                          },
                        ]}
                      >
                        <FloatInput
                          label="Address"
                          placeholder="Address"
                          readOnly={true}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={8}>
                      <Form.Item
                        name="city"
                        hasFeedback
                        rules={[
                          // {
                          //   message: "The input is not valid",
                          // },
                          {
                            required: true,
                            message: "Please input your email!",
                          },
                        ]}
                      >
                        <FloatInput
                          label="City"
                          value={user.city}
                          placeholder="City"
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={8}>
                      <Form.Item
                        name="state"
                        className="client-state"
                        // className="form-select-error"
                        rules={[
                          {
                            required: true,
                            message: "This field field is required.",
                          },
                        ]}
                      >
                        <FloatSelect
                          label={stateLabel}
                          placeholder={stateLabel}
                          options={optionState}
                          readOnly={true}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={8}>
                      <Form.Item
                        name="zip_code"
                        hasFeedback
                        rules={[
                          // {
                          //   message: "The input is not valid",
                          // },
                          {
                            required: true,
                            message: "Please input your email!",
                          },
                        ]}
                      >
                        <FloatInput
                          label="Postal Code"
                          placeholder="Postal Code"
                          readOnly={true}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Card>

                <Card
                  className="m-t-sm"
                  headStyle={{
                    marginTop: "10px",
                    minHeight: 40,
                    paddingBottom: 0,
                  }}
                  bodyStyle={{ paddingBottom: "0px" }}
                  title="Additional Info"
                >
                  <Row gutter={8}>
                    <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={8}>
                      <Form.Item name="product_purchase_details">
                        <FloatInput
                          label="Purchase Details"
                          placeholder="Purchase Details"
                          readOnly={true}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={8}>
                      <Form.Item name="add_your_document_url">
                        <FloatInputWithButttons
                          icon={
                            <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                          }
                          className="input-float"
                          label="Add Your Document URL"
                          placeholder="Add Your Document URL"
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={8}>
                      <Form.Item name="docusign_url">
                        <FloatInputWithButttons
                          icon={
                            <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                          }
                          label="MNDA Document Url"
                          placeholder="MNDA Document Url"
                        />
                      </Form.Item>
                    </Col>
                    {/* <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={8}>
											<Form.Item name="requirements_or_homework1">
												<FloatInputWithButttons
													icon={<FontAwesomeIcon icon={faArrowUpRightFromSquare} />}
													onClick={onApproval}
													showButton={
														tags &&
														!tags.includes("call 1 - upload requirements (current task)") &&
														tags.includes("call 1 - requirements approval (current task)")
															? true
															: false
													}
													label="Call 1 Requirements"
													placeholder="Call 1 Requirements"
												/>
											</Form.Item>
										</Col>

										<Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={8}>
											<Form.Item name="requirements_or_homework2">
												<FloatInputWithButttons
													className="float-inpt-btn"
													icon={<FontAwesomeIcon icon={faArrowUpRightFromSquare} />}
													onClick={onApproval}
													showButton={
														tags &&
														!tags.includes("call 2 - upload requirements (current task)") &&
														tags.includes("call 2 - requirements approval (current task)") &&
														!(
															tags.includes("timeline - book (current task)") ||
															tags.includes("timeline - book (done)")
														)
															? true
															: false
													}
													label="Call 2 - Revised or Most Up-to-Date Application"
													placeholder="Call 2 - Revised or Most Up-to-Date Application"
												/>
											</Form.Item>
										</Col>

										<Col
											xs={24}
											sm={24}
											md={12}
											lg={8}
											xl={8}
											xxl={8}
											visible={uploadFields["1_hour_update_upload_1"]}
										>
											<Form.Item name="requirements_or_homework3">
												<FloatInputWithButttons
													className="float-inpt-btn"
													icon={<FontAwesomeIcon icon={faArrowUpRightFromSquare} />}
													onClick={onApproval}
													showButton={
														tags &&
														!tags.includes(
															"follow up call - upload requirements (current task)"
														) &&
														(tags.includes(
															"follow up call - requirements approval (current task)"
														) ||
															(tags.includes(
																"call 2 - requirements approval (current task)"
															) &&
																(tags.includes("timeline - book (current task)") ||
																	tags.includes("timeline - book (done)"))))
															? true
															: false
													}
													label="Follow-up Call - Revised or Most Up-to-Date Application"
													placeholder="Follow-up Call - Revised or Most Up-to-Date Application"
												/>
											</Form.Item>
										</Col>

										<Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={8}>
											<Form.Item name="requirements_or_homework4">
												<FloatInputWithButttons
													className="float-inpt-btn"
													icon={<FontAwesomeIcon icon={faArrowUpRightFromSquare} />}
													onClick={onApproval}
													showButton={
														tags &&
														!tags.includes("timeline - upload requirements (current task)") &&
														tags.includes("timeline - requirements approval (current task)")
															? true
															: false
													}
													label="Timeline Call - Timeline sheets and Revised Application"
													placeholder="Timeline Call - Timeline sheets and Revised Application"
												/>
											</Form.Item>
										</Col>
										<Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={8}>
											<Form.Item name="requirements_or_homework5">
												<FloatInputWithButttons
													className="float-inpt-btn"
													icon={<FontAwesomeIcon icon={faArrowUpRightFromSquare} />}
													onClick={onApproval}
													showButton={
														tags &&
														!tags.includes(
															"pre publish - upload requirements (current task)"
														) &&
														tags.includes(
															"pre publish - requirements approval (current task)"
														)
															? true
															: false
													}
													label="Pre-Publish Call Requirements"
													placeholder="Pre-Publish Call Requirements"
												/>
											</Form.Item>
										</Col>
										<Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={8}>
											<Form.Item name="requirements_or_homework6">
												<FloatInputWithButttons
													className="float-inpt-btn"
													icon={<FontAwesomeIcon icon={faArrowUpRightFromSquare} />}
													onClick={onApproval}
													showButton={
														tags &&
														!tags.includes(
															"pre interview - upload requirements (current task)"
														) &&
														tags.includes(
															"pre interview - requirements approval (current task)"
														)
															? true
															: false
													}
													label="Pre-Interview Call Requirements"
													placeholder="Pre-Interview Call Requirements"
												/>
											</Form.Item>
										</Col> */}
                  </Row>
                </Card>

                {userdata.role != "Consultant" && (
                  <Card
                    className="m-t-sm"
                    headStyle={{
                      marginTop: "10px",
                      minHeight: 40,
                      paddingBottom: 0,
                    }}
                    title="Client Progress Tags"
                    bodyStyle={{
                      display: "block",
                      overflow: "hidden",
                      maxHeight: "300px",
                    }}
                  >
                    {tags.includes("waiting for atc rep call (current task)") &&
                      !tags.includes("waiting for atc rep call (done)") && (
                        <Row gutter={8} className=" m-b-md">
                          <Col sm={24} md={12} lg={8}>
                            <Button
                              style={{ color: "#365293" }}
                              type="primary white"
                              className="btn-primary btn-primary-wfc btn-text"
                              onClick={() => addCallDone()}
                              loading={isLoadingAddTag}
                            >
                              Add waiting for consultation call (done) tag
                            </Button>
                          </Col>
                        </Row>
                      )}
                    <Row gutter={8}>
                      <Col sm={24} md={12} lg={8}>
                        {tags &&
                          tags.map((tag) => {
                            return (
                              <Tag
                                key={tag}
                                className="view-user-tags"
                                color="#3f5fac"
                              >
                                {tag}
                              </Tag>
                            );
                          })}
                      </Col>
                    </Row>
                  </Card>
                )}
              </Collapse.Panel>
            </Collapse>
          </Form>
        </Col>
      </Row>

      {/* ---------------------------------------------- END USER TASK / START USER NOTES -------------------------------------- */}

      <Row gutter={8} className="upload-doc-row m-t-md">
        <Col xs={24} sm={24} md={24} lg={20} xl={8} xxl={6}>
          <Card
            className="card-primary-new-primary"
            title="UPLOAD DOCUMENTS"
            size="10"
          >
            <Space direction="vertical" className="w-100">
              <Upload
                className="venue-images"
                listType="picture"
                fileList={multifileList}
                onChange={({ fileList: newFileList }) => {
                  var _file = newFileList;
                  console.log(_file);
                  _file.map((row, key) => {
                    return (row.status = "done");
                  });

                  let _newFile = [];

                  _file.forEach((item) => {
                    const isJpgOrPngOrDoc =
                      item.type === "image/jpeg" ||
                      item.type === "image/png" ||
                      item.type === "image/gif" ||
                      item.type === "image/jpg" ||
                      item.type === "application/msword" ||
                      item.type === "application/pdf";

                    if (isJpgOrPngOrDoc) {
                      _newFile.push(item);
                    }
                  });

                  setMultiFileList(_newFile);
                }}
                beforeUpload={(file) => {
                  let error = false;
                  const isJpgOrPngOrDoc =
                    file.type === "image/jpeg" ||
                    file.type === "image/png" ||
                    file.type === "image/gif" ||
                    file.type === "image/jpg" ||
                    file.type === "application/msword" ||
                    file.type === "application/pdf";
                  if (!isJpgOrPngOrDoc) {
                    message.error(
                      "You can only upload JPG, PNG, GIF, JPEG, DOC, DOCX, PDF file!"
                    );
                    error = Upload.LIST_IGNORE;
                  }
                  const isLt2M = file.size / 102400 / 102400 < 10;
                  if (!isLt2M) {
                    message.error("Image must smaller than 10MB!");
                    error = Upload.LIST_IGNORE;
                  }

                  if (error === false) {
                    return false;
                  }
                  return Upload.LIST_IGNORE;
                }}
                onPreview={async (file) => {
                  let src = file.url;
                  if (!src) {
                    src = await new Promise((resolve) => {
                      const reader = new FileReader();
                      reader.readAsDataURL(file.originFileObj);
                      reader.onload = () => resolve(reader.result);
                    });
                  }
                  const image = new Image();
                  image.src = src;
                  const imgWindow = window.open(src);
                  imgWindow.document.write(image.outerHTML);
                }}
              >
                <Button type="dashed" className="upload-btn">
                  <div className="upload-btn-description">
                    <p className="ant-upload-text">
                      <FontAwesomeIcon
                        className="document-upload-icon"
                        icon={faArrowUpFromBracket}
                      />
                    </p>
                    <br />
                    <Typography.Text className="upload-title">
                      Click or Drag{" "}
                    </Typography.Text>
                    <br />
                    <Typography.Text className="upload-title">
                      Documents to Upload{" "}
                    </Typography.Text>

                    <br />
                    <br />

                    <Typography.Text>
                      <strong>Limit:</strong>{" "}
                      <span style={{ color: "#58595b", fontWeight: "lighter" }}>
                        2MB (Unlimited Number of Files)
                      </span>
                    </Typography.Text>
                    <br />
                    <Typography.Text>
                      <strong>Types:</strong>{" "}
                      <span style={{ color: "#58595b", fontWeight: "lighter" }}>
                        pdf, png, gif, jpg, jpeg, doc, docx.{" "}
                      </span>
                    </Typography.Text>
                    {/* <p
                      className="upload-instruction"
                      style={{ whiteSpaces: "break-word" }}
                    >
                      2MB limit. Allowed types: pdf, png, gif, jpg, jpeg, doc,
                      docx.
                    </p>
                    <p className="upload-instruction">
                      Unlimited number of documents can be uploaded to this
                      field.
                    </p> */}
                  </div>
                </Button>
              </Upload>

              <Button
                type="primary"
                htmlType="submit"
                onClick={() => {
                  onFinish();
                }}
                //    loading={isLoadingButtonLogin}
                className="btn-primary btn-upload btn-with-svg m-t-sm"
                icon={<FontAwesomeIcon icon={faPlus} />}
                size="large"
                onMouseLeave={(e) => {
                  e.target.blur();
                }}
              >
                Submit
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* <Row gutter={24} className="btn-submit-row">
        <Col sm={24} md={24} lg={24}>
          <Button
            type="primary"
            htmlType="submit"
            onClick={() => {
              onFinish();
            }}
            //    loading={isLoadingButtonLogin}
            className="btn-primary  m-t-sm"
            block
            size="large"
          >
            SUBMIT
          </Button>
        </Col>
      </Row> */}

      <Row>
        <Col className="m-t-lg" sm={24} md={24}>
          <Typography.Text className="document-upload-title">
            Uploaded Documents
          </Typography.Text>
        </Col>
        <Col sm={24} md={24} lg={24}>
          <Table
            className="ant-table-default ant-table-striped scrollbar-2"
            dataSource={dataSource && dataSource}
            //     rowKey={(record) => record.id}
            pagination={false}
            bordered={true}
            onChange={handleTableChange}
            scroll={{ x: "max-content" }}
          >
            <Table.Column
              title="Filename"
              key="file_name"
              defaultSortOrder="descend"
              sorter={true}
              dataIndex="file_name"
              width={"300px"}
              render={(text, record) => {
                return (
                  <>
                    <div
                      style={{
                        //    display: "inline-flex",
                        alignItems: "center",
                        whiteSpace: "break-spaces",
                      }}
                    >
                      <div className="table-action-btn">
                        <Button
                          style={{
                            color: "#365293",
                            padding: 0,
                            marginRight: 7,
                          }}
                          type="link"
                          onClick={() => {
                            handleDownloadFile(record.id);
                          }}
                        >
                          <FontAwesomeIcon icon={faDownload} />
                        </Button>
                        <Button
                          style={{
                            color: "#365293",
                            padding: 0,
                            marginRight: 7,
                          }}
                          type="link"
                          onClick={() => {
                            handlePreviewFile(record.id);
                          }}
                        >
                          <FontAwesomeIcon icon={faEye} />
                        </Button>
                        <Tooltip title={text}>
                          <span>
                            {truncateString(text.split(".")[0], 18) +
                              "." +
                              text.split(".")[1]}
                          </span>
                        </Tooltip>{" "}
                      </div>
                    </div>
                  </>
                );
              }}
            />
            <Table.Column
              title="Appt Stage"
              key="stage"
              // sorter={true}
              dataIndex="stage"
              width={"200px"}
              render={(text, record) => {
                let stage_temp = text.trim();

                if (stage_temp === "reschedule") {
                  stage_temp = record?.last_uploaded_stage
                    ? record?.last_uploaded_stage.trim()
                    : "";
                }
                let stage = "";
                stage_temp = stage_temp.split(" ");

                if (Array.isArray(stage_temp)) {
                  stage_temp.forEach((x, index) => {
                    stage += x.charAt(0).toUpperCase() + x.slice(1) + " ";
                  });
                } else {
                  stage =
                    stage_temp.charAt(0).toUpperCase() + stage_temp.slice(1);
                }

                return stage;
                // let values = Object.values(uploadFields);
                // let keys = Object.keys(uploadFields);
                // let stage_name = null;
                // values.map((value, key) => {
                //   console.log("key", key);
                //   console.log("value", value);
                //   if (
                //     value.toLowerCase().includes(record.file_name.toLowerCase())
                //   ) {
                //     stage_name = keys[key];
                //   }
                // });
                // // console.log("stage_name", stage_name);
                // let stages = {
                //   add_your_document_url: "Document Url",
                //   requirements_or_homework1: "Call 1",
                //   requirements_or_homework2: "Call 2",
                //   requirements_or_homework3: "Follow-Up Call",
                //   requirements_or_homework4: "Timeline Call",
                //   requirements_or_homework5: "Pre-Publish Call",
                //   requirements_or_homework6: "Pre-Interview",
                //   "1_hour_update_upload_1": "One Hour Update",
                //   "1_hour_update_upload_2": "One Hour Update",
                //   "1_hour_update_upload_3": "One Hour Update",
                //   "1_hour_update_upload_4": "One Hour Update",
                //   "1_hour_update_upload_5": "One Hour Update",
                //   "1_hour_update_upload_6": "One Hour Update",
                // };
                // let stage = "";
                // if (stage_name == null) {
                //   if (initialDataSource.length > 0) {
                //     stage = initialDataSource.find((p) => p.id == record.id)
                //       ? initialDataSource.find((p) => p.id == record.id).stage
                //       : "";
                //   }
                // } else {
                //   stage = stages[stage_name];
                // }
                // return stage;
              }}
            />
            <Table.Column
              title="Date Uploaded"
              key="created_date"
              dataIndex="created_date"
              sorter={true}
              width={"200px"}
            />
            <Table.Column
              title="Uploaded By"
              key="uploader"
              dataIndex="uploader"
              sorter={true}
              width={"200px"}
              render={(text, record) => (
                <Typography.Text
                  style={{
                    color:
                      record.uploader_role == "User" ? "#3f5fac" : "#ff8303",
                  }}
                >
                  {text}
                </Typography.Text>
              )}
            />
            <Table.Column
              title="Original Filename"
              key="original_file_name"
              dataIndex="original_file_name"
              sorter={true}
              width={"230px"}
              render={(text, record) => (
                <Tooltip title={text}>
                  <p className="margin-bottom-0">
                    {truncateString(text.split(".")[0], 15) +
                      "." +
                      text.split(".")[1]}
                  </p>
                </Tooltip>
              )}
            />
          </Table>
          <Col xs={24} sm={24} md={24}>
            <div className="ant-space-flex-space-between the-pagination the-pagination--upload-docs">
              <TableShowingEntries />
              <TablePagination
                paginationFilter={tableFilter}
                setPaginationFilter={setTableFilter}
                setPaginationTotal={tableTotal}
                showLessItems={true}
                showSizeChanger={false}
              />
            </div>
          </Col>
        </Col>
      </Row>

      {fileSrc != "" && (
        <Image
          width={200}
          style={{ display: "none" }}
          src={fileSrc}
          preview={{
            visible,
            src: fileSrc,
            onVisibleChange: (value) => {
              setVisible(value);
            },
          }}
        />
      )}

      <ModalFileView
        setToggleModal={setShowPdfDoc}
        toggleModal={showPdfDoc}
        file={fileSrc}
        type={fileExt}
        base64Var={base64File}
      />

      <Modal
        visible={toggleModal}
        className="modal-login modal-send-email-notifiaction "
        title="ADD NOTE ABOUT CLIENT"
        bodyStyle={{
          height: "fit-content",
          width: "100%",
          paddingBottom: "20px",
          display: "inline-block",
        }}
        onCancel={() => {
          setToggleModal(false);
        }}
        // setToggleModal={setToggleModal}
        // user={user}

        footer={[
          <Space>
            <Button
              className="btn-primary atc-btn-opposite"
              onClick={() => {
                onSubmitNotes();
              }}
              //   loading={isLoadingNotification}
            >
              Submit
            </Button>
          </Space>,
        ]}
      >
        <div style={{ marginBottom: "10px" }}>
          <FloatTextArea
            value={notes}
            onChange={(value) => {
              onChangeNotes(value.target.value);
            }}
          />
        </div>
      </Modal>
    </Card>
  );
}

export default PageUserForm;
