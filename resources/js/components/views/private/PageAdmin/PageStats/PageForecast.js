import React from "react";
import { Card, Col, Collapse, Row } from "antd";

import highchartsSetOptions from "../../../../providers/highchartsSetOptions";
import Highcharts from "highcharts";
import { GET } from "../../../../providers/useAxiosQuery";
import predictionDataForecast from "../../../../providers/predictionDataForecast";

export default function PageForecast() {
	highchartsSetOptions(Highcharts);

	// const [hasCollapse, setHasCollapse] = useState(false);
	// useEffect(() => {
	// 	$("#btn_sidemenu_collapse_unfold").on("click", function () {
	// 		setHasCollapse(false);
	// 		// console.log("btn_sidemenu_collapse_unfold");
	// 	});
	// 	$("#btn_sidemenu_collapse_fold").on("click", function () {
	// 		setHasCollapse(true);
	// 		// console.log("btn_sidemenu_collapse_fold");
	// 	});

	// 	return () => {};
	// }, []);

	const graphRevenuePerYearFilter = {
		action: "yearly",
		year: "",
		quarter: "",
		month: "",
		week: "",
	};

	// const { refetch: refetchGraphRevenuePerYear } =
	GET(
		`api/v1/revenue_graph_per_year_forecast?${new URLSearchParams(
			graphRevenuePerYearFilter
		)}`,
		"revenue_graph_per_year_forecast",
		(res) => {
			// console.log("revenue_graph_per_year_forecast res", res);
			if (res.data) {
				let data = res.data;

				// console.log("data", data);

				const data_series = data.data_series_value;

				data.data_series_value.map((item) => {
					let new_data_forecast = [];
					let new_data_forecast_null = [];

					for (let j = 0; j < predictionDataForecast(item.data).length; j++) {
						if (predictionDataForecast(item.data)[j] != null) {
							new_data_forecast.push(predictionDataForecast(item.data)[j]);
						} else {
							new_data_forecast_null.push(predictionDataForecast(item.data)[j]);
						}
					}

					data_series.push({
						type: "line",
						name: item.name + " TREND",
						color: "#e4151f",
						dashStyle: "ShortDash",
						marker: { enabled: false },
						data: predictionDataForecast(item.data),
					});
					return "";
				});

				let last_series_name =
					res.data.data_series_name[res.data.data_series_name.length - 1];

				let data_series_name = [];

				if (res.isYearly) {
					for (let x = 1; x <= 5; x++) {
						let add_series_name = parseInt(last_series_name) + x;
						data_series_name.push(add_series_name);
					}
				} else {
					const monthNames = [
						"January",
						"February",
						"March",
						"April",
						"May",
						"June",
						"July",
						"August",
						"September",
						"October",
						"November",
						"December",
					];
					for (let x = 0; x < res.data.data_series_name.length; x++) {
						data_series_name.push(monthNames[x]);
					}
					for (let x = 1; x <= 5; x++) {
						let add_series_name = new Date(2022, last_series_name + x, 1);
						// console.log("add_series_name", add_series_name);
						data_series_name.push(monthNames[add_series_name.getMonth()]);
					}
				}

				// console.log("data_series_name", data_series_name);
				// console.log("data_series", data_series);

				Highcharts.chart("div_revenue_by_year_forcast", {
					chart: {
						type: "column",
					},
					title: {
						text: res.isYearly ? "YEARLY REVENUE" : "MONTHLY REVENUE",
					},
					subtitle: {
						text: "This will be automatically change to per year when year is change.",
					},
					xAxis: {
						title: {
							text: res.isYearly ? "YEAR" : "MONTH",
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
					series: data_series,
				});
			}
		}
	);

	// useEffect(() => {
	// 	refetchGraphRevenuePerYear();

	// 	return () => {};
	// 	// eslint-disable-next-line react-hooks/exhaustive-deps
	// }, [graphRevenuePerYearFilter]);

	return (
		<Card id="PageStatsForecast">
			<Row gutter={[12, 12]}>
				<Col xs={24} sm={24} md={24} lg={24} xl={24}>
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
							header="REVENUE FORECAST"
							key="1"
							className="accordion bg-darkgray-form m-b-md border bgcolor-1 white"
						>
							<Row gutter={[12, 12]}>
								<Col xs={24} sm={24} md={24}>
									<div
										id="div_revenue_by_year_forcast"
										style={{
											display: "flex",
											justifyContent: "center",
											width: "100%",
										}}
									></div>
								</Col>
							</Row>
						</Collapse.Panel>
					</Collapse>
				</Col>
			</Row>
		</Card>
	);
}
