import React from "react";
import { Card, Col, Layout, Row } from "antd";
import Title from "antd/lib/typography/Title";
import {
    CheckOutlined,
    InboxOutlined,
    UsergroupAddOutlined,
} from "@ant-design/icons";
import Text from "antd/lib/typography/Text";
import ComponentHeader from "../Components/ComponentHeader";

const { Content } = Layout;

export default function PageDashboard({ props, permission }) {
    return (
        <Layout
            className="site-layout-background"
            style={{
                padding: "0px 0px 20px 0px",
                background: "#fff",
            }}
        >
            <ComponentHeader permission={permission} icon={<InboxOutlined />} />
            <Layout.Content style={{ padding: 24 }}>
                Hellow World
            </Layout.Content>
        </Layout>
    );
}
