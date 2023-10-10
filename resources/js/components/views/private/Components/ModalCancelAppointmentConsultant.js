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
  Dropdown,
  Menu,
} from "antd";
import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
//import FloatInputPasswordStrength from "../../../../providers/FloatInputPasswordStrength";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/pro-solid-svg-icons";
import {
  faCircleInfo,
  faUserSlash,
  faUserCheck,
} from "@fortawesome/pro-light-svg-icons";
import { POST, GET, UPDATE } from "../../../providers/useAxiosQuery";
import { ExclamationCircleOutlined, WindowsFilled } from "@ant-design/icons";
import moment from "moment";
import { GoPrimitiveDot } from "react-icons/go";

export default function ModalCancelAppointment(props) {
  const { toggleModal, setToggleModal, reload, details, event } = props;
  const history = useHistory();

  const [form] = Form.useForm();
  const [slots, setSlots] = useState([]);
  const [timeZone, setTimeZone] = useState([]);
  const [currentTimezone, setCurrentTimezone] = useState("");
  const [showSlots, setShowSlots] = useState(false);
  const [date, setDate] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);
  const [isDisabledCancel, setIsDisabledCancel] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [appointmentDetails, setappointmentDetails] = useState([]);
  const [client_details, setClientDetails] = useState([]);
  const [clientName, setClientName] = useState("");

  const option = [
    { title: "Showed", value: "showed", icon: faCircleInfo },
    { title: "No-Show", value: "noshow", icon: faCircleInfo },
    { title: "Cancelled", value: "cancelled", icon: faCircleInfo },
  ];

  useEffect(() => {
    if (details[0] && details[0].eventInfo) {
      let contact = details[0].eventInfo.extendedProps.contact;

      setClientDetails(details[0].eventInfo.extendedProps.contact);

      let diff = moment(details[0] && details[0].eventInfo.startStr)
        .tz("MST")
        .diff(moment(), "hours");

      if (details[0].eventInfo.extendedProps.appoinmentStatus != "confirmed") {
        setIsDisabled(true);
        setIsDisabledCancel(true);
      }

      function hasTag(tags) {
        let hasUploaded = false;
        let isWaitingForCall = false;

        tags.forEach((tag) => {
          // if (tag.includes("upload requirements (done)")) {
          //   hasUploaded = true;
          // }  else
          if (tag.includes("call (current task)")) {
            isWaitingForCall = true;
          }
        });

        if (isWaitingForCall) {
          return true;
        } else {
          return false;
        }
      }

      if (!hasTag(contact.tags)) {
        setIsDisabled(true);
        setShowMessage(true);
      }
    }

    return () => {};
  }, [details]);

  const { mutate: addHistoryLog } = POST(
    "api/v1/historylogs/add",
    "add_history_logs"
  );

  const confirm = (value) => {
    Modal.confirm({
      title: "Confirm",
      icon: <ExclamationCircleOutlined />,
      content:
        'Are you sure you want to change appointment status to "' +
        (value == "Showed" ? "Attended" : value) +
        '" ?',
      okText: "Yes",
      cancelText: "No",
      onOk: () => {
        let data = {
          client_id: details[0].eventInfo.extendedProps.contactId,
          id: details[0].eventInfo.extendedProps.id,
          status: value,
        };

        mutateCancel(data, {
          onSuccess: (res) => {
            if (res.success) {
              notification.success({
                message: "Success",
                description: "Appointment status changed",
              });

              addHistoryLog(
                {
                  page: "calendar/appointment-status",
                  key: "appointment status",
                  data: JSON.stringify(data),
                  old_data: "",
                  new_data: value,
                  method: "change-appointment-status",
                },
                { onSuccess: (res) => {} }
              );

              if (
                value == "Showed" &&
                client_details.tags.includes("call 2 - call (current task)")
              ) {
                skipNextAppointment();
              } else {
                history.push({
                  pathname: `/user/manageuser/${details[0].eventInfo.extendedProps.contactId}`,
                  state: {
                    username:
                      client_details.firstName.charAt(0) +
                      client_details.firstName.slice(1) +
                      " " +
                      client_details.lastName.charAt(0) +
                      client_details.lastName.slice(1),
                  },
                });
                // setToggleModal(false);
                // reload(event);
              }
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
        let data = {
          email: client_details.email,
          tag: "follow up call - book (current task)",
        };
        mutateProceed(data, {
          onSuccess: (res) => {
            if (res.success) {
              notification.success({
                message: "Success",
                description: "Client will remain in follow up call",
              });

              addHistoryLog(
                {
                  page: "client-stage/proceed-to-timeline",
                  key: "appointment stage",
                  data: client_details.email,
                  old_data: "call 2",
                  new_data: "timeline call",
                  method: "change-appointment-stage",
                },
                { onSuccess: (res) => {} }
              );

              // history.push({
              //   pathname: `/user/manageuser/${details[0].eventInfo.extendedProps.contactId}`,
              //   state: { username: client_details.fullNameLowerCase },
              // });
            }
          },
        });

        // setToggleModal(false);
        // reload(event);
      },
      onOk: () => {
        let data = {
          email: client_details.email,
          tag: "timeline - book (current task)",
        };
        mutateProceed(data, {
          onSuccess: (res) => {
            if (res.success) {
              notification.success({
                message: "Success",
                description: "Successfully proceed client to next timeline",
              });
              history.push({
                pathname: `/user/manageuser/${details[0].eventInfo.extendedProps.contactId}`,
                state: { username: client_details.fullNameLowerCase },
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

  const { mutate: mutateCancel, isLoading: lodaingCancel } = POST(
    "api/v1/user/schedule/change_status",
    "appointment"
  );

  const handleToggleModal = () => {
    setIsDisabled(false);
    setToggleModal(false);
    setIsDisabledCancel(false);
  };

  const [classname, setClassName] = useState("");
  const [status, setStatus] = useState("");
  useEffect(() => {
    if (details.length != 0) {
      let classname = premitiveColor(
        details[0].eventInfo.extendedProps.appointmentStatus
      );

      if (details[0].eventInfo.extendedProps.appointmentStatus === "noshow") {
        setStatus("NO SHOW");
      } else if (
        details[0].eventInfo.extendedProps.appointmentStatus === "showed"
      ) {
        setStatus("ATTENDED");
      } else if (
        details[0].eventInfo.extendedProps.appointmentStatus === "confirmed"
      ) {
        setStatus("BOOKED");
      } else {
        setStatus(
          details[0].eventInfo.extendedProps.appointmentStatus.toUpperCase()
        );
      }

      setClassName(classname);
    }
  }, [details]);

  function premitiveColor(status) {
    // console.log("status: ", status);
    let classname = "";

    switch (status) {
      case "showed":
        classname = "primitive-brown";
        break;
      case "confirmed":
        classname = "primitive-success";
        break;
      case "cancelled":
        classname = "primitive-cancelled";
        break;
      case "noshow":
        classname = "primitive-warning";
        break;
      default:
        classname = "primitive-available";
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
          <div className="row">
            <div>
              <Button
                style={{ width: "100%", fontSize: "18px" }}
                size="large"
                onClick={() => {
                  confirm("Showed");
                }}
                className="btn-modal-success text-center"
                disabled={isDisabled}
                block
              >
                ATTENDED
              </Button>
            </div>
            <div className="m-t-sm">
              <Button
                style={{ width: "100%", fontSize: "18px" }}
                size="large"
                onClick={() => {
                  confirm("No Show");
                }}
                className="btn-modal-warning"
                disabled={isDisabled}
              >
                NO SHOW
              </Button>
            </div>
            <div className="m-t-sm">
              <Button
                style={{ width: "100%", fontSize: "17px" }}
                size="large"
                onClick={() => {
                  confirm("Cancelled");
                }}
                className="btn-modal-danger btn-consultant-cancel"
                disabled={isDisabledCancel}
              >
                CANCEL MY APPOINTMENT
              </Button>
            </div>
          </div>
        )
      }
    >
      <Row
        style={{ display: "flex", justifyContent: "center", marginTop: "-5px" }}
      >
        <Col>
          <>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <span className="admin-calendar-status">
                <GoPrimitiveDot className={classname} />
              </span>
              <Button
                type="link"
                className={"name-link " + classname}
                onClick={() =>
                  history.push({
                    pathname: `/user/manageuser/${details[0].eventInfo.extendedProps.contactId}`,
                    state: {
                      username:
                        client_details.firstName.charAt(0) +
                        client_details.firstName.slice(1) +
                        " " +
                        client_details.lastName.charAt(0) +
                        client_details.lastName.slice(1),
                    },
                  })
                }
              >
                <span className="event-title">
                  <strong>{details[0] && details[0].eventInfo.title}</strong>
                </span>
              </Button>
            </div>
            <div
              className="event-schedule-container"
              style={{ marginLeft: "15px" }}
            >
              <span className="event-date">
                {details[0] && details[0].date}
              </span>
              <br />
              <span className="event-time">
                {details[0] &&
                  moment(details[0].time_start, "H:mm a").format("h:mm A")}{" "}
                {"-"}{" "}
                {details[0] &&
                  moment(details[0].time_end, "H:mm a").format("h:mm A")}
              </span>
              <br />
              <span className="event-time">
                {" "}
                Status:{" "}
                <strong className={classname}>{details[0] && status}</strong>
              </span>
            </div>
          </>
        </Col>
      </Row>
    </Modal>
  );
}
