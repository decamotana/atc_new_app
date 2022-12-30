import { Card, Col, Row } from "antd";
import { role } from "../../../providers/companyInfo";
import { GET } from "../../../providers/useAxiosQuery";
// import PagePrivacyPolicyForm from "./PagePrivacyPolicyForm";

export default function PagePrivacyPolicy(props) {
	// const { location } = props;

	const { data: dataSource } = GET(
		`api/v1/privacy?role=${role()}`,
		"privacy_policy"
	);

	// const handleRenderForm = () => {
	// 	if (location.pathname === "/pp") {
	// 		return <PagePrivacyPolicyForm dataSource={dataSource} />;
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
		<Card className="page-privacy-policy">
			<Row gutter={[12, 12]}>
				<Col xs={24} sm={24} md={24} lg={24}>
					<div
						dangerouslySetInnerHTML={{
							__html:
								dataSource && dataSource.data.length > 0
									? dataSource.data[0].privacy_policy
									: "",
						}}
					/>
				</Col>
			</Row>
		</Card>
	);
}
