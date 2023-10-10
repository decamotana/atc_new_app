import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faAnalytics,
	faBooks,
	faCogs,
	faCommentDots,
	faHome,
	faUsers,
} from "@fortawesome/pro-regular-svg-icons";

const CareProfessionalSideMenu = [
	{
		title: "Dashboard",
		path: "/dashboard",
		icon: <FontAwesomeIcon icon={faHome} />,
	},
	{
		title: "Training Modules",
		path: "/training-modules",
		icon: <FontAwesomeIcon icon={faAnalytics} />,
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
				title: "Document Resources",
				path: "/resource-library/document-resources",
			},
		],
	},
	{
		title: "Subscribers",
		path: "/subscribers",
		icon: <FontAwesomeIcon icon={faUsers} />,
		children: [
			{
				title: "Current & Completed",
				path: "/subscribers/current-completed",
			},
		],
	},
	{
		title: "Support",
		path: "/support",
		icon: <FontAwesomeIcon icon={faCogs} />,
		children: [
			{
				title: "FAQs",
				path: "/support/faqs",
			},
			{
				title: "Ticketing",
				path: "/support/ticketing",
			},
		],
	},
	{
		title: "Messages",
		path: "/message",
		icon: <FontAwesomeIcon icon={faCommentDots} />,
	},
];

export default CareProfessionalSideMenu;
