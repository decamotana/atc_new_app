import React from "react";
import { Route, Switch } from "react-router-dom";

import { faHome } from "@fortawesome/pro-regular-svg-icons";
import {
	faLaptop,
	faPlay,
	faFileLines,
} from "@fortawesome/pro-solid-svg-icons";

/** template */
import PrivateRoute from "../PrivateRoute";

import Error404 from "../../views/errors/Error404";
import Error500 from "../../views/errors/Error500";

import PageDashboard from "../../views/private/PageCaregiver/PageDashboard/PageDashboard";

import PageResourcesOnline from "../../views/private/PageResources/PageResourcesOnline/PageResourcesOnline";
import PageResourcesVideo from "../../views/private/PageResources/PageResourcesVideo/PageResourcesVideo";
import PageResourcesPdf from "../../views/private/PageResources/PageResourcesPdf/PageResourcesPdf";

export default function RouteCaregivers() {
	return (
		<Switch>
			<PrivateRoute
				exact
				path="/dashboard"
				title="Dashboard"
				subtitle="CANCER CAREGIVER"
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

			<Route exact path="/*" component={Error404} />
			<Route exact path="/500" component={Error500} />
		</Switch>
	);
}
