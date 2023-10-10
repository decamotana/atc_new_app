import { Button, Col, Divider, Dropdown, Input, Layout, List, Menu, Modal, Row, Select, Space, Tooltip, Typography, Collapse, Image, Form, notification, Switch, Alert, Card } from "antd"
import React, { useEffect, useRef, useState } from "react"
// import ComponentHeader from "../EventProvider/Components/ComponentHeader";
import { DELETE, GET, GETMANUAL, POST, UPDATE } from "../../../providers/useAxiosQuery"
import { apiUrl, role, userData, encrypt } from "../../../providers/companyInfo"
import notificationErrors from "../../../providers/notificationErrors"
// import { animateScroll } from "react-scroll";
import Icon from "@ant-design/icons"
import { MenuUnfoldOutlined, MenuFoldOutlined, UserOutlined, VideoCameraOutlined, UploadOutlined, MessageOutlined, SendOutlined, PlusCircleOutlined, CloseOutlined, DeleteOutlined, RedoOutlined, CheckOutlined, UpOutlined, DownOutlined } from "@ant-design/icons"
import $ from "jquery"
import FloatSelect from "../../../providers/FloatSelect"
import FloatInput from "../../../providers/FloatInput"
import FloatInputMask from "../../../providers/FloatInputMask"
import FloatInputPassword from "../../../providers/FloatInputPassword"

import moment from "moment"
import useFormInstance from "antd/lib/form/hooks/useFormInstance"
import { useHistory } from "react-router-dom"

const { Header, Sider, Content } = Layout

