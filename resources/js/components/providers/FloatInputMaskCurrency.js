import React, { useState, useEffect } from "react";
import NumberFormat from "react-number-format";
const FloatInputMaskCurrency = (props) => {
  const [focus, setFocus] = useState(false);
  let { label, value, placeholder, required, disabled, onBlur, name } = props;

  if (!placeholder) placeholder = label;

  const isOccupied = focus || (value && value.length !== 0);

  const labelClass = isOccupied ? "label as-label" : "label as-placeholder";

  const requiredMark = required ? <span className="text-danger"></span> : null;

  useEffect(() => {
    console.log(props);
  }, [props]);

  return (
    <div
      className="float-label"
      onBlur={() => setFocus(false)}
      onFocus={() => setFocus(true)}
    >
      <NumberFormat
        className="ant-input ant-input-lg"
        value={value}
        name={name}
        prefix="$"
        size="large"
        disabled={disabled}
        style={{ width: "100%" }}
        onBlur={onBlur}
        thousandSeparator={true}
        decimalScale={2}
        fixedDecimalScale={true}
      />
      <label className={labelClass}>
        {isOccupied ? label : placeholder} {requiredMark}
      </label>
    </div>
  );
};

export default FloatInputMaskCurrency;
