import apiConfig from '@constants/apiConfig';
import useListBase from '@hooks/useListBase';
import React, { useState } from 'react';
import { UserOutlined } from '@ant-design/icons';

import {
    AppConstants,
    DATE_DISPLAY_FORMAT,
    DATE_FORMAT_VALUE,
    DEFAULT_TABLE_ITEM_SIZE,
} from '@constants';
import PageWrapper from '@components/common/layout/PageWrapper';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import routes from '@routes';
import { Avatar, Card, List, Tabs, Typography } from 'antd';
const { Title } = Typography;
import { generatePath, useNavigate } from 'react-router-dom';
import { FormattedMessage, defineMessages } from 'react-intl';
import useAuth from '@hooks/useAuth';
import styles from './index.module.scss';
import ListPage from '@components/common/layout/ListPage';
import OverView from './Overview';
import StackedBarChart from '@components/common/elements/rechart/StackedBarChart';
import BaseTable from '@components/common/table/BaseTable';
import { formatMoney } from '@utils';
import ActiveShapePieChart from '@components/common/elements/shapePieChart/ActiveShapePieChart';
import dayjs from 'dayjs';
import AvatarField from '@components/common/form/AvatarField';
const message = defineMessages({
    objectName: 'Tổng quan',
});
const HomePage = () => {
    const navigate = useNavigate();
    const translate = useTranslate();
    const { profile } = useAuth();
    const [activeTab, setActiveTab] = useState('1');

    const { data, mixinFuncs, queryFilter, loading, pagination } = useListBase({
        apiConfig: {
            getList: apiConfig.booking.dashboardSummary,
        },
        options: {
            pageSize: DEFAULT_TABLE_ITEM_SIZE,
            objectName: translate.formatMessage(message.objectName),
        },
        override: (funcs) => {
            funcs.mappingData = (response) => {
                if (response.result === true) {
                    return {
                        data: response.data,
                    };
                }
            };
        },
    });
    const { data: dataRevenue, mixinFuncs: mixinFuncsRevenue, queryFilter: queryFilterRevenue, loading: loadingRevenue } = useListBase({
        apiConfig: {
            getList: apiConfig.booking.revenueStatistic,
        },
        options: {
            pageSize: DEFAULT_TABLE_ITEM_SIZE,
            objectName: translate.formatMessage(message.objectName),
        },
        override: (funcs) => {
            funcs.mappingData = (response) => {
                if (response.result === true) {
                    const data = response.data?.map((item) => {
                        return {
                            totalBookingMoney: item?.totalBookingMoney,
                            totalMoney: item?.totalMoney,
                            date: item?.date,
                        };
                    });

                    return {
                        data,
                    };
                }
            };
        },
    });
    const { data: dataDriver, mixinFuncs: mixinFuncsDriver, queryFilter: queryFilterDriver, loading: loadingDriver, pagination: paginationDriver } = useListBase({
        apiConfig: {
            getList: apiConfig.driver.dashboardTopDriver,
        },
        options: {
            pageSize: 5,
            objectName: translate.formatMessage(message.objectName),
        },
        override: (funcs) => {
            funcs.mappingData = (response) => {
                if (response.result === true) {
                    return {
                        data: response.data,
                    };
                }
            };
        },
    });
    const columns = [
        {
            title: '#',
            dataIndex: 'avatar',
            align: 'center',
            width: 80,
            render: (avatar) => (
                <AvatarField
                    size="large"
                    icon={<UserOutlined />}
                    src={avatar ? `${AppConstants.contentRootUrl}${avatar}` : null}
                />
            ),
        },

        {
            title: translate.formatMessage(commonMessage.fullName),
            dataIndex: 'fullName',
        },
        {
            title: translate.formatMessage(commonMessage.phone),
            dataIndex: 'phone',
        },
        {
            title: translate.formatMessage(commonMessage.totalRevenue),
            dataIndex: 'totalRevenue',
            align: 'right',

            render: (price) => {
                const formattedValue = formatMoney(price, {
                    currentcy: 'đ',
                    currentDecimal: '0',
                    groupSeparator: ',',
                });
                return <div>{formattedValue}</div>;
            },
            width: 200,
        },

    ].filter(Boolean);
    const columnsActivityRates = [
        {
            title: '#',
            dataIndex: 'avatar',
            align: 'center',
            width: 80,
            render: (avatar) => (
                <AvatarField
                    size="large"
                    icon={<UserOutlined />}
                    src={avatar ? `${AppConstants.contentRootUrl}${avatar}` : null}
                />
            ),
        },
        {
            title: translate.formatMessage(commonMessage.fullName),
            dataIndex: 'fullName',
        },
        {
            title: translate.formatMessage(commonMessage.phone),
            dataIndex: 'phone',
        },
        {
            title: translate.formatMessage(commonMessage.bookingAcceptRate),
            dataIndex: 'bookingAcceptRate',
            render: (dataRow) => {
                return <>
                    {dataRow}%</>;
            },
            width: 150,
            align: 'center',
        },
        {
            title: translate.formatMessage(commonMessage.bookingCancelRate),
            dataIndex: 'bookingCancelRate',
            render: (dataRow) => {
                return <>
                    {dataRow}%</>;
            },
            width: 150,
            align: 'center',
        },
        {
            title: translate.formatMessage(commonMessage.bookingDoneRate),
            dataIndex: 'bookingDoneRate',
            render: (dataRow) => {
                return <>
                    {dataRow}%</>;
            },
            width: 250,
            align: 'center',
        },

    ].filter(Boolean);
    const items = [
        {
            key: '1',
            label: '10 tài xế doanh thu cao nhất',
            children: <BaseTable
                onChange={mixinFuncsDriver.changePagination}
                columns={columns}
                dataSource={dataDriver.driverRevenues}
                loading={loadingDriver}
                rowKey={(record) => record.id}
                pagination={paginationDriver}
                style={{ maxHeight: '800px', marginBottom: '30px' }}
            />,
        },
        {
            key: '2',
            label: '10 tài xế tỉ lệ hoạt động cao nhất',
            children: <BaseTable
                onChange={mixinFuncsDriver.changePagination}
                columns={columnsActivityRates}
                dataSource={dataDriver.driverActivityRates}
                loading={loadingDriver}
                rowKey={(record) => record.id}
                pagination={paginationDriver}
                style={{ maxHeight: '800px', marginBottom: '30px' }}
            />,
        },
    ];
    return (
        <PageWrapper
        >
            <div className={styles.list_1}>
                <div className={styles.overview}>
                    <OverView dataSource={data} isLoading={loading} />
                </div>
            </div>
            <div className={styles.listChart}>
                <div className={styles.dataChart}>
                    <StackedBarChart dataSource={dataRevenue} height={'480px'} />
                    <span className={styles.titleRevenue}>Doanh thu 7 ngày gần nhất</span>
                </div>
                <div className={styles.pieChar}>
                    <div style={{ height: '400px', minWidth: 300 }}>
                        <ActiveShapePieChart data={
                            [{
                                name: 'Thành công',
                                value: data.totalBookingDone,
                            },
                            {
                                name: 'Huỷ bỏ',
                                value: data.totalBookingCancel,
                            }]
                        } />
                    </div>
                    <span className={styles.titleRate}>Tỉ lệ đặt chuyến</span>
                </div>
            </div>

            <div className={styles.list_2}>
                {/* <div className={styles.listPage}>
                    <Tabs
                        style={{ marginTop: 20 }}
                        type="card"
                        defaultActiveKey="1"
                        items={items}
                    />
                </div> */}
                <div className={styles.driverRevenues}>
                    <Card title="10 tài xế doanh thu cao nhất" style={{ borderRadius: 10, boxShadow: '0px -2px 15px 0px rgba(0, 0, 0, .075)' }}>
                        <List
                            itemLayout="horizontal"
                            loading={loadingDriver}
                            dataSource={dataDriver.driverRevenues}
                            renderItem={(item, index) => (
                                <List.Item>
                                    <List.Item.Meta
                                        avatar={<AvatarField
                                            size="large"
                                            icon={<UserOutlined />}
                                            src={item?.avatar ? `${AppConstants.contentRootUrl}${item?.avatar}` : null}
                                        />}
                                        title={item?.fullName}
                                        description={item?.phone}
                                    />
                                    <div>{formatMoney(item.totalRevenue, {
                                        currentcy: 'đ',
                                        currentDecimal: '0',
                                        groupSeparator: ',',
                                    })}</div>
                                </List.Item>

                            )}
                        />

                    </Card>
                </div>
                <div className={styles.driverActivityRates}>
                    <Card title="10 tài xế tỉ lệ hoạt động cao nhất" style={{ borderRadius: 10, boxShadow: '0px -2px 15px 0px rgba(0, 0, 0, .075)' }}>
                        <List
                            itemLayout="horizontal"
                            dataSource={dataDriver.driverActivityRates}
                            loading={loadingDriver}
                            renderItem={(item, index) => (
                                <List.Item>
                                    <List.Item.Meta
                                        avatar={<AvatarField
                                            size="large"
                                            icon={<UserOutlined />}
                                            src={item?.avatar ? `${AppConstants.contentRootUrl}${item?.avatar}` : null}
                                        />}
                                        title={item?.fullName}
                                        description={item?.phone}
                                    />
                                    <div>{item.bookingAcceptRate} %</div>
                                </List.Item>

                            )}
                        />

                    </Card>
                </div>
            </div>

        </PageWrapper >
    );
};

export default HomePage;
