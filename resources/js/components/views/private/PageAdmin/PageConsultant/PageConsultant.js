import React, { useState, useEffect } from "react"
import { useHistory } from "react-router-dom"
import { Card, Col, Row, Table, Button, notification, Modal, Tooltip, Form } from "antd"
import { faArrowAltFromLeft, faPlus, faPencil, faTrashCan, faRotate, faFloppyDiskCircleArrowRight } from "@fortawesome/pro-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import $ from "jquery"
import { GET, POST } from "../../../../providers/useAxiosQuery"
import { key, role } from "../../../../providers/companyInfo"
import FloatSelect from "../../../../providers/FloatSelect2"
import { TablePageSize, TableGlobalSearch, TableShowingEntries, TablePagination } from "../../Components/ComponentTableFilter"
import { ExclamationCircleOutlined } from "@ant-design/icons"
import { faChevronDown, faDownload } from "@fortawesome/pro-regular-svg-icons"
import ModalAssignPassword from "../../Components/ModalAssignPassword"

export default function PageConsultant() {
  const history = useHistory()

  const [toggleModal, setToggleModal] = useState(false)
  const [appConsultant, setAppConsultant] = useState([])

  const [tableFilter, setTableFilter] = useState({
    page: 1,
    page_size: 50,
    search: "",
    sort_field: "id",
    sort_order: "desc",
  })

  const options = [
    {
      label: "Call 1",
      value: "call 1",
    },
    {
      label: "Call 2",
      value: "call 2",
    },
    {
      label: "Follow up",
      value: "follow up call (optional)",
    },
    {
      label: "Timeline",
      value: "timeline",
    },
    {
      label: "Pre publish",
      value: "pre-publish",
    },
    {
      label: "One Hour Update",
      value: "one hour update",
    },
    {
      label: "Pre interview",
      value: "pre-interview",
    },
  ]

  const [tableTotal, setTableTotal] = useState(0)
  const [dataSource, setDataSource] = useState([])
  const [consultantRole, setConsultantRole] = useState("")
  const [consultantID, setConsultantID] = useState(0)
  const [userId, setUserId] = useState(0)

  const { refetch: getConsultants } = GET(`api/v1/consultant/getrecord?${$.param(tableFilter)}`, "get_consultants", (res) => {
    if (res.success) {
      // console.log("dataTable", res);

      setDataSource(res.data.data)
      setTableTotal(res.data.total)
    }
  })

  const [searchText, setSearchText] = useState("")
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setTableFilter({
        ...tableFilter,
        search: searchText,
        page: 1,
      })
    }, 1500)
    return () => {
      clearTimeout(timeoutId)
    }
  }, [searchText])

  useEffect(() => {
    getConsultants()
    // console.log("tableFilter", tableFilter);
    return () => {}
  }, [tableFilter])

  const confirm = (role) => {
    Modal.confirm({
      title: "Confirm",
      icon: <ExclamationCircleOutlined />,
      content: "Change " + role + " role?",
      okText: "Yes",
      cancelText: "No",
      onOk: () => {
        changeConsultantRole()
      },
    })
  }

  const { mutate: mutateAssignConsultant, isLoading: isLoadingAssignConsultant } = POST("api/v1/consultant/changerole", "consultant_changerole")

  const assignConsultant = (id) => {
    let data = {
      role: consultantRole,
      id: id,
    }

    // console.log("data:", data);

    mutateAssignConsultant(data, {
      onSuccess: (res) => {
        if (res.success) {
          notification.success({
            message: "Success",
            description: "Role successfully changed ",
          })

          setConsultantID(0)
          setConsultantRole("")
          getConsultants()
        }
      },
    })
  }

  const { mutate: mutateAppConsultant, isLoading: isLoadingAppConsultant } = POST("api/v1/appointment/assign_consultant", "get_consultants")

  const handleAppConsultant = (id, value) => {
    let data = {
      assigned_app: value,
      id: id,
    }

    mutateAppConsultant(data, {
      onSuccess: (res) => {
        if (res.success) {
          notification.success({
            message: "Success",
            description: "Consultant was assigned on appointment successfuly  ",
          })
        }
      },
    })
  }

  const { mutate: mutateChangeRole, isLoading: isLoadingChangeRole } = POST("api/v1/consultant/changerole", "consultant_changerole")

  const changeConsultantRole = () => {
    let data = {
      role: consultantRole,
      id: consultantID,
    }

    mutateChangeRole(data, {
      onSuccess: (res) => {
        if (res.success) {
          notification.success({
            message: "Success",
            description: "Role successfully changed ",
          })

          setConsultantID(0)
          setConsultantRole("")
          getConsultants()
        }
      },
    })
  }

  const { mutate: mutateSync, isLoading: isLoadingCreate } = POST("api/v1/consultant/updaterecord", "consultant_sync")

  const handleTableChange = (pagination, filters, sorter) => {
    setTableFilter({
      ...tableFilter,
      sort_field: sorter.columnKey,
      sort_order: sorter.order ? sorter.order.replace("end", "") : null,
      page_number: 1,
    })
  }

  const handleSyncConsultants = () => {
    let data = { link_origin: window.location.origin }

    mutateSync(data, {
      onSuccess: (res) => {
        if (res.success) {
          // console.log("data-from-sync", res.data);
          notification.success({
            message: "Success",
            description: "Updated ",
          })

          getConsultants()
        }
      },
    })
  }

  useEffect(() => {
    if (consultantRole != "" && consultantID != 0) {
      confirm(consultantRole)
    }
  }, [consultantRole, consultantID])

  return (
    <Card className="card--padding-mobile page-consultant">
      <Row gutter={[12, 12]}>
        <Col xs={24} sm={24} md={24}>
          <Button
            size="large"
            className="atc-btn-opposite  b-r-none"
            onClick={() => {
              history.push({
                pathname: `/consultant/register`,
              })
            }}
          >
            <FontAwesomeIcon icon={faPlus} className="m-r-sm" /> Add Consultant
          </Button>
          {/* <Button
            size="large"
            className="btn-primary b-r-none m-l-md"
            onClick={handleSyncConsultants}
          >
            <FontAwesomeIcon icon={faDownload} className="m-r-sm" /> SYNC
            CONSULTANT
          </Button> */}
        </Col>
        <Col xs={24} sm={24} md={24}>
          <div className="ant-space-flex-space-between per-page-search per-page-search--m-t per-page-search--equal-space">
            <div className="the-selector">
              <TablePageSize paginationFilter={tableFilter} setPaginationFilter={setTableFilter} />
            </div>
            <div>
              <TableGlobalSearch paginationFilter={searchText} setPaginationFilter={setSearchText} />
            </div>
          </div>
        </Col>
        <Col xs={24} sm={24} md={24}>
          <Table className="ant-table-default ant-table-striped" dataSource={dataSource && dataSource} rowKey={(record) => record.id} pagination={false} bordered={false} onChange={handleTableChange} scroll={{ x: "max-content" }}>
            <Table.Column title="Firstname" key="firstname" align="left" dataIndex="firstname" defaultSortOrder="descend" sorter={true} width={"200px"} />

            <Table.Column title="Last Name" key="lastname" align="left" dataIndex="lastname" sorter={true} width={"200px"} />

            <Table.Column title="Role" key="role" align="left" dataIndex="role" sorter={true} width={"150px"} />

            <Table.Column
              title="View Schedule"
              key="schedule"
              dataIndex="id"
              align="center"
              render={(id) => {
                return (
                  <Button
                    type="link"
                    className="light-blue-link"
                    onClick={() => {
                      history.push({
                        pathname: `/consultant/schedule/${id}`,
                      })
                    }}
                  >
                    Schedule
                  </Button>
                )
              }}
            />

            <Table.Column
              title="Setup Password"
              key="setup_password"
              dataIndex="id"
              align="center"
              render={(record) => {
                return (
                  <Row style={{ display: "flex", alignItems: "center" }}>
                    <Col md={24}>
                      <Button
                        type="link"
                        className="light-blue-link"
                        onClick={() => {
                          setUserId(record)
                          setToggleModal(true)
                        }}
                      >
                        Setup Password
                      </Button>
                    </Col>
                  </Row>
                )
              }}
            />

            <Table.Column
              title="Consultants Assignments"
              key="appointment_assigned"
              dataIndex="id"
              align="left"
              render={(_, record) => {
                let initialValue = record.appointment_consultant[0] ? JSON.parse(record.appointment_consultant[0].appointment_call) : null
                return (
                  <Form>
                    <Row className="consultant-register-grid">
                      <Col>
                        <div className="consultant-register-assigned">
                          <Form.Item name="assignment">
                            <FloatSelect
                              label="Consultant for"
                              placeholder={
                                <>
                                  Assign <FontAwesomeIcon icon={faChevronDown} />
                                </>
                              }
                              multi="multiple"
                              options={options}
                              defaultValue={initialValue}
                              onChange={(value) => {
                                initialValue = value
                                handleAppConsultant(record.id, value)
                                //  setAppConsultant(value);
                              }}
                            />
                          </Form.Item>
                        </div>
                      </Col>
                      {/* <Col>
                        <Tooltip title="Assign Consultant" placement="top">
                          <Button
                            type="link"
                            className="light-blue-link"
                            onClick={() => {
                              handleAppConsultant(record.id);
                            }}
                          >
                            <FontAwesomeIcon
                              icon={faFloppyDiskCircleArrowRight}
                            />
                          </Button>
                        </Tooltip>
                      </Col> */}
                    </Row>
                  </Form>
                )
              }}
            />
          </Table>
        </Col>
        <Col xs={24} sm={24} md={24}>
          <div className="ant-space-flex-space-between the-pagination the-pagination--m-b">
            <TableShowingEntries />
            <TablePagination paginationFilter={tableFilter} setPaginationFilter={setTableFilter} setPaginationTotal={tableTotal} showLessItems={true} showSizeChanger={false} />
          </div>
        </Col>
        {/* <Col xs={24} sm={24} md={24}></Col> */}
      </Row>

      <ModalAssignPassword toggleModal={toggleModal} setToggleModal={setToggleModal} id={userId} />
    </Card>
  )
}
