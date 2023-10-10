import { degrees, PDFDocument, rgb, StandardFonts } from "pdf-lib";
import download from "downloadjs";
import moment from "moment";
import truncateDecimalNumber from "./truncateDecimalNumber";

const pdfElite = async (pdfUrl, data, display_data) => {
	let averageText = "Average";
	let dash = "-";
	let na = "N/A";
	// console.log("display_data", display_data);
	// let new_display_data = display_data.map((item) => {
	// 	let itemFi = item.name.split("_")[0].substring(1);
	// 	console.log("itemFi", itemFi);
	// });

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
				{
					value: `${
						data && data.age_avg_es_height_sum
							? truncateDecimalNumber(data.age_avg_es_height_sum)
							: ""
					}`,
					x: 430,
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
					x: 586,
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
					x: 738,
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
					x: 280,
					y: ["-", 15],
					fontSize: 12,
					color: rgb(0.95, 0.1, 0.1),
					name: "p3_average_1",
				},
				{
					value: `${
						data && data.page3_averageText2 ? data.page3_averageText2 : ""
					}`,
					x: 430,
					y: ["-", 15],
					fontSize: 12,
					color: rgb(0.95, 0.1, 0.1),
					name: "p3_average_2",
				},
				{
					value: `${
						data && data.page3_averageText3 ? data.page3_averageText3 : ""
					}`,
					x: 586,
					y: ["-", 15],
					fontSize: 12,
					color: rgb(0.95, 0.1, 0.1),
					name: "p3_average_3",
				},
				{
					value: `${
						data && data.page3_averageText4 ? data.page3_averageText4 : ""
					}`,
					x: 738,
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
		[
			[
				{
					value: `${data && data.spm_power}`,
					x: 280,
					y: ["+", 90],
					fontSize: 20,
					color: rgb(0.95, 0.1, 0.1),
					name: "p4_spm_power",
				},
				{
					value: `${data && data.rm_power}`,
					x: 430,
					y: ["+", 90],
					fontSize: 20,
					color: rgb(0.95, 0.1, 0.1),
					name: "p4_rm_power",
				},
				{
					value: `${data && data.se_pull_ups}`,
					x: 586,
					y: ["+", 90],
					fontSize: 20,
					color: rgb(0.95, 0.1, 0.1),
					name: "p4_se_pull_ups",
				},
				{
					value: `${data && data.se_chin_ups}`,
					x: 738,
					y: ["+", 90],
					fontSize: 20,
					color: rgb(0.95, 0.1, 0.1),
					name: "p4_se_chin_ups",
				},
				{
					value: `${data && data.cod_power}`,
					x: 890,
					y: ["+", 90],
					fontSize: 20,
					color: rgb(0.95, 0.1, 0.1),
					name: "p4_cod_power",
				},
			],
			[
				{
					value: `${
						data && data.age_avg_spm_power_sum
							? truncateDecimalNumber(data.age_avg_spm_power_sum)
							: ""
					}`,
					x: 280,
					y: ["-", 10],
					fontSize: 20,
					color: rgb(0.95, 0.1, 0.1),
					name: "p4_age_avg_spm_power_sum",
				},
				{
					value: `${
						data && data.age_avg_rm_power_sum
							? truncateDecimalNumber(data.age_avg_rm_power_sum)
							: ""
					}`,
					x: 430,
					y: ["-", 10],
					fontSize: 20,
					color: rgb(0.95, 0.1, 0.1),
					name: "p4_age_avg_rm_power_sum",
				},
				{
					value: `${
						data && data.age_avg_se_pull_ups_sum
							? truncateDecimalNumber(data.age_avg_se_pull_ups_sum)
							: ""
					}`,
					x: 586,
					y: ["-", 10],
					fontSize: 20,
					color: rgb(0.95, 0.1, 0.1),
					name: "p4_age_avg_se_pull_ups_sum",
				},
				{
					value: `${
						data && data.age_avg_se_chin_ups_sum
							? truncateDecimalNumber(data.age_avg_se_chin_ups_sum)
							: ""
					}`,
					x: 738,
					y: ["-", 10],
					fontSize: 20,
					color: rgb(0.95, 0.1, 0.1),
					name: "p4_age_avg_se_chin_ups_sum",
				},
				{
					value: `${
						data && data.age_avg_cod_power_sum
							? truncateDecimalNumber(data.age_avg_cod_power_sum)
							: ""
					}`,
					x: 890,
					y: ["-", 10],
					fontSize: 20,
					color: rgb(0.95, 0.1, 0.1),
					name: "p4_age_avg_cod_power_sum",
				},
			],
			[
				{
					value: `${
						data && data.page4_averageText1 ? data.page4_averageText1 : ""
					}`,
					x: 280,
					y: ["-", 110],
					fontSize: 12,
					color: rgb(0.95, 0.1, 0.1),
					name: "p4_average_1",
				},
				{
					value: `${
						data && data.page4_averageText2 ? data.page4_averageText2 : ""
					}`,
					x: 430,
					y: ["-", 110],
					fontSize: 12,
					color: rgb(0.95, 0.1, 0.1),
					name: "p4_average_2",
				},
				{
					value: `${
						data && data.page4_averageText3 ? data.page4_averageText3 : ""
					}`,
					x: 586,
					y: ["-", 110],
					fontSize: 12,
					color: rgb(0.95, 0.1, 0.1),
					name: "p4_average_3",
				},
				{
					value: `${
						data && data.page4_averageText4 ? data.page4_averageText4 : ""
					}`,
					x: 738,
					y: ["-", 110],
					fontSize: 12,
					color: rgb(0.95, 0.1, 0.1),
					name: "p4_average_4",
				},
				{
					value: `${
						data && data.page4_averageText5 ? data.page4_averageText5 : ""
					}`,
					x: 890,
					y: ["-", 110],
					fontSize: 12,
					color: rgb(0.95, 0.1, 0.1),
					name: "p4_average_5",
				},
			],
		], // page 4
		[], // page 5
		[
			[
				{
					value: `${data && data.cmj_rsi_no}`,
					x: 605,
					y: ["+", 215],
					fontSize: 12,
					color: rgb(0.95, 0.1, 0.1),
					name: "p6_cmj_rsi_no",
				},
				{
					value: `${data && data.es_height}`,
					x: 730,
					y: ["+", 215],
					fontSize: 12,
					color: rgb(0.95, 0.1, 0.1),
					name: "p6_es_height",
				},
				{
					value: `${dash}`,
					x: 890,
					y: ["+", 215],
					fontSize: 12,
					color: rgb(0.95, 0.1, 0.1),
					name: "p6_ground_contact_time",
				},
			],
		], // page 6
		[], // page 7
		[
			[
				{
					value: `${data && data.cmj_jump_height}`,
					x: 765,
					y: ["+", 212],
					fontSize: 12,
					color: rgb(0.95, 0.1, 0.1),
					name: "p8_cmj_jump_height",
				},
				{
					value: `${
						data && data.avg_cmj_jump_height
							? truncateDecimalNumber(data.avg_cmj_jump_height)
							: ""
					}`,
					x: 900,
					y: ["+", 212],
					fontSize: 12,
					color: rgb(0.95, 0.1, 0.1),
					name: "p8_avg_cmj_jump_height",
				},
			],
			[
				{
					value: `${data && data.es_peak_power}`,
					x: 765,
					y: ["+", 190],
					fontSize: 12,
					color: rgb(0.95, 0.1, 0.1),
					name: "p8_es_peak_power",
				},
				{
					value: `${
						data && data.cmj_relative_avg_power
							? truncateDecimalNumber(data.cmj_relative_avg_power)
							: ""
					}`,
					x: 900,
					y: ["+", 190],
					fontSize: 12,
					color: rgb(0.95, 0.1, 0.1),
					name: "p8_cmj_relative_avg_power",
				},
			],
		], // page 8
		[], // page 9
		[
			[
				{
					value: `${data && data.sj_height}`,
					x: 765,
					y: ["+", 197],
					fontSize: 12,
					color: rgb(0.95, 0.1, 0.1),
					name: "p10_sj_height",
				},
				{
					value: `${
						data && data.age_avg_sj_height_sum
							? truncateDecimalNumber(data.age_avg_sj_height_sum)
							: ""
					}`,
					x: 910,
					y: ["+", 197],
					fontSize: 12,
					color: rgb(0.95, 0.1, 0.1),
					name: "p10_age_avg_sj_height_sum",
				},
			],
			[
				{
					value: `${data && data.sj_peak_power}`,
					x: 765,
					y: ["+", 165],
					fontSize: 12,
					color: rgb(0.95, 0.1, 0.1),
					name: "p10_sj_peak_power",
				},
				{
					value: `${
						data && data.relative_sj_peak_power
							? truncateDecimalNumber(data.relative_sj_peak_power)
							: ""
					}`,
					x: 910,
					y: ["+", 165],
					fontSize: 12,
					color: rgb(0.95, 0.1, 0.1),
					name: "p10_relative_sj_peak_power",
				},
			],
		], // page 10
		[], // page 11
		[], // page 12
		[
			[
				{
					value: `${data && data.sprint_time_tem_meter}`,
					x: 718,
					y: ["+", 185],
					fontSize: 12,
					color: rgb(0.95, 0.1, 0.1),
					name: "p13_sprint_time_tem_meter",
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
					name: "p13_age_avg_sprint_time_tem_meter_sum",
				},
			],
			[
				{
					value: `${data && data.sprint_time_four_meter}`,
					x: 718,
					y: ["+", 110],
					fontSize: 12,
					color: rgb(0.95, 0.1, 0.1),
					name: "p13_sprint_time_four_meter",
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
					name: "p13_age_avg_sprint_time_four_meter_sum",
				},
			],
		], // page 13
		[], // page 14
		[
			[
				{
					value: `${
						data &&
						data.athlete &&
						data.athlete.athlete_info &&
						data.athlete.athlete_info.weight
					}`,
					x: 775,
					y: ["+", 225],
					fontSize: 12,
					color: rgb(0.95, 0.1, 0.1),
					name: "p15_weight",
				},
			],
			[
				{
					value: `${data && data.ms_peak_force}`,
					x: 700,
					y: ["+", 135],
					fontSize: 12,
					color: rgb(0.95, 0.1, 0.1),
					name: "p15_ms_peak_force",
				},
				{
					value: `${data && data.ms_peak_force_lbs}`,
					x: 775,
					y: ["+", 135],
					fontSize: 12,
					color: rgb(0.95, 0.1, 0.1),
					name: "p15_ms_peak_force_lbs",
				},
				{
					value: `${
						data && data.age_avg_isometric_pull_n
							? truncateDecimalNumber(data.age_avg_isometric_pull_n)
							: ""
					}`,
					x: 855,
					y: ["+", 135],
					fontSize: 12,
					color: rgb(0.95, 0.1, 0.1),
					name: "p15_age_avg_isometric_pull_n",
				},
				{
					value: `${
						data && data.age_avg_isometric_pull
							? truncateDecimalNumber(data.age_avg_isometric_pull)
							: ""
					}`,
					x: 930,
					y: ["+", 135],
					fontSize: 12,
					color: rgb(0.95, 0.1, 0.1),
					name: "p15_age_avg_isometric_pull",
				},
			],
			[
				{
					value: `${data && data.relative_stregth_pf_bw}`,
					x: 780,
					y: ["+", 40],
					fontSize: 12,
					color: rgb(0.95, 0.1, 0.1),
					name: "p15_relative_stregth_pf_bw",
				},
				{
					value: `${
						data && data.relative_stregth_pf_bw_avg_per
							? truncateDecimalNumber(data.relative_stregth_pf_bw_avg_per)
							: ""
					}`,
					x: 910,
					y: ["+", 40],
					fontSize: 12,
					color: rgb(0.95, 0.1, 0.1),
					name: "p15_relative_stregth_pf_bw_avg_per",
				},
			],
		], // page 15
		[
			[
				{
					value: `${data && data.ms_peak_force_lbs}`,
					x: 565,
					y: ["+", 216],
					fontSize: 12,
					color: rgb(0.95, 0.1, 0.1),
					name: "p16_ms_peak_force_lbs",
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
					name: "p16_weight",
				},
				{
					value: `${data && data.relative_stregth_pf_bw_lbs}`,
					x: 760,
					y: ["+", 216],
					fontSize: 12,
					color: rgb(0.95, 0.1, 0.1),
					name: "p16_relative_stregth_pf_bw_lbs",
				},
				{
					value: `${data && data.ms_rfd_lbs}`,
					x: 855,
					y: ["+", 216],
					fontSize: 12,
					color: rgb(0.95, 0.1, 0.1),
					name: "p16_ms_rfd_lbs",
				},
				{
					value: `${data && data.RFD_percent_of_peak_force_lbs}`,
					x: 955,
					y: ["+", 216],
					fontSize: 12,
					color: rgb(0.95, 0.1, 0.1),
					name: "p16_RFD_percent_of_peak_force_lbs",
				},
			],
			[
				{
					value: `77`,
					x: 600,
					y: ["-", 52],
					fontSize: 12,
					color: rgb(0.95, 0.1, 0.1),
					name: "p16_2_peak_force_low",
				},
				{
					value: `78 body weight`,
					x: 600,
					y: ["-", 75],
					fontSize: 12,
					color: rgb(0.95, 0.1, 0.1),
					name: "p16_2_peak_force_average",
				},
				{
					value: `78`,
					x: 600,
					y: ["-", 98],
					fontSize: 12,
					color: rgb(0.95, 0.1, 0.1),
					name: "p16_2_peak_force_high",
				},
			],
		], // page 16
		[
			[
				{
					value: `${data && data.ms_peak_force}`,
					x: 140,
					y: ["-", 138],
					fontSize: 12,
					color: rgb(0.95, 0.1, 0.1),
					name: "p17_ms_peak_force",
				},
				{
					value: `${data && data.es_peak_propulsive_force}`,
					x: 270,
					y: ["-", 138],
					fontSize: 12,
					color: rgb(0.95, 0.1, 0.1),
					name: "p17_es_peak_propulsive_force",
				},
				{
					value: `${data && data.dsi_score}`,
					x: 400,
					y: ["-", 138],
					fontSize: 12,
					color: rgb(0.95, 0.1, 0.1),
					name: "p17_dsi_score",
				},
			],
		], // page 17
		[], // page 18
		[
			[
				{
					value: `${data && data.es_peak_propulsive_force}`,
					x: 770,
					y: ["+", 212],
					fontSize: 12,
					color: rgb(0.95, 0.1, 0.1),
					name: "p19_es_peak_propulsive_force",
				},
				{
					value: `${
						data && data.es_peak_propulsive_force_sum_avg
							? truncateDecimalNumber(data.es_peak_propulsive_force_sum_avg)
							: ""
					}`,
					x: 905,
					y: ["+", 212],
					fontSize: 12,
					color: rgb(0.95, 0.1, 0.1),
					name: "p19_es_peak_propulsive_force_sum_avg",
				},
			],
			[
				{
					value: `${data && data.relative_peak_power}`,
					x: 770,
					y: ["+", 190],
					fontSize: 12,
					color: rgb(0.95, 0.1, 0.1),
					name: "p19_relative_peak_power",
				},
				{
					value: `${
						data && data.relative_peak_power_avg
							? truncateDecimalNumber(data.relative_peak_power_avg)
							: ""
					}`,
					x: 905,
					y: ["+", 190],
					fontSize: 12,
					color: rgb(0.95, 0.1, 0.1),
					name: "p19_relative_peak_power_avg",
				},
			],
		], // page 19
		[], // page 20
		[
			[
				{
					value: `${data && data.rm_power}`,
					x: 715,
					y: ["+", 205],
					fontSize: 12,
					color: rgb(0.95, 0.1, 0.1),
					name: "p21_rm_power",
				},
				{
					value: `${
						data && data.age_avg_rm_power_sum
							? truncateDecimalNumber(data.age_avg_rm_power_sum)
							: ""
					}`,
					x: 820,
					y: ["+", 205],
					fontSize: 12,
					color: rgb(0.95, 0.1, 0.1),
					name: "p21_age_avg_rm_power_sum",
				},
			],
		], // page 21
		[], // page 22
		[
			[
				{
					value: `${data && data.se_chin_ups}`,
					x: 500,
					y: ["+", 165],
					fontSize: 20,
					color: rgb(0.95, 0.1, 0.1),
					name: "p23_se_chin_ups",
				},
				{
					value: `${
						data && data.age_avg_se_chin_ups_sum
							? truncateDecimalNumber(data.age_avg_se_chin_ups_sum)
							: ""
					}`,
					x: 700,
					y: ["+", 165],
					fontSize: 20,
					color: rgb(0.95, 0.1, 0.1),
					name: "p23_age_avg_se_chin_ups_sum",
				},
			],
			[
				{
					value: `${data && data.se_pull_ups}`,
					x: 500,
					y: ["+", 80],
					fontSize: 20,
					color: rgb(0.95, 0.1, 0.1),
					name: "p23_se_pull_ups",
				},
				{
					value: `${
						data && data.age_avg_se_pull_ups_sum
							? truncateDecimalNumber(data.age_avg_se_pull_ups_sum)
							: ""
					}`,
					x: 700,
					y: ["+", 80],
					fontSize: 20,
					color: rgb(0.95, 0.1, 0.1),
					name: "p23_age_avg_se_pull_ups_sum",
				},
			],
		], // page 23
		[], // page 24
		[
			[
				{
					value: `${data && data.cod_power}`,
					x: 715,
					y: ["+", 180],
					fontSize: 12,
					color: rgb(0.95, 0.1, 0.1),
					name: "p25_cod_power",
				},
				{
					value: `${data && data.age_avg_cod_power_sum}`,
					x: 815,
					y: ["+", 180],
					fontSize: 12,
					color: rgb(0.95, 0.1, 0.1),
					name: "p25_age_avg_cod_power_sum",
				},
			],
		], // page 25
		[
			[
				{
					value: `${data && data.cmj_rsi_no}`,
					x: 325,
					y: ["+", 67],
					fontSize: 20,
					color: rgb(0.95, 0.1, 0.1),
					name: "p26_cmj_rsi_no",
				},
				{
					value: `${data && data.dsi_score}`,
					x: 510,
					y: ["+", 67],
					fontSize: 20,
					color: rgb(0.95, 0.1, 0.1),
					name: "p26_dsi_score",
				},
				{
					value: `${data && data.eur}`,
					x: 700,
					y: ["+", 67],
					fontSize: 20,
					color: rgb(0.95, 0.1, 0.1),
					name: "p26_eur",
				},
				{
					value: `${data && data.ms_peak_force}`,
					x: 890,
					y: ["+", 67],
					fontSize: 20,
					color: rgb(0.95, 0.1, 0.1),
					name: "p26_ms_peak_force",
				},
			],
			[
				{
					value: `${
						data && data.age_avg_cmj_rsi_no_sum
							? truncateDecimalNumber(data.age_avg_cmj_rsi_no_sum)
							: ""
					}`,
					x: 325,
					y: ["-", 40],
					fontSize: 20,
					color: rgb(0.95, 0.1, 0.1),
					name: "p26_age_avg_cmj_rsi_no_sum",
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
					name: "p26_dsi_score_avg_tot",
				},
				{
					value: `${truncateDecimalNumber(1.15)}`,
					x: 700,
					y: ["-", 40],
					fontSize: 20,
					color: rgb(0.95, 0.1, 0.1),
					name: "p26_avg_eccentric_utilization_ratio",
				},
				{
					value: `${
						data && data.age_avg_isometric_pull
							? truncateDecimalNumber(data.age_avg_isometric_pull)
							: ""
					}`,
					x: 890,
					y: ["-", 40],
					fontSize: 20,
					color: rgb(0.95, 0.1, 0.1),
					name: "p26_avg_relative_strength",
				},
			],
			[
				{
					value: `${
						data && data.page3_averageText1 ? data.page3_averageText1 : ""
					}`,
					x: 325,
					y: ["-", 155],
					fontSize: 20,
					color: rgb(0.95, 0.1, 0.1),
					name: "p26_average_1",
				},
				{
					value: `${
						data && data.page26_averageText2 ? data.page26_averageText2 : ""
					}`,
					x: 510,
					y: ["-", 155],
					fontSize: 20,
					color: rgb(0.95, 0.1, 0.1),
					name: "p26_average_2",
				},
				{
					value: `N/A`,
					x: 700,
					y: ["-", 155],
					fontSize: 20,
					color: rgb(0.95, 0.1, 0.1),
					name: "p26_average_3",
				},
				{
					value: `${
						data && data.page3_averageText5 ? data.page3_averageText5 : ""
					}`,
					x: 890,
					y: ["-", 155],
					fontSize: 20,
					color: rgb(0.95, 0.1, 0.1),
					name: "p26_average_4",
				},
			],
		], // page 26
		[], // page 27
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
		"2022-June-BFS-Elite-New-Report-BLANK.pdf",
		"application/pdf"
	);
};

export default pdfElite;
