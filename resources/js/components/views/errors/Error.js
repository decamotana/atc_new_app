import { Result, Button, Typography } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';
import React from "react";
import { useHistory } from "react-router";

const Error = () => {
    const { Paragraph, Text } = Typography;
    let history = useHistory();
    return (
        <Result
            status="error"
            title="Submission Failed"
            subTitle="Please check and modify the following information before resubmitting."
            extra={<Button type="primary" onClick={e => history.push("/")}>Back Home</Button>}
        >
            <div className="desc">
            <Paragraph>
                <Text
                strong
                style={{
                    fontSize: 16,
                }}
                >
                The content you submitted has the following error:
                </Text>
            </Paragraph>
            <Paragraph>
                <CloseCircleOutlined className="site-result-demo-error-icon" style={{color: 'red'}} /> Your account has been
                frozen. <a>Thaw immediately &gt;</a>
            </Paragraph>
            <Paragraph>
                <CloseCircleOutlined className="site-result-demo-error-icon" style={{color: 'red'}} /> Your account is not yet
                eligible to apply. <a>Apply Unlock &gt;</a>
            </Paragraph>
            </div>
        </Result>
    )
}

export default Error;