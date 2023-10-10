import React, { useState, useEffect } from "react";
import { Row, Col, Card } from "antd";

import $ from "jquery";

import FullCalendar from "@fullcalendar/react"; // must go before plugins
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import momentTimezonePlugin from "@fullcalendar/moment-timezone";
import moment from "moment";
import Filter from "./Component/Filter";
import { GETMANUAL, POST } from "../../../../providers/useAxiosQuery";
import { GoPrimitiveDot } from "react-icons/go";

import ModalAvailability from "./Component/ModalAvailability";
import ModalAppointment from "./Component/ModalAppointment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/pro-regular-svg-icons";
import { saveAs } from "file-saver";

export default function PageCalendar(props) {
  const [calendarEvents, setCalendarEvents] = useState();
  const [params, setParams] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [showModalA, setShowModalA] = useState(false);
  const [modalData, setModalData] = useState([]);
  const [windowSize, setWindowSize] = useState(getWindowSize());
  const [eventMaxStack, setEventMaxStack] = useState(1);
  const [dayMaxEvent, setDayMaxEvent] = useState(2);

  const { refetch: getEvents } = GETMANUAL(
    `api/v1/admin/calendar/events?${$.param(params)}`,
    "admin-calendar-events",
    (res) => {
      if (res.success) {
        setCalendarEvents(res.events);
      }
    }
  );

  useEffect(() => {
    if (params.length != 0) {
      //   console.log("params", params);

      getEvents();
    }
  }, [params]);

  const renderEventContent = (eventInfo) => {
    // console.log("eventInfo", eventInfo);

    let ext = eventInfo.event.extendedProps;
    let timeStart = moment(
      ext.schedule_date + " " + ext.time_start,
      "MM/DD/YYYY HH:mm"
    ).format("h:mm A");

    let timeEnd = moment(
      ext.schedule_date + " " + ext.time_end,
      "MM/DD/YYYY HH:mm"
    ).format("h:mm A");

    let classname = "";

    switch (ext.status) {
      case "booked":
        classname = "primitive-success";
        break;
      case "showed":
        classname = "primitive-brown";
        break;
      case "cancelled":
        classname = "primitive-cancelled";
        break;
      case "noshow":
        classname = "primitive-warning";
        break;
      case null:
        classname = "primitive-available";
        break;

      default:
        break;
    }

    return (
      <div className="calendar-event-cont">
        <div style={{ display: "flex", color: "#365293", paddingTop: "3px" }}>
          <span
            className="admin-calendar-status"
            style={{ padding: "0px", height: "10px" }}
          >
            <GoPrimitiveDot className={classname} size={15} />
          </span>
          <b>{ext.user.firstname + " " + ext.user.lastname}</b>
        </div>

        <div
          className={
            "time-cont " + (ext.client ? "time-booked" : "time-disabled")
          }
        >
          {ext.client ? (
            <span>{timeStart + "-" + timeEnd}</span>
          ) : (
            <span>{timeStart + "-" + timeEnd}</span>
          )}
        </div>
        {ext.client && (
          <div className={"client-name-cont " + classname}>
            <b>{ext.client.firstname + " " + ext.client.lastname}</b>
          </div>
        )}
        {/* <i>{eventInfo.event.title}</i> */}
      </div>
    );
  };

  useEffect(() => {
    function handleWindowResize() {
      setWindowSize(getWindowSize());
      let width = getWindowSize().innerWidth;

      if (width < 768) {
        setEventMaxStack(0);
        setDayMaxEvent(0);
      } else if (width <= 1024 && width >= 768) {
        setEventMaxStack(1);
        setDayMaxEvent(2);
      } else {
        setEventMaxStack(1);
        setDayMaxEvent(2);
      }
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
    if (modalData.length != 0) {
      if (modalData.status != null && modalData.status != undefined) {
        setShowModal(true);
      } else {
        setShowModalA(true);
      }
    }
  }, [modalData]);

  const [currentDate, setCurrentDate] = useState({
    start: "",
    end: "",
  });

  const { mutate: mutateDownloadCSV, isLoading: isLoadingSlots } = POST(
    "api/v1/calendar/download-schedule/csv",
    "download_calendar_csv"
  );

  const { mutate: mutateDownloadICS, isLoading: isLoadingICS } = POST(
    "api/v1/calendar/download-schedule/ics",
    "download_calendar_csv"
  );

  const arrayToCSV = (arr, delimiter = ",") => {
    arr
      .map((v) =>
        v
          .map((x) => (isNaN(x) ? `"${x.replace(/"/g, '""')}"` : x))
          .join(delimiter)
      )
      .join("\n");
  };

  const donwloadCSV = () => {
    let data = { ...currentDate, params: params };

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
    let data = { ...currentDate, params: params };

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
    <Card className="ard-min-height card--padding-mobile">
      <Row gutter={[12, 12]}>
        <Col xs={24} sm={24} md={18} lg={18} className="filter-cont">
          <Filter setParams={setParams} />
        </Col>

        <Col
          xs={24}
          sm={24}
          md={24}
          lg={24}
          className="m-t-sm legend-cont legend-admin-cont"
        >
          <Legends />
        </Col>
      </Row>
      <Row>
        <Col xs={24} sm={24} md={24} lg={24} className="admin-calendar">
          <FullCalendar
            id="calendar"
            timeZone="MST"
            allDaySlot={false}
            height="auto"
            slotEventOverlap={false}
            // dayMaxEventRows={3}
            dayMaxEvents={2}
            eventMaxStack={eventMaxStack}
            defaultView="dayGridMonth"
            eventClick={(eventInfo) => {
              let ex = eventInfo.event.extendedProps;
              setModalData(ex);
            }}
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
            eventContent={renderEventContent}
            headerToolbar={{
              left: "",
              center: "prev,title,next",
              right:
                "downLoadCSV,downLoadICS dayGridMonth,timeGridWeek,timeGridDay",
            }}
            events={calendarEvents}
            plugins={[
              dayGridPlugin,
              timeGridPlugin,
              interactionPlugin,
              momentTimezonePlugin,
            ]}
            datesSet={(e) => {
              console.log("asdasd: ", e);
              setCurrentDate({
                start: moment(e.startStr).format("L"),
                end: moment(e.endStr).format("L"),
              });
              if (
                e.view.type === "timeGridWeek" ||
                e.view.type === "timeGridDay"
              ) {
                $(".fc-toolbar-title").addClass("resize-title");
              } else {
                $(".fc-toolbar-title").removeClass("resize-title");
              }
            }}
          />
        </Col>
      </Row>
      <ModalAppointment
        setModalVisibility={setShowModal}
        showModal={showModal}
        data={modalData && modalData.status != null ? modalData : []}
        setData={setModalData}
      />
      <ModalAvailability
        setModalVisibility={setShowModalA}
        showModal={showModalA}
        data={modalData && modalData.status == null ? modalData : []}
        setData={setModalData}
        getEvents={getEvents}
      />
    </Card>
  );
}

function Legends() {
  return (
    <div className="legend legend-admin">
      <Row gutter={[12, 12]}>
        <Col xs={4} sm={4} md={4} className="legend-item">
          <GoPrimitiveDot className="primitive-available" /> Available
        </Col>
        <Col xs={4} sm={4} md={4} className="legend-item">
          <GoPrimitiveDot className="primitive-success" /> Booked
        </Col>
        <Col xs={4} sm={4} md={4} className="legend-item">
          <GoPrimitiveDot className="primitive-brown" /> Attended
        </Col>
        <Col xs={4} sm={4} md={4} className="legend-item">
          <GoPrimitiveDot className="primitive-cancelled" /> Cancelled
        </Col>
        <Col xs={4} sm={4} md={4} className="legend-item">
          <GoPrimitiveDot className="primitive-warning" /> No Show
        </Col>
      </Row>
    </div>
  );
}
