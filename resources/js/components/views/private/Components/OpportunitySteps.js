import React, { useEffect, useState } from "react";
import { Button, Steps, Row, Col, Space } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faChevronLeft,
    faChevronRight,
} from "@fortawesome/pro-regular-svg-icons";

export function OpportunitySteps(props) {
    const {
        stage,
        count,
        addOn,
        current,
        limit,
        stageName,
        setCurrent,
        onChange,
        setAddOn,
    } = props;

    const { Step } = Steps;

    const onRightBtnPressed = () => {
        let index = stage.findIndex((s) => {
            return s.status === "process";
        });

        setCurrent(index);

        if (addOn !== limit && count + addOn < limit && current !== -1) {
            setAddOn(addOn + 1);
        }

        // setCurrent(addOn + 1)
    };

    const onLeftBtnPressed = () => {
        if (addOn !== 0) setAddOn(addOn - 1);
    };

    return (
        <>
            <Row>
                <Col
                    xs={24}
                    sm={24}
                    md={24}
                    lg={24}
                    xl={24}
                    xxl={24}
                    className="step-main-cont"
                >
                    {/* <Row>
            <Col
              xs={24}
              sm={24}
              md={24}
              style={{ display: "flex", justifyContent: "center" }}
            > */}
                    <Space
                        direction="horizontal"
                        className="row-steps-cont"
                        align="center"
                    >
                        <Button
                            type="primary"
                            className="dash-btn-arrow"
                            onClick={onLeftBtnPressed}
                            icon={
                                <FontAwesomeIcon
                                    className="dash-btn-arrow-icon"
                                    icon={faChevronLeft}
                                />
                            }
                            size="large"
                        />

                        <div
                            style={{
                                paddingTop: "10px",
                                width: "100%",
                                // display: "flex !important",
                                // justifyContent: "spa",
                            }}
                            className="steps-cont"
                        >
                            <Steps
                                size="small"
                                current={current}
                                onChange={onChange}
                                className="site-navigation-steps atc-dashboard-steps"
                            >
                                <>
                                    {(() => {
                                        const arr = [];
                                        for (
                                            let i = 0 + addOn;
                                            i < count + addOn;
                                            i++
                                        ) {
                                            console.log(stage[i]?.status);
                                            arr.push(
                                                <Step
                                                    disabled={
                                                        stage.length > 0
                                                            ? stage[i]
                                                                  ?.status ===
                                                              "wait"
                                                                ? true
                                                                : false
                                                            : i === 0
                                                            ? false
                                                            : true
                                                    }
                                                    key={i}
                                                    title={"Step " + (i + 1)}
                                                    icon={
                                                        stage.length > 0 &&
                                                        stage[i]?.status !==
                                                            "finish" ? (
                                                            <div className="circle-span">
                                                                <span>
                                                                    {i + 1}
                                                                </span>
                                                            </div>
                                                        ) : (
                                                            <div
                                                                className={
                                                                    "circle-span circle-span-finished"
                                                                }
                                                            >
                                                                <span>
                                                                    {i + 1}
                                                                </span>
                                                            </div>
                                                        )
                                                    }
                                                    status={
                                                        stage.length > 0 &&
                                                        stage[i]?.status
                                                    }
                                                    description={
                                                        stageName[i] &&
                                                        stageName[i]
                                                    }
                                                />
                                            );
                                        }
                                        // console.log("stagestagestage", stage);
                                        return arr;
                                    })()}
                                </>
                            </Steps>
                        </div>

                        <Button
                            type="primary"
                            className="dash-btn-arrow"
                            onClick={onRightBtnPressed}
                            icon={
                                <FontAwesomeIcon
                                    className="dash-btn-arrow-icon"
                                    icon={faChevronRight}
                                />
                            }
                            size="large"
                        />
                    </Space>
                    {/* </Col>
          </Row> */}
                </Col>
            </Row>
        </>
    );
}

