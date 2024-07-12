import apiConfig from '@constants/apiConfig';
import useListBase from '@hooks/useListBase';
import { Avatar, Button } from 'antd';
import React, { useMemo, useState } from 'react';
import BaseTable from '@components/common/table/BaseTable';
import { UserOutlined } from '@ant-design/icons';
import { AppConstants, DEFAULT_TABLE_ITEM_SIZE, DEFAULT_FORMAT, STATUS_ACTIVE, DATE_FORMAT_DISPLAY } from '@constants';
import PageWrapper from '@components/common/layout/PageWrapper';
import ListPage from '@components/common/layout/ListPage';
import { commonStatus, statusOptions, stateDriverOptions } from '@constants/masterData';
import { FieldTypes } from '@constants/formConfig';
import useTranslate from '@hooks/useTranslate';
import { convertUtcToLocalTime, formatDateToEndOfDayTime, formatDateToZeroTime } from '@utils';
import AvatarField from '@components/common/form/AvatarField';
import { commonMessage } from '@locales/intl';
import useFetch from '@hooks/useFetch';
import useQueryParams from '@hooks/useQueryParams';
import dayjs from 'dayjs';

const ActivityRateListPage = () => {
    const translate = useTranslate();
    const { params: queryParams, setQueryParams, deserializeParams } = useQueryParams();

    const queryParameters = new URLSearchParams(window.location.search);
    const serviceId = queryParameters.get('serviceId');
    const stateDriverValue = translate.formatKeys(stateDriverOptions, ['label']);


    const { data, mixinFuncs, queryFilter, loading, pagination } = useListBase({
        apiConfig: {
            getList: apiConfig.driver.listActivityRate,
        },
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
            const handleFilterSearchChange = funcs.handleFilterSearchChange;
            funcs.handleFilterSearchChange = (values) => {
                if (values.endDate == null && values.startDate == null) {
                    delete values.endDate;
                    delete values.startDate;
                    handleFilterSearchChange({
                        ...values,
                    });
                } else if (values.endDate == null) {
                    const startDate = values.startDate && formatDateToZeroTime(values.startDate);
                    delete values.endDate;
                    handleFilterSearchChange({
                        ...values,
                        startDate: startDate,
                    });
                } else if (values.startDate == null) {
                    const endDate = values.endDate && formatDateToEndOfDayTime(values.endDate);
                    delete values.startDate;
                    handleFilterSearchChange({
                        ...values,
                        endDate: endDate,
                    });
                } else {
                    const startDate = values.startDate && formatDateToZeroTime(values.startDate);
                    const endDate = values.endDate && formatDateToEndOfDayTime(values.endDate);
                    handleFilterSearchChange({
                        ...values,
                        startDate: startDate,
                        endDate: endDate,
                    });
                }
            };
        },
    });


    const columns = [
        {
            title: '#',
            dataIndex: ['avatar'],
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
        { title: translate.formatMessage(commonMessage.fullName), dataIndex: ['fullName'], width: 250 },
        { title: translate.formatMessage(commonMessage.phone), dataIndex: ['phone'] },
        { title: translate.formatMessage(commonMessage.averageRating), dataIndex: ['averageRating'], width: 200, align: 'center' },
        { title: translate.formatMessage(commonMessage.bookingAcceptRate), dataIndex: ['bookingAcceptRate'], width: 200, align: 'center' },
        { title: translate.formatMessage(commonMessage.bookingCancelRate), dataIndex: ['bookingCancelRate'], width: 200, align: 'center' },
        { title: translate.formatMessage(commonMessage.bookingDoneRate), dataIndex: ['bookingDoneRate'], width: 200, align: 'center' },

        // mixinFuncs.renderStatusColumn({ width: '130px' }),
        // mixinFuncs.renderActionColumn({ edit: true, delete: true }, { width: '120px' }),
    ];

    const searchFields = [
        {
            key: 'startDate',
            type: FieldTypes.DATE,
            format: DATE_FORMAT_DISPLAY,
            placeholder: translate.formatMessage(commonMessage.startDate),
        },
        {
            key: 'endDate',
            type: FieldTypes.DATE,
            format: DATE_FORMAT_DISPLAY,
            placeholder: translate.formatMessage(commonMessage.endDate),
        },
        // {
        //     key: 'status',
        //     placeholder: translate.formatMessage(commonMessage.status),
        //     type: FieldTypes.SELECT,
        //     options: statusValues,
        // },
    ];
    const initialFilterValues = useMemo(() => {
        const initialFilterValues = {
            ...queryFilter,
            startDate: queryFilter.startDate && dayjs(formatDateToLocal(queryFilter.startDate), DEFAULT_FORMAT),
            endDate:
                queryFilter.endDate && dayjs(formatDateToLocal(queryFilter.endDate), DEFAULT_FORMAT),
        };

        return initialFilterValues;
    }, [queryFilter?.startDate, queryFilter?.endDate]);

    return (
        <PageWrapper routes={[{ breadcrumbName: translate.formatMessage(commonMessage.activityRate) }]}>
            <ListPage
                searchForm={mixinFuncs.renderSearchForm({
                    fields: searchFields,
                    initialValues: initialFilterValues,
                })}
                // actionBar={mixinFuncs.renderActionBar()}
                baseTable={
                    <BaseTable
                        onChange={mixinFuncs.changePagination}
                        columns={columns}
                        loading={loading}
                        dataSource={data}
                        rowKey={(record) => record.id}
                        pagination={pagination}
                    />
                }
            />
        </PageWrapper>
    );
};

const formatDateToLocal = (date) => {
    return convertUtcToLocalTime(date, DEFAULT_FORMAT, DEFAULT_FORMAT);
};

export default ActivityRateListPage;
