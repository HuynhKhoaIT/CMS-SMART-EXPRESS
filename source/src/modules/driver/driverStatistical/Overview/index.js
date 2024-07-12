import { Button, Card, Flex } from 'antd';
import { ArrowUpOutlined } from '@ant-design/icons';

import React, { useEffect } from 'react';
import useFetch from '@hooks/useFetch';
import apiConfig from '@constants/apiConfig';
import { formatLargeNumber, priceValue } from '@utils';
import useAuth from '@hooks/useAuth';
import { IS_BOOKING, UserTypes } from '@constants';
import styles from './index.module.scss';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import { IconFreeRights, IconPresentationAnalytics, IconReceipt, IconReportMoney, IconUser, IconUsers, IconUsersGroup } from '@tabler/icons-react';
const OverView = ({ dataSource, isLoading }) => {
    const translate = useTranslate();

    return (
        <div className={styles.listCard}>
            <div className={styles.box} style={{ backgroundColor: '#EAE2FE' }}>
                <div className={styles.card} >
                    <div className={styles.head}>
                        <span className={styles.title}>
                            {translate.formatMessage(commonMessage.totalDriverRevenue)}
                        </span>
                        {/* <IconFreeRights size={24} color={IS_BOOKING ? '#000' : '#EA2400'} /> */}
                    </div>

                    <Flex justify="space-between">
                        <span className={styles.content} style={{ color: "#996CF9" }}>{formatLargeNumber(dataSource.totalDriverRevenue)}</span>
                    </Flex>
                </div>
                <div className={styles.boxCss} style={{
                    backgroundColor: '#C2A8FD',
                }}></div>
                <div className={styles.boxCss2} style={{
                    backgroundColor: '#DACBFE',
                }}></div>
            </div>
            <div className={styles.box} style={{ backgroundColor: '#FFF7ED' }}>
                <div className={styles.card} >
                    <div className={styles.head}>
                        <span className={styles.title}>{translate.formatMessage(commonMessage.totalBalanceMoney)}
                        </span>
                        {/* <IconUsersGroup size={24} style={{ flexShrink: 0 }} color={IS_BOOKING ? '#000' : '#EA2400'} /> */}
                    </div>
                    <Flex justify="space-between">
                        <span className={styles.content} style={{ color: "#F97315" }}>
                            {dataSource.totalBalanceMoney}
                        </span>
                    </Flex>
                    {/* <Flex justify="space-between" style={{ color: "#F97315" }}>
                        <span className={styles.growthRate}>
                            {dataSource.totalDriverGrowthRate > 0 ? '+' + dataSource.totalDriverGrowthRate : dataSource.totalDriverGrowthRate}%
                        </span>
                        <span className={styles.sinceLastMonth}> {translate.formatMessage(commonMessage.sinceLastMonth)}</span>
                    </Flex> */}
                </div>
                <div className={styles.boxCss} style={{
                    backgroundColor: '#FED7AA',
                }}></div>
                <div className={styles.boxCss2} style={{
                    backgroundColor: '#FFEDD5',
                }}></div>
            </div>
            <div className={styles.box} style={{ backgroundColor: "#F0FDF4" }}>
                <div className={styles.card} >
                    <div className={styles.head}>
                        <span className={styles.title}>{translate.formatMessage(commonMessage.totalDepositMoney)}</span>
                        {/* <IconUsers size={24} style={{ flexShrink: 0 }} color={IS_BOOKING ? '#000' : '#EA2400'} /> */}
                    </div>
                    <Flex justify="space-between">
                        <span className={styles.content} style={{ color: "#21C55E" }}>{dataSource.totalDepositMoney}</span>
                    </Flex>
                </div>
                <div className={styles.boxCss} style={{
                    backgroundColor: '#BCF7D0',
                }}></div>
                <div className={styles.boxCss2} style={{
                    backgroundColor: '#DCFCE7',
                }}></div>
            </div>
            <div className={styles.box} style={{ backgroundColor: '#FEF2F1' }}>
                <div className={styles.card} >
                    <div className={styles.head}>
                        <span className={styles.title}>{translate.formatMessage(commonMessage.totalWithdrawMoney)}</span>
                        {/* <IconPresentationAnalytics size={24} style={{ flexShrink: 0 }} color={IS_BOOKING ? '#000' : '#EA2400'} /> */}
                    </div>
                    <Flex justify="space-between">
                        <span className={styles.content} style={{ color: "#EA2400" }}>
                            {dataSource.totalWithdrawMoney}
                        </span>
                    </Flex>
                </div>
                <div className={styles.boxCss} style={{
                    backgroundColor: '#FECACA',
                }}></div>
                <div className={styles.boxCss2} style={{
                    backgroundColor: '#FEE2E2',
                }}></div>
            </div>
            <div className={styles.box} style={{ backgroundColor: '#EAE2FE' }}>
                <div className={styles.card} >
                    <div className={styles.head}>
                        <span className={styles.title}>{translate.formatMessage(commonMessage.totalReview)}</span>
                        {/* <IconReportMoney size={24} style={{ flexShrink: 0 }} color={IS_BOOKING ? '#000' : '#EA2400'} /> */}
                    </div>
                    <Flex justify="space-between">
                        <span className={styles.content} style={{ color: "#996CF9" }}>
                            {dataSource.totalBookingRating}
                        </span>
                    </Flex>
                </div>
                <div className={styles.boxCss} style={{
                    backgroundColor: '#C2A8FD',
                }}></div>
                <div className={styles.boxCss2} style={{
                    backgroundColor: '#DACBFE',
                }}></div>
            </div>
            <div className={styles.box} style={{ backgroundColor: "#EBFEFF" }}>
                <div className={styles.card} >
                    <div className={styles.head}>
                        <span className={styles.title}>{translate.formatMessage(commonMessage.averageRating)}</span>
                        {/* <IconReceipt size={24} style={{ flexShrink: 0 }} color={IS_BOOKING ? '#000' : '#EA2400'} /> */}
                    </div>
                    <Flex justify="space-between">
                        <span className={styles.content} style={{ color: "#05B6D3" }}>
                            {dataSource.averageRating}
                        </span>
                    </Flex>
                </div>
                <div className={styles.boxCss} style={{
                    backgroundColor: '#A6F3FC',
                }}></div>
                <div className={styles.boxCss2} style={{
                    backgroundColor: '#CFFAFE',
                }}></div>
            </div>

        </div>
    );
};
export default OverView;
