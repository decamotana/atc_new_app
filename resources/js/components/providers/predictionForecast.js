const predictionForecast = (x, ky, kx) => {
	var i = 0,
		nr = 0,
		dr = 0,
		ax = 0,
		ay = 0,
		a = 0,
		b = 0;

	function core_average(ar) {
		var r = 0;

		for (i = 0; i < ar.length; i++) {
			r = r + ar[i];
		}

		return r / ar.length;
	}

	ax = core_average(kx);
	ay = core_average(ky);

	for (i = 0; i < kx.length; i++) {
		nr = nr + (kx[i] - ax) * (ky[i] - ay);
		dr = dr + (kx[i] - ax) * (kx[i] - ax);
	}

	b = nr / dr;
	a = ay - b * ax;

	return a + b * x;
};

export default predictionForecast;
