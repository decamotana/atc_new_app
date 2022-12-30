import { useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { Button, Carousel, Col, Modal, Row, Table, Typography } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faArrowLeft,
	faArrowRight,
	faCheckCircle,
	faDial,
	faForward,
	faTimes,
} from "@fortawesome/pro-solid-svg-icons";

export default function ModalModule(props) {
	const { toggleModalModule, setToggleModalModule } = props;
	const history = useHistory();
	const refCarousel = useRef();
	let maxContentCarousel = 3;
	const [carouselCurrent, setCarouselCurrent] = useState(1);

	const onAfterChangeCarousel = (currentSlide) => {
		console.log(currentSlide);
		setCarouselCurrent(currentSlide);
	};

	const handleClickPrev = () => {
		if (carouselCurrent !== 0) {
			refCarousel.current.goTo(carouselCurrent - 1, false);
		}
	};
	const handleClickNext = () => {
		if (carouselCurrent !== 3) {
			refCarousel.current.goTo(carouselCurrent + 1, false);
		}
	};

	return (
		<Modal
			closeIcon={<FontAwesomeIcon icon={faTimes} />}
			width="35%"
			open={toggleModalModule}
			footer={null}
			onCancel={() => setToggleModalModule(false)}
			style={{ padding: "20px 10px" }}
			className="dashboard-careprofessional-modal-module"
		>
			<div className="carousel-control">
				<div className="prev">
					<Button
						type="link"
						className={carouselCurrent === 0 ? "disabled" : ""}
						onClick={handleClickPrev}
					>
						<FontAwesomeIcon icon={faArrowLeft} className="m-r-xs" />{" "}
						<span>PREVIOUS</span>
					</Button>
				</div>
				<div className="next">
					<Button
						type="link"
						className={carouselCurrent === maxContentCarousel ? "disabled" : ""}
						onClick={handleClickNext}
					>
						<span>NEXT</span>{" "}
						<FontAwesomeIcon icon={faArrowRight} className="m-l-xs" />
					</Button>
				</div>
			</div>
			<Carousel
				ref={refCarousel}
				dots={false}
				afterChange={onAfterChangeCarousel}
				initialSlide={1}
			>
				<div>
					<Row>
						<Col xs={24} sm={24} md={24}>
							<div className="text-center">
								<Typography.Title
									level={4}
									className="line-height-1 color-6 m-n"
								>
									Module 1
								</Typography.Title>
								<Typography.Title
									level={5}
									className="color-1 line-height-1 m-n"
								>
									Cancer Caregivers Circle of Responsibilities
								</Typography.Title>
								<Typography.Text>
									Select any lesson to re-review or to continue
								</Typography.Text>
							</div>
						</Col>

						<Col xs={24} sm={24} md={24} className="m-t-sm">
							<Table
								className="ant-table-default ant-table-striped"
								dataSource={[
									{
										key: "1",
										lesson_name: "Lesson 1",
										title: "Cancer Caregiver's Responsibilities",
										color: "color-5",
										icon: faCheckCircle,
									},
									{
										key: "2",
										lesson_name: "Lesson 2",
										title: "Managing Your Time As A Cancer Caregiver",
										color: "color-1",
										icon: faDial,
									},
									{
										key: "3",
										lesson_name: "Lesson 3",
										title: "Creating Your Cancer Care Support Team",
										color: "color-7",
										icon: faForward,
									},
									{
										key: "4",
										lesson_name: "Lesson 4",
										title:
											"Quis ipsum suspendisse ultriceodo viverra maecena incididunt ut labore et incididunt ut labore et dolor",
										color: "color-7",
										icon: faForward,
									},
								]}
								rowKey={(record) => record.key}
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
									key="lesson_name"
									dataIndex="lesson_name"
									render={(_, record) => (
										<span className={record.color}>{record.lesson_name}</span>
									)}
								/>
								<Table.Column
									title="Title"
									key="title"
									dataIndex="title"
									width={400}
									render={(_, record) => (
										<span
											className={`cursor-pointer ${record.color}`}
											onClick={() => history.push("/training-modules/view")}
										>
											{record.title}
										</span>
									)}
								/>
								<Table.Column
									title="Status"
									key="action"
									align="center"
									render={(_, record) => {
										return (
											<>
												<Button type="link" className={record.color}>
													<FontAwesomeIcon icon={record.icon} />
												</Button>
											</>
										);
									}}
								/>
							</Table>
						</Col>
					</Row>
				</div>
				<div>
					<Row>
						<Col xs={24} sm={24} md={24}>
							<div className="text-center">
								<Typography.Title
									level={4}
									className="line-height-1 color-6 m-n"
								>
									Module 2
								</Typography.Title>
								<Typography.Title
									level={5}
									className="color-1 line-height-1 m-n"
								>
									Cancer Caregivers Circle of Responsibilities
								</Typography.Title>
								<Typography.Text>
									Select any lesson to re-review or to continue
								</Typography.Text>
							</div>
						</Col>

						<Col xs={24} sm={24} md={24} className="m-t-sm">
							<Table
								className="ant-table-default ant-table-striped"
								dataSource={[
									{
										key: "1",
										lesson_name: "Lesson 1",
										title: "Cancer Caregiver's Responsibilities",
										color: "color-5",
										icon: faCheckCircle,
									},
									{
										key: "2",
										lesson_name: "Lesson 2",
										title: "Managing Your Time As A Cancer Caregiver",
										color: "color-1",
										icon: faDial,
									},
									{
										key: "3",
										lesson_name: "Lesson 3",
										title: "Creating Your Cancer Care Support Team",
										color: "color-7",
										icon: faForward,
									},
									{
										key: "4",
										lesson_name: "Lesson 4",
										title:
											"Quis ipsum suspendisse ultriceodo viverra maecena incididunt ut labore et incididunt ut labore et dolor",
										color: "color-7",
										icon: faForward,
									},
								]}
								rowKey={(record) => record.key}
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
									key="lesson_name"
									dataIndex="lesson_name"
									render={(_, record) => (
										<span className={record.color}>{record.lesson_name}</span>
									)}
								/>
								<Table.Column
									title="Title"
									key="title"
									dataIndex="title"
									width={400}
									render={(_, record) => (
										<span className={record.color}>{record.title}</span>
									)}
								/>
								<Table.Column
									title="Status"
									key="action"
									align="center"
									render={(_, record) => {
										return (
											<>
												<Button type="link" className={record.color}>
													<FontAwesomeIcon icon={record.icon} />
												</Button>
											</>
										);
									}}
								/>
							</Table>
						</Col>
					</Row>
				</div>
				<div>
					<Row>
						<Col xs={24} sm={24} md={24}>
							<div className="text-center">
								<Typography.Title
									level={4}
									className="line-height-1 color-6 m-n"
								>
									Module 3
								</Typography.Title>
								<Typography.Title
									level={5}
									className="color-1 line-height-1 m-n"
								>
									Cancer Caregivers Circle of Responsibilities
								</Typography.Title>
								<Typography.Text>
									Select any lesson to re-review or to continue
								</Typography.Text>
							</div>
						</Col>

						<Col xs={24} sm={24} md={24} className="m-t-sm">
							<Table
								className="ant-table-default ant-table-striped"
								dataSource={[
									{
										key: "1",
										lesson_name: "Lesson 1",
										title: "Cancer Caregiver's Responsibilities",
										color: "color-5",
										icon: faCheckCircle,
									},
									{
										key: "2",
										lesson_name: "Lesson 2",
										title: "Managing Your Time As A Cancer Caregiver",
										color: "color-1",
										icon: faDial,
									},
									{
										key: "3",
										lesson_name: "Lesson 3",
										title: "Creating Your Cancer Care Support Team",
										color: "color-7",
										icon: faForward,
									},
									{
										key: "4",
										lesson_name: "Lesson 4",
										title:
											"Quis ipsum suspendisse ultriceodo viverra maecena incididunt ut labore et incididunt ut labore et dolor",
										color: "color-7",
										icon: faForward,
									},
								]}
								rowKey={(record) => record.key}
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
									key="lesson_name"
									dataIndex="lesson_name"
									render={(_, record) => (
										<span className={record.color}>{record.lesson_name}</span>
									)}
								/>
								<Table.Column
									title="Title"
									key="title"
									dataIndex="title"
									width={400}
									render={(_, record) => (
										<span className={record.color}>{record.title}</span>
									)}
								/>
								<Table.Column
									title="Status"
									key="action"
									align="center"
									render={(_, record) => {
										return (
											<>
												<Button type="link" className={record.color}>
													<FontAwesomeIcon icon={record.icon} />
												</Button>
											</>
										);
									}}
								/>
							</Table>
						</Col>
					</Row>
				</div>
				<div>
					<Row>
						<Col xs={24} sm={24} md={24}>
							<div className="text-center">
								<Typography.Title
									level={4}
									className="line-height-1 color-6 m-n"
								>
									Module 4
								</Typography.Title>
								<Typography.Title
									level={5}
									className="color-1 line-height-1 m-n"
								>
									Cancer Caregivers Circle of Responsibilities
								</Typography.Title>
								<Typography.Text>
									Select any lesson to re-review or to continue
								</Typography.Text>
							</div>
						</Col>

						<Col xs={24} sm={24} md={24} className="m-t-sm">
							<Table
								className="ant-table-default ant-table-striped"
								dataSource={[
									{
										key: "1",
										lesson_name: "Lesson 1",
										title: "Cancer Caregiver's Responsibilities",
										color: "color-5",
										icon: faCheckCircle,
									},
									{
										key: "2",
										lesson_name: "Lesson 2",
										title: "Managing Your Time As A Cancer Caregiver",
										color: "color-1",
										icon: faDial,
									},
									{
										key: "3",
										lesson_name: "Lesson 3",
										title: "Creating Your Cancer Care Support Team",
										color: "color-7",
										icon: faForward,
									},
									{
										key: "4",
										lesson_name: "Lesson 4",
										title:
											"Quis ipsum suspendisse ultriceodo viverra maecena incididunt ut labore et incididunt ut labore et dolor",
										color: "color-7",
										icon: faForward,
									},
								]}
								rowKey={(record) => record.key}
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
									key="lesson_name"
									dataIndex="lesson_name"
									render={(_, record) => (
										<span className={record.color}>{record.lesson_name}</span>
									)}
								/>
								<Table.Column
									title="Title"
									key="title"
									dataIndex="title"
									width={400}
									render={(_, record) => (
										<span className={record.color}>{record.title}</span>
									)}
								/>
								<Table.Column
									title="Status"
									key="action"
									align="center"
									render={(_, record) => {
										return (
											<>
												<Button type="link" className={record.color}>
													<FontAwesomeIcon icon={record.icon} />
												</Button>
											</>
										);
									}}
								/>
							</Table>
						</Col>
					</Row>
				</div>
			</Carousel>
		</Modal>
	);
}
