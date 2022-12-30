import React, { useEffect, useState } from "react";
import { Col, Divider, Layout, Row, Space, Typography } from "antd";
import Modaltooltips from "./Modaltooltips";
import { Link, useHistory } from "react-router-dom";
import $ from "jquery";
import { POST, GETMANUAL, GET } from "../../providers/useAxiosQuery";
import { getSelector } from "../../providers/getSelector";
import {
	name,
	// fullwidthlogo,
	// description,
	// encrypt,
	userData,
	decrypt,
	role,
	// role,
} from "../../providers/companyInfo";
export default function Footer() {
	let history = useHistory();
	const [width, setWidth] = useState($(window).width());

	// const [hasCollapse, setHasCollapse] = useState(false);
	// useEffect(() => {
	//   $("#btn_sidemenu_collapse_unfold").on("click", function () {
	//     setHasCollapse(false);
	//     // console.log("btn_sidemenu_collapse_unfold");
	//   });
	//   $("#btn_sidemenu_collapse_fold").on("click", function () {
	//     setHasCollapse(true);
	//     // console.log("btn_sidemenu_collapse_fold");
	//   });

	//   return () => {};
	// }, []);

	useEffect(() => {
		function handleResize() {
			setWidth($(window).width());
		}
		window.addEventListener("resize", handleResize);

		return () => window.removeEventListener("resize", handleResize);
	}, []);

	const [showTooltipModal, setShowTooltipModal] = useState(false);

	const [selector, setSelector] = useState();
	const [selectorInsertat, setSelectorInsertat] = useState();
	const [selectorIsreq, setSelectorIsreq] = useState();
	const [formDataTooltip, setFormDataTooltip] = useState({
		tooltip_color: "",
		selector: "",
		description: "",
		position: "",
		inserted_at: "",
		video_url: "",
		tooltip_type: "text",
	});
	const setClickEvents = () => {
		$("body").on("click", function (e) {
			if (e.altKey) {
				e.preventDefault();

				var class_name =
					$.type(e.target.className) === "string"
						? e.target.className
						: "object";
				var isRequired = e.target.nextElementSibling
					? e.target.nextSibling.matches("label")
					: false;

				console.log(isRequired);

				// console.log("isrequred", isRequired);
				// class_name.includes("ant-select-selection-item") ||
				// class_name.includes("ant-select-selection-overflow") ||
				// class_name.includes("ant-select-selection-search-input")

				if (
					class_name.includes("ant-collapse-header") ||
					class_name.includes("ant-input") ||
					class_name.includes("mask-input-antd")
				) {
					let _selector = getSelector(e.target);

					console.log(_selector);
					// console.log("isR", isRequired);

					var inserted_at = "";
					var is_req = "tooltip-is-not-required";
					if (
						class_name.includes("ant-input") ||
						class_name.includes("mask-input-antd")
					) {
						inserted_at = "tooltip-input";

						// if (isRequired) {
						//   is_req = "tooltip-is-not-required";
						// } else {
						//   is_req = "tooltip-is-required";
						// }
					}
					if (class_name.includes("ant-collapse-header")) {
						inserted_at = "tooltip-collapse";
					}
					// if (class_name.includes("ant-select-selection-item")) {
					//   inserted_at = "tooltip-select";
					// }
					// if (class_name.includes("ant-select-selection-overflow")) {
					//   inserted_at = "tooltip-selection";
					// }
					// if (class_name.includes("ant-select-selection-search-input")) {
					//   inserted_at = "tooltip-select";
					// }
					setSelectorIsreq(is_req);
					getTooltipBySelector(_selector);
					setSelector(_selector);
					setSelectorInsertat(inserted_at);
					setShowTooltipModal(true);
				}
			}
		});
	};

	useEffect(() => {
		var view_as_role = localStorage.userdata_admin
			? decrypt(localStorage.userdata_admin)
			: "";

		if (
			userData().role === "Super Admin" ||
			userData().role === "Admin" ||
			view_as_role.role === "Admin" ||
			view_as_role.role === "Super Admin"
		) {
			setClickEvents();
		}

		setTimeout(() => {
			getToolTips();
		}, 1500);

		return () => {};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [window.location.href]);

	const { mutate: mutateGetSelector } = POST(
		"api/v1/tooltips/selector",
		"tooltip_selector"
	);

	const getTooltipBySelector = (selector) => {
		mutateGetSelector(
			{ selector: selector, role: userData().role },
			{
				onSuccess: (res) => {
					if (res.success) {
						if (res.data.length !== 0) {
							// console.log("getTooltip", res.data[0]);
							setFormDataTooltip(res.data[0]);
						} else {
							setFormDataTooltip({
								tooltip_color: "",
								selector: "",
								description: "",
								position: "",
								inserted_at: "",
								video_url: "",
								tooltip_type: "text",
							});
						}
					}
				},
				onError: (err) => {
					console.log(err);
				},
			}
		);
	};

	const {
		// data: dataToolTips,
		// isLoading: isLoadingToolTips,
		refetch: getToolTips,
		// isFetching: isFetchingToolTips,
	} = GETMANUAL(
		`api/v1/tooltips`,
		`get_tooltiips`,
		(res) => {
			if (res.success) {
				let role = userData().role;

				res.data.map((tooltip, key) => {
					if (tooltip.role === role) {
						let description = "";
						if (tooltip.tooltip_type === "video") {
							description =
								"<iframe style='width: 185px; margin-top: 4px; ' allowfullscreen frameborder='0' allow='accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen' src=" +
								tooltip.video_url +
								"></iframe>";
						}
						if (tooltip.tooltip_type === "text") {
							description = tooltip.description;
						}

						// console.log("wew", description);

						if (tooltip.insert_at === "tooltip-collapse") {
							$(tooltip.selector).append(
								`<div class="tooltip ` +
									tooltip.insert_at +
									`">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-info-square" viewBox="0 0 16 16">
                <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
                <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
              </svg>
                    <span class=" ` +
									tooltip.position +
									` tooltiptext ` +
									tooltip.tooltip_color +
									`"> ` +
									description +
									`</span>
                </span>
                </div>`
							);
						} else {
							$(tooltip.selector).after(
								`<div class="tooltip ` +
									tooltip.insert_at +
									` ` +
									tooltip.is_req +
									`">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-info-square" viewBox="0 0 16 16">
                <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
                <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
              </svg>
                    <span class=" ` +
									tooltip.position +
									` tooltiptext ` +
									tooltip.tooltip_color +
									`"> ` +
									description +
									`</span>
                </span>
                </div>`
							);
						}
					}
					return "";
				});
			}
		},
		false
	);

	GET(
		"api/v1/maintenance",
		"maintenance",
		(res) => {
			if (res.success === true) {
				var view_as_role = localStorage.userdata_admin
					? decrypt(localStorage.userdata_admin)
					: "";

				if (
					userData().role === "Super Admin" ||
					userData().role === "Admin" ||
					view_as_role.role === "Admin" ||
					view_as_role.role === "Super Admin"
				) {
				} else {
					if (res.data.system_maintenance === 1) {
						history.push("/maintenance");
					}
				}
			}
		},
		false
	);

	return (
		<Layout.Footer>
			<Row>
				<Col
					xs={24}
					sm={24}
					md={24}
					lg={10}
					xl={10}
					// className={!hasCollapse && "text-center"}
				>
					<Typography.Text>
						© {new Date().getFullYear()} {name} All Rights Reserved.
					</Typography.Text>
				</Col>
				<Col xs={24} sm={24} md={24} lg={14} xl={14} className={`links`}>
					{role() !== "Admin" && role() !== "Super Admin" ? (
						<Space
							className="footer-links"
							split={<Divider type={width > 379 ? "vertical" : "horizontal"} />}
						>
							<Link to="/privacy-policy" target={"_blank"}>
								Privacy Policy
							</Link>
							<Link to="/terms-condition" target={"_blank"}>
								Terms & Conditions
							</Link>
							<Link to="/cookie-policy" target={"_blank"}>
								Cookie Policy
							</Link>
						</Space>
					) : null}
				</Col>
			</Row>
			{showTooltipModal && (
				<Modaltooltips
					showTooltipModal={showTooltipModal}
					setShowTooltipModal={setShowTooltipModal}
					selector={selector}
					formDataTooltip={formDataTooltip}
					setFormDataTooltip={setFormDataTooltip}
					selectorInsertat={selectorInsertat}
					selectorIsreq={selectorIsreq}
					// getToolTips={getToolTips}
				/>
			)}
		</Layout.Footer>
	);
}
