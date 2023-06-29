import React, { useEffect, useState } from "react"
import { Layout, Menu, theme, Dropdown, Space } from 'antd';
import { Outlet, useLocation, useNavigate, useResolvedPath, Navigate } from "react-router-dom";
import { PieChartOutlined, DesktopOutlined, UserOutlined, TeamOutlined, FileOutlined, DownOutlined, LogoutOutlined, FullscreenOutlined } from '@ant-design/icons';
import logo from './static/favicon.svg'
import { AuthContext } from "./util/auth"
import { launchFullScreen } from "./util/func"
import "./style/layout.less"

const { Header, Content, Footer, Sider } = Layout;


function getItem(label, key, icon, children,) {
    return {
        key,
        icon,
        children,
        label,
    }
}

const items = [
    getItem('没问题demo', '/db/demo', <PieChartOutlined />),
    getItem('有问题demo', '/hlht/demo', <DesktopOutlined />),
    getItem('login', '/login', <DesktopOutlined />)
];

const App = () => {
    const url = useResolvedPath()
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer },
    } = theme.useToken();
    const navigate = useNavigate()
    const auth = React.useContext(AuthContext);
    let location = useLocation();
    if (!auth.user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return (
        <Layout id="main-layout">
            <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
                <div style={{ height: 32, margin: 16, background: 'rgba(255, 255, 255, 0.2)' }} />
                <Menu
                    theme="dark"
                    onClick={(e) => {
                        navigate(e.key)
                    }}
                    defaultSelectedKeys={[url.pathname]}
                    mode="inline"
                    items={items}
                />
            </Sider>
            <Layout className="site-layout">
                <Header style={{ height: 50, padding: "0 10px", background: colorBgContainer }}>
                    <div className="header">
                        <span>
                            <a style={{ marginRight: "15px" }} onClick={() => {
                                launchFullScreen(document.getElementById("fullSearchId"))
                            }}><FullscreenOutlined /></a>
                            <Dropdown
                                menu={{
                                    items: [{
                                        key: '1',
                                        label: (
                                            <a onClick={() => {
                                                auth.signout()
                                            }}>
                                                <Space size={3}>
                                                    <LogoutOutlined />
                                                    <span>退出登陆</span>
                                                </Space>

                                            </a>
                                        ),
                                    }]
                                }}
                            >
                                <a onClick={(e) => e.preventDefault()}>
                                    <Space size={3}>
                                        <UserOutlined />
                                        <span>{auth.user.name}</span>
                                        <DownOutlined />
                                    </Space>
                                </a>
                            </Dropdown>
                        </span>
                    </div>
                </Header>
                <Content id="fullSearchId" style={{ margin: '0 16px' }}>
                    <div style={{ padding: 10 }}>
                        <Outlet />
                    </div>
                </Content>
                <Footer style={{ textAlign: 'center' }}>ewell Front end frame ©2023 Created by lileilei</Footer>
            </Layout>
        </Layout>
    );
};

export default App;