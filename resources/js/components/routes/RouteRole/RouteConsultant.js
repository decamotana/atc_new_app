import React from "react";
import { Route, Switch } from "react-router-dom";

import {
  faChartPieAlt,
  faUserPlus,
  faUser,
} from "@fortawesome/pro-light-svg-icons";
import { faCalendar, faHome } from "@fortawesome/pro-regular-svg-icons";
import {
  faLightbulbOn,
  faTicket,
  faLaptop,
  faLock,

  // faFileAlt,
  faPlay,
  faFileLines,
} from "@fortawesome/pro-solid-svg-icons";

/** template */
import PrivateRoute from "../PrivateRoute";

import Error404 from "../../views/errors/Error404";
import Error500 from "../../views/errors/Error500";

import PageDashboard from "../../views/private/PageUser/PageDashboard/PageDashboard";
import PageTask from "../../views/private/PageUser/PageTask/PageTask";
import PageNotes from "../../views/private/PageUser/PageNotes/PageNotes";
import PageDocuments from "../../views/private/PageUser/PageDocuments/PageDocuments";
import PageProfile from "../../views/private/PageUser/PageProfile/PageProfile";
import PageAppointments from "../../views/private/PageUser/PageAppointments/PageAppointments";
import PageVideo from "../../views/private/PageUser/PageVideo/PageVideo";
import PagePolicy from "../../views/private/PagePolicy/PagePolicy";
import PageTermsAndConditions from "../../views/private/PageTermsAndCondition/PageTermsAndConditions";
import PageMySchedule from "../../views/private/PageUser/PageAppointments/PageMySchedule";
import PageConsultantSchedules from "../../views/private/PageAdmin/PageConsultant/PageConsultantSchedules";
import PageConsultantBookings from "../../views/private/PageAdmin/PageConsultant/PageConsultantBookings";
import PageUser from "../../views/private/PageAdmin/PageUser/PageUser";
import PageUserForm from "../../views/private/PageAdmin/PageUser/PageUserForm";
import Page2FA from "../../views/private/Page2fa/Page2fa";

// import PagePaymentInvoices from "../../views/private/PagePaymentInvoices/PagePaymentInvoices";

export default function RouteConsultant() {
  return (
    <Switch>
      <PrivateRoute
        exact
        path="/dashboard"
        title="Bookings"
        subtitle="My"
        component={PageConsultantBookings}
        pageHeaderIcon={faCalendar}
        breadcrumb={[
          {
            name: "Dashboard",
            link: "#",
          },
        ]}
      />

      <PrivateRoute
        exact
        path="/2fa"
        title="2 Factor Authentication"
        subtitle="Account"
        component={Page2FA}
        pageHeaderIcon={faLock}
        breadcrumb={[
          {
            name: "User Profile",
            link: "/",
          },
        ]}
      />

      <PrivateRoute
        exact
        path="/appointment/schedules"
        title="Availability"
        subtitle="My"
        component={PageConsultantSchedules}
        pageHeaderIcon={faCalendar}
        breadcrumb={[
          {
            name: "Calendars",
            link: "#",
          },
          {
            name: "My Availability",
            link: "/appointment/schedules",
          },
        ]}
      />

      <PrivateRoute
        exact
        path="/profile/account"
        title="Profile"
        subtitle="Edit"
        component={PageProfile}
        pageHeaderIcon={faHome}
        breadcrumb={[
          {
            name: "Profile",
            link: "#",
          },
        ]}
      />

      <PrivateRoute
        exact
        path="/appointment/bookings"
        title="Bookings"
        subtitle="My"
        component={PageConsultantBookings}
        pageHeaderIcon={faCalendar}
        breadcrumb={[
          {
            name: "Calendars",
            link: "#",
          },
          {
            name: "My Bookings",
            link: "/appointment/bookings",
          },
        ]}
      />

      <PrivateRoute
        exact
        path="/user"
        title="Clients"
        subtitle="View"
        component={PageUser}
        pageHeaderIcon={faUser}
        breadcrumb={[
          {
            name: "Clients",
            link: "/user",
          },
        ]}
      />

      <PrivateRoute
        exact
        path="/user/manageuser/:id"
        title="Manage User"
        subtitle="User"
        component={PageUserForm}
        pageHeaderIcon={faUserPlus}
        breadcrumb={[
          {
            name: "User",
            link: "/user",
          },
          {
            name: "Manage User",
            link: "#",
          },
        ]}
      />

      {/* <PrivateRoute
        exact
        path="/appointment/myschedule"
        title="Schedule"
        subtitle="My Calendar"
        component={PageMySchedule}
        pageHeaderIcon={faCalendar}
        breadcrumb={[
          {
            name: "Appointment",
            link: "/appointment",
          },
          {
            name: " My Schedule",
            link: "/appointment/myschedule",
          },
        ]}
      /> */}

      <PrivateRoute
        exact
        path="/policy"
        title="Policy"
        subtitle="PRIVACY"
        component={PagePolicy}
        pageHeaderIcon={faLock}
        breadcrumb={[
          {
            name: "Dashboard",
            link: "/dashboard",
          },
          {
            name: "Policy",
            link: "/policy",
          },
        ]}
      />
      <PrivateRoute
        exact
        path="/terms-and-condition"
        title="TERMS AND CONDITIONS"
        subtitle="ATC"
        component={PageTermsAndConditions}
        pageHeaderIcon={faLock}
        breadcrumb={[
          {
            name: "Dashboard",
            link: "/dashboard",
          },
          {
            name: "Terms & Conditions",
            link: "/terms-and-condition",
          },
        ]}
      />

      <Route exact path="/*" component={Error404} />
      <Route exact path="/500" component={Error500} />
    </Switch>
  );
}
