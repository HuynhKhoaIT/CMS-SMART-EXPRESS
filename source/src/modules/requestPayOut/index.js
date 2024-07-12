import apiConfig from "@constants/apiConfig";
import useListBase from "@hooks/useListBase";
import React, { useEffect, useState } from "react";
import BaseTable from "@components/common/table/BaseTable";
import { UserOutlined } from "@ant-design/icons";
import {
    AppConstants,
    DEFAULT_TABLE_ITEM_SIZE,
    DEFAULT_FORMAT,
    REQUEST_PAY_OUT_STATE_INIT,
    REQUEST_PAY_OUT_STATE_APPROVE,
    REQUEST_PAY_OUT_STATE_REJECT,
    REQUEST_PAYOUT_KIND_DRIVER,
} from "@constants";
import PageWrapper from "@components/common/layout/PageWrapper";
import ListPage from "@components/common/layout/ListPage";
import useTranslate from "@hooks/useTranslate";
import { convertUtcToLocalTime, formatMoney } from "@utils";
import AvatarField from "@components/common/form/AvatarField";
import { commonMessage } from "@locales/intl";
import { defineMessages, useIntl } from "react-intl";
import { Button, Card, Col, Form, Modal, Row, Tabs, Tag } from "antd";
import { statePayout } from "@constants/masterData";
import { BaseTooltip } from "@components/common/form/BaseTooltip";
import { IconCheck, IconEye, IconX } from "@tabler/icons-react";
import useFetch from "@hooks/useFetch";
import { showErrorMessage, showSucsessMessage } from "@services/notifyService";
import useDisclosure from "@hooks/useDisclosure";
import { BaseForm } from "@components/common/form/BaseForm";
import InputTextField from "@components/common/form/InputTextField";
import RegisterPayoutModal from "./RegisterPayoutModal";
import CropImageField from "@components/common/form/CropImageField";

