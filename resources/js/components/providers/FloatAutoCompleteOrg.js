import React, { useState } from "react";
import { AutoComplete, Col, Row } from "antd";

const FloatAutoCompleteOrg = (props) => {
	const [focus, setFocus] = useState(false);
	let { label, value, placeholder, required, options, disabled, allowClear } =
		props;

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
				onChange={(e, option) => props.onChange(e, option)}
				size="large"
				showSearch
				allowClear={allowClear ?? allowClear}
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
							<Row gutter={12} style={{ paddingBottom: "0px", height: "42px" }}>
								<Col xs={12} sm={12}>
									<b>{item.label}</b>
								</Col>
								<Col xs={12} sm={12} style={{ textAlign: "right" }}>
									{item.json.status === "Pending" ? (
										<span>{item.json.status}</span>
									) : (
										<span className="color-7">{item.json.status}</span>
									)}
								</Col>
								<Col xs={24} sm={24}>
									<p style={{ fontSize: "12px", marginTop: "-5px" }}>
										{item.json.city}
										{", "} {item.json.state}
										{", "} {item.json.country}
									</p>
								</Col>
							</Row>
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

export default FloatAutoCompleteOrg;
