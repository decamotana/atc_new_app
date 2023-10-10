import { degrees, PDFDocument, rgb, StandardFonts } from "pdf-lib";
import download from "downloadjs";
import moment from "moment";
import truncateDecimalNumber from "./truncateDecimalNumber";

const pdfPro = async (pdfUrl, data, display_data) => {
	let averageText = "Average";

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
					value: `${
						data &&
						data.athlete &&
						data.athlete.athlete_info &&
						data.athlete.athlete_info.weight
					}`,
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
					x: 285,
					y: ["+", 135],
					fontSize: 20,
					color: rgb(0.95, 0.1, 0.1),
					name: "p3_cmj_rsi_no",
				},
				{
					value: `${data && data.es_height ? data.es_height : ""}`,
					x: 432,
					y: ["+", 135],
					fontSize: 20,
					color: rgb(0.95, 0.1, 0.1),
					name: "p3_es_height",
				},
				{
					value: `${data && data.sj_height ? data.sj_height : ""}`,
					x: 584,
					y: ["+", 135],
					fontSize: 20,
					color: rgb(0.95, 0.1, 0.1),
					name: "p3_sj_height",
				},
				{
					value: `${
						data && data.sprint_time_tem_meter ? data.sprint_time_tem_meter : ""
					}`,
					x: 736,
					y: ["+", 135],
					fontSize: 20,
					color: rgb(0.95, 0.1, 0.1),
					name: "p3_sprint_time_tem_meter",
				},
				{
					value: `${data && data.isometric_pull ? data.isometric_pull : ""}`,
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
					x: 285,
					y: ["+", 60],
					fontSize: 20,
					color: rgb(0.95, 0.1, 0.1),
					name: "p3_age_avg_cmj_rsi_no_sum",
				},
				{
					value: `${
						data && data.age_avg_es_height_sum
							? truncateDecimalNumber(data.age_avg_es_height_sum)
							: ""
					}`,
					x: 432,
					y: ["+", 60],
					fontSize: 20,
					color: rgb(0.95, 0.1, 0.1),
					name: "p3_age_avg_es_height_sum",
				},
				{
					value: `${
						data && data.age_avg_sj_height_sum
							? truncateDecimalNumber(data.age_avg_sj_height_sum)
							: ""
					}`,
					x: 584,
					y: ["+", 60],
					fontSize: 20,
					color: rgb(0.95, 0.1, 0.1),
					name: "p3_age_avg_sj_height_sum",
				},
				{
					value: `${
						data && data.age_avg_sprint_time_tem_meter_sum
							? truncateDecimalNumber(data.age_avg_sprint_time_tem_meter_sum)
							: ""
					}`,
					x: 736,
					y: ["+", 60],
					fontSize: 20,
					color: rgb(0.95, 0.1, 0.1),
					name: "p3_age_avg_sprint_time_tem_meter_sum",
				},
				{
					value: `${
						data && data.age_avg_isometric_pull
							? truncateDecimalNumber(data.age_avg_isometric_pull)
							: ""
					}`,
					x: 890,
					y: ["+", 60],
					fontSize: 20,
					color: rgb(0.95, 0.1, 0.1),
					name: "p3_age_avg_isometric_pull",
				},
			],
			[
				{
					value: `${
						data && data.page3_averageText1 ? data.page3_averageText1 : ""
					}`,
					x: 285,
					y: ["-", 15],
					fontSize: 12,
					color: rgb(0.95, 0.1, 0.1),
					name: "p3_average_1",
				},
				{
					value: `${
						data && data.page3_averageText2 ? data.page3_averageText2 : ""
					}`,
					x: 433,
					y: ["-", 15],
					fontSize: 12,
					color: rgb(0.95, 0.1, 0.1),
					name: "p3_average_2",
				},
				{
					value: `${
						data && data.page3_averageText3 ? data.page3_averageText3 : ""
					}`,
					x: 585,
					y: ["-", 15],
					fontSize: 12,
					color: rgb(0.95, 0.1, 0.1),
					name: "p3_average_3",
				},
				{
					value: `${
						data && data.page3_averageText4 ? data.page3_averageText4 : ""
					}`,
					x: 737,
					y: ["-", 15],
					fontSize: 12,
					color: rgb(0.95, 0.1, 0.1),
					name: "p3_average_4",
				},
				{
					value: `${
						data && data.page3_averageText5 ? data.page3_averageText5 : ""
					}`,
					x: 890,
					y: ["-", 15],
					fontSize: 12,
					color: rgb(0.95, 0.1, 0.1),
					name: "p3_average_5",
				},
			],
		], // page 3
		[], // page 4
		[
			[
				{
					value: `${data && data.cmj_rsi_no}`,
					x: 615,
					y: ["+", 215],
					fontSize: 12,
					color: rgb(0.95, 0.1, 0.1),
					name: "p5_cmj_rsi_no",
				},
				{
					value: `${data && data.es_height}`,
					x: 735,
					y: ["+", 215],
					fontSize: 12,
					color: rgb(0.95, 0.1, 0.1),
					name: "p5_es_height",
				},
				{
					value: `-`,
					x: 890,
					y: ["+", 215],
					fontSize: 12,
					color: rgb(0.95, 0.1, 0.1),
					name: "p5_ground_contact_time",
				},
			],
		], // page 5
		[], // page 6
		[
			[
				{
					value: `${data && data.cmj_jump_height}`,
					x: 775,
					y: ["+", 212],
					fontSize: 12,
					color: rgb(0.95, 0.1, 0.1),
					name: "p7_cmj_jump_height",
				},
				{
					value: `${
						data && data.avg_cmj_jump_height
							? truncateDecimalNumber(data.avg_cmj_jump_height)
							: ""
					}`,
					x: 905,
					y: ["+", 212],
					fontSize: 12,
					color: rgb(0.95, 0.1, 0.1),
					name: "p7_avg_cmj_jump_height",
				},
			],
			[
				{
					value: `${data && data.es_peak_power ? data.es_peak_power : ""}`,
					x: 775,
					y: ["+", 190],
					fontSize: 12,
					color: rgb(0.95, 0.1, 0.1),
					name: "p7_es_peak_power",
				},
				{
					value: `${
						data && data.cmj_relative_avg_power
							? truncateDecimalNumber(data.cmj_relative_avg_power)
							: ""
					}`,
					x: 905,
					y: ["+", 190],
					fontSize: 12,
					color: rgb(0.95, 0.1, 0.1),
					name: "p7_cmj_relative_avg_power",
				},
			],
		], // page 7
		[], // page 8
		[
			[
				{
					value: `${data && data.sj_height}`,
					x: 760,
					y: ["+", 202],
					fontSize: 12,
					color: rgb(0.95, 0.1, 0.1),
					name: "p9_sj_height",
				},
				{
					value: `${
						data && data.age_avg_sj_height_sum
							? truncateDecimalNumber(data.age_avg_sj_height_sum)
							: ""
					}`,
					x: 885,
					y: ["+", 202],
					fontSize: 12,
					color: rgb(0.95, 0.1, 0.1),
					name: "p9_age_avg_sj_height_sum",
				},
			],
			[
				{
					value: `${data && data.sj_peak_power}`,
					x: 760,
					y: ["+", 180],
					fontSize: 12,
					color: rgb(0.95, 0.1, 0.1),
					name: "p9_sj_peak_power",
				},
				{
					value: `${
						data && data.relative_sj_peak_power
							? truncateDecimalNumber(data.relative_sj_peak_power)
							: ""
					}`,
					x: 885,
					y: ["+", 180],
					fontSize: 12,
					color: rgb(0.95, 0.1, 0.1),
					name: "p9_relative_sj_peak_power",
				},
			],
		], // page 9
		[], // page 10
		[], // page 11
		[
			[
				{
					value: `${data && data.sprint_time_tem_meter}`,
					x: 720,
					y: ["+", 185],
					fontSize: 12,
					color: rgb(0.95, 0.1, 0.1),
					name: "p12_sprint_time_tem_meter",
				},
				{
					value: `${
						data && data.age_avg_sprint_time_tem_meter_sum
							? truncateDecimalNumber(data.age_avg_sprint_time_tem_meter_sum)
							: ""
					}`,
					x: 815,
					y: ["+", 185],
					fontSize: 12,
					color: rgb(0.95, 0.1, 0.1),
					name: "p12_age_avg_sprint_time_tem_meter_sum",
				},
			],
			[
				{
					value: `${data && data.sprint_time_four_meter}`,
					x: 720,
					y: ["+", 110],
					fontSize: 12,
					color: rgb(0.95, 0.1, 0.1),
					name: "p12_sprint_time_four_meter",
				},
				{
					value: `${
						data && data.age_avg_sprint_time_four_meter_sum
							? truncateDecimalNumber(data.age_avg_sprint_time_four_meter_sum)
							: ""
					}`,
					x: 815,
					y: ["+", 110],
					fontSize: 12,
					color: rgb(0.95, 0.1, 0.1),
					name: "p12_age_avg_sprint_time_four_meter_sum",
				},
			],
		], // page 12
		[], // page 13
		[
			// [
			// 	{
			// 		value: `${
			// 			data &&
			// 			data.athlete &&
			// 			data.athlete.athlete_info &&
			// 			data.athlete.athlete_info.weight
			// 		}`,
			// 		x: 775,
			// 		y: ["+", 225],
			// 		fontSize: 12,
			// 		color: rgb(0.95, 0.1, 0.1),
			// 		name: "p14_weight",
			// 	},
			// ],
			[
				{
					value: `${data && data.ms_peak_force}`,
					x: 700,
					y: ["+", 135],
					fontSize: 12,
					color: rgb(0.95, 0.1, 0.1),
					name: "p14_ms_peak_force",
				},
				{
					value: `${
						data && data.ms_peak_force_lbs ? data.ms_peak_force_lbs : ""
					}`,
					x: 780,
					y: ["+", 135],
					fontSize: 12,
					color: rgb(0.95, 0.1, 0.1),
					name: "p14_ms_peak_force_lbs",
				},
				{
					value: `${
						data && data.age_avg_isometric_pull_n
							? truncateDecimalNumber(data.age_avg_isometric_pull_n)
							: ""
					}`,
					x: 860,
					y: ["+", 135],
					fontSize: 12,
					color: rgb(0.95, 0.1, 0.1),
					name: "p14_age_avg_isometric_pull_n",
				},
				{
					value: `${
						data && data.age_avg_isometric_pull
							? truncateDecimalNumber(data.age_avg_isometric_pull)
							: ""
					}`,
					x: 935,
					y: ["+", 135],
					fontSize: 12,
					color: rgb(0.95, 0.1, 0.1),
					name: "p14_age_avg_isometric_pull",
				},
			],
			[
				{
					value: `${
						data && data.relative_stregth_pf_bw
							? data.relative_stregth_pf_bw
							: ""
					}`,
					x: 785,
					y: ["+", 40],
					fontSize: 12,
					color: rgb(0.95, 0.1, 0.1),
					name: "p14_relative_stregth_pf_bw",
				},
				{
					value: `${
						data && data.relative_stregth_pf_bw_avg_per
							? truncateDecimalNumber(data.relative_stregth_pf_bw_avg_per)
							: ""
					}`,
					x: 905,
					y: ["+", 40],
					fontSize: 12,
					color: rgb(0.95, 0.1, 0.1),
					name: "p14_relative_stregth_pf_bw_avg_per",
				},
			],
		], // page 14
		[
			[
				{
					value: `${
						data && data.ms_peak_force_lbs ? data.ms_peak_force_lbs : ""
					}`,
					x: 565,
					y: ["+", 216],
					fontSize: 12,
					color: rgb(0.95, 0.1, 0.1),
					name: "p15_ms_peak_force_lbs",
				},
				{
					value: `${
						data &&
						data.athlete &&
						data.athlete.athlete_info &&
						data.athlete.athlete_info.weight
					}`,
					x: 660,
					y: ["+", 216],
					fontSize: 12,
					color: rgb(0.95, 0.1, 0.1),
					name: "p15_weight",
				},
				{
					value: `${
						data && data.relative_stregth_pf_bw_lbs
							? data.relative_stregth_pf_bw_lbs
							: ""
					}`,
					x: 760,
					y: ["+", 216],
					fontSize: 12,
					color: rgb(0.95, 0.1, 0.1),
					name: "p15_relative_stregth_pf_bw_lbs",
				},
				{
					value: `${data && data.ms_rfd_lbs ? data.ms_rfd_lbs : ""}`,
					x: 865,
					y: ["+", 216],
					fontSize: 12,
					color: rgb(0.95, 0.1, 0.1),
					name: "p15_ms_rfd_lbs",
				},
				{
					value: `${
						data && data.RFD_percent_of_peak_force_lbs
							? data.RFD_percent_of_peak_force_lbs
							: ""
					}`,
					x: 955,
					y: ["+", 216],
					fontSize: 12,
					color: rgb(0.95, 0.1, 0.1),
					name: "p15_RFD_percent_of_peak_force_lbs",
				},
			],
		], // page 15
		[
			[
				{
					value: `${data && data.ms_peak_force}`,
					x: 140,
					y: ["-", 138],
					fontSize: 12,
					color: rgb(0.95, 0.1, 0.1),
					name: "p16_ms_peak_force",
				},
				{
					value: `${data && data.es_peak_propulsive_force}`,
					x: 265,
					y: ["-", 138],
					fontSize: 12,
					color: rgb(0.95, 0.1, 0.1),
					name: "p16_es_peak_propulsive_force",
				},
				{
					value: `${data && data.dsi_score ? data.dsi_score : ""}`,
					x: 395,
					y: ["-", 138],
					fontSize: 12,
					color: rgb(0.95, 0.1, 0.1),
					name: "p16_dsi_score",
				},
			],
		], // page 16
		[
			[
				{
					value: `${data && data.cmj_rsi_no}`,
					x: 330,
					y: ["+", 67],
					fontSize: 20,
					color: rgb(0.95, 0.1, 0.1),
					name: "p17_cmj_rsi_no",
				},
				{
					value: `${data && data.dsi_score ? data.dsi_score : ""}`,
					x: 510,
					y: ["+", 67],
					fontSize: 20,
					color: rgb(0.95, 0.1, 0.1),
					name: "p17_dsi_score",
				},
				{
					value: `${data && data.eur ? data.eur : ""}`,
					x: 700,
					y: ["+", 67],
					fontSize: 20,
					color: rgb(0.95, 0.1, 0.1),
					name: "p17_eur",
				},
				{
					value: `${data && data.ms_peak_force}`,
					x: 895,
					y: ["+", 67],
					fontSize: 20,
					color: rgb(0.95, 0.1, 0.1),
					name: "p17_ms_peak_force",
				},
			],
			[
				{
					value: `${
						data && data.age_avg_cmj_rsi_no_sum
							? truncateDecimalNumber(data.age_avg_cmj_rsi_no_sum)
							: ""
					}`,
					x: 330,
					y: ["-", 40],
					fontSize: 20,
					color: rgb(0.95, 0.1, 0.1),
					name: "p17_age_avg_cmj_rsi_no_sum",
				},
				{
					value: `${
						data && data.dsi_score_avg_tot
							? truncateDecimalNumber(data.dsi_score_avg_tot)
							: ""
					}`,
					x: 510,
					y: ["-", 40],
					fontSize: 20,
					color: rgb(0.95, 0.1, 0.1),
					name: "p17_dsi_score_avg_tot",
				},
				{
					value: `${truncateDecimalNumber(1.15)}`,
					x: 700,
					y: ["-", 40],
					fontSize: 20,
					color: rgb(0.95, 0.1, 0.1),
					name: "p17_avg_eccentric_utilization_ratio",
				},
				{
					value: `${
						data && data.age_avg_isometric_pull
							? truncateDecimalNumber(data.age_avg_isometric_pull)
							: ""
					}`,
					x: 895,
					y: ["-", 40],
					fontSize: 20,
					color: rgb(0.95, 0.1, 0.1),
					name: "p17_avg_relative_strength",
				},
			],
			[
				{
					value: `${
						data && data.page3_averageText1 ? data.page3_averageText1 : ""
					}`,
					x: 330,
					y: ["-", 150],
					fontSize: 16,
					color: rgb(0.95, 0.1, 0.1),
					name: "p17_average_1",
				},
				{
					value: `${
						data && data.page3_averageText5 ? data.page3_averageText5 : ""
					}`,
					x: 893,
					y: ["-", 150],
					fontSize: 16,
					color: rgb(0.95, 0.1, 0.1),
					name: "p17_average_4",
				},
			],
		], // page 17
		[], // page 18
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
		"2022-June-BFS-New-Professional-Report-BLANK.pdf",
		"application/pdf"
	);
};

export default pdfPro;
