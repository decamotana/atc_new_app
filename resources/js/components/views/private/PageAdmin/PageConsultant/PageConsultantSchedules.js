import React, { useEffect, useState } from "react";
import {
  Card,
  Col,
  Row,
  notification,
  Modal,
  Button,
  Space,
  Typography,
} from "antd";
import FullCalendar from "@fullcalendar/react"; // must go before plugins
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import momentTimezonePlugin from "@fullcalendar/moment-timezone";
import { POST, GET } from "../../../../providers/useAxiosQuery";
import moment from "moment";
import tz from "moment-timezone";
import ModalAddConsultantAvailability from "../../Components/ModalAddConsultantAvailability";
import { userData, role } from "../../../../providers/companyInfo";
import { ExclamationCircleOutlined, WindowsFilled } from "@ant-design/icons";
import ModalCancelAppointment from "../../Components/ModalCancelAppointmentConsultant";
import $ from "jquery";
import { faDownload } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { saveAs } from "file-saver";

const { Text } = Typography;

const PageConsultantSchedules = (props) => {
  const { match } = props.match;
  const [selectedDate, setSelectedDate] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [appointmentDetails, setAppointmentDetails] = useState([]);
  const [stage, setStages] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [slotId, setSlotId] = useState();
  const [id, setID] = useState("");
  const [currentDate, setCurrentDate] = useState({
    start: "",
    end: "",
  });

  useEffect(() => {
    if (role() === "Consultant" || role() === "Special consultant") {
      setID(userData().id);
    } else {
      if (props.match.params.id) {
        setID(props.match.params.id);
      }
    }
  }, [props]);

  useEffect(() => {
    if (id !== "") {
      handlesChangeDate();
    }
  }, [id]);

  const handlesChangeDate = () => {
    // let strDt = moment(e.startStr).format("MM/DD/YYYY");
    // let endDt = moment(e.endStr).format("MM/DD/YYYY");
    let data = {
      id: id,
      // startDate: strDt,
      // endDate: endDt,
      // timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };

    let bookedAppointments = [];
    let events = [];

    mutateGetAppointmentsAdmin(data, {
      onSuccess: (res) => {
        if (res.success) {
          //       $(".globalLoading").removeClass("hide");
          let schedules = [];
          res.data.map((schedule) => {
            schedules.push({
              title: "",
              start: moment(
                schedule.schedule_date + " " + schedule.time_start
              ).format("YYYY-MM-DDTHH:mm"),
              end: moment(
                schedule.schedule_date + " " + schedule.time_end
              ).format("YYYY-MM-DDTHH:mm"),
              id: schedule.id,
              extendedProps: schedule,
            });
          });

          setAppointments(schedules);

          //      console.log("bookedAppointments", res.data);
          //    setAppointments(bookedAppointments);
        }
      },
    });
  };

  // useEffect(() => {
  //   if (appointments.length) {
  //     $(".globalLoading").addClass("hide");
  //   }
  // }, [appointments]);

  const { mutate: mutateDeleteSlot, isLoading: lodaingDeleteSlot } = POST(
    "api/v1/calendar/delete/slots",
    "get_appointment"
  );

  const { mutate: addHistoryLog } = POST(
    "api/v1/historylogs/add",
    "add_history_logs"
  );

  const showModalDelete = (value) => {
    setShowConfirmModal(true);
    setSlotId(value);
  };

  const deleteSlot = (value) => {
    let data = {
      slot_id: value,
      //   status: value,
    };

    mutateDeleteSlot(data, {
      onSuccess: (res) => {
        if (res.success) {
          notification.success({
            message: "Success",
            description: res.message,
          });

          addHistoryLog(
            {
              page: "consultant/schedule",
              key: "appointment slot",
              slot_data: JSON.stringify(res.data),
              old_data: "",
              new_data: "",
              method: "delete-slot",
            },
            { onSuccess: (res) => {} }
          );

          setShowConfirmModal(false);
          handlesChangeDate();
          //    window.location.reload(false);
        }
      },
    });
  };

  const { mutate: mutateGetAppointmentsAdmin, isLoading: isLoadingSlot } = POST(
    "api/v1/get/consultant/appointment",
    "get_appointment"
  );

  // const { refetch: refetchOpportunity } = GETMANUAL(
  //   "api/v1/user/opportunity",
  //   "opportunity",
  //   (res) => {
  //     if (res.success) {
  //       setStages(res.pipeline_stages);
  //     }
  //   }
  // );

  // const handleEventClick = (eventInfo) => {
  //   console.log(eventInfo);
  // };

  useEffect(() => {
    if (appointmentDetails.length > 0) {
      //   console.log(appointmentDetails);
      setToggleBookedModal(true);
    }
  }, [appointmentDetails]);

  const handleDateClick = (e) => {
    // if (
    //   moment(e.dateStr).format("YYYY-MM-DD") >=
    //   moment().tz("MST").format("YYYY-MM-DD")
    // ) {
    setSelectedDate(moment(e.dateStr).format("MM/DD/YYYY"));
    setToggleBookedModal(true);
    // } else {
    //   notification.warning({
    //     message: "Not Allowed",
    //     description: "You can't add slots on past dates",
    //   });
    // }
  };

  const [toggleModal, setToggleModal] = useState(false);
  const [toggleBookedModal, setToggleBookedModal] = useState(false);

  const { mutate: mutateDownloadCSV, isLoading: isLoadingSlots } = POST(
    "api/v1/calendar/download-schedule/csv",
    "download_calendar_csv"
  );

  const { mutate: mutateDownloadICS, isLoading: isLoadingICS } = POST(
    "api/v1/calendar/download-schedule/ics",
    "download_calendar_csv"
  );

  const arrayToCSV = (arr, delimiter = ",") =>
    arr
      .map((v) =>
        v
          .map((x) => (isNaN(x) ? `"${x.replace(/"/g, '""')}"` : x))
          .join(delimiter)
      )
      .join("\n");

  const donwloadCSV = () => {
    let data;
    if (id) {
      data = { ...currentDate, id: id };
    } else {
      data = { ...currentDate };
    }

    mutateDownloadCSV(data, {
      onSuccess: (res) => {
        if (res.success) {
          // console.log(res.data.toString());
          var blob = new Blob([arrayToCSV(res.data)], {
            type: "text/csv;charset=utf-8",
          });
          saveAs(blob, "download.csv");
          // window.location.replace(res.url);
          //   setAppointments(bookedAppointments);
        }
      },
    });
  };

  const donwloadICS = () => {
    //  console.log("appointments", currentDate);
    let data;
    if (id) {
      data = { ...currentDate, id: id };
    } else {
      data = { ...currentDate };
    }

    mutateDownloadICS(data, {
      onSuccess: (res) => {
        if (res.success) {
          var blob = new Blob([res.data], {
            type: "text/calendar;charset=utf-8",
          });
          saveAs(blob, "download.ics");
          //   window.location.replace(res.url);
          //    setAppointments(bookedAppointments);
        }
      },
    });
  };

  return (
    <Card className="card--padding-mobile">
      <Row gutter={8}>
        <Col xs={24} sm={24} md={24}>
          <Text>
            Note: To create an available time slot, simply click the date on the
            calendar and a pop-up prompt will appear for that day.
          </Text>
        </Col>
        <Col
          xs={24}
          sm={24}
          md={24}
          className="admin-calendar consultant-bookings-calendar"
        >
          <FullCalendar
            timeZone="MST"
            allDaySlot={false}
            height="auto"
            slotEventOverlap={false}
            eventMaxStack={1}
            defaultView="dayGridMonth"
            dayMaxEventRows={5}
            displayEventEnd={{ month: true, basicWeek: true, default: true }}
            customButtons={{
              downLoadCSV: {
                text: (
                  <>
                    <FontAwesomeIcon icon={faDownload} /> Outlook/Google
                  </>
                ),
                click: function () {
                  donwloadCSV();
                },
              },
              downLoadICS: {
                text: (
                  <>
                    <FontAwesomeIcon icon={faDownload} /> ICalendar
                  </>
                ),
                click: function () {
                  donwloadICS();
                },
              },
            }}
            headerToolbar={{
              left: "prev,next",
              center: "title",
              right:
                "downLoadCSV,downLoadICS dayGridMonth,timeGridWeek,timeGridDay",
            }}
            plugins={[
              dayGridPlugin,
              timeGridPlugin,
              interactionPlugin,
              momentTimezonePlugin,
            ]}
            events={appointments}
            // eventSources={appointments.map((items) => {
            //   return items;
            // })}
            eventTimeFormat={{
              hour: "2-digit",
              minute: "2-digit",
              meridiem: true,
            }}
            // eventClick={(e) => deleteSlot(e.event.id)}
            eventClick={(e) => {
              // console.log("asdasdasd", e);

              if (
                e.event.extendedProps.status == null ||
                e.event.extendedProps.status == "cancelled"
              ) {
                showModalDelete(e.event.id);
              } else {
                notification.warning({
                  message: "This slot is already booked",
                  description: "You cannot edit or delete booked slots",
                  placement: "top",
                });
              }
            }}
            dateClick={(e) => handleDateClick(e)}
            datesSet={(e) => {
              // console.log("e", e);
              setCurrentDate({ start: e.startStr, end: e.endStr });
              handlesChangeDate();
            }}
          />
        </Col>
      </Row>

      <ModalAddConsultantAvailability
        toggleModal={toggleBookedModal}
        setToggleModal={setToggleBookedModal}
        selectedDate={selectedDate}
        details={appointmentDetails}
        data={appointments}
        id={id}
        reload={handlesChangeDate}
      />

      <ModalCancelAppointment
        toggleModal={toggleModal}
        setToggleModal={setToggleModal}
        //   setSelectedDate={setSelectedDate}
        details={appointmentDetails}
      />

      <Modal
        visible={showConfirmModal}
        title="CONFIRM"
        onCancel={() => {
          setShowConfirmModal(false);
        }}
        footer={
          <Space>
            <Button
              onClick={() => {
                deleteSlot(slotId);
              }}
              className="atc-btn-opposite"
              type="primary"
            >
              Yes
            </Button>
          </Space>
        }
      >
        {<p>Are you sure you want to delete this appointment?</p>}
      </Modal>
    </Card>
  );
};

export default PageConsultantSchedules;
