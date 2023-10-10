import React, { useEffect, useState } from "react"
import { useHistory } from "react-router-dom"
import { Button, Card, Col, Collapse, Divider, Form, message, Radio, Row, Switch, Typography, Upload, notification } from "antd"
import ImgCrop from "antd-img-crop"
// import optionCountryCodes from "../../../../providers/optionCountryCodes"
import optionStateCodesUnitedState from "../../../../providers/optionStateCodesUnitedState"
import optionStateCodesCanada from "../../../../providers/optionStateCodesCanada"
import FloatInput from "../../../../providers/FloatInput"
import FloatSelect from "../../../../providers/FloatSelect"
import { apiUrl, role, userData, encrypt } from "../../../../providers/companyInfo"
import { GET, POST } from "../../../../providers/useAxiosQuery"
import ModalDeactivateAcc from "./Components/ModalDeactivateAcc"
import ModaFormChangePassword from "./Components/ModaFormChangePassword"
import ModaForm2FactorAuthentication from "./Components/ModaForm2FactorAuthentication"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlus } from "@fortawesome/pro-regular-svg-icons"

export default function PageProfile() {
  const history = useHistory()
  const [form] = Form.useForm()
  const [users, setUsersData] = useState([])
  const [authText, setAuthText] = useState("enable")

  useEffect(() => {
    if (users.length != 0) {
      let address = users.user_address ? users.user_address : null
      form.setFieldsValue({
        username: users.username,
        firstname: users.firstname,
        lastname: users.lastname,
        email: users.email,
        phone: users.phone,
        address1: address.address1 ? address.address1 : "",
        address2: address.address2 ? address.address2 : "",
        state: address.state ? users.user_address.state : "",
        city: address.city ? address.city : "",
        zip: address.zip_code ? address.zip_code : "",
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
        console.log("user", res.data)
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

  const { mutate: mutateUpdateUser } = POST("api/v1/users/update", "update_profile")

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
      title = users.firstname
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
    <Card className="page-admin-profile card--padding-mobile">
      <Form
        form={form}
        onFinish={onFinish}
        onBlur={() => {
          form
            .validateFields()
            .then((values) => {
              form.submit()
            })
            .catch((info) => {
              console.log("Validate Failed:", info)
            })
        }}
        onValuesChange={() => {
          setHasChange(true)
        }}
      >
        <Row gutter={20}>
          <Col xs={24} sm={24} md={24} lg={24} xl={16}>
            <Collapse className="main-1-collapse border-none" expandIcon={({ isActive }) => <FontAwesomeIcon icon={faPlus} style={{ color: "#325db8", fontSize: 18 }} />} defaultActiveKey={["1"]} expandIconPosition="end">
              <Collapse.Panel header="LOGIN INFORMATION" key="1" className="accordion bg-darkgray-form m-b-md white ">
                <Row gutter={8} className="profile-username" style={{ paddingTop: "8px" }}>
                  <Col xs={24} sm={24} md={24}>
                    <Form.Item name="username" required hasFeedback>
                      <FloatInput label="Username" placeholder="Username" readOnly />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={24}>
                    <Button type="link" className="light-blue-link m-l-n" onClick={() => setToggleModalFormChangePassword(true)}>
                      Change Password
                    </Button>
                  </Col>
                  {/* {role() !== "Admin" ? ( */}
                  <Col xs={24} sm={24} md={24}>
                    <div className="two-factor-text">
                      {/* <Link to={"/2fa"} className="link2factor">
                          {" "}
                          CLICK HERE
                        </Link>{" "} */}
                      <span className="enable-text ">{authText} 2-Factor Authentication (2FA) </span>
                      <Switch
                        size="small"
                        checked={users.google2fa_enable === 1 ? true : false}
                        onChange={() => {
                          history.push("/2fa")
                        }}
                      />
                    </div>
                  </Col>
                  {/* ) : null} */}
                </Row>
              </Collapse.Panel>
            </Collapse>

            <Collapse className="main-1-collapse border-none" expandIcon={({ isActive }) => <FontAwesomeIcon icon={faPlus} style={{ color: "#325db8", fontSize: 18 }} />} defaultActiveKey={["1"]} expandIconPosition="end">
              <Collapse.Panel header="PERSONAL INFORMATION" key="1" className="accordion bg-darkgray-form m-b-md ">
                <Row gutter={[12, 0]} className="personal-info-1" style={{ paddingTop: "8px" }}>
                  <Col xs={24} sm={24} md={12}>
                    <Form.Item name="firstname" rules={[{ required: true, message: "required!" }]} hasFeedback>
                      <FloatInput label="First Name" placeholder="First Name" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={12}>
                    <Form.Item name="lastname" rules={[{ required: true, message: "required!" }]} hasFeedback>
                      <FloatInput label="Last Name" placeholder="Last Name" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={12} className="email">
                    <Form.Item name="email" rules={[{ required: true, message: "required!" }]} hasFeedback>
                      <FloatInput label="Email" placeholder="Email" readOnly />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={12} className="phone">
                    <Form.Item name="phone" rules={[{ required: true, message: "required!" }]} hasFeedback>
                      <FloatInput label="Cell Phone" placeholder="Cell Phone" readOnly />
                    </Form.Item>
                  </Col>
                  {/* {role() === "Admin" ? (
                    <Col xs={24} sm={24} md={24} className="two-factor">
                      <Button
                        type="link"
                        onClick={() =>
                          setToggleModalForm2FactorAuthentication(true)
                        }
                      >
                        <span className="light-blue-link">CLICK HERE</span>{" "}
                        <span className="color-7">
                          to enable 2-Factor Authentication (2FA)
                        </span>
                      </Button>
                    </Col>
                  ) : null} */}
                </Row>
              </Collapse.Panel>
            </Collapse>

            <Collapse className="main-1-collapse border-none" expandIcon={({ isActive }) => <FontAwesomeIcon icon={faPlus} style={{ color: "#325db8", fontSize: 18 }} />} defaultActiveKey={["1"]} expandIconPosition="end">
              <Collapse.Panel header="ADDRESS INFORMATION" key="1" className="accordion bg-darkgray-form m-b-md ">
                <Row gutter={[12, 0]} className="personal-info-2" style={{ paddingTop: "8px" }}>
                  <Col xs={24} sm={24} md={12} className="address1">
                    <Form.Item name="address1" required hasFeedback>
                      <FloatInput label="Address " placeholder="Address" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={24} md={12} className="address2">
                    <Form.Item name="address2" hasFeedback>
                      <FloatInput label="Address 2" placeholder="Address 2" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={24} md={8} className="city">
                    <Form.Item name="city" rules={[{ required: true, message: "required!" }]} hasFeedback>
                      <FloatInput label="City" placeholder="City" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={8} className="state">
                    <Form.Item name="state">
                      <FloatSelect label={stateLabel} placeholder={stateLabel} options={optionState} />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={8} className="zip-code">
                    <Form.Item
                      name="zip"
                      hasFeedback
                      className="w-100"
                      rules={[
                        {
                          required: true,
                          message: "required!",
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
                </Row>
              </Collapse.Panel>
            </Collapse>
          </Col>

          <Col xs={24} sm={24} md={24} lg={24} xl={8}>
            <Collapse className="main-1-collapse border-none" expandIcon={({ isActive }) => <FontAwesomeIcon icon={faPlus} style={{ color: "#325db8", fontSize: 18 }} />} defaultActiveKey={["1"]} expandIconPosition="end">
              <Collapse.Panel header="PROFILE PHOTO" key="1" className="accordion bg-darkgray-form m-b-md ">
                <Row gutter={12}>
                  <Col xs={24} sm={24} md={24}>
                    <div className="font-red">
                      <b>Photo upload & cropping:</b>

                      <div>
                        <b>select your image orientation</b>
                      </div>
                    </div>
                    <Radio.Group onChange={handleResize} value={radioData}>
                      <Radio value={1}>Square</Radio>
                      <Radio value={2}>Rectangle</Radio>
                      <Radio value={3}>Portrait</Radio>
                    </Radio.Group>
                  </Col>
                  <Divider />
                  <Col xs={24} sm={24} md={24}>
                    <div className="flex">
                      <ImgCrop modalClassName="img-crop-modal" rotate aspect={imageCrop.width / imageCrop.height}>
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
                      2 MB limit. Allowed types png, gif, jpeg
                      <br /> Your selected profile photo will be visible to all users.
                    </Typography.Text>
                    <br />
                  </Col>
                </Row>
              </Collapse.Panel>
            </Collapse>
          </Col>
        </Row>
      </Form>

      <ModalDeactivateAcc toggleModalDeactivateAcc={toggleModalDeactivateAcc} setToggleModalDeactivateAcc={setToggleModalDeactivateAcc} />

      <ModaFormChangePassword toggleModalFormChangePassword={toggleModalFormChangePassword} setToggleModalFormChangePassword={setToggleModalFormChangePassword} />
      <ModaForm2FactorAuthentication toggleModalForm2FactorAuthentication={toggleModalForm2FactorAuthentication} setToggleModalForm2FactorAuthentication={setToggleModalForm2FactorAuthentication} />
    </Card>
  )
}
