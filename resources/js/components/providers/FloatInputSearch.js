import React, { useState } from "react";
import { Input } from "antd";

import { SearchOutlined } from "@ant-design/icons";
const FloatInputSearch = (props) => {
	const [focus, setFocus] = useState(false);
	let { label, value, placeholder, required } = props;

	if (!placeholder) placeholder = label;

	const isOccupied = focus || (value && value.length !== 0);

	const labelClass = isOccupied ? "label as-label" : "label as-placeholder";

	const requiredMark = required ? <span className="text-danger">*</span> : null;

	const suffix = (
		<SearchOutlined
			style={{
				fontSize: 16,
				color: "#1890ff",
			}}
		/>
	);

	return (
		<div
			className="float-label"
			onBlur={() => setFocus(false)}
			onFocus={() => setFocus(true)}
		>
			<Input
				// onSearch={(e) =>
				//   props.setDataTableInfo({
				//     ...props.dataTableInfo,
				//     search: e,
				//     page_number: 1,
				//   })
				// }
				onChange={(e) => props.onChange(e.target.value)}
				value={value}
				size="large"
				autoComplete="off"
				suffix={suffix}
				style={{ width: "100%" }}
				allowClear
			/>
			<label className={labelClass}>
				{isOccupied ? label : placeholder} {requiredMark}
			</label>
		</div>
	);
};

export default FloatInputSearch;
