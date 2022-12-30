import { Modal } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/pro-solid-svg-icons";

export default function ModalResourcesVideo(props) {
	const { toggleModalVideo, setToggleModalVideo } = props;

	return (
		<Modal
			closeIcon={<FontAwesomeIcon icon={faTimes} />}
			// width="50%"
			open={toggleModalVideo.show}
			footer={null}
			onCancel={() => setToggleModalVideo({ show: false, data: null })}
			style={{ padding: "20px 10px" }}
			className="dashboard-caregiver-modal-video"
		>
			{toggleModalVideo.data}
		</Modal>
	);
}
