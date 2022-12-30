import { notification } from "antd";
import capitalize from "./capitalize";

export default function notificationErrors(err) {
	let errors = err.response.data.errors;

	if (errors) {
		let fieldnames = Object.keys(errors);
		Object.values(errors).map((messages, index) => {
			let fieldname = fieldnames[index].split("_");
			fieldname.map((string, key) => {
				fieldname[key] = capitalize(string);
				return "";
			});
			fieldname = fieldname.join(" ");
			notification.error({
				message: fieldname,
				description: messages.join("\n\r"),
			});
			return "";
		});
	}
}
