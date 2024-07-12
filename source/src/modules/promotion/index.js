import { UserOutlined } from '@ant-design/icons';
import ListPage from '@components/common/layout/ListPage';
import PageWrapper from '@components/common/layout/PageWrapper';
import { AppConstants, DATE_FORMAT_DISPLAY, DEFAULT_FORMAT, DEFAULT_TABLE_ITEM_SIZE } from '@constants';
import apiConfig from '@constants/apiConfig';
import { FieldTypes } from '@constants/formConfig';
import { kindPromotionOptions, statePromotionOptions, statePromotionValueOptions, statusOptions } from '@constants/masterData';
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
import { IconMotorbike } from '@tabler/icons-react';
import { convertUtcToLocalTime } from '@utils';

const message = defineMessages({
    objectName: 'Khuyến mãi',
});

function PromotionListPage() {
    const translate = useTranslate();
    const { pathname: pagePath } = useLocation();
    const location = useLocation();
    const navigate = useNavigate();

    const statusValues = translate.formatKeys(statusOptions, ['label']);
    const { data, mixinFuncs, queryFilter, loading, pagination, changePagination } = useListBase({
        apiConfig: apiConfig.promotion,
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
        },
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
            title: translate.formatMessage(commonMessage.promotionName),
            dataIndex: 'name',
        },
        {
            title: translate.formatMessage(commonMessage.startDate),
            width: 180,
            dataIndex: 'startDate',
            align: 'right',
            render: (startDate) => {
                const startDateLocal = convertUtcToLocalTime(startDate, DEFAULT_FORMAT, DEFAULT_FORMAT);
                return <div>{startDateLocal}</div>;
            },
        },
        {
            title: translate.formatMessage(commonMessage.endDate),
            width: 180,
            dataIndex: 'endDate',
            align: 'right',
            render: (endDate) => {
                const endDateLocal = convertUtcToLocalTime(endDate, DEFAULT_FORMAT, DEFAULT_FORMAT);
                return <div>{endDateLocal}</div>;
            },
        },
        {
            title: translate.formatMessage(commonMessage.quantity),
            dataIndex: 'quantity',
            align: 'center',
            width: 150,
        },
        {
            title: translate.formatMessage(commonMessage.kind),
            dataIndex: 'kind',
            align: 'center',
            width: 160,
            render: (kind) => {
                const versionStatus = kindPromotionOptions.find((item) => item?.value == kind);
                return (
                    <Tag color={versionStatus?.color}>
                        <div style={{ padding: '0 4px', fontSize: 14, textTransform: 'capitalize' }}>
                            {versionStatus?.label.defaultMessage}
                        </div>
                    </Tag>
                );
            },
        },


        {
            title: translate.formatMessage(commonMessage.state),
            dataIndex: 'state',
            align: 'center',
            width: 160,
            render: (state) => {
                const versionStatus = statePromotionValueOptions.find((item) => item?.value == state);
                return (
                    <Tag color={versionStatus?.color}>
                        <div style={{ padding: '0 4px', fontSize: 14, textTransform: 'capitalize' }}>
                            {versionStatus?.label?.defaultMessage}
                        </div>
                    </Tag>
                );
            },
        },

        mixinFuncs.renderStatusColumn({ width: '120px' }),
        mixinFuncs.renderActionColumn(
            { driverService: true, driverVehicle: true, edit: true, delete: true },
            { width: '150px' },
        ),
    ].filter(Boolean);

    const setBreadRoutes = () => {
        const breadRoutes = [];

        breadRoutes.push({ breadcrumbName: translate.formatMessage(commonMessage.promotion) });

        return breadRoutes;
    };
    const searchFields = [
        {
            key: 'name',
            placeholder: translate.formatMessage(commonMessage.promotionName),
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

export default PromotionListPage;
