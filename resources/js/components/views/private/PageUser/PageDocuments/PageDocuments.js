import {
  Card,
  Row,
  Col,
  Collapse,
  Button,
  Upload,
  message,
  Form,
  notification,
  Space,
  Table,
  Typography,
  Image,
  Tooltip,
} from "antd";
import React, { useEffect, useState, history } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import $ from "jquery";
import {
  faArrowUpFromSquare,
  faCircleInfo,
  faInfoCircle,
} from "@fortawesome/pro-regular-svg-icons";

import {
  TablePageSize,
  TableGlobalSearch,
  TableShowingEntries,
  TablePagination,
} from "../../Components/ComponentTableFilter";

import {
  GET,
  GETMANUAL,
  POST,
  POSTFILE,
} from "../../../../providers/useAxiosQuery";
import ModalFileView from "../../Components/ModalFileView";

import { useParams } from "react-router-dom";
import moment from "moment";
import { userData } from "../../../../providers/companyInfo";
import {
  faFolderOpen,
  faPlus,
  faVideo,
  faDownload,
  faEye,
} from "@fortawesome/pro-solid-svg-icons";
import {
  faArrowUpFromBracket,
  faFileUpload,
} from "@fortawesome/pro-light-svg-icons";

function PageDocuments(props) {
  const { match } = props;
  const [form] = Form.useForm();
  const [dataSource, setDataSource] = useState([]);
  const [currentTask, setCurrentTask] = useState("");
  const [visible, setVisible] = useState(false);
  const [fileSrc, setFileSrc] = useState("");
  const [fileExt, setFileExt] = useState("");
  const [base64File, setBase64File] = useState("");
  const [toggleModal, setToggleModal] = useState(false);

  const code = props.location.search.split("=")[1];

  const [tableFilter, setTableFilter] = useState({
    page: 1,
    page_size: 10,
    search: "",
    sort_field: "id",
    sort_order: "desc",
  });

  const [tableTotal, setTableTotal] = useState(0);

  const { refetch: getfilelist } = GET(
    `api/v1/dropbox/getfilelist?${$.param(tableFilter)}`,
    "get_list",
    (res) => {
      if (res.success) {
        setDataSource(res.data.data);
        setTableTotal(res.data.total);
      }
    }
  );

  useEffect(() => {
    getfilelist();
    return () => {};
  }, [tableFilter]);

  GET(`api/v1/task/${userData().id}`, "get_task", (res) => {
    if (res.success) {
      let task_data = [];
      res.data.reverse().map((item) => {
        if (task_data.length === 0) {
          task_data.push({
            id: item.id,
            title: item.title,
            description: item.description,
            assignedTo: item.assignedTo,
            dueDate: item.dueDate,
            isCompleted: item.isCompleted,
            isActive: true,
          });
        } else {
          task_data.push({
            id: item.id,
            title: item.title,
            description: item.description,
            assignedTo: item.assignedTo,
            dueDate: item.dueDate,
            isCompleted: item.isCompleted,
            isActive: task_data[task_data.length - 1].isCompleted
              ? true
              : false,
          });
        }
      });

      task_data.sort((a, b) =>
        a.isActive > b.isActive ? 1 : b.isCompleted > a.isCompleted ? -1 : 0
      );

      let current_task = task_data.filter((task) => {
        return (task.isActive == true) & (task.isCompleted == false);
      });
      console.log(current_task);
      setCurrentTask(current_task);
    }
  });

  // const { mutate: mutateFetchKey } = POST("api/v1/dropbox", "upload_docs");

  // const connectToDropBox = () => {
  // 	mutateFetchKey("", {
  // 		onSuccess: (res) => {
  // 			if (res.type == "url") {
  // 				window.location.replace(res.data);
  // 				console.log(res.data);
  // 			} else {
  // 				console.log(res.data);
  // 			}
  // 		},
  // 	});
  // };

  // const { mutate: mutateSaveToken } = POST(
  // 	"api/v1/dropbox/savetoken",
  // 	"savetoken"
  // );

  const { mutate: mutateDownloadFile } = POST(
    "api/v1/dropbox/download",
    "savetoken"
  );

  const { mutate: mutatePreviewFile } = POST(
    "api/v1/dropbox/preview",
    "savetoken"
  );

  const handleDownloadFile = (id) => {
    let data = {
      id: id,
    };

    mutateDownloadFile(data, {
      onSuccess: (res) => {
        if (res.success) {
          window.location.replace(res.data);
        }
      },
    });
  };

  const [showPdfDoc, setShowPdfDoc] = useState(false);

  const handlePreviewFile = (id) => {
    let data = {
      id: id,
    };

    mutatePreviewFile(data, {
      onSuccess: (res) => {
        if (res.success) {
          // window.location.replace(res.data);
          setFileSrc("");
          setFileExt("");
          setFileExt(res.filename);
          setBase64File(res.data);

          var file_type = ["docx", "pdf", "doc"];

          if (file_type.includes(res.filename)) {
            // setFileSrc(
            //   "data:application/" + `${res.filename}` + ";base64," + res.data
            // );

            setFileSrc(res.data);
          } else {
            setFileSrc(
              "data:image/" + `${res.filename}` + ";base64," + res.data
            );
          }
        }
      },
    });
  };

  const handleClearFile = () => {
    setFileSrc("");
    setFileExt("");
  };

  useEffect(() => {
    if (fileSrc != "") {
      var file_type = ["docx", "pdf", "doc"];

      if (file_type.includes(fileExt)) {
        console.log("filesource :", fileSrc);

        setShowPdfDoc(true);

        // var win = window.open();
        // win.document.write(
        //   '<iframe src="' +
        //     fileSrc +
        //     '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>'
        // );
      } else {
        setVisible(true);
      }
    }
  }, [fileSrc]);

  const { mutate: addHistoryLog } = POST(
    "api/v1/historylogs/add",
    "add_history_logs"
  );

  const { mutate: mutateCreate, isLoading: isLoadingCreate } = POSTFILE(
    "api/v1/user/upload",
    "upload"
  );

  const [multifileList, setMultiFileList] = useState([]);
  const onFinish = (values) => {
    //console.log("values", values);

    // let data = {
    //   ...values,
    //   id: table_id ? table_id : "",
    // };

    const data = new FormData();

    multifileList.map((item, index) => {
      data.append("images_" + index, item.originFileObj, item.name);
    });
    data.append("images_count", multifileList ? multifileList.length : 0);
    data.append("images", multifileList);

    data.append("current_task", JSON.stringify(currentTask));

    if (multifileList.length > 0) {
      mutateCreate(data, {
        onSuccess: (res) => {
          if (res.success) {
            notification.success({
              message: "Success",
              description: "Successfully created",
            });
            var filename = multifileList.map((item) => item.name);
            console.log("filename", filename);

            addHistoryLog(
              {
                page: "documents",
                key: "upload document",
                old_data: "",
                new_data: JSON.stringify(filename),
                method: "upload-document",
                // consultant: details[0].eventInfo.title,
              },
              { onSuccess: (res) => {} }
            );

            getfilelist();
            setMultiFileList([]);
            form.resetFields();

            // history.push(`/view/restaurants/edit/${table_id}`);
          }
        },
        onError: (res) => {},
      });
    } else {
      notification.warning({
        message: "Warning",
        description: "Please choose files to upload",
      });
    }
  };

  const handleTableChange = (pagination, filters, sorter) => {
    console.log(sorter.order);

    setTableFilter({
      ...tableFilter,
      sort_field: sorter.columnKey,
      sort_order: sorter.order ? sorter.order.replace("end", "") : null,
      page_number: 1,
    });
  };

  const truncateString = (str, num) => {
    if (str.length > num) {
      return str.slice(0, num) + "...";
    } else {
      return str;
    }
  };

  const isImage = (file) => {
    let file_type = ["pdf", "docx", "doc"];

    if (file_type.includes(file)) {
      return false;
    } else {
      return true;
    }
  };

  const [tabIndex, setTabIndex] = useState(0);
  return (
    <Card className="upload-card card--padding-mobile">
      <Row>
        <Col md={24}>
          <Space direction="horizontal">
            <Button
              type="primary"
              className={
                "btn-primary btn-with-svg btn-video " +
                (tabIndex === 0 && " btn-video-active")
              }
              icon={<FontAwesomeIcon icon={faFileUpload} />}
              onClick={() => {
                setTabIndex(0);
              }}
            >
              Upload Docs
            </Button>

            <Button
              type="primary"
              className={
                "btn-primary btn-with-svg btn-download " +
                (tabIndex === 1 && " btn-download-active")
              }
              icon={<FontAwesomeIcon icon={faFolderOpen} />}
              onClick={() => {
                setTabIndex(1);
              }}
            >
              My Uploads
            </Button>
          </Space>
        </Col>
      </Row>
      {tabIndex == 0 ? (
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Row gutter={8} className="upload-doc-row m-t-md">
            <Col xs={24} sm={24} md={24} lg={20} xl={8} xxl={6}>
              <Card
                className="card-primary-new-primary"
                title="UPLOAD DOCUMENTS"
                size="10"
              >
                <Space direction="vertical" className="w-100">
                  <Upload
                    className="venue-images"
                    listType="picture"
                    fileList={multifileList}
                    onChange={({ fileList: newFileList }) => {
                      var _file = newFileList;
                      console.log(_file);
                      _file.map((row, key) => {
                        return (row.status = "done");
                      });

                      let _newFile = [];

                      _file.forEach((item) => {
                        const isJpgOrPngOrDoc =
                          item.type === "image/jpeg" ||
                          item.type === "image/png" ||
                          item.type === "image/gif" ||
                          item.type === "image/jpg" ||
                          item.type === "application/msword" ||
                          item.type === "application/pdf";

                        if (isJpgOrPngOrDoc) {
                          _newFile.push(item);
                        }
                      });

                      setMultiFileList(_newFile);
                    }}
                    beforeUpload={(file) => {
                      let error = false;
                      const isJpgOrPngOrDoc =
                        file.type === "image/jpeg" ||
                        file.type === "image/png" ||
                        file.type === "image/gif" ||
                        file.type === "image/jpg" ||
                        file.type === "application/msword" ||
                        file.type === "application/pdf";
                      if (!isJpgOrPngOrDoc) {
                        message.error(
                          "You can only upload JPG, PNG, GIF, JPEG, DOC, DOCX, PDF file!"
                        );
                        error = Upload.LIST_IGNORE;
                      }
                      const isLt2M = file.size / 102400 / 102400 < 10;
                      if (!isLt2M) {
                        message.error("Image must smaller than 10MB!");
                        error = Upload.LIST_IGNORE;
                      }

                      if (error === false) {
                        return false;
                      }
                      return Upload.LIST_IGNORE;
                    }}
                    onPreview={async (file) => {
                      let src = file.url;
                      if (!src) {
                        src = await new Promise((resolve) => {
                          const reader = new FileReader();
                          reader.readAsDataURL(file.originFileObj);
                          reader.onload = () => resolve(reader.result);
                        });
                      }
                      const image = new Image();
                      image.src = src;
                      const imgWindow = window.open(src);
                      imgWindow.document.write(image.outerHTML);
                    }}
                  >
                    <Button type="dashed" className="upload-btn">
                      <div className="upload-btn-description">
                        <p className="ant-upload-text">
                          <FontAwesomeIcon
                            className="document-upload-icon"
                            icon={faArrowUpFromBracket}
                          />
                        </p>
                        <br />
                        <Typography.Text className="upload-title">
                          Click or Drag{" "}
                        </Typography.Text>
                        <br />
                        <Typography.Text className="upload-title">
                          Documents to Upload{" "}
                        </Typography.Text>

                        <br />
                        <br />

                        <Typography.Text>
                          <strong>Limit:</strong>{" "}
                          <span
                            style={{ color: "#58595b", fontWeight: "lighter" }}
                          >
                            2MB (Unlimited Number of Files)
                          </span>
                        </Typography.Text>
                        <br />
                        <Typography.Text>
                          <strong>Types:</strong>{" "}
                          <span
                            style={{ color: "#58595b", fontWeight: "lighter" }}
                          >
                            pdf, png, gif, jpg, jpeg, doc, docx.{" "}
                          </span>
                        </Typography.Text>
                        {/* <p
                      className="upload-instruction"
                      style={{ whiteSpaces: "break-word" }}
                    >
                      2MB limit. Allowed types: pdf, png, gif, jpg, jpeg, doc,
                      docx.
                    </p>
                    <p className="upload-instruction">
                      Unlimited number of documents can be uploaded to this
                      field.
                    </p> */}
                      </div>
                    </Button>
                  </Upload>

                  <Button
                    type="primary"
                    htmlType="submit"
                    //    loading={isLoadingButtonLogin}
                    className="btn-primary btn-upload btn-with-svg m-t-sm"
                    icon={<FontAwesomeIcon icon={faPlus} />}
                    size="large"
                    onMouseLeave={(e) => {
                      e.target.blur();
                    }}
                  >
                    Submit
                  </Button>
                </Space>
              </Card>
            </Col>
          </Row>
        </Form>
      ) : (
        <Row>
          <Col className="m-t-md m-b-sm" sm={24} md={24}>
            <Typography.Text className="document-upload-title">
              MY UPLOADS
            </Typography.Text>
            <br />
            <Typography.Text>
              <strong>Note: </strong> Your uploaded documents will automatically
              be renamed according to ATC's nomenclature.
            </Typography.Text>
          </Col>
          <Col sm={24} md={24} className="upload-tbl-cont">
            <Table
              className="ant-table-default ant-table-striped"
              dataSource={dataSource && dataSource}
              rowKey={(record) => record.id}
              pagination={false}
              bordered={true}
              onChange={handleTableChange}
              scroll={{ x: "max-content" }}
            >
              <Table.Column
                title="Filename"
                key="file_name"
                defaultSortOrder="descend"
                sorter={true}
                dataIndex="file_name"
                width={"300px"}
                render={(text, record) => {
                  return (
                    <>
                      <div
                        style={{
                          //    display: "inline-flex",
                          alignItems: "center",
                          whiteSpace: "break-spaces",
                        }}
                      >
                        <div className="table-action-btn">
                          <Button
                            style={{
                              color: "#365293",
                              marginRight: 7,
                              padding: 0,
                            }}
                            type="link"
                            onClick={() => {
                              handleDownloadFile(record.id);
                            }}
                          >
                            <FontAwesomeIcon icon={faDownload} />
                          </Button>
                          <Button
                            style={{
                              color: "#365293",
                              marginRight: 7,
                              padding: 0,
                            }}
                            type="link"
                            onClick={() => {
                              handlePreviewFile(record.id);
                            }}
                          >
                            <FontAwesomeIcon icon={faEye} />
                          </Button>
                          <Tooltip title={text}>
                            <span>
                              {truncateString(text.split(".")[0], 18) +
                                "." +
                                text.split(".")[1]}
                            </span>
                          </Tooltip>{" "}
                        </div>
                      </div>
                    </>
                  );
                }}
              />
              <Table.Column
                title="Date Uploaded"
                key="created_date"
                dataIndex="created_date"
                sorter={true}
                width={"200px"}
              />
              <Table.Column
                title="Original Filename"
                key="original_file_name"
                dataIndex="original_file_name"
                sorter={true}
                // width={"10px"}
                render={(text, record) => (
                  <Tooltip title={text}>
                    <p className="margin-bottom-0">
                      {truncateString(text.split(".")[0], 15) +
                        "." +
                        text.split(".")[1]}
                    </p>
                  </Tooltip>
                )}
              />
            </Table>
            <Col xs={24} sm={24} md={24}>
              <div className="ant-space-flex-space-between m-t-sm upload-pagination">
                <TableShowingEntries />
                <TablePagination
                  paginationFilter={tableFilter}
                  setPaginationFilter={setTableFilter}
                  setPaginationTotal={tableTotal}
                  showLessItems={true}
                  showSizeChanger={false}
                />
              </div>
            </Col>
          </Col>
        </Row>
      )}

      {fileSrc != "" && isImage(fileExt) && (
        <Image
          width={200}
          style={{ display: "none" }}
          src={fileSrc}
          preview={{
            visible,
            src: fileSrc,
            onVisibleChange: (value) => {
              setVisible(value);
              if (value == false) {
                setFileSrc("");
                setFileExt("");
              }
            },
          }}
        />
      )}
      <ModalFileView
        setToggleModal={setShowPdfDoc}
        toggleModal={showPdfDoc}
        file={fileSrc}
        type={fileExt}
        base64Var={base64File}
      />
    </Card>
  );
}

export default PageDocuments;
