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

export default function PageUser() {
  const history = useHistory();

  const [toggleModal, setToggleModal] = useState(false);
  const [userID, setUserID] = useState(0);

  const [tableFilter, setTableFilter] = useState({
    page: 1,
    page_size: 10,
    search: "",
    sort_field: "id",
    sort_order: "desc",
  });

  const [tableTotal, setTableTotal] = useState(0);
  const [dataSource, setDataSource] = useState([]);

  const { refetch: refetchTable } = GET(
    `api/v1/users?${$.param(tableFilter)}`,
    "users",
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

  const { mutate: mutateReactivateUser, isLoading: isLoadingReactivate } = POST(
    "api/v1/user/activate",
    "user-reactivate"
  );

  const { mutate: mutateDeactivateUser, isLoading: isLoadingDeactivate } = POST(
    "api/v1/user/deactivate",
    "user-deactivate"
  );

  const { mutate: mutateViewAs, isLoading: isLoadingViewAs } = POST(
    "api/v1/admin/viewas",
    "admin-viewas"
  );

  const handleViewAs = (userId) => {
    let data = {
      id: userId,
    };

    mutateViewAs(data, {
      onSuccess: (res) => {
        let useradmin = localStorage.getItem("userdata");

        localStorage.userdata = encrypt(res.data);
        localStorage.token = res.token;
        localStorage.userdata_admin = useradmin;
        localStorage.viewas = true;
        var url = window.location.origin;
        window.location.href = url;
      },
    });
  };

  const deactivateUser = (userId) => {
    let data = {
      user_id: userId,
    };

    mutateDeactivateUser(data, {
      onSuccess: (res) => {
        if (res.success) {
          refetchTable();
          notification.success({
            message: "Success",
            description: "User Successfully Deactivated",
          });
          // setToggleModal(false);
        }
      },
    });
  };

  const reactivateUser = (userId) => {
    let data = {
      user_id: userId,
    };

    mutateReactivateUser(data, {
      onSuccess: (res) => {
        if (res.success) {
          refetchTable();
          notification.success({
            message: "Success",
            description: "User Successfully Reactivated",
          });
          // setToggleModal(false);
        }
      },
    });
  };

  const { mutate: mutateAddConsultants, isLoading: isLoading } = POST(
    "api/v1/consultant/addconsultant",
    "addconsultant"
  );

  const removeConsultant = () => {
    let data = {
      user_id: userID,
      consultant: null,
    };

    mutateAddConsultants(data, {
      onSuccess: (res) => {
        if (res.success) {
          notification.success({
            message: "Success",
            description: "consultant successfully removed",
          });
          // setToggleModal(false);
          refetchTable();
        }
      },
    });
  };

  const handleTableChange = (pagination, filters, sorter) => {
    setTableFilter({
      ...tableFilter,
      sort_field: sorter.columnKey,
      sort_order: sorter.order ? sorter.order.replace("end", "") : null,
      page_number: 1,
    });
  };

  const handleAddUser = () => {
    // if (role() === "Admin") {
    // 	history.push("/ticketing/create");
    // } else {
    history.push("/user/adduser");
    // }
  };

  const confirm = () => {
    Modal.confirm({
      title: "Confirm",
      icon: <ExclamationCircleOutlined />,
      content: "Remove Consultant?",
      okText: "Yes",
      cancelText: "No",
      onOk: removeConsultant,
    });
  };

  const { mutate: mutateGenerateDownloadLink, isLoading: loadingDownloadLink } =
    POST("api/v1/admin/generate_client_mnda_link", "generate-link");

  const handleGenerateLink = (user_id) => {
    mutateGenerateDownloadLink(
      { user_id: user_id },
      {
        onSuccess: (res) => {
          window.open(res.downloadLink);
        },
      }
    );
  };

  useEffect(() => {
    refetchTable();
    return () => {};
  }, [refetchTable]);

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
              title="First Name"
              // fixed={role() == "Admin" ? "left" : null}
              key="firstname"
              dataIndex="firstname"
              defaultSortOrder="descend"
              sorter={true}
              width={"250px"}
              render={(text, record) => {
                return (
                  <Button
                    className="text-left"
                    onClick={() => {
                      history.push({
                        pathname: `/user/manageuser/${record.id}`,
                        state: {
                          username: record.firstname + " " + record.lastname,
                        },
                      });
                    }}
                    type="link"
                    block
                  >
                    {text}
                  </Button>
                );
              }}
            />
            <Table.Column
              title="Last Name"
              key="lastname"
              dataIndex="lastname"
              sorter={true}
              width={"180px"}
            />
            <Table.Column
              title="MNDA"
              key="mnda"
              dataIndex="mnda"
              width={"250px"}
              sorter={true}
              render={(text, record) => {
                return (
                  <>
                    {record.has_agreed_mnda ? (
                      <Button
                        type="link"
                        style={{ padding: "0px" }}
                        onClick={() => {
                          let data = {
                            user_id: record.id,
                          };

                          handleGenerateLink(record.id);
                        }}
                      >
                        <span style={{ alignItems: "center", display: "flex" }}>
                          <FontAwesomeIcon
                            icon={faDownload}
                            style={{ marginRight: "10px" }}
                          />
                          Download
                        </span>
                      </Button>
                    ) : (
                      "Not signed"
                    )}{" "}
                  </>
                );
              }}
            />
            <Table.Column
              title="Email"
              key="email"
              dataIndex="email"
              sorter={true}
              width={"100px"}
            />
            <Table.Column
              title="Phone"
              key="phone"
              dataIndex="phone"
              sorter={true}
              width={"200px"}
            />

            {role() == "Admin" ? (
              <>
                {" "}
                <Table.Column
                  title="Status"
                  key="status"
                  dataIndex="status"
                  sorter={true}
                  // width={"150px"}
                  render={(text, record) => {
                    return (
                      <>
                        <Dropdown
                          overlay={
                            <Menu>
                              {text === "Active" ? (
                                <Menu.Item
                                  label="label"
                                  onClick={() => {
                                    deactivateUser(record.id);
                                  }}
                                >
                                  <FontAwesomeIcon icon={faUserSlash} /> &nbsp;
                                  Deactivate Account
                                </Menu.Item>
                              ) : (
                                <Menu.Item
                                  label="label"
                                  onClick={() => {
                                    reactivateUser(record.id);
                                  }}
                                >
                                  <FontAwesomeIcon icon={faUserCheck} />
                                  &nbsp; Activate Account
                                </Menu.Item>
                              )}
                            </Menu>
                          }
                          // trigger={["contextMenu"]}
                        >
                          <Button className="text-left" type="link" block>
                            {text}
                          </Button>
                        </Dropdown>
                      </>
                    );
                  }}
                />
                {/* <Table.Column
                  title="Consultant"
                  key="action"
                  width={"200px"}
                  render={(text, record) => {
                    return (
                      <>
                  
                        {record && record.consultant ? (
                          <>
                            <Dropdown
                              overlay={
                                <Menu>
                                  <Menu.Item
                                    label="label"
                                    onClick={() => {
                                      setUserID(record.id);
                                      setToggleModal(true);
                                    }}
                                  >
                                    <FontAwesomeIcon icon={faPencil} />{" "}
                                    &nbsp;Edit Consultant
                                  </Menu.Item>
                                  <Menu.Item
                                    label="label"
                                    onClick={() => {
                                      setUserID(record.id);
                                      confirm();
                                    }}
                                  >
                                    <FontAwesomeIcon icon={faTrashAlt} />
                                    &nbsp; Remove Consultant
                                  </Menu.Item>
                                </Menu>
                              }
                              // trigger={["contextMenu"]}
                            >
                              <Button className="text-left" type="link" block>
                                {record &&
                                  record.consultant &&
                                  record.consultant.firstname}
                              </Button>
                            </Dropdown>
                          </>
                        ) : (
                          <Button
                            type="link"
                            onClick={() => {
                              setUserID(record.id);
                              setToggleModal(true);
                            }}
                            className="light-blue-link"
                          >
                            Assign a consultant
                          </Button>
                        )}
                      </>
                    );
                  }}
                /> */}
                <Table.Column
                  title="View as"
                  key="View as"
                  // dataIndex="status"
                  // sorter={true}
                  // width={"150px"}
                  render={(text, record) => {
                    return (
                      <Button
                        type="link"
                        className="light-blue-link"
                        onClick={() => {
                          handleViewAs(record.id);
                        }}
                        // style={{ maxWidth: "160px", minWidth: "160px" }}
                      >
                        <FontAwesomeIcon
                          icon={faEye}
                          style={{ marginRight: "5px" }}
                        />
                        {/* View as {record.firstname} */}
                      </Button>
                    );
                  }}
                />
              </>
            ) : (
              <>
                {" "}
                <Table.Column
                  title="Status"
                  key="status"
                  dataIndex="status"
                  sorter={true}
                  width={"150px"}
                />
              </>
            )}
          </Table>
        </Col>
        <Col xs={24} sm={24} md={24}>
          <div className="ant-space-flex-space-between the-pagination the-pagination--view-user">
            <TablePagination
              paginationFilter={tableFilter}
              setPaginationFilter={setTableFilter}
              setPaginationTotal={tableTotal}
              showLessItems={true}
              showSizeChanger={false}
            />
            <TableShowingEntries />
          </div>
        </Col>
        <Col xs={24} sm={24} md={24}></Col>
      </Row>
      <MoadalAddConsultant
        toggleModal={toggleModal}
        setToggleModal={setToggleModal}
        toggleRefetch={refetchTable}
        //   setSelectedDate={setSelectedDate}
        userID={userID}
      />
    </Card>
  );
}
