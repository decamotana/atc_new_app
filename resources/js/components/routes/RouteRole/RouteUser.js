import React from "react";
import { Route, Switch } from "react-router-dom";

import { faChartPieAlt } from "@fortawesome/pro-light-svg-icons";
import {
  faHome,
  faChartMixed,
  faListCheck,
  faClipboardList,
  faCalendar,
  faUpload,
  faUser,
  faVideo,
  faChartNetwork,
} from "@fortawesome/pro-regular-svg-icons";
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
import Page2FA from "../../views/private/Page2fa/Page2fa";
import PageDocusign from "../../views/private/PageUser/PageDocusign/PageDocusign";

// import PagePaymentInvoices from "../../views/private/PagePaymentInvoices/PagePaymentInvoices";

export default function RouteUser() {
  return (
    <Switch>
      <PrivateRoute
        exact
        path="/dashboard"
        title="Dashboard"
        subtitle="ATC"
        component={PageDashboard}
        pageHeaderIcon={faChartNetwork}
        breadcrumb={[
          {
            name: "Dashboard",
            link: "/dashboard",
          },
        ]}
      />
      <PrivateRoute
        exact
        path="/task"
        title="Tasks"
        subtitle="View"
        component={PageTask}
        pageHeaderIcon={faListCheck}
        breadcrumb={[
          {
            name: "Task",
            link: "/Task",
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
            link: "/profile/account",
          },
        ]}
      />

      <PrivateRoute
        exact
        path="/documents?code=:token"
        title="Document"
        subtitle="UPLOAD"
        component={PageDocuments}
        pageHeaderIcon={faHome}
        breadcrumb={[
          {
            name: "Task",
            link: "/Task",
          },
        ]}
      />
      <PrivateRoute
        exact
        path="/news"
        title="Announcement"
        subtitle="News &"
        component={PageNotes}
        pageHeaderIcon={faClipboardList}
        breadcrumb={[
          {
            name: "Task",
            link: "/Task",
          },
        ]}
      />
      <PrivateRoute
        exact
        path="/documents"
        title="Documents"
        subtitle="Upload"
        component={PageDocuments}
        pageHeaderIcon={faUpload}
        breadcrumb={[
          {
            name: "Upload documents",
            link: "/documents",
          },
        ]}
      />

      <PrivateRoute
        exact
        path="/appointment"
        title="Appointment"
        subtitle="Book an"
        component={PageAppointments}
        pageHeaderIcon={faCalendar}
        breadcrumb={[
          {
            name: "Appointment",
            link: "/appointment",
          },
        ]}
      />

      <PrivateRoute
        exact
        path="/appointment/book-a-consultant"
        title="Consultant"
        subtitle="Book a"
        component={PageAppointments}
        pageHeaderIcon={faCalendar}
        breadcrumb={[
          {
            name: "Calendar",
            link: "#",
          },
          {
            name: " Book a Consultant",
            link: "/appointment/book-a-consultant",
          },
        ]}
      />

      <PrivateRoute
        exact
        path="/appointment/myschedule"
        title="Schedule"
        subtitle="My Calendar"
        component={PageMySchedule}
        pageHeaderIcon={faCalendar}
        breadcrumb={[
          {
            name: "Calendar",
            link: "#",
          },
          {
            name: " My Schedule",
            link: "/appointment/myschedule",
          },
        ]}
      />

      <PrivateRoute
        exact
        path="/profile/account"
        title="Profile"
        subtitle="Edit"
        component={PageProfile}
        pageHeaderIcon={faUser}
        breadcrumb={[
          {
            name: "Profile",
            link: "/profile/account",
          },
        ]}
      />
      <PrivateRoute
        exact
        path="/video"
        title="Application Video"
        subtitle="Timeline"
        component={PageVideo}
        pageHeaderIcon={faVideo}
        breadcrumb={[
          {
            name: "Video",
            link: "/video",
          },
        ]}
      />

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
        path="/mnda"
        title="Mutual Confidentiality Agreement"
        subtitle="Sign"
        component={PageDocusign}
        pageHeaderIcon={faLock}
        breadcrumb={[
          {
            name: "MNDA",
            link: "/",
          },
        ]}
      />

      <Route exact path="/*" component={Error404} />
      <Route exact path="/500" component={Error500} />
    </Switch>
  );
}
