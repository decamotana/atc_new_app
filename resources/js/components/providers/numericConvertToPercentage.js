const numericConvertToPercentage = (Highcharts, data) => {
    let data_value_total = 0;

    for (let i = 0; i < data.length; i++) {
        data_value_total += parseInt(data[i]);
    }

    let data_value_total_arr = [];

    for (let j = 0; j < data.length; j++) {
        let subtotal = parseInt(data[j]) / data_value_total;
        subtotal = subtotal ? subtotal : 0;
        let total = subtotal * 100;
        data_value_total_arr.push(parseFloat(Highcharts.numberFormat(total)));
    }

    return data_value_total_arr;
};

export default numericConvertToPercentage;
