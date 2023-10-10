import React from "react"
import { Col, Divider, Layout, Row, Space, Typography } from "antd"
import { name, role } from "../../providers/companyInfo"
import { Link } from "react-router-dom"

export default function Footer({ match }) {
  // console.log("match", match);
  return (
    <Layout.Footer className="atc-footer">
      <Row>
        <Col xs={24} sm={24} md={24} lg={12}>
          <Typography.Text>
            © {new Date().getFullYear()} {name}. All Rights Reserved.
          </Typography.Text>
        </Col>
        <Col xs={24} sm={24} md={24} lg={12} className="links">
          {role() !== "Admin" && role() !== "Super Admin" ? (
            <Space className="footer-links" split={<Divider type="vertical" />}>
              <Link to="/policy" target={"_blank"}>
                Privacy Policy
              </Link>
              <Link to="/terms-and-condition" target={"_blank"}>
                Terms & Conditions
              </Link>
              {/* <Link to="/cookies" target={"_blank"}>
							Cookie Policy
						</Link> */}
            </Space>
          ) : null}
        </Col>
      </Row>
    </Layout.Footer>
  )
}
