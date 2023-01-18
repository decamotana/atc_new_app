import { useEffect, useState } from "react";
import { Card, Col, Collapse, Form, Row, Typography } from "antd";
import $ from "jquery";
import moment from "moment";
import { GET } from "../../../../providers/useAxiosQuery";
import FloatSelect from "../../../../providers/FloatSelect";
import FloatDatePicker from "../../../../providers/FloatDatePicker";
import optionYear from "../../../../providers/optionYear";
import optionMonth from "../../../../providers/optionMonth";
// import optionStateCodes from "../../../../providers/optionStateCodes";
import optionCountryCodes from "../../../../providers/optionCountryCodes";
import optionStateCodesUnitedState from "../../../../providers/optionStateCodesUnitedState";
import optionStateCodesCanada from "../../../../providers/optionStateCodesCanada";

import leftArrow from "../../../../assets/img/left-arrow.png";
import highchartsSetOptions from "../../../../providers/highchartsSetOptions";
import Highcharts from "highcharts";
import predictionDataForecast from "../../../../providers/predictionDataForecast";

export default function PageFinancials() {
	highchartsSetOptions(Highcharts);

	const [graphRevenuePerYearFilter, setGraphRevenuePerYearFilter] = useState({
		action: "yearly",
		year: "",
		quarter: "",
		month: "",
		week: "",
	});

	const { refetch: refetchGraphRevenuePerYear } = GET(
		`api/v1/revenue_graph_per_year?${new URLSearchParams(
			graphRevenuePerYearFilter
		)}`,
		"dashboard_revenue_graph_per_year",
		(res) => {
			// console.log("data_series_value res", res);
			if (res.data) {
				let data = res.data;
				let action = res.data.action;

				let xAxisTitleText = "YEAR";
				let subtitleText = "CLICK THE COLUMNS TO VIEW PER QUARTER";

				if (action === "yearly") {
					xAxisTitleText = "YEAR";
					subtitleText = "CLICK THE COLUMNS TO VIEW PER QUARTER";
				} else if (action === "quarterly") {
					xAxisTitleText = "QUARTER";
					subtitleText = "CLICK THE COLUMNS TO VIEW PER MONTH";
				} else if (action === "monthly") {
					xAxisTitleText = "MONTH";
					subtitleText = "CLICK THE COLUMNS TO VIEW PER WEEK";
				} else if (action === "daily") {
					xAxisTitleText = "DAY";
					subtitleText = "CLICK THE COLUMNS TO GO BACK TO PER YEAR";
				}

				Highcharts.chart(
					"div_revenue_by_year",
					{
						chart: {
							type: "column",
							events: {
								// load: function (event) {
								// 	event.target.reflow();
								// },
								click: function (e) {
									let action = data.action;
									let downTo = data.downTo;
									let series_name =
										data.data_series_name[
											Math.abs(Math.round(e.xAxis[0].value))
										];

									if (action === "yearly") {
										setGraphRevenuePerYearFilter({
											...graphRevenuePerYearFilter,
											action: downTo,
											year: series_name,
										});
									}
									if (action === "quarterly") {
										setGraphRevenuePerYearFilter({
											...graphRevenuePerYearFilter,
											action: downTo,
											quarter: series_name,
										});
									}
									if (action === "monthly") {
										setGraphRevenuePerYearFilter({
											...graphRevenuePerYearFilter,
											action: downTo,
											month: series_name,
										});
									}
									if (action === "daily") {
										setGraphRevenuePerYearFilter({
											...graphRevenuePerYearFilter,
											action: downTo,
											week: "",
											month: "",
											quarter: "",
										});
									}
								},
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
							categories: data.data_series_name,
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
								events: {
									click: function (e) {
										let action = data.action;
										let downTo = data.downTo;

										if (action === "yearly") {
											setGraphRevenuePerYearFilter({
												...graphRevenuePerYearFilter,
												action: downTo,
												year: e.point.category,
											});
										}
										if (action === "quarterly") {
											setGraphRevenuePerYearFilter({
												...graphRevenuePerYearFilter,
												action: downTo,
												quarter: e.point.category,
											});
										}
										if (action === "monthly") {
											setGraphRevenuePerYearFilter({
												...graphRevenuePerYearFilter,
												action: downTo,
												month: e.point.category,
											});
										}
										if (action === "daily") {
											setGraphRevenuePerYearFilter({
												...graphRevenuePerYearFilter,
												action: downTo,
												week: "",
												month: "",
												quarter: "",
											});
										}
									},
								},
							},
						},
						series: [
							{
								name: "REVENUE BY YEAR",
								colorByPoint: true,
								data: data.data_series_value,
							},
						],
						exporting: {
							buttons: {
								contextButton: {
									symbolStroke: "#13f4f1",
								},
							},
						},
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

									if (action === "quarterly") {
										setGraphRevenuePerYearFilter({
											...graphRevenuePerYearFilter,
											action: "yearly",
										});
									}
									if (action === "monthly") {
										setGraphRevenuePerYearFilter({
											...graphRevenuePerYearFilter,
											action: "quarterly",
										});
									}
									if (action === "daily") {
										setGraphRevenuePerYearFilter({
											...graphRevenuePerYearFilter,
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
		refetchGraphRevenuePerYear();

		return () => {};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [graphRevenuePerYearFilter]);

	const [filterRevenuePerMonth, setFilterRevenuePerMonth] = useState({
		year: moment().format("YYYY"),
		month: moment().format("MM"),
	});
	const { refetch: refetchRevenuePerMonth } = GET(
		`api/v1/revenue_per_month?${new URLSearchParams(filterRevenuePerMonth)}`,
		"dashboard_revenue_per_month",
		(res) => {
			// console.log("res", res);
			if (res.data) {
				Highcharts.chart("div_revenue_by_month", {
					chart: {
						plotBackgroundColor: null,
						plotBorderWidth: null,
						plotShadow: false,
						type: "pie",
						height: 330,
					},
					title: {
						text: null,
					},
					tooltip: {
						formatter: function () {
							return `<b>${this.key}: $${this.y.toFixed(2)}`;
						},
					},
					plotOptions: {
						pie: {
							allowPointSelect: true,
							cursor: "pointer",
							dataLabels: {
								enabled: true,
								distance: -50,
								formatter: function () {
									return `<b style="font-size:16px;">$${this.y.toFixed(2)}</b>`;
								},
							},
							showInLegend: true,
						},
					},
					accessibility: {
						enabled: false,
					},
					series: [
						{
							name: "REVENUE BY MONTH",
							colorByPoint: true,
							data: res.data,
						},
					],
					legend: {
						align: "center",
						verticalAlign: "top",
						layout: "vertical",
						y: 35,
					},
					exporting: {
						buttons: {
							contextButton: {
								align: "center",
								symbolStroke: "#13f4f1",
							},
						},
					},
				});
			}
		}
	);

	const handleOnValuesChangePerMonth = (e) => {
		// console.log("handleOnValuesChangePerMonth", e);
		if (e.year) {
			setFilterRevenuePerMonth({
				...filterRevenuePerMonth,
				year: e.year,
			});
		}
		if (e.month) {
			setFilterRevenuePerMonth({
				...filterRevenuePerMonth,
				month: e.month,
			});
		}
	};

	useEffect(() => {
		refetchRevenuePerMonth();

		return () => {};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [filterRevenuePerMonth]);

	const [formRevenueByState] = Form.useForm();

	const stateUS = optionStateCodesUnitedState();
	const stateCA = optionStateCodesCanada();
	const [optionState, setOptionState] = useState(stateUS);
	const [stateLabel, setStateLabel] = useState("State");

	const [filterRevenuePerState, setFilterRevenuePerState] = useState({
		type: "ALL",
		country: "United States",
		state: "AZ",
	});
	const { refetch: refetchRevenuePerState } = GET(
		`api/v1/revenue_per_state?${new URLSearchParams(filterRevenuePerState)}`,
		"dashboard_revenue_per_state",
		(res) => {
			// console.log("res", res);
			if (res.data) {
				Highcharts.chart("div_revenue_by_state", {
					chart: {
						plotBackgroundColor: null,
						plotBorderWidth: null,
						plotShadow: false,
						type: "pie",
						height: 330,
					},
					title: {
						text: null,
					},
					tooltip: {
						formatter: function () {
							// console.log("this", this);
							return `<b>${this.key}: $${this.y.toFixed(2)}`;
						},
					},
					plotOptions: {
						pie: {
							allowPointSelect: true,
							cursor: "pointer",
							dataLabels: {
								enabled: true,
								// format: "<b>{point.name}</b><br>{point.y:.0f}",
								distance: -50,
								formatter: function () {
									// console.log("this", this);
									return `<b style="font-size:16px;">$${this.y.toFixed(2)}</b>`;
								},
							},
							showInLegend: true,
						},
					},
					series: [
						{
							name: "REVENUE BY STATE",
							colorByPoint: true,
							data: res.data,
						},
					],
					legend: {
						align: "center",
						verticalAlign: "top",
						layout: "vertical",
						y: 35,
					},
					exporting: {
						buttons: {
							contextButton: {
								align: "center",
								symbolStroke: "#13f4f1",
							},
						},
					},
				});
			}
		}
	);

	const handleOnValuesChangePerState = (e) => {
		// console.log("handleOnValuesChangePerState", e);

		setFilterRevenuePerState({
			...filterRevenuePerState,
			...e,
			state:
				e.state === undefined
					? e.country === "Canada"
						? "AB"
						: "AZ"
					: e.state,
		});
	};

	const handleCountryByState = (e, opt) => {
		if (e === "United States") {
			setOptionState(stateUS);
			setStateLabel("State");
			formRevenueByState.setFieldsValue({ state: "AZ" });
		} else if (e === "Canada") {
			setOptionState(stateCA);
			setStateLabel("County");

			formRevenueByState.setFieldsValue({ state: "AB" });
		} else {
			setOptionState(stateUS);
			setStateLabel("State");
			formRevenueByState.setFieldsValue({ state: "AZ" });
		}
	};

	useEffect(() => {
		refetchRevenuePerState();

		return () => {};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [filterRevenuePerState]);

	const [filterRevenueAll, setFilterRevenueAll] = useState({
		date_start: moment(1, "DD").format("YYYY-MM-DD"),
		date_end: moment().format("YYYY-MM-DD"),
		type: "ALL",
	});
	const { data: dataRevenueAll, refetch: refetchRevenueAll } = GET(
		`api/v1/revenue_all?${new URLSearchParams(filterRevenueAll)}`,
		"dashboard_revenue_all",
		(res) => {
			// console.log("res", res);
		}
	);

	const handleOnValuesChangeAll = (e) => {
		// console.log("handleOnValuesChange", e);
		if (e.date_start) {
			setFilterRevenueAll({
				...filterRevenueAll,
				date_start: moment(e.date_start).format("YYYY-MM-DD"),
			});
		}
		if (e.date_end) {
			setFilterRevenueAll({
				...filterRevenueAll,
				date_end: moment(e.date_end).format("YYYY-MM-DD"),
			});
		}
		if (e.type) {
			setFilterRevenueAll({
				...filterRevenueAll,
				type: e.type,
			});
		}
	};

	useEffect(() => {
		refetchRevenueAll();

		return () => {};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [filterRevenueAll]);

	const graphRevenueForecastPerYearFilter = {
		action: "yearly",
		year: "",
		quarter: "",
		month: "",
		week: "",
	};

	GET(
		`api/v1/revenue_graph_per_year_forecast?${new URLSearchParams(
			graphRevenueForecastPerYearFilter
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
						data_series_name.push(monthNames[res.data.data_series_name[x]]);
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
					series: data_series,
					exporting: {
						buttons: {
							contextButton: {
								symbolStroke: "#13f4f1",
							},
						},
					},
				});
			}
		}
	);

	const [hasCollapse, setHasCollapse] = useState(false);
	useEffect(() => {
		$("#btn_sidemenu_collapse_unfold").on("click", function () {
			setHasCollapse(false);
			// console.log("btn_sidemenu_collapse_unfold");
		});
		$("#btn_sidemenu_collapse_fold").on("click", function () {
			setHasCollapse(true);
			// console.log("btn_sidemenu_collapse_fold");
		});

		return () => {};
	}, []);

	return (
		<Card id="PageStatsFinancials">
			<Row gutter={[12, 12]}>
				<Col xs={24} sm={24} md={24} lg={hasCollapse ? 16 : 24} xl={16}>
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
							header="REVENUE"
							key="1"
							className="accordion bg-darkgray-form m-b-md border bgcolor-1 white"
						>
							<Row gutter={[12, 12]}>
								<Col xs={24} sm={24} md={24}>
									<div
										id="div_revenue_by_year"
										style={{
											display: "flex",
											justifyContent: "center",
											width: "100%",
										}}
									></div>
								</Col>
								<Col xs={24} sm={24} md={hasCollapse ? 24 : 12}>
									<Typography.Title level={4} className="color-1">
										REVENUE BY MONTH
									</Typography.Title>

									<Form
										initialValues={{
											year: moment().format("YYYY"),
											month: moment().format("MM"),
										}}
										onValuesChange={handleOnValuesChangePerMonth}
									>
										<Row gutter={8}>
											<Col xs={24} sm={12} md={12}>
												<Form.Item name="year" className="form-select-error">
													<FloatSelect
														label="Year"
														placeholder="Year"
														options={optionYear}
													/>
												</Form.Item>
											</Col>
											<Col xs={24} sm={12} md={12}>
												<Form.Item name="month" className="form-select-error">
													<FloatSelect
														label="Month"
														placeholder="Month"
														options={optionMonth}
													/>
												</Form.Item>
											</Col>
											<Col xs={24} sm={24} md={24}>
												<div
													id="div_revenue_by_month"
													className="highchart-responsive"
												/>
											</Col>
										</Row>
									</Form>
								</Col>
								<Col xs={24} sm={24} md={hasCollapse ? 24 : 12}>
									<Typography.Title level={4} className="color-1">
										REVENUE BY STATE
									</Typography.Title>

									<Form
										initialValues={{
											type: "ALL",
											country: "United States",
											state: "AZ",
										}}
										onValuesChange={handleOnValuesChangePerState}
										form={formRevenueByState}
									>
										<Row gutter={[12, 12]}>
											<Col xs={24} sm={12} md={12}>
												<Form.Item
													name="type"
													className="m-b-sm form-select-error"
													rules={[
														{
															required: true,
															message: "This field is required.",
														},
													]}
												>
													<FloatSelect
														label="Select"
														placeholder="Select"
														options={[
															{
																value: "ALL",
																label: "All",
															},
															{
																value: "Cancer Caregiver",
																label: "Cancer Caregiver",
															},
															{
																value: "Cancer Care Professional",
																label: "Cancer Care Professional",
															},
														]}
													/>
												</Form.Item>
											</Col>
											<Col xs={24} sm={12} md={12}>
												<Form.Item name="country" className="form-select-error">
													<FloatSelect
														label="Country"
														placeholder="Country"
														options={optionCountryCodes}
														onChange={handleCountryByState}
													/>
												</Form.Item>
											</Col>
											<Col xs={24} sm={12} md={12}>
												<Form.Item name="state" className="form-select-error">
													<FloatSelect
														label={stateLabel}
														placeholder={stateLabel}
														options={optionState}
													/>
												</Form.Item>
											</Col>
											<Col xs={24} sm={24} md={24}>
												<div
													id="div_revenue_by_state"
													className="highchart-responsive"
												/>
											</Col>
										</Row>
									</Form>
								</Col>
							</Row>
						</Collapse.Panel>
					</Collapse>

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
				<Col xs={24} sm={24} md={24} lg={hasCollapse ? 8 : 24} xl={8}>
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
							header="REVENUE"
							key="1"
							className="accordion bg-darkgray-form m-b-md border "
						>
							<Form
								initialValues={{
									date_start: moment(1, "DD"),
									date_end: moment(),
									type: "ALL",
								}}
								onValuesChange={handleOnValuesChangeAll}
							>
								<Row gutter={8}>
									<Col
										xs={24}
										sm={8}
										md={8}
										lg={8}
										xl={hasCollapse ? 8 : 24}
										xxl={8}
									>
										<Form.Item name="date_start">
											<FloatDatePicker
												label="Date Start"
												placeholder="Date Start"
												format="MM/DD/YYYY"
											/>
										</Form.Item>
									</Col>
									<Col
										xs={24}
										sm={8}
										md={8}
										lg={8}
										xl={hasCollapse ? 8 : 24}
										xxl={8}
									>
										<Form.Item name="date_end">
											<FloatDatePicker
												label="Date End"
												placeholder="Date End"
												format="MM/DD/YYYY"
											/>
										</Form.Item>
									</Col>
									<Col
										xs={24}
										sm={8}
										md={8}
										lg={8}
										xl={hasCollapse ? 8 : 24}
										xxl={8}
									>
										<Form.Item
											name="type"
											className="m-b-sm form-select-error"
											hasFeedback
											rules={[
												{
													required: true,
													message: "This field is required.",
												},
											]}
										>
											<FloatSelect
												label="Select"
												placeholder="Select"
												options={[
													{
														value: "ALL",
														label: "All",
													},
													{
														value: "Cancer Caregiver",
														label: "Cancer Caregiver",
													},
													{
														value: "Cancer Care Professional",
														label: "Cancer Care Professional",
													},
												]}
											/>
										</Form.Item>
									</Col>
								</Row>
							</Form>

							<Typography.Text strong>
								TOTAL: ${dataRevenueAll?.data.toFixed(2)}
							</Typography.Text>
						</Collapse.Panel>
					</Collapse>
				</Col>
			</Row>
		</Card>
	);
}
