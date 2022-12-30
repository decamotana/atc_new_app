import React, { useState, useEffect } from "react";
import $ from "jquery";

import { CheckCircleFilled, CloseCircleOutlined } from "@ant-design/icons";

import InputMask from "react-input-mask";

const FloatInputCard = (props) => {
	const [focus, setFocus] = useState(false);
	let { label, value, placeholder, required, onChange } = props;

	if (!placeholder) placeholder = label;

	const isOccupied = focus || (value && value.length !== 0);

	const labelClass = isOccupied ? "label as-label" : "label as-placeholder";

	const requiredMark = required ? <span className="text-danger">*</span> : null;

	const [classPlaceholder] = useState();
	const [classPlaceholderSuccess, setClassPlaceholderSuccess] = useState();
	const [classPlaceholderError, setClassPlaceholderError] = useState();

	useEffect(() => {
		const _classPlaceholder = placeholder.split(" ");
		let a = "";
		_classPlaceholder.forEach((item) => {
			a += item;
		});

		// console.log(a);

		setClassPlaceholderSuccess("mask-success-" + a);
		setClassPlaceholderError("mask-error-" + a);
	}, [placeholder]);

	useEffect(() => {
		if (focus) {
			if (value.length !== 0) {
				// console.log($(`.${classPlaceholderSuccess}`))
				$(`.${classPlaceholderSuccess}`).removeClass("hide");
				$(`.${classPlaceholderError}`).addClass("hide");
			} else {
				$(`.${classPlaceholderSuccess}`).addClass("hide");
				$(`.${classPlaceholderError}`).removeClass("hide");
			}
		}
	}, [classPlaceholderError, classPlaceholderSuccess, focus, value]);

	return (
		<div
			className="float-label"
			onBlur={() => setFocus(false)}
			onFocus={() => setFocus(true)}
		>
			{/* <Input
        onChange={props.onChange}
        type={type}
        value={value}
        size="large"
        autoComplete="off" 
      /> */}
			<InputMask
				mask="9999 9999 9999 9999"
				onChange={onChange}
				value={value ?? ""}
				alwaysShowMask={false}
				// maskPlaceholder=""
				className={`mask-input mask-input-antd ` + classPlaceholder}
			/>

			<span className={"maskhasfeedback " + classPlaceholderSuccess + " hide"}>
				<CheckCircleFilled />
			</span>
			<span
				className={"maskhasfeedback-error " + classPlaceholderError + " hide"}
			>
				<CloseCircleOutlined />
			</span>

			<label className={labelClass}>
				{isOccupied ? label : placeholder} {requiredMark}
			</label>
		</div>
	);
};

export default FloatInputCard;
