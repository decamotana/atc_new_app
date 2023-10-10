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
} from "antd";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faArrowDown,
  faCheckCircle,
  faPencil,
  faTrash,
  faXmarkCircle,
} from "@fortawesome/pro-regular-svg-icons";

import {
  ExclamationCircleOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";

import FloatTimePicker from "../../../../../providers/FloatTimePicker";
import moment from "moment";
import { GET, GETMANUAL, POST } from "../../../../../providers/useAxiosQuery";

export default function ModalAvailability(props) {
  const { showModal, setModalVisibility, data, setData, getEvents } = props;
  const [isEdit, setIsEdit] = useState(false);
  const [form] = Form.useForm();

  const format = "HH:mma";

  useEffect(() => {
    if (isEdit) {
      form.setFieldsValue({
        timeStart: moment(data.time_start, "H:mm"),
        timeEnd: moment(data.time_end, "H:mm"),
      });
    }
  }, [isEdit]);

  const onFinish = (values) => {
    let newdata = {
      timeStart: moment(values.timeStart).format("H:mm"),
      timeEnd: moment(values.timeEnd).format("H:mm"),
      id: data.id,
    };

    mutateEditSlot(newdata, {
      onSuccess: (res) => {
        if (res.success) {
          notification.success({
            message: "Success",
            description: res.message,
          });
          getEvents();
          setIsEdit(false);
          setModalVisibility(false);
        }
      },
      onError: (res) => {
        notification.warning({
          message: "Update Error",
          description: res.message,
        });
      },
    });
  };

  const onDelete = () => {
    let newdata = {
      id: data.id,
    };

    mutateDeleteSlot(newdata, {
      onSuccess: (res) => {
        if (res.success) {
          notification.success({
            message: "Success",
            description: res.message,
          });
          getEvents();
          setIsEdit(false);
          setModalVisibility(false);
        }
      },
      onError: (res) => {
        notification.warning({
          message: "Update Error",
          description: res.message,
        });
      },
    });
  };

  const { mutate: mutateEditSlot, isLoading: isLoadingEditSlot } = POST(
    "api/v1/admin/calendar/change-consultant-slot",
    "admin-calendar-events"
  );

  const { mutate: mutateDeleteSlot, isLoading: isLoadingDeleteSlot } = POST(
    "api/v1/admin/calendar/delete-consultant-slot",
    "admin-calendar-events"
  );

  return (
    <Modal
      visible={showModal}
      title="AVAILABILITY"
      closable
      className="modal-calendar-availability"
      footer={
        isEdit ? (
          <>
            <Row gutter={12}>
              <Col md={8}></Col>
              <Col md={8}>
                <Button
                  type="primary"
                  className="atc-btn"
                  style={{ textTransform: "uppercase" }}
                  onClick={() => {
                    form.submit();
                  }}
                >
                  Save
                </Button>
              </Col>

              <Col md={8}>
                <Button
                  type="primary"
                  className="atc-btn-opposite"
                  onClick={() => {
                    setIsEdit(false);
                  }}
                >
                  Cancel
                </Button>
              </Col>
            </Row>
          </>
        ) : null
      }
      onCancel={() => {
        setModalVisibility(false);
        setIsEdit(false);
        setData([]);
      }}
    >
      {isEdit == false ? (
        <Row gutter={[12, 12]}>
          <Col
            xs={24}
            sm={24}
            md={24}
            style={{ display: "flex", justifyContent: "center" }}
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
                    <div style={{ display: "flex" }}>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span style={{ color: "#779df9", fontWeight: "bold" }}>
                          {data.user.firstname + " " + data.user.lastname}
                        </span>

                        <span style={{ fontSize: "12px" }}>
                          {moment(data.date).tz("MST").format("dddd, MMMM Do")}
                        </span>

                        <div style={{ fontSize: "12px" }}>
                          {moment(data.time_start, "H:mm").format("h:mm A") +
                            " - " +
                            moment(data.time_end, "H:mm").format("h:mm A")}
                        </div>
                      </div>

                      <div
                        style={{
                          width: "15%",
                          fontSize: "12px",
                          display: "flex",
                          flexDirection: "column",
                          marginLeft: "10px",
                          gap: "10px",
                        }}
                      >
                        <Button
                          size="small"
                          type="primary"
                          className="btn-warning"
                          onClick={() => {
                            setIsEdit(true);
                          }}
                        >
                          <FontAwesomeIcon icon={faPencil} />
                        </Button>{" "}
                        <Popconfirm
                          placement="bottom"
                          title="Delete Slot"
                          description="Are you sure to delete this slot?"
                          onConfirm={() => onDelete()}
                          onCancel={() => {}}
                          okText="Yes"
                          cancelText="No"
                          icon={
                            <QuestionCircleOutlined
                              style={{ color: "#9b0303" }}
                            />
                          }
                        >
                          <Button
                            size="small"
                            type="primary"
                            className="btn-danger"
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </Button>
                        </Popconfirm>
                      </div>
                    </div>
                  </>
                )}
              </Col>
              <Col xs={24} sm={24} md={24}></Col>
            </Row>
          </Col>
        </Row>
      ) : (
        <Row className="m-t-lg">
          <Col md={24} lg={24} sm={24} xs={24}>
            {" "}
            <Form name="dynamic_form_nest_item" onFinish={onFinish} form={form}>
              <Row>
                <Col
                  xs={24}
                  md={24}
                  lg={24}
                  sm={24}
                  style={{
                    display: "flex",
                    marginBottom: 8,
                  }}
                  align="baseline"
                >
                  <Row
                    className="timeslot-select-cont"
                    style={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <Col xs={24} md={24} lg={24} sm={24}>
                      <Form.Item name="timeStart" hasFeedback required>
                        <FloatTimePicker
                          placeholder="Time Start"
                          label="Time Start"
                          format={format}
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={24} md={24} lg={24} sm={24}>
                      <Form.Item name="timeEnd" hasFeedback required>
                        <FloatTimePicker
                          placeholder="Time End"
                          label="Time End"
                          format={format}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
      )}
    </Modal>
  );
}
