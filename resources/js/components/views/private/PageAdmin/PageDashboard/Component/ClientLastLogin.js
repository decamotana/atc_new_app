import { Col, Row, Table } from "antd"
import { userData } from "../../../../../providers/companyInfo"
import { GET } from "../../../../../providers/useAxiosQuery"
import React, { useEffect, useState } from "react"
import $ from "jquery"
import { TablePagination, TableShowingEntries } from "../../../Components/ComponentTableFilter"
export default function ClientLastLogin(props) {
  const { toggleModalFormChangePassword, setToggleModalFormChangePassword } = props

  const [tableDataSource, setTableDataSource] = useState([])

  const [tableFilter, setTableFilter] = useState({
    page: 1,
    page_size: 10,
    search: "",
    sort_order: "desc",
    status: [],
  })

  const [currentPage, setCurrentPage] = useState(1)
  const [currentSize, setCurrentSize] = useState(50)
  const [searchText, setSearchText] = useState("")

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

  const [tableTotal, setTableTotal] = useState(0)

  const { refetch: getClientLastLogin } = GET(`api/v1/clients_last_login?${$.param(tableFilter)}`, "client-last-login", (res) => {
    if (res.success) {
      console.log("client-last-login", res)
      setTableDataSource(res.data.data)
      setCurrentPage(res.data.currentPage)
      setTableTotal(res.data.total)
    }
  })

  useEffect(() => {
    getClientLastLogin()
    return () => {}
  }, [tableFilter])

  return (
    <Row gutter={[12, 12]}>
      <Col xs={24} md={24} sm={24} lg={24}>
        <Table className="ant-table-default ant-table-striped" rowKey={(record) => record.id} dataSource={tableDataSource} pagination={false} scroll={{ x: "max-content" }}>
          <Table.Column align="left" key="firstname" title="Firstname" dataIndex="firstname" sorter={(a, b) => a.firstname.localeCompare(b.firstname)} />
          <Table.Column key="lastname" title="Lastname" dataIndex="lastname" sorter={(a, b) => a.lastname.localeCompare(b.lastname)} />
          <Table.Column key="email" title="Email" dataIndex="email" sorter={(a, b) => a.email.localeCompare(b.email)} />
          <Table.Column key="phone" title="Phone" dataIndex="phone" sorter={(a, b) => a.phone.localeCompare(b.phone)} />
          <Table.Column key="last_login_dif" title="Client last login" dataIndex="last_login_dif" defaultSortOrder="descend" sorter={(a, b) => a.last_login.localeCompare(b.last_login)} />
        </Table>
        <div className="ant-space-flex-space-between the-pagination the-pagination--client-last-login">
          <TableShowingEntries />
          <TablePagination paginationFilter={tableFilter} setPaginationFilter={setTableFilter} setPaginationTotal={tableTotal} showLessItems={true} showSizeChanger={false} />
        </div>
      </Col>
    </Row>
  )
}
