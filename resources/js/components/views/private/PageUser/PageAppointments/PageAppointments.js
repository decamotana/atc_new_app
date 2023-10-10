import React, { useEffect, useState } from "react";
import { Button, Card, Col, Row, notification, Modal } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/pro-regular-svg-icons";
import FullCalendar from "@fullcalendar/react"; // must go before plugins
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction"; //
import momentTimezonePlugin from "@fullcalendar/moment-timezone"; //
import agendaPlugin from "@fullcalendar/react";
import { POST, GET } from "../../../../providers/useAxiosQuery";
import moment from "moment";
import { useHistory } from "react-router-dom";
import tz from "moment-timezone";
import ModalEventBooked from "../../Components/ModalEventBooked";
import { ExclamationCircleOutlined } from "@ant-design/icons";

function PageAppointments() {
  const [selectedDate, setSelectedDate] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [appointmentDetails, setAppointmentDetails] = useState([]);
  const [stage, setStages] = useState([]);
  const [appontmentStage, setAppointmentStage] = useState();
  const history = useHistory();

  const { mutate: addHistoryLog } = POST(
    "api/v1/historylogs/add",
    "add_history_logs"
  );

  const handlesChangeDate = (e) => {
    let strDt = e.startStr;
    let endDt = e.endStr;
    // let strDt = moment(e.startStr).add(8, "hours").valueOf();
    // let endDt = moment(e.endStr).add(17, "hours").valueOf();

    let data = {
      startDate: moment(strDt).format("L"),
      endDate: moment(endDt).format("L"),
      // timezone: "US/Mountain",
      timezone: "US/Mountain",
    };

    let bookedAppointments = [];
    let events = [];
    mutateGetAppointments(data, {
      onSuccess: (res) => {
        if (res.success) {
          if (e.view.type == "timeGridWeek" || e.view.type == "timeGridDay") {
            let slots_array = [];

            res.data.forEach((data) => {
              data.extendedProps.slots.map((slot) => {
                slot.title = data.title;
              });
              slots_array.push(...data.extendedProps.slots);
            });

            slots_array.map((slot) => {
              slot.start = moment(slot.date + " " + slot.time_start).format(
                "YYYY-MM-DD HH:MM"
              );
              slot.end = moment(slot.date + " " + slot.time_end).format(
                "YYYY-MM-DD HH:MM"
              );
            });

            setAppointments(slots_array);
          } else {
            setAppointments(res.data);
          }
        }
      },
    });
  };

  const { mutate: mutateGetAppointments, isLoading: isLoadingSlot } = POST(
    "api/v1/calendar/consultant/availability",
    "appointments"
  );

  GET("api/v1/user/opportunity", "opportunity", (res) => {
    if (res.success) {
      setStages(res.pipeline_stages);
      let appStage = res.pipeline_stages_appointment.find(
        (x) => x.status === "process"
      );
      // console.log("@stages", appStage?.name.toLowerCase());

      setAppointmentStage(appStage?.name.toLowerCase());
    }
  });

  const handleEventClick = (event_data) => {
    if (
      moment(event_data.event.start).format("YYYY-MM-DD") >=
      moment().tz("MST").format("YYYY-MM-DD")
    ) {
      let booking_data = [];

      let events = event_data.event.extendedProps;
      booking_data.push({
        date: moment(event_data.event.start).format("dddd, MMMM Do"),
        title: event_data.event.title,
        alter_date: moment(event_data.event.start).format("YYYY-MM-DD"),
        slots: events,
      });

      setAppointmentDetails(booking_data);
    } else {
      notification.warning({
        message: `Booking not allowed`,
        description: "You can't book previous dates.",
        placement: "bottom",
      });
    }
  };

  useEffect(() => {
    if (appointmentDetails.length > 0) {
      setToggleBookedModal(true);
    }
  }, [appointmentDetails]);

  const handleDateClick = (e) => {
    if (stage.length > 0) {
      if (stage[2].status != "wait") {
        let row = e.dateStr;
        if (moment(row).format("L") < moment().format("L")) {
        } else if (moment(row).format("dddd") === "Sunday") {
          notification.warning({
            message: `Booking not allowed`,
            description: "You can't book on weekends.",
            placement: "bottom",
          });
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

  const [toggleBookedModal, setToggleBookedModal] = useState(false);

  const { mutate: mutateAddAppointments, isLoading: isLoading } = POST(
    "api/v1/appointment",
    "appointment"
  );

  const confirmWeekViewBook = (value) => {
    Modal.confirm({
      title: "Confirm Appointment",
      icon: <ExclamationCircleOutlined />,
      content: (
        <div>
          Are you sure you want to book <strong>{value.event.title}</strong>
          {", "}
          {moment(value.event.startStr).format("dddd, MMMM Do")}{" "}
          {moment(value.event.extendedProps.time_start, "HH:mm").format(
            "HH:mm a"
          )}{" "}
          -
          {moment(value.event.extendedProps.time_end, "HH:mm").format(
            "HH:mm a"
          )}{" "}
          schedule ?
        </div>
      ),
      okText: "Yes",
      cancelText: "No",
      onOk: () => {
        let timeslot =
          moment(value.event.startStr).format("YYYY-MM-DD") +
          "T" +
          moment(value.event.extendedProps.time_start, "HH:mm").format(
            "HH:mm:ss"
          );

        let data = {
          appointmentDate: moment(value.event.startStr).format("dddd, MMMM Do"),
          //   timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          timezone: "US/Mountain",
          timeslot: timeslot + "-06:00",
          slot_id: value.event.extendedProps.slot_id,
          calendarID: value.event.extendedProps.calendar_id,
        };
        mutateAddAppointments(data, {
          onSuccess: (res) => {
            if (res.success) {
              console.log(res.data);
              notification.success({
                message: "Success",
                description: "Successfully booked",
              });

              addHistoryLog(
                {
                  page: "user/book-appointment",
                  key: "appointment slot",
                  consultant: value.event.extendedProps.user_id,
                  old_data: "",
                  new_data: timeslot,
                  method: "book-appointment",
                },
                { onSuccess: (res) => {} }
              );

              history.push({
                pathname: "/appointment/myschedule",
              });
            } else if (res.success == false) {
              notification.warning({
                message: "Not allowed",
                description: res.message,
              });
            }
          },
          onError: (res) => {
            notification.error({
              message: "Error",
              description:
                "There was an error while trying to book appointment",
            });
          },
        });
      },
    });
  };

  return (
    <Card className="card--padding-mobile">
      <Row gutter={8}>
        <Col xs={24} sm={24} md={24} className="calendar-book">
          <FullCalendar
            timeZone="MST"
            defaultView="dayGridMonth"
            allDaySlot={false}
            eventMaxStack={2}
            slotEventOverlap={false}
            headerToolbar={{
              left: "prev,next",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            plugins={[
              dayGridPlugin,
              timeGridPlugin,
              interactionPlugin,
              momentTimezonePlugin,
            ]}
            events={appointments}
            displayEventTime={false}
            eventTimeFormat={{
              hour: "2-digit",
              minute: "2-digit",
              meridiem: true,
            }}
            eventClick={(e) => {
              if (
                e.view.type == "timeGridWeek" ||
                e.view.type == "timeGridDay"
              ) {
                confirmWeekViewBook(e);
                console.log("event", e);
              } else {
                handleEventClick(e);
                console.log("event", e);
              }
            }}
            dateClick={(e) => handleDateClick(e)}
            datesSet={(e) => {
              handlesChangeDate(e);
            }}
          />
        </Col>
      </Row>
      <ModalEventBooked
        toggleModal={toggleBookedModal}
        setToggleModal={setToggleBookedModal}
        //   setSelectedDate={setSelectedDate}
        appStage={appontmentStage}
        details={appointmentDetails}
      />
    </Card>
  );
}

export default PageAppointments;
