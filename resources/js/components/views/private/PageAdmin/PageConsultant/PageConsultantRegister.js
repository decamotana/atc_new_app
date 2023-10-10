import React, { useEffect, useState } from "react"
import { useHistory, useParams } from "react-router-dom"
import { Form, Col, Card, Row, Collapse, Typography, Divider, Button, Table, Alert, notification } from "antd"
import FloatInputMask from "../../../../providers/FloatInputMask"
import FloatDatePicker from "../../../../providers/FloatDatePicker"

import FloatInput from "../../../../providers/FloatInput"
import optionCountryCodes from "../../../../providers/optionCountryCodes"
import FloatSelect from "../../../../providers/FloatSelect"

import optionStateCodesUnitedState from "../../../../providers/optionStateCodesUnitedState"
import optionStateCodesCanada from "../../../../providers/optionStateCodesCanada"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlus } from "@fortawesome/pro-solid-svg-icons"
import { GET, POST } from "../../../../providers/useAxiosQuery"

import { TablePageSize, TableGlobalSearch, TableShowingEntries, TablePagination } from "../../Components/ComponentTableFilter"
import { data } from "jquery"
import ModalAddTask from "../../Components/ModalAddTask"

function PageUserForm() {
  // const history = useHistory();
  const { id } = useParams()
  const [user, setUsersData] = useState([])
  const [form] = Form.useForm()

  GET(`api/v1/users/${id}`, "show", (res) => {
    if (res.success) {
      setUsersData(res.data)
      console.log("user", user.firstname)
    }
  })

  const [tableFilter, setTableFilter] = useState({
    page: 1,
    page_size: 50,
    search: "",
    sort_field: "id",
    sort_order: "desc",
  })

  const [tableTotal, setTableTotal] = useState(0)
  const [dataSource, setDataSource] = useState([])
  const { refetch: refetchTable } = GET(
    //	`api/v1/users?${$.param(tableFilter)}`,
    "users",
    (res) => {
      if (res.success) {
        console.log("dataTable", res)
        setDataSource(res.data && res.data.data)
        setTableTotal(res.data.total)
      }
    }
  )

  const stateUS = optionStateCodesUnitedState()
  const stateCA = optionStateCodesCanada()

  const [optionState, setOptionState] = useState([])
  const [stateLabel, setStateLabel] = useState("State")
  const [optionZip, setOptionZip] = useState()
  const [zipLabel, setZipLabel] = useState("Zip Code")

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
  }

  const handleTableChange = (pagination, filters, sorter) => {
    setTableFilter({
      ...tableFilter,
      sort_field: sorter.columnKey,
      sort_order: sorter.order ? sorter.order.replace("end", "") : null,
      page_number: 1,
    })
  }

  const [toggleModal, setToggleModal] = useState(false)
  const { mutate: mutateRegister, isLoading: isLoadingRegister } = POST("api/v1/user/consultant_register", "register")

  useEffect(() => {
    setOptionState(stateUS)
    setStateLabel("State")
    setOptionZip(/(^\d{5}$)|(^\d{5}-\d{4}$)/)
    setZipLabel("Zip Code")
  }, [])

  const [completePurchaseErr, setCompletePurchaseErr] = useState({
    type: "",
    message: "",
  })

  const onFinishInfomation = (values) => {
    let data = {
      ...values,
      link_origin: window.location.origin,
      role: "Consultant",
    }

    mutateRegister(data, {
      onSuccess: (res) => {
        if (res.success) {
          notification.success({
            message: "Success",
            description: " An Email has been sent to consultant for password setup ",
          })
          form.resetFields()
        } else {
          setCompletePurchaseErr({
            type: "error",
            message: res.message,
          })
        }
      },
      onError: (err) => {
        // console.log(err.response.data);
        setCompletePurchaseErr({
          type: "error",
          message: err.response.data.message,
        })
      },
    })
  }

  return (
    <Card className="card--padding-mobile">
      <Collapse className="main-4-collapse border-none register-consultant-collapse" defaultActiveKey={["1"]} expandIcon={({ isActive }) => <FontAwesomeIcon icon={faPlus} style={{ color: "#325db8", fontSize: 18 }} />} expandIconPosition="end">
        <Collapse.Panel
          header={
            <div className="flex">
              <div style={{ width: "300 px" }}>Consultant Information</div>
            </div>
          }
          key="1"
          className="accordion bg-darkgray-form m-b-md  white"
        >
          <Form autoComplete="off" form={form} onFinish={onFinishInfomation} className="consultant-register">
            <Row gutter={24}>
              <Col xs={24} sm={24} md={24} lg={12}>
                <Form.Item
                  name="firstname"
                  //className="m-t-sm"
                  hasFeedback
                  rules={[
                    {
                      required: true,
                      message: "This field is required.",
                    },
                  ]}
                >
                  <FloatInput label="First Name" placeholder="First Name" />
                </Form.Item>
              </Col>

              <Col xs={24} sm={24} md={24} lg={12}>
                <Form.Item
                  name="lastname"
                  hasFeedback
                  rules={[
                    {
                      required: true,
                      message: "This field is required.",
                    },
                  ]}
                >
                  <FloatInput label="Last Name" placeholder="Last Name" />
                </Form.Item>
              </Col>

              <Col xs={24} sm={24} md={24} lg={12}>
                <Form.Item
                  name="username"
                  hasFeedback
                  rules={[
                    {
                      required: true,
                      message: "This field is required.",
                    },

                    ({ getFieldValue }) => ({
                      validator(_, value = "") {
                        if (!value.toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
                          return Promise.resolve()
                        }
                        return Promise.reject(new Error("Invalid username format!"))
                      },
                    }),
                  ]}
                >
                  <FloatInput label="Username" placeholder="Username" />
                </Form.Item>
              </Col>

              <Col xs={24} sm={24} md={24} lg={12}>
                <Form.Item name="phone">
                  <FloatInputMask label="Phone" placeholder="Phone" maskLabel="phone" maskType="999 999 9999" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={24} lg={12}>
                <Form.Item name="dateOfBirth">
                  <FloatDatePicker label="Date of Birth" placeholder="Date of Birth" />
                </Form.Item>
              </Col>

              <Col xs={24} sm={24} md={24} lg={12}>
                <Form.Item
                  name="email"
                  hasFeedback
                  rules={[
                    {
                      type: "email",
                      message: "The input is not valid email!",
                    },
                    {
                      required: true,
                      message: "Please input your email!",
                    },
                  ]}
                >
                  <FloatInput label="Email" placeholder="Email" />
                </Form.Item>
              </Col>

              <Col xs={24} sm={24} md={24} lg={12}>
                <Form.Item
                  name="confirm_email"
                  hasFeedback
                  rules={[
                    {
                      required: true,
                      message: "This field is required.",
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("email") === value) {
                          return Promise.resolve()
                        }
                        return Promise.reject(new Error("The two emails that you entered do not match!"))
                      },
                    }),
                  ]}
                >
                  <FloatInput label="Confirm Email" placeholder="Confirm Email" />
                </Form.Item>
              </Col>

              <Col xs={24} sm={24} md={24} lg={12}>
                <Form.Item
                  name="ghl_calendar_id"
                  hasFeedback
                  rules={[
                    // {
                    //   message: "The input is not valid",
                    // },
                    {
                      required: true,
                      message: "Please input your GHL Calendar ID!",
                    },
                  ]}
                >
                  <FloatInput label="GHL Calendar ID" placeholder="GHL Calendar ID" />
                </Form.Item>
              </Col>

              <Col xs={24} sm={24} md={24} lg={12}>
                <Form.Item
                  name="address_1"
                  hasFeedback
                  rules={[
                    // {
                    //   message: "The input is not valid",
                    // },
                    {
                      required: true,
                      message: "Please input your address!",
                    },
                  ]}
                >
                  <FloatInput label="Address" placeholder="Address" />
                </Form.Item>
              </Col>

              <Col xs={24} sm={24} md={24} lg={12}>
                <Form.Item
                  name="city"
                  hasFeedback
                  rules={[
                    // {
                    //   message: "The input is not valid",
                    // },
                    {
                      required: true,
                      message: "Please input your city!",
                    },
                  ]}
                >
                  <FloatInput label="City" placeholder="City" />
                </Form.Item>
              </Col>

              <Col xs={24} sm={24} md={24} lg={12}>
                {/* 
                    <Form.Item
                      name="country"
                      hasFeedback
                      className="form-select-error"
                      rules={[
                        {
                          required: true,
                          message: "This field is required.",
                        },
                      ]}
                    >
                      <FloatSelect
                        label="Country"
                        placeholder="Country"
                        options={optionCountryCodes}
                        onChange={handleCountry}
                      />
                    </Form.Item> */}

                <Form.Item
                  name="state"
                  hasFeedback
                  className="form-select-error the-state"
                  rules={[
                    {
                      required: true,
                      message: "This field field is required.",
                    },
                  ]}
                >
                  <FloatSelect label={stateLabel} placeholder={stateLabel} options={optionState} />
                </Form.Item>
              </Col>

              <Col xs={24} sm={24} md={24} lg={12}>
                <Form.Item
                  name="zip_code"
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
                  {/* /   / <FloatInput label="Zip Code" placeholder="Zip Code" /> */}
                </Form.Item>
              </Col>
              <Col className="text-right" xs={24} sm={24} md={24}>
                <Button type="primary" htmlType="submit" className="btn-main btn-register-here" size="large" loading={isLoadingRegister}>
                  SUBMIT
                </Button>
              </Col>
            </Row>

            {/* <Form.Item
                      name="companyName"
                      hasFeedback
                      rules={[
                        // {
                        //   message: "The input is not valid",
                        // },
                        {
                          required: true,
                          message: "Please input your email!",
                        },
                      ]}
                    >
                      <FloatInput
                        label="Company Name"
                        placeholder="Company Name"
                      />
                    </Form.Item> */}

            {completePurchaseErr.message && <Alert className="m-t-sm m-b-sm" type={completePurchaseErr.type} message={completePurchaseErr.message} />}
          </Form>
        </Collapse.Panel>
      </Collapse>

      <ModalAddTask toggleModal={toggleModal} setToggleModal={setToggleModal} user={user} />
    </Card>
  )
}

export default PageUserForm
