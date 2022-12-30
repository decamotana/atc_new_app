import React, { useState } from "react";
import { DatePicker } from "antd";

import moment from "moment";
const FloatDatePicker = (props) => {
	const [focus, setFocus] = useState(false);
	let {
		label,
		value,
		placeholder,
		required,
		dropdownClassName,
		format,
		picker,
		disabled,
		disabledDate,
	} = props;

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
				onChange={(date, dateString) => props.onChange(date, dateString, 1)}
				defaultValue={value ? moment(value) : ""}
				value={value ? moment(value) : ""}
				size="large"
				placeholder={[""]}
				style={{ width: "100%" }}
				className="input-date-picker"
				dropdownClassName={dropdownClassName ?? ""}
				format={format ? format : "DD/MM/YYYY"}
				allowClear={false}
				onBlur={(date, dateString) => {
					if (props.onBlurInput) {
						props.onBlurInput(date, dateString);
					}
				}}
				picker={picker ? picker : "date"}
				disabled={disabled ? disabled : false}
				disabledDate={(current) => {
					if (disabledDate) {
						return disabledDate(current);
					} else {
						return false;
					}
				}}
			/>
			<label className={labelClass}>
				{isOccupied ? label : placeholder} {requiredMark}
			</label>
		</div>
	);
};

export default FloatDatePicker;
