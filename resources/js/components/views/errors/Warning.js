import { Result, Button } from 'antd';
import React from "react";
import { useHistory } from "react-router";

const Warning = () => {
    let history = useHistory();
    return (
        <Result
            status="warning"
            title="There are some problems with your operation."
            extra={<Button type="primary" onClick={e => history.push("/")}>Back Home</Button>}
        />
    )
}

export default Warning;