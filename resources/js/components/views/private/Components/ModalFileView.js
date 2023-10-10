import {
    Button,
    Col,
    Form,
    Modal,
    Row,
    Typography,
    notification,
    Divider,
} from "antd";
//import FloatInputPasswordStrength from "../../../../providers/FloatInputPasswordStrength";
import { useHistory } from "react-router-dom";
import { faTimes } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";

import moment from "moment";

export default function ModalFileView(props) {
    const { toggleModal, setToggleModal, type, file, clear, base64Var } = props;
    const history = useHistory();
    const [doc, setDoc] = useState("");
    const [ext, setExt] = useState("");

    // useEffect(() => {
    //   if (file !== "") {
    //     console.log("file", file);
    //     setDoc(base64Var);
    //     setExt(type);
    //   }
    // }, [file]);

    return (
        <Modal
            title="PDF Viewer"
            visible={toggleModal}
            width={1000}
            bodyStyle={{ minHeight: 500, padding: "0px" }}
            closeIcon={<FontAwesomeIcon icon={faTimes} />}
            footer={null}
            //   footer={
            //     <Button
            //       onClick={() => {}}
            //       type="primary"
            //       size="large"
            //       className="btn-primary btn-sign-in"
            //       style={{ width: "100%", fontSize: "18px" }}
            //     >
            //       BOOK APPOINTMENT
            //     </Button>
            //   }
            onCancel={() => {
                setToggleModal(false);
                // clear();
            }}
            className="modal-primary "
        >
            <div style={{ width: "100%" }}>
                <embed
                    src={`data:application/pdf;base64,${file}`}
                    type="application/pdf"
                    width="100%"
                    height="1000" // Set a suitable height for the PDF viewer
                />
                {/* <ReactFilePreviewer
            file={{
              data: "<base64 string>",
              mimeType: "application/pdf",
              name: "sample.pdf", // for download
            }}
          /> */}
            </div>

            {/* <embed
          type="image/png"
          src={"https://docs.google.com/viewer?url=" + file + "&embedded=true"}
        /> */}
        </Modal>
    );
}
