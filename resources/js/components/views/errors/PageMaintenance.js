import React from "react";
import {
  Layout,
  Card,
  // Form,
  // Input,
  // Button,
  Row,
  Col,
  Image,
  Divider,
  // notification,
  Typography,
  Result,
  // Alert,
} from "antd";
// import { Link, useHistory, useLocation } from "react-router-dom";
import moment from "moment";
import { logo, description } from "../../providers/companyInfo";
import warningLogo from "../../assets/img/warning.png";

export default function PageMaintenance() {
  // let history = useHistory();
  // const logo = companyInfo().logo;
  // const description = companyInfo().description;

  return (
    <Layout
      className="public-layout"
      style={{
        height: "100vh",
        overflow: " hidden auto ",
        background: "linear-gradient(to bottom, #ffffff 0%, #4169e1 100%)",
      }}
    >
      <div className="divMaintenance">
        <div className="divMaintenanceChild">
          <Result
            status="warning"
            title={
              <span className="textMaintenance">
                Our site is currently undergoing scheduled maintenance and{" "}
                <br />
                upgrades, but will return shortly. We apologize for the
                inconvenience, <br /> thank you for your patience.
              </span>
            }
          />
        </div>
      </div>
    </Layout>
  );
}
