import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import download from "downloadjs";
import moment from "moment";
import numericConvertToPercentage from "../numericConvertToPercentage";
import Highcharts from "highcharts";

const pdfRevenueReport = async (props) => {
	const { fullwidthlogo, pdfTitle, chartImg, tbl_revenue, dataRevenue } = props;

	let from_date = moment(dataRevenue[0].from_date).format("MM/DD/YYYY");
	let to_date = moment(dataRevenue[0].to_date).format("MM/DD/YYYY");
	let total_subscriber = dataRevenue[0].total_subscriber;
	let total_revenue = dataRevenue[0].total_revenue.toFixed(2);

	let data = "";
	let numericConvertToPercentageData = numericConvertToPercentage(Highcharts, [
		dataRevenue[0].total_caregiver,
		dataRevenue[0].total_carepro,
	]);
	if (dataRevenue[0].type === "ALL") {
		data =
			numericConvertToPercentageData[0] +
			"% / " +
			numericConvertToPercentageData[1] +
			"%";
	} else if (dataRevenue[0].type === "Cancer Caregiver") {
		data = numericConvertToPercentageData[0] + "%";
	} else if (dataRevenue[0].type === "Cancer Care Professional") {
		data = numericConvertToPercentageData[1] + "%";
	}

	let caregivers_careproviders = data;

	// Load a PDFDocument from the existing PDF bytes
	const pdfDoc = await PDFDocument.create();
	const page = pdfDoc.addPage();

	const pngLogoBytes = await fetch(fullwidthlogo).then((res) =>
		res.arrayBuffer()
	);
	const pngLogo = await pdfDoc.embedPng(pngLogoBytes);
	const pngLogoDims = pngLogo.scale(1);
	page.drawImage(pngLogo, {
		x: page.getWidth() / 2 - 80,
		y: page.getHeight() - 60,
		width: pngLogoDims.width / 5,
		height: pngLogoDims.height / 5,
	});

	const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);

	page.drawText(`${pdfTitle}`, {
		x: page.getWidth() / 2 - 75,
		y: page.getHeight() - 80,
		size: 18,
		font: timesRomanFont,
		color: rgb(0.98, 0.01, 0.0),
	});

	page.drawText(`FROM DATE: ${from_date}`, {
		x: 20,
		y: page.getHeight() - 150,
		size: 12,
		font: timesRomanFont,
		color: rgb(0.98, 0.01, 0.0),
	});

	page.drawText(`TO DATE: ${to_date}`, {
		x: 20,
		y: page.getHeight() - 170,
		size: 12,
		font: timesRomanFont,
		color: rgb(0.98, 0.01, 0.0),
	});

	page.drawText(`Total Subscribers: ${total_subscriber}`, {
		x: 20,
		y: page.getHeight() - 190,
		size: 12,
		font: timesRomanFont,
		color: rgb(0.98, 0.01, 0.0),
	});

	page.drawText(`Total Revenue: $${total_revenue}`, {
		x: 20,
		y: page.getHeight() - 210,
		size: 12,
		font: timesRomanFont,
		color: rgb(0.98, 0.01, 0.0),
	});

	page.drawText(
		`Caregivers % / Care Professional %:\n ${caregivers_careproviders}`,
		{
			x: 20,
			y: page.getHeight() - 230,
			size: 12,
			font: timesRomanFont,
			color: rgb(0.98, 0.01, 0.0),
		}
	);

	const pngChartBytes = await fetch(chartImg).then((res) => res.arrayBuffer());
	const pngChart = await pdfDoc.embedPng(pngChartBytes);
	const pngChartDims = pngChart.scale(1);
	page.drawImage(pngChart, {
		x: page.getWidth() / 2 - 20,
		y: page.getHeight() - 450,
		width: pngChartDims.width / 2,
		height: pngChartDims.height / 2,
	});
	const pngTblRevenueBytes = await fetch(tbl_revenue).then((res) =>
		res.arrayBuffer()
	);
	const pngTblRevenue = await pdfDoc.embedPng(pngTblRevenueBytes);
	const pngTblRevenueDims = pngTblRevenue.scale(1);
	page.drawImage(pngTblRevenue, {
		x: 20,
		y: 100,
		width: pngTblRevenueDims.width - 342,
		height: pngTblRevenueDims.height / 2,
	});

	// // // Serialize the PDFDocument to bytes (a Uint8Array)
	const pdfBytes = await pdfDoc.save();

	download(
		pdfBytes,
		`revenue-report-${new Date().getFullYear()}.pdf`,
		"application/pdf"
	);
};

export default pdfRevenueReport;
