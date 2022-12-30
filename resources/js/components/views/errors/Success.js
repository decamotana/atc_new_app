import { Result, Button } from 'antd';
import React from "react";
import { useHistory } from "react-router";
const Success = () => {
    let history = useHistory();
    return (
        <Result
            status="success"
            title="Successfully Purchased Cloud Server ECS!"
            subTitle="Order number: 2017182818828182881 Cloud server configuration takes 1-5 minutes, please wait."
            extra={<Button type="primary" onClick={e => history.push("/")}>Back Home</Button>}
        />
    )
}

export default Success;