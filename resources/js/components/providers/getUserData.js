let key = "DavidInvoice@2022";
var encryptor = require("simple-encryptor")(key);

export default function getUserData() {
    if (encryptor.decrypt(localStorage.userdata) == null) {
        localStorage.storage = "";
        return false;
    }
    return encryptor.decrypt(localStorage.userdata);
}
