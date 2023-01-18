import { useEffect, useState } from "react";
import { GET } from "../../../../../providers/useAxiosQuery";
import Highcharts from "highcharts";
import leftArrow from "../../../../../assets/img/left-arrow.png";

export default function AdvertisingGraph({ id, title }) {
	const [graphFilter, setGraphFilter] = useState({
		id: id,
		action: "yearly",
		year: "",
		month: "",
	});

	useEffect(() => {
		setGraphFilter({
			...graphFilter,
			id: id,
		});
		// refetchAdvertisementGraphs();
		return () => {};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [id]);

	const { refetch: refetchAdvertisementGraphs } = GET(
		`api/v1/advertsss_graph?${new URLSearchParams(graphFilter)}`,
		"advertisement_data_graph",
		(res) => {
			// console.log("id, title ", id, title);
			if (res.data) {
				let data = res.data;

				let action = res.data.action;

				let subtitleText = "CLICK THE COLUMNS TO VIEW PER MONTH";
				let xAxisTitleText = "YEAR";

				if (action === "yearly") {
					subtitleText = "CLICK THE COLUMNS TO VIEW PER MONTH";
					xAxisTitleText = "YEAR";
				} else if (action === "monthly") {
					subtitleText = "CLICK THE COLUMNS TO VIEW PER DAY";
					xAxisTitleText = "MONTH";
				} else if (action === "daily") {
					subtitleText = "CLICK THE COLUMNS TO GO BACK PER YEAR";
					xAxisTitleText = "DAY";
				}

				Highcharts.chart(
					"div_graph_advertising",
					{
						chart: {
							type: "column",
							events: {
								click: function (e) {
									let action = data.action;
									let downTo = data.downTo;
									let series_name =
										data.data_series_name[
											Math.abs(Math.round(e.xAxis[0].value))
										];

									if (action === "yearly") {
										setGraphFilter({
											...graphFilter,
											action: downTo,
											year: series_name,
										});
									}
									if (action === "monthly") {
										setGraphFilter({
											...graphFilter,
											action: downTo,
											month: series_name,
										});
									}
									if (action === "daily") {
										setGraphFilter({
											...graphFilter,
											action: downTo,
											month: "",
											year: "",
										});
									}
								},
							},
						},
						title: {
							text: title,
						},
						subtitle: {
							text: subtitleText,
						},
						xAxis: {
							title: {
								text: xAxisTitleText,
							},
							categories: data.data_series_name,
							crosshair: true,
						},
						credits: {
							enabled: false,
						},
						yAxis: {
							title: {
								text: "COUNT CLICK",
							},
							labels: {
								formatter: function () {
									return `${Highcharts.numberFormat(this.value, 0, "", ",")}`;
								},
							},
						},
						tooltip: {
							headerFormat: "",
							formatter: function () {
								return `<span style="color:${this.color}; font-size:14px;">${
									this.x
								}</span><br/>TOTAL CLICK: <b>${Highcharts.numberFormat(
									this.y,
									0,
									"",
									","
								)}</b>`;
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
										return this.y;
									},
								},
								events: {
									click: function (e) {
										let action = data.action;
										let downTo = data.downTo;

										if (action === "yearly") {
											setGraphFilter({
												...graphFilter,
												action: downTo,
												year: e.point.category,
											});
										}
										if (action === "monthly") {
											setGraphFilter({
												...graphFilter,
												action: downTo,
												month: e.point.category,
											});
										}
										if (action === "daily") {
											setGraphFilter({
												...graphFilter,
												action: downTo,
												year: "",
												month: "",
											});
										}
									},
								},
							},
						},
						exporting: {
							enabled: false,
						},
						series: [
							{
								name: title,
								colorByPoint: true,
								data: data.data_series_value,
							},
						],
					},
					function (chart) {
						// on complete

						if (data.action !== "yearly") {
							chart.renderer
								.image(leftArrow, chart.chartWidth - 65, 15, 18, 17)
								.add()
								.addClass("highcharts-button-arrow-left")
								.css({ cursor: "pointer" })
								.attr({ title: "Filter" })
								.on("click", function () {
									// prcessing after image is clicked
									let action = res.data.action;

									if (action === "monthly") {
										setGraphFilter({
											...graphFilter,
											action: "yearly",
										});
									}
									if (action === "daily") {
										setGraphFilter({
											...graphFilter,
											action: "monthly",
										});
									}
								});
						}
					}
				);
			}
		}
	);

	useEffect(() => {
		refetchAdvertisementGraphs();

		return () => {};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [graphFilter]);

	return <div id="div_graph_advertising" />;
}
