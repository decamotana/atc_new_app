import React, { useState } from "react";
import {
  Button,
  Card,
  Col,
  Collapse,
  Form,
  Input,
  notification,
  Row,
  Modal,
  Space,
} from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faAngleDown,
  faAngleUp,
  faPlus,
} from "@fortawesome/pro-regular-svg-icons";

import FloatInput from "../../../../providers/FloatInput";

import {
  formats,
  modulesToolBar,
} from "../../../../providers/reactQuillOptions";

import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import ImageResize from "quill-image-resize-module-react";
import { GET, POST } from "../../../../providers/useAxiosQuery";
import { PlusOutlined } from "@ant-design/icons";

Quill.register("modules/imageResize", ImageResize);
const FontSize = ReactQuill.Quill.import("attributors/style/size");
FontSize.whitelist = ["10px", "12px", "14px", "16px", "18px", "20px"];
ReactQuill.Quill.register(FontSize, true);

export default function PageEmailTemplates() {
  const [dataSource, setDataSource] = useState([]);

  const [form] = Form.useForm();
  const [form1] = Form.useForm();
  const [showModal, setShowModal] = useState(false);

  const modules = {
    toolbar: {
      container: [
        [{ header: [1, 2, false] }],
        ["bold", "italic", "underline", "strike", "blockquote"],
        [
          { list: "ordered" },
          { list: "bullet" },
          { indent: "-1" },
          { indent: "+1" },
        ],
        ["link", "image", "video"],
        ["clean"],
        [{ font: [] }],
        [{ size: ["10px", "12px", "14px", "16px", "18px", "20px"] }],
      ],
    },
  };

  const { refetch: getEmailTemplate } = GET(
    `api/v1/email_template`,
    "email_template_list",
    (res) => {
      if (res.success) {
        let newdata = res.data;
        let data = [
          { title: "FORGOT / CHANGE PASSWORD", body: "" },
          { title: "Registration - Success", body: "" },
          { title: "Password Change", body: "" },
          // { title: "Ticketing - Initial Ticket", body: "" },
          // { title: "Ticketing - Ticket Resolved", body: "" },
          // { title: "Book Assessment", body: "" },
        ];

        data.forEach(
          (dataItem) =>
            newdata.find(({ title }) => title === dataItem.title) ||
            newdata.push(dataItem)
        );

        console.log("newdata", newdata);

        setDataSource(newdata);

        form.setFieldsValue({
          list: newdata,
        });
      }
    }
  );

  const {
    mutate: mutateNewEmailTemplate,
    // isLoading: isLoadingEmailTemplate,
  } = POST("api/v1/add_email_template", "new_email_template");

  const onFinishNewEmailTemplate = (values) => {
    // console.log("onFinish", values);

    mutateNewEmailTemplate(values, {
      onSuccess: (res) => {
        // console.log("mutateEmailTemplate", res);
        if (res.success) {
          notification.success({
            message: "Add Editable Template",
            description: res.message,
          });

          form1.resetFields();
          setShowModal(false);
          getEmailTemplate();
        } else {
          notification.error({
            message: "Add Editable Template",
            description: res.message,
          });
        }
      },
      onError: (err) => {
        notification.error({
          message: "Add Editable Template",
          description: err.response.data.message,
        });
      },
    });
  };

  const {
    mutate: mutateEmailTemplate,
    // isLoading: isLoadingEmailTemplate,
  } = POST("api/v1/email_template", "email_template");

  const onFinish = (values) => {
    // console.log("onFinish", values);

    mutateEmailTemplate(values, {
      onSuccess: (res) => {
        // console.log("mutateEmailTemplate", res);
        if (res.success) {
          notification.success({
            message: "Editable Template",
            description: "Successfully Updated",
          });

          setDataSource(res.data);

          form.setFieldsValue({
            list: res.data,
          });
        } else {
          notification.error({
            message: "Editable Template",
            description: "Data not updated!",
          });
        }
      },
      onError: (err) => {
        notification.error({
          message: "Editable Template",
          description: err.response.data.message,
        });
      },
    });
  };

  const handleBlurSave = (value, index, field) => {
    if (dataSource[index][field] !== value) {
      form.submit();
    }
  };

  return (
    <Card className="email-templates-fields card--padding-mobile">
      <Row>
        <Col>
          <Button
            type="primary"
            className="btn-upload btn-with-svg b-r-none"
            size="large"
            onClick={() => setShowModal(true)}
          >
            {" "}
            <FontAwesomeIcon
              icon={faPlus}
              style={{ marginRight: "10px" }}
            />{" "}
            Add New Email Template
          </Button>
        </Col>
      </Row>
      <Row className="m-t-md">
        <Col xs={24} sm={24} md={24} lg={24}>
          <Form form={form} onFinish={onFinish}>
            <Form.List name="list" initialValue={{ list: "" }}>
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }, index) => (
                    <Collapse
                      accordion
                      expandIconPosition="end"
                      expandIcon={({ isActive }) => (
                        <FontAwesomeIcon
                          icon={faPlus}
                          style={{ color: "#325db8", fontSize: 18 }}
                        />
                      )}
                      className="main-4-collapse border-none m-b-lg email-template-collapse"
                      key={`${index}`}
                      defaultActiveKey={["0"]}
                    >
                      <Collapse.Panel
                        header={dataSource[index].title}
                        key={index === 0 ? "0" : "1"}
                      >
                        <Form.Item
                          {...restField}
                          name={[name, "id"]}
                          className="m-b-md hide"
                        >
                          <Input />
                        </Form.Item>

                        <Form.Item
                          {...restField}
                          name={[name, "title"]}
                          className="m-b-md hide"
                        >
                          <Input />
                        </Form.Item>

                        <Form.Item
                          {...restField}
                          name={[name, "subject"]}
                          className="form-select-error"
                          hasFeedback
                          rules={[
                            {
                              required: true,
                              message: "This field is required.",
                            },
                          ]}
                        >
                          <FloatInput
                            label="Subject"
                            placeholder="Subject"
                            onBlurInput={(e) =>
                              handleBlurSave(e, name, "subject")
                            }
                          />
                        </Form.Item>

                        <Form.Item
                          {...restField}
                          name={[name, "body"]}
                          className="m-b-sm"
                          hasFeedback
                          rules={[
                            {
                              required: true,
                              message: "This field is required.",
                            },
                          ]}
                        >
                          <ReactQuill
                            theme="snow"
                            modules={modules}
                            formats={formats}
                            onBlur={(range, source, quill) =>
                              handleBlurSave(quill.getHTML(), name, "body")
                            }
                          />
                        </Form.Item>
                      </Collapse.Panel>
                    </Collapse>
                  ))}
                </>
              )}
            </Form.List>
          </Form>
        </Col>
      </Row>
      <Form
        form={form1}
        onFinish={onFinishNewEmailTemplate}
        initialValues={{ content: "", title: "", subject: "" }}
      >
        <Modal
          visible={showModal}
          className="modal modal-email-template"
          title="NEW EMAIL TEMPLATE FORM"
          okText="Submit"
          cancelText="Cancel"
          width={700}
          onCancel={() => {
            form1.resetFields();
            setShowModal(false);
          }}
          footer={[
            <Space>
              <Button
                className="atc-btn-opposite"
                onClick={() => {
                  form1
                    .validateFields()
                    .then((values) => {
                      onFinishNewEmailTemplate(values);
                    })
                    .catch((info) => {
                      console.log("Validate Failed:", info);
                    });
                }}
                // loading={isLoadingNotification}
              >
                Submit
              </Button>
            </Space>,
          ]}
        >
          {/*  // initialValues={{ search_for: "Role" }}*/}

          <Row>
            <Col xs={24} sm={24} md={24} lg={24}>
              {" "}
              <Form.Item
                name="title"
                className="m-b-sm form-select-error"
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: "This field is required.",
                  },
                ]}
              >
                <FloatInput label="Title" placeholder="Title" />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col xs={24} sm={24} md={24} lg={24}>
              {" "}
              <Form.Item
                name="subject"
                className="m-b-sm form-select-error"
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: "This field is required.",
                  },
                ]}
              >
                <FloatInput label="Subject" placeholder="Subject" />
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col xs={24} sm={24} md={24} lg={24}>
              {" "}
              <Form.Item
                name="content"
                className="m-b-sm"
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: "This field is required.",
                  },
                ]}
              >
                <ReactQuill
                  className="ticket-quill"
                  theme="snow"
                  modules={modulesToolBar}
                  formats={formats}
                  // onChange={(e) => console.log(e)}
                />
              </Form.Item>
            </Col>
          </Row>
        </Modal>
      </Form>
    </Card>
  );
}
