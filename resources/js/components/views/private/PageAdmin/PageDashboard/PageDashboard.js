import { Card, Col, Row, Switch, notification, Collapse, Form, Table, Tabs, Segmented } from "antd"
import React, { useEffect, useState, useRef } from "react"

import { GET, GETMANUAL, POST } from "../../../../providers/useAxiosQuery"
import { useHistory } from "react-router-dom"
import { Column } from "@ant-design/charts"
import ClientLastLogin from "./Component/ClientLastLogin"
import FloatSelect from "../../../../providers/FloatSelect"
import { faLoveseat } from "@fortawesome/pro-solid-svg-icons"
import { ClientStage, AppointmentStage } from "./Component/ClientStage"
import { faPlus } from "@fortawesome/pro-regular-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

function PageDashboard(props) {
  const history = useHistory()
  const [intialLoading, setInitialLoading] = useState(true)
  const [enableNotif, setEnableNotif] = useState({
    smsNotif_90_under: false,
    smsNotif_90_over: false,
    emailNotif_90_under: false,
    emailNotif_90_over: false,
  })

  const [emailTemplate, setEmailTemplate] = useState([])
  const [isLoadingStages, setIsLoadingStages] = useState(true)
  const [templateHasChanged, setTemplateHasChanged] = useState(false)
  const [form] = Form.useForm()
  const [templateOptions, setTemplateOption] = useState([
    {
      label: "No Data",
      value: "No Data",
    },
  ])

  const [defaultTemplate, setDefaultTemplate] = useState({
    sms_template: 1,
    email_template: 1,
  })

  const [calendarSettings, setCalendarSettings] = useState(false)

  const { location } = props
  const code = location.search.split("=")[1]
  //const [oldSettings, setOldSettings] = useState(Object.values(enableNotif));

  const [responseData, setResponseData] = useState({
    is_pan: false,
    response: "",
    attachment_url: [],
  })

  const { Panel } = Collapse

  const [chartData, setChartData] = useState([
    {
      month: "January",
      client: 38,
    },
    {
      month: "February",
      client: 52,
    },
  ])

  useEffect(() => {
    if (switchHasChange) {
      console.log("enable notif value: ", Object.values(enableNotif))
      saveSettings()
      setSwitchHasChanged(false)
    }

    if (templateHasChanged) {
      saveSettings()
      setTemplateHasChanged(faLoveseat)
    }
  }, [enableNotif.emailNotif_90_over, enableNotif.emailNotif_90_under, enableNotif.smsNotif_90_over, enableNotif.smsNotif_90_under, calendarSettings, defaultTemplate.sms_template, defaultTemplate.email_template])

  const [switchHasChange, setSwitchHasChanged] = useState(false)

  const SaveDropBoxToken = () => {
    let data = { token: code }

    mutateSaveToken(data, {
      onSuccess: (res) => {
        //  window.location.replace(res.data);
        //  console.log("token: ", res.data);
        //   notification.success({
        //     message: "Success",
        //     description: "Successfully created",
        //   });
        //   form.resetFields();
        // history.push(`/view/restaurants/edit/${table_id}`);
      },
    })
  }

  const { mutate: mutateFetchKey } = POST("api/v1/dropbox", "upload_docs")

  const connectToDropBox = () => {
    mutateFetchKey("", {
      onSuccess: (res) => {
        if (res.type == "url") {
          window.location.replace(res.data)
          console.log(res.data)
        } else {
          console.log(res.data)
        }
      },
    })
  }

  const { refetch: getAdminNotificationSettings } = GET(`api/v1/notification-settings`, "admin-settings", (res) => {
    if (res.success) {
      console.log("current", res.current_settings)

      setEnableNotif({
        smsNotif_90_under: res.data.sms_notif_90_under ? true : false,
        smsNotif_90_over: res.data.sms_notif_90_over ? true : false,
        emailNotif_90_under: res.data.email_notif_90_under ? true : false,
        emailNotif_90_over: res.data.email_notif_90_over ? true : false,
      })

      setCalendarSettings(res.data.calendar_settings ? true : false)

      setDefaultTemplate({
        sms_template: res.data.sms_template ? res.data.sms_template : 1,
        email_template: res.data.email_template ? res.data.email_template : 1,
      })

      form.setFieldsValue({
        sms_template: {
          value: res.data.sms_template ? res.data.sms_template : 1,
        },
        email_template: {
          value: res.data.email_template ? res.data.email_template : 1,
        },
      })
    }
  })

  const [mainPipeline, setMainPipeLine] = useState()
  const [subPipeline, setSubPipeLine] = useState()

  const { data: pipeline, refetch: getPipeline } = GET(`api/v1/pipelines`, "pipelines", (res) => {
    if (res.success) {
      // console.log("pipelines", res.data.pipelines[0].stages);

      //  let main_pipeliene = []
      if (res.data && res.data.pipeline && res.data.pipeline.length > 0) {
        setMainPipeLine(res.data.pipelines[0]?.stages)
      }
      // setSubPipeLine(res.data.pipelines[1]);
    }
  })

  const { refetch: getNewClients } = GET(`api/v1/new_clients`, "new-clients", (res) => {
    if (res.success) {
      console.log("new_clients", res.data)
      setChartData(res.data)
    }
  })

  const { mutate: mutateSaveSettings } = POST(`api/v1/notification-settings`, "admin-settings")

  const saveSettings = () => {
    // console.log("asdasdasdasd", Object.values(enableNotif))

    let data = {
      ...enableNotif,
      ...defaultTemplate,
      calendar_settings: calendarSettings,
    }

    mutateSaveSettings(data, {
      onSuccess: (res) => {
        if (res.success) {
          //   setShowModal(false);
          notification.success({
            message: "Success",
            description: "Notification Settings Updated",
          })
        }
      },
    })
  }

  const { mutate: mutateSaveToken } = POST("api/v1/dropbox/savetoken", "savetoken")

  useEffect(() => {
    if (code) {
      SaveDropBoxToken()
    } else {
      // const timer = setTimeout(() => {
      connectToDropBox()
      // }, 3000);
      //  console.log("no code");
    }
  }, [code])

  const { refetch: getEmailTemplate } = GET(`api/v1/email_template`, "email_template_list", (res) => {
    if (res.success) {
      let option = []
      console.log("template", res.data)

      res.data.forEach((template) => {
        option.push({
          label: template.title,
          value: template.id,
        })
      })
      setEmailTemplate(res.data)
      setTemplateOption(option)
    }
  })

  const [componentWidth, setComponentWidth] = useState(null)
  const componentRef = useRef(null)

  useEffect(() => {
    if (componentRef.current) {
      setComponentWidth(componentRef.current.offsetWidth)
      console.log("card width:", componentRef.current.offsetWidth)
    }
  }, [componentRef])

  return (
    <Card ref={componentRef} className="card--padding-mobile">
      <Row gutter={[20, 20]}>
        <Col xs={24} sm={24} md={24} lg={24} xl={16}>
          <Row gutter={[12, 12]}>
            <Col xs={24} sm={24} md={24} lg={24}>
              <Collapse className="main-1-collapse-reverse border-none panel-bordered" expandIcon={({ isActive }) => <FontAwesomeIcon icon={faPlus} style={{ color: "#325db8", fontSize: 18 }} />} defaultActiveKey={["1", "2", "3"]} expandIconPosition="end">
                <Panel key="1" className="accordion bg-darkgray-form" header="NEW CLIENTS">
                  {chartData && (
                    <Column
                      columnStyle={{ fill: "#2ead2e" }}
                      data={chartData}
                      xField="month"
                      yField="client_count"
                      barWidthRatio={0.05}
                      meta={{
                        month: {
                          alias: "month",
                        },
                        client_count: {
                          alias: "client",
                        },
                      }}
                    />
                  )}
                </Panel>

                <Panel key="2" className="accordion bg-darkgray-form m-t-md padding-on-dashboard" header="Client last login">
                  <ClientLastLogin />
                </Panel>
                <Panel key="3" className="accordion bg-darkgray-form m-t-md padding-on-dashboard" header="Clients Stage">
                  <ClientStage />
                </Panel>

                <Panel key="4" className="accordion bg-darkgray-form m-t-md padding-on-dashboard" header="Appointment Stage">
                  <AppointmentStage />
                </Panel>
              </Collapse>
            </Col>
          </Row>
        </Col>

        {/* side */}
        <Col sm={24} md={24} lg={24} xl={8}>
          <Row>
            <Col xs={24} sm={24} md={24} lg={24}>
              <Collapse className="main-1-collapse-reverse border-none panel-bordered" expandIcon={({ isActive }) => <FontAwesomeIcon icon={faPlus} style={{ color: "#325db8", fontSize: 18 }} />} defaultActiveKey={["1", "2", "3"]} expandIconPosition="end">
                <Panel key="1" className="accordion bg-darkgray-form padding-on-dashboard" header="Notification Settings">
                  <Row gutter={[12, 12]}>
                    <Col sm={18} xs={18} md={18} lg={18} className="admin-switch-title">
                      Enable All
                    </Col>
                    <Col sm={6} xs={6} md={6} lg={6} style={{ display: "flex", justifyContent: "center" }}>
                      <Switch
                        checked={!Object.values(enableNotif).includes(false)}
                        onChange={(value) => {
                          setSwitchHasChanged(true)
                          setEnableNotif({
                            smsNotif_90_over: value,
                            smsNotif_90_under: value,
                            emailNotif_90_over: value,
                            emailNotif_90_under: value,
                          })
                        }}
                      />
                    </Col>

                    <Col sm={18} xs={18} md={18} lg={18} className="admin-switch-title">
                      Enable automatic sms notification
                      <span className="subtitle">{"(client cancels meeting at anytime 90 mins or under)"}</span>
                    </Col>
                    <Col sm={6} xs={6} md={6} lg={6} style={{ display: "flex", justifyContent: "center" }}>
                      <Switch
                        checked={enableNotif.smsNotif_90_under}
                        onChange={(value) => {
                          setSwitchHasChanged(true)
                          setEnableNotif({
                            ...enableNotif,
                            smsNotif_90_under: value,
                          })
                        }}
                      />
                    </Col>
                    <Col sm={18} xs={18} md={18} lg={18} className="admin-switch-title">
                      Enable automatic sms notification
                      <span className="subtitle">{"(client cancels meeting at anytime 90 mins or greater)"}</span>
                    </Col>

                    <Col sm={6} xs={6} md={6} lg={6} style={{ display: "flex", justifyContent: "center" }}>
                      <Switch
                        checked={enableNotif.smsNotif_90_over}
                        onChange={(value) => {
                          setSwitchHasChanged(true)
                          setEnableNotif({
                            ...enableNotif,
                            smsNotif_90_over: value,
                          })
                        }}
                      />
                    </Col>
                    <Col sm={18} xs={18} md={18} lg={18} className="admin-switch-title">
                      Enable automatic email notification
                      <span className="subtitle">{"(client cancels meeting at anytime 90 mins or under)"}</span>
                    </Col>
                    <Col sm={6} xs={6} md={6} lg={6} style={{ display: "flex", justifyContent: "center" }}>
                      <Switch
                        checked={enableNotif.emailNotif_90_under}
                        onChange={(value) => {
                          setSwitchHasChanged(true)
                          setEnableNotif({
                            ...enableNotif,
                            emailNotif_90_under: value,
                          })
                        }}
                      />
                    </Col>
                    <Col sm={18} xs={18} md={18} lg={18} className="admin-switch-title">
                      Enable automatic email notification
                      <span className="subtitle">{"(client cancels meeting at anytime 90 mins or greater)"}</span>
                    </Col>
                    <Col sm={6} xs={6} md={6} lg={6} style={{ display: "flex", justifyContent: "center" }}>
                      <Switch
                        checked={enableNotif.emailNotif_90_over}
                        onChange={(value) => {
                          setSwitchHasChanged(true)
                          setEnableNotif({
                            ...enableNotif,
                            emailNotif_90_over: value,
                          })
                        }}
                      />
                    </Col>
                  </Row>
                </Panel>

                <Panel key="2" className="accordion bg-darkgray-form m-t-md calendar-box padding-on-dashboard" header="Calendar Settings">
                  <Row gutter={[12, 12]}>
                    <Col sm={18} xs={18} md={18} lg={18} className="admin-switch-title">
                      Enable download Calendar
                      <span className="subtitle">{"(enables download calendar on consultant booking page)"}</span>
                    </Col>
                    <Col sm={6} xs={6} md={6} lg={6} style={{ display: "flex", justifyContent: "center" }}>
                      <Switch
                        checked={calendarSettings}
                        onChange={(value) => {
                          setSwitchHasChanged(true)
                          setCalendarSettings(value)
                        }}
                      />
                    </Col>
                  </Row>
                </Panel>

                <Panel key="3" className="accordion bg-darkgray-form m-t-md calendar-box padding-on-dashboard sms-and-email-collapse" header="SMS AND EMAIL TEMPLATE SETTINGS">
                  {" "}
                  <Form
                    form={form}

                    // initialValues={{
                    //   sms_template: { value: defaultTemplate.sms_template },
                    //   email_template: { value: defaultTemplate.email_template },
                    // }}
                  >
                    <Row gutter={[12, 12]}>
                      <Col sm={24} xs={24} md={24} lg={24}>
                        <Form.Item name="sms_template" style={{ margin: "0px" }}>
                          <FloatSelect
                            label="SMS NOTIFICATION TEMPLATE"
                            placeholder="SMS NOTIFICATION TEMPLATE"
                            className="form-select-error"
                            onChange={(value) => {
                              setTemplateHasChanged(true)
                              setDefaultTemplate({
                                ...defaultTemplate,
                                sms_template: value,
                              })
                            }}
                            options={templateOptions}
                          />
                        </Form.Item>
                      </Col>
                      <Col sm={24} xs={24} md={24} lg={24}>
                        <Form.Item name="email_template" style={{ margin: "0px" }}>
                          <FloatSelect
                            label="EMAIL NOTIFICATION TEMPLATE"
                            placeholder="EMAIL NOTIFICATION TEMPLATE"
                            onChange={(value) => {
                              setTemplateHasChanged(true)
                              setDefaultTemplate({
                                ...defaultTemplate,
                                email_template: value,
                              })
                            }}
                            options={templateOptions}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Form>
                </Panel>
              </Collapse>
            </Col>
          </Row>{" "}
        </Col>
      </Row>

      {/* <Modal
        visible={showModal}
        title="Notification Settings"
        onCancel={() => {
          setShowModal(false);
        }}
        footer={
          <Space>
            <Button
              type="primary"
              className="atc-btn-opposite"
              onClick={() => saveSettings()}
            >
              Save Settings
            </Button>
          </Space>
        }
      ></Modal> */}
    </Card>
  )
}

export default PageDashboard
