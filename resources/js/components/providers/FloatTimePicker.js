import React, { useState } from "react";
import { TimePicker } from "antd";

const FloatTimePicker = (props) => {
	const [focus, setFocus] = useState(false);
	let {
		label,
		value,
		placeholder,
		// type,
		required,
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
			<TimePicker
				onChange={props.onChange}
				defaultValue={value}
				value={value}
				size="large"
				placeholder={[""]}
				style={{ width: "100%" }}
				className="input-date-picker"
				format={"HH:mm"}
			/>
			<label className={labelClass}>
				{isOccupied ? label : placeholder} {requiredMark}
			</label>
		</div>
	);
};

export default FloatTimePicker;
