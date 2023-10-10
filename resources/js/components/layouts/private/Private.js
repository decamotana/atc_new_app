import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Layout, Breadcrumb, PageHeader, Button } from "antd";
import $ from "jquery";
import { SpinnerDotted } from "spinners-react";
import { POST, GETMANUAL } from "../../providers/useAxiosQuery";

// import { SpinnerDotted } from "spinners-react";

import {
  decrypt,
  encrypt,
  name,
  role,
  userData,
  appUrl,
} from "../../providers/companyInfo";
import Footer from "./Footer";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronRight,
  faHome,
  faRefresh,
} from "@fortawesome/pro-regular-svg-icons";
import SideMenu from "./SideMenu";
import Header from "./Header";
import { GiftOutlined, RedoOutlined, ReloadOutlined } from "@ant-design/icons";

import { ClearCacheProvider, useClearCache } from "react-clear-cache";
import { H } from "highlight.run";

if (appUrl === "system.airlinetc.com") {
  H.init("1eplpxdn", {
    tracingOrigins: true,
    networkRecording: {
      enabled: true,
      recordHeadersAndBody: true,
      urlBlocklist: [
        // insert full or partial urls that you don't want to record here
        // Out of the box, Highlight will not record these URLs (they can be safely removed):
        "https://www.googleapis.com/identitytoolkit",
        "https://securetoken.googleapis.com",
      ],
    },
  });
}

