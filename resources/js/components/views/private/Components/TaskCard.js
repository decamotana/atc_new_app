import React from "react";
import {
    faCalendar,
    faShoppingCart,
    faUpload,
    faFileArrowUp,
    faPen,
} from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Button, Card, Collapse, Typography } from "antd";

export default function TaskCards(props) {
    const {
        item,
        onClickFunction,
        showButton,
        key,
        isDisabled = false,
    } = props;

    const getClass = (item) => {
        if (item.isActive && !item.isCompleted) {
            return "btn-taskcard-progress";
        } else if (item.isCompleted && item.isActive) {
            return "btn-taskcard-completed";
        } else {
            return "btn-taskcard-upcoming";
        }
    };

    return (
        <Collapse
            bordered
            key={item}
            className={"border-none unique-collapse"}
            defaultActiveKey={[Number(item.id), toString()]}
            expandIconPosition="start"
        >
            <Collapse.Panel
                key={(Number(item.id), toString())}
                collapsible={!item.isActive ? "disabled" : "header"}
                showArrow={false}
                header={
                    <div className="task-flex">
                        <Typography.Text
                            className="task-collapse-title"
                            ellipsis={{ rows: 2 }}
                        >
                            {item.title}
                        </Typography.Text>
                        {/* {item.isActive && (
              <div
                className="task-card-title"
                style={{
                  padding: " 5px",
                  maxHeight: "40px",

                  background: item.isCompleted ? "#43a429" : "#ff2020",
                }}
              >
                {item.isCompleted ? "Completed" : "Pending"}
              </div>
            )} */}
                    </div>
                }
                // className={item.isActive && !item.isCompleted ? "accordion border white collapse-content-pending" : item.isCompleted && item.isActive ? "accordion border white collapse-content-complete" : "accordion border collapse-content-inactive"}
            >
                <div
                    className="card-btn-cont"
                    style={{
                        display: "flex",
                        flexFlow: "column",
                        justifyContent: "space-between",
                        minHeight: "200px",
                        alignContent: "space-around",
                        flexWrap: "wrap !important",
                    }}
                >
                    <div>
                        <Card
                            bordered={false}
                            style={{ minHeight: "100px" }}
                            className="task-card-content"
                        >
                            {/* <Typography.Text>{item.description}</Typography.Text> */}
                            <div
                                className="task-description"
                                style={{ overflowWrap: "anywhere" }}
                                dangerouslySetInnerHTML={{
                                    __html:
                                        item.description.length > 70
                                            ? item.isActive
                                                ? item.description
                                                : item.description.substring(
                                                      0,
                                                      70
                                                  ) + "..."
                                            : item.description,
                                }}
                            />
                            <br></br>
                        </Card>
                    </div>
                    {item.hasLink && (
                        <div
                            style={{
                                width: "100%",
                                display: "flex",
                                justifyContent: "left",
                                // background: "#f0f3f2",
                                padding: "5px",
                            }}
                        >
                            {/* {isDisabled} */}
                            <Button
                                type="text"
                                // disabled={
                                //   (!item.isActive && !item.isCompleted) ||
                                //   item.isCompleted ||
                                //   showButton
                                // }
                                disabled={isDisabled}
                                icon={
                                    item && item.title.includes("Book") ? (
                                        <FontAwesomeIcon
                                            style={{ fontSize: "20px" }}
                                            icon={faCalendar}
                                        />
                                    ) : item &&
                                      item.title.includes("Upload") ? (
                                        <FontAwesomeIcon
                                            style={{ fontSize: "20px" }}
                                            icon={faFileArrowUp}
                                        />
                                    ) : item &&
                                      item.title.includes("Product") ? (
                                        <FontAwesomeIcon
                                            style={{ fontSize: "20px" }}
                                            icon={faShoppingCart}
                                        />
                                    ) : item && item.title.includes("MNDA") ? (
                                        <FontAwesomeIcon
                                            style={{ fontSize: "20px" }}
                                            icon={faPen}
                                        />
                                    ) : (
                                        ""
                                    )
                                }
                                onClick={() => {
                                    let url = item.link.split('"');

                                    if (
                                        item.title.includes("Book") ||
                                        item.title.includes("Upload") ||
                                        item.title.includes("MNDA")
                                    ) {
                                        window.location.replace(url[1]);
                                    } else if (item.title.includes("Product")) {
                                        window.open(url[1]);
                                    }
                                }}
                                className={"btn-task-card " + getClass(item)}
                                style={{
                                    height: "40px",
                                    width: "150px",
                                    fontSize: "16px",
                                    textAlign: "left",
                                    gap: "10px",
                                }}
                            >
                                {item.title.includes("Book")
                                    ? "Book"
                                    : item.title.includes("Upload")
                                    ? "Upload"
                                    : item.title.includes("Product")
                                    ? "Purchase"
                                    : item.title.includes("MNDA")
                                    ? "Sign MNDA"
                                    : ""}
                            </Button>
                        </div>
                    )}
                </div>
            </Collapse.Panel>
        </Collapse>
    );
}
