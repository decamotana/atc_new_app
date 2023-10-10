import React, { useEffect, useState } from "react";
import { Card, Col, Row, notification } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/pro-regular-svg-icons";
import FullCalendar from "@fullcalendar/react"; // must go before plugins
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction"; //
import momentTimezonePlugin from "@fullcalendar/moment-timezone";
import { POST, GET } from "../../../../providers/useAxiosQuery";
import moment from "moment";
import ModalCancelAppointment from "../../Components/ModalCancelAppointment";
import { saveAs } from "file-saver";

import { GoPrimitiveDot } from "react-icons/go";

function PageMySchedule() {
  const [selectedDate, setSelectedDate] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [appointmentsRaw, setAppointmentsRaw] = useState([]);
  const [appointmentDetails, setAppointmentDetails] = useState([]);
  const [stage, setStages] = useState([]);

  const { mutate: mutateDownloadCSV, isLoading: isLoadingSlot } = POST(
    "api/v1/calendar/download/csv",
    "download_calendar_csv"
  );

  const { mutate: mutateDownloadICS, isLoading: isLoadingICS } = POST(
    "api/v1/calendar/download/ics",
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
    let data = { appointments: appointmentsRaw };

    mutateDownloadCSV(data, {
      onSuccess: (res) => {
        if (res.success) {
          var blob = new Blob([arrayToCSV(res.data)], {
            type: "text/csv;charset=utf-8",
          });
          saveAs(blob, "download.csv");
          //    setAppointments(bookedAppointments);
        }
      },
    });
  };

  const donwloadICS = () => {
    let data = { appointments: appointmentsRaw };

    mutateDownloadICS(data, {
      onSuccess: (res) => {
        if (res.success) {
          var blob = new Blob([res.data], {
            type: "text/calendar;charset=utf-8",
          });
          saveAs(blob, "download.ics");
          //    setAppointments(bookedAppointments);
        }
      },
    });
  };

  GET("api/v1/user/schedule", "schedule", (res) => {
    if (res.success) {
      let appointments = [];
      console.log("events:", res.data);
      res.data.map((item) => {
        // let consultant = res.teamCalendar.find(
        //   ({ id }) => id === item.calendarId
        // );
        // let endTime = "";
        // res.userAppointment.map((appItem) => {
        //   if (
        //     appItem.schedule_date ===
        //       moment(item.startTime).format("MM/DD/YYYY") &&
        //     appItem.time_start === moment(item.startTime).format("HH:mm")
        //   ) {
        //   }
        // });
        let dateStartTime = item?.schedule_date + " " + item?.time_start;
        dateStartTime = moment(dateStartTime).format("YYYY-MM-DD HH:mm:ss");

        let dateEndTime = item?.schedule_date + " " + item?.time_end;
        dateEndTime = moment(dateEndTime).format("YYYY-MM-DD HH:mm:ss");
        if (item.appointmentStatus != "deleted") {
          appointments.push({
            extendedProps: item,
            title: `${item?.user.firstname} ${item?.user.lastname}`,
            start: dateStartTime,
            end: dateEndTime,
            id: item.id,
            status: item.status,
            color: "#4affbc",
            backgroundColor: "#7b7cf8",
          });
        }
      });

      // console.log("events:", appointments);
      setAppointments(appointments);
      // setAppointmentsRaw(res.data.events);
    }
  });

  GET("api/v1/user/opportunity", "opportunity", (res) => {
    if (res.success) {
      setStages(res.pipeline_stages);
    }
  });

  const handleEventClick = (e) => {
    let appointment_data = [];

    let new_start_time = e.event.startStr.split("T");
    let new_end_time = e.event.endStr.split("T");
    let start_time = new_start_time[1].split("-");
    let end_time = new_end_time[1].split("-");

    appointment_data.push({
      date: moment(e.event.startStr).tz("MST").format("dddd, MMMM Do"),
      time_start: moment(new_start_time[0] + "T" + start_time[0]).format(
        "H:mm a"
      ),
      time_end: moment(new_end_time[0] + "T" + end_time[0]).format("H:mm a"),
      id: e,
      eventInfo: e.event,
    });

    setAppointmentDetails(appointment_data);
    setToggleModal(true);
  };

  useEffect(() => {
    if (appointmentDetails.length > 0) {
      setToggleModal(true);
    }
  }, [appointmentDetails]);

  const handleDateClick = (e) => {
    if (stage.length > 0) {
      if (stage[2].status != "wait") {
        let row = e.dateStr;
        if (moment(row).format("L") < moment().format("L")) {
          notification.warning({
            message: `Booking not allowed`,
            description: "You can't book previous dates.",
            placement: "bottom",
          });
        } else if (moment(row).format("dddd") === "Sunday") {
          notification.warning({
            message: `Booking not allowed`,
            description: "You can't book on weekends.",
            placement: "bottom",
          });
        } else {
          // setSelectedDate(row);
          // setToggleModal(true);
        }
      } else {
        notification.warning({
          message: `Booking not allowed`,
          description: "You are not yet on set appointment stage",
          placement: "bottom",
        });
      }
    }
  };

  const [toggleModal, setToggleModal] = useState(false);

  const renderEventContent = (eventInfo) => {
    let ext = eventInfo.event.extendedProps;
    let timeStart = moment(eventInfo.event.startStr).tz("MST").format("H:mm A");

    let timeEnd = moment(eventInfo.event.endStr).tz("MST").format("H:mm A");

    console.log("eventInfo", ext);
    let classname = "";

    switch (ext.status) {
      case "showed":
        classname = "primitive-brown";
        break;
      case "cancelled" || "cancelled and delete":
        classname = "primitive-cancelled";
        break;
      case "noshow":
        classname = "primitive-warning";
        break;
      case null || "booked":
        classname = "primitive-success";
        break;
      default:
        break;
    }

    return (
      <div className="calendar-event-cont">
        <div style={{ display: "flex", color: "#365293" }}>
          <span className="admin-calendar-status">
            <GoPrimitiveDot className={classname} size="15px" />
          </span>
          <b className={classname}>{eventInfo.event.title}</b>
        </div>

        <div className="time-disabled">
          <span>
            {moment(timeStart, "H:mm").format("h:mm A") +
              "-" +
              moment(timeEnd, "H:mm").format("h:mm A")}
          </span>
        </div>
      </div>
    );
  };

  return (
    <Card className="user-calendar-my-sched card--padding-mobile">
      <Row gutter={8}>
        <Col xs={24} sm={24} md={24} lg={24} className="m-t-md user-legend">
          <Legends />
        </Col>
        <Col
          xs={24}
          sm={24}
          md={24}
          lg={24}
          className="admin-calendar"
          style={{ marginTop: "18px" }}
        >
          <FullCalendar
            timeZone="MST"
            height="auto"
            allDaySlot={false}
            slotEventOverlap={false}
            eventMaxStack={3}
            dayMaxEventRows={4}
            eventContent={renderEventContent}
            defaultView="dayGridMonth"
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
            eventTimeFormat={{
              hour: "2-digit",
              minute: "2-digit",
              meridiem: true,
            }}
            eventClick={(e) => handleEventClick(e)}
            dateClick={(e) => handleDateClick(e)}
            // datesSet={(e) => {
            //   handlesChangeDate(e);
            // }}
          />
        </Col>
      </Row>

      <ModalCancelAppointment
        toggleModal={toggleModal}
        setToggleModal={setToggleModal}
        //   setSelectedDate={setSelectedDate}
        details={appointmentDetails}
      />
    </Card>
  );
}

function Legends() {
  return (
    <div className="legend">
      <Row gutter={[12, 12]}>
        <Col xs={6} sm={6} md={6} className="legend-item">
          <GoPrimitiveDot className="primitive-success" /> Booked
        </Col>
        <Col xs={6} sm={6} md={6} className="legend-item">
          <GoPrimitiveDot className="primitive-brown" /> Attended
        </Col>
        <Col xs={6} sm={6} md={6} className="legend-item">
          <GoPrimitiveDot className="primitive-cancelled" /> Cancelled
        </Col>
        <Col xs={6} sm={6} md={6} className="legend-item">
          <GoPrimitiveDot className="primitive-warning" /> No Show
        </Col>
      </Row>
    </div>
  );
}

export default PageMySchedule;
