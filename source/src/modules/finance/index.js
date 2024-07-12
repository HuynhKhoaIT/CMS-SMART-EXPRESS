import ListPage from '@components/common/layout/ListPage';
import PageWrapper from '@components/common/layout/PageWrapper';
import { AppConstants, DATE_FORMAT_DISPLAY, DATE_FORMAT_END_OF_DAY_TIME, DATE_FORMAT_ZERO_TIME, DEFAULT_FORMAT, DEFAULT_TABLE_ITEM_SIZE } from '@constants';
import apiConfig from '@constants/apiConfig';
import { FieldTypes } from '@constants/formConfig';
import useListBase from '@hooks/useListBase';
import useTranslate from '@hooks/useTranslate';
import { Button, Flex, Form, Modal, Tag, Tooltip } from 'antd';
import React, { useMemo, useState } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import BaseTable from '@components/common/table/BaseTable';
import { commonMessage } from '@locales/intl';
import useFetch from '@hooks/useFetch';
import { convertUtcToLocalTime, exportToExcel, formatDateToEndOfDayTime, formatDateToZeroTime, formatMoney } from '@utils';
import dayjs from 'dayjs';
import { FileExcelOutlined } from '@ant-design/icons';

const message = defineMessages({
    objectName: 'Quản lý danh thu',
    booking: 'Quản lý danh thu',
    code: 'Mã chuyến xe',
});

function FinanceListPage() {
    const translate = useTranslate();

    const { data, mixinFuncs, queryFilter, loading, pagination, changePagination } = useListBase({
        apiConfig: {
            getList: apiConfig.booking.finance,
        },
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
    const { data: sumFinance, mixinFuncs: mixinFuncsGetSum, queryFilter: queryFilterGetSum, loading: loadingGetSum } = useListBase({
        apiConfig: {
            getList: apiConfig.booking.getSumFinance,
        },
        options: {
            pageSize: DEFAULT_TABLE_ITEM_SIZE,
            objectName: translate.formatMessage(message.objectName),
        },
        override: (funcs) => {
            funcs.mappingData = (response) => {
                try {
                    if (response.result === true) {
                        return {
                            data: response.data.totalProfit,
                        };
                    }
                } catch (error) {
                    return [];
                }
            };
        },
    });

    const columns = [
        {
            title: translate.formatMessage(commonMessage.createdDate),
            dataIndex: 'createdDate',
            width: '180px',
            render: (createdDate) => {
                const createdDateLocal = convertUtcToLocalTime(createdDate, DEFAULT_FORMAT, DEFAULT_FORMAT);
                return <div>{createdDateLocal}</div>;
            },
        },
        {
            title: 'Code',
            dataIndex: 'code',
            width: 70,
        },
        {
            title: <FormattedMessage defaultMessage="Khách hàng" />,
            dataIndex: 'customer',
            render: (customer) => {
                return (
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <div>{customer?.name}</div>
                        <div>{customer?.phone}</div>
                    </div>
                );
            },
        },
        {
            title: <FormattedMessage defaultMessage="Tài xế" />,
            dataIndex: 'driver',
            render: (driver) => {
                return (
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        {driver?.fullName && <div>{driver?.fullName}</div>}
                        {driver?.phone && <div>{driver?.phone}</div>}
                    </div>
                );
            },
        },

        {
            title: <FormattedMessage defaultMessage="Loại dịch vụ" />,
            dataIndex: ['service', 'name'],
            width: 120,
        },
        {
            title: <FormattedMessage defaultMessage="Giá tiền" />,
            dataIndex: 'money',
            width: 120,
            align: 'right',
            render: (promotionMoney) => {
                const formattedValue = formatMoney(promotionMoney, {
                    groupSeparator: ',',
                    decimalSeparator: '.',
                    currentcy: 'đ',
                    currentDecimal: '0',
                });
                return <div>{formattedValue}</div>;
            },
        },
        {
            title: <FormattedMessage defaultMessage="Khuyến mãi" />,
            dataIndex: 'promotionMoney',
            width: 120,
            align: 'right',
            render: (promotionMoney) => {
                const formattedValue = formatMoney(promotionMoney, {
                    groupSeparator: ',',
                    decimalSeparator: '.',
                    currentcy: 'đ',
                    currentDecimal: '0',
                });
                return <div>{formattedValue}</div>;
            },
        },
        {
            title: <FormattedMessage defaultMessage="Lợi nhuận" />,
            dataIndex: 'profit',
            width: 120,
            align: 'right',
            render: (profit) => {
                const formattedValue = formatMoney(profit, {
                    groupSeparator: ',',
                    decimalSeparator: '.',
                    currentcy: 'đ',
                    currentDecimal: '0',
                });
                return <div style={Number(profit) < 0 ? { color: 'red' } : { color: 'green' }}>{formattedValue}</div>;
            },
        },
    ].filter(Boolean);

    const setBreadRoutes = () => {
        const breadRoutes = [];
        breadRoutes.push({
            breadcrumbName: translate.formatMessage(message.booking),
        });

        return breadRoutes;
    };
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
            key: 'code',
            placeholder: translate.formatMessage(message.code),
        },
        {
            key: 'serviceId',
            placeholder: translate.formatMessage(commonMessage.Service),
            type: FieldTypes.SELECT,
            options: serviceData,
        },
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
                title={
                    <Flex justify='end' align='center'>
                        <p>Tổng lợi nhuận: {formatMoney(sumFinance, {
                            groupSeparator: ',',
                            decimalSeparator: '.',
                            currentcy: 'đ',
                            currentDecimal: '0',
                        })}</p>
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
                                    exportToExcel({ params: queryFilter, filename: 'doanh-thu', apiUrl: apiConfig.booking.exportFinance.baseURL });
                                }}
                            >
                                <FileExcelOutlined style={{ color: 'green' }} size={18} />
                            </Button>
                        </Tooltip>
                    </Flex>
                }
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

export default FinanceListPage;

const formatDateToLocal = (date) => {
    return convertUtcToLocalTime(date, DEFAULT_FORMAT, DEFAULT_FORMAT);
};

