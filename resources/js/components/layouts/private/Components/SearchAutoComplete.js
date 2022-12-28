import React, { useState, useEffect } from "react";
import { Row, Col, AutoComplete, Tag } from "antd";

import useAxiosQuery from "../../../../providers/useAxiosQuery";
import getUserData from "../../../../providers/getUserData";

const SearchAutoComplete = () => {
    const userdata = getUserData();
    const { Option } = AutoComplete;

    const [options, setOptions] = useState([]);
    const [search, setSearch] = useState("");
    const handleSearch = value => {
        if (value) {
            setSearch(value);
        } else {
            setSearch(" ");
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            if (search) {
                refetchSearch();
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    const {
        data: dataSearch,
        isLoading: isLoadingSearch,
        refetch: refetchSearch
    } = useAxiosQuery(
        `GET_MANUAL`,
        `api/v1/search?search=${encodeURIComponent(search)}`,
        `global_search_autocomplte`,
        res => {
            if (res.success) {
                // console.log("globalsearchautocomplete", res);
            }
        }
    );


    const onSelect = value => {
        // history.push(value)
        // window.location.href = value;
        window.open(value, "_blank")
        setSearch('')
        // $('.ant-select-selection-search-input').value('')

    };

    function textHighlight(text, searchText) {
        let str = text;

        str = "<div>" + str + "</div>";
        let _image = $(str).find("img");
        if (_image.length > 0) {
            str = $(str);
            str = str.find("img").remove();
            str = str.html();
        }

        let a = searchText;
        var re = new RegExp(Exqoute(a), "i");
        let ht = str.match(re);
        let n = str
            .split(re)
            .join('<span className="textHighlight">' + ht + "</span>");

        return n;
    }

    function Exqoute(str) {
        return str.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
    }

    return (
        <AutoComplete
            dropdownClassName="certain-category-search-dropdown"
            dropdownMatchSelectWidth={500}
            style={{ width: "100%", left: "20px" }}
            onChange={handleSearch}
            onSelect={onSelect}
            placeholder="Search"
            className="autocomplete_elastic"
            allowClear={true}
            value={search}
        >
            {dataSearch &&
                dataSearch.data.map((row, item) => {
                    let color = "#1890ff";
                    if (
                        row.model == "Clearent Merchant" ||
                        row.model == "Paysafe" ||
                        row.model == "Gift Card" ||
                        row.model == "Clearent Boarding"
                    ) {
                        color = "#1890ff";
                    }

                    if (row.model == "Form") {
                        color = "#ffc53d";
                    }

                    if (
                        row.model == "Ticket" ||
                        row.model == "Form Data" ||
                        row.model == "Gift Card Account" ||
                        row.model == "Gift Card Account Terminal" ||
                        row.model == "Ticket Response"
                    ) {
                        color = "#95de64";
                    }

                    if (
                        row.model == "Profile" ||
                        row.model == "Profile Extension"
                    ) {
                        color = "#722ed1";
                    }
                    let all_text = `${row.model} ${row.title} ${row.sub_content} ${row.content}`;

                    if (
                        textHighlight(all_text, search).indexOf(
                            "textHighlight"
                        ) !== -1
                    ) {
                        return (
                            <Option key={item} value={row.url}>
                                <Row gutter={24}>
                                    <Col span={12}>
                                        <Tag color={color}>
                                            <span
                                                dangerouslySetInnerHTML={{
                                                    __html: textHighlight(
                                                        row.model,
                                                        search
                                                    )
                                                }}
                                            ></span>
                                        </Tag>

                                        <span
                                            style={{ fontSize: "10px" }}
                                            dangerouslySetInnerHTML={{
                                                __html: textHighlight(
                                                    row.sub_content,
                                                    search
                                                )
                                            }}
                                        ></span>
                                    </Col>
                                    <Col span={12} className="text-right">
                                        <span
                                            style={{
                                                fontSize: "15px",
                                                fontWeight: "700"
                                            }}
                                            dangerouslySetInnerHTML={{
                                                __html: textHighlight(
                                                    row.title,
                                                    search
                                                )
                                            }}
                                        ></span>

                                        <span
                                            style={{ fontSize: "10px" }}
                                            dangerouslySetInnerHTML={{
                                                __html: textHighlight(
                                                    row.content,
                                                    search
                                                )
                                            }}
                                        ></span>
                                    </Col>
                                </Row>
                            </Option>
                        );
                    }
                })}
        </AutoComplete>
    );
};

export default SearchAutoComplete;
