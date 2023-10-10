import React, { useState, useEffect } from "react";

import { PasswordInput } from "antd-password-input-strength";
const FloatInputPasswordStrength = (props) => {
  const [focus, setFocus] = useState(false);
  let { label, value, placeholder, type, required } = props;

  if (!placeholder) placeholder = label;

  const isOccupied = focus || (value && value.length !== 0);

  const labelClass = isOccupied ? "label as-label" : "label as-placeholder";

  const requiredMark = required ? <span className="text-danger">*</span> : null;

  useEffect(() => {
    // console.log(props)
  }, [props]);

  return (
    <div
      className="float-label"
      onBlur={() => setFocus(false)}
      onFocus={() => setFocus(true)}
    >
      {/* <Input.Password
        onChange={props.onChange}
        type={type}
        value={value}
        size="large"
        autoComplete="off"
      /> */}
      <PasswordInput
        onChange={(e) => props.onChange(e.target.value)}
        type={type}
        value={value}
        size="large"
        autoComplete="off"
      />
      <label className={labelClass}>
        {isOccupied ? label : placeholder} {requiredMark}
      </label>
    </div>
  );
};

export default FloatInputPasswordStrength;
