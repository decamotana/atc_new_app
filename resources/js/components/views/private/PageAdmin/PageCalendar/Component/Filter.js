import { Button, Col, Form, Row, Tag } from "antd";
import { GET } from "../../../../../providers/useAxiosQuery";
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRefresh, faRotateRight } from "@fortawesome/pro-regular-svg-icons";
import FloatSelect from "../../../../../providers/FloatSelect3";

export default function Filter(props) {
  const { setParams } = props;
  const [form] = Form.useForm();
  const [consultants, setConsultant] = useState([]);
  const [showOptions, setShowOptions] = useState(false);

  const { refetch: getConsultants } = GET(
    `api/v1/consultant?`,
    "admin-calendar-consultants",
    (res) => {
      if (res.success) {
        let consultants = [];

        res.data.map((data) => {
          consultants.push({
            label: data.firstname + " " + data.lastname,
            value: data.id,
          });
        });

        setConsultant(consultants);
      }
    }
  );

  const schedule = [
    {
      label: "Availability",
      value: "availability",
    },
    {
      label: "Bookings",
      value: "bookings",
    },
    {
      label: "Cancelled",
      value: "cancelled",
    },
    {
      label: "No Show",
      value: "noshow",
    },
    {
      label: "Attended",
      value: "showed",
    },
  ];

  const [filter, setFilter] = useState({
    consultant: "",
    schedule: ["bookings"],
  });

  const [showFilter, setShowFilter] = useState({
    consultant: true,
    schedule: false,
  });

  const handleCloseTag = (choice, item) => {
    if (choice == "consultant") {
      const newTags = filter.consultant.filter((tag) => tag.label !== item);
      setFilter({
        ...filter,
        consultant: newTags,
      });

      form.setFieldsValue({
        consultant_filter: newTags,
      });
    } else {
      const newTags = filter.schedule.filter((tag) => tag !== item);
      setFilter({
        ...filter,
        schedule: newTags,
      });

      form.setFieldsValue({
        schedule_filter: newTags,
      });
    }
  };

  useEffect(() => {
    setParams(filter);
  }, [filter.consultant, filter.schedule]);

  return (
    <Form form={form} initialValues={{ schedule_filter: ["bookings"] }}>
      <Row gutter={12}>
        <Col xs={24} sm={24} md={24}>
          <Row gutter={[12, 12]}>
            <Col>
              <Button
                type="text"
                className="btn-calendar-filter btn-filter-consultant"
                onClick={() => {
                  setShowFilter({
                    consultant: true,
                    schedule: false,
                  });

                  if (!showOptions) {
                    setShowOptions(true);
                  }
                }}
              >
                CONSULTANTS
              </Button>
            </Col>
            <Col>
              <Button
                type="text"
                className="btn-calendar-filter"
                onClick={() => {
                  setShowFilter({
                    consultant: false,
                    schedule: true,
                  });
                  if (!showOptions) {
                    setShowOptions(true);
                  }
                }}
              >
                SCHEDULE
              </Button>
            </Col>
            <Col>
              <Button
                type="text"
                className="btn-calendar-filter-icon"
                onClick={() => {
                  setFilter({
                    consultant: "",
                    schedule: ["bookings"],
                  });

                  if (showOptions) {
                    setShowOptions(false);
                  }

                  form.setFieldsValue({
                    consultant_filter: [],
                    schedule_filter: ["bookings"],
                  });
                }}
              >
                <FontAwesomeIcon icon={faRotateRight} />
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>

      {showOptions && (
        <Row className="filter-select">
          <Col
            xs={24}
            sm={24}
            md={24}
            style={{ display: "flex", flexDirection: "row" }}
          >
            {" "}
            {showFilter.consultant && (
              <Col
                xs={12}
                sm={12}
                md={10}
                lg={8}
                xl={5}
                className="m-b-sm"
                style={{ marginRight: "10px" }}
              >
                <Form.Item
                  name="consultant_filter"
                  className="calendar-filter-float"
                >
                  <FloatSelect
                    label="Consultants"
                    placeholder="Consultants"
                    multi="multiple"
                    showSelect={showFilter}
                    setShowSelect={setShowFilter}
                    options={consultants}
                    onChange={(e, key) => {
                      let new_consultant_filter = [];

                      key.forEach((item) => {
                        new_consultant_filter.push({
                          label: item.label,
                          value: item.value,
                        });
                      });

                      setFilter({
                        ...filter,
                        consultant: new_consultant_filter,
                      });
                    }}
                  />
                </Form.Item>
              </Col>
            )}
            {showFilter.schedule && (
              <Col
                xs={12}
                sm={12}
                md={10}
                lg={8}
                xl={5}
                className="m-b-sm"
                style={{ marginRight: "10px" }}
              >
                <Form.Item
                  name="schedule_filter"
                  className="calendar-filter-float"
                >
                  <FloatSelect
                    label="Schedule"
                    placeholder="Schedule"
                    multi="multiple"
                    showSelect={showFilter}
                    setShowSelect={setShowFilter}
                    options={schedule}
                    onChange={(value) => {
                      let consultant_value = filter.consultant;

                      setFilter({
                        ...filter,
                        schedule: value,
                      });
                    }}
                  />
                </Form.Item>
              </Col>
            )}
            <Col xs={24} sm={24} md={24} className="filter-result-cont">
              <div>Results:</div>
              {filter && (
                <Col xs={24} sm={24} md={24} className="m-b-sm">
                  {filter.consultant.length > 0 ? (
                    filter.consultant.map((item) => {
                      return (
                        <Tag
                          closable
                          key={item.value}
                          onClose={() =>
                            handleCloseTag("consultant", item.label)
                          }
                        >
                          {item.label}
                        </Tag>
                      );
                    })
                  ) : (
                    <Tag>All Consultants</Tag>
                  )}

                  {filter.schedule.length > 0 &&
                    filter.schedule.map((item) => {
                      return (
                        <Tag
                          closable
                          key={item}
                          onClose={() => handleCloseTag("schedule", item)}
                        >
                          {item === "noshow"
                            ? "No show"
                            : item === "showed"
                            ? "Attended"
                            : item}
                        </Tag>
                      );
                    })}
                </Col>
              )}
            </Col>
          </Col>
        </Row>
      )}
    </Form>
  );
}
