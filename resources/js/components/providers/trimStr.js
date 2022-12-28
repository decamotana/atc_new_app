export const trimStr = (str, length) => {
    if (str) {
        if (str.length > length) {
            str = str.substring(0, length);
            str = str + "...";
        }
        return str;
    }
};
