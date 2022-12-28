export const putSpacesInFields = str => {
    if (str) {
        let _str = str.split("");
        let spaceAt = [];
        _str.map((char, key) => {
            if (char === char.toUpperCase()) {
                spaceAt.push(key);
            }
        });
        spaceAt.map((index, key) => {
            _str.splice(index + key, 0, " ");
        });
        return _str;
    }
};
