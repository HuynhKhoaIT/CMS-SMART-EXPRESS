import ListPage from '@components/common/layout/ListPage';
import PageWrapper from '@components/common/layout/PageWrapper';
import { AppConstants, DATE_FORMAT_DISPLAY, DEFAULT_FORMAT, DEFAULT_TABLE_ITEM_SIZE } from '@constants';
import apiConfig from '@constants/apiConfig';
import { FieldTypes } from '@constants/formConfig';
import { DriverServiceOptions, kindOptions, newsStateOptions, statusOptions, targetOptions, walletValueKind } from '@constants/masterData';
import useListBase from '@hooks/useListBase';
import useTranslate from '@hooks/useTranslate';
import React, { useEffect, useMemo, useState } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import BaseTable from '@components/common/table/BaseTable';
import { commonMessage } from '@locales/intl';
import AvatarField from '@components/common/form/AvatarField';
import { UserOutlined, CarOutlined } from '@ant-design/icons';
import { convertUtcToLocalTime, exportToExcel, formatDateToEndOfDayTime, formatDateToZeroTime, formatMoney } from '@utils';
import { Button, Flex, Tag, Tooltip } from 'antd';
import routes from '../routes';
import dayjs from 'dayjs';
import { FileExcelOutlined } from '@ant-design/icons';

const message = defineMessages({
    objectName: 'Lịch sử ví',
});

function WalletListPage() {
    const translate = useTranslate();
    const stateValues = translate.formatKeys(newsStateOptions, ['label']);
    const targetValues = translate.formatKeys(targetOptions, ['label']);
    const kindValues = translate.formatKeys(walletValueKind, ['label']);
    const queryParameters = new URLSearchParams(window.location.search);
    const driverId = queryParameters.get('driverId');
    const { data, mixinFuncs, queryFilter, loading, pagination, changePagination } = useListBase({
        apiConfig: {
            getList: apiConfig.walletTransaction.getList,
        },
        options: {
            pageSize: DEFAULT_TABLE_ITEM_SIZE,
            objectName: translate.formatMessage(message.objectName),
        },
        override: (funcs) => {
            const prepareGetListParams = funcs.prepareGetListParams;
            funcs.prepareGetListParams = (params) => {
                return {
                    ...prepareGetListParams(params),
                    driverId,
                };
            };
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
            title: 'Ngày tạo',
            dataIndex: 'createdDate',
            align: 'left',
            width: 200,
            render: (createdDate) => {
                const createdDateLocal = convertUtcToLocalTime(createdDate, DEFAULT_FORMAT, DEFAULT_FORMAT);
                return <div>{createdDateLocal}</div>;
            },
        }, {
            title: translate.formatMessage(commonMessage.driver),
            dataIndex: ['wallet', 'driver', 'fullName'],
        },
        {
            title: translate.formatMessage(commonMessage.kind),
            dataIndex: 'kind',
            align: 'center',
            width: 120,
            render(dataRow) {
                const state = kindValues.find((item) => item.value == dataRow);
                return (
                    <Tag color={state?.color}>
                        <div style={{ padding: '0 4px', fontSize: 14 }}>{state?.label ?? ""}</div>
                    </Tag>
                );
            },
        },

        {
            title: <FormattedMessage defaultMessage="Tổng tiền" />,
            dataIndex: 'money',
            width: 150,
            align: 'right',
            render: (totalMoneyReceive) => {
                const formattedValue = formatMoney(totalMoneyReceive, {
                    groupSeparator: ',',
                    decimalSeparator: '.',
                    currentcy: 'đ',
                    currentDecimal: '0',
                });
                return <div>{formattedValue}</div>;
            },
        },

    ].filter(Boolean);

    const setBreadRoutes = () => {
        const breadRoutes = [];
        breadRoutes.push({
            breadcrumbName: translate.formatMessage(commonMessage.wallet),
            path: routes.walletListSum.path,
        });
        breadRoutes.push({
            breadcrumbName: translate.formatMessage(commonMessage.walletTransaction),
        });
        return breadRoutes;
    };


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
    ];
    const initialFilterValues = useMemo(() => {
        const initialFilterValues = {
            ...queryFilter,
            startDate: queryFilter.startDate && dayjs(formatDateToLocal(queryFilter.startDate), DEFAULT_FORMAT),
            endDate:
                queryFilter.endDate && dayjs(formatDateToLocal(queryFilter.endDate), DEFAULT_FORMAT).subtract(7, 'hour'),
        };
        return initialFilterValues;
    }, [queryFilter?.startDate, queryFilter?.endDate]);


    return (
        <PageWrapper routes={setBreadRoutes()}>
            <ListPage
                // actionBar={mixinFuncs.renderActionBar()}
                title={<Flex justify='end'>
                    <Tooltip title={<FormattedMessage defaultMessage={'Export'} />}>
                        <Button
                            type="link"
                            style={{
                                padding: 0,
                                marginTop: '-5px',
                                marginLeft: 10,
                                display: 'table-cell',
                                verticalAlign: 'middle',
                            }}
                            onClick={(e) => {
                                e.stopPropagation();
                                exportToExcel({ params: queryFilter, filename: 'Lich-su-giao-dich', apiUrl: apiConfig.walletTransaction.exportTransaction.baseURL });
                            }}
                        >
                            <FileExcelOutlined style={{ color: 'green' }} size={18} />
                        </Button>
                    </Tooltip>
                </Flex>}
                searchForm={mixinFuncs.renderSearchForm({ fields: searchFields, initialValues: initialFilterValues })}
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

export default WalletListPage;
const formatDateToLocal = (date) => {
    return convertUtcToLocalTime(date, DEFAULT_FORMAT, DEFAULT_FORMAT);
};