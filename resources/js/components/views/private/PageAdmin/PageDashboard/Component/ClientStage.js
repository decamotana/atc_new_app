import { Card, Col, List, Row, Spin } from "antd";
import { GET } from "../../../../../providers/useAxiosQuery";
import React, { useEffect, useState } from "react";
import $ from "jquery";
import ClientStageList from "./ClientStageList";

export function ClientStage(props) {
  const { loadingStage } = props;
  const [atcOpportunities, setAtcOpportunities] = useState([]);

  const { refetch: getInitialOpportunities } = GET(
    `api/v1/clients_opportunity_stage/0`,
    "admin-opportunities-0",
    (res) => {
      if (res.success) {
        console.log("opportunities", res.data);
        setAtcOpportunities(Object.entries(res.data));
      }
    }
  );

  useEffect(() => {
    if (atcOpportunities.length > 0) {
      console.log("atc_opportunities", atcOpportunities);
    }
  }, [atcOpportunities]);

  return (
    <Row gutter={[12, 12]}>
      {atcOpportunities.length > 0 ? (
        atcOpportunities.map((opportunity) => {
          return (
            <Col xs={24} sm={24} md={24} lg={12}>
              <ClientStageList
                title={opportunity[0]}
                dataSource={opportunity[1].opportunities}
                meta={opportunity[1].meta}
              />
            </Col>
          );
        })
      ) : (
        <div
          style={{
            justifyContent: "center",
            display: "flex",
            width: "100%",
            paddingTop: "50px",
          }}
        >
          <Spin size="medium" tip="Fetching Data" />
        </div>
      )}
    </Row>
  );
}

export function AppointmentStage(props) {
  const { loadingStage } = props;
  const [atcOpportunities, setAtcOpportunities] = useState([]);

  const { refetch: getInitialOpportunities } = GET(
    `api/v1/clients_opportunity_stage/1`,
    "admin-opportunities-1",
    (res) => {
      if (res.success) {
        console.log("opportunities", res.data);
        setAtcOpportunities(Object.entries(res.data));
      }
    }
  );

  useEffect(() => {
    if (atcOpportunities.length > 0) {
      console.log("atc_opportunities", atcOpportunities);
    }
  }, [atcOpportunities]);

  return (
    <Row gutter={[12, 12]}>
      {atcOpportunities.length > 0 ? (
        atcOpportunities.map((opportunity) => {
          return (
            <Col xs={24} sm={24} md={24} lg={12}>
              <ClientStageList
                title={opportunity[0]}
                dataSource={opportunity[1].opportunities}
                meta={opportunity[1].meta}
              />
            </Col>
          );
        })
      ) : (
        <div
          style={{
            justifyContent: "center",
            display: "flex",
            width: "100%",
            paddingTop: "50px",
          }}
        >
          <Spin size="medium" tip="Fetching Data" />
        </div>
      )}
    </Row>
  );
}
