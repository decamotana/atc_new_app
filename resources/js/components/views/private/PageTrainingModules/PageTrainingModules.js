import { useEffect, useState } from "react";
import { Card } from "antd";

import DashboardModules from "../Components/DashboardModules";

import { role, userData } from "../../../providers/companyInfo";
import moment from "moment";
import $ from "jquery";

export default function PageTrainingModules() {
  const [moduleFilter, setModuleFilter] = useState({
    filter_module_for: role(),
    year: moment(userData().created_at).format("YYYY"),
  });

  const [hasCollapse, setHasCollapse] = useState(false);
  useEffect(() => {
    $("#btn_sidemenu_collapse_unfold").on("click", function () {
      setHasCollapse(false);
      // console.log("btn_sidemenu_collapse_unfold");
    });
    $("#btn_sidemenu_collapse_fold").on("click", function () {
      setHasCollapse(true);
      // console.log("btn_sidemenu_collapse_fold");
    });

    return () => {};
  }, []);

  return (
    <Card className="page-caregiver-training-module" id="PageTrainingModules">
      <DashboardModules
        moduleFilter={moduleFilter}
        setModuleFilter={setModuleFilter}
        colSm={12}
        colMd={12}
        colLg={hasCollapse ? 6 : 12}
        colXl={hasCollapse ? 6 : 8}
        colXXL={6}
      />
    </Card>
  );
}
