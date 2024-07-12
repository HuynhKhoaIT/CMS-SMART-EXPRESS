import { UserOutlined } from "@ant-design/icons";
import ListPage from "@components/common/layout/ListPage";
import PageWrapper from "@components/common/layout/PageWrapper";
import {
    AppConstants,
    DATE_FORMAT_DISPLAY,
    DATE_FORMAT_END_OF_DAY_TIME,
    DATE_FORMAT_ZERO_TIME,
    DEFAULT_FORMAT,
    DEFAULT_TABLE_ITEM_SIZE,
    IS_BOOKING,
} from "@constants";
import apiConfig from "@constants/apiConfig";
import { FieldTypes } from "@constants/formConfig";
import { BookingOptions, statusOptions } from "@constants/masterData";
import useListBase from "@hooks/useListBase";
import useTranslate from "@hooks/useTranslate";
import routes from "@routes";
import { Button, Form, Modal, Tag, Tooltip } from "antd";
import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FormattedMessage, defineMessages } from "react-intl";
import BaseTable from "@components/common/table/BaseTable";
import { commonMessage } from "@locales/intl";
import { CommentOutlined } from "@ant-design/icons";
import { BaseTooltip } from "@components/common/form/BaseTooltip";
import AvatarField from "@components/common/form/AvatarField";
import useFetch from "@hooks/useFetch";
import {
    checkIsBooking,
    convertUtcToLocalTime,
    formatDateToEndOfDayTime,
    formatDateToZeroTime,
    formatMoney,
} from "@utils";
import useDisclosure from "@hooks/useDisclosure";
import BookingForm from "./BookingForm";
import BookingModal from "./BookingModal";
import ChatModal from "./ChatModal";
import dayjs from "dayjs";
const message = defineMessages({
    objectName: "Danh sách đặt xe",
    booking: "Danh sách đặt xe",
    code: "Mã chuyến xe",
    objectOrderName: "Danh sách đơn hàng",
    orders: "Danh sách đơn hàng",
    codeOrder: "Mã đơn hàng",
});

