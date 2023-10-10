import { Button, Card, Space, Typography, Row, Col } from "antd";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { userData, apiUrl } from "../../../../providers/companyInfo";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf } from "@fortawesome/pro-solid-svg-icons";
import { faFolderOpen, faVideo } from "@fortawesome/pro-regular-svg-icons";

function PageVideo() {
  const history = useHistory();
  useEffect(() => {
    if (!userData().isAllowVideo) {
      history.push("/");
    }
  }, [userData]);

  const [tabIndex, setTabIndex] = useState(0);

  return (
    <Card className="page-video">
      <Space direction="horizontal">
        <Button
          type="primary"
          className={
            "btn-primary btn-with-svg btn-video " +
            (tabIndex === 0 && " btn-video-active")
          }
          icon={<FontAwesomeIcon icon={faVideo} />}
          onClick={() => {
            setTabIndex(0);
          }}
        >
          Videos
        </Button>

        <Button
          type="primary"
          className={
            "btn-primary btn-with-svg btn-download " +
            (tabIndex === 1 && " btn-download-active")
          }
          icon={<FontAwesomeIcon icon={faFolderOpen} />}
          onClick={() => {
            setTabIndex(1);
          }}
        >
          Download
        </Button>
      </Space>
      <br />

      {tabIndex === 0 ? (
        <Row className="m-t-md">
          <Col xs={24} sm={24} md={24}>
            <Typography.Text className="task-card-category">
              Timeline Application Video
            </Typography.Text>
            {/* <br />
            <Typography.Link
              target="new"
              href={apiUrl + "client/timelinesheet/pdf"}
            >
              <FontAwesomeIcon
                icon={faFilePdf}
                style={{ marginRight: "5px" }}
              />
              Download Timeline Sheet
            </Typography.Link> */}
            <div className="page-video-iframe">
              <iframe
                title="timeline video"
                src="https://player.vimeo.com/video/349891027?h=d9c365d741"
                /*width="640" height="360"*/ frameborder="0"
                allow="autoplay; fullscreen; picture-in-picture"
                allowfullscreen
                style={{ marginTop: 0 }}
              ></iframe>
            </div>
            <Typography.Text className="task-card-category">
              United Airlines Application Bootcamp Video
            </Typography.Text>
            <br />
            Current Password: ATC_Approved2023
            <div className="page-video-iframe">
              <iframe
                title="Bootcamp video"
                src="https://player.vimeo.com/video/759732312?h=c20bcf00ad"
                /*width="640" height="360"*/ frameborder="0"
                allow="autoplay; fullscreen; picture-in-picture"
                allowfullscreen
              ></iframe>
            </div>
          </Col>
        </Row>
      ) : (
        <Row className="m-t-md">
          <Col xs={24} sm={24} md={24}>
            <Space>
              <Typography.Link
                target="new"
                href={apiUrl + "client/timelinesheet/pdf"}
                style={{ textDecoration: "none", color: "black" }}
              >
                <FontAwesomeIcon
                  icon={faFilePdf}
                  style={{ marginRight: "5px", color: "#325db8" }}
                />
                Download Timeline Sheet
              </Typography.Link>
            </Space>
          </Col>
        </Row>
      )}
    </Card>
  );
}

export default PageVideo;
