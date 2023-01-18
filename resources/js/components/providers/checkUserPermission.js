import $ from "jquery";
import companyInfo from "./companyInfo";

const userPermission = companyInfo().userPermission;

export default function checkUserPermission(
	module_name,
	pathname = "",
	location = ""
) {
	userPermission[0].map((item) => {
		if (module_name === item.module_name) {
			item.module_button_list.map((item2) => {
				if (item2.button_code === "view_page") {
					if (item2.status === false) {
						window.location.replace("/dashboard");
					}
				} else if (item2.button_code === "btn_add") {
					if (item2.status === false) {
						if (pathname !== "" && location !== "") {
							if (pathname === location) {
								window.location.replace("/dashboard");
							}
						}

						$("[name=" + item2.button_code + "]").remove();
					} else {
						$("[name=" + item2.button_code + "]").show();
					}
				} else if (item2.button_code === "btn_edit") {
					if (item2.status === false) {
						if (pathname !== "" && location !== "") {
							if (pathname === location) {
								window.location.replace("/dashboard");
							}
						}

						$("[name=" + item2.button_code + "]").remove();
					} else {
						$("[name=" + item2.button_code + "]").show();
					}
				} else if (item2.button_code === "btn_edit_permission") {
					if (item2.status === false) {
						if (pathname !== "" && location !== "") {
							if (pathname === location) {
								window.location.replace("/dashboard");
							}
						}

						$("[name=" + item2.button_code + "]").remove();
					} else {
						$("[name=" + item2.button_code + "]").show();
					}
				} else {
					if (item2.status === false) {
						$("[name=" + item2.button_code + "]").remove();
					} else {
						$("[name=" + item2.button_code + "]").show();
					}
				}
				return "";
			});
		}
		return "";
	});
	return "";
}
