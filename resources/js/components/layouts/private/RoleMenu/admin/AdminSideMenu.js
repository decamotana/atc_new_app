import {
	faChartPie,
	faHome,
	faUsdCircle,
	faChartMixed,
	faBooks,
	faBell,
	faPaperPlane,
	faCogs,
	faBullhorn,
	faUsers,
	faFileCertificate,
	faTicket,
	faTag,
	faScrewdriverWrench,
	faCommentDots,
	faUserTie,
	faQuestion,
	// faNewspaper,
} from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { role } from "../../../../providers/companyInfo";

const AdminSideMenu = [
	{
		title: "Dashboard",
		path: "/dashboard",
		icon: <FontAwesomeIcon icon={faHome} />,
	},
	{
		title: "Revenue",
		path: "/revenue",
		icon: <FontAwesomeIcon icon={faUsdCircle} />,
	},
	{
		title: "Stats",
		path: "/stats",
		icon: <FontAwesomeIcon icon={faChartPie} />,
		children: [
			{
				title: "Financials",
				path: "/stats/financials",
			},
			{
				title: "Questionnaire",
				path: "/stats/questionnaire",
			},
			{
				title: "Subscribers",
				path: "/stats/subscribers",
			},
			{
				title: "Users",
				path: "/stats/users",
			},
			// {
			// 	title: "Forecast",
			// 	path: "/stats/forecast",
			// },
		],
	},
	{
		title: "Subscribers",
		path: "/subscribers",
		icon: <FontAwesomeIcon icon={faUsers} />,
		children: [
			{
				title: "Current",
				path: "/subscribers/current",
			},
			{
				title: "Deactivated",
				path: "/subscribers/deactivated",
			},
			{
				title: "Module Restriction",
				path: "/subscribers/training-module-restriction",
			},
			{
				title: "View As",
				path: "/subscribers/viewas",
			},
		],
	},
	{
		title: "Training Modules",
		path: "/training-modules",
		icon: <FontAwesomeIcon icon={faChartMixed} />,
		children: [
			{
				title: "Edit",
				path: "/training-modules/edit",
			},
			{
				title: "Add",
				path: "/training-modules/add",
			},
		],
	},
	{
		title: "Resource Library",
		path: "/resource-library",
		icon: <FontAwesomeIcon icon={faBooks} />,
		children: [
			{
				title: "Online Resources",
				path: "/resource-library/online-resources",
			},
			{
				title: "Video Resources",
				path: "/resource-library/video-resources",
			},
			{
				title: "PDF Resources",
				path: "/resource-library/pdf-resources",
			},
		],
	},
	{
		title: "Advertising",
		path: "/advertising",
		icon: <FontAwesomeIcon icon={faBullhorn} />,
		children: [
			{
				title: "Current",
				path: "/advertising/current",
			},
			{
				title: "Archived",
				path: "/advertising/archived",
			},
		],
	},
	{
		title: "Notifications",
		path: "/notifications",
		icon: <FontAwesomeIcon icon={faBell} />,
	},
	{
		title: "Certificate Templates",
		path: "/certificate-templates",
		icon: <FontAwesomeIcon icon={faFileCertificate} />,
	},
	{
		title: "Email Templates",
		path: "/email-templates",
		icon: <FontAwesomeIcon icon={faPaperPlane} />,
	},
	{
		title: "Account Type",
		path: "/account-type",
		icon: <FontAwesomeIcon icon={faCogs} />,
		children: [
			{
				title: "Caregivers",
				path: "/account-type/caregivers",
			},
			{
				title: "Care Professional",
				path: "/account-type/careprofessional",
			},
		],
	},
	{
		title: "Question Category",
		path: "/question-category",
		icon: <FontAwesomeIcon icon={faQuestion} />,
	},
	// {
	// 	title: "References",
	// 	path: "/references",
	// 	icon: <FontAwesomeIcon icon={faBook} />,
	// 	children: [
	// 		{
	// 			title: "Question Category",
	// 			path: "/references/question-category",
	// 		},
	// 		// {
	// 		// 	title: "Advertisement Type",
	// 		// 	path: "/references/advertisement-type",
	// 		// },
	// 	],
	// },

	{
		title: "Ticketing",
		path: "/ticketing",
		icon: <FontAwesomeIcon icon={faTicket} />,
	},
	{
		title: "Coupon",
		path: "/coupon",
		icon: <FontAwesomeIcon icon={faTag} />,
	},
	{
		title: "Messages",
		path: "/message",
		icon: <FontAwesomeIcon icon={faCommentDots} />,
	},
	// {
	// 	title: "Community Feed",
	// 	path: "/feed",
	// 	icon: <FontAwesomeIcon icon={faNewspaper} />,
	// 	// permission: "Ticketing",
	// },
	// {
	// 	title: "Terms & Conditions",
	// 	path: "/tc",
	// 	icon: <FontAwesomeIcon icon={faClipboardListCheck} />,
	// 	// permission: "Ticketing",
	// },
	// {
	// 	title: "Cookie Policy",
	// 	path: "/cp",
	// 	icon: <FontAwesomeIcon icon={faCookieBite} />,
	// 	// permission: "Ticketing",
	// },
	// {
	// 	title: "Maintenance",
	// 	path: "/maintenance-configuration",
	// 	icon: <FontAwesomeIcon icon={faScrewdriverWrench} />,
	// 	// permission: "Ticketing",
	// },
	// {
	// 	title: "View As",
	// 	path: "/viewas",
	// 	icon: <FontAwesomeIcon icon={faEye} />,
	// },
];

if (role() === "Super Admin") {
	AdminSideMenu.push({
		title: "Admin",
		path: "/admin",
		icon: <FontAwesomeIcon icon={faUserTie} />,
		// permission: "Ticketing",
	});
	AdminSideMenu.push({
		title: "Maintenance",
		path: "/maintenance-configuration",
		icon: <FontAwesomeIcon icon={faScrewdriverWrench} />,
		// permission: "Ticketing",
	});
}

export default AdminSideMenu;
