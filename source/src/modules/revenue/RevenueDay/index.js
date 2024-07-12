import React, { useMemo } from "react";
import ListPage from "@components/common/layout/ListPage";
import StackedBarChart from "@components/common/elements/rechart/StackedBarChart";
import { FieldTypes } from "@constants/formConfig";
import { DATE_FORMAT_DISPLAY, DEFAULT_FORMAT } from "@constants";
import useTranslate from "@hooks/useTranslate";
import { commonMessage } from "@locales/intl";
import dayjs from "dayjs";
import { convertUtcToLocalTime } from "@utils";

export default function RevenueDayListPage({ data, queryFilter, mixinFuncs, loading }) {
    const currentDate = new Date();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDayOfMonth = new Date();
    const translate = useTranslate();

    const searchFields = [
        {
            key: 'startDate',
            type: FieldTypes.DATE,
            format: DATE_FORMAT_DISPLAY,
            placeholder: translate.formatMessage(commonMessage.startDate),
            colSpan: 6,
        },
        {
            key: 'endDate',
            type: FieldTypes.DATE,
            format: DATE_FORMAT_DISPLAY,
            placeholder: translate.formatMessage(commonMessage.endDate),
            colSpan: 6,
        },
    ].filter(Boolean);

    const initialFilterValues = useMemo(() => {
        const initialFilterValues = {
            ...queryFilter,
            startDate: queryFilter.startDate ? dayjs(formatDateToLocal(queryFilter.startDate), DEFAULT_FORMAT) : dayjs(formatDateToLocal(firstDayOfMonth), DEFAULT_FORMAT),
            endDate:
                queryFilter.endDate ? dayjs(formatDateToLocal(queryFilter.endDate), DEFAULT_FORMAT).subtract(7, 'hour') : dayjs(formatDateToLocal(lastDayOfMonth), DEFAULT_FORMAT),
        };
        return initialFilterValues;
    }, [queryFilter?.startDate, queryFilter?.endDate]);

    return (
        <div>
            <ListPage
                searchForm={mixinFuncs.renderSearchForm({
                    fields: searchFields,
                    initialValues: initialFilterValues,
                })}
                loading={loading}
                baseTable={
                    <StackedBarChart dataSource={data} />
                } />
        </div>
    );
}


const formatDateToLocal = (date) => {
    return convertUtcToLocalTime(date, DEFAULT_FORMAT, DEFAULT_FORMAT);
};