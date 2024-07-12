import React from 'react';
import { AppConstants, DEFAULT_TABLE_ITEM_SIZE } from '@constants';
import useListBase from '@hooks/useListBase';
import { UserOutlined, DeleteOutlined } from '@ant-design/icons';
import PageWrapper from '@components/common/layout/PageWrapper';
import ListPage from '@components/common/layout/ListPage';
import BaseTable from '@components/common/table/BaseTable';
import { statusOptions } from '@constants/masterData';
import useTranslate from '@hooks/useTranslate';
import { FieldTypes } from '@constants/formConfig';
import apiConfig from '@constants/apiConfig';
import { defineMessages } from 'react-intl';
import { Button, Tag } from 'antd';
import { commonMessage } from '@locales/intl';
import AvatarField from '@components/common/form/AvatarField';
import { CATEGORY_KIND_SERVICE } from '@constants';
import { useNavigate } from 'react-router-dom';
import styles from './categoryService.module.scss';
import routes from '../routes';

const message = defineMessages({
    objectName: 'Loại',
    name: 'Tên',
    status: 'Trạng thái',
    createDate: 'Ngày tạo',
});

const CategoryServiceListPage = () => {
    const translate = useTranslate();
    const navigate = useNavigate();
    const statusValues = translate.formatKeys(statusOptions, ['label']);

    const { data, mixinFuncs, queryFilter, loading, pagination, changePagination } = useListBase({
        apiConfig: apiConfig.category,
        options: {
            pageSize: DEFAULT_TABLE_ITEM_SIZE,
            objectName: translate.formatMessage(message.objectName),
        },
        override: (funcs) => {
            funcs.additionalActionColumnButtons = () => {
                return {
                    deleteItem: ({ buttonProps, ...dataRow }) => {
                        return (
                            <Button
                                {...buttonProps}
                                type="link"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    mixinFuncs.showDeleteItemConfirm(dataRow._id);
                                }}
                                style={{ padding: 0 }}
                            >
                                <DeleteOutlined />
                            </Button>
                        );
                    },
                };
            };
            const prepareGetListParams = funcs.prepareGetListParams;
            funcs.prepareGetListParams = (params) => {
                return {
                    ...prepareGetListParams(params),
                    kind: CATEGORY_KIND_SERVICE,
                };
            };
        },
    });
    const handleOnClick = (event, record) => {
        event.preventDefault();
        navigate(routes.serviceListPage.path + `?categoryServiceId=${record.id}&categoryServiceName=${record.name}`);
    };

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
        {
            title: translate.formatMessage(message.name),
            dataIndex: 'name',
            render: (name, record) => {
                return (
                    <div onClick={(event) => handleOnClick(event, record)} className={styles.customDiv}>
                        {name}
                    </div>
                );
            },
        },
        {
            title: translate.formatMessage(message.createDate),
            dataIndex: 'createdDate',
            align: 'center',
            width: 180,
        },
        // {
        //     title: translate.formatMessage(message.status),
        //     dataIndex: 'status',
        //     align: 'center',
        //     width: 120,
        //     render(dataRow) {
        //         const status = statusValues.find((item) => item.value == dataRow);

        //         return <Tag color={status.color}>{status.label}</Tag>;
        //     },
        // },
        mixinFuncs.renderStatusColumn({ width: '120px' }),
        mixinFuncs.renderActionColumn({ edit: true, delete: true }, { width: '120px' }),
    ];

    const searchFields = [
        {
            key: 'name',
            placeholder: translate.formatMessage(message.name),
        },
        {
            key: 'status',
            placeholder: translate.formatMessage(message.status),
            type: FieldTypes.SELECT,
            options: statusValues,
        },
    ];

    return (
        <PageWrapper routes={[{ breadcrumbName: translate.formatMessage(commonMessage.ServiceCategory) }]}>
            <ListPage
                searchForm={mixinFuncs.renderSearchForm({ fields: searchFields, initialValues: queryFilter })}
                actionBar={mixinFuncs.renderActionBar()}
                baseTable={
                    <BaseTable
                        onChange={changePagination}
                        pagination={pagination}
                        loading={loading}
                        dataSource={data}
                        columns={columns}
                        rowKey={(record) => record?.id}
                    />
                }
            />
        </PageWrapper>
    );
};

export default CategoryServiceListPage;
