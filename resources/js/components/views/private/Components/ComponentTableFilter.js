import React, { useEffect, useState } from "react";
import { CaretDownOutlined } from "@ant-design/icons";
import { Button, Input, Pagination, Select, Typography } from "antd";
import $ from "jquery";
import optionAlphabet from "../../../providers/optionAlphabet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faChevronLeft,
    faChevronRight,
} from "@fortawesome/pro-regular-svg-icons";

export function TablePagination(props) {
    const {
        showLessItems,
        showSizeChanger,
        paginationFilter,
        setPaginationFilter,
        setPaginationTotal,
        parentClass = "",
    } = props;

    const [paginationSize, setPaginationSize] = useState("default");

    useEffect(() => {
        $(window).resize(() => {
            if ($(".layout-main").width() <= 768) {
                setPaginationSize("small");
            } else {
                setPaginationSize("default");
            }
        });
    }, []);

    return (
        <>
            <Pagination
                current={paginationFilter.page}
                total={setPaginationTotal}
                size={paginationSize}
                showLessItems={showLessItems ?? false}
                showSizeChanger={showSizeChanger ?? true}
                showTotal={(total, range) => {
                    if (parentClass) {
                        $(`.${parentClass} .span_page_from`).html(range[0]);
                        $(`.${parentClass} .span_page_to`).html(range[1]);
                        $(`.${parentClass} .span_page_total`).html(total);
                    } else {
                        $(".span_page_from").html(range[0]);
                        $(".span_page_to").html(range[1]);
                        $(".span_page_total").html(total);
                    }
                }}
                pageSize={paginationFilter.page_size}
                onChange={(page, pageSize) =>
                    setPaginationFilter({
                        ...paginationFilter,
                        page,
                        page_size: pageSize,
                    })
                }
                itemRender={(current, type, originalElement) => {
                    if (type === "prev") {
                        // return <FontAwesomeIcon icon={faChevronLeft} />
                        return "Previous";
                    }
                    if (type === "next") {
                        // return <FontAwesomeIcon icon={faChevronRight} />
                        return "Next";
                    }
                    return originalElement;
                }}
            />
        </>
    );
}

export function TableShowingEntries() {
    return (
        <Typography.Text className="m-b-sm">
            <span>Showing </span>
            <span className="span_page_to"></span> of{" "}
            <span className="span_page_total"></span> entries
        </Typography.Text>
    );
}

export function TablePageSize(props) {
    const { paginationFilter, setPaginationFilter, className, option } = props;

    return (
        <>
            <Select
                value={paginationFilter.page_size}
                onChange={(e) =>
                    setPaginationFilter({ ...paginationFilter, page_size: e })
                }
                className={className ?? "ant-select-table-pagesize"}
                suffixIcon={<CaretDownOutlined />}
                size="large"
            >
                {option && option.length > 0 ? (
                    option.map((item, index) => {
                        return (
                            <Select.Option value={item} key={index}>
                                {item}
                            </Select.Option>
                        );
                    })
                ) : (
                    <>
                        <Select.Option value={10}>10</Select.Option>
                        <Select.Option value={25}>25</Select.Option>
                        <Select.Option value={50}>50</Select.Option>
                        <Select.Option value={75}>75</Select.Option>
                        <Select.Option value={100}>100</Select.Option>
                    </>
                )}
            </Select>
            <Typography.Text> / Page</Typography.Text>
        </>
    );
}

export function TableGlobalSearch(props) {
    const {
        paginationFilter,
        setPaginationFilter,
        placeholder,
        size,
        className,
    } = props;

    return (
        <Input.Search
            placeholder={placeholder ?? "Search..."}
            size={size ?? "large"}
            className={className ?? "ant-input-padding-inherit"}
            onChange={(e) => {
                if (setPaginationFilter) {
                    setPaginationFilter(e.target.value);
                }
            }}
            onPressEnter={(e) =>
                setPaginationFilter({
                    ...paginationFilter,
                    search: e.target.value,
                    page_number: 1,
                })
            }
        />
    );
}

export function TableGlobalAlphaSearch(props) {
    const { paginationFilter, setPaginationFilter, size, className } = props;

    return (
        <div className={"flex table-filter-alphabet " + (className ?? "")}>
            {optionAlphabet.map((item, index) => (
                <Button
                    key={index}
                    type="link"
                    size={size ?? "large"}
                    onClick={() =>
                        setPaginationFilter({
                            ...paginationFilter,
                            letter: item,
                        })
                    }
                >
                    {item}
                </Button>
            ))}
        </div>
    );
}
