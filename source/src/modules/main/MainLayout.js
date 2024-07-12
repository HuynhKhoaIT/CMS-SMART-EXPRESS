import React, { useState } from 'react';
import { ConfigProvider, Layout } from 'antd';

import NavSider from './NavSider';
import AppHeader from './AppHeader';

import styles from './MainLayout.module.scss';
import { brandName, brandNameExpress, IS_BOOKING } from '@constants';

const { Content, Footer } = Layout;

const SIDEBAR_WIDTH_EXPAND = 320;

const MainLayout = ({ children }) => {
    const [collapsed, setCollapsed] = useState(false);

    const toggleCollapsed = () => setCollapsed(prev => !prev);

    return (
        <ConfigProvider theme={{
            token: {
                // Seed Token
                colorPrimary: IS_BOOKING ? "#1890ff" : '#EA2400',
                borderRadius: IS_BOOKING ? 6 : 2,
                // Alias Token
                // colorBgContainer: '#f6ffed',
            },
        }}>
            <Layout hasSider>
                <NavSider
                    collapsed={collapsed}
                    onCollapse={toggleCollapsed}
                    width={SIDEBAR_WIDTH_EXPAND}
                />
                <Layout>
                    <AppHeader
                        collapsed={collapsed}
                        onCollapse={toggleCollapsed}
                    />
                    <Content className={styles.appContent}>
                        <div className={styles.wrapper}>{children}</div>
                        <Footer className={styles.appFooter}>
                            <strong> {IS_BOOKING ? brandName : brandNameExpress} </strong>
                            - © Copyright {new Date().getFullYear()}. All Rights Reserved.
                        </Footer>
                    </Content>
                </Layout>
            </Layout>
        </ConfigProvider >
    );
};

export default MainLayout;
