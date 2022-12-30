import React, { useState, useEffect } from "react";
import { InputNumber } from "antd";

const FloatInputRate = (props) => {
	const [focus, setFocus] = useState(false);
	let { label, value, placeholder, required } = props;

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
			<InputNumber
				onChange={props.onChange}
				value={value}
				size="large"
				autoComplete="off"
				stringMode
				step="0.00"
				// formatter={(value) => formatterNumber(value)}
				// parser={(value) => parserNumber(value)}
				style={{ width: "100%" }}
				className="input-rate"
			/>
			<label className={labelClass}>
				{isOccupied ? label : placeholder} {requiredMark}
			</label>
		</div>
	);
};

export default FloatInputRate;
