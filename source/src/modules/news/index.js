import { UserOutlined, DeleteOutlined } from '@ant-design/icons';
import ListPage from '@components/common/layout/ListPage';
import PageWrapper from '@components/common/layout/PageWrapper';
import { AppConstants, DEFAULT_FORMAT, DEFAULT_TABLE_ITEM_SIZE, NEWS_STATE_PUBLISHED } from '@constants';
import apiConfig from '@constants/apiConfig';
import { FieldTypes } from '@constants/formConfig';
import { DriverServiceOptions, kindOptions, newsStateOptions, statusOptions, targetOptions } from '@constants/masterData';
import useListBase from '@hooks/useListBase';
import useTranslate from '@hooks/useTranslate';
import routes from '@routes';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FormattedMessage, defineMessages } from 'react-intl';
import BaseTable from '@components/common/table/BaseTable';
import { commonMessage } from '@locales/intl';
import AvatarField from '@components/common/form/AvatarField';
import useFetch from '@hooks/useFetch';
import { Button, Modal, Tag } from 'antd';
import route from '@modules/customer/routes';
import { convertUtcToLocalTime } from '@utils';
import { BaseTooltip } from '@components/common/form/BaseTooltip';
import { EyeOutlined } from '@ant-design/icons';
import ReactQuill from 'react-quill';
import styles from './index.module.scss';
import Image from '@components/common/elements/Image';
const message = defineMessages({
    objectName: 'Tin tức',
});

function NewsListPage() {
    const translate = useTranslate();
    const stateValues = translate.formatKeys(newsStateOptions, ['label']);
    const targetValues = translate.formatKeys(targetOptions, ['label']);
    const kindValues = translate.formatKeys(kindOptions, ['label']);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [content, setContent] = useState();

    const { data, mixinFuncs, queryFilter, loading, pagination, changePagination } = useListBase({
        apiConfig: apiConfig.news,
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
            funcs.additionalActionColumnButtons = () => ({
                preview: (content) => (
                    <BaseTooltip title={translate.formatMessage(commonMessage.preview)}>
                        <Button
                            type="link"
                            style={{ padding: 0 }}
                            onClick={(e) => {
                                e.stopPropagation();
                                setContent(content);
                                setIsModalVisible(true);
                            }}
                        >
                            <EyeOutlined />
                        </Button>
                    </BaseTooltip>
                ),
                delete: ({ id, buttonProps,state }) => {
                    if (!mixinFuncs.hasPermission(apiConfig.delete?.baseURL)) return null;
                    return (
                        <BaseTooltip type="delete" objectName={translate.formatMessage(message.objectName)}>
                            <Button

                                {...buttonProps}
                                type="link"
                                disabled={state == NEWS_STATE_PUBLISHED}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    mixinFuncs.showDeleteItemConfirm(id);
                                }}
                                style={{ padding: 0 }}
                            >
                                <DeleteOutlined style={state !== NEWS_STATE_PUBLISHED? { color: 'red' }:{}} />
                            </Button>
                        </BaseTooltip>
                    );
                },
            });

        },
    });


    const columns = [
        {
            title: '#',
            dataIndex: 'banner',
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
            title: translate.formatMessage(commonMessage.title),
            dataIndex: 'title',
        },
        {
            title: <FormattedMessage defaultMessage="Ngày gửi" />,
            dataIndex: ['publishedDate'],
            render: (date) => {
                const result = convertUtcToLocalTime(date, DEFAULT_FORMAT, DEFAULT_FORMAT);
                return <div>{result}</div>;
            },
            width: 180,
        },

        {
            title: <FormattedMessage defaultMessage="Đối tượng" />,
            dataIndex: 'target',
            align: 'center',
            width: 120,
            render(dataRow) {
                const state = targetValues.find((item) => item.value == dataRow);
                return (
                    <Tag color={state.color}>
                        <div style={{ padding: '0 4px', fontSize: 14 }}>{state.label}</div>
                    </Tag>
                );
            },
        },
        {
            title: <FormattedMessage defaultMessage="Loại" />,
            dataIndex: 'kind',
            align: 'center',
            width: 120,
            render(dataRow) {
                const state = kindValues.find((item) => item.value == dataRow);
                return (
                    <Tag color={state.color}>
                        <div style={{ padding: '0 4px', fontSize: 14 }}>{state.label}</div>
                    </Tag>
                );
            },
        },
        {
            title: <FormattedMessage defaultMessage="Tình trạng" />,
            dataIndex: 'state',
            align: 'center',
            width: 120,
            render(dataRow) {
                const state = stateValues.find((item) => item.value == dataRow);
                return (
                    <Tag color={state.color}>
                        <div style={{ padding: '0 4px', fontSize: 14 }}>{state.label}</div>
                    </Tag>
                );
            },
        },
        // {
        //     title: translate.formatMessage(commonMessage.email),
        //     dataIndex: 'email',
        //     width: 130,
        // },
        // {
        //     title: translate.formatMessage(commonMessage.phone),
        //     dataIndex: 'phone',
        //     width: 150,
        // },

        mixinFuncs.renderActionColumn({ preview: true, edit: true, delete: true }, { width: '120px' }),
    ].filter(Boolean);

    const setBreadRoutes = () => {
        const breadRoutes = [];
        breadRoutes.push({
            breadcrumbName: translate.formatMessage(commonMessage.news),
        });

        return breadRoutes;
    };


    const searchFields = [

        {
            key: 'state',
            placeholder: translate.formatMessage(commonMessage.state),
            type: FieldTypes.SELECT,
            options: stateValues,
            submitOnChanged: true,
        },
        {
            key: 'kind',
            placeholder: translate.formatMessage(commonMessage.kind),
            type: FieldTypes.SELECT,
            options: kindValues,
            submitOnChanged: true,
        },
        {
            key: 'targe',
            placeholder: translate.formatMessage(commonMessage.targe),
            type: FieldTypes.SELECT,
            options: targetValues,
            submitOnChanged: true,
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
            <Modal
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
                centered
                closable={false}
                width={500}
            >
                {content &&
                    <div style={{ height: 800, overflow: 'scroll' }} className={styles.content}>
                        <Image src={content.banner} />
                        <p className={styles.title}>
                            {content.title}
                        </p>
                        <ReactQuill value={content.content} readOnly={true} theme={'bubble'} style={{ lineHeight: '2', width: '100%', padding: 0 }} />
                    </div>
                }
            </Modal>
        </PageWrapper>
    );
}

export default NewsListPage;
