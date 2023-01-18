import { useEffect } from "react";
import { name } from "../../providers/companyInfo";

export default function Public(props) {
	const { title } = props;

	useEffect(() => {
		if (title) {
			document.title = title + " | " + name;
		}

		return () => {};
	}, [title]);

	return props.children;
	// sd
}
