import { HomeOutlined, ControlOutlined, UserOutlined, CarOutlined, LineChartOutlined, BarChartOutlined } from '@ant-design/icons';
import routes from '@routes';
import { IconUserBolt } from '@tabler/icons-react';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import apiConfig from './apiConfig';
import { FormOutlined } from '@ant-design/icons';
import { IS_BOOKING } from '@constants';

const navMenuConfig = [

    {
        label: <FormattedMessage defaultMessage="Trang chủ" />,
        key: 'home-page',
        icon: <HomeOutlined />,
        path: routes.homePage.path,

    },
    {
        label: IS_BOOKING ? <FormattedMessage defaultMessage="Quản lý đặt xe" /> : <FormattedMessage defaultMessage="Quản lý đơn hàng" />,
        key: 'booking-management',
        icon: <CarOutlined />,
        children: [
            {
                label: IS_BOOKING ? <FormattedMessage defaultMessage="Danh sách đặt xe" /> : <FormattedMessage defaultMessage="Danh sách đơn hàng" />,
                key: 'booking',
                path: routes.bookingListPage.path,
                permission: apiConfig.booking.getList.baseURL,
            },
        ],
    },
    // {
    //     label: <FormattedMessage defaultMessage="Quản lý admin" />,
    //     key: 'account-management',
    //     icon: <IconUserBolt size={16} />,
    //     children: [],
    // },
    {
        label: <FormattedMessage defaultMessage="Quản lý tài xế" />,
        key: 'driver-management',
        icon: <IconUserBolt size={16} />,
        children: [
            {
                label: <FormattedMessage defaultMessage="Danh sách tài xế" />,
                key: 'driver',
                path: routes.driverListPage.path,
                permission: apiConfig.driver.getList.baseURL,
            },
            {
                label: <FormattedMessage defaultMessage="Tài xế online" />,
                key: 'position-management',
                path: routes.positionListPage.path,
                permission: [apiConfig.position.getList.baseURL],
            },
            {
                label: <FormattedMessage defaultMessage="Bản đồ tài xế" />,
                key: 'map',
                path: routes.mapPage.path,
            },
            {
                label: <FormattedMessage defaultMessage="Tỉ lệ hoạt động" />,
                key: 'list-activity-rate',
                path: routes.activityRateListPage.path,
            },
        ],
    },
    {
        label: <FormattedMessage defaultMessage="Quản lý khách hàng" />,
        key: 'customer-management',
        icon: <UserOutlined />,
        children: [
            {
                label: <FormattedMessage defaultMessage="Danh sách khách hàng" />,
                key: 'customer',
                path: routes.customerListPage.path,
                permission: apiConfig.customer.getList.baseURL,
            },
        ],
    },
    {
        label: <FormattedMessage defaultMessage="Quản lý dịch vụ" />,
        key: 'account-management',
        icon: <FormOutlined size={16} />,
        children: [
            // {
            //     label: <FormattedMessage defaultMessage="Dịch vụ" />,
            //     key: 'service',
            //     permissions: [apiConfig.service.getList.baseURL],
            //     path: routes.serviceListPage.path,
            // },
            {
                label: <FormattedMessage defaultMessage="Danh sách dịch vụ" />,
                key: 'service-category',
                permissions: [apiConfig.category.getList.baseURL],
                path: routes.categoryServiceListPage.path,
            },
        ],
    },
    {
        label: <FormattedMessage defaultMessage="Quản lý khuyến mãi" />,
        key: 'promotion-management',
        icon: <BarChartOutlined />,
        children: [
            {
                label: <FormattedMessage defaultMessage="Danh sách khuyến mãi" />,
                key: 'promotion',
                permissions: [apiConfig.promotion.getList.baseURL],
                path: routes.promotionListPage.path,
            },
        ],
    },
    {
        label: <FormattedMessage defaultMessage="Quản lý tài chính" />,
        key: 'revenue-management',
        icon: <LineChartOutlined />,
        children: [
            {
                label: <FormattedMessage defaultMessage="Quản lý danh thu" />,
                key: 'finance',
                path: routes.finaceListPage.path,
                // permission: apiConfig.booking.finance.baseURL,
            },
            {
                label: <FormattedMessage defaultMessage="Biểu đồ doanh thu" />,
                key: 'revenue',
                path: routes.revenueListPage.path,
                permission: apiConfig.booking.revenue.baseURL,
            },
            {
                label: <FormattedMessage defaultMessage="Yêu cầu rút tiền tài xế" />,
                key: 'requestPayOutDriver',
                path: routes.requestPayOutListPage.path,
                permission: apiConfig.requestPayout.getList.baseURL,
            },
            {
                label: <FormattedMessage defaultMessage="Yêu cầu rút tiền khách hàng" />,
                key: 'requestPayOutCustomer',
                path: routes.requestPayOutListPageCustomer.path,
                permission: apiConfig.requestPayout.getList.baseURL,
            },
        ],
    },
    {
        label: <FormattedMessage defaultMessage="Quản lý ví" />,
        key: 'wallet-management',
        icon: <LineChartOutlined />,
        children: [
            {
                label: <FormattedMessage defaultMessage="Ví tài xế" />,
                key: 'walletDriverListSum',
                path: routes.walletListSum.path,
                // permission: apiConfig.requestPayout.getList.baseURL,
            },
            {
                label: <FormattedMessage defaultMessage="Ví khách hàng" />,
                key: 'walletCustomerListSum',
                path: routes.walletCustomerListSum.path,
                // permission: apiConfig.requestPayout.getList.baseURL,
            },
        ],
    },
    {
        label: <FormattedMessage defaultMessage="Hệ thống" />,
        key: 'system-management',
        icon: <ControlOutlined />,
        children: [
            {
                label: <FormattedMessage defaultMessage="Tin tức" />,
                key: 'news',
                permissions: [apiConfig.news.getList.baseURL],
                path: routes.newsListPage.path,
            },
            {
                label: <FormattedMessage defaultMessage="Danh mục xe" />,
                key: 'vehicle-category',
                permissions: [apiConfig.category.getList.baseURL],
                path: routes.categoryListPage.path,
            },
            {
                label: <FormattedMessage defaultMessage="Danh mục tỉnh thành" />,
                key: 'nation-management',
                path: routes.nationListPage.path,
                permission: [apiConfig.nation.getList.baseURL],
            },
            {
                label: <FormattedMessage defaultMessage="Cài đặt" />,
                key: 'setting',
                path: routes.settingsPage.path,
            },
        ],
    },
];

export default navMenuConfig;
