import React from "react";
import { Col, Row, Spin } from "antd";

export function ComponentLoading(props) {
    // const { showLessItems, showSizeChanger, paginationFilter, setPaginationFilter, setPaginationTotal, parentClass = "" } = props

    return (
        <Row style={{ marginTop: "90px", display: "flex" }}>
            <Col
                sm={24}
                md={24}
                lg={24}
                style={{ justifyContent: "center", display: "flex" }}
            >
                <Spin size="medium" tip="Fetching Data" />
            </Col>
        </Row>
    );
}
