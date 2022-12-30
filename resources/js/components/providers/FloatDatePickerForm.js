import React, { useState } from "react";
import { DatePicker } from "antd";
import moment from "moment";

const FloatDatePickerForm = (props) => {
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
				value={value ? moment(value) : ""}
				size="large"
				placeholder={[""]}
				style={{ width: "100%" }}
				className="input-date-picker"
				// // format="YYYY-MM-DD"
				// picker={picker ? picker : null}
				// disabled={disable ? disable : false}
			/>
			<label className={labelClass}>
				{isOccupied ? label : placeholder} {requiredMark}
			</label>
		</div>
	);
};

export default FloatDatePickerForm;
