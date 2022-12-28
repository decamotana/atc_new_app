import { Result, Button } from "antd";
import React, { useEffect } from "react";
import { useHistory } from "react-router";

const Error500 = () => {
    let history = useHistory();
    useEffect(() => {
        // history.push("/?redirect=" + location.href);
        return () => {};
    }, []);
    return (
        <Result
            status="500"
            title="500"
            subTitle="Sorry, something went wrong."
            extra={
                <Button
                    type="primary"
                    onClick={e => history.push("/")}
                >
                    Back Home
                </Button>
            }
        />
    );
};

export default Error500;
