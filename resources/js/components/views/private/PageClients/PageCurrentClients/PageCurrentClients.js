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
    Table,
} from "antd";
import Title from "antd/lib/typography/Title";
import {
    CheckOutlined,
    InboxOutlined,
    UsergroupAddOutlined,
    UserAddOutlined,
    UserSwitchOutlined,
    EditFilled,
    FolderOpenOutlined,
    CloseOutlined,
    UserOutlined,
} from "@ant-design/icons";
import Text from "antd/lib/typography/Text";
import ComponentHeader from "../../Components/ComponentHeader";
import useAxiosQuery from "../../../../providers/useAxiosQuery";
import FloatInput from "../../../../providers/FloatInput";
import FloatSelect from "../../../../providers/FloatSelect";
import notificationErrors from "../../../../providers/notificationErrors";
import { useHistory } from "react-router-dom";
import moment from "moment";
const { Content } = Layout;

const PageCurrentClients = ({ permission }) => {
    let history = useHistory();
    const [pageFiltersClient, setPageFiltersClient] = React.useState({
        currentPage: 1,
        search: "",
        sortField: "",
        sortOrder: "",
        pageSize: 50,
    });

    // for table
    const {
        data: dataClients,
        isLoading: isLoadingTblClient,
        refetch: refetchClients,
        isFetching: isFetchingTblClient,
    } = useAxiosQuery(
        "GET",
        `api/v1/client?status=Current&pagination=1&pageSize=${pageFiltersClient.pageSize}&page=${pageFiltersClient.currentPage}&search=${pageFiltersClient.search}&sort_field=${pageFiltersClient.sortField}&sort_order=${pageFiltersClient.sortOrder}`,
        "current_clients_table"
    );

    React.useEffect(() => {
        refetchClients();
        return () => {};
    }, [pageFiltersClient]);

    const { mutate: mutateUpdateClient, isLoading: isLoadingUpdateClient } =
        useAxiosQuery("UPDATE", "api/v1/client", [
            "current_clients_table",
            "past_clients_table",
        ]);

    const handleUpdateClient = (record, status) => {
        let data = { ...record, status: status };
        delete data.real_estate_agents;
        mutateUpdateClient(data, {
            onSuccess: (res) => {
                if (res.success) {
                    notification.success({
                        message: "Client Successfully Deactivated",
                    });
                }
            },
        });
    };

    const handleTblChangeClient = (pagination, filters, sorter) => {
        setPageFiltersClient({
            ...pageFiltersClient,
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
            <ComponentHeader permission={permission} icon={<UserOutlined />} />
            <Layout.Content style={{ padding: 24 }}>
                <Row style={{ marginTop: 10, marginBottom: 10 }}>
                    <Col md={8} xs={24}>
                        <Input.Search
                            placeholder="Search Client"
                            onPressEnter={(e) =>
                                setPageFiltersClient({
                                    ...pageFiltersClient,
                                    search: e.target.value,
                                })
                            }
                            onSearch={(e) =>
                                setPageFiltersClient({
                                    ...pageFiltersClient,
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
                        dataSource={dataClients && dataClients.data.data}
                        loading={isLoadingTblClient || isFetchingTblClient}
                        rowKey={(record) => record.id}
                        onChange={handleTblChangeClient}
                        pagination={{
                            total: dataClients ? dataClients.data.total : 0,
                            pageSize: dataClients
                                ? dataClients.data.per_page
                                : 0,
                            // hideOnSinglePage: true,
                            showSizeChanger: true,
                        }}
                    >
                        <Table.Column
                            title="Client Name"
                            dataIndex="client_name"
                            key="client_name"
                            sorter={(a, b) => a.client_name - b.client_name}
                        />
                        <Table.Column
                            title="Borrowers Names"
                            key="borrower1_first_name"
                            dataIndex="borrower1_first_name"
                            sorter={(a, b) =>
                                a.borrower1_first_name - b.borrower1_first_name
                            }
                            render={(text, record) => {
                                return (
                                    <>
                                        {record.borrower1_first_name}
                                        {record.borrower1_last_name}
                                        {record.borrower2_first_name && (
                                            <>
                                                , {record.borrower2_first_name}
                                                {record.borrower2_last_name}
                                            </>
                                        )}
                                        {record.borrower2_first_name && (
                                            <>
                                                , {record.borrower3_first_name}
                                                {record.borrower3_last_name}
                                            </>
                                        )}
                                    </>
                                );
                            }}
                        />
                        <Table.Column
                            title="Real Estate Agents"
                            key="real_estate_agents"
                            dataIndex="real_estate_agents"
                            sorter={(a, b) =>
                                a.real_estate_agents - b.real_estate_agents
                            }
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
                                return (
                                    <>
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
                                    </>
                                );
                            }}
                        />
                        <Table.Column
                            align="center"
                            title="Deactivate"
                            key="action"
                            render={(text, record) => {
                                return (
                                    <>
                                        <Popconfirm
                                            title="Are you sure you want to deactivate this Client?"
                                            okText="Yes"
                                            cancelText="No"
                                            onConfirm={(e) =>
                                                handleUpdateClient(
                                                    record,
                                                    "Past"
                                                )
                                            }
                                        >
                                            <Button
                                                className="btn-danger"
                                                loading={isLoadingUpdateClient}
                                                type="primary"
                                                icon={<CloseOutlined />}
                                            ></Button>
                                        </Popconfirm>
                                    </>
                                );
                            }}
                        />
                    </Table>
                </div>
            </Layout.Content>
        </Layout>
    );
};

export default PageCurrentClients;
