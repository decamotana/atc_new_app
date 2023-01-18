import { useState } from "react";
import { Card, Col, Collapse, Row, Typography } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf } from "@fortawesome/pro-solid-svg-icons";
import { role, userData } from "../../../providers/companyInfo";
import moment from "moment";
import { GET } from "../../../providers/useAxiosQuery";
import pdfInvoice from "../../../providers/pdf/pdfInvoice";

export default function PagePaymentAndInvoices(props) {
	const { location } = props;

	// console.log("props", props);

	const [dataUserPayment, setDataUserPayment] = useState([]);
	const [invoiceData, setInvoiceData] = useState();

	GET(`api/v1/user_payment`, "user_payment_dashboard_list", (res) => {
		// console.log("user_payment_dashboard_list", res.data);
		if (res.data) {
			setDataUserPayment(res.data);
			if (res.data.length > 0) {
				handleShowInvoiceData(res.data[0]);
			}
			if (location && location.state) {
				setInvoiceData(location.state);
			} else {
				setInvoiceData(res.data.length > 0 ? res.data[0] : {});
			}
		}
	});

	const handleShowInvoiceData = (record) => {
		let amount = parseFloat(record.amount);
		let discount = 0;
		let total = parseFloat(record.amount);
		let coupon_type = "";
		let coupon_type_dis = "";

		let percentage = 0;

		if (record.coupon) {
			if (record.coupon.type === "fixed") {
				discount = record.coupon.off;
				coupon_type = "$";
				total = parseFloat(record.amount) - record.coupon.off;
				coupon_type_dis = "(fxd)";
			}
			if (record.coupon.type === "percent") {
				discount = record.coupon.off;
				coupon_type = "%";
				percentage = record.coupon.off / 100;
				total =
					parseFloat(record.amount) - parseFloat(record.amount) * percentage;
				coupon_type_dis = "(" + record.coupon.off + "%)";
			}
		}

		let width = 600;
		let height = 310;

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
		context.fillText(`${userData().firstname} ${userData().lastname}`, 20, 190);
		context.fillStyle = "#58585a";

		if (userData().contact_number) {
			context.fillStyle = "#58585a";
			context.font = "14px Arial";
			context.fillText(`${userData().contact_number}`, 20, 210);
		}

		context.font = "14px Arial";
		context.fillText(
			`${userData().email}`,
			20,
			userData().contact_number ? 230 : 210
		);

		context.fillStyle = "#58585a";
		context.font = "14px Arial";
		context.fillText(`${role()} Employee Certification`, 20, 280);

		context.textAlign = "right";

		context.fillStyle = "#bdbec0";
		context.font = "600 52px Arial";
		context.fillText(`INVOICE`, width - 20, 65);

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
		context.fillText(`Discount ${coupon_type_dis}`, width - 250, 260);

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
		context.fillText(`#${record.invoice_id}`, width - 20, 190);

		context.fillStyle = "#58585a";
		context.font = "14px Arial";
		context.fillText(
			`${moment(record.date_paid).format("MM/DD/YYYY")}`,
			width - 20,
			210
		);

		context.fillStyle = "#58585a";
		context.font = "14px Arial";
		context.fillText(`$${parseFloat(amount).toFixed(2)}`, width - 20, 240);

		context.fillStyle = "#e4151f";
		context.font = "14px Arial";
		context.fillText(
			`- $${
				coupon_type !== "$"
					? parseFloat(record.amount - total).toFixed(2)
					: parseFloat(discount).toFixed(2)
			}`,
			width - 20,
			260
		);

		context.fillStyle = "#58585a";
		context.font = "14px Arial";
		context.fillText(`$${parseFloat(total).toFixed(2)}`, width - 20, 288);

		// context.fillStyle = "#58585a";
		// context.font = "600 14px Arial";
		// context.fillText(
		// 	`PAID $${parseFloat(record.amount).toFixed(2)}`,
		// 	canvasOutput.width - 189,
		// 	280
		// );
	};

	const handleInvoicePdf = () => {
		if (invoiceData.invoice_id) {
			let circle_canvas = document.getElementById("canvasOutput");

			pdfInvoice(circle_canvas.toDataURL("image/png"));
		}
	};

	return (
		<Card className="page-payment-and-invoices" id="PagePaymentAndInvoices">
			<Row gutter={[12, 20]}>
				<Col xs={24} sm={24} md={24} lg={14}>
					<canvas
						id="canvasOutput"
						style={{
							width: "100%",
						}}
					></canvas>

					<Typography.Text italic className="m-t-lg">
						Thank you for using Cancer CareGivers to receive your certification.
						Please save this invoice for your records. To download a pdf,{" "}
						<Typography.Text
							strong
							className="color-6 cursor-pointer"
							onClick={handleInvoicePdf}
						>
							click here <FontAwesomeIcon icon={faFilePdf} />{" "}
						</Typography.Text>
					</Typography.Text>
				</Col>

				<Col xs={24} sm={24} md={24} lg={10}>
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
							header="RECENT INVOICES"
							key="1"
							className="accordion bg-darkgray-form m-b-md border collapse-recent-invoices"
						>
							<table className="table table-striped m-b-n">
								<thead>
									<tr>
										<th>Invoice</th>
										<th>Date</th>
										<th>Amount</th>
									</tr>
								</thead>
								<tbody>
									{dataUserPayment.map((item, index) => {
										let total = item.amount ? parseFloat(item.amount) : 0;

										if (item.coupon) {
											if (item.coupon.type === "fixed") {
												total = parseFloat(item.amount) - item.coupon.off;
											}
											if (item.coupon.type === "percent") {
												var percentage = item.coupon.off / 100;
												total =
													parseFloat(item.amount) -
													parseFloat(item.amount) * percentage;
											}
										}

										return (
											<tr key={index}>
												<td>
													<Typography.Link
														className="color-6"
														onClick={() => handleShowInvoiceData(item)}
													>
														#{item.invoice_id}
													</Typography.Link>
												</td>
												<td>
													{moment(item.date_paid).format("MMMM DD, YYYY")}
												</td>
												<td>${parseFloat(total).toFixed(2)}</td>
											</tr>
										);
									})}
								</tbody>
							</table>
						</Collapse.Panel>
					</Collapse>
				</Col>
			</Row>
		</Card>
	);
}
