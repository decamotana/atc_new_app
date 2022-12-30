import { Result, Button } from 'antd';
import React from "react";
import { useHistory } from "react-router";

const Error403 = () => {
    let history = useHistory();
    return (
        <Result
            status="403"
            title="403"
            subTitle="Sorry, you are not authorized to access this page."
            extra={
                <Button type="primary" onClick={e => history.push("/")}>
                    Back Home
                </Button>
            }
        />
    )
}

export default Error403;