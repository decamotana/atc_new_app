import React, { useState, useEffect } from "react";
import FloatInput from "./FloatInput";
import { Input, Button, Tooltip, Row, Col } from "antd";
import $ from "jquery";
import { faCheck, faXmark } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const FloatInputWithButttons = (props) => {
  const [focus, setFocus] = useState(false);
  let {
    label,
    value,
    placeholder,
    type,
    tag,
    onClick,
    required,
    disabled,
    readOnly,
    addonAfter,
    className,
    showButton,
    allowClear,
    icon,
  } = props;

  const handlesOnClick = (value) => {
    if (value) {
      let new_values = value.split(",");

      new_values.forEach((new_value) => {
        window.open(new_value);
      });
    }
  };

  return (
    <Row gutter={8}>
      <Col
        xl={showButton ? 18 : 24}
        lg={showButton ? 18 : 24}
        md={showButton ? 18 : 24}
        sm={showButton ? 18 : 24}
        xs={showButton ? 18 : 24}
        className="btn-approval-cont"
      >
        <Tooltip placement="top" title={value}>
          {value && (
            <div
              style={{
                position: "absolute",
                top: "15%",
                zIndex: "1",
                // right: "0px",
                right: "2%",
              }}
            >
              <Tooltip placement="right" title="View uploaded file">
                <Button
                  type="link"
                  className="btn-redirect"
                  onClick={() => handlesOnClick(value)}
                >
                  {icon}
                </Button>
              </Tooltip>
            </div>
          )}

          <FloatInput
            label={label}
            value={value}
            disabled={!value}
            type={type}
            placeholder={placeholder}
            className={className}
          />
        </Tooltip>
      </Col>
      {showButton && (
        <Col lg={6} md={6}>
          {" "}
          {/* <Tooltip placement="right" title="Approve">
            <Button
              style={{ height: "100%" }}
              type="primary"
              className="btn-success"
              onClick={() => onClick("approve")}
            >
              <FontAwesomeIcon icon={faCheck} />
            </Button>
          </Tooltip> */}
          <Tooltip placement="right" title="Checked and verified">
            <Button
              style={{ height: "100%", width: "100%" }}
              type="primary"
              className="btn-success"
              onClick={() => onClick("checked and verified")}
            >
              {" "}
              <FontAwesomeIcon icon={faCheck} />
            </Button>
          </Tooltip>
        </Col>
      )}
    </Row>
  );
};

export default FloatInputWithButttons;
