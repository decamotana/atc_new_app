import moment from "moment";
export const dateDiff = date => {
    let scaffold = "minute";
    let date_now = moment().format("YYYY-MM-DD HH:mm:ss");
    let diff = moment(date_now).diff(moment(date), scaffold);
    if (diff < 0) {
        date_now = moment()
            .utc(0)
            .format("YYYY-MM-DD HH:mm:ss");
    }
    if (diff > 60) {
        scaffold = "hour";
        diff = moment(date_now).diff(moment(date), scaffold);
        if (diff > 24) {
            scaffold = "day";
            diff = moment(date_now).diff(moment(date), scaffold);
            if (diff > 28) {
                scaffold = "month";
                diff = moment(date_now).diff(moment(date), scaffold);
                if (diff > 12) {
                    scaffold = "year";
                    diff = moment(date_now).diff(moment(date), scaffold);
                }
            }
        }
    }

    return diff + " " + (diff > 1 ? scaffold + "s" : scaffold) + " " + "ago";
};
