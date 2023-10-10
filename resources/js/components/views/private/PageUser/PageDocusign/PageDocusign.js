import { Card, Row, Col, Collapse, Button, Upload, message, Form, notification, Typography, Image, Tooltip, Modal } from "antd"
import React, { useEffect, useState, history } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import $ from "jquery"
import { faArrowUpFromSquare, faDownload, faEye, faPen, faUpload } from "@fortawesome/pro-regular-svg-icons"

import { GET, POST, POSTFILE } from "../../../../providers/useAxiosQuery"
import ModalFileView from "../../Components/ModalFileView"
import moment from "moment"
import { userData } from "../../../../providers/companyInfo"
import ReactSignatureCanvas from "react-signature-canvas"
import FloatInput from "../../../../providers/FloatInput"
import { useHistory } from "react-router-dom"

function PageDocusign(props) {
  const { match } = props
  const [form] = Form.useForm()
  const history = useHistory()

  const [toggleModal, setToggleModal] = useState(false)

  let refSignature

  const { mutate: mutateSaveSignature } = POST("api/v1/client/signature", "save_client_signature")
  const { mutate: mutateSubmitDocusign } = POST("api/v1/client/submit_mda", "get_user")

  const [iframeLink, setIframeLink] = useState()
  const [downloadLink, setDownloadLink] = useState()
  const [signature, setSignature] = useState()
  const [hasAgreed, setHasAgreed] = useState(false)

  const handleSaveSignature = (data) => {
    mutateSaveSignature(data, {
      onSuccess: (res) => {
        setIframeLink(res.link)
        setDownloadLink(res.downloadLink)

        // notification.success({ message: "Signature Saved!" });

        setSignature(data.signature)
        setToggleModal(false)
      },
      onError: (res) => {
        console.log("error", res.message)
      },
    })
  }

  const [documentData, setDocumentData] = useState()

  const handlePreviewDoc = () => {
    let data = {
      firstname: form.getFieldValue("firstname"),
      lastname: form.getFieldValue("lastname"),
      address: form.getFieldValue("address"),
      city: form.getFieldValue("city"),
      state: form.getFieldValue("state"),
      zip_code: form.getFieldValue("zip_code"),
    }

    setDocumentData(data)
  }

  const { data: dataGetUser, refetch: getUser } = GET(`api/v1/users/${userData().id}`, "get_user", (res) => {
    if (res.success) {
      let user = res.data

      form.setFieldsValue({
        firstname: user.firstname,
        lastname: user.lastname,
        address: user.mda_address ? user.mda_address : user.user_address.address1,
        city: user.mda_address ? user.mda_city : user.user_address.city,
        state: user.mda_address ? user.mda_state : user.user_address.state,
        zip_code: user.mda_address ? user.mda_zip : user.user_address.zip_code,
      })

      if (res.data.signature) {
        setSignature(res.data.signature)

        let data = {
          signature: res.data.signature,
          firstname: user.firstname,
          lastname: user.lastname,
          address: user.mda_address ? user.mda_address : user.user_address.address1,
          city: user.mda_address ? user.mda_city : user.user_address.city,
          state: user.mda_address ? user.mda_state : user.user_address.state,
          zip_code: user.mda_address ? user.mda_zip : user.user_address.zip_code,
        }

        if (user.has_agreed_mnda) {
          setHasAgreed(true)
        }

        handleSaveSignature(data)
        setToggleModal(false)
      } else {
        setToggleModal(true)
      }
    }
  })

  useEffect(() => {
    if (!userData().has_mnda) {
      history.push("/")
    }
  }, [userData])

  useEffect(() => {
    if (signature) {
      if (toggleModal) {
        refSignature.clear()
        refSignature.fromDataURL(signature)
      }
    }
  })

  const handleSubmitDocusign = () => {
    let data = {
      link: downloadLink,
      user_id: userData().id,
    }

    mutateSubmitDocusign(data, {
      onSuccess: (res) => {
        notification.success({ message: res.message })
        console.log("user", userData())
      },
      onError: (res) => {
        console.log("error", res.message)
      },
    })
  }

  return (
    <Card className="upload-card card--padding-mobile" bodyStyle={{ paddingTop: 12 }}>
      {iframeLink && (
        <>
          <Row>
            <Col>
              {!hasAgreed ? (
                <Button
                  type="text"
                  onClick={() => {
                    // window.open(downloadLink);
                    handleSubmitDocusign()
                    setHasAgreed(true)
                  }}
                  size="medium"
                  className="btn-dashboard-task btn-task-primary btn-mda-download"
                >
                  {/* <FontAwesomeIcon icon={faDownload} style={{ marginRight: "5px" }} /> */}
                  Agree and Submit
                </Button>
              ) : (
                <Button
                  type="text"
                  onClick={() => {
                    window.open(downloadLink)
                  }}
                  size="medium"
                  className="btn-dashboard-task btn-task-primary btn-mda-download"
                >
                  <FontAwesomeIcon icon={faDownload} style={{ marginRight: "5px" }} />
                  Download
                </Button>
              )}
            </Col>
            {/* <Col>
              <Button
                type="text"
                onClick={() => {
                  setToggleModal(true);
                  setHasEdit(true);
                }}
                size="medium"
                className="btn-dashboard-task btn-task-active"
              >
                <FontAwesomeIcon icon={faPen} style={{ marginRight: "5px" }} />
                Edit
              </Button>
            </Col>

            <Col>
              <Button
                type="text"
                onClick={() => {
                  handleSubmitDocusign();
                }}
                size="medium"
                className="btn-dashboard-task btn-task-pending"
              >
                <FontAwesomeIcon
                  icon={faUpload}
                  style={{ marginRight: "5px" }}
                />
                Submit
              </Button>
            </Col> */}
          </Row>

          <Row className="m-t-md">
            <iframe
              src={iframeLink && iframeLink}
              // type="application/pdf"
              width="100%"
              style={{ height: 1000 }}
            />
            {!hasAgreed && (
              <div style={{ width: "100%" }}>
                <Button
                  style={{
                    left: "55%",
                    transform: "translate(-65%, 0px)",
                    position: "fixed",
                    bottom: "20px",
                  }}
                  className="atc-btn"
                  onClick={() => {
                    handleSubmitDocusign()
                    setHasAgreed(true)
                  }}
                >
                  Agree and Submit
                </Button>
              </div>
            )}
          </Row>
        </>
      )}

      <Modal
        title="Mutual Confidentiality Agreement"
        visible={toggleModal}
        width={500}
        bodyStyle={{ minHeight: 500 }}
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
          setToggleModal(false)

          // clear();
        }}
        className="modal-primary "
      >
        <div style={{ marginBottom: 20 }}>Completing these fields and adding your signature simply means your information will pre-populate into the appropriate fields, however this does NOT mean you are pre-signing and agreeing to the terms of the document. Once you have competed reviewing this document you will have the option to agree and submit or to decline to this document.</div>
        <Form form={form}>
          <Row gutter={8}>
            <Col xs={24} sm={24} md={24}>
              <Form.Item name="firstname" rules={[{ required: true }]} hasFeedback>
                <FloatInput label="Firstname" placeholder="Firstname" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={24}>
              <Form.Item name="lastname" rules={[{ required: true }]} hasFeedback>
                <FloatInput label="Lastname" placeholder="Lastname" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={24}>
              <Form.Item name="address" rules={[{ required: true }]} hasFeedback>
                <FloatInput label="Address" placeholder="Address" />
              </Form.Item>
            </Col>
            <Col xs={8} sm={8} md={8}>
              <Form.Item name="city" rules={[{ required: true }]} hasFeedback>
                <FloatInput label="City" placeholder="City" />
              </Form.Item>
            </Col>
            <Col xs={8} sm={8} md={8}>
              <Form.Item name="state" rules={[{ required: true }]} hasFeedback>
                <FloatInput label="State" placeholder="State" />
              </Form.Item>
            </Col>
            <Col xs={8} sm={8} md={8}>
              <Form.Item name="zip_code" rules={[{ required: true }]} hasFeedback>
                <FloatInput label="Zip Code" placeholder="Zip Code" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={24}>
              <Form.Item
                name="signature"
                hasFeedback
                rules={[
                  () => ({
                    validator(_, value) {
                      if (!refSignature.isEmpty()) {
                        return Promise.resolve()
                      }
                      return Promise.reject(new Error("*Signature is required"))
                    },
                  }),
                ]}
              >
                <div
                  style={{
                    height: "180px",
                    width: "100%",
                    border: "1px solid black",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      marginLeft: "10px",
                      marginTop: "5px",
                      fontSize: "10px",
                    }}
                  >
                    Signature
                  </div>
                  <div
                    style={{
                      right: "0px",
                      bottom: "0px",
                      fontSize: "10px",
                      position: "absolute",
                      color: " #3f5fac",
                    }}
                  >
                    <Button
                      type="text"
                      onClick={() => {
                        refSignature.clear()
                      }}
                    >
                      CLEAR
                    </Button>
                  </div>
                  <ReactSignatureCanvas
                    penColor="black"
                    defaultValue={signature && signature}
                    ref={(ref) => (refSignature = ref)}
                    canvasProps={{
                      width: "460px",
                    }}
                  />
                </div>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col xs={24} sm={24} md={24}>
              <Button
                style={{ float: "right " }}
                className="atc-btn"
                onClick={() => {
                  form
                    .validateFields()
                    .then((values) => {
                      handleSaveSignature({
                        signature: refSignature.toDataURL(),
                        firstname: values.firstname,
                        lastname: values.lastname,
                        address: values.address,
                        city: values.city,
                        state: values.state,
                        zip_code: values.zip_code,
                      })
                      setSignature(refSignature.toDataURL())
                    })
                    .catch((info) => {
                      console.log("Validate Failed:", info)
                    })

                  console.log(refSignature.toDataURL())
                }}
              >
                Preview Document
              </Button>
            </Col>
          </Row>
        </Form>
      </Modal>
    </Card>
  )
}

export default PageDocusign
