import React, { useEffect, useState } from "react";
import { Layout, Card, Collapse, PageHeader, Row, Col } from "antd";
import { InboxOutlined } from "@ant-design/icons";

const ComponentHeader = ({ permission, icon }) => {
    return (
        <PageHeader
            className="site-page-header"
            title={
                <Row gutter={24}>
                    <Col className="gutter-row" md={4}>
                        {icon}
                    </Col>
                    <Col className="gutter-row" md={16}>
                        <h2 className="sh-pagetitle-title">{permission}</h2>
                    </Col>
                </Row>
            }
            style={{
                borderBottom: "1px solid #f0f0f0",
            }}
        />
    );
};

export default ComponentHeader;
