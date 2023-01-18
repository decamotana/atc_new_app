import React, { useState } from "react";
import { Input } from "antd";

const FloatTextArea = (props) => {
	const [focus, setFocus] = useState(false);
	let { label, value, placeholder, type, required } = props;

	if (!placeholder) placeholder = label;

	const isOccupied = focus || (value && value.length !== 0);

	const labelClass = isOccupied ? "label as-label" : "label as-placeholder";

	const requiredMark = required ? <span className="text-danger">*</span> : null;

	return (
		<div
			className="float-label float-text-feed-back input-text-area-label"
			onBlur={() => setFocus(false)}
			onFocus={() => setFocus(true)}
		>
			<Input.TextArea
				onChange={props.onChange}
				type={type}
				value={value}
				defaultValue={value}
				size="large"
				rows={4}
				className="input-text-area-label"
				onBlur={(e, option) => {
					if (props.onBlurInput) {
						props.onBlurInput(e, option);
					}
				}}
			/>
			<label className={labelClass}>
				{isOccupied ? label : placeholder} {requiredMark}
			</label>
		</div>
	);
};

export default FloatTextArea;
