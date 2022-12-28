export const arrayColumn1 = (arr, n, options) => {
    var _arr = [];
    arr.map(x => {
        const found = options.find(element => element.value == x[n]);

        if (found) {
            _arr.push(found.value);
        }
    });

    return _arr;
};
