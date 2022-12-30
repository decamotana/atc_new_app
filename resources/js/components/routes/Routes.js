import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { userData } from "../providers/companyInfo";

import "antd/dist/antd.css";

/** sass */
import "../assets/css/ui/helper/helper.css";
import "../assets/css/ui/card/card.css";
import "../assets/css/ui/input/input.css";
import "../assets/css/ui/button/button.css";
import "../assets/css/ui/tooltip/tooltip.css";
import "../assets/css/ui/checkbox/checkbox.css";
import "../assets/css/ui/datepicker/datepicker.css";
import "../assets/css/ui/steps/steps.css";
import "../assets/css/ui/radio/radio.css";
import "../assets/css/ui/quill/quill.css";
import "../assets/css/ui/typography/typography.css";
import "../assets/css/ui/spinner/spinner.css";
import "../assets/css/ui/collapse/collapse.css";
import "../assets/css/ui/accordion/accordion.css";
import "../assets/css/ui/navigation/navigation.css";
import "../assets/css/ui/pagination/pagination.css";
import "../assets/css/ui/tabs/tabs.css";
import "../assets/css/ui/modal/modal.css";
import "../assets/css/ui/table/table.css";
import "../assets/css/ui/header/header.css";
import "../assets/css/ui/sidemenu/sidemenu.css";
import "../assets/css/ui/breadcrumb/breadcrumb.css";
import "../assets/css/ui/page_header/page_header.css";
import "../assets/css/ui/upload/upload.css";
import "../assets/css/ui/form/form.css";
import "../assets/css/ui/footer/footer.css";
import "../assets/css/ui/public-layout/public-layout.css";
import "../assets/css/ui/private-layout/private-layout.css";

import "../assets/css/main/main.css";

import "../assets/css/errors/maintenance/maintenance.css";

import "../assets/css/pages/login/login.css";
import "../assets/css/pages/create-password/create-password.css";
import "../assets/css/pages/register-layout/register-layout.css";
import "../assets/css/pages/dashboard/dashboard.css";
import "../assets/css/pages/profile/profile.css";
import "../assets/css/pages/revenue/revenue.css";
import "../assets/css/pages/subscriber/subscriber.css";
import "../assets/css/pages/training_module/training_module.css";
import "../assets/css/pages/resource-online/resource-online.css";
import "../assets/css/pages/resource-video/resource-video.css";
import "../assets/css/pages/resource-pdf/resource-pdf.css";
import "../assets/css/pages/page-certificate-template/page-certificate-template.css";
import "../assets/css/pages/payment-and-invoices/payment-and-invoices.css";
import "../assets/css/pages/messages/messages.css";
import "../assets/css/pages/page-course-status/page-course-status.css";
import "../assets/css/pages/advertising/advertising.css";
import "../assets/css/pages/profile-subscription/profile-subscription.css";
import "../assets/css/pages/page_notification/page_notification.css";
import "../assets/css/pages/page_email_template/page_email_template.css";
import "../assets/css/pages/page-account-type/page-account-type.css";
import "../assets/css/pages/advertisement-type/advertisement-type.css";
import "../assets/css/pages/question-category/question-category.css";
import "../assets/css/pages/coupon/coupon.css";
import "../assets/css/pages/cookie-policy/cookie-policy.css";
import "../assets/css/pages/privacy-policy/privacy-policy.css";
import "../assets/css/pages/terms-conditions/terms-conditions.css";

/** end sass */

/** errors */

import Error404 from "../views/errors/Error404";
import Error500 from "../views/errors/Error500";

/** end errors */

/** public views */

import PageLogin from "../views/public/PageLogin/PageLogin";

import PageCreatePassword from "../views/public/PageCreatePassword/PageCreatePassword";
import PageRegister from "../views/public/PageRegister/PageRegister";
import PageRegistrationSetPassword from "../views/public/PageRegister/PageRegistrationSetPassword";
import PageForgotPassword from "../views/public/ForgotPassword/PageForgotPassword";

/** end public views */

/** private views */

import RouteAdmin from "./RouteRole/RouteAdmin";

import PublicRoute from "./PublicRoute";

import PageLoginMaintenance from "../views/public/PageLogin/PageLoginMaintenance";

// const token = localStorage.token;
const queryClient = new QueryClient();
const token = localStorage.token;

// console.log("userData", userData());

export default function Routes() {
    return (
        <QueryClientProvider client={queryClient}>
            <Router>
                <Switch>
                    {/* public route */}
                    <PublicRoute
                        exact
                        path="/"
                        component={PageLogin}
                        title="Login"
                    />
                    <PublicRoute
                        exact
                        path="/maintenance-login"
                        component={PageLoginMaintenance}
                        title="Login"
                    />
                    <PublicRoute
                        exact
                        path="/create-password"
                        component={PageCreatePassword}
                        title="Create Password"
                    />
                    <PublicRoute
                        exact
                        path="/register"
                        component={PageRegister}
                        title="Register"
                    />
                    <PublicRoute
                        exact
                        path="/register/:token"
                        component={PageRegister}
                        title="Register"
                    />
                    <PublicRoute
                        exact
                        path="/forgot-password/:token"
                        component={PageForgotPassword}
                        title="Forgot Password"
                    />
                    <PublicRoute
                        exact
                        path="/register/setup-password/:token"
                        component={PageRegistrationSetPassword}
                        title="Register - Setup Password"
                    />

                    {userData() && userData().role === "Super Admin" && (
                        <RouteAdmin />
                    )}

                    {/* end private route */}
                    {/* this should always in the bottom */}
                    <Route exact path="/*" component={Error404} />
                    <Route exact path="/500" component={Error500} />
                </Switch>
            </Router>
        </QueryClientProvider>
    );
}
