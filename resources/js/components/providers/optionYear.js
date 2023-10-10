const optionYear = [];
let date = new Date();
for (let x = date.getFullYear() - 10; x < date.getFullYear() + 10; x++) {
	optionYear.push({ value: x, label: x });
}
export default optionYear;
