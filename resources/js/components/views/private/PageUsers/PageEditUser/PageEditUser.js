import React, { useEffect, useState } from "react";
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
    Upload,
    Space,
} from "antd";
import Title from "antd/lib/typography/Title";
import {
    CheckOutlined,
    InboxOutlined,
    UsergroupAddOutlined,
    UserAddOutlined,
    UserOutlined,
    LoadingOutlined,
    PlusOutlined,
} from "@ant-design/icons";
import Text from "antd/lib/typography/Text";
import ComponentHeader from "../../Components/ComponentHeader";
import useAxiosQuery from "../../../../providers/useAxiosQuery";
import FloatInput from "../../../../providers/FloatInput";
import FloatSelect from "../../../../providers/FloatSelect";
import notificationErrors from "../../../../providers/notificationErrors";
import optionStateCodes from "../../../../providers/optionStateCodes";
import SignatureCanvas from "react-signature-canvas";
const { Content } = Layout;

export default function PageEditUser({ match, permission }) {
    const [formCreateUser] = Form.useForm();
    const { data: dataUser, isLoading: isLoadingDataUser } = useAxiosQuery(
        "GET",
        "api/v1/user/" + match.params.id,
        "users_" + match.params.id,
        (res) => {
            if (res.success) {
                console.log("res", res);
                formCreateUser.setFieldsValue(res.data);
                formCreateUser.setFieldsValue(res.data.user_business_info);
                setUploadImage({
                    imageUrl: res.data.profile_picture,
                    loading: false,
                });
                refSignature.fromDataURL(res.data.signature);
            }
        }
    );
    const { mutate: mutateCreateUser, isLoading: isLoadingMutateCreateUser } =
        useAxiosQuery("POST", "api/v1/user", "current_users");
    const handleCreateUser = (value) => {
        let data = {
            ...value,
            id: match.params.id,
            profile_picture: uploadImage.imageUrl,
            signature: refSignature.toDataURL(),
        };
        delete data.confirm;
        mutateCreateUser(data, {
            onSuccess: (res) => {
                if (res.success) {
                    notification.success({
                        message: "User Successfully Created",
                    });
                }
            },
            onError: (err) => {
                notificationErrors(err);
            },
        });
    };

    function getBase64(img, callback) {
        const reader = new FileReader();
        reader.addEventListener("load", () => callback(reader.result));
        reader.readAsDataURL(img);
    }

    function beforeUpload(file) {
        const isJpgOrPng =
            file.type === "image/jpeg" || file.type === "image/png";
        if (!isJpgOrPng) {
            message.error("You can only upload JPG/PNG file!");
        }
        const isLt3M = file.size / 1024 / 1024 < 3;
        if (!isLt3M) {
            message.error("Image must smaller than 3MB!");
        }
        return isJpgOrPng && isLt3M;
    }

    const [uploadImage, setUploadImage] = useState({
        imageUrl: "",
        loading: false,
    });

    useEffect(() => {
        console.log("uploadImage", uploadImage);
        return () => {};
    }, [uploadImage]);

    const handleChange = (info) => {
        if (info.file.status === "uploading") {
            setUploadImage({ ...uploadImage, loading: true });
            return;
        }
        if (info.file.status === "done") {
            // Get this url from response in real world.
            getBase64(info.file.originFileObj, (imageUrl) =>
                setUploadImage({
                    imageUrl,
                    loading: false,
                })
            );
        }
    };

    const uploadButton = (
        <div>
            {uploadImage.loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );

    let refSignature;

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
                <Form
                    layout="vertical"
                    form={formCreateUser}
                    onFinish={handleCreateUser}
                >
                    <Row gutter={12}>
                        <Col xs={24} md={16}>
                            <Row gutter={12}>
                                <Col xs={24} md={24}>
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
                                                >
                                                    <FloatInput
                                                        required={true}
                                                        label="First Name"
                                                        placeholder="First Name"
                                                        name="first_name"
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
                                                    name="email"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message:
                                                                "this field is required",
                                                        },
                                                    ]}
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
                                                <Form.Item name="password">
                                                    <FloatInput
                                                        label="New Password"
                                                        placeholder="New Password"
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
                                                        label="Confirm New Password"
                                                        placeholder="Confirm New Password"
                                                        type="password"
                                                    />
                                                    {/* <Input.Password placeholder="Confirm Password" /> */}
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    </Card>
                                    {/* <br />
                                    <Card
                                        bodyStyle={{ paddingBottom: 0 }}
                                        className="card-primary-head card-primary-border"
                                        title="Business Information"
                                    >
                                        <Row gutter={12}>
                                            <Col xs={24} md={24}>
                                                <Form.Item name="company_name">
                                                    <FloatInput
                                                        label="Company Name"
                                                        placeholder="Company Name"
                                                    />
                                                </Form.Item>
                                            </Col>
                                            <Col xs={24} md={12}>
                                                <Form.Item name="company_address1">
                                                    <FloatInput
                                                        label="Company Address 1"
                                                        placeholder="Company Address 1"
                                                    />
                                                </Form.Item>
                                            </Col>
                                            <Col xs={24} md={12}>
                                                <Form.Item name="company_address2">
                                                    <FloatInput
                                                        label="Company Address 2"
                                                        placeholder="Company Address 2"
                                                    />
                                                </Form.Item>
                                            </Col>
                                            <Col xs={24} md={8}>
                                                <Form.Item name="company_city">
                                                    <FloatInput
                                                        label="City"
                                                        placeholder="City"
                                                    />
                                                </Form.Item>
                                            </Col>
                                            <Col xs={24} md={8}>
                                                <Form.Item name="company_state">
                                                    <FloatSelect
                                                        label="State"
                                                        placeholder="State"
                                                        options={
                                                            optionStateCodes
                                                        }
                                                    ></FloatSelect>
                                                </Form.Item>
                                            </Col>
                                            <Col xs={24} md={8}>
                                                <Form.Item name="company_zip">
                                                    <FloatInput
                                                        label="Zip"
                                                        placeholder="Zip"
                                                    />
                                                </Form.Item>
                                            </Col>
                                            <Col xs={24} md={12}>
                                                <Form.Item name="company_state_license_no">
                                                    <FloatInput
                                                        label="State License #"
                                                        placeholder="State License #"
                                                    />
                                                </Form.Item>
                                            </Col>
                                            <Col xs={24} md={12}>
                                                <Form.Item name="company_nmls_license_no">
                                                    <FloatInput
                                                        label="NMLS License #"
                                                        placeholder="NMLS License #"
                                                    />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    </Card> */}
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
                                    SAVE USER
                                </Button>
                            </div>
                        </Col>
                        <Col xs={24} md={8}>
                            <Card
                                className="card-primary-head card-primary-border"
                                title="Profile Photo"
                            >
                                <div className="text-center">
                                    <Upload
                                        name="avatar"
                                        listType="picture-card"
                                        className="avatar-uploader"
                                        showUploadList={false}
                                        style={{ height: 200 }}
                                        customRequest={({
                                            onSuccess,
                                            onError,
                                            file,
                                        }) => {
                                            onSuccess();
                                        }}
                                        beforeUpload={beforeUpload}
                                        onChange={handleChange}
                                    >
                                        {uploadImage.imageUrl ? (
                                            <img
                                                src={
                                                    dataUser.data &&
                                                    dataUser.data
                                                        .profile_picture &&
                                                    uploadImage.imageUrl.indexOf(
                                                        "data:image"
                                                    ) === -1
                                                        ? `${window.location.origin}/${uploadImage.imageUrl}`
                                                        : uploadImage.imageUrl
                                                }
                                                alt="avatar"
                                                style={{ width: "100%" }}
                                            />
                                        ) : (
                                            uploadButton
                                        )}
                                    </Upload>
                                    <span style={{ color: "#34495A" }}>
                                        Upload Profile Photo
                                    </span>
                                    <br />
                                    <span style={{ color: "#969696" }}>
                                        3MB max file size. Jpeg or Png
                                        <br /> file formats accepted.
                                    </span>

                                    <div style={{ marginTop: 10 }}>
                                        <Button
                                            htmlType="submit"
                                            className="btn-primary"
                                            block
                                            loading={isLoadingMutateCreateUser}
                                        >
                                            SAVE PROFILE PHOTO
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                            <br />
                            <Card
                                className="card-primary-head card-primary-border"
                                title="Signature"
                            >
                                <div className="text-center">
                                    <SignatureCanvas
                                        penColor="black"
                                        canvasProps={{
                                            width: 300,
                                            height: 200,
                                            className: "sigCanvas",
                                        }}
                                        ref={(ref) => (refSignature = ref)}
                                    />
                                </div>
                                <div style={{ marginTop: 10 }}>
                                    <Row>
                                        <Col xs={24} md={18}>
                                            <Button
                                                htmlType="submit"
                                                className="btn-primary"
                                                block
                                                loading={
                                                    isLoadingMutateCreateUser
                                                }
                                            >
                                                SAVE SIGNATURE
                                            </Button>
                                        </Col>
                                        <Col xs={24} md={6}>
                                            <Button
                                                className="btn-danger"
                                                onClick={(e) =>
                                                    refSignature.clear()
                                                }
                                                block
                                                loading={
                                                    isLoadingMutateCreateUser
                                                }
                                            >
                                                CLEAR
                                            </Button>
                                        </Col>
                                    </Row>
                                </div>
                            </Card>
                        </Col>{" "}
                    </Row>
                </Form>
            </Layout.Content>
        </Layout>
    );
}
