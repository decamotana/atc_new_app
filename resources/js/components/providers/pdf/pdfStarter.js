import { degrees, PDFDocument, rgb, StandardFonts } from "pdf-lib";
import download from "downloadjs";
import moment from "moment";
import newtonPound from "./newtonPound";
import truncateDecimalNumber from "./truncateDecimalNumber";

const pdfStarter = async (pdfUrl, data, display_data) => {
	let dataRender = [
		[], // page 1
		[], // page 2
		[
			[
				{
					value: `${
						data &&
						data.athlete.birthdate &&
						moment().diff(data.athlete.birthdate, "years")
					}`,
					x: 85,
					y: ["+", 309],
					fontSize: 18,
					color: rgb(0.95, 0.1, 0.1),
					posxx: true,
				},
				{
					value: `${data && data.sport}`,
					x: 185,
					y: ["+", 309],
					fontSize: 18,
					color: rgb(0.95, 0.1, 0.1),
					posxx: true,
				},
				{
					value: `${data && newtonPound(data.cmj_weight)}`,
					x: 828,
					y: ["+", 309],
					fontSize: 19,
					color: rgb(0.95, 0.1, 0.1),
					posxx: true,
				},
				{
					value: `${data && data.athlete && data.athlete.gender}`,
					x: 913,
					y: ["+", 309],
					fontSize: 19,
					color: rgb(0.95, 0.1, 0.1),
					posxx: true,
				},
			],
			[
				{
					value: `${data && data.cmj_rsi_no}`,
					x: 280,
					y: ["+", 135],
					fontSize: 20,
					color: rgb(0.95, 0.1, 0.1),
					name: "p3_cmj_rsi_no",
				},
				{
					value: `${data && data.es_height}`,
					x: 430,
					y: ["+", 135],
					fontSize: 20,
					color: rgb(0.95, 0.1, 0.1),
					name: "p3_es_height",
				},
				{
					value: `${data && data.sj_height}`,
					x: 586,
					y: ["+", 135],
					fontSize: 20,
					color: rgb(0.95, 0.1, 0.1),
					name: "p3_sj_height",
				},
				{
					value: `${data && data.sprint_time_tem_meter}`,
					x: 738,
					y: ["+", 135],
					fontSize: 20,
					color: rgb(0.95, 0.1, 0.1),
					name: "p3_sprint_time_tem_meter",
				},
				{
					value: `${data && data.isometric_pull}`,
					x: 890,
					y: ["+", 135],
					fontSize: 20,
					color: rgb(0.95, 0.1, 0.1),
					name: "p3_isometric_pull",
				},
			],
			[
				{
					value: `${
						data && data.age_avg_cmj_rsi_no_sum
							? truncateDecimalNumber(data.age_avg_cmj_rsi_no_sum)
							: ""
					}`,
					x: 280,
					y: ["+", 60],
					fontSize: 20,
					color: rgb(0.95, 0.1, 0.1),
					name: "p3_age_avg_cmj_rsi_no_sum",
				},
			],
			[
				{
					value: `${
						data && data.page3_averageText1 ? data.page3_averageText1 : ""
					}`,
					x: 280,
					y: ["-", 15],
					fontSize: 12,
					color: rgb(0.95, 0.1, 0.1),
					name: "p3_average_1",
				},
			],
		], // page 3
		[], // page 4
		[], // page 5
		[], // page 6
		[], // page 7
		[], // page 8
		[], // page 9
	];

	// Load a PDFDocument from the existing PDF bytes
	const pdfDoc = await PDFDocument.load(pdfUrl);
	// console.log("pdfDoc", pdfDoc);

	// Embed the Helvetica font
	const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

	// Get the first page of the document
	const pages = pdfDoc.getPages();
	// console.log("pages", pages);

	for (let p = 0; p < pages.length; p++) {
		if (dataRender[p].length > 0) {
			const { width, height } = pages[p].getSize();
			for (let x = 0; x < dataRender[p].length; x++) {
				let drpx = dataRender[p][x];
				for (let y = 0; y < drpx.length; y++) {
					let drpxy = drpx[y];
					let yVal = 0;

					if (drpxy.y[0] === "+") {
						yVal = height / 2 + drpxy.y[1];
					} else {
						yVal = height / 2 - drpxy.y[1];
					}

					const textWidth = helveticaFont.widthOfTextAtSize(
						drpxy.value,
						drpxy.fontSize
					);

					let subtractXPos = textWidth / 2;

					if (display_data && display_data.length > 0) {
						let show_data = display_data.filter(
							(itemFilter) => itemFilter.name === drpxy.name
						);

						let show = 1;
						if (show_data && show_data.length > 0) {
							show = show_data[0].status;
						}

						if (show) {
							pages[p].drawText(drpxy.value, {
								x: drpxy.posxx ? drpxy.x : drpxy.x - subtractXPos,
								y: yVal,
								size: drpxy.fontSize,
								font: helveticaFont,
								color: drpxy.color,
								// rotate: drpxy.degrees(drpxy.degrees),
							});
						}
					} else {
						pages[p].drawText(drpxy.value, {
							x: drpxy.posxx ? drpxy.x : drpxy.x - subtractXPos,
							y: yVal,
							size: drpxy.fontSize,
							font: helveticaFont,
							color: drpxy.color,
							// rotate: drpxy.degrees(drpxy.degrees),
						});
					}
				}
			}
		}
	}

	// Serialize the PDFDocument to bytes (a Uint8Array)
	const pdfBytes = await pdfDoc.save();
	download(
		pdfBytes,
		"2022-June-BFS-New-Starter-Report-BLANK.pdf",
		"application/pdf"
	);
};

export default pdfStarter;
