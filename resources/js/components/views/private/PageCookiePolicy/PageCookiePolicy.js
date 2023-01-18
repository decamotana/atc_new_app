import { Card, Col, Row } from "antd";
import { role } from "../../../providers/companyInfo";
import { GET } from "../../../providers/useAxiosQuery";
// import PageCookiePolicyForm from "./PageCookiePolicyForm";

export default function PageCookiePolicy(props) {
	// const { location } = props;

	const { data: dataSource } = GET(
		`api/v1/cookie_policy?role=${role()}`,
		"cookie_policy"
	);

	// const handleRenderForm = () => {
	// 	if (location.pathname === "/cp") {
	// 		return <PageCookiePolicyForm dataSource={dataSource} />;
	// 	} else {
	// 		if (dataSource?.data?.content) {
	// 			return (
	// 				<Row gutter={[12, 12]}>
	// 					<Col xs={24} sm={24} md={24} lg={24}>
	// 						<div
	// 							dangerouslySetInnerHTML={{ __html: dataSource?.data?.content }}
	// 						/>
	// 					</Col>
	// 				</Row>
	// 			);
	// 		}
	// 	}
	// };

	return (
		<Card className="page-cookie-policy">
			<Row gutter={[12, 12]}>
				<Col xs={24} sm={24} md={24} lg={24}>
					<div
						dangerouslySetInnerHTML={{
							__html:
								dataSource && dataSource.data.length > 0
									? dataSource.data[0].content
									: "",
						}}
					/>
				</Col>
			</Row>
		</Card>
	);
}
