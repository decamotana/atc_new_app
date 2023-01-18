export const name = process.env.MIX_APP_NAME;

export const description = process.env.MIX_APP_DESCRIPTION;

export const logo = process.env.MIX_APP_LOGO;

export const fullwidthlogo = process.env.MIX_APP_FULLWIDTH_LOGO;
export const fullwidthwhitelogo = process.env.MIX_APP_FULLWIDTH_WHITE_LOGO;

export const apiUrl = process.env.MIX_APP_API_URL;

export const version = process.env.MIX_APP_VERSION;

export const date = new Date();

export const key = process.env.MIX_APP_KEY + `-${date.getFullYear()}`;

export const encryptor = require("simple-encryptor")(key);

export const encrypt = (data) => {
    return encryptor.encrypt(data);
};
export const decrypt = (data) => {
    return encryptor.decrypt(data);
};

export const token = () => {
    if (localStorage.token === null) {
        localStorage.token = "";
        return process.env.MIX_APP_API_KEY;
    }
    return "Bearer " + localStorage.token;
};

export const userData = () => {
    if (encryptor.decrypt(localStorage.userdata) === null) {
        localStorage.userdata = "";
        return false;
    }
    return encryptor.decrypt(localStorage.userdata);
};

export const role = () => {
    if (encryptor.decrypt(localStorage.userdata) === null) {
        localStorage.userdata = "";
        return false;
    }
    return encryptor.decrypt(localStorage.userdata).role;
};
