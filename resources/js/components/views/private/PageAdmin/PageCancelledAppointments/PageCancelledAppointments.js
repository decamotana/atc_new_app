import React, { useState, useEffect } from "react"
import { Layout, Button, Row, Col, Table, Pagination, Modal, Form, Space, notification, Card } from "antd"
import { PlusOutlined, TableOutlined, EditOutlined, SendOutlined } from "@ant-design/icons"
import $ from "jquery"
import { useHistory } from "react-router-dom"
import FloatSelect from "../../../../providers/FloatSelect"
import FloatInput from "../../../../providers/FloatInput"
import { GET, POST } from "../../../../providers/useAxiosQuery"
import FloatTextArea from "../../../../providers/FloatTextArea"
import { faLightbulbOn, faPaperPlane } from "@fortawesome/pro-regular-svg-icons"
import { TableGlobalSearch, TablePageSize, TablePagination, TableShowingEntries } from "../../Components/ComponentTableFilter"
import ModalCancelledAppointment from "../../../../layouts/private/Components/ModalCancelledAppointment"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

export default function PageNotification({ match, permission, title }) {
  const sub_title = "View All"
  const history = useHistory()
  const [bookingDetails, setBookingDetails] = useState()
  // const [form] = Form.useForm();

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
  } = GET(`api/v1/appointment/cancelled_booking?${$.param(tableFilter)}`, `notification`, (res) => {
    if (res.success) {
      console.log("notification", res.data.data)

      res.data.data.map((details) => {
        details.client_fullname = details.client.firstname + " " + details.client.lastname
        details.consultant_fullname = details.user.firstname + " " + details.user.lastname

        return details
      })

      console.log("new", res.data.data)

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
    // form.resetFields();
  }

  const onFinishForm = (values) => {
    let data = {
      ...values,
      user_id: memberOption && memberOption.id,
      old_type: oldData && oldData.old_type,
      // old_search_for: oldData && oldData.old_search_for,
    }
    console.log("onFinishForm", data)
    mutateCancelledAppoinments(data, {
      onSuccess: (res) => {
        if (res.success) {
          console.log("data", res)
          //     notification.success({
          //       message: "Success",
          //       description: "Successfully submited",
          //     });
          //     form.resetFields();
          //     setMemberOption([]);
          //     setSearchFor("");
          //     setShowModalNew(false);
        }
      },
    })
  }

  const { mutate: mutateCancelledAppoinments, isLoading: isLoadingCancelledAppoinments } = POST("api/v1/appointment/cancelled_booking", "cancelled_appoinemnt")

  const [oldData, setOldData] = useState()

  const handleEdit = (record) => {
    setBookingDetails(record)
    console.log("record", record)
    let type = record.search_for === "User" ? JSON.parse(record.type) : record.type
    // form.setFieldsValue({
    //   id: record.id,
    //   title: record.title,
    //   type: type,
    //   search_for: record.search_for,
    //   description: record.description,
    // });
    setSearchFor(record.search_for)
    setBookingDetails(record)
    setShowModalNew(true)
    setOldData({
      old_type: type,
      old_search_for: type,
    })
    if (record.search_for === "User") {
      setMemberOption({ id: record.user_notification[0].user_id })
    }
  }

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
            row.lastname
          arr.push({
            value: row.id,
            label: val,
            json: row,
          })
        })
      setmember(arr)
    }
  })

  const [searchFor, setSearchFor] = useState()
  const handleSearchFor = (val, opt) => {
    // console.log("handleSearchFor", opt);
    setSearchFor(val)
    setMemberOption([])
    // form.resetFields(["type"]);
  }

  const [memberOption, setMemberOption] = useState([])
  const handleMember = (val, opt) => {
    console.log("handleSearchFor", opt)
    setMemberOption(opt["data-json"])
  }

  return (
    <>
      <Card className="card-min-height card--padding-mobile" id="PageFaqs">
        {/* <br></br>
        <Row>
          <Col md={8} xs={0}>
            <Button
              size="large"
              className="btn-primary"
              style={{ width: 200 }}
              icon={<PlusOutlined />}
              htmlType="submit"
              onClick={(e) => setShowModalNew(true)}
            >
              Add Notification
            </Button>
          </Col>
        </Row>
        <br></br> */}
        <Row gutter={12} className="m-b-sm">
          <Col xs={24} sm={24} md={16} lg={16} xl={18} className="m-b-sm">
            <Space>
              <TablePageSize paginationFilter={tableFilter} setPaginationFilter={setTableFilter} />
            </Space>
          </Col>
          <Col xs={24} sm={24} md={8} lg={8} xl={6}>
            <TableGlobalSearch paginationFilter={searchText} setPaginationFilter={setSearchText} />
          </Col>
        </Row>

        <Table className="ant-table-default ant-table-striped" rowKey={(record) => record.id} loading={isLoadingTickets} dataSource={dataSource} pagination={false} scroll={{ x: "max-content" }}>
          <Table.Column key="client" title="Client" dataIndex="client_fullname" sorter={(a, b) => a.client.firstname?.localeCompare(b.client.firstname)} />
          <Table.Column key="Consultant" title="Consultant" dataIndex="consultant_fullname" sorter={(a, b) => a.user.firstname?.localeCompare(b.user.firstname)} />
          <Table.Column key="schedule_date" title="Schedule Date" dataIndex="schedule_date" sorter={(a, b) => a.schedule_date?.localeCompare(b.schedule_date)} />
          <Table.Column key="time_start" title="Time start" dataIndex="time_start" sorter={(a, b) => a.time_start?.localeCompare(b.time_start)} />
          <Table.Column key="time_end" title="Time end" dataIndex="time_end" sorter={(a, b) => a.time_end?.localeCompare(b.time_end)} />
          <Table.Column key="cancelled_at" title="Date Cancelled" dataIndex="cancelled_at" defaultSortOrder="descend" sorter={(a, b) => a.cancelled_at?.localeCompare(b.cancelled_at)} />
          <Table.Column
            key="action"
            title="Send Bulk Email Notification"
            width={250}
            align="left"
            render={(text, record) => {
              return (
                <Space style={{ display: "flex", justifyContent: "left" }}>
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
                    <FontAwesomeIcon icon={faPaperPlane} />
                  </Button>
                </Space>
              )
            }}
          />
        </Table>

        <div className="ant-space-flex-space-between the-pagination the-pagination--cancelled-appointments">
          <TableShowingEntries />
          <TablePagination paginationFilter={tableFilter} setPaginationFilter={setTableFilter} setPaginationTotal={tableTotal} showLessItems={true} showSizeChanger={false} />
        </div>
      </Card>

      <ModalCancelledAppointment setShowModal={setShowModalNew} showModal={showModalNew} bookingDetails={bookingDetails} setBookingDetails={setBookingDetails} />
    </>
  )
}
