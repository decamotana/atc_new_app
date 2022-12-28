import {
    UserOutlined,
    TableOutlined,
    FolderOpenOutlined,
    GroupOutlined,
    TagOutlined,
    ShoppingOutlined,
    DashboardOutlined,
    FormOutlined,
    UsergroupAddOutlined,
    InfoCircleOutlined,
    RiseOutlined,
    AreaChartOutlined,
    MobileOutlined,
    PlusCircleOutlined,
    CheckCircleOutlined,
    FileOutlined,
    GiftOutlined,
    KeyOutlined,
    UnorderedListOutlined,
    DeleteOutlined
} from "@ant-design/icons";
import { Divider } from "antd";
import React from "react";
const navAdmins = [
    {
        title: "",
        items: [
            {
                title: "Marketplace",
                key: "/marketplace",
                class: "view_page",
                icon: <ShoppingOutlined />,
                permission: "Marketplace",
            },
            {
                title: "Dashboard",
                key: "/dashboard",
                class: "dashboard",
                icon: <DashboardOutlined />,
                permission: "Dashboard",
            },
            {
                title: "Boarding",
                key: "/boarding/clearent",
                class: "boarding",
                icon: <FormOutlined />,
                permission: "Boarding",
            },
            {
                title: "Files",
                key: "/files",
                class: "files",
                icon: <FolderOpenOutlined />,
                permission: 'Files'
            },
            {
                title: "Forms",
                key: "/formshead",
                class: "weeeee",
                icon: <FileOutlined />,
                children: [
                    {
                        title: "Add New Form",
                        key: "/forms/add",
                        class: "forms_add",
                        icon: <PlusCircleOutlined />,
                        permission: 'Add New Form'
                    },
                    {
                        title: "Form List",
                        key: "/forms/list",
                        class: "forms_list",
                        icon: <TableOutlined />,
                        permission: 'Form List'
                    },
                    {
                        title: "Submitted Forms",
                        key: "/forms/submitted",
                        class: "forms_submitted",
                        icon: <CheckCircleOutlined />,
                        permission: 'Submitted List Forms'
                    }
                ]
            },
            {
                title: "Gift Cards",
                key: "/gc",
                class: "gift-cards_parent",
                icon: <GiftOutlined />,
                children: [
                    {
                        title: "Gift Cards",
                        key: "/gc/gift-cards",
                        class: "gitf_cards",
                        icon: <GiftOutlined />,
                        permission: "Gift Cards"
                    },
                    // {
                    //     title: "Disabled Gift Cards",
                    //     key: "/gc/disabled-gift-cards",
                    //     class: "gitf_cards",
                    //     icon: <DeleteOutlined />
                    // },
                    {
                        title: "Gift Card Logs",
                        key: "/gc/logs",
                        class: "gitf_card_logs",
                        icon: <UnorderedListOutlined />,
                        permission: 'Gift Card Logs'
                    }
                    // {
                    //     title: "Gift Card API Keys",
                    //     key: "/gc/gift-card-api-keys",
                    //     class: "gift_card_api_keys",
                    //     icon: <KeyOutlined />
                    // }

                    // {
                    //     title: "Submitted Forms",
                    //     key: "/forms/submitted",
                    //     class: "forms_submitted",
                    //     icon: <CheckCircleOutlined />
                    // }
                ]
            },
            {
                title: "Guides",
                key: "/admin-guides",
                class: "admin-guides",
                icon: <RiseOutlined />,
                permission: 'Guides'
            },
            {
                title: "Reporting",
                key: "/reporting",
                class: "support",
                icon: <AreaChartOutlined />,
                children: [
                    {
                        title: "Clearent",
                        key: "/reporting/clearent/accounts",
                        class: "account_clearent",
                        icon: <TableOutlined />,
                        permission: 'Clearent'
                    },
                    {
                        title: "Paysafe",
                        key: "/reporting/paysafe/accounts",
                        class: "account_paysafe",
                        icon: <TableOutlined />,
                        permission: 'Paysafe'
                    }
                ]
            },
            {
                title: "Support",
                key: "/support",
                class: "support",
                icon: <InfoCircleOutlined />,
                children: [
                    {
                        title: "Tickets",
                        key: "/tickets",
                        class: "tickets",
                        icon: <TagOutlined />,
                        permission: 'Tickets'
                    },
                    {
                        title: "PAN Request",
                        key: "/support-form/pan",
                        class: "pan-request",
                        icon: <TagOutlined />,
                        permission: 'PAN Request'
                    },
                    {
                        title: "PAN List",
                        key: "/pan-list",
                        class: "pan-list",
                        icon: <TagOutlined />,
                        permission: 'PAN List'
                    }
                ]
            }
        ]
    },
    {
        title: (
            <Divider
                key={"divider"}
                plain
                style={{
                    color: "darkgray",
                    borderTopColor: "darkgray",
                    marginTop: 0,
                    marginBottom: 0
                }}
            >
                Admin Pages
            </Divider>
        ),
        items: [
            {
                title: "Invite People",
                key: "/invite-people",
                class: "invite-people",
                icon: <UsergroupAddOutlined />,
                permission: 'Invite People'
            },
            {
                title: "Profiles",
                key: "/profiles",
                class: "profiles",
                icon: <UserOutlined />,
                permission: 'Profiles'
            },
            {
                title: "Asset Mgmt",
                key: "/devicemgmt",
                class: "devicemgmt",
                icon: <MobileOutlined />,
                permission: 'Assets Management'
            },
            {
                title: (
                    <div
                        style={{
                            lineHeight: "10px",
                            textAlign: "center",
                            marginRight: "20px",
                            marginBottom: '12px',
                            marginTop: '12px'
                        }}
                    >
                        <img
                            src={`${window.location.origin}/assets/clearent-logo.png`}
                            width={100}
                        />
                        <small style={{ display: "block", marginLeft: "17px" }}>
                            Virtual Terminal
                        </small>
                    </div>
                ),
                key: "virtual_clereant",
                outsidelinkkey: `https://vt.clearent.net/`,
                outsidelink: "true",
                permission: 'Virtual Page'
            }
        ]
    }
];

export default navAdmins;
