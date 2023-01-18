import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { PageHeader } from "antd";

const ComponentHeader = ({ title, subtitle, icon }) => {
	return (
		<PageHeader
			title={
				<>
					<div className="ant-page-header-icon">
						<FontAwesomeIcon icon={icon} />
					</div>
					<div className="ant-page-header-text">
						<span className="sub-title">{subtitle}</span>
						<span className="title">{title}</span>
					</div>
				</>
			}
		/>
	);
};

export default ComponentHeader;
