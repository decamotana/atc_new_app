import React, { useState } from "react";
import { DatePicker } from "antd";

import moment from "moment";

const FloatDateTimePicker = (props) => {
  const [focus, setFocus] = useState(false);
  let { label, value, placeholder, required } = props;

  if (!placeholder) placeholder = label;

  const isOccupied = focus || (value && value.length !== 0);

  const labelClass = isOccupied ? "label as-label" : "label as-placeholder";

  const requiredMark = required ? <span className="text-danger">*</span> : null;

  return (
    <div
      className="float-label"
      onBlur={() => setFocus(false)}
      onFocus={() => setFocus(true)}
    >
      <DatePicker
        onChange={props.onChange}
        defaultValue={value ? moment(value) : ""}
        value={value ? moment(value) : ""}
        size="large"
        showTime
        placeholder={[""]}
        style={{ width: "100%" }}
        className="input-date-picker"
      />
      <label className={labelClass}>
        {isOccupied ? label : placeholder} {requiredMark}
      </label>
    </div>
  );
};

export default FloatDateTimePicker;
