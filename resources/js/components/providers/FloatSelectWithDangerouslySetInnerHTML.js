import React, { useState } from "react";
import { Select } from "antd";

const FloatSelectWithDangerouslySetInnerHTML = (props) => {
	const [focus, setFocus] = useState(false);
	let {
		label,
		value,
		placeholder,
		// type,
		required,
		options,
		disabled,
		// account_type,
		multi,
	} = props;

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
				// defaultValue={value}
				value={value}
				// onChange={props.onChange}
				onChange={(e, option) => props.onChange(e, option)}
				size="large"
				allowClear
				showSearch
				disabled={disabled}
				mode={multi}
				dropdownStyle={{ zIndex: 9999999999 }}
				filterOption={(input, option) => {
					// console.log("option", option);
					return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
				}}
				popupClassName="registrationSelect"
			>
				{options.map((item, key) => {
					// console.log("options", item.label.substring(0, 1));
					if (item.label.substring(0, 1) === "-") {
						return (
							<Select.Option
								key={key}
								value={item.value}
								data-id={item.value}
								data-price={item.price}
								data-plan={item.plan}
								data-policy={item.policy}
								data-json={item.json}
								style={{
									paddingLeft: "25px",
								}}
								label={item.label}
							>
								<span dangerouslySetInnerHTML={{ __html: item.label }} />
							</Select.Option>
						);
					} else {
						return (
							<Select.Option
								key={key}
								value={item.value}
								data-id={item.value}
								data-price={item.price}
								data-plan={item.plan}
								data-policy={item.policy}
								data-json={item.json}
								label={item.label}
							>
								<span dangerouslySetInnerHTML={{ __html: item.label }} />
							</Select.Option>
						);
					}
				})}
			</Select>
			<label className={labelClass}>
				{isOccupied ? label : placeholder} {requiredMark}
			</label>
		</div>
	);
};

export default FloatSelectWithDangerouslySetInnerHTML;