function BookingListPage() {
    const [form] = Form.useForm(); // Create a form instance using Ant Design Form.useForm hook
    const translate = useTranslate();
    const { pathname: pagePath } = useLocation();
    const location = useLocation();
    const navigate = useNavigate();
    const queryParameters = new URLSearchParams(window.location.search);
    const driverId = queryParameters.get("driverId");
    const stateValues = translate.formatKeys(BookingOptions, ["label"]);
    const statusValues = translate.formatKeys(statusOptions, ["label"]);
    const [openedBookingModal, handlerBookingModal] = useDisclosure(false);
    const [openedChatModal, handlerChatModal] = useDisclosure(false);

    const [detail, setDetail] = useState({});
    const [roomId, setRoomId] = useState();

    const { execute: executeGet, loading: loadingDetail } = useFetch(
        apiConfig.booking.getById,
        {
            immediate: false,
        },
    );
    const handleFetchDetail = (id) => {
        executeGet({
            pathParams: { id: id },
            onCompleted: (response) => {
                setDetail(response.data);
            },
            onError: mixinFuncs.handleGetDetailError,
        });
    };

    const {
        data,
        mixinFuncs,
        queryFilter,
        loading,
        pagination,
        changePagination,
    } = useListBase({
        apiConfig: apiConfig.booking,
        options: {
            pageSize: DEFAULT_TABLE_ITEM_SIZE,
            objectName: IS_BOOKING ? translate.formatMessage(message.objectName) : translate.formatMessage(message.objectOrderName),
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
                chat: ({ id, room }) => (
                    <BaseTooltip title={translate.formatMessage(commonMessage.chat)}>
                        <Button
                            style={!room ? { display: "none", padding: 0 } : { padding: 0 }}
                            type="link"
                            // style={{ padding: 0 }}
                            onClick={(e) => {
                                e.stopPropagation();
                                setRoomId(room?.id);
                                handlerChatModal.open();
                            }}
                        >
                            <CommentOutlined />
                        </Button>
                    </BaseTooltip>
                ),
            });
            const handleFilterSearchChange = funcs.handleFilterSearchChange;
            funcs.handleFilterSearchChange = (values) => {
                if (values.endDate == null && values.startDate == null) {
                    delete values.endDate;
                    delete values.startDate;
                    handleFilterSearchChange({
                        ...values,
                    });
                } else if (values.endDate == null) {
                    const startDate =
                        values.startDate && formatDateToZeroTime(values.startDate);
                    delete values.endDate;
                    handleFilterSearchChange({
                        ...values,
                        startDate: startDate,
                    });
                } else if (values.startDate == null) {
                    const endDate =
                        values.endDate && formatDateToEndOfDayTime(values.endDate);
                    delete values.startDate;
                    handleFilterSearchChange({
                        ...values,
                        endDate: endDate,
                    });
                } else {
                    const startDate =
                        values.startDate && formatDateToZeroTime(values.startDate);
                    const endDate =
                        values.endDate && formatDateToEndOfDayTime(values.endDate);
                    handleFilterSearchChange({
                        ...values,
                        startDate: startDate,
                        endDate: endDate,
                    });
                }
            };
            // funcs.getCreateLink = () => {
            //     return `${pagePath}/create?driverId=${driverId}`;
            // };
            // funcs.getItemDetailLink = (dataRow) => {
            //     return `${pagePath}/${dataRow.id}?driverId=${driverId}`;
            // };
        },
    });

    const columns = [
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
            title: "Code",
            dataIndex: "code",
            width: 70,
        },
        {
            title: <FormattedMessage defaultMessage="Khách hàng" />,
            dataIndex: "customer",
            render: (customer) => {
                return (
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <div>{customer?.name}</div>
                        <div>{customer?.phone}</div>
                    </div>
                );
            },
        },

        {
            title: <FormattedMessage defaultMessage="Tài xế" />,
            dataIndex: "driver",
            render: (driver) => {
                return (
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        {driver?.fullName && <div>{driver?.fullName}</div>}
                        {driver?.phone && <div>{driver?.phone}</div>}
                    </div>
                );
            },
        },

        {
            title: <FormattedMessage defaultMessage="Địa chỉ" />,
            width: "280px",
            render: (dataRow) => {
                return (
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            whiteSpace: "nowrap",
                            width: "280px",
                            overflow: "hidden",
                        }}
                    >
                        <Tooltip
                            placement="bottom"
                            title={dataRow?.pickupAddress}
                            color={"#000"}
                        >
                            <div
                                style={{
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                }}
                            >
                                <>
                                    {checkIsBooking(dataRow?.service?.kind)
                                        ? "Điểm đón: "
                                        : "Điểm lấy hàng: "}
                                </>
                                {dataRow?.pickupAddress}
                            </div>
                        </Tooltip>
                        <Tooltip
                            placement="bottom"
                            title={dataRow?.destinationAddress}
                            color={"#000"}
                        >
                            <div
                                style={{
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                }}
                            >
                                Điểm trả: {dataRow?.destinationAddress}
                            </div>
                        </Tooltip>
                    </div>
                );
            },
        },

        {
            title: <FormattedMessage defaultMessage="Khoảng cách" />,
            dataIndex: "distance",
            align: "center",
            width: "120px",
            render: (distance) => {
                if (distance < 1000) {
                    return <p>{distance} m</p>;
                } else {
                    return <p>{distance / 1000} km</p>;
                }
            },
        },
        {
            title: <FormattedMessage defaultMessage="Loại dịch vụ" />,
            dataIndex: ["service", "name"],
            width: 120,
        },
        {
            title: <FormattedMessage defaultMessage="Giá tiền" />,
            dataIndex: "money",
            width: 120,
            align: "right",
            render: (promotionMoney) => {
                const formattedValue = formatMoney(promotionMoney, {
                    groupSeparator: ",",
                    decimalSeparator: ".",
                    currentcy: "đ",
                    currentDecimal: "0",
                });
                return <div>{formattedValue}</div>;
            },
        },
        {
            title: <FormattedMessage defaultMessage="Khuyến mãi" />,
            dataIndex: "promotionMoney",
            width: 120,
            align: "right",
            render: (promotionMoney) => {
                const formattedValue = formatMoney(promotionMoney, {
                    groupSeparator: ",",
                    decimalSeparator: ".",
                    currentcy: "đ",
                    currentDecimal: "0",
                });
                return <div>{formattedValue}</div>;
            },
        },
        {
            title: translate.formatMessage(commonMessage.state),
            dataIndex: "state",
            align: "center",
            width: 100,
            render(dataRow) {
                const state = stateValues.find((item) => item.value == dataRow);
                return (
                    <Tag color={state.color}>
                        <div style={{ padding: "0 4px", fontSize: 14 }}>{state.label}</div>
                    </Tag>
                );
            },
        },
        // mixinFuncs.renderStatusColumn({ width: '100px' }),
        mixinFuncs.renderActionColumn(
            { chat: true, edit: true, delete: true },
            { width: "170px" },
        ),
    ].filter(Boolean);

    const setBreadRoutes = () => {
        const breadRoutes = [];
        breadRoutes.push({
            breadcrumbName: IS_BOOKING ? translate.formatMessage(message.booking) : translate.formatMessage(message.orders),
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
            key: "code",
            placeholder: translate.formatMessage(message.code),
        },
        {
            key: "serviceId",
            placeholder: translate.formatMessage(commonMessage.Service),
            type: FieldTypes.SELECT,
            options: serviceData,
        },
        {
            key: "state",
            placeholder: translate.formatMessage(commonMessage.state),
            type: FieldTypes.SELECT,
            options: stateValues,
        },
        {
            key: "startDate",
            type: FieldTypes.DATE,
            format: DATE_FORMAT_DISPLAY,
            placeholder: translate.formatMessage(commonMessage.startDate),
        },
        {
            key: "endDate",
            type: FieldTypes.DATE,
            format: DATE_FORMAT_DISPLAY,
            placeholder: translate.formatMessage(commonMessage.endDate),
        },
        // {
        //     key: 'status',
        //     placeholder: translate.formatMessage(commonMessage.status),
        //     type: FieldTypes.SELECT,
        //     options: statusValues,
        // },
    ];
    const initialFilterValues = useMemo(() => {
        const initialFilterValues = {
            ...queryFilter,
            startDate:
                queryFilter.startDate &&
                dayjs(formatDateToLocal(queryFilter.startDate), DEFAULT_FORMAT),
            endDate:
                queryFilter.endDate &&
                dayjs(formatDateToLocal(queryFilter.endDate), DEFAULT_FORMAT).subtract(
                    7,
                    "hour",
                ),
        };
        return initialFilterValues;
    }, [queryFilter?.startDate, queryFilter?.endDate]);

    return (
        <PageWrapper routes={setBreadRoutes()}>
            <ListPage
                // actionBar={mixinFuncs.renderActionBar()}
                searchForm={mixinFuncs.renderSearchForm({
                    fields: searchFields,
                    initialValues: initialFilterValues,
                })}
                baseTable={
                    <BaseTable
                        onRow={(record) => ({
                            onClick: (e) => {
                                e.stopPropagation();
                                handleFetchDetail(record.id);

                                handlerBookingModal.open();
                            },
                        })}
                        onChange={changePagination}
                        pagination={pagination}
                        loading={loading}
                        dataSource={data}
                        columns={columns}
                    />
                }
            />
            <Modal
                style={{ top: 20, position: "relative" }}
                title={checkIsBooking(detail?.service?.kind) ? 'Chi tiết booking' : 'Chi tiết đơn hàng'}
                open={openedBookingModal}
                destroyOnClose={true}
                // footer={null}
                onCancel={() => handlerBookingModal.close()}
                data={detail || {}}
                width={800}
                okText="Cập nhật"
                cancelText="Huỷ"
                onOk={() => form.submit()}
            >
                <BookingModal
                    form={form}
                    dataDetail={detail}
                    isEditing={true}
                    onCancel={handlerBookingModal.close}
                    getList={mixinFuncs.getList}
                />
            </Modal>
            <Modal
                style={{ top: "10%", position: "relative" }}
                title="Chi tiết hội thoại"
                open={openedChatModal}
                destroyOnClose={true}
                footer={false}
                data={detail || {}}
                onCancel={() => handlerChatModal.close()}
                width={700}
            >
                <ChatModal roomId={roomId || ""} />
            </Modal>
        </PageWrapper>
    );
}

export default BookingListPage;

const formatDateToLocal = (date) => {
    return convertUtcToLocalTime(date, DEFAULT_FORMAT, DEFAULT_FORMAT);
};
