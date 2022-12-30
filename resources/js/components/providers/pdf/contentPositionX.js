export default function contentPositionX(strLength, fSize, pos) {
	// console.log("strLength, fSize, pos", strLength, fSize, pos);
	let ret = 0;
	if (strLength === 2) {
		if (fSize === 25) {
			ret = pos - 10;
		} else if (fSize === 14) {
			ret = pos - 2;
		} else {
			ret = pos;
		}
	} else if (strLength === 3) {
		if (fSize === 25) {
			ret = pos - 15;
		} else if (fSize === 14) {
			ret = pos - 4;
		} else {
			ret = pos;
		}
	} else if (strLength === 4) {
		if (fSize === 25) {
			ret = pos - 20;
		} else if (fSize === 14) {
			ret = pos - 6;
		} else {
			ret = pos;
		}
	} else if (strLength === 5) {
		if (fSize === 25) {
			ret = pos - 25;
		} else if (fSize === 14) {
			ret = pos - 8;
		} else {
			ret = pos;
		}
	} else if (strLength === 6) {
		if (fSize === 25) {
			ret = pos - 30;
		} else if (fSize === 14) {
			ret = pos - 10;
		} else {
			ret = pos;
		}
	} else if (strLength === 7) {
		if (fSize === 25) {
			ret = pos - 35;
		} else if (fSize === 14) {
			ret = pos - 12;
		} else {
			ret = pos;
		}
	} else if (strLength === 9) {
		if (fSize === 25) {
			ret = pos - 40;
		} else if (fSize === 14) {
			ret = pos - 14;
		} else {
			ret = pos;
		}
	} else {
		if (fSize === 25) {
			ret = pos;
		} else {
			ret = pos;
		}
	}
	// console.log("ret", ret);
	return ret;
}
