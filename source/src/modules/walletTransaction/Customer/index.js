import ListPage from '@components/common/layout/ListPage';
import PageWrapper from '@components/common/layout/PageWrapper';
import { AppConstants, DEFAULT_FORMAT, DEFAULT_TABLE_ITEM_SIZE, WALLET_KIND_CUSTOMER } from '@constants';
import apiConfig from '@constants/apiConfig';
import { FieldTypes } from '@constants/formConfig';
import { DriverServiceOptions, kindOptions, newsStateOptions, statusOptions, targetOptions } from '@constants/masterData';
import useListBase from '@hooks/useListBase';
import useTranslate from '@hooks/useTranslate';
import React, { useEffect, useState } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import BaseTable from '@components/common/table/BaseTable';
import { commonMessage } from '@locales/intl';
import AvatarField from '@components/common/form/AvatarField';
import { UserOutlined, CarOutlined } from '@ant-design/icons';
import { formatMoney } from '@utils';
import { useNavigate } from 'react-router-dom';
import routes from '@routes';

const message = defineMessages({
    objectName: 'Ví khách hàng',
});

function WalletCustomerListSum() {
    const translate = useTranslate();
    const navigate = useNavigate();
    const stateValues = translate.formatKeys(newsStateOptions, ['label']);
    const targetValues = translate.formatKeys(targetOptions, ['label']);
    const kindValues = translate.formatKeys(kindOptions, ['label']);

    const { data, mixinFuncs, queryFilter, loading, pagination, changePagination } = useListBase({
        apiConfig: {
            getList: apiConfig.walletTransaction.listSum,
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
                    walletKind: WALLET_KIND_CUSTOMER,
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
            title: translate.formatMessage(commonMessage.fullName),
            dataIndex: 'fullName',
        },
        {
            title: translate.formatMessage(commonMessage.phone),
            dataIndex: ['phone'],

            width: 130,
        },
        {
            title: <FormattedMessage defaultMessage="Tổng tiền nạp" />,
            dataIndex: 'totalMoneyDeposit',
            width: 150,
            align: 'right',
            render: (totalMoneyDeposit) => {
                const formattedValue = formatMoney(totalMoneyDeposit, {
                    groupSeparator: ',',
                    decimalSeparator: '.',
                    currentcy: 'đ',
                    currentDecimal: '0',
                });
                return <div>{formattedValue}</div>;
            },
        },{
            title: <FormattedMessage defaultMessage="Tổng tiền hoàn" />,
            dataIndex: 'totalMoneyRefund',
            width: 150,
            align: 'right',
            render: (totalMoneyRefund) => {
                const formattedValue = formatMoney(totalMoneyRefund, {
                    groupSeparator: ',',
                    decimalSeparator: '.',
                    currentcy: 'đ',
                    currentDecimal: '0',
                });
                return <div>{formattedValue}</div>;
            },
        },
        {
            title: <FormattedMessage defaultMessage="Tổng tiền trả" />,
            dataIndex: 'totalMoneyPay',
            width: 150,
            align: 'right',
            render: (totalMoneyPay) => {
                const formattedValue = formatMoney(totalMoneyPay, {
                    groupSeparator: ',',
                    decimalSeparator: '.',
                    currentcy: 'đ',
                    currentDecimal: '0',
                });
                return <div>{formattedValue}</div>;
            },
        },
        {
            title: <FormattedMessage defaultMessage="Tổng tiền rút" />,
            dataIndex: 'totalMoneyWithdraw',
            width: 150,
            align: 'right',
            render: (totalMoneyWithdraw) => {
                const formattedValue = formatMoney(totalMoneyWithdraw, {
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
            breadcrumbName: translate.formatMessage(message.objectName),
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
            placeholder: translate.formatMessage(commonMessage.state),
            type: FieldTypes.SELECT,
            options: kindValues,
            submitOnChanged: true,
        },
        {
            key: 'targe',
            placeholder: translate.formatMessage(commonMessage.state),
            type: FieldTypes.SELECT,
            options: targetValues,
            submitOnChanged: true,
        },
    ];

    return (
        <PageWrapper routes={setBreadRoutes()}>
            <ListPage
                // actionBar={mixinFuncs.renderActionBar()}

                // searchForm={mixinFuncs.renderSearchForm({ fields: searchFields, initialValues: queryFilter })}
                baseTable={
                    <BaseTable
                        onChange={changePagination}
                        pagination={pagination}
                        loading={loading}
                        dataSource={data}
                        columns={columns}
                        style={{ cursor: 'pointer' }}
                        onRow={(record) => ({
                            onClick: (e) => {
                                e.stopPropagation();
                                navigate(routes.walletListCustomerPage.path + `?customerId=${record?.id}`);
                            },
                        })}
                    />
                }
            />
        </PageWrapper>
    );
}

export default WalletCustomerListSum;
