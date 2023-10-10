import React, { useState, useEffect } from "react";

import {
  Row,
  Col,
  Card,
  Avatar,
  Button,
  Modal,
  Typography,
  Popconfirm,
  Form,
  TimePicker,
  Tooltip,
  notification,
  Space,
  message,
} from "antd";

import {
  ExclamationCircleOutlined,
  QuestionCircleOutlined,
  TagsTwoTone,
} from "@ant-design/icons";

import moment from "moment";
import $ from "jquery";
import { GET, GETMANUAL, POST } from "../../../../../providers/useAxiosQuery";
import { useHistory } from "react-router-dom";
import { userData } from "../../../../../providers/companyInfo";

export default function ModalAppointment(props) {
  const { showModal, setModalVisibility, data, setData } = props;
  const history = useHistory();

  const [tags, setTags] = useState([]);
  const [params, setParams] = useState({
    id: "",
  });

  const [btnDisable, setBtnDisabled] = useState({
    btnShow: true,
    btnCancel: true,
    btnNoShow: true,
  });

  const { refetch: getUserCurrentTask } = GETMANUAL(
    `api/v1/user/tags?${$.param(params)}`,
    "get-user-current-task",
    (res) => {
      if (res.success) {
        console.log("tags:", res.data);
        setTags(res.data);

        let hasCallTask = false;
        let isDoneUpload = false;

        res.data.forEach((tags) => {
          if (tags.includes("upload requirements (done)")) {
            isDoneUpload = true;
          } else if (tags.includes("call (current task)")) {
            hasCallTask = true;
          }
        });

        // if (hasCallTask && isDoneUpload) {
        if (hasCallTask) {
          if (data.status == "noshow" || data.status == "cancelled") {
            setBtnDisabled({
              btnShow: true,
              btnCancel: true,
              btnNoShow: true,
            });
          } else {
            setBtnDisabled({
              btnShow: false,
              btnCancel: false,
              btnNoShow: false,
            });
          }
        } else {
          if (
            data.status == "noshow" ||
            data.status == "cancelled" ||
            data.status == "showed"
          ) {
            setBtnDisabled({
              btnShow: true,
              btnCancel: true,
              btnNoShow: true,
            });
          } else {
            setBtnDisabled({
              btnShow: true,
              btnCancel: false,
              btnNoShow: true,
            });

            message.warning(
              "Client is not yet on consultation call stage, Please check client task!"
            );
          }
        }
      } else {
        setBtnDisabled({ btnShow: true, btnCancel: true, btnNoShow: true });
        message.warning(
          "Client is not yet on consultation call stage, Please check client task!"
        );
      }
    }
  );

  const { mutate: addHistoryLog } = POST(
    "api/v1/historylogs/add",
    "add_history_logs"
  );

  useEffect(() => {
    if (data.length != 0) {
      setParams({ id: data.client.id });
    }
  }, [data]);

  useEffect(() => {
    if (params.id) {
      getUserCurrentTask();
    }
  }, [params.id]);

  const confirm = (value) => {
    Modal.confirm({
      title: "Confirm",
      icon: <ExclamationCircleOutlined />,
      content:
        'Are you sure you want to change appointment status to "' +
        (value == "showed"
          ? "ATTENDED"
          : value == "noshow"
          ? "NO SHOW"
          : value.toUpperCase()) +
        '" ?',
      okText: "Yes",
      cancelText: "No",
      onOk: () => {
        let hasDelete = value === "cancelled and delete" ? true : false;

        // value = value === "cancelled and delete" ? "cancelled" : value;

        let newdata = {
          client_id: data.client.id,
          id: data.id,
          consultant_id: data.user_id,
          status: value,
          deleteAppointment: hasDelete ? data.id : null,
        };

        // console.log("newdata", newdata);
        // console.log("newdata", data);

        mutateChangeStatus(newdata, {
          onSuccess: (res) => {
            if (res.success) {
              console.log(res.data);
              notification.success({
                message: "Success",
                description: "Appointment status changed",
              });

              addHistoryLog(
                {
                  page: "calendar/appointment-status",
                  key: "appointment status",
                  data: JSON.stringify(newdata),
                  old_data: "",
                  new_data: value,
                  method: "change-appointment-status",
                },
                { onSuccess: (res) => {} }
              );

              if (
                value == "showed" &&
                tags.includes("call 2 - call (current task)")
              ) {
                skipNextAppointment();
              } else {
                history.push({
                  pathname: `/user/manageuser/${data.client.id}`,
                  state: {
                    username:
                      data.client.firstname.charAt(0) +
                      data.client.firstname.slice(1) +
                      " " +
                      data.client.lastname.charAt(0) +
                      data.client.lastname.slice(1),
                  },
                });
                setModalVisibility(false);
              }

              setModalVisibility(false);
            }
          },
        });
      },
    });
  };

  const skipNextAppointment = () => {
    Modal.confirm({
      title: "Confirm",
      icon: <ExclamationCircleOutlined />,
      content: "Proceed to timeline call?",
      okText: "Yes",
      cancelText: "No",
      onCancel: () => {
        console.log("canceled");

        let newdata = {
          user_id: data.client.id,
          tag: "follow up call - book (current task)",
        };
        mutateProceed(newdata, {
          onSuccess: (res) => {
            if (res.success) {
              notification.success({
                message: "Success",
                description: "Client will remain in follow up call",
              });
              //   history.push({
              //     pathname: `/user/manageuser/${data.client.id}`,
              //     state: {
              //       username: data.client.firstname + " " + data.client.lastname,
              //     },
              //   });
              history.push({
                pathname: `/user/manageuser/${data.client.id}`,
                state: {
                  username:
                    data.client.firstname.charAt(0) +
                    data.client.firstname.slice(1) +
                    " " +
                    data.client.lastname.charAt(0) +
                    data.client.lastname.slice(1),
                },
              });
            }
          },
        });

        // setToggleModal(false);
        // reload(event);
      },
      onOk: () => {
        let newdata = {
          user_id: data.client.id,
          tag: "timeline - book (current task)",
        };
        mutateProceed(newdata, {
          onSuccess: (res) => {
            if (res.success) {
              notification.success({
                message: "Success",
                description: "Successfully proceed client to next timeline",
              });
              //   history.push({
              //     pathname: `/user/manageuser/${data.client.id}`,
              //     state: {
              //       username: data.client.firstname + " " + data.client.lastname,
              //     },
              //   });
              history.push({
                pathname: `/user/manageuser/${data.client.id}`,
                state: {
                  username:
                    data.client.firstname.charAt(0) +
                    data.client.firstname.slice(1) +
                    " " +
                    data.client.lastname.charAt(0) +
                    data.client.lastname.slice(1),
                },
              });
            }
          },
        });
      },
    });
  };

  const { mutate: mutateProceed, isLoading: loadingProceed } = POST(
    "api/v1/add/conusltant/proceed_tag",
    "add_tag"
  );

  const { mutate: mutateChangeStatus, isLoading: lodaingCancel } = POST(
    "api/v1/user/schedule/change_status",
    "admin-change-status"
  );

  let color = "";
  switch (data.status) {
    case "booked":
      color = "#058d08";
      break;
    case "cancelled":
      color = "#f20020";
      //  setBtnDisabled({ btnShow: true, btnCancel: true, btnNoShow: true });
      break;
    case "noshow":
      color = "#f49917";
      //    setBtnDisabled({ btnShow: true, btnCancel: true, btnNoShow: true });
      break;
    case "showed":
      color = "#783b19";
      //    setBtnDisabled({ btnShow: true, btnCancel: true, btnNoShow: true });
      break;

    default:
      break;
  }

  return (
    <Modal
      visible={showModal}
      title="BOOKING"
      closable
      className="modal-primary-default modal-change-2-factor-authentication modal-appointment"
      footer={null}
      onCancel={() => {
        setModalVisibility(false);
        setData([]);
        setTags([]);
        setParams({ id: "" });
      }}
    >
      <Row gutter={[12, 12]}>
        <Col
          xs={24}
          sm={24}
          md={24}
          style={{ display: "flex", justifyContent: "start" }}
        >
          <Row gutter={[12, 12]}>
            <Col
              xs={24}
              sm={24}
              md={24}
              style={{ display: "flex", flexDirection: "column" }}
            >
              {data.length != 0 && (
                <>
                  <Button
                    type="link"
                    className="modal-name-link"
                    onClick={() => {
                      history.push({
                        pathname: `/user/manageuser/${data.client.id}`,
                        state: {
                          username:
                            data?.client?.firstname.charAt(0) +
                            data?.client?.firstname.slice(1) +
                            " " +
                            data?.client?.lastname.charAt(0) +
                            data?.client?.lastname.slice(1),
                        },
                      });
                    }}
                  >
                    <span
                      className="app-modal-name"
                      style={{
                        color:
                          data.status == "booked"
                            ? "#058d08"
                            : data.status == "showed"
                            ? "#783b19"
                            : data.status == "cancelled"
                            ? "#f20020"
                            : "#f49917",
                        fontWeight: "bold",
                      }}
                    >
                      {data?.client?.firstname + " " + data?.client?.lastname}
                    </span>
                  </Button>

                  <span>
                    {moment(data.schedule_date).format("dddd, MMMM Do")}
                  </span>
                  <span>
                    {moment(data.time_start, "H:mm").format("h:mm A") +
                      " - " +
                      moment(data.time_end, "H:mm").format("h:mm A")}
                  </span>

                  <span>
                    Status:{" "}
                    <span
                      style={{
                        color: color,
                        fontWeight: "bold",
                        textTransform: "capitalize",
                      }}
                    >
                      {data.status === "noshow"
                        ? "NO SHOW"
                        : data.status === "showed"
                        ? "ATTENDED"
                        : data.status.toUpperCase()}
                    </span>{" "}
                  </span>

                  {/* {data.status === "cancelled" && (
                    <>
                      <span>
                        Cancelled by:{" "}
                        <span
                          style={{
                            color: color,
                            fontWeight: "bold",
                            textTransform: "capitalize",
                          }}
                        >
                          {data.cancelled_by === "User"
                            ? "Client"
                            : data.cancelled_by}
                        </span>{" "}
                      </span>
                      <span>
                        Cancelled on: <br />
                        <span>
                          {moment(data.cancelled_at).format(
                            "h:mm A, MMM do YYYY"
                          )}
                        </span>{" "}
                      </span>
                    </>
                  )} */}
                </>
              )}
            </Col>
          </Row>
        </Col>
      </Row>

      <Row gutter={[12, 12]} style={{ marginTop: "30px" }}>
        <Col xs={24} sm={24} md={24}>
          <Button
            disabled={btnDisable.btnShow}
            onClick={() => {
              confirm("showed");
            }}
            className="text-center btn-modal btn-modal-success"
            block
          >
            ATTENDED
          </Button>
        </Col>
        <Col xs={24} sm={24} md={24}>
          <Button
            disabled={btnDisable.btnNoShow}
            onClick={() => {
              confirm("noshow");
            }}
            className="text-center btn-modal btn-modal-warning"
            block
          >
            NO SHOW
          </Button>
        </Col>
        <Col xs={24} sm={24} md={24}>
          <Button
            disabled={btnDisable.btnCancel}
            onClick={() => {
              confirm("cancelled");
            }}
            className="text-center btn-modal btn-modal-danger"
            block
          >
            CANCEL
          </Button>
        </Col>

        {/* admin only */}

        {userData().role == "Admin" && (
          <Col xs={24} sm={24} md={24}>
            <Button
              disabled={btnDisable.btnCancel}
              onClick={() => {
                confirm("cancelled and delete");
              }}
              className="text-center btn-modal btn-modal-danger"
              block
            >
              CANCEL & DELETE
            </Button>
          </Col>
        )}
      </Row>
    </Modal>
  );
}
