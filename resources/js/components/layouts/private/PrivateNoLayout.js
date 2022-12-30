import React, { useEffect } from "react";
import { SpinnerDotted } from "spinners-react";

import { name } from "../../providers/companyInfo";

export default function PrivateNoLayout(props) {
	const { title, children } = props;

	// console.log("PrivateNoLayoutprops", props);

	useEffect(() => {
		if (title) {
			document.title = title + " | " + name;
		}
	}, [title]);

	return (
		<>
			<div className="globalLoading hide">
				<SpinnerDotted thickness="100" color="ff8303" enabled={true} />
			</div>

			{children}
		</>
	);
}
