import {
  Button,
  Col,
  Form,
  Modal,
  Row,
  Typography,
  notification,
  Select,
  Divider,
} from "antd";
import React, { useState, useEffect } from "react";
//import FloatInputPasswordStrength from "../../../../providers/FloatInputPasswordStrength";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/pro-solid-svg-icons";
import { faCircleInfo } from "@fortawesome/pro-light-svg-icons";
import { POST, GET, UPDATE } from "../../../providers/useAxiosQuery";
import { ExclamationCircleOutlined, WindowsFilled } from "@ant-design/icons";
import moment from "moment";
import { GoPrimitiveDot } from "react-icons/go";

export default function ModalCancelAppointment(props) {
  const { toggleModal, setToggleModal, selectedDate, details } = props;

  const [form] = Form.useForm();
  const [slots, setSlots] = useState([]);
  const [timeZone, setTimeZone] = useState([]);
  const [currentTimezone, setCurrentTimezone] = useState("");
  const [showSlots, setShowSlots] = useState(false);
  const [date, setDate] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);
  const [appointmentDetails, setappointmentDetails] = useState([]);

  useEffect(() => {
    if (selectedDate) {
      form.setFieldsValue({
        appointmentDate: selectedDate,
        timezone: currentTimezone,
      });
      handleTimeZoneChanged(currentTimezone);
    }

    return () => {};
  }, [selectedDate]);

  useEffect(() => {
    if (details[0] && details[0].eventInfo) {
      // console.log("details", details[0]);
      let diff = moment(details[0] && details[0].eventInfo.startStr).diff(
        moment().tz("MST"),
        "minutes"
      );

      // console.log("diff", diff);
      // console.log("moment", moment().tz("MST").format("MM-DD-YYYY"));
      // console.log("start", details[0] && details[0].eventInfo.startStr);

      if (diff < 30 || details[0].eventInfo.extendedProps.status != "booked") {
        setIsDisabled(true);
      }
      //   console.log("ModalCancelAppointment", diff);
      //   console.log("ModalCancelAppointment", details[0].eventInfo.extendedProps);
    }

    return () => {};
  }, [details]);

  const { mutate: mutateGetSlots, isLoading: isLoadingSlot } = POST(
    "api/v1/slot",
    "slots"
  );

  const { mutate: mutateAddAppointments, isLoading: isLoading } = POST(
    "api/v1/appointment",
    "appointment"
  );

  const handleTimeZoneChanged = (val) => {
    let strDt = moment(form.getFieldValue("appointmentDate"))
      .add(8, "hours")
      .valueOf();
    let endDt = moment(form.getFieldValue("appointmentDate"))
      .add(17, "hours")
      .valueOf();
    let date = form.getFieldValue("appointmentDate");

    let data = {
      selectedTimeZone: val,
      startDate: strDt,
      endDate: endDt,
    };

    let slots_available = [];
    mutateGetSlots(data, {
      onSuccess: (res) => {
        if (res.success) {
          res.data &&
            res.data[date]["slots"].map((item) => {
              slots_available.push({
                label: moment(item).format("HH:mm"),
                value: item,
              });
            });

          console.log("handleTimeZoneChanged", slots_available);
          setSlots(slots_available);
        }
      },
    });
  };

  const { mutate: addHistoryLog } = POST(
    "api/v1/historylogs/add",
    "add_history_logs"
  );

  const confirm = (role) => {
    Modal.confirm({
      title: "Confirm",
      icon: <ExclamationCircleOutlined />,
      content: "Are you sure you want to cancel this appointment?",
      okText: "Yes",
      cancelText: "No",
      onOk: () => {
        console.log("here");
        let data = {
          client_id: details[0]?.eventInfo?.extendedProps?.booked_by,
          id: details[0]?.eventInfo?.id,
          consultant_id: details[0]?.eventInfo?.extendedProps?.user_id,
          status: "cancelled",
          //   deleteAppointment: hasDelete ? data.id : null,
        };

        console.log("ModalCancelAppointment", data);
        mutateCancel(data, {
          onSuccess: (res) => {
            if (res.success) {
              console.log(res.data);
              notification.success({
                message: "Success",
                description: "Appointment Cancelled",
              });

              addHistoryLog(
                {
                  page: "user / myschedule",
                  key: "appointment slot",
                  old_data: "Booked",
                  new_data: details[0].eventInfo.startStr,
                  method: "cancel-appointment",
                  consultant: details[0].eventInfo.title,
                },
                { onSuccess: (res) => {} }
              );

              setToggleModal(false);
              window.location.reload(false);
            }
          },
        });
      },
    });
  };

  const { mutate: mutateCancel, isLoading: lodaingCancel } = POST(
    "api/v1/user/schedule/change_status",
    "appointment"
  );

  const handleToggleModal = () => {
    setIsDisabled(false);
    setToggleModal(false);
  };

  GET("api/v1/timezones", "timezone", (res) => {
    if (res.success) {
      let data = [];
      res.data.map((item) => {
        data.push({
          label: item,
          value: item,
        });

        return "";
      });

      setTimeZone(data);
      let currentTimezone = "US/Mountain";
      setCurrentTimezone(currentTimezone);
    }
  });

  const onFinishForm = (values) => {
    let data = {
      ...values,
    };

    mutateAddAppointments(data, {
      onSuccess: (res) => {
        if (res.success) {
          console.log(res.data);
          notification.success({
            message: "Success",
            description: "Successfully booked",
          });
          setToggleModal(false);
          window.location.reload(false);
        }
      },
    });
  };

  const changeStatusName = (status) => {
    console.log("status", status);
    let new_status = "";
    if (status === "SHOWED") {
      new_status = "ATTENDED";
    } else if (status === "NOSHOW") {
      new_status = "NO SHOW";
    } else if (status === "CANCELLED") {
      new_status = "CANCELLED";
    } else if (status === "CONFIRMED") {
      new_status = "BOOKED";
    }

    return new_status;
  };

  function premitiveColor(status) {
    let classname = "";

    switch (status) {
      case "showed":
        classname = "primitive-brown";
        break;
      case "cancelled":
        classname = "primitive-cancelled";
        break;
      case "noshow":
        classname = "primitive-warning";
        break;
      case null || "confirmed":
        classname = "primitive-success";
        break;

      default:
        break;
    }
    return classname;
  }

  return (
    <Modal
      visible={toggleModal}
      title="APPOINTMENT"
      onCancel={handleToggleModal}
      className="modal-primary-default modal-change-2-factor-authentication modal-appointment"
      footer={
        details[0] && (
          <>
            <Button
              style={{ width: "100%", fontSize: "18px" }}
              size="large"
              onClick={confirm}
              className="btn-danger"
              disabled={isDisabled}
            >
              CANCEL APPOINTMENT
            </Button>
          </>
        )
      }
    >
      <Row style={{ display: "flex", justifyContent: "center" }}>
        <Col>
          <>
            <div className="event-title-container">
              <span
                className="admin-calendar-status"
                style={{ marginBottom: "3px" }}
              >
                <GoPrimitiveDot
                  className={premitiveColor(
                    details[0] && details[0].eventInfo.extendedProps.status
                  )}
                />
              </span>
              <div
                className={
                  "event-title " +
                  premitiveColor(
                    details[0] && details[0].eventInfo.extendedProps.status
                  )
                }
              >
                <strong>{details[0] && details[0].eventInfo.title}</strong>
              </div>
            </div>
            <div
              className="event-schedule-container"
              style={{ marginLeft: "18px" }}
            >
              <span className="event-date">
                {details[0] && details[0].date}
              </span>
              <br />
              <span className="event-time">
                {details[0] &&
                  moment(details[0].time_start, "H:mm").format("h:mm A")}{" "}
                {"-"}{" "}
                {details[0] &&
                  moment(details[0].time_end, "H:mm").format("h:mm A")}
              </span>
              <br />
              <span className="event-time">
                {" "}
                Status:{" "}
                <strong
                  className={premitiveColor(
                    details[0] && details[0].eventInfo.extendedProps.status
                  )}
                >
                  {details[0] &&
                    changeStatusName(
                      details[0].eventInfo.extendedProps.status.toUpperCase()
                    )}
                </strong>
              </span>
            </div>
          </>
        </Col>
      </Row>
    </Modal>
  );
}
