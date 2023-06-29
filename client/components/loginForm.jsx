import React from "react"
import { Form, Input, Button, Checkbox } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom'
import { AuthContext } from "../util/auth"

const NormalLoginForm = () => {

    const auth = React.useContext(AuthContext);
    const navigate = useNavigate()

    const onFinish = (values) => {
        console.log('Received values of form: ', values);
        auth.signin(values, () => {
            navigate("/db/demo", { replace: true })
        })
    };

    return (
        <Form
            name="normal_login"
            className="login-form"
            initialValues={{ remember: true,username:"lileilei@ewell.cc",password:"123456" }}
            onFinish={onFinish}
        >
            <Form.Item
                name="username"
                rules={[{ required: true, message: 'Please input your Username!' }]}
            >
                <Input size="large" prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
            </Form.Item>
            <Form.Item
                name="password"
                rules={[{ required: true, message: 'Please input your Password!' }]}
            >
                <Input
                    size="large"
                    prefix={<LockOutlined className="site-form-item-icon" />}
                    type="password"
                    placeholder="Password"
                />
            </Form.Item>
            <Form.Item>
                <Form.Item name="remember" valuePropName="checked" noStyle>
                    <Checkbox>Remember me</Checkbox>
                </Form.Item>

                <a className="login-form-forgot" href="">
                    Forgot password
                </a>
            </Form.Item>

            <Form.Item>
                <Button type="primary" block htmlType="submit" size="large" className="login-form-button">
                    Log in
                </Button>
                Or <a href="">register now!</a>
            </Form.Item>
        </Form>
    );
};
export default NormalLoginForm