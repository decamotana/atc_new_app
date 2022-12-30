import React from "react";
import { Result, Button } from "antd";
import { useHistory } from "react-router";
const Error404 = () => {
	let history = useHistory();
	// useEffect(() => {
	//     // history.push("/?redirect=" + window.location.href);
	//     console.log('history', history)
	//     return () => {};
	// }, []);
	return (
		<Result
			status="404"
			title="404"
			subTitle="Sorry, something went wrong."
			extra={
				<Button
					type="primary"
					onClick={(e) => history.push("/?redirect=" + window.location.href)}
					className="btn-primary-default invert"
				>
					Back Home
				</Button>
			}
		/>
	);
};

export default Error404;
