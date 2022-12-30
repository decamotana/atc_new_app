import React from "react";
import { Route, Redirect } from "react-router-dom";
import Private from "../layouts/private/Private";

let isLoggedIn = localStorage.getItem("token");

const PrivateRoute = (props) => {
	const {
		path: Path,
		component: Component,
		title: Title,
		subtitle: SubTitle,
		breadcrumb: Breadcrumb,
		pageHeaderIcon: PageHeaderIcon,
		...rest
	} = props;

	return (
		<Route
			{...rest}
			render={(props) =>
				isLoggedIn ? (
					<Private
						title={Title}
						subtitle={SubTitle}
						pageHeaderIcon={PageHeaderIcon}
						breadcrumb={Breadcrumb}
					>
						<Component
							title={Title}
							subtitle={SubTitle}
							pageHeaderIcon={PageHeaderIcon}
							{...props}
						/>
					</Private>
				) : (
					<Redirect to={{ pathname: "/" }} />
				)
			}
		/>
	);
};

export default PrivateRoute;