const message = defineMessages({
    objectName: "Yêu cầu rút tiền",
});
const RequestPatOutListPage = () => {
    const translate = useTranslate();
    const stateRequestPayout = translate.formatKeys(statePayout, ["label"]);
    const stateTabs = translate.formatKeys(statePayout, ["label"]);
    const queryParameters = new URLSearchParams(window.location.search);
    const tabActive = queryParameters.get("tabs");
    const state = queryParameters.get("state");

    const [requestId, setRequestId] = useState();
    const [activeTab, setActiveTab] = useState(tabActive || stateTabs[0].value);
    const intl = useIntl();
    const [openModalPreview, handlersModalPreview] = useDisclosure(false);
    const [dataModal, setDataModal] = useState();
    const [imageUrl, setImageUrl] = useState(null);

    const [openedModalReject, handlerModalReject] = useDisclosure(false);
    const [openedModalApprove, handlerModalApprove] = useDisclosure(false);

    const { execute: rejectRequestPayout, loading: loadingReject } = useFetch(
        apiConfig.requestPayout.updateState,
    );

    const {
        data,
        mixinFuncs,
        queryFilter,
        loading,
        pagination,
        serializeParams,
    } = useListBase({
        apiConfig: apiConfig.requestPayout,
        options: {
            pageSize: DEFAULT_TABLE_ITEM_SIZE,
            objectName: translate.formatMessage(message.objectName),
        },
        override: (funcs) => {
            funcs.getList = () => {
                const params = mixinFuncs.prepareGetListParams(queryFilter);
                mixinFuncs.handleFetchList({
                    state: state ? state : REQUEST_PAY_OUT_STATE_INIT,
                    kind:REQUEST_PAYOUT_KIND_DRIVER,
                    ...params,
                    
                });
            };
            funcs.changeFilter = (filter) => {
                mixinFuncs.setQueryParams(
                    serializeParams({
                        ...filter,
                    }),
                );
            };
            funcs.mappingData = (response) => {
                if (response.result === true) {
                    return {
                        data: response.data.content,
                        total: response.data.totalElements,
                    };
                }
            };
            funcs.additionalActionColumnButtons = () => ({
                reject: ({ id, state }) =>
                    state === REQUEST_PAY_OUT_STATE_INIT && (
                        <BaseTooltip title={translate.formatMessage(commonMessage.reject)}>
                            <Button
                                type="link"
                                style={{
                                    padding: 0,
                                    display: "table-cell",
                                    verticalAlign: "middle",
                                }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setRequestId(id);
                                    handlerModalReject.open();
                                    // showRejectItemConfirm(id);
                                }}
                            >
                                <IconX
                                    color={state === REQUEST_PAY_OUT_STATE_INIT ? "red" : "gray"}
                                    size={16}
                                />
                            </Button>
                        </BaseTooltip>
                    ),
                approve: ({ id, state }) =>
                    state === REQUEST_PAY_OUT_STATE_INIT && (
                        <BaseTooltip title={translate.formatMessage(commonMessage.approve)}>
                            <Button
                                type="link"
                                style={{
                                    padding: 0,
                                    display: "table-cell",
                                    verticalAlign: "middle",
                                }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setRequestId(id);
                                    handlerModalApprove.open();
                                }}
                            >
                                <IconCheck
                                    color={
                                        state === REQUEST_PAY_OUT_STATE_INIT ? "green" : "gray"
                                    }
                                    size={16}
                                />
                            </Button>
                        </BaseTooltip>
                    ),
                preview: (record) => (
                    <BaseTooltip title={translate.formatMessage(commonMessage.preview)}>
                        <Button
                            type="link"
                            style={{
                                padding: 0,
                                display: "table-cell",
                                verticalAlign: "middle",
                            }}
                            onClick={(e) => {
                                e.stopPropagation();
                                setDataModal(record);
                                handlersModalPreview.open();
                            }}
                        >
                            <IconEye size={16} />
                        </Button>
                    </BaseTooltip>
                ),
            });
        },
    });

    const handleFinish = (values) => {
        if (openedModalApprove) {
            values.image = imageUrl;
        }
        rejectRequestPayout({
            data: {
                id: requestId,
                state: openedModalReject ? REQUEST_PAY_OUT_STATE_REJECT : REQUEST_PAY_OUT_STATE_APPROVE,
                ...values,
            },
            onCompleted: (response) => {
                mixinFuncs.getList();
                if (openedModalReject) {
                    handlerModalReject.close();
                    if (response?.result == true) {
                        showSucsessMessage(translate.formatMessage(commonMessage.rejectPayoutSuccess));
                    }
                }
                else {
                    handlerModalApprove.close();
                    if (response?.result == true) {
                        showSucsessMessage(translate.formatMessage(commonMessage.approvePayoutSuccess));
                    }
                }

            },
            onError: (error) => {
                handlerModalReject.close();
            },
        });
        form.resetFields();
    };

    const columns = [
        {
            title: "Avatar",
            dataIndex: ["driver", "avatar"],
            align: "center",
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
            title: translate.formatMessage(commonMessage.driver),
            dataIndex: ["driver", "fullName"],
        },
        {
            title: translate.formatMessage(commonMessage.createdDate),
            dataIndex: "createdDate",
            width: "180px",
            render: (createdDate) => {
                const createdDateLocal = convertUtcToLocalTime(
                    createdDate,
                    DEFAULT_FORMAT,
                    DEFAULT_FORMAT,
                );
                return <div>{createdDateLocal}</div>;
            },
        },
        {
            title: translate.formatMessage(commonMessage.money),
            dataIndex: "money",
            render: (money) => {
                return <div>{formatMoneyValue(money)}</div>;
            },
            align: "right",
        },

        {
            title: translate.formatMessage(commonMessage.state),
            dataIndex: "state",
            align: "center",
            width: 120,
            render(dataRow) {
                const state = stateRequestPayout.find((item) => item.value == dataRow);
                return (
                    <Tag color={state.color}>
                        <div style={{ padding: "0 4px", fontSize: 14 }}>{state.label}</div>
                    </Tag>
                );
            },
        },
        mixinFuncs.renderActionColumn(
            { approve: true, reject: true, preview: true, delete: true },
            { width: "160px" },
        ),
    ];

    const [form] = Form.useForm();
    const { execute: executeUpFile } = useFetch(apiConfig.file.upload);
    const uploadFile = (file, onSuccess, onError) => {
        executeUpFile({
            data: {
                type: 'AVATAR',
                file: file,
            },
            onCompleted: (response) => {
                if (response.result === true) {
                    onSuccess();
                    setImageUrl(response.data.filePath);
                }
            },
            onError: (error) => {
                onError();
            },
        });
    };

    const formatMoneyValue = (value) => {
        return formatMoney(value, {
            groupSeparator: ",",
            decimalSeparator: ".",
            currentcy: "đ",
            currentDecimal: "0",
        });
    };

    const handleTabChange = (key) => {
        setActiveTab(key);
        if (key == 0) {
            mixinFuncs.setQueryParams(
                serializeParams({
                    ...queryParameters,
                    tabs: key,
                    state: REQUEST_PAY_OUT_STATE_INIT,
                }),
            );
        } else if (key == 1) {
            mixinFuncs.setQueryParams(
                serializeParams({
                    ...queryParameters,
                    tabs: key,
                    state: REQUEST_PAY_OUT_STATE_APPROVE,
                }),
            );
        } else if (key == 2) {
            mixinFuncs.setQueryParams(
                serializeParams({
                    ...queryParameters,
                    tabs: key,
                    state: REQUEST_PAY_OUT_STATE_REJECT,
                }),
            );
        }
    };
  
    return (
        <PageWrapper
            routes={[
                {
                    breadcrumbName: translate.formatMessage(commonMessage.requestPayOut),
                },
            ]}
        >
            <ListPage
                // searchForm={mixinFuncs.renderSearchForm({ fields: searchFields, initialValues: queryFilter })}
                // actionBar={mixinFuncs.renderActionBar()}
                baseTable={
                    <Tabs
                        style={{ marginTop: 20 }}
                        type="card"
                        onTabClick={handleTabChange}
                        activeKey={Number(activeTab)}
                        defaultActiveKey={
                            queryParameters.get("tabs")
                                ? Number(queryParameters.get("tabs"))
                                : null
                        }
                        items={stateTabs?.map((item) => ({
                            label: item?.label,
                            key: item.value,
                            children: (
                                <BaseTable
                                    style={{
                                        cursor: "pointer",
                                    }}
                                    onChange={mixinFuncs.changePagination}
                                    columns={columns}
                                    dataSource={data}
                                    loading={loading}
                                    pagination={pagination}
                                    // onRow={(record) => ({
                                    //     onClick: (e) => {
                                    //         e.stopPropagation();
                                    //     },
                                    // })}
                                    objectName={translate.formatMessage(message.objectName)}
                                />
                            ),
                        }))}
                    />
                }
            />
            <RegisterPayoutModal
                open={openModalPreview}
                onCancel={() => handlersModalPreview.close()}
                data={dataModal}
                width={800}
            />
            <Modal
                title={<span>Chấp nhận rút tiền</span>}
                open={openedModalApprove}
                onOk={() => form.submit()}
                okText="Đồng ý"
                cancelText="Hủy"
                onCancel={() => handlerModalApprove.close()}
            >
                <BaseForm
                    form={form}
                    onFinish={(values) => {
                        handleFinish(values);
                    }}
                    size="100%"
                >
                    <Row gutter={16}>
                        <CropImageField
                            label={translate.formatMessage(commonMessage.transactionImage)}
                            imageUrl={imageUrl && `${AppConstants.contentRootUrl}${imageUrl}`}
                            aspect={1 / 1}
                            uploadFile={uploadFile}
                            required
                        />
                        <Col span={24}>
                            <InputTextField
                                name='transactionCode'
                                label={translate.formatMessage(commonMessage.transactionCode)}
                                required
                            />
                        </Col>
                    </Row>
                </BaseForm>
            </Modal>
            <Modal
                title={<span>Từ chối rút tiền</span>}
                open={openedModalReject}
                onOk={() => form.submit()}
                okText="Đồng ý"
                cancelText="Hủy"
                onCancel={() => handlerModalReject.close()}
            >
                <BaseForm
                    form={form}
                    onFinish={(values) => {
                        handleFinish(values);
                    }}
                    size="100%"
                >
                    <Row gutter={16}>
                        <Col span={24}>
                            <InputTextField
                                name='note'
                                label="Lí do từ chối"
                                required />
                        </Col>
                    </Row>
                </BaseForm>
            </Modal>
        </PageWrapper>
    );
};

export default RequestPatOutListPage;
