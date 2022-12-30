function newtonPound(val) {
	let result = val / 4.448222;

	return result.toFixed(6);
}

function average(total, number) {
	let result = total / number;

	return result.toFixed(2);
}

const pdfConversion = () => {
	return {
		newtonPound: newtonPound(),
		average: average(),
	};
};
export default pdfConversion;
