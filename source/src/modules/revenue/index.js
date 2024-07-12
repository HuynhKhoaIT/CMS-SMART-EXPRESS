import React, { useState } from "react";
import PageWrapper from "@components/common/layout/PageWrapper";
import ListPage from "@components/common/layout/ListPage";
import apiConfig from "@constants/apiConfig";
import { DATE_FORMAT_END_OF_DAY_TIME, DATE_FORMAT_MONTH_VALUE, DATE_FORMAT_YEAR_VALUE, DATE_FORMAT_ZERO_TIME, DEFAULT_FORMAT, DEFAULT_TABLE_ITEM_SIZE, REVENUE_KIND_DAY, REVENUE_KIND_MONTH, REVENUE_KIND_QUARTER, REVENUE_KIND_YEAR, revenueStateTabs } from "@constants";
import useListBase from "@hooks/useListBase";
import useTranslate from "@hooks/useTranslate";
import { defineMessages } from "react-intl";
import { commonMessage } from "@locales/intl";
import { Tabs } from "antd";
import dayjs from "dayjs";
import RevenueDayListPage from "./RevenueDay";
import RevenueMonthListPage from "./RevenueMonth";
import RevenueQuarterListPage from "./RevenueQuarter";
import RevenueYearListPage from "./RevenueYear";
import { formatDateString, formatDateToEndOfDayTime, formatDateToZeroTime } from "@utils";
const message = defineMessages({
    objectName: 'Doanh thu',
});
function RevenueListPage() {
    const translate = useTranslate();
    const [activeTab, setActiveTab] = useState(revenueStateTabs[0].value);
    const queryParameters = new URLSearchParams(window.location.search);
    const currentDate = new Date();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDayOfMonth = new Date();
    const firstMonthOfYear = new Date(currentDate.getFullYear(), 0);
    const firstDayOfYear = new Date(currentDate.getFullYear(), 0, 1);

    // Last day of the current year
    const lastDayOfYear = new Date(currentDate.getFullYear(), 11, 31);

    const startDate = queryParameters.get('startDate');
    const endDate = queryParameters.get('endDate');

    const { data, mixinFuncs, queryFilter, loading, pagination, changePagination, queryParams, serializeParams } = useListBase({
        apiConfig: {
            getList: apiConfig.booking.revenue,
        },
        options: {
            pageSize: DEFAULT_TABLE_ITEM_SIZE,
            objectName: translate.formatMessage(message.objectName),
        },
        override: (funcs) => {
            funcs.mappingData = (response) => {
                if (response.result === true) {
                    return {
                        data: response.data,
                    };
                }
            };

            const prepareGetListParams = funcs.prepareGetListParams;
            funcs.prepareGetListParams = (params) => {
                if (!queryParameters.get('tabs')) {
                    setActiveTab(revenueStateTabs[0].value);
                    return {
                        ...prepareGetListParams(params),
                        tabs: REVENUE_KIND_DAY,
                        startDate: startDate ?? formatDateToZeroTime(firstDayOfMonth),
                        endDate: endDate ?? formatDateToEndOfDayTime(lastDayOfMonth),
                        kindStatistic: REVENUE_KIND_DAY,
                    };
                } else {
                    setActiveTab(queryParameters.get('tabs'));
                    return {
                        ...prepareGetListParams(params),
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
                    const startDate = values.startDate && formatStartDateFilter(values.startDate, activeTab);
                    const endDate = values.endDate && formatEndDateFilter(values.endDate, activeTab);

                    console.log('startDate', formatStartDateFilter(values.startDate, activeTab));
                    handleFilterSearchChange({
                        ...values,
                        startDate: startDate,
                        endDate: endDate,
                    });
                }
            };

            funcs.changeFilter = (filter) => {
                if (activeTab == REVENUE_KIND_DAY) {
                    mixinFuncs.setQueryParams(
                        serializeParams({
                            ...filter,
                            startDate: filter?.startDate ?? formatDateToZeroTime(firstDayOfMonth),
                            endDate: filter?.endDate ?? formatDateToEndOfDayTime(lastDayOfMonth),
                            tabs: activeTab,
                            kindStatistic: activeTab,
                        }),
                    );
                }
                else if (activeTab == REVENUE_KIND_MONTH) {
                    console.log(formatDateToZeroTime(firstMonthOfYear));
                    mixinFuncs.setQueryParams(
                        serializeParams({
                            ...filter,
                            startDate: filter?.startDate ?? formatDateToZeroTime(firstMonthOfYear),
                            endDate: filter?.endDate ?? formatDateToEndOfDayTime(lastDayOfMonth),

                            // startDate: filter?.startDate ?? dayjs(firstMonthOfYear).format(
                            //     DATE_FORMAT_MONTH_VALUE,
                            // ),
                            // endDate: filter?.endDate ?? dayjs(lastDayOfMonth).format(
                            //     DATE_FORMAT_MONTH_VALUE,
                            // ),
                            tabs: REVENUE_KIND_MONTH,
                            kindStatistic: REVENUE_KIND_MONTH,
                        }),
                    );
                }
                else if (activeTab == REVENUE_KIND_QUARTER) {
                    mixinFuncs.setQueryParams(
                        serializeParams({
                            startDate: startDate ?? dayjs(firstMonthOfYear).format(
                                DATE_FORMAT_MONTH_VALUE,
                            ),
                            endDate: endDate ?? dayjs(lastDayOfMonth).format(
                                DATE_FORMAT_MONTH_VALUE,
                            ),
                            tabs: REVENUE_KIND_QUARTER,
                            kindStatistic: REVENUE_KIND_QUARTER,
                            ...filter,
                        }),
                    );
                }
                else if (activeTab == REVENUE_KIND_YEAR) {
                    mixinFuncs.setQueryParams(
                        serializeParams({
                            ...filter,
                            startDate: filter?.startDate ?? dayjs(firstMonthOfYear).format(
                                DATE_FORMAT_MONTH_VALUE,
                            ),
                            endDate: filter?.endDate ?? dayjs(lastDayOfMonth).format(
                                DATE_FORMAT_MONTH_VALUE,
                            ),
                            tabs: REVENUE_KIND_YEAR,
                            kindStatistic: REVENUE_KIND_YEAR,
                        }),
                    );
                }
            };

        },
    });

    const setBreadRoutes = () => {
        const breadRoutes = [];
        breadRoutes.push({ breadcrumbName: translate.formatMessage(commonMessage.revenue) });
        return breadRoutes;
    };

    const dataTab = [
        {
            label: translate.formatMessage(commonMessage.revenueDay),
            key: REVENUE_KIND_DAY,
            children: <RevenueDayListPage data={data} mixinFuncs={mixinFuncs} queryFilter={queryFilter} loading={loading} />,
        },
        {
            label: translate.formatMessage(commonMessage.revenueMonth),
            key: REVENUE_KIND_MONTH,
            children: <RevenueMonthListPage data={data} mixinFuncs={mixinFuncs} queryFilter={queryFilter} loading={loading} />,
        }, {
            label: translate.formatMessage(commonMessage.revenueQuarter),
            key: REVENUE_KIND_QUARTER,
            children: <RevenueQuarterListPage data={data} mixinFuncs={mixinFuncs} queryFilter={queryFilter} loading={loading} />,
        }, {
            label: translate.formatMessage(commonMessage.revenueYear),
            key: REVENUE_KIND_YEAR,
            children: <RevenueYearListPage data={data} mixinFuncs={mixinFuncs} queryFilter={queryFilter} loading={loading} />,
        },

    ];

    const handleTabChange = (key) => {
        setActiveTab(key);
        if (key == REVENUE_KIND_DAY) {
            mixinFuncs.setQueryParams(
                serializeParams({
                    ...queryParameters,
                    startDate: formatDateToZeroTime(firstDayOfMonth),
                    endDate: formatDateToEndOfDayTime(lastDayOfMonth),
                    kindStatistic: REVENUE_KIND_DAY,
                }),
            );
        } else if (key == REVENUE_KIND_MONTH) {
            mixinFuncs.setQueryParams(
                serializeParams({
                    ...queryParameters,
                    tabs: key,
                    startDate: formatDateToZeroTime(firstMonthOfYear),
                    endDate: formatDateToEndOfDayTime(lastDayOfMonth),
                    kindStatistic: REVENUE_KIND_MONTH,
                }),
            );
        } else if (key == REVENUE_KIND_QUARTER) {
            mixinFuncs.setQueryParams(
                serializeParams({
                    ...queryParameters,
                    tabs: key,
                    startDate: formatDateToZeroTime(firstMonthOfYear),
                    endDate: formatDateToEndOfDayTime(lastDayOfMonth),
                    kindStatistic: REVENUE_KIND_QUARTER,
                }),
            );
        }
        else if (key == REVENUE_KIND_YEAR) {
            mixinFuncs.setQueryParams(
                serializeParams({
                    ...queryParameters,
                    tabs: key,
                    startDate: formatDateToZeroTime(firstDayOfYear),
                    endDate: formatDateToEndOfDayTime(lastDayOfYear),
                    kindStatistic: REVENUE_KIND_YEAR,
                }));
        }
    };


    return (
        <PageWrapper routes={setBreadRoutes()}>
            <ListPage
                baseTable={
                    <Tabs
                        style={{ marginTop: 20 }}
                        type="card"
                        onTabClick={handleTabChange}
                        activeKey={Number(activeTab)}
                        defaultActiveKey={queryParameters.get('tabs') ? Number(queryParameters.get('tabs')) : null}
                        items={dataTab.map((item) => {
                            return {
                                label: item.label,
                                key: item.key,
                                children: item.children,
                            };
                        })}
                    />

                }
            />
        </PageWrapper>
    );
}


const formatStartDateFilter = (date, activeTab) => {
    return formatDateToZeroTime(date);

    // if (activeTab == REVENUE_KIND_DAY) {
    //     return formatDateToZeroTime(date);
    // }
    // else if (activeTab == REVENUE_KIND_MONTH) {
    //     return dayjs(date, DEFAULT_FORMAT).format(DATE_FORMAT_MONTH_VALUE);
    // }
    // else if (activeTab == REVENUE_KIND_QUARTER) {
    //     return dayjs(date, DEFAULT_FORMAT).format(DATE_FORMAT_MONTH_VALUE);
    // }
    // else if (activeTab == REVENUE_KIND_YEAR) {
    //     return dayjs(date, DEFAULT_FORMAT).format(DATE_FORMAT_YEAR_VALUE);
    // }
};
const formatEndDateFilter = (date, activeTab) => {
    return formatDateToEndOfDayTime(date);
    // if (activeTab == REVENUE_KIND_DAY) {
    //     return formatDateToEndOfDayTime(date);
    // }
    // else if (activeTab == REVENUE_KIND_MONTH) {
    //     return dayjs(date, DEFAULT_FORMAT).format(DATE_FORMAT_MONTH_VALUE);
    // }
    // else if (activeTab == REVENUE_KIND_QUARTER) {
    //     return dayjs(date, DEFAULT_FORMAT).format(DATE_FORMAT_MONTH_VALUE);
    // }
    // else if (activeTab == REVENUE_KIND_YEAR) {
    //     return dayjs(date, DEFAULT_FORMAT).format(DATE_FORMAT_YEAR_VALUE);
    // }
};
// const formatDateToZeroTime = (date) => {
//     const dateString = formatDateString(date, DEFAULT_FORMAT);
//     console.log('dateString', dayjs(dateString, DEFAULT_FORMAT).format(DATE_FORMAT_ZERO_TIME));
//     return dayjs(dateString, DEFAULT_FORMAT).format(DATE_FORMAT_ZERO_TIME);
// };
// const formatDateToEndOfDayTime = (date) => {
//     const dateString = formatDateString(date, DEFAULT_FORMAT);
//     return dayjs(dateString, DEFAULT_FORMAT).format(DATE_FORMAT_END_OF_DAY_TIME);
// };

export default RevenueListPage;