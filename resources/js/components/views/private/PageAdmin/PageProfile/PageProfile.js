import React, { useEffect, useState } from "react"
import { useHistory, Link } from "react-router-dom"
import { Button, Card, Checkbox, Col, Collapse, Divider, Form, message, Radio, Row, Switch, Typography, Upload, notification } from "antd"
import ImgCrop from "antd-img-crop"
import optionCountryCodes from "../../../../providers/optionCountryCodes"
import optionStateCodesUnitedState from "../../../../providers/optionStateCodesUnitedState"
import optionStateCodesCanada from "../../../../providers/optionStateCodesCanada"
import FloatInput from "../../../../providers/FloatInput"
import FloatSelect from "../../../../providers/FloatSelect"
import { apiUrl, role, userData, encrypt } from "../../../../providers/companyInfo"
import { GET, POST } from "../../../../providers/useAxiosQuery"
import SignatureCanvas from "react-signature-canvas"
import ModalDeactivateAcc from "./Components/ModalDeactivateAcc"
import ModaFormChangePassword from "./Components/ModaFormChangePassword"
import ModaForm2FactorAuthentication from "./Components/ModaForm2FactorAuthentication"

export default function PageProfile() {
  const history = useHistory()
  const [form] = Form.useForm()
  const [users, setUsersData] = useState([])
  const [authText, setAuthText] = useState("enable")

  // console.log("userData", userData());

  useEffect(() => {
    if (users.length != 0) {
      form.setFieldsValue({
        username: users.username,
        firstname: users.firstname,
        lastname: users.lastname,
        email: users.email,
        phone: users.phone,
        address1: users.user_address.address1,
        address2: users.user_address.address2,
        state: users.user_address.state,
        city: users.user_address.city,
        zip: users.user_address.zip_code,
      })
    }

    return () => {}
  }, [users])

  useEffect(() => {
    setOptionState(stateUS)
    setStateLabel("State")
    setOptionZip(/(^\d{5}$)|(^\d{5}-\d{4}$)/)
    setZipLabel("Zip Code")
  }, [form])

  const stateUS = optionStateCodesUnitedState()
  const stateCA = optionStateCodesCanada()

  const [optionState, setOptionState] = useState([])
  const [stateLabel, setStateLabel] = useState("State")
  const [optionZip, setOptionZip] = useState()
  const [zipLabel, setZipLabel] = useState("Zip Code")

  const [fileList, setFileList] = useState([])
  const [radioData, setRadioData] = useState(1)
  const [imageCrop, setImageCrop] = useState({
    width: 1,
    height: 1,
  })

  const [statusDeactivateAcc, setStatusDeactivateAcc] = useState(true)
  const [toggleModalDeactivateAcc, setToggleModalDeactivateAcc] = useState({
    title: "",
    show: false,
  })
  const [toggleModalFormChangePassword, setToggleModalFormChangePassword] = useState(false)
  const [toggleModalForm2FactorAuthentication, setToggleModalForm2FactorAuthentication] = useState(false)

  GET(`api/v1/users/${userData().id}`, "update_profile", (res) => {
    if (res.success) {
      if (res.data) {
        let data = res.data

        setUsersData(data)

        let image_type = data.profile_image ? data.profile_image.split("/") : ""

        if (image_type[0] !== undefined) {
          image_type = image_type[0] === "https:" ? data.profile_image : apiUrl + data.profile_image

          setFileList([
            {
              uid: "-1",
              name: "image.png",
              status: "done",
              url: image_type,
            },
          ])
        } else {
          setFileList([])
          image_type = ""
        }
      }
    }
  })

  const handleCountry = (e, opt) => {
    if (e === "United States") {
      setOptionState(stateUS)
      setStateLabel("State")
      setOptionZip(/(^\d{5}$)|(^\d{5}-\d{4}$)/)
      setZipLabel("Zip Code")
    } else if (e === "Canada") {
      setOptionState(stateCA)
      setStateLabel("County")
      setOptionZip(/^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/)
      setZipLabel("Postal Code")
    } else {
      setOptionState(stateUS)
      setStateLabel("State")
      setOptionZip(/(^\d{5}$)|(^\d{5}-\d{4}$)/)
      setZipLabel("Zip Code")
    }

    // form2.resetFields(["state"]);
  }

  const handleResize = (val) => {
    setRadioData(val.target.value)
    if (val.target.value === 1) {
      setImageCrop({
        width: 1,
        height: 1,
      })
    } else if (val.target.value === 2) {
      setImageCrop({
        width: 3.9,
        height: 2.6,
      })
    } else if (val.target.value === 3) {
      setImageCrop({
        width: 1,
        height: 1.5,
      })
    }
  }

  const onChangeUpload = ({ fileList: newFileList }) => {
    var _file = newFileList

    if (_file.length !== 0) {
      _file[0].status = "done"
      setFileList(_file)
      setHasChange(true)
      form.submit()
    } else {
      setFileList([])
    }
  }

  const onPreviewUpload = async (file) => {
    let src = file.url
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader()
        reader.readAsDataURL(file.originFileObj)
        reader.onload = () => resolve(reader.result)
      })
    }
    const image = new Image()
    image.src = src
    const imgWindow = window.open(src)
    imgWindow.document.write(image.outerHTML)
  }

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png" || file.type === "image/gif" || file.type === "image/jpg"
    if (!isJpgOrPng) {
      message.error("You can only upload JPG, PNG, GIF, JPEG file!")

      return
    }
    const isLt2M = file.size / 102400 / 102400 < 10
    if (!isLt2M) {
      message.error("Image must smaller than 10MB!")

      return
    }

    return isJpgOrPng && isLt2M
  }

  const { mutate: mutateUpdateUser } = POST("api/v1/users/update", "user")

  const onFinish = (values) => {
    if (hasChange) {
      let formData = new FormData()
      let data = form.getFieldsValue()

      Object.keys(data).map((key, item) => {
        formData.append(key, data[key])
      })

      formData.append("id", userData().id)

      if (fileList.length !== 0) {
        if (fileList[0].uid != "-1") {
          formData.append("profile_image", fileList[0].originFileObj, fileList[0].name)
        }
      }

      //    let data = { ...form.getFieldsValue(), id: userData().id };
      mutateUpdateUser(formData, {
        onSuccess: (res) => {
          if (res.success) {
            notification.success({
              message: "Success",
              description: "Updated ",
            })

            localStorage.userdata = encrypt(res.data)
            setHasChange(false)
          }
        },
      })
    }
  }

  const onChangeSwitch = (checked) => {
    console.log(`switch to ${checked}`)
  }

  const handleCheckboxDeactivateAccount = (e) => {
    setStatusDeactivateAcc(e.target.checked === true ? false : true)
  }

  const handleClickDeactivateAcc = () => {
    console.log("handleClickDeactivateAcc")
    let title = ""
    if (role() === "User") {
      title = "User"
    }
    // } else {
    //   title = "Cancer CareProfessional $75";
    // }
    setToggleModalDeactivateAcc({ title, show: true })
  }

  const [signature, setSignature] = useState()
  const [signatureValue, setSignatureValue] = useState()
  const [hasChange, setHasChange] = useState(false)

  const handleClearSignature = () => {
    signature.clear()
    setSignatureValue("")
  }

  return (
    <Card className="page-admin-profile">
      <Form
        form={form}
        onFinish={onFinish}
        onBlur={onFinish}
        onValuesChange={() => {
          setHasChange(true)
        }}
      >
        <Row gutter={20}>
          <Col xs={24} sm={24} md={16}>
            <Collapse className="main-1-collapse border-none" expandIcon={({ isActive }) => (isActive ? <span className="ant-menu-submenu-arrow" style={{ color: "#FFF", transform: "rotate(270deg)" }}></span> : <span className="ant-menu-submenu-arrow" style={{ color: "#FFF", transform: "rotate(90deg)" }}></span>)} defaultActiveKey={["1"]} expandIconPosition="start">
              <Collapse.Panel header="LOGIN INFORMATION" key="1" className="accordion bg-darkgray-form m-b-md border bgcolor-1 white">
                <Row gutter={8}>
                  <Col xs={24} sm={24} md={24}>
                    <Form.Item name="username">
                      <FloatInput label="Username" placeholder="Username" readOnly />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={24}>
                    <Button type="link" className="color-6 m-l-n" onClick={() => setToggleModalFormChangePassword(true)}>
                      Change Password
                    </Button>
                  </Col>
                  {role() !== "Admin" ? (
                    <Col xs={24} sm={24} md={24}>
                      <div>
                        <Link to={"/2fa"} className="link2factor">
                          {" "}
                          CLICK HERE
                        </Link>{" "}
                        to {authText} 2-Factor Authentication (2FA)
                      </div>
                    </Col>
                  ) : null}
                </Row>
              </Collapse.Panel>
            </Collapse>

            <Collapse className="main-1-collapse border-none" expandIcon={({ isActive }) => (isActive ? <span className="ant-menu-submenu-arrow" style={{ color: "#FFF", transform: "rotate(270deg)" }}></span> : <span className="ant-menu-submenu-arrow" style={{ color: "#FFF", transform: "rotate(90deg)" }}></span>)} defaultActiveKey={["1"]} expandIconPosition="start">
              <Collapse.Panel header="PERSONAL INFORMATION" key="1" className="accordion bg-darkgray-form m-b-md border ">
                <Row gutter={12}>
                  <Col xs={24} sm={24} md={12}>
                    <Form.Item name="firstname">
                      <FloatInput label="First Name" placeholder="First Name" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={12}>
                    <Form.Item name="lastname">
                      <FloatInput label="Last Name" placeholder="Last Name" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={12}>
                    <Form.Item name="email">
                      <FloatInput label="email" placeholder="email" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={12}>
                    <Form.Item name="phone">
                      <FloatInput label="Cell Phone" placeholder="Cell Phone" />
                    </Form.Item>
                  </Col>
                  {role() === "Admin" ? (
                    <Col xs={24} sm={24} md={24} className="m-b-md">
                      <Button type="link" onClick={() => setToggleModalForm2FactorAuthentication(true)}>
                        <span className="color-6 m-r-xs m-l-n">CLICK HERE</span> <span className="color-7">to enable 2-Factor Authetication (2FA)</span>
                      </Button>
                    </Col>
                  ) : null}
                  <Col xs={24} sm={24} md={12}>
                    <Form.Item name="email_alternative">
                      <FloatInput label="Email Address (Alternative)" placeholder="Email Address (Alternative)" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={12}>
                    <Form.Item name="referred_by">
                      <FloatInput label="Reffered by" placeholder="Reffered by" />
                    </Form.Item>
                  </Col>
                </Row>
              </Collapse.Panel>
            </Collapse>

            {role() !== "Cancer Caregiver" ? (
              <Collapse className="main-1-collapse border-none" expandIcon={({ isActive }) => (isActive ? <span className="ant-menu-submenu-arrow" style={{ color: "#FFF", transform: "rotate(270deg)" }}></span> : <span className="ant-menu-submenu-arrow" style={{ color: "#FFF", transform: "rotate(90deg)" }}></span>)} defaultActiveKey={["1"]} expandIconPosition="start">
                <Collapse.Panel header="PERSONAL INFORMATION" key="1" className="accordion bg-darkgray-form m-b-md border ">
                  <Row gutter={8}>
                    {/* <Col xs={24} sm={24} md={24}>
                      <Form.Item name="company_name">
                        <FloatInput
                          label="Company Name"
                          placeholder="Company Name"
                        />
                      </Form.Item>
                    </Col> */}
                    {/* <Col xs={24} sm={24} md={24}>
                      <Form.Item name="country">
                        <FloatSelect
                          label="Country"
                          placeholder="Country"
                          options={optionCountryCodes}
                          onChange={handleCountry}
                        />
                      </Form.Item>
                    </Col> */}
                    <Col xs={24} sm={24} md={12}>
                      <Form.Item name="address1">
                        <FloatInput label="Address " placeholder="Address" />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={24} md={12}>
                      <Form.Item name="address2">
                        <FloatInput label="Address 2" placeholder="Address 2" />
                      </Form.Item>
                    </Col>
                    {/* <Col xs={24} sm={24} md={12}>
                      <Form.Item name="address2">
                        <FloatInput label="Address 2" placeholder="Address 2" />
                      </Form.Item>
                    </Col> */}
                    <Col xs={24} sm={24} md={8}>
                      <Form.Item name="city">
                        <FloatInput label="City" placeholder="City" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={8}>
                      <Form.Item name="state">
                        <FloatSelect label={stateLabel} placeholder={stateLabel} options={optionState} />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={8}>
                      <Form.Item
                        name="zip"
                        hasFeedback
                        className="w-100"
                        rules={[
                          {
                            required: true,
                            message: "This field is required.",
                          },
                          {
                            pattern: optionZip,
                            message: "Invalid Zip Code",
                          },
                        ]}
                      >
                        <FloatInput label={zipLabel} placeholder={zipLabel} />
                      </Form.Item>
                    </Col>
                    {/* <Col xs={24} sm={24} md={12}>
                      <Form.Item name="business_phone">
                        <FloatInput
                          label="Business Phone"
                          placeholder="Business Phone"
                        />
                      </Form.Item>
                    </Col> */}
                  </Row>
                </Collapse.Panel>
              </Collapse>
            ) : null}
          </Col>

          <Col xs={24} sm={24} md={8}>
            <Collapse className="main-1-collapse border-none" expandIcon={({ isActive }) => (isActive ? <span className="ant-menu-submenu-arrow" style={{ color: "#FFF", transform: "rotate(270deg)" }}></span> : <span className="ant-menu-submenu-arrow" style={{ color: "#FFF", transform: "rotate(90deg)" }}></span>)} defaultActiveKey={["1"]} expandIconPosition="start">
              <Collapse.Panel header="PROFILE PHOTO" key="1" className="accordion bg-darkgray-form m-b-md border ">
                <Row gutter={12}>
                  <Col xs={24} sm={24} md={24}>
                    <label className="font-red">
                      <b>Photo upload & cropping: select your image orientation</b>
                    </label>
                    <br />
                    <Radio.Group onChange={handleResize} value={radioData}>
                      <Radio value={1}>Square</Radio>
                      <Radio value={2}>Rectangle</Radio>
                      <Radio value={3}>Portrait</Radio>
                    </Radio.Group>
                  </Col>
                  <Divider />
                  <Col xs={24} sm={24} md={24}>
                    <div className="flex">
                      <ImgCrop rotate aspect={imageCrop.width / imageCrop.height}>
                        <Upload
                          // action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                          listType="picture-card"
                          style={{ width: "200px" }}
                          maxCount={1}
                          action={false}
                          customRequest={false}
                          fileList={fileList}
                          onChange={onChangeUpload}
                          onPreview={onPreviewUpload}
                          beforeUpload={beforeUpload}
                          className="profilePhoto"
                        >
                          {fileList.length < 1 && "+ Upload"}
                        </Upload>
                      </ImgCrop>
                    </div>
                  </Col>
                  <Divider />
                  <Col xs={24} sm={24} md={24}>
                    <Typography.Text>
                      One file only. 10 MB limit.
                      <br />
                      You selected profile photo will be visible to all users.
                    </Typography.Text>
                    <br />

                    <Typography.Text className="color-secondary">Allowed types png, gif, jpeg.</Typography.Text>
                  </Col>
                </Row>
              </Collapse.Panel>
            </Collapse>

            {role() !== "Admin" ? (
              <>
                <Collapse className="main-1-collapse border-none" expandIcon={({ isActive }) => (isActive ? <span className="ant-menu-submenu-arrow" style={{ color: "#FFF", transform: "rotate(270deg)" }}></span> : <span className="ant-menu-submenu-arrow" style={{ color: "#FFF", transform: "rotate(90deg)" }}></span>)} defaultActiveKey={["1"]} expandIconPosition="start">
                  <Collapse.Panel header="DEACTIVATE ACCOUNT" key="1" className="accordion bg-darkgray-form m-b-md border">
                    <Row gutter={[12, 20]}>
                      <Col xs={24} sm={24} md={24}>
                        <Typography.Text>No longer need your account and want to deactivate it?</Typography.Text>
                      </Col>
                      <Col xs={24} sm={24} md={24}>
                        <div className="flex gap10">
                          <div>
                            <Checkbox onChange={handleCheckboxDeactivateAccount} />
                          </div>
                          <div>
                            <Typography.Text>Yes I understand that by deactivating my account I will no longer have access to my account information and all historical data.</Typography.Text>
                          </div>
                        </div>
                      </Col>
                      <Col xs={24} sm={24} md={24}>
                        <Button
                          // className="btn-main-invert-outline-active b-r-none w-100"
                          className="btn-main-invert-outline-active b-r-none w-100"
                          size="large"
                          disabled={statusDeactivateAcc}
                          onClick={handleClickDeactivateAcc}
                        >
                          DEACTIVATE MY ACCOUNT
                        </Button>
                      </Col>
                    </Row>
                  </Collapse.Panel>
                </Collapse>
              </>
            ) : (
              <Collapse className="main-1-collapse border-none" expandIcon={({ isActive }) => (isActive ? <span className="ant-menu-submenu-arrow" style={{ color: "#FFF", transform: "rotate(270deg)" }}></span> : <span className="ant-menu-submenu-arrow" style={{ color: "#FFF", transform: "rotate(90deg)" }}></span>)} defaultActiveKey={["1"]} expandIconPosition="start">
                <Collapse.Panel header="CREATE SIGNATURE" key="1" className="accordion bg-darkgray-form m-b-md border ">
                  <Row>
                    <Col xs={24} sm={24} md={24}>
                      <Typography.Text strong className="color-15">
                        To create a free digital signature, follow steps below.
                      </Typography.Text>
                      <br />
                      <Typography.Text strong className="m-r-xs color-15">
                        Step 1:
                      </Typography.Text>
                      <Typography.Text className="color-7">Draw Signature</Typography.Text>
                      <br />
                      <Typography.Text strong className="m-r-xs color-15">
                        Step 2:
                      </Typography.Text>
                      <Typography.Text className="color-7">Save png</Typography.Text>
                    </Col>
                    <Col xs={24} sm={24} md={24}>
                      <div className="m-t-md m-b-md">
                        <SignatureCanvas
                          penColor="#000000"
                          canvasProps={{
                            width: 500,
                            height: 200,
                            className: "e_signature_canvas",
                          }}
                          ref={(ref) => setSignature(ref)}
                        />
                      </div>
                    </Col>
                    <Col xs={24} sm={24} md={24}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                        className="m-b-md"
                      >
                        <Typography.Text strong className="color-9">
                          Make this the default signature
                        </Typography.Text>
                        <div>
                          <Switch className="bgcolor-13" defaultChecked onChange={onChangeSwitch} />
                        </div>
                      </div>
                    </Col>
                    <Col xs={24} sm={24} md={24}>
                      <Button className="btn-main-invert-outline-active b-r-none m-r-sm" size="large">
                        CLEAR
                      </Button>
                      <Button className="btn-main-invert b-r-none" size="large">
                        SAVE
                      </Button>
                    </Col>
                  </Row>
                </Collapse.Panel>
              </Collapse>
            )}
          </Col>
        </Row>
      </Form>

      <ModalDeactivateAcc toggleModalDeactivateAcc={toggleModalDeactivateAcc} setToggleModalDeactivateAcc={setToggleModalDeactivateAcc} />

      <ModaFormChangePassword toggleModalFormChangePassword={toggleModalFormChangePassword} setToggleModalFormChangePassword={setToggleModalFormChangePassword} />
      <ModaForm2FactorAuthentication toggleModalForm2FactorAuthentication={toggleModalForm2FactorAuthentication} setToggleModalForm2FactorAuthentication={setToggleModalForm2FactorAuthentication} />
    </Card>
  )
}
