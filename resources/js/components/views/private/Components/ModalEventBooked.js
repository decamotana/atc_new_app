import {
    Button,
    Col,
    Form,
    Modal,
    Row,
    Typography,
    notification,
    Divider,
    Upload,
    message,
    Result,
} from "antd";
//import FloatInputPasswordStrength from "../../../../providers/FloatInputPasswordStrength";
import { useHistory } from "react-router-dom";
import {
    GET,
    GETMANUAL,
    POST,
    POSTFILE,
} from "../../../providers/useAxiosQuery";
import React, { useEffect, useState } from "react";
import moment from "moment";
import { role, tz_offset } from "../../../providers/companyInfo";
import { GoPrimitiveDot } from "react-icons/go";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faArrowUpFromBracket,
    faArrowUpFromSquare,
} from "@fortawesome/pro-regular-svg-icons";

export default function ModalEventBooked(props) {
    const { toggleModal, setToggleModal, details, appStage } = props;
    const [appointmentDetails, setappointmentDetails] = useState([]);
    const [selectedTime, setSelectedTime] = useState();
    const [appointmentSlots, setAppointmentSlots] = useState([]);
    const [form] = Form.useForm();
    const history = useHistory();
    const [currentData, setCurrentData] = useState({
        stage: "",
        tag: "",
    });

    useEffect(() => {
        if (details.length > 0) {
            let sorted_slots = details[0].slots.slots.sort((a, b) => {
                let time_1 = moment(a.time_start, "HH:mm");
                let time_2 = moment(b.time_start, "HH:mm");
                return time_1.isBefore(time_2) ? -1 : 1;
            });
            setAppointmentSlots(sorted_slots);
            setappointmentDetails(details);
        }
    }, [details]);

    // useEffect(() => {
    //   if (appStage) {
    //     // console.log("appStage", appStage);
    //     refetchGetcurrenttag();
    //   }
    // }, [appStage]);

    // const { refetch: getLastUploadedStage } = GET(
    //   "api/v1/dropbox/getlastuploadedstage",
    //   "getlastuploadedstage",
    //   (res) => {
    //     if (res.success) {
    //       let data = "";

    //       if (res.data?.stage.trim() === "pre publish") {
    //         data = "pre-publish";
    //       } else if (res.data?.stage.trim() === "follow up call") {
    //         data = "follow up call (optional)";
    //       } else if (res.data?.stage.trim() === "pre interview") {
    //         data = "pre-interview";
    //       } else if (
    //         res.data?.stage.trim() === "reschedule" ||
    //         res.data?.stage.trim() === "1 hr update reschedule"
    //       ) {
    //         data = res.data.last_uploaded_stage.trim();
    //         if (data === "follow up call") {
    //           data = "follow up call (optional)";
    //         } else if (data === "1 hr update") {
    //           data = "one hour update";
    //         } else if (data === "pre interview") {
    //           console.log("asdasdsad asdadas");
    //           data = "pre-interview";
    //         }
    //       } else {
    //         data = res.data?.stage.trim();
    //       }

    //       setCurrentData({ ...currentData, stage: data });
    //       console.log("@currentData", data);
    //       // refetchGetcurrenttag();
    //     }
    //   }
    // );

    const { refetch: refetchGetcurrenttag } = GET(
        `api/v1/user/getcurrenttag`,
        "tag",
        (res) => {
            if (role() == "User") {
                if (res.success) {
                    let data = res.data;
                    let current_stage = "";
                    if (Array.isArray(data)) {
                        data.forEach((x) => {
                            if (x.includes("current task")) {
                                let stages = x.split("-");
                                if (Array.isArray(stages)) {
                                    stages = stages[0].trim();
                                }

                                if (stages === "reschedule") {
                                    current_stage = appStage;
                                } else if (stages === "pre publish") {
                                    current_stage = "pre-publish";
                                } else if (stages === "follow up call") {
                                    current_stage = "follow up call (optional)";
                                } else if (
                                    stages === "1 hr update reschedule"
                                ) {
                                    current_stage = currentData?.stage;
                                } else if (stages === "pre interview") {
                                    current_stage = "pre-interview";
                                } else {
                                    current_stage = stages;
                                }
                            }
                        });
                    }

                    let dataStage = "";
                    if (res.lastStageUploaded?.stage.trim() === "pre publish") {
                        dataStage = "pre-publish";
                    } else if (
                        res.lastStageUploaded?.stage.trim() === "follow up call"
                    ) {
                        dataStage = "follow up call (optional)";
                    } else if (
                        res.lastStageUploaded?.stage.trim() === "pre interview"
                    ) {
                        dataStage = "pre-interview";
                    } else if (
                        res.lastStageUploaded?.stage.trim() === "reschedule" ||
                        res.lastStageUploaded?.stage.trim() ===
                            "1 hr update reschedule"
                    ) {
                        dataStage =
                            res.lastStageUploaded.last_uploaded_stage.trim();
                        if (dataStage === "follow up call") {
                            dataStage = "follow up call (optional)";
                        } else if (dataStage === "1 hr update") {
                            dataStage = "one hour update";
                        } else if (dataStage === "pre interview") {
                            console.log("asdasdsad asdadas");
                            dataStage = "pre-interview";
                        }
                    } else {
                        dataStage = res.lastStageUploaded?.stage.trim();
                    }

                    setCurrentData({
                        ...currentData,
                        tag: current_stage,
                        stage: dataStage,
                    });
                }
            }
        }
    );

    const [uploadMore, setUploadMore] = useState(false);

    //check if client has uploaded
    // const hasUploaded = (current_tag, stage, last_uploaded_stage) => {
    //   if (current_tag === last_uploaded_stage) {
    //     return true;
    //   }else if(current_tag){

    //   }
    // };

    // disable 1 hour button on timeline stage
    const disabledButton = (timeStart, timeEnd) => {
        let sTime = moment(timeStart, "HH:mm:ss");
        let eTime = moment(timeEnd, "HH:mm:ss");

        let duration = moment.duration(eTime.diff(sTime));
        if (appStage) {
            if (
                appStage === "timeline" ||
                appStage === "pre-publish" ||
                appStage === "one hour update" ||
                appStage === "pre-interview"
            ) {
                if (duration.hours() <= 1) {
                    return true;
                }
            } else {
                if (duration.hours() <= 1) {
                    return false;
                }
            }
        }
        return false;
    };

    const { mutate: addHistoryLog } = POST(
        "api/v1/historylogs/add",
        "add_history_logs"
    );

    const { mutate: mutateAddAppointments, isLoading: isLoading } = POST(
        "api/v1/appointment",
        ["appointment", "tag"]
    );

    const onFinishForm = () => {
        let timeslot =
            details[0].alter_date +
            "T" +
            moment(selectedTime.time_start, "HH:mm").format("HH:mm:ss");

        let timeZone_offset = tz_offset(timeslot);

        let data = {
            appointmentDate: details[0].date,
            // timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            timezone: "US/Mountain",
            timeslot: timeslot + "-06:00",
            slot_id: selectedTime.slot_id,
            calendarID: selectedTime.id,
        };

        console.log("onFinishForm", data);

        mutateAddAppointments(data, {
            onSuccess: (res) => {
                if (res.success) {
                    console.log("mutateAddAppointments", res.data);
                    notification.success({
                        message: "Success",
                        description: "Successfully booked",
                    });

                    addHistoryLog(
                        {
                            page: "user/book-appointment",
                            key: "appointment slot",
                            consultant: details[0].slots.user_id,
                            old_data: "",
                            new_data: timeslot,
                            method: "book-appointment",
                        },
                        { onSuccess: (res) => {} }
                    );

                    setToggleModal(false);
                    history.push("/appointment/myschedule");
                } else if (res.success == false) {
                    // notification.warning({
                    //   message: "Not allowed",
                    //   description: res.message,
                    // });
                    // setToggleModal(false);
                }
            },
            onError: (res) => {
                notification.warning({
                    message: "Booking failed",
                    description:
                        "Something went wrong while booking selected slot",
                });
            },
        });
    };

    let selectedTimeTemp;
    const [multifileList, setMultiFileList] = useState([]);

    const { mutate: mutateCreate, isLoading: isLoadingCreate } = POSTFILE(
        "api/v1/user/upload",
        ["getlastuploadedstage", "tag"]
    );

    const onFinishUpload = (values) => {
        const data = new FormData();

        multifileList.map((item, index) => {
            data.append("images_" + index, item.originFileObj, item.name);
        });
        data.append("images_count", multifileList ? multifileList.length : 0);
        data.append("images", multifileList);

        // data.append("current_task", JSON.stringify(currentTask));

        if (multifileList.length > 0) {
            if (appStage == "timeline" && multifileList.length <= 1) {
                notification.warning({
                    message: "Documents required!",
                    description:
                        "Please Upload Revised application and Timeline sheets",
                });
            } else {
                mutateCreate(data, {
                    onSuccess: (res) => {
                        if (res.success) {
                            notification.success({
                                message: "Success",
                                description: "Successfully created",
                            });
                            var filename = multifileList.map(
                                (item) => item.name
                            );
                            // console.log("filename", filename);
                            setUploadMore(false);
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

                            setMultiFileList([]);
                            form.resetFields();

                            // history.push(`/view/restaurants/edit/${table_id}`);
                        }
                    },
                    onError: (res) => {},
                });
            }
        } else {
            notification.warning({
                message: "Warning",
                description: "Please choose files to upload",
            });
        }
    };

    useEffect(() => {
        console.log("currentData", currentData);
    }, [currentData]);

    return (
        <Modal
            visible={toggleModal}
            title="APPOINTMENT"
            footer={
                <Button
                    onClick={() => {
                        if (selectedTime) {
                            onFinishForm();
                        } else {
                            notification.warning({
                                message: "Time slot required",
                                description: "Please select timelslot first!",
                            });
                        }
                    }}
                    type="primary"
                    size="large"
                    className="btn-primary btn-sign-in"
                    style={{ width: "100%", fontSize: "18px" }}
                    disabled={currentData.tag !== currentData.stage}
                >
                    BOOK APPOINTMENT
                </Button>
            }
            onCancel={() => {
                setToggleModal(false);
                setUploadMore(false);
            }}
            className="modal-primary-default modal-change-2-factor-authentication modal-appointment"
        >
            <>
                <div
                    className="event-title-container"
                    style={{ margin: "0px" }}
                >
                    <span
                        className="admin-calendar-status"
                        style={{ marginBottom: "2px" }}
                    >
                        <GoPrimitiveDot className="primitive-available" />
                    </span>
                    <span className="event-title">
                        <strong>{details[0] && details[0].title}</strong>
                    </span>
                </div>
                <div
                    className="event-schedule-container"
                    style={{ display: "flex", justifyContent: "center" }}
                >
                    <span className="event-date">
                        {details[0] && details[0].date}
                    </span>
                    <br />
                    {/* <span className="event-time">
            {appointmentDetails["time_start"]} {"-"}{" "}
            {appointmentDetails["end_start"]}
          </span> */}
                </div>
            </>

            <Divider />

            {currentData.tag !== currentData.stage || uploadMore ? (
                <>
                    <Typography.Text>
                        <span style={{ color: "red" }}>*</span>
                        Application Revision and/or Timeline pages must be
                        uploaded to enable call scheduling.
                    </Typography.Text>
                    <Form
                        layout="vertical"
                        form={form}
                        onFinish={onFinishUpload}
                    >
                        <Upload
                            className="venue-images"
                            listType="picture"
                            fileList={multifileList}
                            onChange={({ fileList: newFileList }) => {
                                var _file = newFileList;
                                // console.log(_file);
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
                                    message.error(
                                        "Image must smaller than 10MB!"
                                    );
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
                                        reader.readAsDataURL(
                                            file.originFileObj
                                        );
                                        reader.onload = () =>
                                            resolve(reader.result);
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
                                            style={{
                                                color: "#58595b",
                                                fontWeight: "normal",
                                            }}
                                        >
                                            2MB (Unlimited Number of Files)
                                        </span>
                                    </Typography.Text>
                                    <br />
                                    <Typography.Text>
                                        <strong>Types:</strong>{" "}
                                        <span
                                            style={{
                                                color: "#58595b",
                                                fontWeight: "normal",
                                            }}
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
                            className="btn-primary btn-submit-upload"
                            block
                            size="large"
                        >
                            SUBMIT
                        </Button>
                    </Form>
                </>
            ) : (
                <>
                    <Result
                        status="success"
                        title="Thanks for uploading!"
                        subTitle="You can book for an appointment now"
                    />
                    {
                        <center>
                            <Button
                                type="link"
                                onClick={() => setUploadMore(true)}
                            >
                                Upload More
                            </Button>
                        </center>
                    }
                </>
            )}

            <Divider />
            <Typography.Text>Slots Available:</Typography.Text>

            <Row gutter={8}>
                {details[0] &&
                    appointmentSlots.length > 0 &&
                    appointmentSlots.map((item, index) => {
                        let dateTimeNow = new Date(
                            moment().tz("MST").format("Y-MM-DD HH:mm")
                        );
                        let dateTimeSchedule = new Date(
                            moment(
                                details[0].alter_date + " " + item.time_start
                            )._i
                        );

                        // console.log("item", item);

                        return (
                            <Col
                                md={24}
                                xs={24}
                                className="m-t-xs"
                                key={`${index}`}
                            >
                                <Button
                                    onClick={() => {
                                        setSelectedTime(item);
                                        let _appointmentSlots = [
                                            ...appointmentSlots,
                                        ];
                                        _appointmentSlots.forEach(
                                            (_appointmentSlot) => {
                                                if (
                                                    _appointmentSlot.slot_id ==
                                                    item.slot_id
                                                ) {
                                                    _appointmentSlot.selected = true;
                                                } else {
                                                    _appointmentSlot.selected = false;
                                                }
                                            }
                                        );
                                        setAppointmentSlots(_appointmentSlots);
                                    }}
                                    style={{ width: "100%" }}
                                    className={
                                        item.selected && "active-slot-btn"
                                    }
                                    disabled={
                                        moment(dateTimeNow.getTime()).add(
                                            24,
                                            "hours"
                                        ) >= dateTimeSchedule.getTime() ||
                                        disabledButton(
                                            item.time_start,
                                            item.time_end
                                        ) === true
                                    }
                                >
                                    {moment(item.time_start, "HH:mm").format(
                                        "h:mm A"
                                    ) +
                                        " - " +
                                        moment(item.time_end, "HH:mm").format(
                                            "h:mm A"
                                        )}
                                </Button>
                            </Col>
                        );
                    })}
            </Row>
        </Modal>
    );
}
