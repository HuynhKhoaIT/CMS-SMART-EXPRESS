import apiConfig from '@constants/apiConfig';
import useListBase from '@hooks/useListBase';
import { Avatar, Button } from 'antd';
import React, { useState } from 'react';
import BaseTable from '@components/common/table/BaseTable';
import { UserOutlined } from '@ant-design/icons';
import { AppConstants, DEFAULT_TABLE_ITEM_SIZE, DEFAULT_FORMAT, STATUS_ACTIVE } from '@constants';
import PageWrapper from '@components/common/layout/PageWrapper';
import ListPage from '@components/common/layout/ListPage';
import { commonStatus, statusOptions, stateDriverOptions } from '@constants/masterData';
import { FieldTypes } from '@constants/formConfig';
import useTranslate from '@hooks/useTranslate';
import { convertUtcToLocalTime } from '@utils';
import AvatarField from '@components/common/form/AvatarField';
import { commonMessage } from '@locales/intl';
import useFetch from '@hooks/useFetch';
import useQueryParams from '@hooks/useQueryParams';

const PositionListPage = () => {
    const translate = useTranslate();
    const { params: queryParams, setQueryParams, deserializeParams } = useQueryParams();

    const queryParameters = new URLSearchParams(window.location.search);
    const serviceId = queryParameters.get('serviceId');
    const stateDriverValue = translate.formatKeys(stateDriverOptions, ['label']);
    const { data: dataService, loading: loadingService } = useFetch(apiConfig.service.autocomplete, {
        immediate: true,
        mappingData: (res) => {
            let serviceOptions = [];
            res.data.content.map((service) => {
                serviceOptions.push({ value: service.id, label: service.name });
            });
            setQueryParams({ serviceId: serviceOptions[0].value });
            return { options: [...serviceOptions], data: res.data.content };
        },
    });

    const { data, mixinFuncs, queryFilter, loading, pagination } = useListBase({
        apiConfig: apiConfig.position,
        options: {
            pageSize: DEFAULT_TABLE_ITEM_SIZE,
            objectName: 'Position',
        },
        override: (funcs) => {
            funcs.getList = () => {
                const params = mixinFuncs.prepareGetListParams(queryFilter);
                mixinFuncs.handleFetchList({ ...params, status: STATUS_ACTIVE, serviceId: serviceId });
            };
            funcs.mappingData = (response) => {
                if (response.result === true) {
                    return {
                        data: response.data.content,
                        total: response.data.totalElements,
                    };
                }
            };
        },
    });

    const columns = [
        {
            title: '#',
            dataIndex: ['driver', 'avatar'],
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
        { title: translate.formatMessage(commonMessage.fullName), dataIndex: ['driver', 'fullName'] },
        {
            title: translate.formatMessage(commonMessage.timeUpdate),
            dataIndex: 'timeUpdate',
            width: '180px',
            render: (timeUpdate) => {
                const createdDateLocal = convertUtcToLocalTime(timeUpdate, DEFAULT_FORMAT, DEFAULT_FORMAT);
                return <div>{createdDateLocal}</div>;
            },
        },
        mixinFuncs.renderStatusColumn({ width: '130px' }),
        mixinFuncs.renderActionColumn({ edit: true, delete: true }, { width: '120px' }),
    ];

    const searchFields = [
        {
            key: 'serviceId',
            placeholder: translate.formatMessage(commonMessage.service),
            options: dataService?.options,
            type: FieldTypes.SELECT,
            width: '100px',
            required: true,
            submitOnChanged: true,
        },
        {
            key: 'state',
            placeholder: translate.formatMessage(commonMessage.state),
            options: stateDriverValue,
            type: FieldTypes.SELECT,
            width: '100px',
            submitOnChanged: true,
        },
    ];

    return (
        <PageWrapper routes={[{ breadcrumbName: translate.formatMessage(commonMessage.Position) }]}>
            <ListPage
                searchForm={mixinFuncs.renderSearchForm({
                    fields: searchFields,
                    initialValues: deserializeParams(queryParams),
                    hiddenAction: true,
                })}
                // actionBar={mixinFuncs.renderActionBar()}
                baseTable={
                    <BaseTable
                        onChange={mixinFuncs.changePagination}
                        columns={columns}
                        loading={loading || loadingService}
                        dataSource={data}
                        rowKey={(record) => record.id}
                        pagination={pagination}
                    />
                }
            />
        </PageWrapper>
    );
};

export default PositionListPage;
