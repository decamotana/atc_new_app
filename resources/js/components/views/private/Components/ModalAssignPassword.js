import { Button, Col, Form, Modal, Row, Typography, notification, Divider } from "antd"
import React, { useState, useEffect } from "react"
import FloatInput from "../../../providers/FloatInput"

//import FloatInputPasswordStrength from "../../../../providers/FloatInputPasswordStrength";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTimes } from "@fortawesome/pro-solid-svg-icons"
import { faCircleInfo } from "@fortawesome/pro-light-svg-icons"
import { POST, GET, UPDATE } from "../../../providers/useAxiosQuery"
import { ExclamationCircleOutlined } from "@ant-design/icons"
import moment from "moment"

export default function ModalAssignPassword(props) {
  const { toggleModal, setToggleModal, id } = props

  const [form] = Form.useForm()
  const [currentTimezone, setCurrentTimezone] = useState("")
  const [isDisabled, setIsDisabled] = useState(false)
  const [newPassword, setNewPassword] = useState("")

  useEffect(() => {
    console.log("id:", id)
    return () => {}
  }, [id])

  const { mutate: mutateAssignPassword, isLoading: isLoadingAssignPassword } = POST("api/v1/profile_change_password", "change_passpord")

  const handleToggleModal = () => {
    setIsDisabled(false)
    setToggleModal(false)
  }

  const onFinishForm = () => {
    let data = {
      ...form.getFieldsValue("new_password"),
      id: id,
      setup_consultant: true,
    }

    console.log(data)

    mutateAssignPassword(data, {
      onSuccess: (res) => {
        if (res.success) {
          notification.success({
            message: "Set up password",
            description: "Password successfuly saved",
          })

          form.resetFields()
          setToggleModal(false)
        }
      },
    })
  }

  return (
    <Modal
      //title={"BOOK APPOINTMENT"}
      visible={toggleModal}
      onCancel={handleToggleModal}
      title="SETUP PASSWORD"
      className="modal-set-up-pass modal-primary-default modal-change-2-factor-authentication modal-appointment"
      footer={
        <>
          <Button style={{ width: "100%", fontSize: "18px" }} size="large" onClick={onFinishForm} className="btn-main">
            SAVE
          </Button>
        </>
      }
    >
      <Row>
        <Col>
          <Form form={form} onFinish={onFinishForm}>
            <Form.Item name="new_password">
              <FloatInput label="New Password" placeholder="New Password" />
            </Form.Item>
          </Form>
          {/* <>
            <div className="event-title-container">
              <div
                className="box"
                style={{
                  color: details[0] && details[0].color + "!important",
                }}
              ></div>
              <span className="event-title">
                <strong>{details[0] && details[0].eventInfo.title}</strong>
              </span>
            </div>
            <div className="event-schedule-container">
              <span className="event-date">
                {details[0] && details[0].date}
              </span>
              <br />
              <span className="event-time">
                {details[0] && details[0].time_start} {"-"}{" "}
                {details[0] && details[0].time_end}
              </span>
              <br />
              <span className="event-time">
                {" "}
                Status:{" "}
                <strong>
                  {details[0] &&
                    details[0].eventInfo.extendedProps.status.toUpperCase()}
                </strong>
              </span>
            </div>
          </> */}
        </Col>
      </Row>
    </Modal>
  )
}
