import { faTimes } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Modal } from "antd";
import AdvertisingGraph from "./AdvertisingGraph";

export default function ModalGraph({ toogleModalGraph, setToogleModalGraph }) {
	return (
		<Modal
			closeIcon={<FontAwesomeIcon icon={faTimes} />}
			title="Advertising Graph Statistic"
			open={toogleModalGraph.show}
			footer={null}
			onCancel={() => setToogleModalGraph({ show: false, id: "", title: "" })}
			className="modal-primary-default modal-advertising-graph"
			forceRender
		>
			<div style={{ overflowY: "scroll" }}>
				<AdvertisingGraph
					id={toogleModalGraph.id}
					title={toogleModalGraph.title}
				/>
			</div>
		</Modal>
	);
}
