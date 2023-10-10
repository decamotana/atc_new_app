import React, { useState } from "react";
import { Select } from "antd";
import { useEffect } from "react";
// import { HeartFilled } from "@ant-design/icons";

const FloatSelect2 = (props) => {
  let {
    label,
    value,
    placeholder,
    required,
    options,
    disabled,
    multi,
    defaultValue,
    dropdownClassName,
    allowClear,
  } = props;
  const [focus, setFocus] = useState(false);
  const [hasValue, setHasValue] = useState(false);
  // const [isOccupied, setIsOccupied] = useState(false);
  // const [labelClass, setLabelClass] = useState("label as-placeholder");

  if (!placeholder) placeholder = label;

  // const isOccupied = focus || (value && value.length != 0);
  const isOccupied =
    focus ||
    (value && value.length != 0) ||
    (defaultValue && defaultValue.length != 0);

  const labelClass = isOccupied ? "label as-label" : "label as-placeholder";

  const multiClass = multi
    ? "float-label float-select-multi"
    : "float-label float-select";

  const requiredMark = required ? <span className="text-danger">*</span> : null;

  useEffect(() => {
    if (!value && defaultValue) {
      value = defaultValue;
    }

    // if (value && value.length > 0) {
    //   setLabelClass("label as-label");
    // } else {
    //   setLabelClass("label as-placeholder");
    // }
  }, [value]);

  const onChange = (value) => {
    if (value.length != 0) {
      setHasValue(true);
    } else {
      setHasValue(false);
    }
  };

  // console.log(props);
  return (
    <div
      className={multiClass}
      onBlur={() => setFocus(false)}
      onFocus={() => setFocus(true)}
    >
      <Select
        style={{ width: "100%" }}
        defaultValue={defaultValue}
        value={value}
        onChange={
          props.onChange
            ? props.onChange
            : (value) => {
                onChange(value);
              }
        }
        // onChange={(e, option) => props.onChange(e, option)}
        size="large"
        allowClear={allowClear ?? allowClear}
        showSearch
        disabled={disabled ? disabled : false}
        mode={multi}
        dropdownClassName={dropdownClassName ?? ""}
      >
        {options.map((item, key) => {
          return (
            <Select.Option key={key} value={item.value}>
              {item.label}
            </Select.Option>
          );
        })}
      </Select>
      <label className={labelClass}>
        {isOccupied ? label : placeholder} {requiredMark}
      </label>
    </div>
  );
};

export default FloatSelect2;
