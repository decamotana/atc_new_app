import React, { useState } from "react";
import { Menu, Dropdown, Modal, Typography } from "antd";
import { CheckOutlined, CloseSquareOutlined } from "@ant-design/icons";
import { HiOutlineDotsCircleHorizontal } from "react-icons/hi";
import { GoPrimitiveDot } from "react-icons/go";

import { POST } from "../../../providers/useAxiosQuery";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/pro-solid-svg-icons";

export default function NotificationsAlert({ notification, refetch }) {
	const [modal, setmodal] = useState(false);
	const [modaldata, setmodaldata] = useState("");
	const [modaltitle, setmodaltitle] = useState("");
	const [modaldescription, setmodaldescription] = useState("");
	const handleView = (item) => {
		setmodal(true);
		setmodaldata(item.id);
		setmodaltitle(item.notification.title);
		setmodaldescription(item.notification.description);
	};

	const handleCancel = () => {
		setmodal(false);
		// console.log("asd");
		mutateRead(
			{ id: modaldata, read: 1 },
			{
				onSuccess: (res) => {
					refetch();
				},
			}
		);
	};

	const { mutate: mutateRead } = POST("api/v1/read", "get_notification_alert");

	const { mutate: mutateArchive } = POST(
		"api/v1/archive",
		"get_notification_alert"
	);

	const handleRead = (item, status) => {
		// console.log("handleRead", item);
		mutateRead(
			{ id: item.id, read: status === "read" ? 1 : 0 },
			{
				onSuccess: (res) => {
					refetch();
				},
			}
		);
	};
	const handleRemove = (item) => {
		// console.log("handleRemove", item);
		mutateArchive(
			{ id: item.id },
			{
				onSuccess: (res) => {
					refetch();
				},
			}
		);
	};

	const menuActions = (item) => {
		let items = [];
		if (item.read === 0) {
			items.push({
				key: "mark-as-read",
				icon: <CheckOutlined />,
				label: (
					<Typography.Text onClick={() => handleRead(item, "read")}>
						Mark as read
					</Typography.Text>
				),
			});
		}
		if (item.read === 1) {
			items.push({
				key: "mark-as-unread",
				icon: <CheckOutlined />,
				label: (
					<Typography.Text onClick={() => handleRead(item, "unread")}>
						Mark as unread
					</Typography.Text>
				),
			});
		}

		items.push({
			key: "remove-notification",
			icon: <CloseSquareOutlined />,
			label: (
				<Typography.Text onClick={() => handleRemove(item)}>
					Remove this notification
				</Typography.Text>
			),
		});

		return <Menu items={items} />;
	};

	const notificationList = () => {
		let newnotification = notification.filter((f) => f.notification !== null);

		let items = [
			{
				key: "title",
				className: "title",
				label: <Typography.Text>Notifications</Typography.Text>,
			},
			{
				type: "divider",
			},
		];

		if (newnotification && newnotification.length > 0) {
			newnotification.map((item, index) => {
				items.push({
					key: index,
					label: (
						<>
							<Typography.Link to="#" onClick={() => handleView(item)}>
								<Typography.Text strong>
									{item.notification?.title}
								</Typography.Text>
								<Typography.Paragraph ellipsis={{ rows: 2 }}>
									<span
										dangerouslySetInnerHTML={{
											__html: item.notification?.description,
										}}
									/>
								</Typography.Paragraph>
							</Typography.Link>

							<span className="ant-dropdown-container">
								<Dropdown
									overlay={(e) => menuActions(item)}
									// placement="bottomRight"
									overlayClassName="ant-menu-submenu-notification-action"
									arrow
								>
									<HiOutlineDotsCircleHorizontal />
								</Dropdown>
							</span>

							{item.read === 0 ? (
								<span className="ant-status-container">
									<GoPrimitiveDot />
								</span>
							) : null}
						</>
					),
				});
				return "";
			});
		} else {
			items.push({
				key: "no-notification",
				className: "li-no-notification",
				label: <Typography.Text>No notification</Typography.Text>,
			});
		}

		return items;
	};

	return (
		<>
			<Menu items={notificationList()} />

			<Modal
				closeIcon={<FontAwesomeIcon icon={faTimes} />}
				className="modal-login"
				title={modaltitle}
				open={modal}
				footer={false}
				onCancel={handleCancel}
			>
				<span dangerouslySetInnerHTML={{ __html: modaldescription }} />
			</Modal>
		</>
	);
}
