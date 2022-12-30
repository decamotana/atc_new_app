export default function groupArrayOfObjects(list, key) {
	return list.reduce(function (rv, x) {
		(rv[x[key]] = rv[x[key]] || []).push(x);
		return rv;
	}, {});
}

// sample
// var groupedPeople = groupArrayOfObjects(tempGroupSchedule, "date");
