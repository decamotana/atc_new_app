import React from "react";
import { Layout } from "antd";

// import getUserData from "../../providers/getUserData";
export default function Footer() {
  // let userdata = getUserData();

  return (
    <Layout.Footer className="layout-main-footer">
      <div className="sh-footer">
        <div>
          Copyright © 2017. All Rights Reserved. Shamcey Dashboard Admin
          Template
        </div>
        <div className="mg-t-10 mg-md-t-0">
          Designed by: <a href="http://themepixels.me">ThemePixels</a>
        </div>
      </div>
    </Layout.Footer>
  );
}
