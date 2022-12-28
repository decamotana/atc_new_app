const key = "PromiseNetwork@2021";
const encryptor = require("simple-encryptor")(key);

export default function getUserPermission() {
    if (encryptor.decrypt(localStorage.permission) == null) {
        localStorage.viewas = false;
        localStorage.removeItem("permission");
        localStorage.removeItem("token");
        localStorage.removeItem("userdata");
        localStorage.removeItem("profile_image");
        localStorage.removeItem("viewas");
        localStorage.removeItem("user_role");

        location.href = window.location.origin;
        window.location.href = location.href;
        // return false;
    }
    return encryptor.decrypt(localStorage.permission);
}
