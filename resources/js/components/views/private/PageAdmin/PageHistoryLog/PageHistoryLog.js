import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import {
  Card,
  Col,
  Row,
  Table,
  Button,
  Typography,
  notification,
  Modal,
  Dropdown,
  Menu,
} from "antd";
import {
  faArrowAltFromLeft,
  faUserCheck,
  faPencil,
  faUserSlash,
} from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import $ from "jquery";
import { GET, POST } from "../../../../providers/useAxiosQuery";
import { encrypt, role, userData } from "../../../../providers/companyInfo";
import {
  TablePageSize,
  TableGlobalSearch,
  TableShowingEntries,
  TablePagination,
} from "../../Components/ComponentTableFilter";
import MoadalAddConsultant from "../../Components/MoadalAddConsultant";
import { ExclamationCircleOutlined, SmileOutlined } from "@ant-design/icons";
import {
  faDownload,
  faEye,
  faTrashAlt,
} from "@fortawesome/pro-regular-svg-icons";
import moment from "moment";

export default function PageHistoryLog() {
  const [tableFilter, setTableFilter] = useState({
    page: 1,
    page_size: 10,
    search: "",
    sort_field: "timestamp",
    sort_order: "desc",
  });

  const [tableTotal, setTableTotal] = useState(0);
  const [dataSource, setDataSource] = useState([]);

  const { refetch: refetchTable } = GET(
    `api/v1/historylogs/get?${$.param(tableFilter)}`,
    "history_logs",
    (res) => {
      if (res.success) {
        setDataSource(res.data && res.data.data);
        setTableTotal(res.data.total);
      }
    }
  );

  const [searchText, setSearchText] = useState("");
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setTableFilter({
        ...tableFilter,
        search: searchText,
        page: 1,
      });
    }, 1500);
    return () => {
      clearTimeout(timeoutId);
    };
  }, [searchText]);

  useEffect(() => {
    refetchTable();
    return () => {};
  }, [tableFilter]);

  const handleTableChange = (pagination, filters, sorter) => {
    setTableFilter({
      ...tableFilter,
      sort_field: sorter.columnKey,
      sort_order: sorter.order ? sorter.order.replace("end", "") : null,
      page_number: 1,
    });
  };

  return (
    <Card className="admin-page-user card--padding-mobile">
      <Row gutter={[12, 12]}>
        {/* <Col xs={24} sm={24} md={24}>
          <Button
            size="large"
            className="btn-main-3 b-r-none"
            onClick={handleAddUser}
          >
            <FontAwesomeIcon icon={faPlus} className="m-r-sm" /> Add Contact
          </Button>
        </Col> */}
        <Col xs={24} sm={24} md={24}>
          <div className="ant-space-flex-space-between per-page-search">
            <div className="m-b-sm">
              <TablePageSize
                paginationFilter={tableFilter}
                setPaginationFilter={setTableFilter}
              />
            </div>
            <div>
              <TableGlobalSearch
                paginationFilter={searchText}
                setPaginationFilter={setSearchText}
              />
            </div>
          </div>
        </Col>
        <Col xs={24} sm={24} md={24}>
          <Table
            className="ant-table-default ant-table-striped"
            dataSource={dataSource && dataSource}
            rowKey={(record) => record.id}
            pagination={false}
            bordered={false}
            onChange={handleTableChange}
            scroll={{ x: "max-content" }}
          >
            <Table.Column
              title="Time stamp"
              // fixed={role() == "Admin" ? "left" : null}
              key="timestamp"
              dataIndex="timestamp"
              defaultSortOrder="descend"
              sorter={true}
              width={"130px"}
              // render={(text, record) => {
              //   return moment(text).format("YYYY-MM-DD h:mma");
              // }}
            />
            <Table.Column
              title="Subject Updated"
              key="page"
              dataIndex="page"
              sorter={true}
              width={"100px"}
            />
            <Table.Column
              title="History"
              key="subject"
              dataIndex="subject"
              width={"350px"}
              render={(text, record) => {
                return (
                  <text
                    dangerouslySetInnerHTML={{
                      __html: text,
                    }}
                  />
                );
              }}
            />
            <Table.Column
              title="Edited By"
              key="consultant"
              dataIndex="consultant"
              sorter={true}
              width={"100px"}
              // render={(text, record) => {
              //   return (
              //     <Typography.Text>
              //       {record.user.firstname + " " + record.user.lastname}
              //     </Typography.Text>
              //   );
              // }}
            />
          </Table>
        </Col>
        <Col xs={24} sm={24} md={24}>
          <div className="ant-space-flex-space-between the-pagination the-pagination--view-user">
            <TableShowingEntries />
            <TablePagination
              paginationFilter={tableFilter}
              setPaginationFilter={setTableFilter}
              setPaginationTotal={tableTotal}
              showLessItems={true}
              showSizeChanger={false}
            />
          </div>
        </Col>
        <Col xs={24} sm={24} md={24}></Col>
      </Row>
    </Card>
  );
}
