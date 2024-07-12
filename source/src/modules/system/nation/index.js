import ListPage from '@components/common/layout/ListPage';
import PageWrapper from '@components/common/layout/PageWrapper';
import BaseTable from '@components/common/table/BaseTable';
import { DEFAULT_TABLE_ITEM_SIZE } from '@constants';
import apiConfig from '@constants/apiConfig';
import useListBase from '@hooks/useListBase';
import useTranslate from '@hooks/useTranslate';
import React, { useState } from 'react';
import { defineMessages } from 'react-intl';
import { useLocation, useNavigate } from 'react-router-dom';
import routes from './routes';
import useQueryParams from '@hooks/useQueryParams';
import styles from './nation.module.scss';

const messages = defineMessages({
    name: 'Name',
    postalCode: 'Postal Code',
    action: 'Action',
    province: 'Tỉnh, thành phố',
    objectName: 'Tỉnh, thành phố',
});
function NationListPage() {
    const translate = useTranslate();
    const navigate = useNavigate();
    const [breadCrumbRoutes, setBreadCrumbRoutes] = useState([]);

    const { data, mixinFuncs, queryFilter, loading, pagination } = useListBase({
        apiConfig: apiConfig.nation,
        options: {
            pageSize: DEFAULT_TABLE_ITEM_SIZE,
            objectName: translate.formatMessage(messages.objectName),
        },
        override: (funcs) => {
            funcs.mappingData = (response) => {
                if (response.result === true) {
                    return {
                        data: response.data.content,
                        total: response.data.totalElements,
                    };
                }
            };
            funcs.getList = () => {
                const params = mixinFuncs.prepareGetListParams(queryFilter);
                mixinFuncs.handleFetchList({ ...params, kind: 1 });
            };
        },
    });

    const handleOnClick = (event, record) => {
        event.preventDefault();
        navigate(routes.nationListPage.path + `/district?provinceId=${record.id}&provinceName=${record.name}`);
    };
    const columns = [
        {
            title: translate.formatMessage(messages.province),
            dataIndex: 'name',
            render: (name, record) => {
                return (
                    <div onClick={(event) => handleOnClick(event, record)} className={styles.customDiv}>
                        {name}
                    </div>
                );
            },
        },
        mixinFuncs.renderStatusColumn({ width: '120px' }),
        mixinFuncs.renderActionColumn({ edit: true, delete: true }, { width: '130px' }),
    ];
    const searchFields = [
        {
            key: 'name',
            placeholder: translate.formatMessage(messages.province),
        },
    ];
    return (
        <PageWrapper routes={[{ breadcrumbName: translate.formatMessage(messages.province) }]}>
            <ListPage
                searchForm={mixinFuncs.renderSearchForm({ fields: searchFields, initialValues: queryFilter })}
                actionBar={mixinFuncs.renderActionBar()}
                baseTable={
                    <BaseTable
                        onChange={mixinFuncs.changePagination}
                        columns={columns}
                        dataSource={data}
                        loading={loading}
                        rowKey={(record) => record?.id}
                        pagination={pagination}
                    />
                }
            />
        </PageWrapper>
    );
}

export default NationListPage;
