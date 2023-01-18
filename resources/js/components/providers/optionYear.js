const optionYear = [];
let date = new Date();
for (let x = 2022; x <= date.getFullYear() + 2; x++) {
	optionYear.push({ value: x, label: x });
}
export default optionYear;
