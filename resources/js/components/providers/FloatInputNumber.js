import React, { useState } from "react";
import { InputNumber } from "antd";

const FloatInputNumber = (props) => {
	const [focus, setFocus] = useState(false);
	let { label, value, placeholder, required, onChange } = props;

	if (!placeholder) placeholder = label;

	const isOccupied = focus || (value && value.length !== 0);

	const labelClass = isOccupied ? "label as-label" : "label as-placeholder";

	const requiredMark = required ? <span className="text-danger">*</span> : null;

	// useEffect(() => {
	// 	// console.log(props)
	// }, [props]);

	return (
		<div
			className="float-label input-number"
			onBlur={() => setFocus(false)}
			onFocus={() => setFocus(true)}
		>
			<InputNumber
				onChange={onChange}
				type={"float"}
				value={value ?? ""}
				size="large"
				style={{ width: "100%" }}
			/>
			<label className={labelClass}>
				{isOccupied ? label : placeholder} {requiredMark}
			</label>
		</div>
	);
};

export default FloatInputNumber;
