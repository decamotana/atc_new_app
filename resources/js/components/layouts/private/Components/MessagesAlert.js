import React from "react";
import { Avatar, Menu, Typography } from "antd";
// import { GoPrimitiveDot } from "react-icons/go";
import { Link } from "react-router-dom";
import { apiUrl, userData } from "../../../providers/companyInfo";

const MessagesAlert = ({ messages, refetch }) => {
    // const { mutate: mutateRead, isLoading: isLoadingRead } = POST(
    // 	"api/v1/read",
    // 	"get_message_convo"
    // );

    const messageList = () => {
        let items = [
            {
                key: "title",
                className: "title",
                label: <Typography.Text>Messages</Typography.Text>,
            },
            {
                type: "divider",
            },
        ];

        if (messages && messages.length > 0) {
            messages.map((item, index) => {
                let user;

                if (userData().id === item.to_id) {
                    user = item.from;
                }
                if (userData().id === item.from_id) {
                    user = item.to;
                }

                // console.log("user", user);

                let image = user?.profile_image;
                if (image) {
                    image = image.includes("gravatar")
                        ? image
                        : `${apiUrl}${image}`;
                } else {
                    image = `${apiUrl}images/default.png`;
                }

                items.push({
                    key: index,
                    icon: (
                        <Avatar src={image} style={{ width: 40, height: 40 }} />
                    ),
                    label: (
                        <>
                            <Link to="#">
                                <Typography.Text strong>
                                    {user?.firstname} {user?.lastname}
                                </Typography.Text>
                                <Typography.Paragraph ellipsis={{ rows: 2 }}>
                                    {item.message}
                                </Typography.Paragraph>
                            </Link>

                            {item.unread === 1 ? (
                                <span className="ant-status-container">
                                    {/* <GoPrimitiveDot /> */}
                                </span>
                            ) : null}
                        </>
                    ),
                    onClick: () =>
                        window.location.replace(
                            window.location.origin +
                                "/message?message_id=" +
                                item.message_id
                        ),
                });

                return "";
            });
        } else {
            items.push({
                key: "no-message",
                className: "li-no-message",
                label: <Typography.Text>No Messages</Typography.Text>,
            });
        }

        return items;
    };

    return <Menu items={messageList()} />;
};

export default MessagesAlert;
