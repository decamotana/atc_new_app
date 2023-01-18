import { useEffect } from "react";
import { faFilePdf, faTimes } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Col, Modal, Row, Typography } from "antd";
import pdfRevenueReport from "../../../../../providers/pdf/pdfRevenueReport";
import { fullwidthlogo } from "../../../../../providers/companyInfo";
import PDF, { Text, AddPage, Line, Image, Table, Html } from "jspdf-react";
import html2pdf from "html2pdf.js";

const styleH1 = {
	fontSize: "15px",
	textAlign: "center",
	color: "red",
};

const invisibleStyle = {
	display: "none",
};

export default function ModalRevenueReport(props) {
	const { revenueReport, setRevenueReport } = props;

	// useEffect(() => {
	// 	if (revenueReport.open) {
	// 		setTimeout(() => {
	// 			if (revenueReport.chartImg) {
	// 				let width = 2550;
	// 				let height = 3300;

	// 				console.log("revenueReport", revenueReport);

	// 				let canvasOutput = document.getElementById("canvasOutput");
	// 				canvasOutput.width = width;
	// 				canvasOutput.height = height - 100;
	// 				let context = canvasOutput.getContext("2d");

	// 				// let img = new Image();
	// 				// img.width = width;
	// 				// img.height = height;
	// 				let imgFullwidthlogo = new Image();
	// 				imgFullwidthlogo.width = 380;
	// 				imgFullwidthlogo.height = 300;
	// 				imgFullwidthlogo.src = fullwidthlogo;
	// 				let chartImg = new Image();
	// 				chartImg.src = revenueReport.chartImg;
	// 				let tbl = new Image();
	// 				tbl.src = revenueReport.tbl;
	// 				// context.drawImage(base_image, 130, 420, 250, 100);

	// 				imgFullwidthlogo.onload = function () {
	// 					context.drawImage(imgFullwidthlogo, width / 2 - 200, 0, 500, 300);

	// 					context.textAlign = "center";
	// 					context.fillStyle = "#027273";
	// 					context.font = "500 30px Arial";
	// 					context.fillText(`REVENUE REPORT`, width / 2 + 30, 350);

	// 					context.drawImage(chartImg, 120, 400, height + 1800, width - 100);
	// 					context.drawImage(
	// 						tbl,
	// 						0,
	// 						width / 2 + 500,
	// 						height - 700,
	// 						width - 1200
	// 					);
	// 				};
	// 			}
	// 		}, 1000);
	// 	}
	// });

	const handleInvoicePdf = () => {
		// if (revenueReport.open) {
		// 	let circle_canvas = document.getElementById("canvasOutput");
		// 	pdfRevenueReport(circle_canvas.toDataURL("image/png"));
		// }
		console.log("handleInvoicePdf");

		html2pdf(document.getElementById("tbl_revenue"), {
			margin: 1,
			filename: "myfile.pdf",
			image: { type: "jpeg", quality: 0.98 },
			html2canvas: { scale: 2 },
			jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
		});
	};

	const properties = { header: "Acme" };
	const head = [["ID", "Name", "Country"]];
	const body = [
		[1, "Shaw", "Tanzania"],
		[2, "Nelson", "Kazakhstan"],
		[3, "Garcia", "Madagascar"],
	];

	return (
		<Modal
			open={revenueReport.open}
			footer={null}
			onCancel={() => setRevenueReport({ ...revenueReport, open: false })}
			className="modal-revenue-report"
			closeIcon={<FontAwesomeIcon icon={faTimes} />}
		>
			<Row gutter={[12, 12]}>
				<Col xs={24} sm={24} md={24}></Col>

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
