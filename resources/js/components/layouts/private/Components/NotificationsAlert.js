import React, { useState } from "react"
import { useHistory } from "react-router-dom"
import { Menu, Dropdown, Modal, Typography } from "antd"
import { CheckOutlined, CloseSquareOutlined } from "@ant-design/icons"
import { HiOutlineDotsCircleHorizontal } from "react-icons/hi"
import { GoPrimitiveDot } from "react-icons/go"

import { POST } from "../../../providers/useAxiosQuery"
import { Link } from "react-router-dom"
import { role } from "../../../providers/companyInfo"

const NotificationsAlert = ({ notification, refetch }) => {
  const history = useHistory()
  const [modal, setmodal] = useState(false)
  const [modaldata, setmodaldata] = useState("")
  const [modaltitle, setmodaltitle] = useState("")
  const [modaldescription, setmodaldescription] = useState("")
  const handleView = (item) => {
    setmodal(true)
    setmodaldata(item.id)
    setmodaltitle(item.notification?.title)
    setmodaldescription(item.notification?.description)
  }

  const handleCancel = () => {
    setmodal(false)
    // console.log("asd");
    mutateRead(
      { id: modaldata, read: 1 },
      {
        onSuccess: (res) => {
          refetch()
        },
      }
    )
  }

  const { mutate: mutateRead } = POST("api/v1/read", "get_notification_alert")

  const { mutate: mutateArchive } = POST("api/v1/archive", "get_notification_alert")

  const handleRead = (item, status) => {
    console.log("handleRead", item)
    mutateRead(
      { id: item.id, read: status === "read" ? 1 : 0 },
      {
        onSuccess: (res) => {
          refetch()
        },
      }
    )
  }
  const handleRemove = (item) => {
    console.log("handleRemove", item)
    mutateArchive(
      { id: item.id },
      {
        onSuccess: (res) => {
          refetch()
        },
      }
    )
  }

  const menuActions = (item) => {
    return (
      <Menu>
        {item.read === 0 ? (
          <Menu.Item key="#mark-as-read" icon={<CheckOutlined />}>
            <Link to="#" onClick={() => handleRead(item, "read")}>
              Mark as read
            </Link>
          </Menu.Item>
        ) : null}

        {item.read === 1 ? (
          <Menu.Item key="#mark-as-unread" icon={<CheckOutlined />} onClick={() => handleRead(item, "unread")}>
            <Link to="#">Mark as unread</Link>
          </Menu.Item>
        ) : null}

        <Menu.Item key="#remove-notification" icon={<CloseSquareOutlined />} onClick={() => handleRemove(item)}>
          <Link to="#">Remove this notification</Link>
        </Menu.Item>
      </Menu>
    )
  }

  const notificationList = () => {
    if (notification && notification.length > 0) {
      return notification.map((item, index) => {
        return (
          // handleView(item)
          <Menu.Item className="notif-error" style={{ width: "100%" }} key={index}>
            <div

            // style={{
            //   display: "flex",
            //   alignItems: "center",
            //   justifyContent: "space-between",
            //   width: "100%",
            // }}
            >
              <div /*style={{ width: "85%" }} */ className="notif-container">
                {" "}
                <Link
                  to="#"
                  onClick={() => {
                    if (role() === "Admin") {
                      history.push("/cancelled-appointments")
                    } else {
                      handleView(item)
                    }
                  }}
                >
                  <div className="notif-title-desc">
                    <Typography.Text strong ellipsis>
                      {item.notification ? item.notification.title : "No title"}
                    </Typography.Text>
                    <Typography.Paragraph ellipsis style={{ marginBottom: 5 }}>
                      {item.notification ? item.notification.description : "No Description"}
                    </Typography.Paragraph>
                  </div>
                </Link>
                <div
                  style={{
                    width: "30px",
                    display: "flex",
                  }}
                  className="the-dots"
                >
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
                </div>
              </div>
            </div>
          </Menu.Item>
        )
      })
    } else {
      return (
        <Menu.Item key="#" className="text-center ant-notification empty-ant-notification">
          <Link to="#">No notification</Link>
        </Menu.Item>
      )
    }
  }

  return (
    <>
      <Menu>
        <Menu.Item key="#notification" className="title">
          <Link to="#">Notifications</Link>
        </Menu.Item>
        <Menu.Divider key="#notificationdivider" />

        <div className="scrollable-notification"> {notificationList()}</div>
      </Menu>

      <Modal className="modal-login" title={modaltitle} visible={modal} footer={false} onCancel={handleCancel}>
        <span>{modaldescription}</span>
      </Modal>
    </>
  )
}

export default NotificationsAlert
