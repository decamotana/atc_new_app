import { Card, Col, Image, Layout, Row, Typography } from "antd";
import moment from "moment";
import { useEffect } from "react";
import {
	description,
	fullwidthlogo,
	name,
} from "../../../providers/companyInfo";
import decryptText from "../../../providers/decryptText";
import Error404 from "../../errors/Error404";
import AdvertisingGraph from "../../private/PageAdmin/PageAdvertising/Components/AdvertisingGraph";

export default function PageAdvertisingViewGraph(props) {
	const { title, match } = props;
	let paramsid = decryptText("CancerCaregiver", match.params.id);
	let splitid = paramsid ? paramsid.split("CancerCaregiver") : "";
	console.log("splitid", splitid);

	useEffect(() => {
		if (title) {
			document.title = title + " | " + name;
		}

		return () => {};
	}, [title]);

	if (splitid && Array.isArray(splitid) && splitid.length > 0) {
		if (splitid[0] === "") {
			return (
				<Layout className="public-layout login-layout">
					<Layout.Content>
						<Row>
							<Col xs={24} sm={24} md={24}>
								<Image
									className="zoom-in-out-box"
									src={fullwidthlogo}
									preview={false}
								/>

								<div className="login-sub-title">
									Educating Cancer CareGivers for their wellbeing & improved
									patient outcomes
								</div>

								<Card>
									<AdvertisingGraph
										id={splitid[1].split("---CCG---")[0]}
										title={splitid[1].split("---CCG---")[1]}
									/>
								</Card>
							</Col>
						</Row>
					</Layout.Content>
					<Layout.Footer className="text-center m-t-lg">
						<Typography.Text>
							© Copyright {moment().format("YYYY")} {description}. All Rights
							Reserved.
						</Typography.Text>
					</Layout.Footer>
				</Layout>
			);
		} else {
			return <Error404 />;
		}
	} else {
		return <Error404 />;
	}
}