export function OpportunitySubSteps(props) {
    const { current, dataOpportunity, windowSize } = props;
    const { Step } = Steps;

    const [classname, setClassName] = useState({
        step1: "",
        step2: "",
        step3: "",
        step4: "",
        step5: "",
        step6: "",
        step7: "",
    });

    useEffect(() => {
        // console.log("asdasdasd", windowSize.innerWidth);

        if (windowSize.innerWidth < 1117) {
            switch (current) {
                case 1 | 2 | 3:
                    setClassName({
                        step5: "steps-substage-hide",
                        step6: "steps-substage-hide",
                        step7: "steps-substage-hide",
                    });

                    break;

                case 4 | 5 | 6 | 7:
                    setClassName({
                        step1: "steps-substage-hide",
                        step2: "steps-substage-hide",
                        step3: "steps-substage-hide",
                        step4: "",
                        step5: "",
                        step6: "",
                        step7: "",
                    });

                default:
                    break;
            }
        } else {
            setClassName({
                step1: "",
                step2: "",
                step3: "",
                step4: "",
                step5: "",
                step6: "",
                step7: "",
            });
        }
    }, [windowSize.innerWidth]);

    return (
        <>
            <Row className="m-t-xs apt-steps-cont">
                <Col
                    xs={24}
                    sm={24}
                    md={24}
                    lg={24}
                    xl={24}
                    xxl={24}
                    className="appointmentStages"
                >
                    <Steps size="small" className="steps-substage">
                        <Step
                            className={
                                (windowSize.innerWidth >= 768 &&
                                    "new-substeps-small ") +
                                " " +
                                classname.step1
                            }
                            title="First Call"
                            status={
                                dataOpportunity &&
                                dataOpportunity.data !== "nodata" &&
                                dataOpportunity?.pipeline_stages_appointment?.find(
                                    (p) => p.name === "Call 1"
                                ).status
                            }
                        ></Step>
                        <Step
                            className={
                                (windowSize.innerWidth >= 768 &&
                                    "new-substeps-small ") +
                                " " +
                                classname.step2
                            }
                            title="Second Call"
                            status={
                                dataOpportunity &&
                                dataOpportunity.data !== "nodata" &&
                                dataOpportunity.pipeline_stages_appointment.find(
                                    (p) => p.name === "Call 2"
                                ).status
                            }
                        ></Step>
                        <Step
                            className={
                                (windowSize.innerWidth >= 768 &&
                                    "new-substeps-small ") +
                                " " +
                                classname.step3
                            }
                            title="Follow-Up Call"
                            status={
                                dataOpportunity &&
                                dataOpportunity.data !== "nodata" &&
                                dataOpportunity.pipeline_stages_appointment.find(
                                    (p) =>
                                        p.name === "Follow Up Call (Optional)"
                                ).status
                            }
                        ></Step>
                        <Step
                            className={
                                windowSize.innerWidth >= 768 &&
                                "new-substeps-small " + " " + classname.step4
                            }
                            title="Timeline Call"
                            status={
                                dataOpportunity &&
                                dataOpportunity.data !== "nodata" &&
                                dataOpportunity.pipeline_stages_appointment.find(
                                    (p) => p.name === "Timeline"
                                ).status
                            }
                        ></Step>
                        <Step
                            className={
                                (windowSize.innerWidth >= 768 &&
                                    "new-substeps-small ") +
                                " " +
                                classname.step5
                            }
                            title="Pre-Publish Call"
                            status={
                                dataOpportunity &&
                                dataOpportunity.data !== "nodata" &&
                                dataOpportunity.pipeline_stages_appointment.find(
                                    (p) => p.name === "Pre-Publish"
                                ).status
                            }
                        ></Step>
                        <Step
                            className={
                                (windowSize.innerWidth >= 768 &&
                                    "new-substeps-small ") +
                                " " +
                                classname.step6
                            }
                            title="One Hour Update"
                            status={
                                dataOpportunity &&
                                dataOpportunity.data !== "nodata" &&
                                dataOpportunity.pipeline_stages_appointment.find(
                                    (p) => p.name === "One Hour Update"
                                ).status
                            }
                        ></Step>
                        <Step
                            className={
                                (windowSize.innerWidth >= 768 &&
                                    "new-substeps-small ") +
                                " " +
                                classname.step7
                            }
                            title="Pre-Interview"
                            status={
                                dataOpportunity &&
                                dataOpportunity.data !== "nodata" &&
                                dataOpportunity.pipeline_stages_appointment.find(
                                    (p) => p.name === "Pre-Interview"
                                ).status
                            }
                        ></Step>
                    </Steps>
                </Col>
            </Row>
        </>
    );
}
