import { UserOutlined, CarOutlined } from '@ant-design/icons';
import ListPage from '@components/common/layout/ListPage';
import PageWrapper from '@components/common/layout/PageWrapper';
import { AppConstants, DEFAULT_TABLE_ITEM_SIZE } from '@constants';
import apiConfig from '@constants/apiConfig';
import { FieldTypes } from '@constants/formConfig';
import { DriverServiceOptions, statusOptions } from '@constants/masterData';
import useListBase from '@hooks/useListBase';
import useTranslate from '@hooks/useTranslate';
import routes from '@routes';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { defineMessages } from 'react-intl';
import BaseTable from '@components/common/table/BaseTable';
import { commonMessage } from '@locales/intl';
import AvatarField from '@components/common/form/AvatarField';
import useFetch from '@hooks/useFetch';
import { Button } from 'antd';
import route from '@modules/customer/routes';

const message = defineMessages({
    objectName: 'Khách hàng',
});

function CustomerListPage() {
    const translate = useTranslate();
    const { pathname: pagePath } = useLocation();
    const location = useLocation();
    const navigate = useNavigate();
    const queryParameters = new URLSearchParams(window.location.search);
    const driverId = queryParameters.get('driverId');
    const statusValues = translate.formatKeys(statusOptions, ['label']);
    const { data, mixinFuncs, queryFilter, loading, pagination, changePagination } = useListBase({
        apiConfig: apiConfig.customer,
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
                booking: ({ id }) => (
                    <Button
                        type="link"
                        style={{ padding: 0, display: 'table-cell', verticalAlign: 'middle' }}
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(route.customerBookingListPage.path + `?customerId=${id}`);
                        }}
                    >
                        <CarOutlined />
                    </Button>
                ),
            });
        },
    });
    const { data: brands } = useFetch(apiConfig.category.autocomplete, {
        immediate: true,
        params: {
            kind: 1,
        },
        mappingData: ({ data }) =>
            data.content.map((item) => ({
                value: item.id,
                label: item.name,
            })),
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
            title: translate.formatMessage(commonMessage.name),
            dataIndex: 'name',
        },
        {
            title: translate.formatMessage(commonMessage.email),
            dataIndex: 'email',
            width: 130,
        },
        {
            title: translate.formatMessage(commonMessage.phone),
            dataIndex: 'phone',
            width: 150,
        },

        mixinFuncs.renderStatusColumn({ width: '120px' }),
        mixinFuncs.renderActionColumn({ booking: true, edit: true, delete: true }, { width: '120px' }),
    ].filter(Boolean);

    const setBreadRoutes = () => {
        const breadRoutes = [];
        breadRoutes.push({
            breadcrumbName: translate.formatMessage(commonMessage.Customer),
        });

        return breadRoutes;
    };
    const searchFields = [
        {
            key: 'name',
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

export default CustomerListPage;
