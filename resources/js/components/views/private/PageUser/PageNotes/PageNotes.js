import { Card, Row, Col, Collapse, Button, Typography, Meta } from "antd";
import React, { useEffect, useState, history } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClipboard } from "@fortawesome/pro-regular-svg-icons";
import { GET } from "../../../../providers/useAxiosQuery";
import moment from "moment";

function PageNotes() {
  const [notesData, setNotesData] = useState([]);

  GET(`api/v1/notes`, "get_user_notes", (res) => {
    if (res.success) {
      setNotesData(res.data);
      console.log("notes", res.data);
    }
  });

  return (
    <Card>
      {notesData.length != 0 ? (
        <Row gutter={18}>
          {notesData &&
            notesData.map((item, index) => {
              return (
                <Col xs={6} sm={6} md={6} key={index}>
                  <Collapse
                    className="main-4-collapse border-none"
                    //   expandIcon={({ isActive }) =>
                    //       isActive ? (
                    //           <span
                    //               className="ant-menu-submenu-arrow"
                    //               style={{ color: "#FFF", transform: "rotate(270deg)" }}
                    //           ></span>
                    //       ) : (
                    //           <span
                    //               className="ant-menu-submenu-arrow"
                    //               style={{ color: "#FFF", transform: "rotate(90deg)" }}
                    //           ></span>
                    //       )
                    //   }

                    defaultActiveKey={["1"]}
                    expandIconPosition="start"
                  >
                    <Collapse.Panel
                      header={
                        <div className="flex">
                          <div style={{ width: "175px" }}>
                            {moment(item.dueDate).format("MMMM DD, YYYY")}
                          </div>
                        </div>
                      }
                      key="1"
                      className="accordion bg-darkgray-form m-b-md border bgcolor-1 white"
                    >
                      <div>
                        {/* <div>
                         <Typography.Text className="description">
					    {item.description}
				        </Typography.Text>
                    </div>
                    <div>
                    <Typography.Text className="date">
                            Due date: {moment(item.dueDate).format("MMMM DD, YYYY")}
                        </Typography.Text>
                    </div>
            	 */}

                        <Card bordered={false} style={{ minHeight: "100px" }}>
                          <Typography.Text>{item.body}</Typography.Text>
                          <br></br>
                          {/* <Typography.Text style={{fontSize:"10pt"}}>  </Typography.Text> */}
                        </Card>
                      </div>
                    </Collapse.Panel>
                  </Collapse>
                </Col>
              );
            })}
        </Row>
      ) : (
        <Row>
          <Col
            sm={24}
            md={24}
            style={{
              fontSize: "20pt",
              color: "grey",
              display: "flex",
              justifyContent: "center",
            }}
            className="flex-center"
          >
            <FontAwesomeIcon icon={faClipboard} />
            <Typography.Text style={{ fontSize: "15pt", color: "grey" }}>
              {" "}
              No News and Announcement
            </Typography.Text>
          </Col>
        </Row>
      )}
    </Card>
  );
}

export default PageNotes;
