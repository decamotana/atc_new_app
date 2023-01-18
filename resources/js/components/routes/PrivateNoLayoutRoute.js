import React from "react";
import { Route, Redirect } from "react-router-dom";
import PrivateNoLayout from "../layouts/private/PrivateNoLayout";

let isLoggedIn = localStorage.getItem("token");

const PrivateNoLayoutRoute = (props) => {
	const {
		path: Path,
		component: Component,
		title: Title,
		subtitle: Subtitle,
		breadcrumb: Breadcrumb,
		...rest
	} = props;

	return (
		<Route
			{...rest}
			render={(props) =>
				isLoggedIn ? (
					<PrivateNoLayout title={Title}>
						<Component title={Title} {...props} />
					</PrivateNoLayout>
				) : (
					<Redirect to={{ pathname: "/" }} />
				)
			}
		/>
	);
};

export default PrivateNoLayoutRoute;
