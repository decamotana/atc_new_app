import React from "react";
import {
    Button,
    Card,
    Col,
    Form,
    Input,
    Layout,
    notification,
    Popconfirm,
    Row,
    Select,
    Space,
    Table,
} from "antd";
import {
    UserSwitchOutlined,
    EditFilled,
    CloseOutlined,
} from "@ant-design/icons";
import ComponentHeader from "../../Components/ComponentHeader";
import useAxiosQuery from "../../../../providers/useAxiosQuery";
import { useHistory } from "react-router-dom";
import moment from "moment";
const { Content } = Layout;

const PageCurrentUsers = ({ permission }) => {
    let history = useHistory();
    const [pageFiltersUser, setPageFiltersUser] = React.useState({
        currentPage: 1,
        search: "",
        sortField: "",
        sortOrder: "",
        pageSize: 50,
    });

    // for table
    const {
        data: dataUsers,
        isLoading: isLoadingTblUser,
        refetch: refetchUsers,
        isFetching: isFetchingTblUser,
    } = useAxiosQuery(
        "GET",
        `api/v1/user?status=Active&pagination=1&pageSize=${pageFiltersUser.pageSize}&page=${pageFiltersUser.currentPage}&search=${pageFiltersUser.search}&sort_field=${pageFiltersUser.sortField}&sort_order=${pageFiltersUser.sortOrder}`,
        "current_users_table"
    );

    React.useEffect(() => {
        refetchUsers();
        return () => {};
    }, [pageFiltersUser]);

    const { mutate: mutateUpdateUser, isLoading: isLoadingUpdateUser } =
        useAxiosQuery("UPDATE", "api/v1/user", [
            "pending_users_table",
            "current_users_table",
            "past_users_table",
            "denied_users_table",
        ]);

    const handleUpdateUser = (record, status) => {
        let data = { ...record, status: status };
        delete data.company;
        mutateUpdateUser(data, {
            onSuccess: (res) => {
                if (res.success) {
                    notification.success({
                        message: "User Successfully Deactivated",
                    });
                }
            },
        });
    };

    const handleTblChangeUser = (pagination, filters, sorter) => {
        setPageFiltersUser({
            ...pageFiltersUser,
            currentPage: pagination.current,
            sortField: sorter.field,
            sortOrder: sorter.order ? sorter.order : "",
            pageSize: pagination.pageSize,
        });
    };
    return (
        <Layout
            className="site-layout-background"
            style={{
                padding: "0px 0px 20px 0px",
                background: "#fff",
            }}
        >
            <ComponentHeader
                permission={permission}
                icon={<UserSwitchOutlined />}
            />
            <Layout.Content style={{ padding: 24 }}>
                <Row style={{ marginTop: 10, marginBottom: 10 }}>
                    <Col md={8} xs={24}>
                        <Input.Search
                            placeholder="Search User"
                            onPressEnter={(e) =>
                                setPageFiltersUser({
                                    ...pageFiltersUser,
                                    search: e.target.value,
                                })
                            }
                            onSearch={(e) =>
                                setPageFiltersUser({
                                    ...pageFiltersUser,
                                    search: e,
                                })
                            }
                        />
                    </Col>
                    <Col md={8} sm={0}></Col>
                    <Col md={8} sm={0}></Col>
                </Row>
                <div className="table-responsive">
                    <Table
                        dataSource={dataUsers && dataUsers.data.data}
                        loading={isLoadingTblUser || isFetchingTblUser}
                        rowKey={(record) => record.id}
                        onChange={handleTblChangeUser}
                        pagination={{
                            total: dataUsers ? dataUsers.data.total : 0,
                            pageSize: dataUsers ? dataUsers.data.per_page : 0,
                            showSizeChanger: true,
                        }}
                    >
                        <Table.Column
                            title="Name"
                            dataIndex="first_name"
                            key="first_name"
                            sorter={(a, b) => a.first_name - b.first_name}
                            render={(text, record) => {
                                return (
                                    <>
                                        {record.first_name} {record.last_name}
                                    </>
                                );
                            }}
                        />

                        <Table.Column
                            title="Company"
                            dataIndex="company"
                            key="company"
                            sorter={(a, b) => a.company - b.company}
                        />

                        <Table.Column
                            title="User Type"
                            key="role"
                            sorter={(a, b) => a.role - b.role}
                            render={(text, record) => {
                                return record.role;
                            }}
                        />
                        <Table.Column
                            title="Date Created"
                            key="created_at"
                            dataIndex="created_at"
                            sorter={(a, b) => a.created_at - b.created_at}
                            render={(text, record) => {
                                return moment(record.created_at).format(
                                    "MM/DD/YYYY"
                                );
                            }}
                        />

                        <Table.Column
                            align="center"
                            title="View/Edit"
                            key="action"
                            render={(text, record) => {
                                return <></>;
                            }}
                        />

                        <Table.Column
                            align="center"
                            title="Deactivate"
                            key="action"
                            render={(text, record) => {
                                return (
                                    <Space>
                                        <Button
                                            // type="primary"
                                            className="btn-primary m-r-sm"
                                            title="Edit"
                                            icon={<EditFilled />}
                                            onClick={(e) => {
                                                history.push(
                                                    "/users/edit-user/" +
                                                        record.id
                                                );
                                            }}
                                        ></Button>
                                        <Popconfirm
                                            title="Are you sure you want to deactivate this User?"
                                            okText="Yes"
                                            cancelText="No"
                                            onConfirm={(e) =>
                                                handleUpdateUser(record, "Past")
                                            }
                                        >
                                            <Button
                                                className="btn-danger"
                                                loading={isLoadingUpdateUser}
                                                type="primary"
                                                icon={<CloseOutlined />}
                                            ></Button>
                                        </Popconfirm>
                                    </Space>
                                );
                            }}
                        />
                    </Table>
                </div>
            </Layout.Content>
        </Layout>
    );
};

export default PageCurrentUsers;
