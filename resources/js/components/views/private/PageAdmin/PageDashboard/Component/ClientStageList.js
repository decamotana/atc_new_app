import {
  Button,
  Card,
  Col,
  Divider,
  List,
  Row,
  Skeleton,
  Spin,
  Table,
  Typography,
} from "antd";
import { GET, GETMANUAL } from "../../../../../providers/useAxiosQuery";
import React, { useEffect, useState } from "react";
import $ from "jquery";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/pro-regular-svg-icons";
export default function ClientStageList(props) {
  const { title, dataSource, meta } = props;

  const [data, setData] = useState(dataSource);
  const [isLoading, setIsLoading] = useState(false);
  const [params, setParams] = useState({
    url: meta.nextPageUrl,
  });

  // useEffect(() => {
  //   console.log("dataSource", dataSource);
  // }, [dataSource]);

  const loadMoreData = () => {
    // console.log("endOfFile: ", meta);
    getOpportunityWithId();
  };

  const { refetch: getOpportunityWithId } = GETMANUAL(
    `api/v1/clients_opportunity_stage_with_id?${$.param(params)}`,
    "get-opportunity-" + meta.startAfterId,

    (res) => {
      if (res.success) {
        setIsLoading(false);
        console.log("opportunities-new: ", res.data);
        setData([...data, ...res.data.opportunities]);
      }
    }
  );

  return (
    <Card title={title.toUpperCase()} className="stage-card">
      <Row>
        <Col xs={24} sm={24} md={24} lg={24}>
          <List
            bordered
            dataSource={data}
            loading={isLoading}
            onScroll={(e) => {
              const { scrollTop, scrollHeight, offsetHeight } = e.target;
              const hasScrollReachedBottom =
                offsetHeight + scrollTop > scrollHeight;

              if (hasScrollReachedBottom && data.length != meta.total) {
                setIsLoading(true);
                loadMoreData();
              }
            }}
            className="stage-list "
            style={{
              maxHeight: "160px",
              overflowY: "scroll",
              overflowX: "hidden",
            }}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  title={item.contact.name}
                  description={item.contact.email}
                />
              </List.Item>
            )}
          />
        </Col>
      </Row>
    </Card>
  );
}
