import predictionForecast from "./predictionForecast";

const predictionDataForecast = (data) => {
	let data_length1 = [];
	let data_length2 = [];
	let data_length3 = [];
	let data_length4 = [];
	let data_length5 = [];

	let data_rev1 = [];
	let data_rev2 = [];
	let data_rev3 = [];
	let data_rev4 = [];

	let final_data = [];

	for (let i = 0; i < data.length; i++) {
		data_length1.push(i + 1);
		data_length2.push(i + 2);
		data_length3.push(i + 3);
		data_length4.push(i + 4);
		data_length5.push(i + 5);

		if (data[i + 1] !== undefined) {
			data_rev1.push(data[i + 1]);
		}
		if (data[i + 2] !== undefined) {
			data_rev2.push(data[i + 2]);
		}
		if (data[i + 3] !== undefined) {
			data_rev3.push(data[i + 3]);
		}
		if (data[i + 4] !== undefined) {
			data_rev4.push(data[i + 4]);
		}

		final_data.push(null);
	}

	let data_f1 = predictionForecast(8, data, data_length1);
	data_rev1.push(data_f1);
	let data_f2 = predictionForecast(9, data_rev1, data_length2);
	data_rev2.push(data_f1, data_f2);
	let data_f3 = predictionForecast(10, data_rev2, data_length3);
	data_rev3.push(data_f1, data_f2, data_f3);
	let data_f4 = predictionForecast(11, data_rev3, data_length4);
	data_rev4.push(data_f1, data_f2, data_f3, data_f4);
	let data_f5 = predictionForecast(11, data_rev4, data_length5);

	final_data.push(data_f1, data_f2, data_f3, data_f4, data_f5);

	return final_data;
};

export default predictionDataForecast;

/** ========================================================== */
// import predictionForecast from "./predictionForecast";

// const predictionDataForecast = data => {
//     let data_length1 = [];
//     let data_length2 = [];
//     let data_length3 = [];
//     let data_length4 = [];
//     let data_length5 = [];
//     let data_length6 = [];
//     let data_length7 = [];

//     let data_rev1 = [];
//     let data_rev2 = [];
//     let data_rev3 = [];
//     let data_rev4 = [];
//     let data_rev5 = [];
//     let data_rev6 = [];

//     let final_data = [];

//     for (let i = 0; i < data.length; i++) {
//         data_length1.push(i + 1);
//         data_length2.push(i + 2);
//         data_length3.push(i + 3);
//         data_length4.push(i + 4);
//         data_length5.push(i + 5);
//         data_length6.push(i + 6);
//         data_length7.push(i + 7);

//         if (data[i + 1] != undefined) {
//             data_rev1.push(data[i + 1]);
//         }
//         if (data[i + 2] != undefined) {
//             data_rev2.push(data[i + 2]);
//         }
//         if (data[i + 3] != undefined) {
//             data_rev3.push(data[i + 3]);
//         }
//         if (data[i + 4] != undefined) {
//             data_rev4.push(data[i + 4]);
//         }
//         if (data[i + 5] != undefined) {
//             data_rev5.push(data[i + 5]);
//         }
//         if (data[i + 6] != undefined) {
//             data_rev6.push(data[i + 6]);
//         }

//         final_data.push(null);
//     }

//     let data_f1 = predictionForecast(8, data, data_length1);
//     data_rev1.push(data_f1);

//     let data_f2 = predictionForecast(9, data_rev1, data_length2);
//     data_rev2.push(data_f1, data_f2);

//     let data_f3 = predictionForecast(10, data_rev2, data_length3);
//     data_rev3.push(data_f1, data_f2, data_f3);

//     let data_f4 = predictionForecast(11, data_rev3, data_length4);
//     data_rev4.push(data_f1, data_f2, data_f3, data_f4);

//     let data_f5 = predictionForecast(12, data_rev4, data_length5);
//     data_rev5.push(data_f1, data_f2, data_f3, data_f4, data_f5);

//     let data_f6 = predictionForecast(13, data_rev5, data_length6);
//     data_rev6.push(data_f1, data_f2, data_f3, data_f4, data_f5, data_f6);

//     let data_f7 = predictionForecast(14, data_rev6, data_length7);

//     final_data.push(
//         data_f1,
//         data_f2,
//         data_f3,
//         data_f4,
//         data_f5,
//         data_f6,
//         data_f7
//     );

//     return final_data;
// };

// export default predictionDataForecast;
