import { useEffect, useState } from "react";
import {
	Button,
	Card,
	Col,
	Collapse,
	Form,
	Modal,
	notification,
	Row,
} from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faTimes } from "@fortawesome/pro-regular-svg-icons";
import SignatureCanvas from "react-signature-canvas";
import FloatSelect from "../../../../providers/FloatSelect";
import dataURItoFile from "../../../../providers/dataURItoFile";
import { GET, POSTFILE } from "../../../../providers/useAxiosQuery";
import pdfImg from "../../../../assets/img/CCG-certificateofcompletion.jpg";
import { apiUrl } from "../../../../providers/companyInfo";

export default function PageCertificateTemplates() {
	const [filterCertificateTemp, setFilterCertificateTemp] = useState({
		type: "",
	});
	const { refetch: refetchCertificateTemplate } = GET(
		`api/v1/certificate_template?${new URLSearchParams(filterCertificateTemp)}`,
		"certificate_template_data",
		(res) => {
			// console.log("res", res);
			if (res.data.length > 0) {
				form.setFieldsValue({ type: res.data[0].type });
				if (res.data[0].file_path) {
					setSignatureValue(apiUrl + "storage/" + res.data[0].file_path);
				} else {
					setSignatureValue();
				}
			} else {
				setSignatureValue();
			}
		}
	);

	const {
		mutate: mutateCreateUpdateCertificateTemp,
		isLoading: isLoadingCreateUpdateCertificateTemp,
	} = POSTFILE("api/v1/certificate_template", "certificate_template_data");

	const [form] = Form.useForm();
	const [signature, setSignature] = useState();
	const [signatureValue, setSignatureValue] = useState();
	const [togglePreviewCert, setTogglePreviewCert] = useState(false);

	const handleClearSignature = () => {
		signature.clear();
		setSignatureValue();
	};

	// addTextToImage(signatureVal, "test test");
	function addTextToImage(props) {
		const { imagePath, signature, date, name } = props;

		let circle_canvas = document.getElementById("canvasOutput");
		circle_canvas.width = imagePath.width;
		circle_canvas.height = imagePath.height;
		let context = circle_canvas.getContext("2d");
		// Draw Image function
		let img = new Image();
		img.src = imagePath.src;
		let signatureImg = new Image();
		signatureImg.src = signature;

		let nameX = imagePath.width / 2 - 60;

		img.onload = function () {
			context.drawImage(img, 0, 0);
			context.drawImage(signatureImg, 130, 420, 250, 100);
			// context.lineWidth = 1;
			// context.fillStyle = "#CC00FF";
			// context.lineStyle = "#ffff00";
			context.font = "25px sans-serif";
			context.textAlign = "center";
			context.fillText(name, nameX, imagePath.height / 2 - 50);

			context.font = "16px sans-serif";
			context.textAlign = "center";
			context.fillText(
				date,
				imagePath.width / 2 + 182,
				imagePath.height / 2 + 140
			);
		};
	}

	const handlePreview = () => {
		// console.log("filterCertificateTemp", filterCertificateTemp);
		let signatureVal = signature.getCanvas().toDataURL("image/png");
		setTogglePreviewCert(true);

		let imgInput = document.getElementById("imgInput");
		setTimeout(() => {
			addTextToImage({
				imagePath: imgInput,
				signature: signature.isEmpty() ? signatureValue : signatureVal,
				date: "MM/DD/YYYY",
				name: "John Doe",
			});
		}, 1000);
	};

	const handleFormSubmit = (values) => {
		let error = false;

		if (values.type === "" || values.type === undefined) {
			error = true;
			notification.error({
				message: "Certificate Template",
				description: "Type is required",
			});
		}

		const data = new FormData();
		data.append("type", values.type);

		if (!signature.isEmpty()) {
			let signatureVal = signature.getCanvas().toDataURL("image/png");
			let signatureValFile = dataURItoFile(signatureVal, "esignature.png");
			data.append("signature_file", signatureValFile, "esignature.png");
		}

		if (error === false) {
			mutateCreateUpdateCertificateTemp(data, {
				onSuccess: (res) => {
					if (res.success) {
						notification.success({
							message: "Certificate Template",
							description: res.message,
						});

						signature.clear();
					} else {
						notification.error({
							message: "Certificate Template",
							description: res.message,
						});
					}
				},
				onError: (err) => {
					notification.error({
						message: "Certificate Template",
						description: err.response.data.message,
					});
				},
			});
		}
	};

	useEffect(() => {
		refetchCertificateTemplate();

		return () => {};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [filterCertificateTemp]);

	return (
		<Card
			className="page-admin-certificate-template"
			id="PageCertificateTemplates"
		>
			<img src={pdfImg} alt="completed" id="imgInput" className="hide" />
			<Form form={form} onFinish={handleFormSubmit}>
				<Collapse
					className="main-1-collapse border-none"
					expandIcon={({ isActive }) =>
						isActive ? (
							<span
								className="ant-menu-submenu-arrow"
								style={{ color: "#FFF", transform: "rotate(270deg)" }}
							></span>
						) : (
							<span
								className="ant-menu-submenu-arrow"
								style={{ color: "#FFF", transform: "rotate(90deg)" }}
							></span>
						)
					}
					defaultActiveKey={["1"]}
					expandIconPosition="start"
				>
					<Collapse.Panel
						header="STEP 1 - COURSE COMPLETION"
						key="1"
						className="accordion bg-darkgray-form m-b-md border bgcolor-1 white"
					>
						<Row>
							<Col xs={24} sm={24} md={24} lg={12}>
								<Form.Item
									name="type"
									rules={[
										{
											require: {
												required: true,
												message: "Required",
											},
										},
									]}
									hasFeedback
									className="form-select-error"
								>
									<FloatSelect
										label="Select Type"
										placeholder="Select Type"
										options={[
											{
												value: "Cancer Caregiver",
												label: "Cancer Caregiver Completion",
											},
											{
												value: "Cancer Care Professional",
												label: "Cancer Care Professional Completion",
											},
										]}
										onChange={(e) => {
											if (e) {
												setFilterCertificateTemp({ type: e });
												setSignatureValue();
											}
										}}
									/>
								</Form.Item>
							</Col>
						</Row>
					</Collapse.Panel>
				</Collapse>

				{filterCertificateTemp.type !== "" ? (
					<Collapse
						className="main-1-collapse border-none"
						expandIcon={({ isActive }) =>
							isActive ? (
								<span
									className="ant-menu-submenu-arrow"
									style={{ color: "#FFF", transform: "rotate(270deg)" }}
								></span>
							) : (
								<span
									className="ant-menu-submenu-arrow"
									style={{ color: "#FFF", transform: "rotate(90deg)" }}
								></span>
							)
						}
						defaultActiveKey={["1"]}
						expandIconPosition="start"
					>
						<Collapse.Panel
							header="STEP 2 - CREATE & ADD SIGNATURE"
							key="1"
							className="accordion bg-darkgray-form m-b-md border bgcolor-1 white panel-create-signature"
						>
							<Row gutter={[12, 12]}>
								<Col xs={24} sm={24} md={24} lg={24} xl={12} xxl={12}>
									<Card className="card-main" title="Create">
										<div className="e_signature_canvas_wrapper">
											<SignatureCanvas
												penColor="#000000"
												canvasProps={{
													className: "e_signature_canvas",
												}}
												ref={(ref) => setSignature(ref)}
											/>
										</div>
									</Card>
								</Col>

								<Col xs={24} sm={24} md={24} lg={24} xl={12} xxl={12}>
									<Card className="card-main" title="Saved">
										<div className="img_preview_signature_container_outer text-center">
											<div className="img_preview_signature_container">
												{signatureValue && (
													<img
														src={signatureValue}
														alt="signature"
														className="img_preview_signature"
													/>
												)}
											</div>
										</div>
									</Card>
								</Col>
								<Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
									<div className="btn-clear-save">
										<Button
											size="large"
											className="btn-main-invert-outline-active b-r-none"
											onClick={handleClearSignature}
										>
											CLEAR
										</Button>
										<Button
											className="btn-main-invert-outline b-r-none"
											size="large"
											onClick={handlePreview}
											icon={<FontAwesomeIcon icon={faEye} className="m-r-xs" />}
										>
											PREVIEW CERTIFICATE
										</Button>
										<Button
											size="large"
											className="btn-main-invert-outline b-r-none"
											loading={isLoadingCreateUpdateCertificateTemp}
											htmlType="submit"
										>
											SAVE
										</Button>
									</div>
								</Col>
							</Row>
						</Collapse.Panel>
					</Collapse>
				) : null}
			</Form>

			<Modal
				title="Preview Certificate"
				className="modal-primary-default modal-certificate-template-preview"
				closeIcon={<FontAwesomeIcon icon={faTimes} />}
				open={togglePreviewCert}
				width="55%"
				onCancel={(e) => setTogglePreviewCert(false)}
				footer={
					<Button
						onClick={(e) => {
							setTogglePreviewCert(false);
						}}
						className="btn-main-invert-outline-active b-r-none"
						size="large"
					>
						Close
					</Button>
				}
			>
				<canvas
					id="canvasOutput"
					style={{ width: "100%", height: "100%" }}
				></canvas>
			</Modal>
		</Card>
	);
}
