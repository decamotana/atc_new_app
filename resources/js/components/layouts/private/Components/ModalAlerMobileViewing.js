import React from "react";
import { Button, Modal } from "antd";
import { WarningOutlined } from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/pro-solid-svg-icons";

const ModalAlerMobileViewing = ({
	showModalMobileViewing,
	setShowModalMobileViewing,
}) => {
	return (
		<>
			<Modal
				closeIcon={<FontAwesomeIcon icon={faTimes} />}
				visible={showModalMobileViewing}
				onCancel={() => {
					setShowModalMobileViewing(false);
				}}
				width={500}
				footer={false}
			>
				<div className="warningMobileViewing">
					<WarningOutlined />
				</div>
				<div className="warningMobileViewingText">
					Mobile/small device detected. We highly recommend viewing on larger
					device such as a laptop or desktop. By proceeding you acknowledge
					there may be limited views readily available
				</div>
				<div
					style={{
						textAlign: "center",
						marginTop: "20px",
					}}
				>
					<Button
						type="primary"
						size="large"
						onClick={() => {
							setShowModalMobileViewing(false);
						}}
					>
						{" "}
						{"I Acknowledge >>"}
					</Button>
				</div>
			</Modal>
		</>
	);
};

export default ModalAlerMobileViewing;
