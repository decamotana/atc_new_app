import { Modal, Table } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/pro-regular-svg-icons";

export default function ModalView(props) {
	const { toggleModal, setToggleModal } = props;

	return (
		<Modal
			closeIcon={<FontAwesomeIcon icon={faTimes} />}
			title="View Reference Code"
			open={toggleModal.open}
			footer={null}
			onCancel={() => setToggleModal({ open: false, data: null })}
			className="modal-primary-default"
			forceRender
		>
			<Table
				className="ant-table-default ant-table-striped"
				dataSource={
					toggleModal &&
					toggleModal.data &&
					toggleModal.data.reference_code_info
				}
				rowKey={(record) => record.id}
				pagination={false}
				bordered={false}
				// rowSelection={{
				//   type: selectionType,
				//   ...rowSelection,
				// }}
				scroll={{ x: "max-content" }}
			>
				<Table.Column
					title="Code"
					key="code"
					dataIndex="code"
					render={(text, record) => record.code + "" + record.order_no}
				/>
				<Table.Column
					title="Status"
					key="status"
					dataIndex="status"
					render={(text, record) =>
						record.user_payment ? (
							<span className="color-6">Unvailable</span>
						) : (
							<span className="color-1">Available</span>
						)
					}
				/>
			</Table>
		</Modal>
	);
}
