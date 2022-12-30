import { Card, Col, Layout, Row } from "antd";
import "../../../assets/css/pages/community-feed/community-feed.css";

export default function PageCommunityFeed() {
	return (
		<Layout className="page-community-feed">
			<Layout.Header></Layout.Header>
			<Layout.Content>
				<Card>
					<Row gutter={[12, 12]} justify="center">
						<Col xs={22} sm={22} md={20} lg={16}>
							Community Feed
						</Col>
					</Row>
				</Card>
			</Layout.Content>
		</Layout>
	);
}
