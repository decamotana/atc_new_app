import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Layout, Menu, Badge, Image, Typography, Dropdown, PageHeader } from "antd"
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons"
import { userData, role, apiUrl } from "../../providers/companyInfo"
import NotificationsAlert from "./Components/NotificationsAlert"
import defaultImage from "../../assets/img/default.png"
// import { GET } from "../../../../providers/useAxiosQuery";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBell, faEdit, faPowerOff } from "@fortawesome/pro-regular-svg-icons"

import { GET, POST } from "../../providers/useAxiosQuery"

import { menuLeft as adminHeaderMenuLeft, dropDownMenuLeft as adminHeaderDropDownMenuLeft } from "./RoleMenu/admin/AdminHeader"
import { menuLeft as userHeaderMenuLeft, dropDownMenuLeft as userHeaderDropDownMenuLeft } from "./RoleMenu/user/UserHeader"
import { menuLeft as consultantHeaderMenuLeft, dropDownMenuLeft as consultantHeaderDropDownMenuLeft } from "./RoleMenu/consultant/ConsultantHeader"
import { useHistory } from "react-router-dom/cjs/react-router-dom.min"

// import { GET } from "../../providers/useAxiosQuery";

export default function Header(props) {
  const { width, sideMenuCollapse, setSideMenuCollapse, pageHeaderIcon, title, subtitle } = props

  const [menuLeft, setMenuLeft] = useState(null)
  const [dropDownMenuLeft, setDropDownMenuLeft] = useState(null)

  const history = useHistory()
  const { refetch: getMentainance } = GET(
    "api/v1/maintenance",
    "maintenance",

    (res) => {
      if (!localStorage.fromMaintenance) {
        if (res.data?.in_maintenance === 1) {
          history.push("/maintenance")
        }
      }
    },
    false
  )

  // console.log("userData", userData);

  useEffect(() => {
    if (role() === "Admin") {
      setMenuLeft(adminHeaderMenuLeft)
      setDropDownMenuLeft(adminHeaderDropDownMenuLeft)
    } else if (role() === "User") {
      setMenuLeft(userHeaderMenuLeft)
      setDropDownMenuLeft(userHeaderDropDownMenuLeft)
    } else if (role() === "Consultant") {
      setMenuLeft(consultantHeaderMenuLeft)
      setMenuLeft(consultantHeaderDropDownMenuLeft)
    }
  }, [])

  const { mutate: addHistoryLog } = POST("api/v1/historylogs/add", "add_history_logs")

  const handleLogout = () => {
    addHistoryLog(
      {
        page: "Logout",
        key: "Logout",
        old_data: "",
        new_data: "user logged out",
        method: "",

        // consultant: details[0].eventInfo.title,
      },
      {
        onSuccess: (res) => {
          localStorage.removeItem("userdata")
          localStorage.removeItem("userdata_admin")
          localStorage.removeItem("_grecaptcha")
          localStorage.removeItem("currentTask")
          localStorage.removeItem("token")
          localStorage.removeItem("viewas")
          localStorage.removeItem("fromMaintenance")
          localStorage.removeItem("hasLoggedIn")

          window.location.replace("/")
        },
      }
    )
  }

  const [notification, setNotification] = useState({
    count: 0,
    data: [],
  })

  // const [
  //   unreadMessages,
  //   // setUnreadMessages
  // ] = useState(0);

  const { refetch: refetchNotification } = GET("api/v1/get_notification_alert", "get_notification_alert", (res) => {
    if (res.success) {
      setNotification({
        data: res.data,
        count: res.unread,
      })
    }
  })

  // const handleMenuClick = () => {
  // 	console.log("handleMenuClick");
  // };

  // const handleMenuSelect = ({ item, key, keyPath, selectedKeys, domEvent }) => {
  // 	console.log(
  // 		"item, key, keyPath, selectedKeys, domEvent ",
  // 		item,
  // 		key,
  // 		keyPath,
  // 		selectedKeys,
  // 		domEvent
  // 	);
  // };

  const [imageProfile, setImageProfile] = useState(defaultImage)

  GET(`api/v1/users/${userData().id}`, "update_profile", (res) => {
    if (res.success) {
      if (res.data.profile_image) {
        let avatarImage = res.data.profile_image.split("/")
        if (avatarImage[0] === "https:") {
          setImageProfile(res.data.profile_image)
        } else {
          setImageProfile(apiUrl + res.data.profile_image)
        }
      }
    }
  })

  const onClickMenuProfile = (e) => {
    // console.log("e", e);
  }

  const menuProfile = () => {
    const items = [
      {
        key: "/profile/details",
        className: "ant-menu-item-profile-details",
        label: (
          <div className="ant-menu-item-child ant-menu-item-profile">
            <Image src={imageProfile} preview={false} />

            <Typography.Text>
              <Typography.Text className="ant-typography-profile-details-name-info">
                {userData().firstname} {userData().lastname}
              </Typography.Text>
              <br />
              {/* <Typography.Text>{role()}</Typography.Text> */}
            </Typography.Text>
          </div>
        ),
      }, // remember to pass the key prop
      {
        key: "/profile/account",
        icon: <FontAwesomeIcon icon={faEdit} />,
        label: <Link to="/profile/account">Edit Account Profile</Link>,
      }, // which is required
    ]

    items.push({
      key: "/profile/signout",
      className: "ant-menu-item-logout",
      icon: <FontAwesomeIcon icon={faPowerOff} />,
      label: <Typography.Link onClick={handleLogout}>Sign Out</Typography.Link>,
    })

    return <Menu items={items} onClick={onClickMenuProfile} />
  }

  useEffect(() => {
    //   console.log("notifProps", props.path);
    // refetchMessages();
    refetchNotification()
  }, [props.path])

  return (
    <Layout.Header>
      <div className="ant-header-left-menu">
        {width < 767 && <div className="ant-menu-left-icon ant-menu-left-icon-menu-collapse-on-close">{sideMenuCollapse ? <MenuUnfoldOutlined onClick={() => setSideMenuCollapse(false)} className="menuCollapseOnClose" /> : <MenuFoldOutlined onClick={() => setSideMenuCollapse(true)} className="menuCollapseOnClose" />}</div>}

        {width > 768 && menuLeft !== null ? menuLeft : null}
        <PageHeader
          title={
            <>
              <div className="ant-page-header-icon">
                <FontAwesomeIcon icon={pageHeaderIcon} />
              </div>
              <div className="ant-page-header-text">
                <span className="sub-title">{subtitle}</span>

                <span className="title">{title === "Cancelled Appointments" && width <= 390 ? "Cancelled Appt." : title === "Mutual Confidentiality Agreement" && width <= 700 ? "MNDA" : title}</span>
              </div>
            </>
          }
        />
      </div>
      <div className="ant-header-right-menu">
        <Dropdown overlay={menuProfile} placement="bottomRight" overlayClassName="ant-menu-submenu-profile-popup" trigger={["click"]}>
          <Image className="ant-menu-submenu-profile" src={imageProfile} preview={false} />
        </Dropdown>

        <Dropdown overlay={<NotificationsAlert notification={notification.data} refetch={refetchNotification} />} placement="bottomRight" overlayClassName="ant-menu-submenu-notification-popup scrollbar-2" trigger={["click"]}>
          <Badge count={notification.count < 99 ? notification.count : "99+"} className="ant-menu-submenu-notification">
            <FontAwesomeIcon icon={faBell} />
          </Badge>
        </Dropdown>
        {/* 
        <Dropdown overlay={<MessagesAlert />} placement="bottomRight" overlayClassName="ant-menu-submenu-message-alert-popup scrollbar-2">
          <Badge count={unreadMessages < 99 ? unreadMessages : "99+"} className="ant-menu-submenu-message-alert">
            <FontAwesomeIcon icon={faCommentDots} />
          </Badge>
        </Dropdown> */}
      </div>
    </Layout.Header>
  )
}
