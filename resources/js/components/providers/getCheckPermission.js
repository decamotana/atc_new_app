import useAxiosQuery from "./useAxiosQuery";
import getPermission from "./getPermission";

export default function getCheckPermission(
    permission,
    pathname = "",
    location = ""
) {
    console.log("getUserPermission", permission);
    console.log("getUserPermission data", getPermission());
    getPermission().map((item, index) => {
        if (item.permission === permission) {
            if (item.permission_type === "view_page") {
                $("#" + item.permission + "_" + item.permission_type).show();
            }

            if (item.permission_type === "add_btn") {
                if (item.status === 0) {
                    $("[name=" + item.permission_type + "]").remove();
                } else {
                    $("[name=" + item.permission_type + "]").show();
                }
            } else if (item.permission_type === "view_btn") {
                if (item.status === 0) {
                    $("[name=" + item.permission_type + "]").remove();
                    // para ni sa column nga naa links
                    $("." + item.permission_type).attr("disabled", "disabled");
                } else {
                    $("." + item.permission_type).removeAttr("disabled");
                    // para ni sa column nga naa links
                    $("[name=" + item.permission_type + "]").show();
                }
            } else if (item.permission_type === "delete_btn") {
                if (item.status === 0) {
                    console.log("delete_btn");
                    $("[name=" + item.permission_type + "]").remove();
                } else {
                    $("[name=" + item.permission_type + "]").show();
                }
            } else if (item.permission_type === "reserve_btn") {
                if (item.status === 0) {
                    $("[name=" + item.permission_type + "]").remove();
                } else {
                    $("[name=" + item.permission_type + "]").show();
                }
            } else if (item.permission_type === "edit_btn") {
                if (item.status === 0) {
                    $("[name=" + item.permission_type + "]").remove();
                } else {
                    $("[name=" + item.permission_type + "]").show();
                }
            } else if (item.permission_type === "request_change_info") {
                if (item.status === 0) {
                    $("[name=" + item.permission_type + "]").remove();
                } else {
                    $("[name=" + item.permission_type + "]").show();
                }
            } else if (item.permission_type === "view_disabled_gift_card_btn") {
                if (item.status === 0) {
                    $("[name=" + item.permission_type + "]").remove();
                } else {
                    $("[name=" + item.permission_type + "]").show();
                }
            } else if (item.permission_type === "add_guide_btn") {
                if (item.status === 0) {
                    $("[name=" + item.permission_type + "]").remove();
                    //para sa dli button
                    $("." + item.permission_type).remove();
                } else {
                    $("[name=" + item.permission_type + "]").show();
                    //para sa dli button
                    $("." + item.permission_type).show();
                }
            } else if (item.permission_type === "edit_guide_btn") {
                if (item.status === 0) {
                    $("." + item.permission_type).remove();
                } else {
                    $("." + item.permission_type).show();
                }
            } else if (item.permission_type === "visible_admin_guide_btn") {
                if (item.status === 0) {
                    $("." + item.permission_type).remove();
                } else {
                    $("." + item.permission_type).show();
                }
            } else if (item.permission_type === "view_guide_btn") {
                if (item.status === 0) {
                    $("." + item.permission_type).remove();
                } else {
                    $("." + item.permission_type).show();
                }
            } else if (item.permission_type === "view_video_guide_btn") {
                if (item.status === 0) {
                    $("." + item.permission_type).remove();
                } else {
                    $("." + item.permission_type).show();
                }
            } else if (item.permission_type === "add_video_guide_btn") {
                if (item.status === 0) {
                    $("." + item.permission_type).remove();
                } else {
                    $("." + item.permission_type).show();
                }
            } else if (
                item.permission_type === "visible_admin_video_guide_btn"
            ) {
                if (item.status === 0) {
                    $("." + item.permission_type).remove();
                } else {
                    $("." + item.permission_type).show();
                }
            } else if (item.permission_type === "edit_video_guide_btn") {
                if (item.status === 0) {
                    $("." + item.permission_type).remove();
                } else {
                    $("." + item.permission_type).show();
                }
            } else if (item.permission_type === "archived_btn") {
                if (item.status === 0) {
                    $("[name=" + item.permission_type + "]").remove();
                } else {
                    $("[name=" + item.permission_type + "]").show();
                }
            } else if (item.permission_type === "assigned_btn") {
                if (item.status === 0) {
                    $("[name=" + item.permission_type + "]").remove();
                } else {
                    $("[name=" + item.permission_type + "]").show();
                }
            } else if (item.permission_type === "update_status_btn") {
                if (item.status === 0) {
                    $("[name=" + item.permission_type + "]").remove();
                } else {
                    $("[name=" + item.permission_type + "]").show();
                }
            } else if (item.permission_type === "delete_ticket_btn") {
                if (item.status === 0) {
                    $("[name=" + item.permission_type + "]").remove();
                } else {
                    $("[name=" + item.permission_type + "]").show();
                }
            } else if (item.permission_type === "merge_ticket_btn") {
                if (item.status === 0) {
                    $("[name=" + item.permission_type + "]").remove();
                } else {
                    $("[name=" + item.permission_type + "]").show();
                }
            } else if (item.permission_type === "permission_btn") {
                if (item.status === 0) {
                    $("[name=" + item.permission_type + "]").remove();
                } else {
                    $("[name=" + item.permission_type + "]").show();
                }
            } else if (item.permission_type === "upload_statement_btn") {
                if (item.status === 0) {
                    $("[name=" + item.permission_type + "]").remove();
                } else {
                    $("[name=" + item.permission_type + "]").show();
                }
            } else if (item.permission_type === "view_profile_btn") {
                if (item.status === 0) {
                    $("." + item.permission_type).remove();
                } else {
                    $("." + item.permission_type).show();
                }
            } else if (item.permission_type === "view_account_btn") {
                if (item.status === 0) {
                    $("." + item.permission_type).remove();
                } else {
                    $("." + item.permission_type).show();
                }
            } else if (item.permission_type === "view_asset_btn") {
                if (item.status === 0) {
                    $("." + item.permission_type).remove();
                } else {
                    $("." + item.permission_type).show();
                }
            } else if (item.permission_type === "view_ticket_btn") {
                if (item.status === 0) {
                    $("." + item.permission_type).remove();
                } else {
                    $("." + item.permission_type).show();
                }
            } else if (item.permission_type === "view_file_btn") {
                if (item.status === 0) {
                    $("." + item.permission_type).remove();
                } else {
                    $("." + item.permission_type).show();
                }
            } else if (item.permission_type === "view_authnet_btn") {
                if (item.status === 0) {
                    $("." + item.permission_type).remove();
                } else {
                    $("." + item.permission_type).show();
                }
            } else if (item.permission_type === "view_extra_user_btn") {
                if (item.status === 0) {
                    $("." + item.permission_type).remove();
                } else {
                    $("." + item.permission_type).show();
                }
            } else if (item.permission_type === "view_dashboard") {
                if (item.status === 0) {
                    $("." + item.permission_type).remove();
                } else {
                    $("." + item.permission_type).show();
                }
            } else if (item.permission_type === "view_card_management") {
                if (item.status === 0) {
                    $("." + item.permission_type).remove();
                } else {
                    $("." + item.permission_type).show();
                }
            } else if (item.permission_type === "view_terminal_management") {
                if (item.status === 0) {
                    $("." + item.permission_type).remove();
                } else {
                    $("." + item.permission_type).show();
                }
            } else if (item.permission_type === "view_report") {
                if (item.status === 0) {
                    $("." + item.permission_type).remove();
                } else {
                    $("." + item.permission_type).show();
                }
            } else if (item.permission_type === "view_data_management") {
                if (item.status === 0) {
                    $("." + item.permission_type).remove();
                } else {
                    $("." + item.permission_type).show();
                }
            } else if (item.permission_type === "view_account_setting") {
                if (item.status === 0) {
                    $("." + item.permission_type).remove();
                } else {
                    $("." + item.permission_type).show();
                }
            } else {
                if (item.status === 0) {
                    $("[name=" + item.permission_type + "]").remove();
                } else {
                    $("[name=" + item.permission_type + "]").show();
                }
            }
        }
    });
    return "";
}
