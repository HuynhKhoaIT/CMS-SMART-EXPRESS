import { UserOutlined } from '@ant-design/icons';
import ListPage from '@components/common/layout/ListPage';
import PageWrapper from '@components/common/layout/PageWrapper';
import { AppConstants, DEFAULT_TABLE_ITEM_SIZE } from '@constants';
import apiConfig from '@constants/apiConfig';
import { FieldTypes } from '@constants/formConfig';
import { statusOptions } from '@constants/masterData';
import useListBase from '@hooks/useListBase';
import useTranslate from '@hooks/useTranslate';
import routes from '@routes';
import { Button } from 'antd';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { defineMessages } from 'react-intl';
import BaseTable from '@components/common/table/BaseTable';
import { commonMessage } from '@locales/intl';
import { CalendarOutlined, BarChartOutlined } from '@ant-design/icons';
import { BaseTooltip } from '@components/common/form/BaseTooltip';
import AvatarField from '@components/common/form/AvatarField';
import { IconMotorbike } from '@tabler/icons-react';

const message = defineMessages({
    objectName: 'Tài xế',
});

function DriverListPage() {
    const translate = useTranslate();
    const { pathname: pagePath } = useLocation();
    const location = useLocation();
    const navigate = useNavigate();

    const statusValues = translate.formatKeys(statusOptions, ['label']);
    const { data, mixinFuncs, queryFilter, loading, pagination, changePagination } = useListBase({
        apiConfig: apiConfig.driver,
        options: {
            pageSize: DEFAULT_TABLE_ITEM_SIZE,
            objectName: translate.formatMessage(message.objectName),
        },
        override: (funcs) => {
            funcs.mappingData = (response) => {
                try {
                    if (response.result === true) {
                        return {
                            data: response.data.content,
                            total: response.data.totalElements,
                        };
                    }
                } catch (error) {
                    return [];
                }
            };
            funcs.additionalActionColumnButtons = () => ({
                statistical: ({ id }) => (
                    <BaseTooltip title={translate.formatMessage(commonMessage.statistical)}>
                        <Button
                            type="link"
                            style={{ padding: 0 }}
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate(routes.driverListPage.path + `/driver-statistical?driverId=${id}`, {
                                    state: { action: 'driverStatistical', prevPath: location.pathname },
                                });
                            }}
                        >
                            <BarChartOutlined />
                        </Button>
                    </BaseTooltip>
                ),
                driverService: ({ id }) => (
                    <BaseTooltip title={translate.formatMessage(commonMessage.Service)}>
                        <Button
                            type="link"
                            style={{ padding: 0 }}
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate(routes.driverListPage.path + `/driver-service?driverId=${id}`, {
                                    state: { action: 'driverService', prevPath: location.pathname },
                                });
                            }}
                        >
                            <CalendarOutlined />
                        </Button>
                    </BaseTooltip>
                ),
                driverVehicle: ({ id, dataRow }) => (
                    <BaseTooltip title={translate.formatMessage(commonMessage.vehicle)}>
                        <Button
                            type="link"
                            style={{ padding: 0 }}
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate(routes.driverListPage.path + `/driver-vehicle/${id}?driverId=${id}`, {
                                    state: { action: 'driverVehicle', prevPath: location.pathname },
                                });
                            }}
                        >
                            <IconMotorbike size={16} />
                        </Button>
                    </BaseTooltip>
                ),
            });
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
            width: 150,
        },
        {
            title: translate.formatMessage(commonMessage.address),
            // dataIndex: 'data',
            render: (dataRow) => {
                return (
                    <p>
                        {dataRow?.address && <span>{dataRow?.address}, </span>}
                        {dataRow?.ward?.name && <span>{dataRow?.ward?.name}, </span>}
                        {dataRow?.district?.name && <span>{dataRow?.district?.name}, </span>}
                        {dataRow?.province?.name && <span>{dataRow?.province?.name}.</span>}
                    </p>
                );
            },
        },

        mixinFuncs.renderStatusColumn({ width: '120px' }),
        mixinFuncs.renderActionColumn(
            { statistical: true, driverService: true, driverVehicle: true, edit: true, delete: true },
            { width: '190px' },
        ),
    ].filter(Boolean);

    const setBreadRoutes = () => {
        const breadRoutes = [];

        breadRoutes.push({ breadcrumbName: translate.formatMessage(commonMessage.driver) });

        return breadRoutes;
    };
    const searchFields = [
        {
            key: 'fullName',
            placeholder: translate.formatMessage(commonMessage.name),
        },
        {
            key: 'status',
            placeholder: translate.formatMessage(commonMessage.status),
            type: FieldTypes.SELECT,
            options: statusValues,
        },
    ];
    return (
        <PageWrapper routes={setBreadRoutes()}>
            <ListPage
                actionBar={mixinFuncs.renderActionBar()}
                searchForm={mixinFuncs.renderSearchForm({ fields: searchFields, initialValues: queryFilter })}
                baseTable={
                    <BaseTable
                        onChange={changePagination}
                        pagination={pagination}
                        loading={loading}
                        dataSource={data}
                        columns={columns}
                    />
                }
            />
        </PageWrapper>
    );
}

export default DriverListPage;
