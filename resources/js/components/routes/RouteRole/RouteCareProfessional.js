import React from "react";
import { Route, Switch } from "react-router-dom";
/** template */
import PrivateRoute from "../PrivateRoute";

import { faFileLines, faCreditCard } from "@fortawesome/pro-regular-svg-icons";

import { faAnalytics, faHome } from "@fortawesome/pro-regular-svg-icons";
import {
	faLaptop,
	faPlay,
	faUsers,
	faTicketSimple,
} from "@fortawesome/pro-solid-svg-icons";

import Error404 from "../../views/errors/Error404";
import Error500 from "../../views/errors/Error500";

import PageDashboard from "../../views/private/PageCareProfessional/PageDashboard/PageDashboard";

import PageResourcesOnline from "../../views/private/PageResources/PageResourcesOnline/PageResourcesOnline";
import PageResourcesVideo from "../../views/private/PageResources/PageResourcesVideo/PageResourcesVideo";
import PageResourcesPdf from "../../views/private/PageResources/PageResourcesPdf/PageResourcesPdf";

import PageSubscriberCurrentCompleted from "../../views/private/PageCareProfessional/PageSubscriberCurrentCompleted/PageSubscriberCurrentCompleted";
import PageSubscriberCurrentCompletedModule from "../../views/private/PageCareProfessional/PageSubscriberCurrentCompleted/PageSubscriberCurrentCompletedModule";
import PageNewSubscriber from "../../views/private/PageCareProfessional/PageSubscriberCurrentCompleted/PageNewSubscriber";
import PageReferenceCode from "../../views/private/PageCareProfessional/PageReferenceCode/PageReferenceCode";
import PageReferenceCodeAdd from "../../views/private/PageCareProfessional/PageReferenceCode/PageReferenceCodeAdd";

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

			{/* resource-library/online-resources */}
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
			{/* end resource-library/online-resources */}

			{/* resource-library/video-resources */}
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
			{/* end resource-library/video-resources */}

			{/* resource-library/pdf-resources */}
			<PrivateRoute
				exact
				path="/resource-library/pdf-resources"
				title="Resources"
				subtitle="PDF"
				component={PageResourcesPdf}
				pageHeaderIcon={faFileLines}
				breadcrumb={[
					{
						name: "Dashboard",
						link: "/dashboard",
					},
					{
						name: "Resource Library",
						link: "/resource-library/pdf-resources",
					},
					{
						name: "PDF Resources",
						link: "/resource-library/pdf-resources",
					},
				]}
			/>
			{/* end resource-library/pdf-resources */}

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
						className: "li_subscribers_name",
					},
				]}
			/>

			<PrivateRoute
				exact
				path="/subscribers/current-completed/new-subscriber"
				title="Subscriptions"
				subtitle="NEW"
				component={PageNewSubscriber}
				pageHeaderIcon={faCreditCard}
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
						name: "Subscription",
						link: "/subscribers/current-completed/new-subscriber",
					},
				]}
			/>

			<PrivateRoute
				exact
				path="/subscribers/reference-code"
				title="Subscription"
				subtitle="REFERENCE CODE"
				component={PageReferenceCode}
				pageHeaderIcon={faTicketSimple}
				breadcrumb={[
					{
						name: "Dashboard",
						link: "/dashboard",
					},
					{
						name: "Subscribers",
						link: "/subscribers/reference-code",
					},
					{
						name: "Reference Code",
						link: "/subscribers/reference-code",
					},
				]}
			/>

			<PrivateRoute
				exact
				path="/subscribers/reference-code/add"
				title="Reference Code"
				subtitle="ADD"
				component={PageReferenceCodeAdd}
				pageHeaderIcon={faTicketSimple}
				breadcrumb={[
					{
						name: "Dashboard",
						link: "/dashboard",
					},
					{
						name: "Subscribers",
						link: "/subscribers/reference-code",
					},
					{
						name: "Reference Code",
						link: "/subscribers/reference-code",
					},
					{
						name: "Add",
						link: "/subscribers/reference-code/add",
					},
				]}
			/>
			{/* end subscribers/current-completed */}

			<Route exact path="/*" component={Error404} />
			<Route exact path="/500" component={Error500} />
		</Switch>
	);
}
