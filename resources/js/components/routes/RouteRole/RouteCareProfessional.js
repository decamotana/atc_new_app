import React from "react";
import { Route, Switch } from "react-router-dom";
/** template */
import PrivateRoute from "../PrivateRoute";

import {
	faAnalytics,
	faHome,
	faUserEdit,
} from "@fortawesome/pro-regular-svg-icons";
import {
	faLaptop,
	faPlay,
	faFileAlt,
	faUsers,
	faCommentDots,
} from "@fortawesome/pro-solid-svg-icons";

import Error404 from "../../views/errors/Error404";
import Error500 from "../../views/errors/Error500";

import PageDashboard from "../../views/private/PageCareProfessional/PageDashboard/PageDashboard";
import PageProfile from "../../views/private/PageProfile/PageProfile";
// import PagePaymentInvoices from "../../views/private/PagePaymentInvoices/PagePaymentInvoices";
import PageTrainingModules from "../../views/private/PageCareProfessional/PageTrainingModules/PageTrainingModules";
import PageTrainingModulesView from "../../views/private/PageCareProfessional/PageTrainingModules/PageTrainingModulesView";
import PageResourcesOnline from "../../views/private/PageCareProfessional/PageResourcesOnline/PageResourcesOnline";
import PageResourcesVideo from "../../views/private/PageCareProfessional/PageResourcesVideo/PageResourcesVideo";
import PageResourcesDocument from "../../views/private/PageCareProfessional/PageResourcesDocument/PageResourcesDocument";
import PageSubscriberCurrentCompleted from "../../views/private/PageCareProfessional/PageSubscriberCurrentCompleted/PageSubscriberCurrentCompleted";
import PageSubscriberCurrentCompletedModule from "../../views/private/PageCareProfessional/PageSubscriberCurrentCompleted/PageSubscriberCurrentCompletedModule";
import PageMessage from "../../views/private/PageMessage/PageMessage";

export default function RouteCareProfessional() {
	// console.log("RouteCareProfessional");
	return (
		<Switch>
			<PrivateRoute
				exact
				path="/dashboard"
				title="Dashboard"
				subtitle="CANCER CAREPROFESSIONAL"
				component={PageDashboard}
				pageHeaderIcon={faHome}
				breadcrumb={[
					{
						name: "Dashboard",
						link: "/dashboard",
					},
				]}
			/>

			{/* training-modules */}
			<PrivateRoute
				exact
				path="/training-modules"
				title="Modules"
				subtitle="TRAINING"
				component={PageTrainingModules}
				pageHeaderIcon={faAnalytics}
				breadcrumb={[
					{
						name: "Dashboard",
						link: "/dashboard",
					},
					{
						name: "Training Modules",
						link: "/training-modules",
					},
				]}
			/>

			<PrivateRoute
				exact
				path="/training-modules/view"
				title="Modules"
				subtitle="TRAINING"
				component={PageTrainingModulesView}
				pageHeaderIcon={faAnalytics}
				breadcrumb={[
					{
						name: "Dashboard",
						link: "/dashboard",
					},
					{
						name: "Training Modules",
						link: "/training-modules",
					},
					{
						name: "Module # - Lesson #",
						link: "/training-modules/view",
						className: "module_no_lesson_no",
					},
				]}
			/>
			{/* end training-modules */}

			{/* resource-library */}
			<PrivateRoute
				exact
				path="/resource-library/online-resources"
				title="Resources"
				subtitle="ONLINE"
				component={PageResourcesOnline}
				pageHeaderIcon={faLaptop}
				breadcrumb={[
					{
						name: "Dashboard",
						link: "/dashboard",
					},
					{
						name: "Resource Library",
						link: "/resource-library/online-resources",
					},
					{
						name: "Online Resources",
						link: "/resource-library/online-resources",
					},
				]}
			/>

			<PrivateRoute
				exact
				path="/resource-library/video-resources"
				title="Resources"
				subtitle="VIDEO"
				component={PageResourcesVideo}
				pageHeaderIcon={faPlay}
				breadcrumb={[
					{
						name: "Dashboard",
						link: "/dashboard",
					},
					{
						name: "Resource Library",
						link: "/resource-library/video-resources",
					},
					{
						name: "Video Resources",
						link: "/resource-library/video-resources",
					},
				]}
			/>

			<PrivateRoute
				exact
				path="/resource-library/document-resources"
				title="Resources"
				subtitle="DOCUMENT"
				component={PageResourcesDocument}
				pageHeaderIcon={faFileAlt}
				breadcrumb={[
					{
						name: "Dashboard",
						link: "/dashboard",
					},
					{
						name: "Resource Library",
						link: "/resource-library/document-resources",
					},
					{
						name: "Document Resources",
						link: "/resource-library/document-resources",
					},
				]}
			/>
			{/* end resource-library */}

			{/* subscribers/current-completed */}
			<PrivateRoute
				exact
				path="/subscribers/current-completed"
				title="Subscribers"
				subtitle="CURRENT & COMPLETED"
				component={PageSubscriberCurrentCompleted}
				pageHeaderIcon={faUsers}
				breadcrumb={[
					{
						name: "Dashboard",
						link: "/dashboard",
					},
					{
						name: "Subscribers",
						link: "/subscribers/current-completed",
					},
					{
						name: "Current & Completed Subscribers",
						link: "/subscribers/current-completed",
					},
				]}
			/>

			<PrivateRoute
				exact
				path="/subscribers/current-completed/module"
				title="Subscribers"
				subtitle="SUBSCRIBER"
				component={PageSubscriberCurrentCompletedModule}
				pageHeaderIcon={faAnalytics}
				breadcrumb={[
					{
						name: "Dashboard",
						link: "/dashboard",
					},
					{
						name: "Subscribers",
						link: "/subscribers/current-completed",
					},
					{
						name: "Current & Completed Subscribers",
						link: "/subscribers/current-completed",
					},
					{
						name: "Subscriber's Name",
						link: "/subscribers/current-completed/module",
						className: "subscribers_name",
					},
				]}
			/>
			{/* end subscribers/current-completed */}

			{/* /message */}
			<PrivateRoute
				exact
				path="/message"
				title="Ticket"
				subtitle="CREATE A"
				component={PageMessage}
				pageHeaderIcon={faCommentDots}
				breadcrumb={[
					{
						name: "Dashboard",
						link: "/dashboard",
					},
					{
						name: "Messages",
						link: "/message",
					},
				]}
			/>
			{/* end /message */}

			<PrivateRoute
				exact
				path="/profile/account"
				title="Profile"
				subtitle="EDIT ACCOUNT"
				component={PageProfile}
				pageHeaderIcon={faUserEdit}
				breadcrumb={[
					{
						name: "Dashboard",
						link: "/dashboard",
					},
					{
						name: "Edit Profile",
						link: "/edit-profile",
					},
				]}
			/>
			{/* <PrivateRoute
				exact
				path="/profile/payment-invoices"
				title="Account"
				subtitle="INVOICES &"
				component={PagePaymentInvoices}
				pageHeaderIcon={faFileAlt}
				breadcrumb={[
					{
						name: "Dashboard",
						link: "/dashboard",
					},
					{
						name: "Invoices & Account",
						link: "/invoices-account",
					},
				]}
			/> */}

			<Route exact path="/*" component={Error404} />
			<Route exact path="/500" component={Error500} />
		</Switch>
	);
}
