import { Result, Button } from 'antd';
import React from "react";
import { useHistory } from "react-router";

const Info = () => {
    let history = useHistory();
    return (
        <Result
            title="Your operation has been executed"
            extra={<Button type="primary"  onClick={e => history.push("/")}>Back Home</Button>}
        />
    )
}

export default Info;