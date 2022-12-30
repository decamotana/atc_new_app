export default function truncateDecimalNumber(x, limit) {
	let ret = 0;

	if (limit === undefined) {
		ret = Math.round(x);
	}
	return ret;
}
