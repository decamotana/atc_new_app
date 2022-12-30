import React, { useState, useEffect } from "react";

import { CheckCircleFilled, CloseCircleOutlined } from "@ant-design/icons";
import $ from "jquery";
import InputMask from "react-input-mask";

const FloatInputMask = (props) => {
	const [focus, setFocus] = useState(false);
	let {
		label,
		value,
		placeholder,
		required,
		maskType,
		maskLabel,
		validateStatus,
		onBlurInput,
	} = props;
	if (!placeholder) placeholder = label;
	if (validateStatus === undefined) {
		validateStatus = false;
	}
	const isOccupied = focus || (value && value.length !== 0);

	const labelClass = isOccupied ? "label as-label" : "label as-placeholder";

	const requiredMark = required ? <span className="text-danger">*</span> : null;

	const [classPlaceholder, setClassPlaceholder] = useState(
		"placeholder-" + maskLabel
	);
	const [classPlaceholderSuccess, setClassPlaceholderSuccess] = useState();
	const [classPlaceholderError, setClassPlaceholderError] = useState();

	useEffect(() => {
		setClassPlaceholderSuccess("mask-success-" + maskLabel);
		setClassPlaceholderError("mask-error-" + maskLabel);
	}, [maskLabel]);

	useEffect(() => {
		if (!validateStatus) {
			if (value !== undefined) {
				let val = value ? value.substring(0, 1) : "";
				if (val !== "_") {
					if (value !== "") {
						$(`.${classPlaceholderSuccess}`).removeClass("hide");
						$(`.${classPlaceholderError}`).addClass("hide");
						setClassPlaceholder("mask-success-" + maskLabel);
					} else {
						setClassPlaceholder("mask-input-antd-error-border");
						$(`.${classPlaceholderSuccess}`).addClass("hide");
						$(`.${classPlaceholderError}`).removeClass("hide");
					}
					// $("." + classPlaceholder).val("");
				} else {
					// $(`.${classPlaceholderSuccess}`).addClass("hide");
				}
			}
		} else {
			setClassPlaceholder("mask-input-antd-error-border");
			$(`.${classPlaceholderSuccess}`).addClass("hide");
			$(`.${classPlaceholderError}`).removeClass("hide");
		}
		// console.log("FloatInputMask", props);
	}, [
		classPlaceholderError,
		classPlaceholderSuccess,
		maskLabel,
		value,
		validateStatus,
	]);

	const formatChars = {
		9: "[0-9]",
		a: "[A-Za-z]",
		"*": "[A-Za-z0-9]",
	};

	return (
		<div
			className="float-label"
			onBlur={() => setFocus(false)}
			onFocus={() => setFocus(true)}
		>
			<InputMask
				formatChars={formatChars}
				alwaysShowMask={false}
				onChange={(e) => {
					if (props.onChange) {
						props.onChange(e);
					}
				}}
				// maskPlaceholder=""
				mask={maskType ? maskType : "9999 9999 9999 9999"}
				value={value ? value : ""}
				className={`mask-input mask-input-antd ` + classPlaceholder}
				onBlur={(e) => {
					if (onBlurInput) {
						onBlurInput(e.target.value);
					}
				}}
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

export default FloatInputMask;
