import React, { useState } from "react";
import { AutoComplete } from "antd";

const FloatAutoComplete = (props) => {
	const [focus, setFocus] = useState(false);
	let { label, value, placeholder, required, options, disabled } = props;

	if (!placeholder) placeholder = label;

	const isOccupied = focus || (value && value.length !== 0);

	const labelClass = isOccupied ? "label as-label" : "label as-placeholder";

	const requiredMark = required ? <span className="text-danger">*</span> : null;

	// console.log(props)

	return (
		<div
			className="float-label"
			onBlur={() => setFocus(false)}
			onFocus={() => setFocus(true)}
		>
			<AutoComplete
				style={{ width: "100%" }}
				value={value ?? ""}
				// onChange={props.onChange}
				onChange={(e, option) => props.onChange(e, option)}
				size="large"
				showSearch
				allowClear
				filterOption={(inputValue, option) =>
					option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
				}
				disabled={disabled}
			>
				{options.map((item, key) => {
					return (
						<AutoComplete.Option
							key={key}
							value={item.label}
							data-id={item.value}
							data-json={item.json}
						>
							{" "}
							{item.label}
						</AutoComplete.Option>
					);
				})}
			</AutoComplete>
			{/* <Input onChange={props.onChange} type={type} defaultValue={value} /> */}
			<label className={labelClass}>
				{isOccupied ? label : placeholder} {requiredMark}
			</label>
		</div>
	);
};

export default FloatAutoComplete;
