import React, { useEffect, useState } from "react";
import { Button, Select } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmarkCircle } from "@fortawesome/pro-solid-svg-icons";

const FloatSelect = (props) => {
  let {
    showSelect,
    setShowSelect,
    label,
    value,
    placeholder,
    required,
    options,
    open,
    disabled,
    multi,
    dropdownClassName,
    allowClear,
  } = props;
  const [focus, setFocus] = useState(false);
  const [isOccupied, setIsOccupied] = useState(
    focus || (value && value.length !== 0)
  );

  useEffect(() => {
    if (!focus) {
      setIsOccupied(false);
    } else {
      setIsOccupied(true);
    }
  }, [focus]);

  if (!placeholder) placeholder = label;

  const labelClass = isOccupied ? "label as-label" : "label as-placeholder";

  const multiClass = multi
    ? "float-label float-select-multi"
    : "float-label float-select";

  const requiredMark = required ? <span className="text-danger">*</span> : null;

  // console.log(props);
  return (
    <div
      className={multiClass}
      // onBlur={() => setFocus(false)}
      onFocus={() => setFocus(true)}
    >
      <Select
        style={{ width: "100%" }}
        defaultValue={value}
        value={value}
        // onChange={props.onChange}
        onChange={(e, option) => props.onChange(e, option)}
        size="large"
        allowClear={allowClear ?? allowClear}
        open={open}
        showSearch
        disabled={disabled ? disabled : false}
        mode={multi}
        dropdownClassName={dropdownClassName ?? ""}
        onBlur={(e, option) => {
          if (props.onBlurInput) {
            props.onBlurInput(e, option);
          }
        }}
        filterOption={(input, option) => {
          // console.log("option", option);
          return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
        }}
      >
        {options.map((item, key) => {
          return (
            <Select.Option
              key={key}
              value={item.value}
              data-json={item.json}
              label={item.label}
            >
              {" "}
              {item.label}
            </Select.Option>
          );
        })}
      </Select>
      <label className={labelClass}>
        {isOccupied ? label : placeholder} {requiredMark}
      </label>
      {focus && (
        <div style={{ position: "absolute", top: "0px", right: "5px" }}>
          <Button
            type="text"
            style={{
              padding: "0px",
              height: "auto",
              fontSize: "12px",
              color: "#d1d3d5",
            }}
            onClick={() => {
              setFocus(false);
              setShowSelect({ consultant: false, schedule: false });
            }}
          >
            <FontAwesomeIcon icon={faXmarkCircle} />
          </Button>
        </div>
      )}
    </div>
  );
};

export default FloatSelect;
