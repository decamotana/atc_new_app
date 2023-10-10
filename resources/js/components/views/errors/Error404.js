import React from "react";
import { Result, Button } from "antd";
import { useHistory } from "react-router";

const Error404 = () => {
  let history = useHistory();

  if (!localStorage.userdata || !localStorage.token) {
    localStorage.removeItem("userdata");
    localStorage.removeItem("token");
    localStorage.removeItem("viewas");
    localStorage.removeItem("userdata_admin");
    window.location.replace("/");
  } else {
    return (
      <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        extra={
          <Button
            type="primary"
            onClick={(e) => history.goBack()}
            className="btn-primary-default invert"
          >
            Go Back
          </Button>
        }
      />
    );
  }
};

export default Error404;
