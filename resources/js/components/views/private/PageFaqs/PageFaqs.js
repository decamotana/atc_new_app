import { useState } from "react";
import { Card, Collapse } from "antd";
import { GET } from "../../../providers/useAxiosQuery";
import { role } from "../../../providers/companyInfo";

export default function PageFaqs() {
	const [faqData, setFaqData] = useState([]);

	GET(`api/v1/faq?role=${role()}`, "faq_by_role", (res) => {
		// console.log("res", res.data);
		if (res.data) {
			let data = res.data;
			setFaqData(data);
		}
	});

	const handleRenderFaq = () => {
		if (faqData) {
			return (
				<Collapse
					className="main-1-collapse border-none"
					expandIcon={({ isActive }) =>
						isActive ? (
							<span
								className="ant-menu-submenu-arrow"
								style={{ color: "#FFF", transform: "rotate(270deg)" }}
							/>
						) : (
							<span
								className="ant-menu-submenu-arrow"
								style={{ color: "#FFF", transform: "rotate(90deg)" }}
							/>
						)
					}
					expandIconPosition="end"
					defaultActiveKey={["0"]}
				>
					{faqData.map((item, index) => {
						return (
							<Collapse.Panel
								header={item.title}
								key={`${index}`}
								className="accordion bg-darkgray-form m-b-md border"
							>
								<div dangerouslySetInnerHTML={{ __html: item.description }} />
							</Collapse.Panel>
						);
					})}
				</Collapse>
			);
		}
	};

	return <Card>{handleRenderFaq()}</Card>;
}
