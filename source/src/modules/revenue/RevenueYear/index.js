import React, { useMemo } from "react";
import ListPage from "@components/common/layout/ListPage";
import StackedBarChart from "@components/common/elements/rechart/StackedBarChart";
import { FieldTypes } from "@constants/formConfig";
import { DATE_FORMAT_YEAR_VALUE, DEFAULT_FORMAT } from "@constants";
import useTranslate from "@hooks/useTranslate";
import { commonMessage } from "@locales/intl";
import dayjs from "dayjs";
import { convertUtcToLocalTime } from "@utils";

export default function RevenueQuarterListPage({ data, mixinFuncs, loading, queryFilter }) {
    const currentDate = new Date();
    // First day of the current year
    const firstDayOfYear = new Date(currentDate.getFullYear(), 0, 1);

    // Last day of the current year
    const lastDayOfYear = new Date(currentDate.getFullYear(), 11, 31);
    const translate = useTranslate();
    const searchFields = [
        {
            key: 'startDate',
            type: FieldTypes.DATE,
            format: DATE_FORMAT_YEAR_VALUE,
            placeholder: translate.formatMessage(commonMessage.startDate),
            picker: 'year',
        },
        {
            key: 'endDate',
            type: FieldTypes.DATE,
            format: DATE_FORMAT_YEAR_VALUE,
            placeholder: translate.formatMessage(commonMessage.endDate),
            picker: 'year',
        },
    ].filter(Boolean);

    const initialFilterValues = useMemo(() => {
        console.log('queryFilter', queryFilter);
        const initialFilterValues = {
            ...queryFilter,
            startDate: queryFilter.startDate ? dayjs(formatDateToLocal(queryFilter.startDate), DEFAULT_FORMAT) : dayjs(formatDateToLocal(firstDayOfYear), DEFAULT_FORMAT),
            endDate:
                queryFilter.endDate ? dayjs(formatDateToLocal(queryFilter.endDate), DEFAULT_FORMAT) : dayjs(formatDateToLocal(lastDayOfYear), DEFAULT_FORMAT),
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