import { useHistory } from "react-router-dom";
import {
	Button,
	Card,
	Col,
	Dropdown,
	Input,
	Layout,
	Menu,
	Row,
	Space,
	Tooltip,
	Typography,
} from "antd";
import React, { useEffect, useState } from "react";
import { GET, GETMANUAL, POST } from "../../../providers/useAxiosQuery";
import notificationErrors from "../../../providers/notificationErrors";
import { BiPaperPlane } from "react-icons/bi";

import {
	CloseOutlined,
	DeleteOutlined,
	RedoOutlined,
	InboxOutlined,
	RightOutlined,
	LeftOutlined,
} from "@ant-design/icons";
import $ from "jquery";
import FloatSelect from "../../../providers/FloatSelect";
import FloatInput from "../../../providers/FloatInput";
import moment from "moment";
import { apiUrl, userData } from "../../../providers/companyInfo";
import optionUserType from "../../../providers/optionUserType";

const { Sider, Content } = Layout;

const PageMessages = () => {
	const urlParams = new URLSearchParams(window.location.search);
	const message_id = urlParams.get("message_id");
	const history = useHistory();

	let userdata = userData();
	// const sub_title = "View";

	const [collapsed, setCollapsed] = useState(
		$(window).width() <= 768 ? true : false
	);

	// const toggle = () => {
	// 	setCollapsed(!collapsed);
	// };

	const [messageItems, setMessageItems] = useState([]);
	const [filterMessageStatus, setFilterMessageStatus] = useState("Active");
	const { data: dataMessages, refetch: refetchMessages } = GET(
		`api/v1/message?status=${filterMessageStatus}`,
		`message_${userdata.id}`,
		(res) => {
			// console.log("convo", res);
			let items = [];
			res.data.map((item, key) => {
				let name = "";
				let icon;
				let to_id;
				if (item.from_id === userdata.id) {
					to_id = item.to_id;
					name = `${item.to.firstname} ${item.to.lastname} (${item.to.role})`;
					// console.log("itemsssssssssssssssssssssssssss", item);
					let image = item.to.profile_image;
					if (image) {
						image = image.includes("gravatar") ? image : `${apiUrl}${image}`;
					} else {
						image = `${apiUrl}images/default.png`;
					}

					icon = (
						<img
							style={{ width: "25px", height: "25px", borderRadius: "50%" }}
							src={image}
							alt=""
						/>
					);
				}
				if (item.to_id === userdata.id) {
					to_id = item.from_id;
					name = `${item.from.firstname} ${item.from.lastname} (${item.from.role})`;

					let image = item.from.profile_image;
					if (image) {
						image = image.includes("gravatar") ? image : `${apiUrl}${image}`;
					} else {
						image = `${apiUrl}images/default.png`;
					}
					icon = (
						<img
							style={{ width: "25px", height: "25px", borderRadius: "50%" }}
							src={image}
							alt=""
						/>
					);
				}
				items.push({ key: item.id, to_id: to_id, label: name, icon: icon });

				return "";
			});
			setMessageItems(items);
		}
	);

	useEffect(() => {
		if (dataMessages) {
			refetchMessages();
		}

		return () => {};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [filterMessageStatus]);

	useEffect(() => {
		// console.log("message_id", message_id);
		if (message_id) {
			setSelectedMessage(message_id);
			$(".ant-menu-item").removeClass("ant-menu-item-selected");
			$(".item_key_" + message_id).addClass("ant-menu-item-selected");
		}

		if (selectedMessage) {
			// console.log("selectedMessage", selectedMessage);
			$(".ant-menu-item").removeClass("ant-menu-item-selected");
			$(".item_key_" + selectedMessage).addClass("ant-menu-item-selected");
		}

		return () => {};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [messageItems]);

	const [searchData, setSearchData] = useState("");
	const [roleToSearch, setRoleToSearch] = useState();

	const handleSearchUser = (e) => {
		// console.log("handleSearchUser e", e);
		let search = e;
		setSearchData(search);
	};

	const { data: dataSearchUser, refetch: refetchSearchUser } = GETMANUAL(
		`api/v1/users?for_messages=1&search=${searchData}&role=${JSON.stringify([
			roleToSearch,
		])}`,
		"searched_data_users",
		(res) => {
			// console.log("res", res);
		}
	);

	useEffect(() => {
		let interval = setTimeout(() => {
			if (roleToSearch && searchData !== "") {
				// alert(searchData);
				refetchSearchUser();
			}
		}, 1000);

		return () => clearInterval(interval);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [searchData, roleToSearch]);

	const [showNewMessageContainer, setShowNewMessageContainer] = useState(false);

	const { mutate: mutateStartNewConvo } = POST(
		"api/v1/message",
		`message_${userdata.id}`
	);
	const handleMakeNewConvo = (to_id) => {
		let data = {
			to_id: to_id,
			from_id: userdata.id,
		};
		// console.log(data);
		mutateStartNewConvo(data, {
			onSuccess: (res) => {
				// console.log(res);

				setShowNewMessageContainer(false);
				setSelectedMessage(res.data.id);
				setRoleToSearch();
				setSearchData("");
			},
			onError: (err) => {
				notificationErrors(err);
			},
		});
	};

	const [selectedMessage, setSelectedMessage] = useState();

	const { data: dataSearchMessageConvo, refetch: refetchSearchMessageConvo } =
		GETMANUAL(
			`api/v1/message_convo/${selectedMessage ? selectedMessage : ""}`,
			`selected_convo_${selectedMessage ? selectedMessage : ""}`,
			(res) => {
				// console.log("selected_convo_", res);
				if (res.success) {
					setTimeout(
						() => {
							scrollToBottom();
						},
						dataSearchMessageConvo ? 0 : 500
					);
				}
			}
		);

	useEffect(() => {
		if (selectedMessage) {
			// console.log("roleToSearch", roleToSearch);
			refetchSearchMessageConvo();
			$(".ant-menu-item").removeClass("ant-menu-item-selected");
			$(".item_key_" + selectedMessage).addClass("ant-menu-item-selected");
		}

		return () => {};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedMessage]);

	const [messageText, setMessageText] = useState("");
	const { mutate: mutateNewMessageConvo } = POST("api/v1/message_convo", [
		`selected_convo_${selectedMessage ? selectedMessage : ""}`,
		`message_${userdata.id}`,
		"get_messages_alert",
	]);

	const handleNewMessageConvo = () => {
		let data = {
			from_id: userdata.id,
			to_id: messageItems.find((p) => p.key === parseInt(selectedMessage))
				.to_id,
			message_id: selectedMessage,
			message: messageText,
			link_origin: window.location.origin,
		};
		// console.log(data);
		mutateNewMessageConvo(data, {
			onSuccess: (res) => {
				// console.log(res);
				setMessageText("");
				// setShowNewMessageContainer(false);
				//edit
			},
		});
	};

	// const AlwaysScrollToBottom = () => {
	// 	const elementRef = useRef();
	// 	useEffect(() => elementRef.current.scrollIntoView());
	// 	return <div ref={elementRef} />;
	// };

	const scrollToBottom = () => {
		const objDiv = document.getElementById("messageConvoContainer");
		// objDiv.scrollTop = objDiv.scrollHeight;
		if (objDiv) {
			objDiv.animate({ scrollTop: objDiv.scrollHeight }, 0);
		}
	};

	const searchForOptions = optionUserType;

	useEffect(() => {
		// console.log("searchForOptions", searchForOptions);
		return () => {};
	}, [searchForOptions]);

	// const { mutate: mutateUpdateMessage, isLoading: isLoadingUpdateMessage } =
	// 	UPDATE("api/v1/message", [
	// 		`selected_convo_${selectedMessage ? selectedMessage : ""}`,
	// 		`message_${userdata.id}`,
	// 	]);

	// const handleUpdateMessage = (data) => {
	// 	// let data = { id: message_id };
	// 	mutateUpdateMessage(data, {
	// 		onSuccess: (res) => {
	// 			console.log(res);
	// 			// if (data.archived == 1) {
	// 			setSelectedMessage();
	// 			// if (selectedMessage == message_id) {

	// 			// }
	// 			// }
	// 		},
	// 	});
	// };

	const { mutate: mutateArchiveMessage } = POST(
		"api/v1/message_archived?action=archive",
		[
			`selected_convo_${selectedMessage ? selectedMessage : ""}`,
			`message_${userdata.id}`,
		]
	);
	const handleArchiveMessage = (message_id) => {
		let data = { message_id: message_id, user_id: userdata.id };
		mutateArchiveMessage(data, {
			onSuccess: (res) => {
				// console.log(res);
				// if (data.archived == 1) {
				setSelectedMessage();
				// if (selectedMessage == message_id) {

				// }
				// }
			},
		});
	};
	const { mutate: mutateRestoreMessage } = POST(
		"api/v1/message_archived?action=restore",
		[
			`selected_convo_${selectedMessage ? selectedMessage : ""}`,
			`message_${userdata.id}`,
		]
	);
	const handleRestoreMessage = (message_id) => {
		let data = { message_id: message_id, user_id: userdata.id };
		mutateRestoreMessage(data, {
			onSuccess: (res) => {
				// console.log(res);
				// if (data.archived == 1) {
				setSelectedMessage();
				// if (selectedMessage == message_id) {

				// }
				// }
			},
		});
	};

	const { data: dataMessageBlocklist } = GET(
		`api/v1/message_blocked/${userdata.id}`,
		`blocklist_${userdata.id}`,
		(res) => {
			// console.log("blocklist", res);
		}
	);

	const { mutate: mutateBlockUser } = POST(
		"api/v1/message_blocked?action=block",
		[
			`selected_convo_${selectedMessage ? selectedMessage : ""}`,
			`message_${userdata.id}`,
			`blocklist_${userdata.id}`,
			"searched_data_users",
		]
	);
	const handleBlockUser = (blocked_id) => {
		let data = { blocked_id, user_id: userdata.id, action: "block" };
		setSearchData("");
		mutateBlockUser(data, {
			onSuccess: (res) => {
				// console.log(res);
				// if (data.archived == 1) {
				setSelectedMessage();
				// if (selectedMessage == message_id) {

				// }
				// }
			},
		});
	};

	const { mutate: mutateUnblockUser } = POST(
		"api/v1/message_blocked?action=unblock",
		[
			`selected_convo_${selectedMessage ? selectedMessage : ""}`,
			`message_${userdata.id}`,
			`blocklist_${userdata.id}`,
			"searched_data_users",
		]
	);
	const handleUnblockUser = (blocked_id) => {
		let data = { blocked_id, user_id: userdata.id, action: "unblock" };
		mutateUnblockUser(data, {
			onSuccess: (res) => {
				// console.log(res);
				// if (data.archived == 1) {
				setSelectedMessage();
				// if (selectedMessage == message_id) {

				// }
				// }
			},
		});
	};

	useEffect(() => {
		function handleResize() {
			if ($(window).width() <= 768) {
				setCollapsed(true);
			} else {
				setCollapsed(false);
			}
		}
		window.addEventListener("resize", handleResize);
	}, []);

	const [isActiveButton, setIsActiveButton] = useState("create-message");

	useEffect(() => {
		// console.log(isActiveButton);
	}, [isActiveButton]);

	const [isHideSearch, setHideSearch] = useState(true);

	useEffect(() => {
		if (window.screen.width <= 372) {
			// console.log("less than");
			if (isHideSearch) {
				$(".searchForLittle label").css("display", "block");
			} else {
				$(".searchForLittle label").css("display", "none");
			}
		} else {
			$(".searchForLittle label").css("display", "block");
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [window.screen.width, isHideSearch]);

	return (
		<Card id="PageMessages" className="page-message">
			<Row>
				<Col xs={24} md={24} lg={16}>
					<Layout.Content>
						<Space className="ant-space-message-buttons" size={15}>
							{/* <Button
				  block
				  onClick={(e) => {
					setFilterMessageStatus("Active");
					setIsActiveButton("inbox");
				  }}
				  className={
					isActiveButton == "inbox"
					  ? "btn-success-outline-active"
					  : "btn-success-outline"
				  }
				>
				  Chat <InboxOutlined style={{ marginTop: 4 }} />
				</Button> */}
							<Button
								block
								onClick={(e) => {
									setShowNewMessageContainer(true);
									setFilterMessageStatus("Active");
									setRoleToSearch();
									setSearchData("");
									setIsActiveButton("create-message");
									setSelectedMessage();
								}}
								className={
									isActiveButton === "create-message"
										? "btn-success-outline-active"
										: "btn-success-outline"
								}
							>
								{/* Create Message <PlusCircleOutlined style={{ marginTop: 4 }} /> */}
								Chat <InboxOutlined style={{ marginTop: 4 }} />
							</Button>
							<Button
								block
								onClick={(e) => {
									setFilterMessageStatus("Blocked");
									setRoleToSearch();
									setSearchData("");
									setIsActiveButton("blocked");
									setSelectedMessage();
								}}
								className={
									isActiveButton === "blocked"
										? "btn-danger-outline-active"
										: "btn-danger-outline"
								}
							>
								Blocklist <CloseOutlined style={{ marginTop: 4 }} />
							</Button>
							<Button
								block
								onClick={(e) => {
									setFilterMessageStatus("Archived");
									setIsActiveButton("archived");
									setSelectedMessage();
								}}
								className={
									isActiveButton === "archived"
										? "btn-warning-outline-active"
										: "btn-warning-outline"
								}
							>
								Archived <DeleteOutlined style={{ marginTop: 4 }} />
							</Button>
						</Space>

						<Row gutter={[12, 12]} className="rowMessageSearch">
							<Col xs={24} sm={10} md={10} className="searchForLittle">
								<FloatSelect
									onChange={(e) => setRoleToSearch(e)}
									value={roleToSearch}
									options={searchForOptions}
									label="Search For"
								/>
							</Col>

							<Col xs={24} sm={14} md={14} className="messageSearchName">
								<FloatInput
									disabled={roleToSearch ? false : true}
									addonBefore={<div style={{ width: 40 }}>To: </div>}
									onChange={(e) => handleSearchUser(e)}
									value={searchData}
									size="large"
									label="Search Name"
									className="has-input-addon-before role-to-search"
								/>
							</Col>

							<Col xs={24} md={24} lg={24} xl={10}></Col>
							<Col xs={24} md={24} lg={14} xl={14}>
								<div className="messagesUserRowDiv  scrollbar-2">
									{searchData !== "" &&
										dataSearchUser &&
										dataSearchUser.data.map((user, key) => {
											if (user.id !== userdata.id) {
												let image = user.profile_image;
												if (image) {
													image = image.includes("gravatar")
														? image
														: `${apiUrl}${image}`;
												} else {
													image = `${apiUrl}images/default.png`;
												}

												return (
													<div
														style={{ padding: 10 }}
														key={key}
														className="messagesUserRow"
														onClick={(e) => {
															filterMessageStatus === "Blocked"
																? handleBlockUser(user.id)
																: handleMakeNewConvo(user.id);
														}}
													>
														<img
															src={image}
															style={{
																borderRadius: "50%",
																width: "25px",
																height: "25px",
															}}
															alt={"as" + key}
														/>{" "}
														{user.firstname} {user.lastname} - ({user.role})
													</div>
												);
											}
											return "";
										})}
								</div>
							</Col>
						</Row>
						{/* <Divider style={{ margin: "24px 0 10px 0" }} /> */}
						<br></br>
						<Layout className="messagesContainer">
							<Sider
								// collapsible
								theme="light"
								collapsed={collapsed}
								onCollapse={(e) => {
									setHideSearch(e);
									setCollapsed(e);
								}}
								// style={{ paddingTop: 35 }}
								className="scrollbar-2"
							>
								<div className="ChatMessageText">
									{collapsed ? (
										<RightOutlined
											style={{ marginTop: 5 }}
											onClick={() => {
												setCollapsed(false);
											}}
										/>
									) : (
										<Row>
											<Col xs={18} md={18}>
												<Typography.Title level={4}>
													{filterMessageStatus === "Blocked" && "Blocklist"}
													{filterMessageStatus === "Archived" && "Archived"}
													{filterMessageStatus === "Active" && "Chat"}
												</Typography.Title>
											</Col>
											<Col xs={6} md={6} style={{ textAlign: "end" }}>
												<span style={{ position: "relative", top: "4px" }}>
													<LeftOutlined
														onClick={() => {
															setCollapsed(true);
														}}
													/>
												</span>
											</Col>
										</Row>
									)}
								</div>
								<Menu theme="light" mode="inline" className="messagesMenu">
									{filterMessageStatus === "Blocked" ? (
										<>
											{dataMessageBlocklist &&
											dataMessageBlocklist.data.length > 0 ? (
												dataMessageBlocklist.data.map((item, index) => {
													let image = item.blocked.profile_image;
													// console.log("@image", item);
													if (image) {
														image = image.includes("gravatar")
															? image
															: `${apiUrl}${image}`;
													} else {
														image = `${apiUrl}images/default.png`;
													}
													let icon = (
														<img
															style={{
																width: "25px",
																borderRadius: "50%",
																height: "25px",
																objectFit: "cover",
															}}
															src={image}
															alt={"a-" + index}
														/>
													);
													return (
														<Dropdown
															key={item.id}
															onClick={(e) =>
																handleUnblockUser(item.blocked.id)
															}
															overlay={
																<Menu
																	items={[
																		{
																			label: (
																				<div
																					onClick={(e) =>
																						handleUnblockUser(item.blocked.id)
																					}
																				>
																					<CloseOutlined /> Unblock User
																				</div>
																			),
																			key: "1",
																		},
																	]}
																/>
															}
															trigger={["contextMenu"]}
														>
															<div
																className={`ant-menu-item item_key_${item.id}`}
																onClick={(e) => {
																	// console.log("item_key_ item.id", item.id);
																	// $(".ant-menu-item").removeClass("ant-menu-item-selected");
																	// $(e.target)
																	// 	.closest(".ant-menu-item")
																	// 	.addClass("ant-menu-item-selected");
																	// setSelectedMessage(item.id);
																	// setShowNewMessageContainer(false);
																}}
															>
																{icon}
																<span
																	className="ant-menu-title-content"
																	style={{ marginLeft: 10 }}
																>
																	{item.blocked.firstname}{" "}
																	{item.blocked.lastname}
																</span>
															</div>
														</Dropdown>
													);
												})
											) : (
												<div style={{ textAlign: "center" }}>
													{!collapsed && "Nothing Found"}
												</div>
											)}
										</>
									) : (
										messageItems.map((item, index) => {
											return (
												<Dropdown
													key={index}
													overlay={
														filterMessageStatus === "Archived" ? (
															<Menu
																items={[
																	{
																		label: (
																			<div
																				onClick={(e) =>
																					handleRestoreMessage(item.key)
																				}
																			>
																				<RedoOutlined /> Restore Message
																			</div>
																		),
																		key: "2",
																	},
																]}
															/>
														) : (
															<Menu
																items={[
																	{
																		label: (
																			<div
																				onClick={(e) => {
																					handleBlockUser(item.to_id);
																				}}
																			>
																				<CloseOutlined /> Block User
																			</div>
																		),
																		key: "1",
																	},
																	{
																		label: (
																			<div
																				onClick={(e) =>
																					handleArchiveMessage(item.key)
																				}
																			>
																				<DeleteOutlined /> Archive Message
																			</div>
																		),
																		key: "2",
																	},
																]}
															/>
														)
													}
													trigger={["contextMenu"]}
												>
													<div
														className={`ant-menu-item item_key_${item.key}`}
														onClick={(e) => {
															history.push("/message");
															$(".ant-menu-item").removeClass(
																"ant-menu-item-selected"
															);
															$(e.target)
																.closest(".ant-menu-item")
																.addClass("ant-menu-item-selected");
															setSelectedMessage(item.key);
															setShowNewMessageContainer(false);
														}}
														style={{ marginBottom: "10px" }}
													>
														{item.icon}
														<span
															className="ant-menu-title-content"
															style={{ marginLeft: 10 }}
														>
															{item.label}
														</span>
													</div>
												</Dropdown>
											);
										})
									)}
								</Menu>
							</Sider>
							<Layout className="site-layout" style={{ background: "#fff" }}>
								<Content className="site-layout-background">
									{filterMessageStatus !== "Blocked" &&
										!showNewMessageContainer &&
										selectedMessage && (
											<>
												<div
													id="messageConvoContainer"
													className="messageConvoContainer scrollbar-2"
												>
													{dataSearchMessageConvo &&
														dataSearchMessageConvo.success &&
														dataSearchMessageConvo.data.message_convos.map(
															(message, key) => {
																if (message.from_id === userdata.id) {
																	let image = message.from.profile_image;
																	if (image) {
																		image = image.includes("gravatar")
																			? image
																			: `${apiUrl}${image}`;
																	} else {
																		image = `${apiUrl}images/default.png`;
																	}
																	return (
																		<div className="messageRight" key={key}>
																			<Space
																				align="start"
																				className="messageSapceGap"
																			>
																				<img
																					style={{
																						width: "35px",
																						height: "35px",
																						marginRight: 5,
																						borderRadius: "50%",
																					}}
																					alt={"asdd" + key}
																					src={image}
																				/>{" "}
																				<Tooltip
																					placement="top"
																					title={moment(
																						message.created_at
																					).format("YYYY-MM-DD hh:MM A")}
																				>
																					<div className="messageNameDate">
																						{message.from.firstname +
																							" " +
																							message.from.lastname}{" "}
																						{moment(message.created_at).format(
																							"MM/DD/YY"
																						)}
																					</div>
																					<span>{message.message}</span>
																				</Tooltip>
																			</Space>
																		</div>
																	);
																}
																if (message.to_id === userdata.id) {
																	let image = message.from.profile_image;
																	if (image) {
																		image = image.includes("gravatar")
																			? image
																			: `${apiUrl}${image}`;
																	} else {
																		image = `${apiUrl}images/default.png`;
																	}
																	return (
																		<div className="messageLeft" key={key}>
																			<Space
																				align="start"
																				className="messageSapceGap"
																			>
																				<img
																					style={{
																						width: 35,
																						height: 35,
																						marginRight: 5,
																						borderRadius: "50%",
																					}}
																					alt={"asdd" + key}
																					src={image}
																				/>{" "}
																				<Tooltip
																					placement="top"
																					title={moment(
																						message.created_at
																					).format("YYYY-MM-DD hh:MM A")}
																				>
																					<div className="messageNameDate">
																						{message.from.firstname +
																							" " +
																							message.from.lastname}{" "}
																						{moment(message.created_at).format(
																							"MM/DD/YY"
																						)}
																					</div>
																					<span>{message.message}</span>
																				</Tooltip>
																			</Space>
																		</div>
																	);
																}

																return "";
															}
														)}
													{/* <div className="messageRight">
											  <span>test</span>
										  </div>
										  <div className="messageLeft">
											  <span>test</span>
										  </div> */}
													{/* <AlwaysScrollToBottom /> */}
												</div>

												<div
													style={{
														position: "absolute",
														bottom: 0,
														width: "100%",
														left: 0,
													}}
													className="messageText"
												>
													{filterMessageStatus === "Archived" && (
														<div
															style={{
																textAlign: "center",
																background: "white",
																marginRight: "5px",
															}}
														>
															This message is archived, please{" "}
															<a
																href="#!"
																onClick={(e) =>
																	handleRestoreMessage(
																		dataSearchMessageConvo.data.id
																	)
																}
															>
																restore
															</a>{" "}
															this message to send a message again...
														</div>
													)}
													{dataSearchMessageConvo &&
														dataSearchMessageConvo.iamblocked &&
														dataSearchMessageConvo.iamblocked.blocked_id ===
															userdata.id && (
															<div style={{ textAlign: "center" }}>
																Sorry, you are blocked from sending message to
																this user
															</div>
														)}

													{dataSearchMessageConvo &&
														dataSearchMessageConvo.iamblocked &&
														dataSearchMessageConvo.iamblocked.user_id ===
															userdata.id && (
															<div
																style={{
																	textAlign: "center",
																	background: "#fff",
																	paddingTop: "5px",
																}}
															>
																Blocked user, to continue sending message please{" "}
																<a
																	href="#!"
																	onClick={(e) =>
																		handleUnblockUser(
																			dataSearchMessageConvo.iamblocked
																				.blocked_id
																		)
																	}
																>
																	unblock
																</a>{" "}
																this user.
															</div>
														)}
													<Input
														disabled={
															filterMessageStatus === "Archived" ||
															(dataSearchMessageConvo &&
																dataSearchMessageConvo.iamblocked &&
																dataSearchMessageConvo.iamblocked.blocked_id ===
																	userdata.id) ||
															(dataSearchMessageConvo &&
																dataSearchMessageConvo.iamblocked &&
																dataSearchMessageConvo.iamblocked.user_id ===
																	userdata.id)
														}
														size="large"
														placeholder="Message Here"
														value={messageText}
														onChange={(e) => setMessageText(e.target.value)}
														onPressEnter={(e) => handleNewMessageConvo()}
														addonAfter={
															<Button
																disabled={
																	filterMessageStatus === "Archived" ||
																	(dataSearchMessageConvo &&
																		dataSearchMessageConvo.iamblocked &&
																		dataSearchMessageConvo.iamblocked
																			.blocked_id === userdata.id) ||
																	(dataSearchMessageConvo &&
																		dataSearchMessageConvo.iamblocked &&
																		dataSearchMessageConvo.iamblocked
																			.user_id === userdata.id)
																}
																onClick={(e) => handleNewMessageConvo()}
																type="link"
																icon={
																	<BiPaperPlane style={{ color: "gray" }} />
																}
															></Button>
														}
													/>
												</div>
											</>
										)}

									{filterMessageStatus === "Blocked" && (
										<>
											{/* <Row style={{ paddingLeft: 10 }}>
						  <Col xs={24} md={14} className="searchForLittle">
							<FloatSelect
							  onChange={(e) => setRoleToSearch(e)}
							  value={roleToSearch}
							  options={searchForOptions}
							  label="Search For"
							/>
						  </Col>
						</Row>
						<br></br>
						<Row style={{ paddingLeft: 10 }}>
						  {roleToSearch && (
							<Col xs={24} md={14}>
							  <FloatInput
								addonBefore={
								  <div style={{ width: 40 }}>To: </div>
								}
								onChange={(e) => handleSearchUser(e)}
								value={searchData}
								size="large"
								label="Search Name"
							  />
							</Col>
						  )}
						</Row>
  
						<div className="messagesUserRowDiv  scrollbar-2">
						  {searchData !== "" &&
							dataSearchUser &&
							dataSearchUser.data.map((user, key) => {
							  if (user.id !== userdata.id) {
								let image = user.profile_image;
								if (image) {
								  image = image.includes("gravatar")
									? image
									: `${apiUrl}${image}`;
								} else {
								  image = `${apiUrl}images/default.png`;
								}
  
								return (
								  <div
									style={{ padding: 10 }}
									key={key}
									className="messagesUserRow"
									onClick={(e) => handleBlockUser(user.id)}
								  >
									<img
									  src={image}
									  style={{ borderRadius: "50%", width: 25 }}
									  alt={"as" + key}
									/>{" "}
									{user.firstname} {user.lastname} - (
									{user.role})
								  </div>
								);
							  }
							  return "";
							})}
						</div> */}
										</>
									)}

									{filterMessageStatus !== "Blocked" &&
										filterMessageStatus !== "Archived" &&
										showNewMessageContainer && (
											<>
												{/* <Row style={{ paddingLeft: 10 }}>
							<Col xs={24} md={14} className="searchForLittle">
							  <FloatSelect
								onChange={(e) => setRoleToSearch(e)}
								value={roleToSearch}
								options={searchForOptions}
								label="Search For"
							  />
							</Col>
						  </Row>
						  <br></br>
						  <Row style={{ paddingLeft: 10 }}>
							{roleToSearch && (
							  <Col xs={24} md={14}>
								<FloatInput
								  addonBefore={
									<div style={{ width: 40 }}>To: </div>
								  }
								  onChange={(e) => handleSearchUser(e)}
								  value={searchData}
								  size="large"
								  label="Search Name"
								/>
							  </Col>
							)}
						  </Row>
  
						  <div className="messagesUserRowDiv scrollbar-2">
							{searchData !== "" &&
							  dataSearchUser &&
							  dataSearchUser.data.map((user, key) => {
								if (user.id !== userdata.id) {
								  let image = user.profile_image;
								  if (image) {
									image = image.includes("gravatar")
									  ? image
									  : `${apiUrl}${image}`;
								  } else {
									image = `${apiUrl}images/default.png`;
								  }
  
								  return (
									<div
									  style={{ padding: 10 }}
									  key={key}
									  className="messagesUserRow"
									  onClick={(e) => handleMakeNewConvo(user.id)}
									>
									  <img
										src={image}
										style={{ borderRadius: "50%", width: 25 }}
										alt={"ss" + key}
									  />{" "}
									  {user.firstname} {user.lastname} - (
									  {user.role})
									</div>
								  );
								}
								return "";
							  })}
						  </div> */}
											</>
										)}
								</Content>
							</Layout>
						</Layout>
					</Layout.Content>
				</Col>
			</Row>
		</Card>
	);
};

export default PageMessages;
