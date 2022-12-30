import { useEffect, useState } from "react";
import { CaretDownOutlined } from "@ant-design/icons";
import { Button, Input, Pagination, Select, Typography } from "antd";
import $ from "jquery";
import optionAlphabet from "../../../providers/optionAlphabet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/pro-light-svg-icons";

export function TablePagination(props) {
	const {
		showLessItems,
		showSizeChanger,
		tableFilter,
		setTableFilter,
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
				current={tableFilter.page}
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
				pageSize={tableFilter.page_size}
				onChange={(page, pageSize) =>
					setTableFilter({
						...tableFilter,
						page,
						page_size: pageSize,
					})
				}
				itemRender={(current, type, originalElement) => {
					if (type === "prev") {
						return <Button>Previous</Button>;
					}
					if (type === "next") {
						return <Button>Next</Button>;
					}
					return originalElement;
				}}
			/>
		</>
	);
}

export function TableShowingEntries() {
	return (
		<Typography.Text>
			Showing <span className="span_page_from"></span> to{" "}
			<span className="span_page_to"></span> of{" "}
			<span className="span_page_total"></span> entries
		</Typography.Text>
	);
}

export function TablePageSize(props) {
	const { tableFilter, setTableFilter, className, option } = props;

	return (
		<>
			<Select
				value={tableFilter.page_size}
				onChange={(e) => setTableFilter({ ...tableFilter, page_size: e })}
				className={className ?? "ant-select-table-pagesize"}
				suffixIcon={<CaretDownOutlined />}
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
	const { tableFilter, setTableFilter, placeholder, size, className } = props;

	const [searchTextTimeout, setSearchTextTimeout] = useState(0);

	return (
		<Input.Search
			placeholder={placeholder ?? "Search..."}
			size={size ?? "large"}
			className={className ?? "ant-input-padding-inherit"}
			onChange={(e) => {
				if (searchTextTimeout) clearTimeout(searchTextTimeout);
				clearTimeout(searchTextTimeout);
				let timeoutTemp = setTimeout(() => {
					setTableFilter({
						...tableFilter,
						search: e.target.value,
						page: 1,
					});
				}, 1000);
				setSearchTextTimeout(timeoutTemp);
			}}
		/>
	);
}

export function TableGlobalInputSearch(props) {
	const { tableFilter, setTableFilter, placeholder, size, className } = props;

	const [searchTextTimeout, setSearchTextTimeout] = useState(0);

	return (
		<Input
			prefix={<FontAwesomeIcon icon={faSearch} />}
			placeholder={placeholder ?? "Search..."}
			size={size ?? "large"}
			className={className ?? "ant-input-padding-inherit ant-input-search-2"}
			onChange={(e) => {
				if (searchTextTimeout) clearTimeout(searchTextTimeout);
				clearTimeout(searchTextTimeout);
				let timeoutTemp = setTimeout(() => {
					setTableFilter({
						...tableFilter,
						search: e.target.value,
						page: 1,
					});
				}, 1000);
				setSearchTextTimeout(timeoutTemp);
			}}
		/>
	);
}

export function TableGlobalAlphaSearch(props) {
	const { tableFilter, setTableFilter, size, className } = props;
	const [active, setActive] = useState("");

	return (
		<div className={"flex table-filter-alphabet " + (className ?? "")}>
			{optionAlphabet.map((item, index) => (
				<Button
					key={index}
					type="link"
					size={size ?? "large"}
					onClick={() => {
						setTableFilter({ ...tableFilter, letter: item, page: 1 });
						setActive(item);
					}}
					className={`btn-${item.toLowerCase()} ${
						active === item ? "btn-main-2-active white" : ""
					}`}
				>
					{item}
				</Button>
			))}
		</div>
	);
}
