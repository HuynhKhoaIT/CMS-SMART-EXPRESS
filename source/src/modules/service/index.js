import apiConfig from '@constants/apiConfig';
import useListBase from '@hooks/useListBase';
import { Avatar, Button } from 'antd';
import React from 'react';
import BaseTable from '@components/common/table/BaseTable';
import { UserOutlined } from '@ant-design/icons';
import { AppConstants, DEFAULT_TABLE_ITEM_SIZE, DEFAULT_FORMAT } from '@constants';
import PageWrapper from '@components/common/layout/PageWrapper';
import ListPage from '@components/common/layout/ListPage';
import { commonStatus, statusOptions } from '@constants/masterData';
import { FieldTypes } from '@constants/formConfig';
import useTranslate from '@hooks/useTranslate';
import { convertUtcToLocalTime } from '@utils';
import AvatarField from '@components/common/form/AvatarField';
import { commonMessage } from '@locales/intl';
import { formatMoney } from '@utils';
import useFetch from '@hooks/useFetch';
import { CATEGORY_KIND_SERVICE } from '@constants';
import { defineMessages } from 'react-intl';
import routes from '@routes';
import { useLocation } from 'react-router-dom';

const message = defineMessages({
    objectName: 'Quận, huyện',
    status: 'Status',
    province: 'Tỉnh, thành phố',
    district: 'Quận, huyện',
});
const ServiceListPage = () => {
    const translate = useTranslate();
    const queryParameters = new URLSearchParams(window.location.search);
    const categoryServiceId = queryParameters.get('categoryServiceId');
    const categoryServiceName = queryParameters.get('categoryServiceName');
    const { pathname: pagePath } = useLocation();
    const statusValues = translate.formatKeys(statusOptions, ['label']);
    const { data, mixinFuncs, queryFilter, loading, pagination, serializeParams } = useListBase({
        apiConfig: apiConfig.service,
        options: {
            pageSize: DEFAULT_TABLE_ITEM_SIZE,
            objectName: 'Service',
        },
        override: (funcs) => {
            funcs.getList = () => {
                const params = mixinFuncs.prepareGetListParams(queryFilter);
                mixinFuncs.handleFetchList({
                    ...params,
                    // kind: CATEGORY_KIND_SERVICE,
                    categoryId: categoryServiceId,
                });
            };
            funcs.changeFilter = (filter) => {
                mixinFuncs.setQueryParams(
                    serializeParams({
                        ...filter,
                        categoryServiceId: categoryServiceId,
                        categoryServiceName: categoryServiceName,
                    }),
                );
            };
            funcs.mappingData = (response) => {
                if (response.result === true) {
                    return {
                        data: response.data.content,
                        total: response.data.totalElements,
                    };
                }
            };
            funcs.getCreateLink = () => {
                return `${pagePath}/create?categoryServiceId=${categoryServiceId}&categoryServiceName=${categoryServiceName}`;
            };
            funcs.getItemDetailLink = (dataRow) => {
                return `${pagePath}/${dataRow.id}?categoryServiceId=${categoryServiceId}&categoryServiceName=${categoryServiceName}`;
            };
        },
    });

    const columns = [
        {
            title: '#',
            dataIndex: 'image',
            align: 'center',
            width: 100,
            render: (avatar) => (
                <AvatarField
                    size="large"
                    icon={<UserOutlined />}
                    src={avatar ? `${AppConstants.contentRootUrl}${avatar}` : null}
                />
            ),
        },
        { title: translate.formatMessage(commonMessage.Name), dataIndex: 'name' },
        { title: translate.formatMessage(commonMessage.service), dataIndex: ['category', 'name'] },
        // {
        //     title: translate.formatMessage(commonMessage.price),
        //     dataIndex: 'price',
        //     align: 'right',

        //     render: (price) => {
        //         const formattedValue = formatMoney(price, {
        //             currentcy: 'đ',
        //             currentDecimal: '0',
        //             groupSeparator: ',',
        //         });
        //         return <div>{formattedValue}</div>;
        //     },
        //     width: 130,
        // },
        {
            title: translate.formatMessage(commonMessage.createdDate),
            dataIndex: 'createdDate',
            width: '180px',
            render: (createdDate) => {
                const createdDateLocal = convertUtcToLocalTime(createdDate, DEFAULT_FORMAT, DEFAULT_FORMAT);
                return <div>{createdDateLocal}</div>;
            },
        },
        mixinFuncs.renderStatusColumn({ width: '130px' }),
        mixinFuncs.renderActionColumn({ edit: true, delete: true }, { width: '120px' }),
    ];
    const { data: serviceData } = useFetch(apiConfig.category.autocomplete, {
        immediate: true,
        params: {
            kind: 2,
        },
        mappingData: ({ data }) =>
            data.content.map((item) => ({
                value: item.id,
                label: item.name,
            })),
    });
    const searchFields = [
        {
            key: 'name',
            placeholder: translate.formatMessage(commonMessage.Name),
        },
        {
            key: 'categoryId',
            placeholder: translate.formatMessage(commonMessage.service),
            options: serviceData,
            type: FieldTypes.SELECT,
            width: '100px',
        },
        {
            key: 'status',
            placeholder: translate.formatMessage(commonMessage.status),
            options: statusValues,
            type: FieldTypes.SELECT,
            width: '100px',
        },
    ];

    return (
        <PageWrapper
            routes={[
                {
                    breadcrumbName: translate.formatMessage(commonMessage.ServiceCategory),
                    path: '/service-category',
                },
                { breadcrumbName: translate.formatMessage(commonMessage.Service) },
            ]}
        >
            <ListPage
                searchForm={mixinFuncs.renderSearchForm({ fields: searchFields, initialValues: queryFilter })}
                actionBar={mixinFuncs.renderActionBar()}
                baseTable={
                    <BaseTable
                        onChange={mixinFuncs.changePagination}
                        columns={columns}
                        dataSource={data}
                        loading={loading}
                        pagination={pagination}
                    />
                }
            />
        </PageWrapper>
    );
};

export default ServiceListPage;
