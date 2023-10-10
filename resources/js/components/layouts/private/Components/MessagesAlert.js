import React from "react";
import { Avatar, Menu, Typography } from "antd";
import { GoPrimitiveDot } from "react-icons/go";
import { Link, useHistory } from "react-router-dom";
import { userData } from "../../../providers/companyInfo";

const MessagesAlert = ({ messages, refetch }) => {
    let history = useHistory();
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

                if (userData.id === item.to_id) {
                    user = item.from;
                }
                if (userData.id === item.from_id) {
                    user = item.to;
                }

                let image = user.upload;
                if (image) {
                    image = image.includes("gravatar")
                        ? image
                        : `${process.env.MIX_APP_API_URL}storage/${image}`;
                } else {
                    image = `${process.env.MIX_APP_API_URL}images/default.png`;
                }

                items.push({
                    key: index,
                    icon: (
                        <Avatar src={image} style={{ width: 40, height: 40 }} />
                    ),
                    label: (
                        <span
                            onClick={() =>
                                history.push(
                                    "/admin/messages?message_id=" +
                                        item.message_id
                                )
                            }
                        >
                            <Link to="#">
                                <Typography.Text strong>
                                    {user.first_name} {user.last_name}
                                </Typography.Text>
                                <Typography.Paragraph ellipsis={{ rows: 2 }}>
                                    {item.message}
                                </Typography.Paragraph>
                            </Link>

                            {item.unread === 1 ? (
                                <span className="ant-status-container">
                                    <GoPrimitiveDot />
                                </span>
                            ) : null}
                        </span>
                    ),
                });

                return "";
            });
        } else {
            items.push({
                key: "no-message",
                className: "text-center",
                label: <Typography.Text>No Messages</Typography.Text>,
            });
        }

        return items;
    };

    return <Menu items={messageList()} />;
};

export default MessagesAlert;
