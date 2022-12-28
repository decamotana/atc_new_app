import React from "react";
import {
    Button,
    Card,
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
} from "@ant-design/icons";
import Text from "antd/lib/typography/Text";
import ComponentHeader from "../../Components/ComponentHeader";
import useAxiosQuery from "../../../../providers/useAxiosQuery";
import FloatInput from "../../../../providers/FloatInput";
import FloatSelect from "../../../../providers/FloatSelect";
import notificationErrors from "../../../../providers/notificationErrors";

const { Content } = Layout;

export default function PageCreateUser({ props, permission }) {
    const [formCreateUser] = Form.useForm();

    const { mutate: mutateCreateUser, isLoading: isLoadingMutateCreateUser } =
        useAxiosQuery("POST", "api/v1/user", "current_users");
    const handleCreateUser = (value) => {
        console.log(value);
        let data = { ...value };
        delete data.confirm;
        mutateCreateUser(data, {
            onSuccess: (res) => {
                if (res.success) {
                    notification.success({
                        message: "User Successfully Created",
                    });

                    formCreateUser.resetFields();
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
                icon={<UserAddOutlined />}
            />
            <Layout.Content style={{ padding: 24 }}>
                <Form
                    layout="vertical"
                    form={formCreateUser}
                    onFinish={handleCreateUser}
                >
                    <Row>
                        <Col xs={24} md={16}>
                            <Row gutter={12}>
                                <Col xs={24} md={24}>
                                    <br />
                                    <Card
                                        bodyStyle={{ paddingBottom: 0 }}
                                        className="card-primary-head card-primary-border"
                                        title="Personal Information"
                                    >
                                        <Row gutter={12}>
                                            <Col xs={24} md={12}>
                                                <Form.Item
                                                    name="first_name"
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
                                                    name="last_name"
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
                                            </Col>
                                            <Col xs={24} md={12}>
                                                <Form.Item
                                                    name="username"
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
                                                        label="Username"
                                                        placeholder="Username"
                                                    />
                                                </Form.Item>
                                            </Col>
                                            <Col xs={24} md={12}>
                                                <Form.Item
                                                    name="role"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message:
                                                                "this field is required",
                                                        },
                                                    ]}
                                                    hasFeedback
                                                >
                                                    <FloatSelect
                                                        required={true}
                                                        label="Role"
                                                        placeholder="Role"
                                                        options={[
                                                            {
                                                                label: "Super Admin",
                                                                value: "Super Admin",
                                                            },
                                                            {
                                                                label: "Staff",
                                                                value: "Staff",
                                                            },
                                                        ]}
                                                    />
                                                </Form.Item>
                                            </Col>
                                            <Col xs={24} md={12}>
                                                <Form.Item
                                                    name="email"
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
                                                        label="Email"
                                                        placeholder="Email"
                                                        type="email"
                                                    />
                                                </Form.Item>
                                            </Col>
                                            <Col xs={24} md={12}>
                                                <Form.Item
                                                    name="password"
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
                                                        label="Password"
                                                        placeholder="Password"
                                                        type="password"
                                                    />
                                                </Form.Item>
                                            </Col>
                                            <Col xs={24} md={12}>
                                                <Form.Item
                                                    name="confirm"
                                                    dependencies={["password"]}
                                                    hasFeedback
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message:
                                                                "Please confirm your password!",
                                                        },
                                                        ({
                                                            getFieldValue,
                                                        }) => ({
                                                            validator(
                                                                _,
                                                                value
                                                            ) {
                                                                if (
                                                                    !value ||
                                                                    getFieldValue(
                                                                        "password"
                                                                    ) === value
                                                                ) {
                                                                    return Promise.resolve();
                                                                }
                                                                return Promise.reject(
                                                                    new Error(
                                                                        "The two passwords that you entered do not match!"
                                                                    )
                                                                );
                                                            },
                                                        }),
                                                    ]}
                                                >
                                                    <FloatInput
                                                        required={true}
                                                        label="Confirm Password"
                                                        placeholder="Confirm Password"
                                                        type="password"
                                                    />
                                                    {/* <Input.Password placeholder="Confirm Password" /> */}
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    </Card>
                                </Col>
                            </Row>
                            <br />
                            <div>
                                <Button
                                    htmlType="submit"
                                    className="btn-primary"
                                    block
                                    loading={isLoadingMutateCreateUser}
                                >
                                    CREATE USER
                                </Button>
                            </div>
                        </Col>
                    </Row>
                </Form>
            </Layout.Content>
        </Layout>
    );
}
