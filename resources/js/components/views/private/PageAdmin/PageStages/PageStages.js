import React, { useState } from "react"
import { Card, Collapse, Form, Input, notification } from "antd"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import { faAngleDown, faAngleUp, faPlus } from "@fortawesome/pro-regular-svg-icons"

import FloatInput from "../../../../providers/FloatInput"

import { formats, modulesToolBar } from "../../../../providers/reactQuillOptions"

import ReactQuill, { Quill } from "react-quill"
import "react-quill/dist/quill.snow.css"
import ImageResize from "quill-image-resize-module-react"
import { GET, POST } from "../../../../providers/useAxiosQuery"
Quill.register("modules/imageResize", ImageResize)
const FontSize = ReactQuill.Quill.import("attributors/style/size")
FontSize.whitelist = ["10px", "12px", "14px", "16px", "18px", "20px"]
ReactQuill.Quill.register(FontSize, true)

export default function PageStages() {
  const [dataSource, setDataSource] = useState([])
  const [form] = Form.useForm()
  const [stage, setStages] = useState([])
  const [stageDetails, setStageDetails] = useState([])

  const stage_name = ["App Analysis", "Client Stage", "Set Appt.", "Development", "Publish", "Complete"]

  const modules = {
    toolbar: {
      container: [[{ header: [1, 2, false] }], ["bold", "italic", "underline", "strike", "blockquote"], [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }], ["link", "image", "video"], ["clean"], [{ font: [] }], [{ size: ["10px", "12px", "14px", "16px", "18px", "20px"] }]],
    },
  }

  GET("api/v1/user/opportunity", "opportunity", (res) => {
    if (res.success) {
      console.log(res.pipeline_stages)
      setStages(res.pipeline_stages)
    }
  })

  GET("api/v1/user/stages", "stages", (res) => {
    if (res.success) {
      console.log("stages:", res.data)
      setStageDetails(res.data)
    }
  })

  const {
    mutate: mutateStagesDetails,
    // isLoading: isLoadingEmailTemplate,
  } = POST("api/v1/user/stages/update", "stages")

  const save = (values) => {
    // console.log("onFinish", values);

    mutateStagesDetails(values, {
      onSuccess: (res) => {
        // console.log("mutateEmailTemplate", res);
        if (res.success) {
          notification.success({
            message: "Stage description",
            description: "Successfully Updated",
          })
        } else {
          notification.error({
            message: "Stage description",
            description: "Data not updated!",
          })
        }
      },
      onError: (err) => {
        notification.error({
          message: "Stage description",
          description: err.response.data.message,
        })
      },
    })
  }

  const handleBlurSave = (value, index, id) => {
    // console.log("value", value);
    // console.log("field", field);
    // console.log("dataSource", dataSource);
    // console.log("dataSource[index]", dataSource[index]);
    // console.log("dataSource[index][field]", dataSource[index][field]);

    if (dataSource[index] !== value) {
      let data = {
        id: id,
        value: value,
      }

      save(data)
    }
  }

  return (
    <Card className="card--padding-mobile">
      <Form form={form}>
        <Form.List name="stages">
          {(fields, { add, remove }) => (
            <>
              {stageDetails.length > 0 &&
                stageDetails.map((item, index, { key, name, ...restField }) => (
                  <Collapse accordion expandIconPosition="end" expandIcon={({ isActive }) => <FontAwesomeIcon icon={faPlus} style={{ color: "#325db8", fontSize: 18 }} />} className="main-4-collapse border-none m-b-lg" key={`${item.id}`} defaultActiveKey={["0"]}>
                    <Collapse.Panel header={item.title} key={index === 0 ? "0" : "1"}>
                      {/* <Form.Item
                        {...restField}
                        name={[name, "body"]}
                        className="m-b-md"
                        hasFeedback
                        rules={[
                          {
                            required: true,
                            message: "This field is required.",
                          },
                        ]}
                      > */}
                      <ReactQuill className="ticket-quill" theme="snow" style={{ height: 250 }} modules={modules} formats={formats} value={item.description} onBlur={(range, source, quill) => handleBlurSave(quill.getHTML(), index, item.id)} />
                      {/* </Form.Item> */}
                    </Collapse.Panel>
                  </Collapse>
                ))}
            </>
          )}
        </Form.List>
      </Form>
    </Card>
  )
}
