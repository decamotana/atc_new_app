import moment from "moment";
import NumberFormat from "react-number-format";
import { fullwidthlogo } from "../../../../../providers/companyInfo";
import numericConvertToPercentage from "../../../../../providers/numericConvertToPercentage";
import Highcharts from "highcharts";
import { useEffect, useState } from "react";

export default function RevenueReport({ revenueReport, revenueFilter }) {
	const [totalRevenue, setTotalRevenue] = useState(0);
	const [caregiversPercent, setCaregiversPercent] = useState("");
	const [careprovidersPercent, setCareprovidersPercent] = useState("");

	useEffect(() => {
		let total_revenue = 0;
		let total_caregiver = 0;
		let total_carepro = 0;

		revenueReport.map((item) => {
			if (item.invite_status === 0) {
				let total = item.amount ? parseFloat(item.amount) : 0;

				if (item.coupon) {
					if (item.coupon.type === "fixed") {
						total = parseFloat(item.amount) - item.coupon.off;
					}
					if (item.coupon.type === "percent") {
						var percentage = item.coupon.off / 100;
						total =
							parseFloat(item.amount) - parseFloat(item.amount) * percentage;
					}
				}

				total_revenue += total;

				if (item.role === "Cancer Caregiver") {
					total_caregiver++;
				}
				if (item.role === "Cancer Care Professional") {
					total_carepro++;
				}
			}
			return "";
		});

		let caregivers_percent = "";
		let careproviders_percent = "";

		let numericConvertToPercentageData = numericConvertToPercentage(
			Highcharts,
			[total_caregiver, total_carepro]
		);
		if (revenueFilter.type === "ALL") {
			caregivers_percent = numericConvertToPercentageData[0] + "%";
			careproviders_percent = numericConvertToPercentageData[1] + "%";
		} else if (revenueFilter.type === "Cancer Caregiver") {
			caregivers_percent = numericConvertToPercentageData[0] + "%";
		} else if (revenueFilter.type === "Cancer Care Professional") {
			careproviders_percent = numericConvertToPercentageData[1] + "%";
		}

		setCaregiversPercent(caregivers_percent);
		setCareprovidersPercent(careproviders_percent);

		setTotalRevenue(total_revenue);

		if (revenueFilter.date_from && revenueFilter.date_to) {
			let date_from = moment(revenueFilter.date_from);
			let date_to = moment(revenueFilter.date_to);
			var date_from_clone = date_from.clone();
			var timeValues = [];

			let year_from = date_from.format("Y");
			let year_to = date_to.format("Y");

			while (
				date_to > date_from_clone ||
				date_from_clone.format("M") === date_to.format("M")
			) {
				timeValues.push(date_from_clone.format("YYYY-MM"));
				date_from_clone.add(1, "month");
			}

			let xAxisTitleText = "DAILY";
			let subtitleText = "REVENUE DAILY";

			let data_series_name = [];
			let data_series_value = [];

			if (timeValues.length > 1) {
				if (parseInt(year_to) - parseInt(year_from) >= 2) {
					xAxisTitleText = "YEAR";
					subtitleText = "REVENUE YEARLY";

					for (let x = parseInt(year_from); x <= parseInt(year_to); x++) {
						data_series_name.push(x);

						let filterItem = revenueReport.filter(
							(f) => parseInt(moment(f.date_paid).format("YYYY")) === x
						);

						let amount = filterItem.reduce((a, b) => {
							let total = b.amount ? parseFloat(b.amount) : 0;

							if (b.coupon) {
								if (b.coupon.type === "fixed") {
									total = parseFloat(b.amount) - b.coupon.off;
								}
								if (b.coupon.type === "percent") {
									var percentage = b.coupon.off / 100;
									total =
										parseFloat(b.amount) - parseFloat(b.amount) * percentage;
								}
							}

							a += total;

							return a;
						}, 0);

						data_series_value.push(amount);
					}
				} else {
					xAxisTitleText = "MONTH";
					subtitleText = "REVENUE MONTHLY";

					for (let x = 0; x < timeValues.length; x++) {
						const elem = timeValues[x];
						data_series_name.push(elem);

						let filterItem = revenueReport.filter(
							(f) => moment(f.date_paid).format("YYYY-MM") === elem
						);

						let amount = filterItem.reduce((a, b) => {
							let total = b.amount ? parseFloat(b.amount) : 0;

							if (b.coupon) {
								if (b.coupon.type === "fixed") {
									total = parseFloat(b.amount) - b.coupon.off;
								}
								if (b.coupon.type === "percent") {
									var percentage = b.coupon.off / 100;
									total =
										parseFloat(b.amount) - parseFloat(b.amount) * percentage;
								}
							}

							a += total;

							return a;
						}, 0);

						data_series_value.push(amount);
					}
				}
			} else {
				xAxisTitleText = "DAY";
				subtitleText = "REVENUE DAILY";

				let days = Array.from(
					{ length: moment(timeValues[0]).daysInMonth() },
					(x, i) => moment().startOf("month").add(i, "days").format("DD")
				);
				for (
					let x = 0;
					x < moment(timeValues[0], "YYYY-MM").daysInMonth();
					x++
				) {
					let elem = moment(timeValues[0]).format("YYYY-MM") + "-" + days[x];
					data_series_name.push(elem);

					let filterItem = revenueReport.filter((f) => f.date_paid === elem);

					let amount = filterItem.reduce((a, b) => {
						let total = b.amount ? parseFloat(b.amount) : 0;

						if (b.coupon) {
							if (b.coupon.type === "fixed") {
								total = parseFloat(b.amount) - b.coupon.off;
							}
							if (b.coupon.type === "percent") {
								var percentage = b.coupon.off / 100;
								total =
									parseFloat(b.amount) - parseFloat(b.amount) * percentage;
							}
						}

						a += total;

						return a;
					}, 0);

					data_series_value.push(amount);
				}
			}

			Highcharts.chart("chart_revenue_output", {
				chart: {
					type: "column",
					height: 315,
					options3d: {
						enabled: true,
						alpha: 0,
						beta: 0,
						depth: 40,
						viewDistance: 25,
					},
				},
				title: {
					text: null,
				},
				subtitle: {
					text: subtitleText,
				},
				xAxis: {
					title: {
						text: xAxisTitleText,
					},
					categories: data_series_name,
					crosshair: true,
					type: "category",
				},
				yAxis: {
					title: {
						text: null,
					},
					labels: {
						formatter: function () {
							return `$${Highcharts.numberFormat(this.value, 0, "", ",")}`;
						},
					},
				},
				tooltip: {
					headerFormat: "",
					formatter: function () {
						return `<span style="color:${this.color}; font-size:14px;">${
							this.x
						}</span><br/>TOTAL: <b>$${this.y.toFixed(2)}</b>`;
					},
					// pointFormat: `<span style="color:{point.color}; font-size:14px;">{point.name}</span><br/>TOTAL: <b>{point.y:.f}</b>`,
				},
				legend: {
					enabled: false,
				},
				plotOptions: {
					series: {
						borderWidth: 0,
						dataLabels: {
							enabled: false,
							// format: "{point.y:.2f}",
						},
					},
					column: {
						pointPadding: 0.2,
						borderWidth: 0,
						depth: 25,
						dataLabels: {
							enabled: false,
							// format: "{point.y:.0f}",
							formatter: function () {
								if (this.y === 0) {
									return null;
								}
								return this.y.toFixed(2);
							},
						},
					},
				},
				exporting: {
					enabled: false,
				},
				series: [
					{
						colorByPoint: true,
						data: data_series_value,
					},
				],
			});
		}

		return () => {};
	}, [revenueFilter, revenueReport]);

	return (
		<>
			<div>
				<div
					className="info_wrapper"
					style={{ display: "flex", alignItems: "center", gap: "8px" }}
				>
					<div className="logo" style={{ width: "40%", textAlign: "center" }}>
						<img alt="log" src={fullwidthlogo} style={{ width: "100%" }} />
					</div>
					<div className="info" style={{ width: "60%" }}>
						<div
							className="revenue_report_info"
							style={{
								border: "1px solid rgba(241, 224, 224, 0.1)",
								boxShadow: "0px 2px 5px 2px rgba(0,0,0,0.3)",
								WebkitBoxShadow: "0px 2px 5px 2px rgba(0,0,0,0.3)",
								MozBoxShadow: "0px 2px 5px 2px rgba(0,0,0,0.3)",
							}}
						>
							<div
								className="head"
								style={{
									textAlign: "center",
									backgroundColor: "#d9d9d9",
									color: "#000",
									padding: "5px",
									fontSize: "15px",
									fontWeight: "700",
									fontFamily: "Montserrat700",
								}}
							>
								Revenue Report
							</div>
							<div
								className="body"
								style={{
									background: "#f7faf9",
									display: "flex",
									flexDirection: "column",
									padding: "20px",
								}}
							>
								<div
									style={{
										display: "flex",
										fontFamily: "Montserrat600",
										color: "#000",
									}}
								>
									<div style={{ width: "50%" }}>
										From date:{" "}
										<span className="color-6">
											{revenueFilter.date_from
												? moment(revenueFilter.date_from).format("MM/DD/YYYY")
												: "MM/DD/YYYY"}
										</span>
									</div>
									<div style={{ width: "50%" }}>
										To date:{" "}
										<span className="color-6">
											{revenueFilter.date_to
												? moment(revenueFilter.date_to).format("MM/DD/YYYY")
												: "MM/DD/YYYY"}
										</span>
									</div>
								</div>

								<div
									style={{
										display: "flex",
										fontFamily: "Montserrat600",
										color: "#000",
									}}
								>
									<div style={{ width: "50%" }}>
										Caregiver %:{" "}
										<span className="color-6">{caregiversPercent}</span>
									</div>
									<div style={{ width: "50%" }}>
										Care Professional %:{" "}
										<span className="color-6">{careprovidersPercent}</span>
									</div>
								</div>

								<div
									style={{
										display: "flex",
										fontFamily: "Montserrat600",
										color: "#000",
									}}
								>
									<div style={{ width: "50%" }}>
										Total Subscribers:{" "}
										<span className="color-6">{revenueReport.length}</span>
									</div>
									<div style={{ width: "50%" }}>
										Total Revenue:{" "}
										<span className="color-6">
											<NumberFormat
												value={totalRevenue.toFixed(2)}
												displayType={"text"}
												thousandSeparator={true}
												prefix={"$"}
											/>
										</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div
				style={{
					border: "1px solid #d9d9d9",
					boxShadow: "0px 2px 5px 2px rgba(0,0,0,0.3)",
					WebkitBoxShadow: "0px 2px 5px 2px rgba(0,0,0,0.3)",
					MozBoxShadow: "0px 2px 5px 2px rgba(0,0,0,0.3)",
				}}
			>
				<div
					className="chart_revenue_output"
					id="chart_revenue_output"
					style={{
						width: "100%",
					}}
				/>
			</div>
			<div
				style={{
					width: "100%",
					display: "flex",
					fontFamily: "Montserrat600",
					color: "#000",
				}}
			>
				<div
					style={{
						display: "flex",
						gap: "8px",
						border: "1px solid rgba(0, 0, 0, 0.25)",
						padding: "5px 20px",
						background: "#D9D9D9",
						boxShadow: "0px 2px 5px 2px rgba(0,0,0,0.3)",
						WebkitBoxShadow: "0px 2px 5px 2px rgba(0,0,0,0.3)",
						MozBoxShadow: "0px 2px 5px 2px rgba(0,0,0,0.3)",
					}}
				>
					<div>
						<strong>
							Subscribers From date:{" "}
							<span className="color-6">
								{revenueFilter.date_from
									? moment(revenueFilter.date_from).format("MM/DD/YYYY")
									: "MM/DD/YYYY"}
							</span>
						</strong>
					</div>
					<div>
						<strong>
							To date:{" "}
							<span className="color-6">
								{revenueFilter.date_to
									? moment(revenueFilter.date_to).format("MM/DD/YYYY")
									: "MM/DD/YYYY"}
							</span>
						</strong>
					</div>
				</div>
			</div>
			<div style={{ fontFamily: "Montserrat600", color: "#000" }}>
				<table
					className="table"
					style={{
						marginBottom: "0px",
						boxShadow: "0px 2px 5px 2px rgba(0,0,0,0.3)",
						WebkitBoxShadow: "0px 2px 5px 2px rgba(0,0,0,0.3)",
						MozBoxShadow: "0px 2px 5px 2px rgba(0,0,0,0.3)",
					}}
				>
					<thead
						style={{
							background: "#E2EAED",
						}}
					>
						<tr>
							<th>Date</th>
							<th>Firstname</th>
							<th>Lastname</th>
							<th>Revenue</th>
							<th>Type</th>
							<th>State</th>
						</tr>
					</thead>
					<tbody
						style={{
							background: "#F7FAF9",
						}}
					>
						{revenueReport.map((item, index) => {
							let total = 0;
							if (item.invite_status === 0) {
								total = item.amount ? parseFloat(item.amount) : 0;

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
							}

							return (
								<tr key={index}>
									<td>
										{item.date_paid
											? moment(item.date_paid).format("MM/DD/YYYY")
											: ""}
									</td>
									<td>{item.firstname ? item.firstname : ""}</td>
									<td>{item.lastname ? item.lastname : ""}</td>
									<td>
										<NumberFormat
											value={parseFloat(total).toFixed(2)}
											displayType={"text"}
											thousandSeparator={true}
											prefix={"$"}
										/>
									</td>
									<td>{item.role ? item.role : ""}</td>
									<td>{item.state ? item.state : ""}</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
			<div style={{ width: "100%", display: "flex" }}>
				<div
					style={{
						background: "#D9D9D9",
						border: "1px solid rgba(0, 0, 0, 0.25)",
						padding: "5px",
						boxShadow: "0px 2px 5px 2px rgba(0,0,0,0.3)",
						WebkitBoxShadow: "0px 2px 5px 2px rgba(0,0,0,0.3)",
						MozBoxShadow: "0px 2px 5px 2px rgba(0,0,0,0.3)",
						fontFamily: "Montserrat600",
						color: "#000",
					}}
				>{`${revenueReport.length} Entries`}</div>
			</div>
		</>
	);
}