export default function Private(props) {
  const { children, title, subtitle, breadcrumb, pageHeaderIcon, path } = props;

  const userdata = decrypt(localStorage.getItem("userdata"));

  const history = useHistory();
  const [sideMenuCollapse, setSideMenuCollapse] = useState(
    $(window).width() <= 768 ? true : false
  );
  const [width, setWidth] = useState($(window).width());
  const [stage, setStages] = useState([]);
  const [tag, setCurrentTag] = useState("");
  const [userInfo, setUserData] = useState(userData());

  useEffect(() => {
    if (userInfo.role === "User") {
      refetchOpportunity();
      refetchGetcurrenttag();
    }
  }, [userInfo]);

  const { refetch: refetchOpportunity } = GETMANUAL(
    "api/v1/user/opportunity",
    "opportunity",
    (res) => {
      if (res.success) {
        setStages(res.pipeline_stages);
      }
    }
  );

  const { refetch: refetchGetcurrenttag } = GETMANUAL(
    "api/v1/user/getcurrenttag",
    "tag",
    (res) => {
      if (role() == "User") {
        if (res.success) {
          // notification.warning({
          //   message: "Your current tag",
          //   description: res.data,
          // });

          setCurrentTag(res.data);

          // console.log("current tag", res.data);

          let task = [
            "call 2 - book (current task)",
            "follow up call - book (current task)",
            "timeline - book (current task)",
            "pre publish - book (current task)",
            "pre interview - book (current task)",
          ];

          if (Array.isArray(res.data)) {
            if (res.data.some((value) => task.includes(value))) {
              if (!userData().isAllowVideo) {
                update_video_permission();
              }
            } else if (res.data.includes("docusign (current task)")) {
              if (userData().has_mnda === 0) {
                handleHasMNDA();
              }
            }
          }
        }
      }
    }
  );

  const hasLoggedIn = decrypt(localStorage.hasLoggedIn);
  useEffect(() => {
    // console.log("userdata", userdata);
    if (!hasLoggedIn && userdata) {
      H.identify(userdata.firstname + " " + userdata.lastname, {
        id: userdata.id,
        email: userdata.email,
        username: userdata.username,
      });

      localStorage.setItem("hasLoggedIn", true);
    }
  }, []);

  const { mutate: mutateGenerateToken, isLoading: isLoadingtickets } = POST(
    "api/v1/admin/viewas",
    "admin_viewas"
  );

  const handleBackToAdmin = () => {
    let userdata_admin = decrypt(localStorage.userdata_admin);

    viewAsBack(userdata_admin.id, true);
  };

  const viewAsBack = (id, backtoadmin = false) => {
    mutateGenerateToken(
      { id: id, viewas: localStorage.viewas },
      {
        onSuccess: (res) => {
          if (res.success) {
            // console.log(res);
            localStorage.token = res.token;
            localStorage.userdata = encrypt(res.data);
            if (backtoadmin) {
              localStorage.removeItem("viewas");
              localStorage.removeItem("userdata_admin");
            }

            var url = window.location.origin + "/clients";
            window.location.href = url;
          }
        },
      }
    );
  };

  const { mutate: mutateAllowVideo } = POST(
    "api/v1/user/update_video_permission",
    "update_video"
  );

  const update_video_permission = () => {
    let data = {
      id: userData().id,
    };

    mutateAllowVideo(data, {
      onSuccess: (res) => {
        if (res.success) {
          localStorage.userdata = encrypt(res.data);
          setUserData(res.data);
        }
      },
    });
  };

  const { mutate: mutateHasMNDA } = POST(
    "api/v1/client/allow_mnda",
    "allow_mnda"
  );

  const handleHasMNDA = () => {
    mutateHasMNDA("", {
      onSuccess: (res) => {
        if (res.success) {
          localStorage.userdata = encrypt(res.data);
          setUserData(res.data);
          // window.location.reload(false);
        }
      },
    });
  };

  useEffect(() => {
    if (title) {
      document.title = title + " | " + name;
    }

    function handleResize() {
      setWidth($(window).width());
      if ($(window).width() <= 768) {
        setSideMenuCollapse(true);
      }
      if ($(window).width() > 768) {
        setSideMenuCollapse(false);
      }
    }
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [title, width]);

  useEffect(() => {
    if ($(window).width() <= 768) {
      setSideMenuCollapse(true);
    }
    if ($(window).width() > 768) {
      setSideMenuCollapse(false);
    }
  }, [width]);

  const { isLatestVersion, emptyCacheStorage } = useClearCache();
  useEffect(() => {
    console.log("isLatestVersion", isLatestVersion);

    return () => {};
  }, []);
  return (
    <>
      <ClearCacheProvider>
        {!isLatestVersion && (
          <div className="updateAvailableDiv">
            <div className="div1">
              <GiftOutlined />
            </div>
            <div className="div2">
              <h3>Updates Now Available</h3>
              <p>A new version of this Web App is ready.</p>
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  emptyCacheStorage().then(() => {
                    window.location.reload();
                  });
                }}
                type="primary"
                icon={
                  <FontAwesomeIcon
                    icon={faRefresh}
                    style={{ marginRight: 5 }}
                  />
                }
              >
                Refresh
              </Button>
            </div>
          </div>
        )}
        <div className="globalLoading hide">
          <SpinnerDotted thickness="100" color="#789df9" enabled={true} />
        </div>

        <Layout hasSider className="private-layout">
          <SideMenu
            history={history}
            sideMenuCollapse={sideMenuCollapse}
            setSideMenuCollapse={setSideMenuCollapse}
            width={width}
            hideLink={{
              user_info: userInfo,
              link: "video-link",
              hasDisabledClass:
                userInfo.isAllowVideo === null ? "isDisabled" : "",
              isHide: userInfo.isAllowVideo === null ? 1 : 0,
            }}
            userInfo={userInfo}
          />

          <Layout className={sideMenuCollapse ? "ant-layout-has-collapse" : ""}>
            <Header
              pageHeaderIcon={pageHeaderIcon}
              title={title}
              subtitle={subtitle}
              sideMenuCollapse={sideMenuCollapse}
              setSideMenuCollapse={setSideMenuCollapse}
              width={width}
              path={path}
            />

            <Layout.Content
              onClick={() => {
                if (width <= 767) {
                  setSideMenuCollapse(true);
                }
              }}
            >
              {/* <Breadcrumb separator={<FontAwesomeIcon icon={faChevronRight} />}> */}
              <Breadcrumb separator={"/"}>
                <Breadcrumb.Item key="/home">
                  <a href="/">
                    {/* <FontAwesomeIcon icon={faHome} /> */}
                    Home
                  </a>
                </Breadcrumb.Item>
                {breadcrumb &&
                  breadcrumb.map((item, index) => {
                    let colorRed = "";
                    if (breadcrumb.length > 1) {
                      if (breadcrumb.length === index + 1) {
                        colorRed = "breadcrumb-item-text-last";
                      }
                    }

                    return (
                      <Breadcrumb.Item
                        key={index}
                        onClick={() => history.push(item.link)}
                        className={`cursor-pointer font-14px breadcrumb-item-text ${colorRed} ${
                          item.className ? ` ${item.className}` : ""
                        }`}
                      >
                        {item.name}
                      </Breadcrumb.Item>
                    );
                  })}
              </Breadcrumb>

              {children}

              {localStorage.viewas == "true" && (
                <>
                  {" "}
                  <div>
                    <div
                      style={{
                        position: "fixed",
                        bottom: 0,
                        left: "50%",
                        bottom: "4%",
                        transform: "translate(-50%, 0)",
                        padding: 10,
                        fontWeight: 900,
                        background: " rgba(54,82,14, 0.4)",
                        color: "white",
                        zIndex: 999,
                        textAlign: "center",
                      }}
                      //className="bgcolor-17"
                    >
                      Viewing As :{" "}
                      {userdata.firstname + " " + userdata.lastname}
                      <br></br>
                      <Button
                        className="btn-login-outline bgcolor-16 white"
                        style={{ marginTop: "10px" }}
                        onClick={handleBackToAdmin}
                      >
                        Back to Admin View
                      </Button>
                    </div>
                  </div>
                  <div className="viewAsBoxTop"></div>
                  <div className="viewAsBoxRight"></div>
                  <div className="viewAsBoxLeft"></div>
                  <div className="viewAsBoxBottom"></div>
                </>
              )}
            </Layout.Content>

            <Footer />
          </Layout>
        </Layout>
      </ClearCacheProvider>
    </>
  );
}
