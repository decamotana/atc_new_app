import React, { useState, useEffect } from "react";
import {
  Button,
  Modal,
  Space,
  Form,
  Row,
  Col,
  notification,
  Divider,
} from "antd";

import { useForm } from "antd/lib/form/Form";
import FloatSelect from "../../../providers/FloatSelect";
import FloatInput from "../../../providers/FloatInput";
import { GET, POST, GETMANUAL } from "../../../providers/useAxiosQuery";
import ReactQuill from "react-quill";
import { formats, modulesToolBar } from "../../../providers/reactQuillOptions";

const ModalCancelledAppointment = ({
  showModal,
  setShowModal,
  bookingDetails,
  setBookingDetails,
}) => {
  const handleCancel = () => {
    form.resetFields();
    setMemberOption([]);
    setBookingDetails([]);
    setShowModal(false);
  };

  const [form] = useForm();
  const [searchFor, setSearchFor] = useState("Client");
  const [appointment_stage, setAppointmentStage] = useState([]);
  const [pipeline_stage, setPipelineStage] = useState([]);
  const handleSearchFor = (val, opt) => {
    // console.log("handleSearchFor", opt);
    setSearchFor(val);
    setMemberOption([]);
    form.resetFields(["type"]);

    if (val === "Same stage clients") {
      form.setFieldsValue({
        type: appointment_stage.name,
      });
    }
  };

  const [memberOption, setMemberOption] = useState([]);
  const handleMember = (val, opt) => {
    // console.log("handleSearchFor", opt);
    setMemberOption(opt["data-json"]);
  };

  const [member, setmember] = useState([]);
  const {} = GET(
    "api/v1/appointment/user_option",
    "appointment_user_options",
    (res) => {
      if (res.success) {
        // console.log("user_options", res);
        let arr = [];
        res.data &&
          res.data.map((row, index) => {
            let val =
              row.role
                .match(/(\b\S)?/g)
                .join("")
                .match(/(^\S|\S$)?/g)
                .join("")
                .toUpperCase() +
              " - " +
              row.firstname +
              " " +
              row.lastname;
            arr.push({
              value: row.id,
              label: val,
              json: row,
            });
          });
        setmember(arr);
      }
    }
  );

  const {
    data: dataOpportunity,
    refetch: getOpportunity,
    isLoading: isLoadingOpportunity,
  } = GETMANUAL(
    `api/v1/consultant/opportunity/${bookingDetails?.client?.id}`,
    "opportunity",
    (res) => {
      // console.log("bookingDetails", bookingDetails)
      if (res.success) {
        // console.log("data", res.data)
        if (res.data != "nodata") {
          res.pipeline_stages_appointment.map((appointment_stage) => {
            if (appointment_stage.status === "process") {
              setAppointmentStage(appointment_stage);

              form.setFieldValue("");
            }
          });

          let pipeline_stage_option = [];

          res.pipelines[1].stages.map((stage) => {
            pipeline_stage_option.push({ label: stage.name, value: stage.id });
          });

          setPipelineStage(pipeline_stage_option);
        }
      }
    }
  );

  useEffect(() => {
    if (showModal === true) {
      form.setFieldValue("search_for", "Client");
    }
  }, [showModal]);

  useEffect(() => {
    if (bookingDetails?.client?.id !== undefined) {
      getOpportunity();
    }
  }, [bookingDetails]);

  const onFinishForm = (values) => {
    console.log("bookingDetails", bookingDetails);
    let data = {
      ...values,
      user_id: memberOption && memberOption.id,
      booking_details: bookingDetails,
      appointment_stage: appointment_stage && appointment_stage,
      link_origin: window.location.origin,
      //  old_type: oldData && oldData.old_type,
      // old_search_for: oldData && oldData.old_search_for,
    };
    // console.log("onFinishForm", data);
    mutateSendEmailNotification(data, {
      onSuccess: (res) => {
        if (res.success) {
          console.log(res);
          notification.success({
            message: "Success",
            description: "Clients has been notified!",
          });
          form.resetFields();
          setMemberOption([]);
          setBookingDetails([]);
          setShowModal(false);
        }
      },
    });
  };

  const [templateOption, setTemplateOption] = useState();
  const [emailTemplate, setEmailTemplate] = useState([]);

  const { refetch: getEmailTemplate } = GET(
    `api/v1/email_template`,
    "email_template_list",
    (res) => {
      if (res.success) {
        let option = [];
        console.log("template", res.data);

        res.data.forEach((template) => {
          option.push({
            label: template.title,
            value: template.id,
          });
        });
        setEmailTemplate(res.data);
        setTemplateOption(option);
      }
    }
  );

  const handleChangeEmailTemplate = (value) => {
    form.setFieldsValue({
      subject: emailTemplate.find((p) => p.id == value).subject,
      body: emailTemplate.find((p) => p.id == value).body,
    });
  };

  const {
    mutate: mutateSendEmailNotification,
    isLoading: isLoadingSendNotification,
  } = POST("api/v1/appointment/send_email_notification", "send_notification");

  const [role] = useState([
    {
      label: "All",
      value: "All",
    },
    {
      label: "Admin",
      value: "Admin",
    },
    {
      label: "Consultant",
      value: "Consultant",
    },
    {
      label: "User",
      value: "User",
    },
  ]);

  return (
    <>
      <Modal
        visible={showModal}
        className="modal-send-email-notifiaction cancelled-appointment-notif"
        title="NOTIFICATION FORM"
        okText="Submit"
        width={400}
        onCancel={() => handleCancel()}
        // afterClose={() => handleCancel()}
        cancelButtonProps={{
          style: {
            display: "none",
          },
        }}
        footer={[
          <Space>
            <Button
              className="btn-primary atc-btn-opposite"
              onClick={() => {
                form
                  .validateFields()
                  .then((values) => {
                    onFinishForm(values);
                  })
                  .catch((info) => {
                    console.log("Validate Failed:", info);
                  });
              }}
              // loading={() => {}}
            >
              Submit
            </Button>
          </Space>,
        ]}
      >
        <Form
          form={form}
          name="panlistnew"
          layout="vertical"
          initialValues={{
            search_for: "Client",
            body:
              emailTemplate.length > 0
                ? emailTemplate.find(
                    (p) =>
                      p.title.toUpperCase() ==
                      "APPOINTMENT CANCELLATION NOTIFICATION"
                  ).body
                  ? emailTemplate.find(
                      (p) =>
                        p.title.toUpperCase() ==
                        "APPOINTMENT CANCELLATION NOTIFICATION"
                    ).body
                  : ""
                : "",
            subject:
              emailTemplate.length > 0
                ? emailTemplate.find(
                    (p) =>
                      p.title.toUpperCase() ==
                      "APPOINTMENT CANCELLATION NOTIFICATION"
                  ).subject
                  ? emailTemplate.find(
                      (p) =>
                        p.title.toUpperCase() ==
                        "APPOINTMENT CANCELLATION NOTIFICATION"
                    ).subject
                  : ""
                : "",
            email_template:
              emailTemplate.length > 0
                ? emailTemplate.find(
                    (p) =>
                      p.title.toUpperCase() ==
                      "APPOINTMENT CANCELLATION NOTIFICATION"
                  ).id
                  ? emailTemplate.find(
                      (p) =>
                        p.title.toUpperCase() ==
                        "APPOINTMENT CANCELLATION NOTIFICATION"
                    ).id
                  : ""
                : "",
          }}
        >
          <Form.Item name="id" style={{ display: "none" }}>
            <FloatInput label="id" placeholder="id" />
          </Form.Item>
          <Row gutter={24}>
            <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
              <Form.Item
                className="email-by"
                name="search_for"
                rules={[{ required: true, message: "Required!" }]}
                hasFeedback
              >
                <FloatSelect
                  label="Email by"
                  placeholder="Email by"
                  onChange={handleSearchFor}
                  options={[
                    {
                      label: "Same stage clients",
                      value: "Same stage clients",
                    },
                    {
                      label: "Client",
                      value: "Client",
                    },
                    {
                      label: "Stage",
                      value: "Stage",
                    },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col
              xs={24}
              sm={24}
              md={24}
              lg={24}
              xl={24}
              xxl={24}
              className="no-margin-bottom"
            >
              {searchFor === "Stage" && (
                <Form.Item
                  name="type"
                  rules={[{ required: true, message: "Required!" }]}
                  hasFeedback
                >
                  <FloatSelect
                    label="Choose stage"
                    placeholder="Choose stage"
                    options={pipeline_stage && pipeline_stage}
                  />
                </Form.Item>
              )}

              {searchFor === "Same stage clients" && (
                <Form.Item
                  name="type"
                  rules={[{ required: true, message: "Required!" }]}
                  hasFeedback
                >
                  <FloatInput
                    label="Client current stage"
                    placeholder="Client current stage"
                    disabled
                  />
                </Form.Item>
              )}
              {searchFor === "Client" && (
                <Form.Item
                  name="type"
                  rules={[{ required: true, message: "Required!" }]}
                  className="form-select-error-multi"
                  hasFeedback
                >
                  <FloatSelect
                    label="Choose clients"
                    placeholder="Choose clients"
                    onChange={handleMember}
                    options={member}
                    multi="multiple"
                  />
                </Form.Item>
              )}
            </Col>
          </Row>
          <Divider style={{ marginBottom: "24px" }}></Divider>
          <Row gutter={24} className="consultant-register-grid">
            <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
              <Form.Item
                name="email_template"
                rules={[{ required: true, message: "Required!" }]}
                className="form-select-error-multi choose-email-template"
                hasFeedback
              >
                <FloatSelect
                  label="Choose Email Template"
                  placeholder="Choose Email Template"
                  onChange={handleChangeEmailTemplate}
                  options={templateOption}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
              <Form.Item
                className="the-subject"
                name="subject"
                rules={[{ required: true, message: "Required!" }]}
                hasFeedback
              >
                <FloatInput label="Subject" placeholder="Subject" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
              <Form.Item
                name="body"
                className="m-b-sm"
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: "This field is Required.",
                  },
                ]}
              >
                <ReactQuill
                  className="notif-modal-quill"
                  theme="snow"
                  style={{ height: 250 }}
                  modules={modulesToolBar}
                  formats={formats}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};

export default ModalCancelledAppointment;
