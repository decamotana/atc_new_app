import { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { Button, Col, Modal, Row, Table, Tooltip, Typography } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faArrowLeft,
	faArrowRight,
	faForward,
	faDial,
	faCheckCircle,
	faTimes,
} from "@fortawesome/pro-solid-svg-icons";

export default function DashboardModulesModal(props) {
	const { toggleModalModule, setToggleModalModule, moduleFilter } = props;
	// console.log("props", props);
	const history = useHistory();
	let maxContentCarousel =
		toggleModalModule &&
		toggleModalModule.data &&
		toggleModalModule.data.filter(
			(itemFiltered) => itemFiltered.status !== "Up Next"
		).length;
	const [carouselCurrent, setCarouselCurrent] = useState(0);

	useEffect(() => {
		// console.log("toggleModalModule", toggleModalModule);
		if (toggleModalModule.data) {
			setCarouselCurrent(toggleModalModule.index);
		}

		return () => {};
	}, [toggleModalModule]);

	const handleClickPrev = () => {
		if (carouselCurrent !== 0) {
			setCarouselCurrent(carouselCurrent - 1);
		}
	};
	const handleClickNext = () => {
		if (carouselCurrent !== maxContentCarousel - 1) {
			setCarouselCurrent(carouselCurrent + 1);
		}
	};

	return (
		<Modal
			closeIcon={<FontAwesomeIcon icon={faTimes} />}
			open={toggleModalModule.show}
			footer={null}
			onCancel={() =>
				setToggleModalModule({ show: false, data: null, index: 0 })
			}
			style={{ padding: "20px 10px" }}
			className="dashboard-caregiver-modal-module"
			wrapClassName="dashboard-caregiver-modal-module-wrap"
		>
			<div className="carousel-control">
				<div className="prev">
					<Button
						type="link"
						className={carouselCurrent === 0 ? "disabled" : ""}
						onClick={handleClickPrev}
					>
						<FontAwesomeIcon icon={faArrowLeft} className="m-r-xs" />{" "}
						<span className="prev-text">PREVIOUS</span>
					</Button>
				</div>
				<div className="next">
					<Button
						type="link"
						className={
							toggleModalModule.data && toggleModalModule.data.length > 1
								? carouselCurrent === maxContentCarousel - 1
									? "disabled"
									: ""
								: "disabled"
						}
						onClick={handleClickNext}
					>
						<span className="next-text">NEXT</span>{" "}
						<FontAwesomeIcon icon={faArrowRight} className="m-l-xs" />
					</Button>
				</div>
			</div>
			{toggleModalModule &&
				toggleModalModule.data &&
				toggleModalModule.data.map((item, index) => {
					if (carouselCurrent === index) {
						return (
							<div key={index}>
								<Row>
									<Col xs={24} sm={24} md={24}>
										<div className="text-center">
											<Typography.Title
												level={4}
												className="line-height-1 color-6 m-n"
											>
												{item.module_number}
											</Typography.Title>
											<Typography.Title
												level={5}
												className="color-1 line-height-1 m-n"
											>
												{item.module_name}
											</Typography.Title>
											<Typography.Text>
												Select any lesson to re-review or to continue
											</Typography.Text>
										</div>
									</Col>

									<Col xs={24} sm={24} md={24} className="m-t-sm">
										<Table
											className="ant-table-default ant-table-striped"
											dataSource={item.lessons && item.lessons}
											rowKey={(record) => record.id}
											pagination={false}
											bordered={false}
											// rowSelection={{
											//   type: selectionType,
											//   ...rowSelection,
											// }}
											scroll={{ x: "max-content" }}
										>
											<Table.Column
												title="Lesson #"
												key="lesson_number"
												dataIndex="lesson_number"
												render={(_, record) => {
													let link = "";
													if (record.status === "Completed") {
														if (!moduleFilter.is_subscriber_module) {
															link = (
																<Link
																	to={{
																		pathname: "/training-modules/view",
																		state: record.id,
																	}}
																	className="color-5"
																>
																	{record.lesson_number}
																</Link>
															);
														} else {
															link = (
																<Typography.Link className="color-5">
																	{record.lesson_number}
																</Typography.Link>
															);
														}
													} else if (record.status === "In Progress") {
														if (!moduleFilter.is_subscriber_module) {
															link = (
																<Link
																	to={{
																		pathname: "/training-modules/view",
																		state: record.id,
																	}}
																	className="color-1"
																>
																	{record.lesson_number}
																</Link>
															);
														} else {
															link = (
																<Typography.Link className="color-1">
																	{record.lesson_number}
																</Typography.Link>
															);
														}
													} else if (record.status === "Up Next") {
														link = (
															<span className="color-9">
																{record.lesson_number}
															</span>
														);
													}
													return link;
												}}
											/>
											<Table.Column
												title="Title"
												key="lesson_name"
												dataIndex="lesson_name"
												width={400}
												render={(_, record) => {
													let link = "";
													if (record.status === "Completed") {
														if (!moduleFilter.is_subscriber_module) {
															link = (
																<Link
																	to={{
																		pathname: "/training-modules/view",
																		state: record.id,
																	}}
																	className="color-5"
																>
																	{record.lesson_name}
																</Link>
															);
														} else {
															link = (
																<Typography.Link className="color-5">
																	{record.lesson_name}
																</Typography.Link>
															);
														}
													} else if (record.status === "In Progress") {
														if (!moduleFilter.is_subscriber_module) {
															link = (
																<Link
																	to={{
																		pathname: "/training-modules/view",
																		state: record.id,
																	}}
																	className="color-1"
																>
																	{record.lesson_name}
																</Link>
															);
														} else {
															link = (
																<Typography.Link className="color-1">
																	{record.lesson_name}
																</Typography.Link>
															);
														}
													} else if (record.status === "Up Next") {
														link = (
															<span className="color-9">
																{record.lesson_name}
															</span>
														);
													}
													return link;
												}}
											/>
											<Table.Column
												title="Status"
												key="action"
												align="center"
												render={(_, record) => {
													let color = "";
													let icon = faCheckCircle;
													if (record.status === "Completed") {
														color = "color-5";
														icon = faCheckCircle;
													} else if (record.status === "In Progress") {
														color = "color-1";
														icon = faDial;
													} else if (record.status === "Up Next") {
														color = "color-9";
														icon = faForward;
													}
													return (
														<Tooltip placement="top" title={record.status}>
															<Button
																type="link"
																className={color}
																onClick={() => {
																	if (record.status !== "Up Next") {
																		if (!moduleFilter.is_subscriber_module) {
																			history.push({
																				pathname: "/training-modules/view",
																				state: record.id,
																			});
																		}
																	}
																}}
															>
																<FontAwesomeIcon icon={icon} />
															</Button>
														</Tooltip>
													);
												}}
											/>
										</Table>
									</Col>
								</Row>
							</div>
						);
					} else {
						return "";
					}
				})}
		</Modal>
	);
}
