import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import {
  Layout,
  Card,
  Form,
  Button,
  Row,
  Col,
  Image,
  Typography,
  Alert,
} from "antd";
import moment from "moment";
import axios from "axios";
import {
  apiUrl,
  logo,
  description,
  encryptor,
} from "../../../providers/companyInfo";
import FloatInputPasswordStrength from "../../../providers/FloatInputPasswordStrength";
import ComponentHeader from "../Components/ComponentHeader";

import { faEdit } from "@fortawesome/pro-regular-svg-icons";
import validateRules from "../../../providers/validateRules";

// const apiUrl = apiUrl;
// const logo = logo;
// const description = description;
// const encryptor = encryptor;

export default function PageRegistrationSetPassword(props) {
  let token = props.match.params.token;

  let history = useHistory();

  // console.log("roleParam", roleParam);

  // console.log("props", props);
  // console.log("token", token);

  const [errorMessagePassword, setErrorMessagePassword] = useState({
    type: "success",
    message: "",
    already_verified: false,
  });

  const [role, setRole] = useState();

  useEffect(() => {
    if (token) {
      axios
        .post(
          `${apiUrl}api/v1/set_password/auth`,
          {},
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        )
        .then((res) => {
          // console.log("useEffect success", res.data);
          setErrorMessagePassword({
            type: "error",
            message: res.data.message,
            already_verified: res.data.already_verified,
          });
          setRole(res.data.role);
        })
        .catch((err) => {
          console.log(err);
          // if (err.response.status === 401) {
          // 	history.push("/error-500");
          // }
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [isLoading, setIsLoading] = useState(false);
  const onFinishPassword = (values) => {
    setIsLoading(true);
    // console.log("apiUrl", apiUrl);
    let data = { ...values };
    axios
      .post(`${apiUrl}api/v1/set_password/auth`, data, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => {
        setIsLoading(false);
        // console.log("res.data", res);
        if (res.data.success) {
          localStorage.userdata = encryptor.encrypt(res.data.authUser.data);
          localStorage.token = res.data.authUser.token;

          setErrorMessagePassword({
            type: "success",
            message: "Set password successfully.",
          });

          localStorage.removeItem("bfssRegStepData");
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        } else {
          setErrorMessagePassword({
            type: "error",
            message: "This email already verified!",
          });
        }
      });
  };

  return (
    <Layout className="public-layout register-layout">
      <Layout.Content className="p-t-lg">
        <Row>
          <Col xs={24} sm={24} md={24} lg={24} xl={24}>
            <Image
              className="zoom-in-out-box"
              onClick={() => history.push("/")}
              src={logo}
              preview={false}
            />

            <Card className="m-t-md">
              <ComponentHeader
                title="Registration"
                sub_title={
                  role
                    ? `${role !== "Coach" ? "Athlete" : "Coach"}'s`
                    : "New User"
                }
                icon={faEdit}
              />
              {errorMessagePassword.already_verified === false ? (
                <Form
                  layout="vertical"
                  className="form-create-password"
                  onFinish={onFinishPassword}
                  autoComplete="off"
                >
                  <Typography.Title level={3} className="font-weight-normal">
                    Set up Password
                  </Typography.Title>

                  <Typography.Text>
                    Your password must be at least 8 characters and contain at
                    least one number, one uppercase letter and one special
                    character.
                  </Typography.Text>

                  <Form.Item
                    style={{ marginTop: 20 }}
                    name="password"
                    className="new-password-input"
                    rules={[validateRules.required, validateRules.password]}
                    hasFeedback
                  >
                    <FloatInputPasswordStrength
                      placeholder="Password"
                      label="Password"
                      required
                    />
                  </Form.Item>
                  <Form.Item
                    name="confirm-password"
                    dependencies={["password"]}
                    className="new-password-input"
                    rules={[
                      validateRules.required,
                      validateRules.password,
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue("password") === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(
                            new Error(
                              "The two passwords that you entered do not match!"
                            )
                          );
                        },
                      }),
                    ]}
                    hasFeedback
                    // className="m-b-sm"
                  >
                    <FloatInputPasswordStrength
                      label="Confirm Password"
                      placeholder="Confirm Password"
                      required
                    />
                  </Form.Item>

                  <Button
                    type="primary"
                    htmlType="submit"
                    className="atc-btn"
                    block
                    size="large"
                    loading={isLoading}
                  >
                    SUBMIT
                  </Button>

                  {errorMessagePassword.message !==
                    "Please setup password now!" &&
                    errorMessagePassword.message !== "" && (
                      <>
                        <Alert
                          className="m-t-sm text-center"
                          type={errorMessagePassword.type}
                          message={errorMessagePassword.message}
                        />
                      </>
                    )}
                </Form>
              ) : (
                errorMessagePassword.message !== "" && (
                  <Alert
                    className="m-t-sm text-center"
                    type={errorMessagePassword.type}
                    message={errorMessagePassword.message}
                  />
                )
              )}
            </Card>
          </Col>
        </Row>
      </Layout.Content>
      <Layout.Footer className="text-center">
        <Typography.Text>
          © Copyright {moment().format("YYYY")} {description}. All Rights
          Reserved.
        </Typography.Text>
      </Layout.Footer>
    </Layout>
  );
}
