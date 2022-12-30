import React from "react";
import { Layout, Result } from "antd";

export default function PageMaintenance() {
	return (
		<Layout className="public-layout">
			<div className="divMaintenance">
				<div className="divMaintenanceChild">
					<Result
						status="warning"
						title={
							<span className="textMaintenance">
								Our site is currently undergoing scheduled maintenance and
								upgrades, but will return shorthly. We apologize for the
								inconvenience, thank you for your patience.
							</span>
						}
					/>
				</div>
			</div>
		</Layout>
	);
}
