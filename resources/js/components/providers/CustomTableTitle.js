import React from "react";
import { CaretDownOutlined, CaretUpOutlined } from "@ant-design/icons";
import ResizeObserver from "react-resize-observer";
const CustomTableTitle = ({
    title,
    dataIndex,
    dataTableInfo,
    setDataTableInfo,
    localStorageKey,
    localStorageTableCols
}) => {
    let table_cols = 0;

    return (
        <div>
            {title}{" "}
            <ResizeObserver
                onResize={rect => {
                    // console.log(rect);
                    if (table_cols > localStorageTableCols) {
                        if (localStorage.getItem(localStorageKey)) {
                            localStorage.setItem(
                                localStorageKey,
                                JSON.stringify({
                                    ...JSON.parse(
                                        localStorage.getItem(localStorageKey)
                                    ),
                                    [title]: rect.width + 32
                                })
                            );
                        } else {
                            localStorage.setItem(
                                localStorageKey,
                                JSON.stringify({
                                    [title]: rect.width + 32
                                })
                            );
                        }
                    }

                    table_cols++;
                }}
                onPosition={rect => {
                    // console.log(
                    //     "Moved. New position:",
                    //     rect.left,
                    //     "x",
                    //     rect.top
                    // );
                }}
            />
            <span
                style={{
                    display: "inline-flex",
                    flexDirection: "column",
                    alignItems: "center",
                    float: "right"
                }}
                onClick={e => {
                    if (dataTableInfo.column == dataIndex) {
                        setDataTableInfo({
                            ...dataTableInfo,
                            column: dataIndex,
                            order:
                                dataTableInfo.order == "asc"
                                    ? "desc"
                                    : dataTableInfo.order == "desc"
                                    ? null
                                    : "asc"
                        });
                    } else {
                        setDataTableInfo({
                            ...dataTableInfo,
                            column: dataIndex,
                            order: "asc"
                        });
                    }
                }}
            >
                <CaretUpOutlined
                    style={{
                        fontSize: 11,
                        height: 8,
                        color: "#bfbfbf"
                    }}
                    className={
                        dataTableInfo.column == dataIndex &&
                        dataTableInfo.order == "asc"
                            ? "active"
                            : ""
                    }
                />
                <CaretDownOutlined
                    style={{
                        fontSize: 11,
                        height: 8,
                        color: "#bfbfbf"
                    }}
                    className={
                        dataTableInfo.column == dataIndex &&
                        dataTableInfo.order == "desc"
                            ? "active"
                            : ""
                    }
                />
            </span>
        </div>
    );
};

export default CustomTableTitle;
