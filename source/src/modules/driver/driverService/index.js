import { UserOutlined } from '@ant-design/icons';
import ListPage from '@components/common/layout/ListPage';
import PageWrapper from '@components/common/layout/PageWrapper';
import { AppConstants, DEFAULT_TABLE_ITEM_SIZE } from '@constants';
import apiConfig from '@constants/apiConfig';
import { FieldTypes } from '@constants/formConfig';
import { DriverServiceOptions, statusOptions } from '@constants/masterData';
import useListBase from '@hooks/useListBase';
import useTranslate from '@hooks/useTranslate';
import routes from '@routes';
import { Button, Tag } from 'antd';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { defineMessages } from 'react-intl';
import BaseTable from '@components/common/table/BaseTable';
import { commonMessage } from '@locales/intl';
import { CalendarOutlined } from '@ant-design/icons';
import { BaseTooltip } from '@components/common/form/BaseTooltip';
import AvatarField from '@components/common/form/AvatarField';
import useFetch from '@hooks/useFetch';
const message = defineMessages({
    objectName: 'Dịch vụ',
});

function DriverServiceListPage() {
    const translate = useTranslate();
    const { pathname: pagePath } = useLocation();
    const location = useLocation();
    const navigate = useNavigate();
    const queryParameters = new URLSearchParams(window.location.search);
    const driverId = queryParameters.get('driverId');
    const stateValues = translate.formatKeys(DriverServiceOptions, ['label']);
    const statusValues = translate.formatKeys(statusOptions, ['label']);

    const { data, mixinFuncs, queryFilter, loading, pagination, changePagination } = useListBase({
        apiConfig: apiConfig.driverService,
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
            funcs.getCreateLink = () => {
                return `${pagePath}/create?driverId=${driverId}`;
            };
            funcs.getItemDetailLink = (dataRow) => {
                return `${pagePath}/${dataRow.id}?driverId=${driverId}`;
            };
        },
    });

    const columns = [
        {
            title: '#',
            dataIndex: ['service', 'image'],
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
            dataIndex: ['driver', 'fullName'],
        },
        {
            title: translate.formatMessage(commonMessage.Service),
            dataIndex: ['service', 'name'],
        },
        {
            title: translate.formatMessage(commonMessage.ratioShare),
            dataIndex: 'ratioShare',
            width: 120,
            align: 'center',
            render(ratioShare) {
                return <p>{ratioShare}%</p>;
            },
        },
        {
            title: translate.formatMessage(commonMessage.state),
            dataIndex: 'state',
            align: 'center',
            width: 120,
            render(dataRow) {
                const state = stateValues.find((item) => item.value == dataRow);
                return (
                    <Tag color={state.color}>
                        <div style={{ padding: '0 4px', fontSize: 14 }}>{state.label}</div>
                    </Tag>
                );
            },
        },
        mixinFuncs.renderStatusColumn({ width: '120px' }),
        mixinFuncs.renderActionColumn({ edit: true, delete: true }, { width: '120px' }),
    ].filter(Boolean);

    const setBreadRoutes = () => {
        const breadRoutes = [];

        breadRoutes.push({
            breadcrumbName: translate.formatMessage(commonMessage.driver),
            path: routes.driverListPage.path,
        });
        breadRoutes.push({
            breadcrumbName: translate.formatMessage(commonMessage.driverService),
        });

        return breadRoutes;
    };
    const { data: driverData } = useFetch(apiConfig.driver.autocomplete, {
        immediate: true,
        // params: {
        //     kind: 1,
        // },
        mappingData: ({ data }) =>
            data.content.map((item) => ({
                value: item.id,
                label: item.fullName,
            })),
    });
    const { data: serviceData } = useFetch(apiConfig.service.autocomplete, {
        immediate: true,
        // params: {
        //     kind: 1,
        // },
        mappingData: ({ data }) =>
            data.content.map((item) => ({
                value: item.id,
                label: item.name,
            })),
    });
    const searchFields = [
        {
            key: 'driverId',
            placeholder: translate.formatMessage(commonMessage.driver),
            type: FieldTypes.SELECT,
            options: driverData,
        },
        {
            key: 'serviceId',
            placeholder: translate.formatMessage(commonMessage.Service),
            type: FieldTypes.SELECT,
            options: serviceData,
        },
        {
            key: 'state',
            placeholder: translate.formatMessage(commonMessage.state),
            type: FieldTypes.SELECT,
            options: stateValues,
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

export default DriverServiceListPage;
