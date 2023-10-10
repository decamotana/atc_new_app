import React, { useState, useEffect } from "react"
import { Layout, Button, Row, Col, Table, Pagination, Modal, Form, Space, notification, Card } from "antd"
import { PlusOutlined, TableOutlined, EditOutlined } from "@ant-design/icons"
import $ from "jquery"
import { useHistory } from "react-router-dom"
import FloatSelect from "../../../providers/FloatSelect"
import FloatInput from "../../../providers/FloatInput"
import { GET, POST } from "../../../providers/useAxiosQuery"
import FloatTextArea from "../../../providers/FloatTextArea"
import { faLightbulbOn, faPencil } from "@fortawesome/pro-regular-svg-icons"
import { TableGlobalSearch, TablePageSize, TablePagination, TableShowingEntries } from "../Components/ComponentTableFilter"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

export default function PageNotification({ match, permission, title }) {
  const sub_title = "View All"
  const history = useHistory()
  const [form] = Form.useForm()

  const [tableFilter, setTableFilter] = useState({
    page: 1,
    page_size: 50,
    search: "",
    sort_field: "id",
    sort_order: "desc",
    status: [],
  })

  const [currentPage, setCurrentPage] = useState(1)
  const [currentSize, setCurrentSize] = useState(50)
  const [searchText, setSearchText] = useState("")
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setTableFilter({
        ...tableFilter,
        search: searchText,
        page_number: 1,
      })
    }, 1500)
    return () => {
      clearTimeout(timeoutId)
    }
  }, [searchText])

  const [tableTotal, setTableTotal] = useState(0)
  const [dataSource, setDataSource] = useState([])
  const {
    data: dataTickets,
    refetch: refetchTickets,
    isLoading: isLoadingTickets,
    isFetching: isFetchingTickets,
  } = GET(`api/v1/notification?${$.param(tableFilter)}`, `notification`, (res) => {
    if (res.success) {
      console.log("notification", res)
      setDataSource(res.data.data)
      setTableTotal(res.data.total)
    }
  })

  useEffect(() => {
    refetchTickets()
    return () => {}
  }, [tableFilter])

  const onChange = (current, pageSize) => {
    setTableFilter({
      ...tableFilter,
      page_number: current,
      page_size: pageSize,
    })
    setCurrentSize(pageSize)
    setCurrentPage(current)
    // console.log("current", current);
    // console.log("pageSize", pageSize);
  }

  const [showModalNew, setShowModalNew] = useState(false)
  const handleCancel = () => {
    setShowModalNew(false)
    setSearchFor("")
    setMemberOption([])
    form.resetFields()
  }

  const onFinishForm = (values) => {
    let data = {
      ...values,
      user_id: memberOption && memberOption.id,
      old_type: oldData && oldData.old_type,
      // old_search_for: oldData && oldData.old_search_for,
    }
    console.log("onFinishForm", data)
    mutateNotification(data, {
      onSuccess: (res) => {
        if (res.success) {
          console.log(res)
          notification.success({
            message: "Success",
            description: "Successfully submited",
          })
          form.resetFields()
          setMemberOption([])
          setSearchFor("")
          setShowModalNew(false)
        }
      },
    })
  }

  const { mutate: mutateNotification, isLoading: isLoadingNotification } = POST("api/v1/notification", "notification")

  const [oldData, setOldData] = useState()
  const handleEdit = (record) => {
    console.log("record", record)
    let type = record.search_for === "User" ? JSON.parse(record.type) : record.type
    form.setFieldsValue({
      id: record.id,
      title: record.title,
      type: type,
      search_for: record.search_for,
      description: record.description,
    })
    setSearchFor(record.search_for)
    setShowModalNew(true)
    setOldData({
      old_type: type,
      old_search_for: type,
    })
    // if (record.search_for === "User") {
    //   setMemberOption({ id: record.user_notification[0].user_id });
    // }
  }

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
  ])

  const [company, setcompany] = useState([])
  // const {} = GET("api/v1/company_option", "company_option", (res) => {
  //   if (res.success) {
  //     // console.log("company_option", res);
  //     let arr = [];
  //     res.data &&
  //       res.data.map((row, index) => {
  //         arr.push({
  //           label: row.name,
  //           value: row.id,
  //         });
  //       });
  //     setcompany(arr);
  //   }
  // });

  const [member, setmember] = useState([])
  const {} = GET("api/v1/user_options", "user_options", (res) => {
    if (res.success) {
      console.log("user_options", res)
      let arr = []
      let con = []

      res.data &&
        res.data.map((row, index) => {
          let val = row.firstname + " " + row.lastname

          if (row.role == "Consultant") {
            con.push({
              value: row.id,
              label: val,
              json: row,
            })
          } else {
            arr.push({
              value: row.id,
              label: val,
              json: row,
            })
          }
        })
      setmember(arr)
      setConsultant(con)
    }
  })
  const [consultant, setConsultant] = useState([])

  const [searchFor, setSearchFor] = useState()
  const handleSearchFor = (val, opt) => {
    // console.log("handleSearchFor", opt);
    setSearchFor(val)
    setMemberOption([])
    form.resetFields(["type"])
  }

  const [memberOption, setMemberOption] = useState([])
  const handleMember = (val, opt) => {
    console.log("handleSearchFor", opt)
    setMemberOption(opt["data-json"])
  }

  return (
    <>
      <Card className="card-min-height card--padding-mobile" id="PageFaqs">
        <Row>
          <Col md={8} lg={6} xl={4} xs={24} sm={24}>
            <Button size="large" className="atc-btn-opposite btn-adm-main" style={{ minWidth: "220px" }} icon={<PlusOutlined />} htmlType="submit" onClick={(e) => setShowModalNew(true)}>
              Add Notification
            </Button>
          </Col>
        </Row>

        <Row gutter={12} className=" per-page-search-notification">
          <Col className="per-page-search-notification-input" xs={24} sm={24} md={16} lg={16} xl={18}>
            <TablePageSize paginationFilter={tableFilter} setPaginationFilter={setTableFilter} />
          </Col>
          <Col xs={24} sm={24} md={8} lg={8} xl={6}>
            <TableGlobalSearch paginationFilter={searchText} setPaginationFilter={setSearchText} />
          </Col>
        </Row>

        <Table className="ant-table-default ant-table-striped" rowKey={(record) => record.id} loading={isLoadingTickets} dataSource={dataSource} pagination={false} scroll={{ x: "max-content" }}>
          <Table.Column key="title" title="Title" dataIndex="title" defaultSortOrder="descend" sorter={(a, b) => a.title.localeCompare(b.title)} width={"500px"} />
          <Table.Column key="description" title="Description" dataIndex="description" sorter={(a, b) => a.description.localeCompare(b.description)} width={"500px"} />

          <Table.Column key="search_for" title="Type" dataIndex="search_for" sorter={(a, b) => a.search_for.localeCompare(b.search_for)} />
          <Table.Column key="created_str" title="Created" dataIndex="created_str" sorter={(a, b) => a.created_str.localeCompare(b.created_str)} />
          <Table.Column
            key="action"
            title="Edit"
            align="center"
            render={(text, record) => {
              return (
                <Space>
                  {/* <Button
                      size="small"
                      className="btn-primary"
                      icon={<EyeOutlined />}
                      onClick={(e) =>
                        history.push("/admin/account-types/view/" + record.id)
                      }
                    >
                      View
                    </Button> */}
                  <Button size="large" type="text" className="light-blue-link" onClick={(e) => handleEdit(record)}>
                    <FontAwesomeIcon icon={faPencil} />
                  </Button>
                </Space>
              )
            }}
          />
        </Table>

        <div className="ant-space-flex-space-between the-pagination the-pagination--notification">
          <TableShowingEntries />
          <TablePagination paginationFilter={tableFilter} setPaginationFilter={setTableFilter} setPaginationTotal={tableTotal} showLessItems={true} showSizeChanger={false} />
        </div>
      </Card>

      <Modal
        visible={showModalNew}
        className="modal-login modal-notif"
        title="NOTIFICATION FORM"
        okText="Submit"
        cancelText="Cancel"
        width={700}
        onCancel={handleCancel}
        footer={[
          <Space>
            <Button
              className="atc-btn-opposite"
              onClick={() => {
                form
                  .validateFields()
                  .then((values) => {
                    onFinishForm(values)
                  })
                  .catch((info) => {
                    console.log("Validate Failed:", info)
                  })
              }}
              loading={isLoadingNotification}
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
          // initialValues={{ search_for: "Role" }}
        >
          <Form.Item name="id" style={{ display: "none" }}>
            <FloatInput label="id" placeholder="id" />
          </Form.Item>
          <Row gutter={24}>
            <Col xs={24} sm={24} md={8} lg={8} xl={8} xxl={8}>
              <Form.Item name="search_for" rules={[{ required: true, message: "Required!" }]} className="form-select-error" hasFeedback>
                <FloatSelect
                  label="Search For"
                  placeholder="Search For"
                  onChange={handleSearchFor}
                  options={[
                    {
                      label: "Role",
                      value: "Role",
                    },
                    {
                      label: "Clients",
                      value: "Clients",
                    },
                    {
                      label: "Consultants",
                      value: "Consultants",
                    },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={16} lg={16} xl={16} xxl={16}>
              {searchFor === "Role" && (
                <Form.Item name="type" rules={[{ required: true, message: "Required!" }]} className="form-select-error" hasFeedback>
                  <FloatSelect label="Account Type" placeholder="Account Type" options={role} />
                </Form.Item>
              )}
              {searchFor === "Clients" && (
                <Form.Item name="type" rules={[{ required: true, message: "Required!" }]} className="form-select-error-multi" hasFeedback>
                  <FloatSelect label="Client" placeholder="Client" onChange={handleMember} options={member} multi="multiple" />
                </Form.Item>
              )}
              {searchFor === "Consultants" && (
                <Form.Item name="type" rules={[{ required: true, message: "Required!" }]} className="form-select-error-multi" hasFeedback>
                  <FloatSelect label="Consultant" placeholder="Consultant" onChange={handleMember} options={consultant} multi="multiple" />
                </Form.Item>
              )}
            </Col>
          </Row>
          <Form.Item name="title" rules={[{ required: true, message: "Required!" }]} hasFeedback>
            <FloatInput label="Title" placeholder="Title" />
          </Form.Item>
          <Form.Item name="description" rules={[{ required: true, message: "Required!" }]} hasFeedback>
            <FloatTextArea label="Description" placeholder="Description" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}
