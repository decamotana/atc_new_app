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
import ModalCancelAppointment from "../../Components/ModalCancelAppointmentConsultant";
import $ from "jquery";
import { GoPrimitiveDot } from "react-icons/go";
import { saveAs } from "file-saver";

function PageConsultantBookings() {
  const [selectedDate, setSelectedDate] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [appointmentsRaw, setAppointmentsRaw] = useState([]);
  const [appointmentDetails, setAppointmentDetails] = useState([]);
  const [stage, setStages] = useState([]);
  const [event, setEvent] = useState([]);
  const [isLoadingCalendar, setLoadingCalendar] = useState(false);
  const [calendarButtons, setCalendarButtons] = useState(
    "dayGridMonth,timeGridWeek,timeGridDay"
  );

  const { data: calendarSettings, refetch: getsettings } = GET(
    "api/v1/consultant/settings",
    "consultant-settings",
    (res) => {
      if (res.success) {
        if (res.data) {
          setCalendarButtons(
            "downLoadCSV,downLoadICS dayGridMonth,timeGridWeek,timeGridDay"
          );
        } else {
          setCalendarButtons("dayGridMonth,timeGridWeek,timeGridDay");
        }
      }
    }
  );

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

  const handlesChangeDate = (e) => {
    setEvent(e);

    let strDt = moment(e.startStr).format("MM/DD/YYYY");
    let endDt = moment(e.endStr).format("MM/DD/YYYY");

    let data = {
      startDate: strDt,
      endDate: endDt,
      timezone: "US/Mountain",
    };

    let bookedAppointments = [];
    let events = [];
    mutateGetAppointmentsAdmin(data, {
      onSuccess: (res) => {
        setLoadingCalendar(true);

        if (res.success) {
          let schedules = [];

          res.data.appointments.map((schedule) => {
            schedules.push({
              title: schedule.title,
              start: moment(schedule.startTime).format("YYYY-MM-DDTHH:mmZ"),
              end: moment(schedule.endTime).format("YYYY-MM-DDTHH:mmZ"),
              extendedProps: schedule,
            });
          });

          setAppointments(schedules);
          setAppointmentsRaw(res.data.appointments);
          setLoadingCalendar(false);
        }
      },
    });
  };

  const { mutate: mutateGetAppointmentsAdmin, isLoading: loadingAppointments } =
    POST("api/v1/get/appointment", "get_appointment");

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
  const [dayMaxEvent, setDayMaxEvent] = useState(2);
  useEffect(() => {
    function handleWindowResize() {
      let width = getWindowSize().innerWidth;

      if (width < 1264) {
        setDayMaxEvent(0);
      } else {
        setDayMaxEvent(2);
      }
    }
    function getWindowSize() {
      const { innerWidth, innerHeight } = window;
      return { innerWidth, innerHeight };
    }

    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  const [toggleModal, setToggleModal] = useState(false);

  const renderEventContent = (eventInfo) => {
    let ext = eventInfo.event.extendedProps;
    let timeStart = moment(eventInfo.event.startStr).tz("MST").format("h:mm A");

    let timeEnd = moment(eventInfo.event.endStr).tz("MST").format("h:mm A");

    let classname = "";

    switch (ext.appoinmentStatus) {
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
        classname = "primitive-available";
        break;
    }

    return (
      <div className="calendar-event-cont">
        <div
          style={{
            display: "flex",
            color: "#365293",
            background: "transparent ",
          }}
        >
          <span className="admin-calendar-status">
            <GoPrimitiveDot className={classname} size={15} />
          </span>
          <b className={classname}>
            {ext.contact.firstName + " " + ext.contact.lastName}
          </b>
        </div>

        <div className={ext.contact ? "time-booked" : "time-disabled"}>
          {ext.client ? (
            <b>{timeStart + "-" + timeEnd}</b>
          ) : (
            <span>{timeStart + "-" + timeEnd}</span>
          )}
        </div>
        {/* {ext.client && (
          <div className={classname}>
            <b>{ext.client.firstname + " " + ext.client.lastname}</b>
          </div>
        )} */}
        {/* <i>{eventInfo.event.title}</i> */}
      </div>
    );
  };

  return (
    <Card className="consultant-booking-calendar card--padding-mobile">
      <Row gutter={8}>
        <Col xs={24} sm={24} md={24} lg={24} className="m-t-md user-legend">
          <Legends />
        </Col>
        <Col
          xs={24}
          sm={24}
          md={24}
          lg={24}
          className="admin-calendar "
          style={{ marginTop: "18px" }}
        >
          <FullCalendar
            allDaySlot={false}
            height="auto"
            slotEventOverlap={false}
            eventMaxStack={dayMaxEvent}
            defaultView="dayGridMonth"
            dayMaxEvents={3}
            timeZone="MST"
            eventContent={renderEventContent}
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
            datesSet={(e) => {
              handlesChangeDate(e);
            }}
            headerToolbar={{
              left: "prev,next",
              center: "title",
              right: calendarButtons,
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
            eventClassNames={(e) => {
              return "event-" + e.event.extendedProps.appointmentStatus;
            }}
            // datesSet={(e) => {
            //   handlesChangeDate(e);
            // }}
          />
        </Col>
      </Row>

      <ModalCancelAppointment
        toggleModal={toggleModal}
        setToggleModal={setToggleModal}
        reload={handlesChangeDate}
        details={appointmentDetails}
        event={event}
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

export default PageConsultantBookings;
