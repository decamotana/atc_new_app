import { useEffect } from "react";
import { Col, Modal, Row, Typography } from "antd";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf } from "@fortawesome/pro-regular-svg-icons";
import { faTimes } from "@fortawesome/pro-solid-svg-icons";
import moment from "moment";
import pdfInvoice from "../../../../../providers/pdf/pdfInvoice";

export default function ModalCustomerInvoice(props) {
	const { toggleModalInvoice, setToggleModalInvoice } = props;

	useEffect(() => {
		if (toggleModalInvoice.show && toggleModalInvoice.data) {
			setTimeout(() => {
				let amount = parseFloat(toggleModalInvoice?.data.amount);
				let discount = 0;
				let total = parseFloat(toggleModalInvoice?.data.amount);
				let coupon_type = "";
				// let coupon_type_dis = "";
				let coupon_type_dis_label = "";

				if (toggleModalInvoice?.data.coupon) {
					if (toggleModalInvoice?.data.coupon.type === "fixed") {
						discount = toggleModalInvoice?.data.coupon.off;
						coupon_type = "";
						total =
							parseFloat(toggleModalInvoice?.data.amount) -
							toggleModalInvoice?.data.coupon.off;
						// coupon_type_dis = "fxd";
						coupon_type_dis_label = "(fxd)";
					}
					if (toggleModalInvoice?.data.coupon.type === "percent") {
						discount = toggleModalInvoice?.data.coupon.off;
						coupon_type = "%";
						var percentage = toggleModalInvoice?.data.coupon.off / 100;
						total =
							parseFloat(toggleModalInvoice?.data.amount) -
							parseFloat(toggleModalInvoice?.data.amount) * percentage;
						// coupon_type_dis = "%";
						coupon_type_dis_label =
							"(" + toggleModalInvoice?.data.coupon.off + "%)";
					}
				}

				let width = 600;
				let height = 310;

				// console.log(toggleModalInvoice?.data);

				let canvasOutput = document.getElementById("canvasOutput");
				canvasOutput.width = width;
				canvasOutput.height = height;
				let context = canvasOutput.getContext("2d");

				context.rect(0, 0, width, height);
				context.fillStyle = "#FFFFFF";
				context.fill();
				context.lineWidth = 2;
				context.strokeStyle = "#808285";
				context.stroke();

				context.textAlign = "left";

				context.fillStyle = "#027273";
				context.font = "500 18px Arial";
				context.fillText(`Cancer CareGivers`, 20, 40);

				context.fillStyle = "#58585a";
				context.font = "14px Arial";
				context.fillText(`123 Someplace Ave., Chadler, AZ 85224`, 20, 60);

				context.fillStyle = "#58585a";
				context.font = "14px Arial";
				context.fillText(`(800) 123-4567`, 20, 80);

				context.fillStyle = "#58585a";
				context.font = "14px Arial";
				context.fillText(`billing@cancercaregivers.com`, 20, 100);

				context.fillStyle = "#027273";
				context.font = "500 14px Arial";
				context.fillText(`INVOICED TO`, 20, 150);

				context.fillStyle = "#027273";
				context.font = "15px Arial";
				context.fillText(`INVOICED INFORMATION`, width - 250, 150);

				context.fillStyle = "#58585a";
				context.font = "600 17px Arial";
				context.fillText(
					`${toggleModalInvoice?.data?.firstname} ${toggleModalInvoice?.data?.lastname}`,
					20,
					190
				);

				if (toggleModalInvoice?.data?.contact_number) {
					context.fillStyle = "#58585a";
					context.font = "14px Arial";
					context.fillText(
						`${toggleModalInvoice?.data?.contact_number}`,
						20,
						210
					);
				}

				context.font = "14px Arial";
				context.fillText(
					`${toggleModalInvoice?.data?.email}`,
					20,
					toggleModalInvoice?.data?.contact_number ? 230 : 210
				);

				context.fillStyle = "#58585a";
				context.font = "14px Arial";
				context.fillText(
					`${toggleModalInvoice?.data?.role} Employee Certification`,
					20,
					280
				);

				context.textAlign = "right";

				context.fillStyle = "#bdbec0";
				context.font = "600 52px Arial";
				context.fillText(`INVOICE`, width - 20, 60);

				context.textAlign = "left";

				context.fillStyle = "#58585a";
				context.font = "14px Arial";
				context.fillText(`Invoice No.`, width - 250, 190);

				context.fillStyle = "#58585a";
				context.font = "14px Arial";
				context.fillText(`Date Paid`, width - 250, 210);

				context.fillStyle = "#58585a";
				context.font = "14px Arial";
				context.fillText(`Amount`, width - 250, 240);

				context.fillStyle = "#58585a";
				context.font = "14px Arial";
				context.fillText(`Discount ${coupon_type_dis_label}`, width - 250, 260);

				context.strokeStyle = "rgba(0,0,0,.09)";
				context.lineWidth = 1;
				context.beginPath();
				context.moveTo(width - 20, 270);
				context.lineTo(350, 270);
				context.stroke();

				context.fillStyle = "#58585a";
				context.font = "14px Arial";
				context.fillText(`Total`, width - 250, 288);

				context.textAlign = "right";

				context.fillStyle = "#58585a";
				context.font = "14px Arial";
				context.fillText(
					`#${toggleModalInvoice?.data?.invoice_id}`,
					width - 20,
					190
				);

				context.fillStyle = "#58585a";
				context.font = "14px Arial";
				context.fillText(
					`${moment(toggleModalInvoice?.data?.date_paid).format("MM/DD/YYYY")}`,
					canvasOutput.width - 20,
					210
				);

				context.fillStyle = "#58585a";
				context.font = "14px Arial";
				context.fillText(
					`$${parseFloat(amount).toFixed(2)}`,
					canvasOutput.width - 20,
					240
				);

				context.fillStyle = "#e4151f";
				context.font = "14px Arial";
				context.fillText(
					`- $${
						coupon_type !== "$"
							? parseFloat(toggleModalInvoice?.data.amount - total).toFixed(2)
							: parseFloat(discount).toFixed(2)
					}`,
					canvasOutput.width - 20,
					260
				);

				context.fillStyle = "#58585a";
				context.font = "14px Arial";
				context.fillText(
					`$${parseFloat(total).toFixed(2)}`,
					canvasOutput.width - 20,
					288
				);

				// context.fillStyle = "#58585a";
				// context.font = "600 14px Arial";
				// context.fillText(
				// 	`PAID $${parseFloat(toggleModalInvoice?.data?.amount).toFixed(2)}`,
				// 	canvasOutput.width - 189,
				// 	280
				// );
			}, 1000);
		}
		return () => {};
	}, [toggleModalInvoice]);

	const handleInvoicePdf = () => {
		if (toggleModalInvoice?.data?.invoice_id) {
			let circle_canvas = document.getElementById("canvasOutput");

			pdfInvoice(circle_canvas.toDataURL("image/png"));
		}
	};

	return (
		<Modal
			open={toggleModalInvoice.show}
			footer={null}
			onCancel={() => setToggleModalInvoice({ show: false, data: null })}
			className="modal-customer-invoice"
			closeIcon={<FontAwesomeIcon icon={faTimes} />}
		>
			<Row gutter={[12, 12]}>
				<Col xs={24} sm={24} md={24}>
					<canvas
						id="canvasOutput"
						style={{
							width: "100%",
						}}
					></canvas>
				</Col>

				<Col xs={24} sm={24} md={24} className="m-t-md">
					<Typography.Text italic className="invoice-ty">
						Thank you for using Cancer CareGivers to receive your certification.
						Please save this invoice for your records. To download a pdf,{" "}
						<Typography.Link className="color-6" onClick={handleInvoicePdf}>
							click here <FontAwesomeIcon icon={faFilePdf} />
						</Typography.Link>
					</Typography.Text>
				</Col>
			</Row>
		</Modal>
	);
}
