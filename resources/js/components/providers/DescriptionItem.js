import React from "react";

const DescriptionItem = ({ title, content, width = "" }) => (
    <div
        className="site-description-item-profile-wrapper"
        style={{ width: width }}
    >
        <p className="site-description-item-profile-p-label">
            {title != "" && `${title}:`}
        </p>
        {content ? content : "N/A"}
    </div>
);

export default DescriptionItem;