const Page2fa = ({ props, permission }) => {
  let history = useHistory()
  const urlParams = new URLSearchParams(window.location.search)
  const message_id = urlParams.get("message_id")
  const { Panel } = Collapse
  let userdata = userData()
  //   const sub_title = "Setting Up Two Factor";
  const sub_title = "Two Factor"
  const [collapsed, setCollapsed] = useState(false)

  const [isEnable2fa, setEnable2fa] = useState(false)

  const [isModalPassword, setIsModalPassword] = useState(true)

  GET(`api/v1/users/${userData().id}`, "user_data", (res) => {
    if (res.success) {
      setEnable2fa(res.data.google2fa_enable == 1 ? true : false)
    }
  })

  const { mutate: mutateGenerateKey, isloading: isloadingGenerateKey } = POST("api/v1/generate2faSecret", `generate_2fakey`)

  const [showQr, setShowQr] = useState(false)
  const [keyData, setKeyData] = useState("")
  const [qrImage, setQrImage] = useState("")

  const handleGenerate = () => {
    // console.log(data);
    mutateGenerateKey(
      {},
      {
        onSuccess: (res) => {
          if (res.success) {
            setShowQr(true)
            setQrImage(res.google_url)
            setKeyData(res.data)
          }
        },
        onError: (err) => {
          console.log(err)
        },
      }
    )
  }

  const { mutate: mutateEnable2fa, isloading: isloadingEnable2fa } = POST("api/v1/enable2fa", `enable2fa`)

  const onFinish = (val) => {
    var code = val.code.replace(/-/g, "")

    mutateEnable2fa(
      { code: code },
      {
        onSuccess: (res) => {
          if (res.success) {
            notification.success({
              message: "Success",
              description: "2FA Enabled Successfully",
            })
            setEnable2fa(true)
          } else {
            notification.error({
              message: "Error",
              description: "Invalid Authenticator Code, Please try again",
            })
          }
        },
        onError: (err) => {
          console.log(err)
        },
      }
    )
  }

  const validator = {
    require: {
      required: true,
      message: "Required",
    },
    require_false: {
      required: false,
      message: "Required",
    },
    email: {
      type: "email",
      message: "please enter a valid email",
    },
  }

  const { mutate: mutateDisable2fa, isloading: isloadingDisable2fa } = POST("api/v1/disable2fa", `disable2fa`)

  const handleDisable = () => {
    mutateDisable2fa(
      {},
      {
        onSuccess: (res) => {
          if (res.success) {
            notification.success({
              message: "Success",
              description: "2FA Disabled Successfully",
            })
            setEnable2fa(false)
          }
        },
        onError: (err) => {
          console.log(err)
        },
      }
    )
  }

  const { mutate: mutateverifypass, isloading: isloadingverifypass } = POST("api/v1/verifypass", `verifypass`)

  const [showPage, setShowPage] = useState(false)

  const onFinishVerify = (val) => {
    mutateverifypass(
      { password: val.password, user_id: userdata.id },
      {
        onSuccess: (res) => {
          if (res.success) {
            setIsModalPassword(false)
            setShowPage(true)
          } else {
            notification.error({
              message: "Error",
              description: "Incorrect Password, Please try again",
            })
          }
        },
        onError: (err) => {
          console.log(err)
        },
      }
    )
  }

  return (
    <Layout
      className="site-layout-background"
      style={{
        background: "#fff",
      }}
      id="Page2fa"
    >
      {/* <ComponentHeader
        sub_title={sub_title}
        permission={permission}
        icon={<CheckOutlined />}
      /> */}

      <Layout.Content>
        <Card className="card--padding-mobile">
          <Row gutter={4} style={{ display: showPage ? "block" : "none" }}>
            <Col xs={24} sm={24} md={24} lg={24} xl={16}>
              <div>
                {!isEnable2fa && (
                  <Collapse expandIcon={({ isActive }) => (isActive ? <span className="ant-menu-submenu-arrow" style={{ color: "#FFF", transform: "rotate(270deg)" }}></span> : <span className="ant-menu-submenu-arrow" style={{ color: "#FFF", transform: "rotate(90deg)" }}></span>)} className="main-4-collapse border-none client-info-collapse" expandIconPosition="end" defaultActiveKey={["1"]}>
                    <Panel header="Two factor authentication (2FA)" key="1" className="accordion bg-darkgray-form m-b-md border bgcolor-1 white">
                      <p>Two Factor Authentication (2FA) strengthens access security by requiring two methods (also referred to as factors) to verify your identity. Two factor authentication protects against phishing, social engineering and password brute force attacks and secures your logins from attackers exploiting weak or stolen credentials.</p>
                      {!showQr ? (
                        <Button
                          size="large"
                          className="atc-btn"
                          style={{
                            marginTop: "20px",
                            marginRight: 10,
                          }}
                          isloading={isloadingGenerateKey}
                          onClick={() => handleGenerate()}
                        >
                          Setup Google Authenticator
                        </Button>
                      ) : (
                        <>
                          <div>
                            <b> 1. Scan this QR code with your Google Authenticator App </b>
                            <br />
                            <div>
                              <div dangerouslySetInnerHTML={{ __html: qrImage }} />
                              <b> or you can use the code: </b>
                              <code className="c-lightorange">{keyData}</code>
                            </div>
                          </div>
                          <br></br>
                          <br></br>
                          <div>
                            <b>2. Enter the Code from Google Authenticator App</b>
                            <Form name="basic" layout="vertical" className="login-form" onFinish={onFinish}>
                              <br></br>
                              <Form.Item name="code" rules={[validator.require]} hasFeedback>
                                <FloatInputMask label="Authenticator Code" placeholder="Authenticator Code" maskLabel="code" maskType="999-999" />
                              </Form.Item>
                              <Button htmlType="submit" loading={isloadingEnable2fa} size="large" className="btn-login-outline ">
                                Enable 2FA
                              </Button>
                            </Form>
                          </div>
                        </>
                      )}
                    </Panel>
                  </Collapse>
                )}

                {isEnable2fa && (
                  <Collapse expandIcon={({ isActive }) => (isActive ? <span className="ant-menu-submenu-arrow" style={{ color: "#FFF", transform: "rotate(270deg)" }}></span> : <span className="ant-menu-submenu-arrow" style={{ color: "#FFF", transform: "rotate(90deg)" }}></span>)} expandIconPosition="end" defaultActiveKey={["1"]}>
                    <Panel header={`Two factor authentication (2FA)`} key="1" className="accordion bg-darkgray-form">
                      <p>Two Factor Authentication (2FA) strengthens access security by requiring two methods (also referred to as factors) to verify your identity. Two factor authentication protects against phishing, social engineering and password brute force attacks and secures your logins from attackers exploiting weak or stolen credentials.</p>

                      <Alert message="2FA is currenlty enabled on your account" type="success" showIcon />
                      <Button
                        size="large"
                        className="btn-login-outline "
                        style={{
                          marginTop: "20px",
                          marginRight: 10,
                        }}
                        isloading={isloadingDisable2fa}
                        onClick={() => handleDisable()}
                      >
                        Disable 2FA
                      </Button>
                    </Panel>
                  </Collapse>
                )}
              </div>
            </Col>
          </Row>
          <Modal
            title="ENTER YOUR PASSWORD TO CONTINUE"
            visible={isModalPassword}
            // onOk={showModal}
            className="modal-login twofa-modal"
            onCancel={() => {
              history.goBack()
            }}
            footer={null}
            style={{ top: 20 }}
          >
            <Form wrapperCol={{ span: 24 }} layout="horizontal" onFinish={onFinishVerify}>
              <div>The page you are trying to visit requires that you re-enter your password.</div>
              <Row gutter={16} className="m-t-md">
                <Col xs={24} sm={24} md={24} lg={24}>
                  <Form.Item name="password" rules={[validator.require]} hasFeedback>
                    <FloatInputPassword label="Current Password" placeholder="Current Password" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={24} justify="end">
                <Col className="gutter-row" xs={24} sm={24} md={12} lg={12}>
                  <Button size="large" htmlType="submit" className="atc-btn" style={{ width: "100%", marginTop: "10px" }} loading={isloadingverifypass}>
                    VERIFY
                  </Button>
                </Col>
              </Row>
            </Form>
          </Modal>
        </Card>
      </Layout.Content>
    </Layout>
  )
}

export default Page2fa
