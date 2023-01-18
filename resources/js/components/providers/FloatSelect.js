import React, { useState } from "react";
import { Select } from "antd";

const FloatSelect = (props) => {
	let {
		label,
		value,
		placeholder,
		required,
		options,
		disabled,
		multi,
		dropdownClassName,
		allowClear,
	} = props;
	const [focus, setFocus] = useState(false);

	if (!placeholder) placeholder = label;

	const isOccupied = focus || (value && value.length !== 0);

	const labelClass = isOccupied ? "label as-label" : "label as-placeholder";

	const multiClass = multi
		? "float-label float-select-multi"
		: "float-label float-select";

	const requiredMark = required ? <span className="text-danger">*</span> : null;

	// console.log(props);
	return (
		<div
			className={multiClass}
			onBlur={() => setFocus(false)}
			onFocus={() => setFocus(true)}
		>
			<Select
				style={{ width: "100%" }}
				defaultValue={value}
				value={value}
				// onChange={props.onChange}
				onChange={(e, option) => props.onChange(e, option)}
				size="large"
				allowClear={allowClear ?? allowClear}
				showSearch
				disabled={disabled ? disabled : false}
				mode={multi}
				popupClassName={dropdownClassName ?? ""}
				onBlur={(e, option) => {
					if (props.onBlurInput) {
						props.onBlurInput(e, option);
					}
				}}
				filterOption={(input, option) => {
					// console.log("option", option);
					return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
				}}
			>
				{options.map((item, key) => {
					return (
						<Select.Option
							key={key}
							value={item.value}
							data-json={item.json}
							label={item.label}
						>
							{" "}
							{item.label}
						</Select.Option>
					);
				})}
			</Select>
			<label className={labelClass}>
				{isOccupied ? label : placeholder} {requiredMark}
			</label>
		</div>
	);
};

export default FloatSelect;
