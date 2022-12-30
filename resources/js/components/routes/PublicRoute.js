import React from "react";
import { Route, Redirect } from "react-router-dom";
import PublicLayout from "../layouts/public/Public";
// import getUserData from "../providers/getUserData";

const isLoggedIn = localStorage.getItem("token");

const PublicRoute = ({ component: Component, title: Title, ...rest }) => {
	return (
		<Route
			{...rest}
			render={(props) =>
				!isLoggedIn ? (
					<PublicLayout title={Title}>
						<Component title={Title} {...props} />
					</PublicLayout>
				) : (
					<Redirect to={{ pathname: "/dashboard" }} />
				)
			}
		/>
	);
};

export default PublicRoute;
