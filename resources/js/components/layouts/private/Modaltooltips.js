import React, { useEffect, useState } from "react";
import {
	Row,
	Col,
	Space,
	Modal,
	Form,
	Button,
	notification,
	Radio,
	Popconfirm,
} from "antd";
import { POST, DELETE } from "../../providers/useAxiosQuery";
import FloatSelect from "../../providers/FloatSelect";
import FloatInput from "../../providers/FloatInput";
import FloatTextArea from "../../providers/FloatTextArea";

import { SaveOutlined } from "@ant-design/icons";
const Modaltooltips = ({
	showTooltipModal,
	setShowTooltipModal,
	selector,
	formDataTooltip,
	// setFormDataTooltip,
	selectorInsertat,
	selectorIsreq,
	//   getToolTips,
}) => {
	useEffect(() => {
		if (formDataTooltip.id) {
			// console.log(formDataTooltip);
			form.setFieldsValue({
				...formDataTooltip,
			});

			setType(formDataTooltip.tooltip_type);
		} else {
			form.setFieldsValue({
				...formDataTooltip,
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [formDataTooltip]);

	const validator = {
		require: {
			required: true,
			message: "Required",
		},
		require_false: {
			required: false,
			message: "Required",
		},
		email: {
			type: "email",
			message: "please enter a valid email",
		},
	};
	const [type, setType] = useState("text");
	const [form] = Form.useForm();
	const { mutate: mutateToolTip, isLoading: isLoadingmutateToolTip } = POST(
		"api/v1/tooltips",
		"tooltips_mutate"
	);

	const handleSubmitToolTip = (data) => {
		let _data = {
			...data,
			selector: selector,
			inserted_at: selectorInsertat,
			tooltip_type: type,
			id: formDataTooltip.id ? formDataTooltip.id : 0,
			is_req: selectorIsreq,
		};
		// console.log(_data);
		mutateToolTip(_data, {
			onSuccess: (res) => {
				if (formDataTooltip.id) {
					notification.success({
						message: "ToolTip Successfully Updated",
					});
				} else {
					notification.success({
						message: "ToolTip Successfully Created",
					});
				}

				setShowTooltipModal(false);
				window.location.reload();
			},
			onError: (err) => {
				// console.log(err);
			},
		});
	};

	const {
		mutate: mutateDeleteToolTip,
		isLoading: isLoadingMutateDeleteToolTip,
	} = DELETE("api/v1/tooltips", "boarding_table");

	const handleTooltipDelete = (id) => {
		mutateDeleteToolTip(
			{ id: formDataTooltip.id },
			{
				onSuccess: (res) => {
					if (res.success) {
						notification.success({
							message: "ToolTip Successfully Deleted",
						});
						window.location.reload();
					}
				},
			}
		);
	};

	return (
		<>
			<Modal
				open={showTooltipModal}
				onCancel={() => {
					setShowTooltipModal(false);
				}}
				width={500}
				title={"Tooltip"}
				footer={[
					<Popconfirm
						title="Are you sure to delete this Tooltip?"
						onConfirm={(e) => handleTooltipDelete()}
						// onCancel={cancel}
						okText="Yes"
						cancelText="No"
					>
						<Button
							style={{ display: formDataTooltip.id ? "initial" : "none" }}
							className="btn-warning-outline"
							icon={<SaveOutlined />}
							// onClick={handleTooltipDelete}
							loading={isLoadingMutateDeleteToolTip}
						>
							Delete
						</Button>
					</Popconfirm>,
					<Button
						onClick={() => {
							setShowTooltipModal(false);
						}}
					>
						Cancel
					</Button>,
					<Button
						className="btn-main-invert"
						icon={<SaveOutlined />}
						onClick={() => form.submit()}
						loading={isLoadingmutateToolTip}
					>
						Save
					</Button>,
				]}
			>
				<Form
					onFinish={handleSubmitToolTip}
					form={form}
					onValuesChange={(change, values) => {
						if (change.tooltip_type) {
							if (change.tooltip_type === "text") {
								setType("text");
							}
							if (change.tooltip_type === "video") {
								setType("video");
							}
						}
					}}
				>
					<Form.Item
						name="position"
						rules={[validator.require]}
						className="form-select-error"
					>
						<FloatSelect
							label="Tooltip Position"
							placeholder="Tooltip Position"
							options={[
								{
									label: "Top",
									value: "Top",
								},
								{
									label: "Bottom",
									value: "Bottom",
								},
								{
									label: "Right",
									value: "Left",
								},
								{
									label: "Left",
									value: "Right",
								},
							]}
						/>
					</Form.Item>

					<Form.Item
						name="tooltip_color"
						rules={[validator.require]}
						className="form-select-error"
					>
						<FloatSelect
							label="Tooltip Color"
							placeholder="Tooltip Color"
							options={[
								{
									label: "Success",
									value: "success",
								},
								{
									label: "Primary",
									value: "primary",
								},
								{
									label: "Warning",
									value: "warning",
								},
								{
									label: "Danger",
									value: "danger",
								},
							]}
						/>
					</Form.Item>
					<Row>
						<Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
							<Space direction="vertical">
								<Form.Item name="tooltip_type" label="Tool type">
									<Radio.Group defaultValue={"text"}>
										<Radio value="text">Text </Radio>
										<Radio value="video">Video </Radio>
									</Radio.Group>
								</Form.Item>
							</Space>
						</Col>
					</Row>
					{type === "text" && (
						<Form.Item name="description" rules={[validator.require]}>
							<FloatTextArea label="Description" placeholder="Description" />
						</Form.Item>
					)}
					{type === "video" && (
						<Form.Item name="video_url" rules={[validator.require]}>
							<FloatInput label="Video url" placeholder="Video url" />
						</Form.Item>
					)}
				</Form>
			</Modal>
		</>
	);
};

export default Modaltooltips;
