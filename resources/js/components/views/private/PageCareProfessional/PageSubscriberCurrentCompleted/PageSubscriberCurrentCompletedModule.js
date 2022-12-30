import React, { useEffect, useState } from "react";
import { Card } from "antd";
import $ from "jquery";

import { GET } from "../../../../providers/useAxiosQuery";
import DashboardModules from "../../Components/DashboardModules";
import moment from "moment";

export default function PageSubscriberCurrentCompletedModule(props) {
	const [moduleFilter, setModuleFilter] = useState({
		filter_module_for: null,
		year: null,
		is_subscriber_module: null,
		user_id: null,
	});

	if (props.location.state) {
		GET(
			`api/v1/users/${props.location.state}`,
			"get_by_id_subscriber_current_completed_module",
			(res) => {
				console.log("user_modules", res);
				if (res.data) {
					let data = res.data;

					$(".li_subscribers_name").html(`${data.firstname} ${data.lastname}`);
					$(".ant-page-header .title").html(
						`${data.firstname} ${data.lastname}`
					);

					setModuleFilter({
						filter_module_for: data.role,
						year: moment(data.created_at).format("YYYY"),
						is_subscriber_module: 1,
						user_id: props.location.state,
					});
				}
			}
		);
	}

	const [hasCollapse, setHasCollapse] = useState(false);
	useEffect(() => {
		$("#btn_sidemenu_collapse_unfold").on("click", function () {
			setHasCollapse(false);
			// console.log("btn_sidemenu_collapse_unfold");
		});
		$("#btn_sidemenu_collapse_fold").on("click", function () {
			setHasCollapse(true);
			// console.log("btn_sidemenu_collapse_fold");
		});

		return () => {};
	}, []);

	return (
		<Card
			className="page-careprofessional-subscriber-current-completed"
			id="PageSubscriberCurrentCompletedModule"
		>
			<DashboardModules
				moduleFilter={moduleFilter}
				setModuleFilter={setModuleFilter}
				colMd={!hasCollapse ? 24 : 12}
				colLg={!hasCollapse ? 12 : 8}
				colXl={!hasCollapse ? 8 : 6}
				colXXL={6}
			/>
		</Card>
	);
}
