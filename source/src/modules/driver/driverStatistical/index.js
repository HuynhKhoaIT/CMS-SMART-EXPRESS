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
import { Tabs, Typography } from 'antd';
const { Title } = Typography;
import { generatePath, useNavigate } from 'react-router-dom';
import { FormattedMessage, defineMessages } from 'react-intl';
import useAuth from '@hooks/useAuth';
import styles from './index.module.scss';
import ListPage from '@components/common/layout/ListPage';
import OverView from './Overview/index';
import StackedBarChart from '@components/common/elements/rechart/StackedBarChart';
import BaseTable from '@components/common/table/BaseTable';
import { formatMoney } from '@utils';
import ActiveShapePieChart from '@components/common/elements/shapePieChart/ActiveShapePieChart';
import dayjs from 'dayjs';
import AvatarField from '@components/common/form/AvatarField';
import DriverRevenueListPage from './DriverRevenue';
const message = defineMessages({
    objectName: 'Thống kê của tài xế',
});
const DriverStatisticalPage = () => {
    const translate = useTranslate();
    const queryParameters = new URLSearchParams(window.location.search);
    const driverId = queryParameters.get('driverId');
    const { data, mixinFuncs, queryFilter, loading, pagination } = useListBase({
        apiConfig: {
            getList: apiConfig.booking.dashboardSummary,
        },
        options: {
            pageSize: DEFAULT_TABLE_ITEM_SIZE,
            objectName: translate.formatMessage(message.objectName),
        },
        override: (funcs) => {
            funcs.prepareGetListPathParams = () => {
                return {
                    driverId: driverId,
                };
            };
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
                            date: dayjs(item?.date).format(DATE_FORMAT_VALUE),
                        };
                    });

                    return {
                        data,
                    };
                }
            };
        },
    });

    const setBreadRoutes = () => {
        const breadRoutes = [];

        breadRoutes.push({
            breadcrumbName: translate.formatMessage(commonMessage.driver), path: routes.driverListPage.path,
        });
        breadRoutes.push({
            breadcrumbName: translate.formatMessage(commonMessage.statistical),
        });

        return breadRoutes;
    };
    return (
        <PageWrapper
            routes={setBreadRoutes()}
        >
            <div className={styles.overview}>
                <OverView dataSource={data} isLoading={loading} />
            </div>
            <div className={styles.list_1}>
                <div className={styles.revenueList}>
                    <DriverRevenueListPage />
                </div>
                <div className={styles.pieChar}>
                    <div style={{ height: '300px', minWidth: 200 }}>
                        <ActiveShapePieChart
                            data={
                                [{
                                    name: 'Thành công',
                                    value: data.totalBookingDone,
                                },
                                {
                                    name: 'Huỷ bỏ',
                                    value: data.totalBookingCancel,
                                }, {
                                    name: 'Đơn nhận',
                                    value: data.totalBookingAccept,
                                }]
                            }
                            width={250}
                            height={250}
                            innerRadius={70}
                            outerRadius={100} />
                    </div>
                    <span className={styles.titleRate}>Tỉ lệ đặt chuyến</span>
                </div>
            
            </div>
        </PageWrapper >
    );
};

export default DriverStatisticalPage;
