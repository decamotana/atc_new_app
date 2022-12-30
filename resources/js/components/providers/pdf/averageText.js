export default function averageText(total) {
	/** BELOW AVERAGE 1-25% */
	/** AVERAGE 25-75% */
	/** ABOVE AVERAGE 75-100% */

	let res = "";

	if (total <= 25) {
		res = "BELOW AVERAGE";
	} else if (total > 25 && total <= 75) {
		res = "AVERAGE";
	} else if (total > 75 && total <= 100) {
		res = "ABOVE AVERAGE";
	}

	// console.log("total, res", total, res);

	return res;
}
