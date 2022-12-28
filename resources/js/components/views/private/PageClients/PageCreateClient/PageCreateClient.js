import React from "react";
import {
    Button,
    Card,
    Checkbox,
    Col,
    Form,
    Input,
    Layout,
    notification,
    Row,
    Select,
} from "antd";
import Title from "antd/lib/typography/Title";
import {
    CheckOutlined,
    InboxOutlined,
    UsergroupAddOutlined,
    UserAddOutlined,
    PlusCircleFilled,
} from "@ant-design/icons";
import Text from "antd/lib/typography/Text";
import ComponentHeader from "../../Components/ComponentHeader";
import useAxiosQuery from "../../../../providers/useAxiosQuery";
import FloatInput from "../../../../providers/FloatInput";
import FloatSelect from "../../../../providers/FloatSelect";
import notificationErrors from "../../../../providers/notificationErrors";

const { Content } = Layout;

export default function PageCreateClient({ props, permission }) {
    const { data: dataUsers, isLoading: isLoadingDataUsers } = useAxiosQuery(
        "GET",
        "api/v1/user",
        "users",
        (res) => {
            console.log("users", res);
        }
    );

    const [formCreateClient] = Form.useForm();

    const {
        mutate: mutateCreateClient,
        isLoading: isLoadingMutateCreateClient,
    } = useAxiosQuery("POST", "api/v1/client", "current_clients");
    const handleCreateClient = (value) => {
        console.log(value);
        let data = { ...value };
        mutateCreateClient(data, {
            onSuccess: (res) => {
                if (res.success) {
                    notification.success({
                        message: "Client Successfully Created",
                    });

                    formCreateClient.resetFields();
                }
            },
            onError: (err) => {
                notificationErrors(err);
            },
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
                icon={<PlusCircleFilled />}
            />
            <Layout.Content style={{ padding: 24 }}>
                <Form
                    layout="vertical"
                    form={formCreateClient}
                    onFinish={handleCreateClient}
                    initialValues={{
                        document_pre_approval_letter: true,
                        document_pre_qualification_form: true,
                        document_loan_status_update_form: true,
                    }}
                >
                    <Row>
                        <Col xs={24} md={16}>
                            <Row gutter={12}>
                                <Col xs={24} md={24}>
                                    <br />
                                    <Card
                                        bodyStyle={{ paddingBottom: 0 }}
                                        className="card-primary-head card-primary-border"
                                        title="Client Information"
                                    >
                                        <Row gutter={12}>
                                            <Col xs={24} md={24}>
                                                <Form.Item
                                                    name="client_name"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message:
                                                                "this field is required",
                                                        },
                                                    ]}
                                                    hasFeedback
                                                >
                                                    <FloatInput
                                                        required={true}
                                                        label="Client Name"
                                                        placeholder="Client Name"
                                                    />
                                                </Form.Item>
                                            </Col>{" "}
                                        </Row>
                                    </Card>
                                    <br />
                                    <Card
                                        className="card-primary-head card-primary-border"
                                        title="Select Documents"
                                    >
                                        <Row gutter={12}>
                                            <Col xs={24} md={8}>
                                                <Form.Item
                                                    name="document_pre_approval_letter"
                                                    className="mb-0"
                                                    valuePropName="checked"
                                                >
                                                    <Checkbox>
                                                        Pre-Approval Letter
                                                    </Checkbox>
                                                </Form.Item>
                                            </Col>
                                            <Col xs={24} md={8}>
                                                <Form.Item
                                                    name="document_pre_qualification_form"
                                                    className="mb-0"
                                                    valuePropName="checked"
                                                >
                                                    <Checkbox>
                                                        Pre-Qualification Form
                                                    </Checkbox>
                                                </Form.Item>
                                            </Col>
                                            <Col xs={24} md={8}>
                                                <Form.Item
                                                    name="document_loan_status_update_form"
                                                    className="mb-0"
                                                    valuePropName="checked"
                                                >
                                                    <Checkbox>
                                                        Loan Status Update Form
                                                    </Checkbox>
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    </Card>
                                    <br />
                                    <Card
                                        bodyStyle={{ paddingBottom: 5 }}
                                        className="card-primary-head card-primary-border"
                                        title="Borrower's Information"
                                    >
                                        <h3 style={{ marginTop: 0 }}>
                                            Borrower 1
                                        </h3>
                                        <Row gutter={12}>
                                            <Col xs={24} md={12}>
                                                <Form.Item
                                                    name="borrower1_first_name"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message:
                                                                "this field is required",
                                                        },
                                                    ]}
                                                    hasFeedback
                                                >
                                                    <FloatInput
                                                        required={true}
                                                        label="First Name"
                                                        placeholder="First Name"
                                                    />
                                                </Form.Item>
                                            </Col>{" "}
                                            <Col xs={24} md={12}>
                                                <Form.Item
                                                    name="borrower1_last_name"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message:
                                                                "this field is required",
                                                        },
                                                    ]}
                                                    hasFeedback
                                                >
                                                    <FloatInput
                                                        required={true}
                                                        label="Last Name"
                                                        placeholder="Last Name"
                                                    />
                                                </Form.Item>
                                            </Col>{" "}
                                        </Row>
                                        <h3>Borrower 2</h3>
                                        <Row gutter={12}>
                                            <Col xs={24} md={12}>
                                                <Form.Item
                                                    name="borrower2_first_name"
                                                    hasFeedback
                                                >
                                                    <FloatInput
                                                        label="First Name"
                                                        placeholder="First Name"
                                                    />
                                                </Form.Item>
                                            </Col>{" "}
                                            <Col xs={24} md={12}>
                                                <Form.Item
                                                    name="borrower2_last_name"
                                                    hasFeedback
                                                >
                                                    <FloatInput
                                                        label="Last Name"
                                                        placeholder="Last Name"
                                                    />
                                                </Form.Item>
                                            </Col>{" "}
                                        </Row>

                                        <h3>Borrower 3</h3>
                                        <Row gutter={12}>
                                            <Col xs={24} md={12}>
                                                <Form.Item
                                                    name="borrower3_first_name"
                                                    hasFeedback
                                                >
                                                    <FloatInput
                                                        label="First Name"
                                                        placeholder="First Name"
                                                    />
                                                </Form.Item>
                                            </Col>{" "}
                                            <Col xs={24} md={12}>
                                                <Form.Item
                                                    name="borrower3_last_name"
                                                    hasFeedback
                                                >
                                                    <FloatInput
                                                        label="Last Name"
                                                        placeholder="Last Name"
                                                    />
                                                </Form.Item>
                                            </Col>{" "}
                                        </Row>
                                    </Card>
                                    <br />
                                    <Card
                                        bodyStyle={{ paddingBottom: 0 }}
                                        className="card-primary-head card-primary-border"
                                        title="Account Users"
                                    >
                                        <Form.Item
                                            name="loan_officers"
                                            hasFeedback
                                        >
                                            <FloatSelect
                                                label="Loan Officers"
                                                placeholder="Loan Officers"
                                                mode="tags"
                                                options={
                                                    dataUsers
                                                        ? dataUsers.data
                                                              .filter(
                                                                  (p) =>
                                                                      p.role ==
                                                                      "Loan Officer"
                                                              )
                                                              .map((x) => {
                                                                  return {
                                                                      label: `${x.first_name} ${x.last_name}`,
                                                                      value: x.id,
                                                                  };
                                                              })
                                                        : []
                                                }
                                            />
                                        </Form.Item>
                                        <Form.Item
                                            name="loan_officer_assistants"
                                            hasFeedback
                                        >
                                            <FloatSelect
                                                label="Loan Officers Assistants"
                                                placeholder="Loan Officers Assistants"
                                                mode="tags"
                                                options={
                                                    dataUsers
                                                        ? dataUsers.data
                                                              .filter(
                                                                  (p) =>
                                                                      p.role ==
                                                                      "Loan Officer Assistant"
                                                              )
                                                              .map((x) => {
                                                                  return {
                                                                      label: `${x.first_name} ${x.last_name}`,
                                                                      value: x.id,
                                                                  };
                                                              })
                                                        : []
                                                }
                                            />
                                        </Form.Item>
                                        <Form.Item
                                            name="real_estate_agents"
                                            hasFeedback
                                        >
                                            <FloatSelect
                                                label="Real Estate Agents"
                                                placeholder="Real Estate Agents"
                                                mode="tags"
                                                options={
                                                    dataUsers
                                                        ? dataUsers.data
                                                              .filter(
                                                                  (p) =>
                                                                      p.role ==
                                                                          "Real Estate Agent" ||
                                                                      p.role ==
                                                                          "Transaction Coordinator"
                                                              )
                                                              .map((x) => {
                                                                  return {
                                                                      label: `${x.first_name} ${x.last_name}`,
                                                                      value: x.id,
                                                                  };
                                                              })
                                                        : []
                                                }
                                            />
                                        </Form.Item>
                                    </Card>
                                </Col>
                            </Row>
                            <br />
                            <div>
                                <Button
                                    htmlType="submit"
                                    className="btn-primary"
                                    block
                                    loading={isLoadingMutateCreateClient}
                                >
                                    CREATE CLIENT
                                </Button>
                            </div>
                        </Col>
                    </Row>
                </Form>
            </Layout.Content>
        </Layout>
    );
}
