import React from "react";
import { Route, Redirect, useHistory } from "react-router-dom";
import Private from "../layouts/private/Private";

let isLoggedIn = localStorage.getItem("token");

const PrivateRoute = (props) => {
  const history = useHistory();
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
            title={
              history.location.state
                ? history.location.state.username
                  ? history.location.state.username
                  : Title
                : Title
            }
            subtitle={SubTitle}
            pageHeaderIcon={PageHeaderIcon}
            breadcrumb={Breadcrumb}
            path={Path}
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
