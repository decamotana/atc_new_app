export default function highchartsSetOptions(Highcharts) {
	Highcharts.setOptions({
		boost: {
			useGPUTranslations: true,
		},
		lang: {
			thousandsSep: ",",
		},
		title: {
			style: {
				color: "#3E576F",
				font: "bold 16px Lucida Grande, Lucida Sans Unicode, Verdana, Arial, Helvetica, sans-serif",
			},
		},
		subtitle: {
			style: {
				color: "#6D869F",
				font: "bold 12px Lucida Grande, Lucida Sans Unicode, Verdana, Arial, Helvetica, sans-serif",
			},
		},
		xAxis: {
			// gridLineWidth: 1,
			// lineColor: "#C0D0E0",
			// tickColor: "#C0D0E0",
			labels: {
				style: {
					color: "#666",
					fontWeight: "bold",
				},
			},
			title: {
				style: {
					color: "#6D869F",
					font: "bold 12px Lucida Grande, Lucida Sans Unicode, Verdana, Arial, Helvetica, sans-serif",
				},
			},
		},
		yAxis: {
			// alternateGridColor: null,
			// minorTickInterval: "auto",
			lineColor: "#000",
			lineWidth: 1,
			tickWidth: 1,
			tickColor: "#000",
			labels: {
				style: {
					color: "#666",
					fontWeight: "bold",
				},
			},
			title: {
				style: {
					color: "#6D869F",
					font: "bold 12px Lucida Grande, Lucida Sans Unicode, Verdana, Arial, Helvetica, sans-serif",
				},
			},
		},
		legend: {
			itemStyle: {
				color: "#3E576F",
			},
			itemHoverStyle: {
				color: "black",
			},
			itemHiddenStyle: {
				color: "silver",
			},
		},
		credits: false,
		accessibility: {
			enabled: false,
		},
		labels: {
			style: {
				color: "#3E576F",
			},
		},
	});
	return "";
}
