import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import {
	Button,
	Card,
	Col,
	Divider,
	notification,
	Row,
	Space,
	Typography,
	Upload,
} from "antd";
import defaultImage from "../../../assets/img/default.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/pro-regular-svg-icons";
import { faReply } from "@fortawesome/free-solid-svg-icons";
import { formats, modulesToolBar } from "../../../providers/reactQuillOptions";
import { apiUrl, role } from "../../../providers/companyInfo";
import { dateDiff } from "../../../providers/dateDiff";
import moment from "moment";

import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import ImageResize from "quill-image-resize-module-react";
import { GET, POST, UPDATE } from "../../../providers/useAxiosQuery";
import { SendOutlined, UploadOutlined } from "@ant-design/icons";
import FloatSelect from "../../../providers/FloatSelect";
Quill.register("modules/imageResize", ImageResize);

export default function PageTicketingView(props) {
	const { location } = props;
	const history = useHistory();
	const ticket_id = location.state?.id;
	const [submitButtonText, setSubmitButtonText] = useState("Reply");

	const [showReply, setShowreply] = useState(false);
	const [responseData, setResponseData] = useState({
		is_pan: false,
		response: "",
		attachment_url: [],
	});
	const [ticketUserData, setTicketUserData] = useState([]);
	const [ticketResponse, setTicketResponse] = useState([]);
	const [ticketUserImage, setTicketUserImage] = useState("");
	GET(`api/v1/ticket/${ticket_id}`, "tickets_response", (res) => {
		if (res.success) {
			//   console.log("tickets_response", res);
			setTicketUserData(res.data);
			setTicketResponse(res.data.ticket_response);
			if (res.data.requeter_user.profile_image) {
				let avatarImage = res.data.requeter_user.profile_image.split("/");
				if (avatarImage[0] === "https:") {
					setTicketUserImage(res.data.requeter_user.profile_image);
				} else {
					setTicketUserImage(apiUrl + res.data.requeter_user.profile_image);
				}
			} else {
				setTicketUserImage(defaultImage);
			}
			// console.log("ticket_response", avatarImage[0]);
		}
	});

	const { mutate: mutateTicketReply, isLoading: isLoadingTicketReply } = POST(
		"api/v1/tickets_response",
		"tickets_response"
	);

	const { mutate: mutateTicketUpdate } = UPDATE(
		`api/v1/ticket`,
		"tickets_response"
	);

	const trimResponse = (response) => {
		if (response) {
			let _response = response.split('<br><div className="gmail_quote">');
			_response = _response[0];
			return _response;
		} else {
			return response;
		}
	};

	const handleSubmitReply = () => {
		let formData = new FormData();
		formData.append(
			"response",
			responseData.response ? responseData.response : ""
		);
		formData.append("ticket_id", ticket_id);
		// console.log("responseData", responseData);
		if (
			responseData.attachment_url &&
			responseData.attachment_url.length !== 0
		) {
			if (responseData.attachment_url[0].uid !== "-1") {
				// formData.append("upload", responseData.attachment_url ? responseData.attachment_url: "");
				formData.append(
					"upload",
					responseData.attachment_url[0].originFileObj,
					responseData.attachment_url[0].name
				);
			}
		}

		formData.append("link_origin", window.location.origin);

		mutateTicketReply(formData, {
			onSuccess: (res) => {
				if (res.success) {
					notification.success({
						message: res.message,
						description: res.description,
					});
					setSubmitButtonText("Reply");
					setResponseData({
						is_pan: false,
						response: "",
						attachment_url: [],
					});
					setShowreply(false);
				}
			},
			onError: (err) => {},
		});
	};

	const handleStatusChange = (value) => {
		let data = {
			id: ticket_id,
			status: value,
		};
		mutateTicketUpdate(data, {
			onSuccess: (res) => {
				if (res.success) {
					notification.success({
						message: res.message,
						description: res.description,
					});
				} else {
					notification.success({
						message: res.message,
						description: res.description,
					});
				}
			},
		});
	};

	const [userAssigned, setUserAssigned] = useState([]);
	GET("api/v1/user_assigned_tickets", "user_assigned_tickets", (res) => {
		if (res.success) {
			// console.log("user_assigned_tickets", res);
			let arr = [];
			res.data.map((row, key) => {
				arr.push({
					value: row.id,
					label: row.email,
				});
				return "";
			});
			setUserAssigned(arr);
		}
	});

	const handleAssignedChange = (e, options) => {
		let data = {
			id: ticket_id,
			assigned: e,
		};
		mutateTicketUpdate(data, {
			onSuccess: (res) => {
				if (res.success) {
					notification.success({
						message: res.message,
						description: res.description,
					});
				} else {
					notification.success({
						message: res.message,
						description: res.description,
					});
				}
			},
		});
	};

	return (
		<Card id="PageTicketingView">
			<Row gutter={[12, 12]}>
				<Col xs={24} sm={24} md={24}>
					{ticketUserData && (
						<Row gutter={(12, 12)}>
							<Col xs={24} sm={24} md={16}>
								<Card
									headStyle={{ padding: 0 }}
									bodyStyle={{ padding: 0 }}
									bordered={false}
									title={
										<>
											<Button
												type="link"
												className="color-6"
												onClick={(e) => history.goBack()}
												style={{ paddingLeft: 0 }}
											>
												<FontAwesomeIcon
													icon={faArrowLeft}
													className="m-r-xs"
												/>
												Back to Tickets
											</Button>
											<Typography.Title>
												{ticketUserData.subject}{" "}
											</Typography.Title>
											<Row gutter={24}>
												<Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
													<span style={{ fontWeight: "300" }}>
														{moment(ticketUserData.created_at).format(
															"MMM. DD YYYY"
														)}
													</span>
												</Col>
												<Col xs={24} sm={24} md={12} className="text-right">
													<Button
														type="link"
														className="color-6"
														style={{ fontWeight: "300", float: "right" }}
														onClick={(e) => setShowreply(!showReply)}
													>
														<FontAwesomeIcon
															className="c-lightorange"
															icon={faReply}
															style={{ marginRight: "5px" }}
														/>
														Reply
													</Button>
												</Col>
											</Row>
										</>
									}
								>
									<br />
									{showReply && (
										<>
											<Row gutter={24}>
												<Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
													<ReactQuill
														className="ticket-quill"
														theme="snow"
														style={{ height: 200 }}
														modules={modulesToolBar}
														formats={formats}
														onChange={(e) => {
															setResponseData({
																...responseData,
																response: e,
															});
														}}
													/>
												</Col>
												<Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
													<Upload
														onChange={({ fileList: newFileList }) => {
															var _file = newFileList;
															if (_file.length !== 0) {
																_file[0].status = "done";
																setResponseData({
																	...responseData,
																	attachment_url: _file,
																});
															} else {
																setResponseData({
																	...responseData,
																	attachment_url: [],
																});
															}
														}}
														maxCount={1}
													>
														<Button
															icon={<UploadOutlined />}
															className="color-6 border-color-6"
														>
															Attach File
														</Button>
													</Upload>
													<br />
												</Col>
												<Col className="gutter-row" xs={24} sm={24} md={24}>
													<Space>
														<Button
															size="large"
															type="primary"
															className="mr-1 btn-main-invert"
															loading={isLoadingTicketReply}
															onClick={handleSubmitReply}
															icon={<SendOutlined />}
														>
															{submitButtonText}
														</Button>
														<Button
															size="large"
															className="btn-main-invert-outline-active"
															onClick={(e) => {
																setShowreply(false);
																setResponseData(null);
															}}
															style={{ marginLeft: 5 }}
														>
															Cancel
														</Button>
													</Space>
												</Col>
											</Row>
											<Divider />
										</>
									)}

									{ticketUserData && (
										<>
											<Row gutter={24}>
												<Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
													<div>
														<div style={{ display: "flex" }}>
															<img
																src={ticketUserImage}
																width="40"
																height="40"
																className="pull-left mr-2 "
																style={{
																	marginRight: 5,
																	borderRadius: "50%",
																}}
																alt=""
															/>
															<div>
																{ticketUserData.requeter_user
																	? ticketUserData.requeter_user.firstname
																	: ""}{" "}
																{ticketUserData.requeter_user
																	? ticketUserData.requeter_user.lastname
																	: ""}
																<br />{" "}
																<small className="text-muted">
																	{dateDiff(ticketUserData.created_at)}
																</small>
															</div>
														</div>
														<br />
														{ticketUserData.requeter_user && (
															<div
																dangerouslySetInnerHTML={{
																	__html: trimResponse(ticketUserData.comments),
																}}
															></div>
														)}
													</div>
												</Col>
											</Row>
											<Divider />
										</>
									)}

									{/* <Skeleton loading={isLoadingGetTicket}> */}
									<Row gutter={24}>
										<Col xs={24} sm={24} md={24}>
											{ticketResponse &&
												ticketResponse.map((row, key) => {
													let image_type = row.user_submitted.profile_image
														? row.user_submitted.profile_image.split("/")
														: defaultImage;
													return (
														<div key={key}>
															<div style={{ display: "flex" }}>
																<img
																	src={
																		image_type[0] === "https:"
																			? row.user_submitted.profile_image
																			: row.user_submitted.profile_image
																			? apiUrl +
																			  row.user_submitted.profile_image
																			: defaultImage
																	}
																	width="40"
																	height="40"
																	className="pull-left mr-2 "
																	style={{
																		marginRight: 5,
																		borderRadius: "50%",
																	}}
																	alt=""
																/>
																<div>
																	{row.user_submitted.firstname}{" "}
																	{row.user_submitted.lastname}
																	<br />{" "}
																	<small className="text-muted">
																		{dateDiff(row.created_at)}
																	</small>
																</div>
															</div>
															<br />
															<div
																dangerouslySetInnerHTML={{
																	__html: trimResponse(row.response),
																}}
															></div>
															<br />
															{row.attachment_url && (
																<a
																	rel="noreferrer"
																	target="_blank"
																	download={`${apiUrl}${row.attachment_url}`}
																	href={`${apiUrl}${row.attachment_url}`}
																>
																	Attachment
																</a>
															)}

															<Divider />
														</div>
													);
												})}
										</Col>
									</Row>
									{/* </Skeleton> */}
								</Card>
							</Col>

							<Col xs={24} sm={24} md={8}>
								<Card bordered={false}>
									<h3>
										<b>Ticket Information</b>
									</h3>
									<span className="span-title">
										Ticket ID
										<br />
									</span>
									<span>
										<b>#{ticketUserData.id}</b>
									</span>
									<br />
									<br />

									<span className="span-title">Subject</span>
									<br />
									<span>
										<b>{ticketUserData.subject}</b>
									</span>
									<br />
									<br />

									<span className="span-title">Status</span>
									<br />
									<span>
										<b>{ticketUserData.status}</b>
									</span>
									<br />
									<br />
									{(role() === "Admin" || role() === "Super Admin") && (
										<>
											<FloatSelect
												placeholder="Status"
												label="Status"
												value={ticketUserData.status}
												options={[
													{ label: "Open", value: "Open" },
													{
														label: "Awaiting Customer Reply",
														value: "Awaiting Customer Reply",
													},
													{
														label: "Awaiting Support Reply",
														value: "Awaiting Support Reply",
													},
													{ label: "On Hold", value: "On Hold" },
													{ label: "Closed", value: "Closed" },
													{ label: "Archive", value: "Archive" },
												]}
												onChange={handleStatusChange}
											/>
											<br />
											<FloatSelect
												placeholder="Search Assigned"
												label="Search Assigned"
												value={ticketUserData.assigned}
												options={userAssigned}
												onChange={handleAssignedChange}
											/>
										</>
									)}
								</Card>
							</Col>
						</Row>
					)}
				</Col>
			</Row>
		</Card>
	);
}
