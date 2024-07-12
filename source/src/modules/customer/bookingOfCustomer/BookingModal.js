import React, { useEffect, useState } from 'react';
import apiConfig from '@constants/apiConfig';
import { FormattedMessage, defineMessages, useIntl } from 'react-intl';
import { BaseForm } from '@components/common/form/BaseForm';
import { Button, Card, Col, Form, Modal, Row, Space, Spin, Tag, Tooltip } from 'antd';
import TextField from '@components/common/form/TextField';
import AutoCompleteField from '@components/common/form/AutoCompleteField';
import { IconMapPin } from '@tabler/icons-react';
import NumericField from '@components/common/form/NumericField';
import SelectField from '@components/common/form/SelectField';
import { BookingOptions } from '@constants/masterData';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import useFetch from '@hooks/useFetch';
import useNotification from '@hooks/useNotification';
import MapModal from './MapModal';
import useDisclosure from '@hooks/useDisclosure';

const message = defineMessages({
    objectName: 'Danh sách đặt xe',
    booking: 'Danh sách đặt xe',
    cancel: 'Huỷ',
    update: 'Cập nhật',
    updateSuccess: 'Cập nhật thành công',
    updateDriver: 'Điều hướng tài xế thành công',
    updateError: 'Cập nhật thất bại',
});

const BookingModal = ({ form, dataDetail, isEditing, onCancel, getList }) => {
    const [openedMapModal, handlerMapModal] = useDisclosure(false);
    const [loading, setLoading] = useState(false);
    const notification = useNotification({ duration: 3 });
    const intl = useIntl();
    const [disabled, setDisabled] = useState(true);

    const translate = useTranslate();
    const stateValues = translate.formatKeys(BookingOptions, ['label']);
    const [driverPhone, setDriverPhone] = useState();
    const [driver, setDriver] = useState();
    const [driverBooking, setDriverBooking] = useState();
    const handleDriver = (value, option) => {
        setDisabled(false);
        if (option && option.props && option.props.otherData) {
            const driverPhone = option.props.otherData.phone;
            setDriverPhone(driverPhone);
        }
    };
    const pickup = (
        <div>
            <p>
                {dataDetail?.pickupLat}, {dataDetail?.pickupLong}
            </p>
        </div>
    );
    const destination = (
        <div>
            <p>
                {dataDetail?.destinationLat},{dataDetail?.destinationLong}
            </p>
        </div>
    );

    const { execute: executeUpdate } = useFetch(apiConfig.booking.update, { immediate: false });

    const handleOk = (values) => {
        // onCancel();
        updateBooking(values);
    };
    const updateBooking = (values) => {
        if (!values?.driver?.id && driver?.id) {
            setLoading(true);
        }

        executeUpdate({
            data: {
                id: dataDetail.id,
                code: values.code,
                customerNote: values.customerNote,
                destinationAddress: values.destinationAddress,
                distance: values.distance,
                money: values.money,
                pickupAddress: values.pickupAddress,
                promotionMoney: values.promotionMoney,
                service: values.service.id,
                pickupLat: dataDetail.pickupLat,
                pickupLong: dataDetail.pickupLong,
                destinationLat: dataDetail.destinationLat,
                destinationLong: dataDetail.destinationLong,
                state: values.state,
                driverId: values?.driver?.id ?? driver?.id ?? null,
                status: 1,
            },
            onCompleted: (response) => {
                if (driver?.id) {
                    setLoading(false);
                    getList();
                    notification({
                        message: intl.formatMessage(message.updateDriver),
                    });
                    setDriverBooking(driver);
                    setDriver(undefined);
                } else {
                    onCancel();
                    getList();
                    notification({
                        message: intl.formatMessage(message.updateSuccess),
                    });
                    setLoading(false);
                }
            },
            onError: (err) => {
                notification({ type: 'warning', message: translate.formatMessage(message.updateError) });
            },
        });
    };
    useEffect(() => {
        if (!isEditing > 0) {
            form.setFieldsValue({
                state: stateValues[0].value,
                // status: statusValues[1].value,
            });
        }
    }, [isEditing]);
    useEffect(() => {
        form.setFieldsValue({
            ...dataDetail,
            driverid: dataDetail?.driver?.id,
            serviceId: dataDetail?.service?.id,
        });
        setDriverPhone(dataDetail?.driver?.phone);
    }, [dataDetail]);

    return (
        <Spin spinning={loading}>
            <Form
                layout="vertical"
                onFinish={handleOk}
                form={form}
                style={{ maxHeight: '80vh', overflowY: 'scroll', marginRight: '-24px' }}
            >
                <Card
                    style={{ margin: '0 10px 10px 0' }}
                    size="small"
                    title={<FormattedMessage defaultMessage="Thông tin booking" />}
                >
                    <Row gutter={16}>
                        <Col span={12}>
                            <TextField
                                label={<FormattedMessage defaultMessage="Mã chuyến xe" />}
                                required
                                name="code"
                                disabled={isEditing}
                            />
                        </Col>
                        <Col span={12}>
                            <AutoCompleteField
                                required
                                label={<FormattedMessage defaultMessage="Dịch vụ" />}
                                name={['service', 'id']}
                                disabled={isEditing}
                                apiConfig={apiConfig.service.autocomplete}
                                mappingOptions={(item) => ({ value: item.id, label: item.name })}
                                searchParams={(text) => ({ name: text })}
                            />
                        </Col>
                        <Col span={22}>
                            <TextField
                                type="textarea"
                                rows={2}
                                label={<FormattedMessage defaultMessage="Điểm đón" />}
                                required
                                onChange={() => setDisabled(false)}
                                name="pickupAddress"
                            />
                        </Col>
                        <Col span={2} style={{ display: 'flex', alignItems: 'center' }}>
                            <Tooltip placement="bottom" title={pickup}>
                                <IconMapPin width={60} height={60} stroke-width={1} />
                            </Tooltip>
                        </Col>
                        <Col span={22}>
                            <TextField
                                type="textarea"
                                rows={2}
                                label={<FormattedMessage defaultMessage="Điểm trả" />}
                                name="destinationAddress"
                                onChange={() => setDisabled(false)}
                                required
                            />
                        </Col>
                        <Col span={2} style={{ display: 'flex', alignItems: 'center' }}>
                            <Tooltip placement="bottom" title={destination}>
                                <IconMapPin width={60} height={60} stroke-width={1} />
                            </Tooltip>
                        </Col>

                        <Col span={12}>
                            <NumericField
                                min={0}
                                label={<FormattedMessage defaultMessage="Khoảng cách" />}
                                name="distance"
                                onChange={() => setDisabled(false)}
                                required
                                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                addonAfter="m"
                            />
                        </Col>
                        <Col span={12}>
                            <NumericField
                                label={<FormattedMessage defaultMessage="Tổng tiền" />}
                                name="money"
                                onChange={() => setDisabled(false)}
                                min={0}
                                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                addonAfter="₫"
                                required
                            />
                        </Col>
                        <Col span={12}>
                            <NumericField
                                label={<FormattedMessage defaultMessage="Tiền khuyến mãi" />}
                                name="promotionMoney"
                                onChange={() => setDisabled(false)}
                                min={0}
                                required
                                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                addonAfter="₫"
                            />
                        </Col>

                        <Col span={12}>
                            <SelectField
                                required
                                name="state"
                                label={<FormattedMessage defaultMessage="Tình trạng" />}
                                allowClear={false}
                                onChange={() => setDisabled(false)}
                                options={stateValues}
                            />
                        </Col>
                        <Col span={24}>
                            <TextField
                                type="textarea"
                                label={<FormattedMessage defaultMessage="Ghi chú" />}
                                name="customerNote"
                                onChange={() => setDisabled(false)}
                                rows={2}
                            />
                        </Col>
                    </Row>
                </Card>

                <Card
                    style={{ margin: '0 10px 10px 0' }}
                    size="small"
                    title={<FormattedMessage defaultMessage="Thông tin khách hàng" />}
                >
                    <Row gutter={16}>
                        <Col span={12}>
                            <TextField
                                label={<FormattedMessage defaultMessage="Tên khách hàng" />}
                                name={['customer', 'name']}
                                disabled
                            />
                        </Col>
                        <Col span={12}>
                            <TextField
                                label={translate.formatMessage(commonMessage.phone)}
                                type="number"
                                name={['customer', 'phone']}
                                disabled
                            />
                        </Col>
                    </Row>
                </Card>
                <Card
                    style={{ margin: '0 10px 10px 0' }}
                    size="small"
                    title={<FormattedMessage defaultMessage="Thông tin tài xế" />}
                >
                    <Row gutter={16}>
                        {dataDetail?.driver || driverBooking ? (
                            <>
                                {driverBooking ? (
                                    <Col span={12}>
                                        <TextField
                                            label={<FormattedMessage defaultMessage="Tài xế" />}
                                            disabled={isEditing}
                                            fieldValue={driverPhone ?? driverBooking?.fullName}
                                        />
                                    </Col>
                                ) : (
                                    <Col span={12}>
                                        <AutoCompleteField
                                            required
                                            label={<FormattedMessage defaultMessage="Tài xế" />}
                                            name={['driver', 'id']}
                                            disabled={isEditing}
                                            apiConfig={apiConfig.driver.autocomplete}
                                            mappingOptions={(item) => ({
                                                value: item.id,
                                                label: item.fullName,
                                                otherData: { phone: item.phone },
                                            })}
                                            onChange={handleDriver}
                                            searchParams={(text) => ({ name: text })}
                                        />
                                    </Col>
                                )}

                                <Col span={12}>
                                    <TextField
                                        label={translate.formatMessage(commonMessage.phone)}
                                        fieldValue={driverPhone ?? driverBooking?.phone}
                                        disabled
                                    />
                                </Col>
                            </>
                        ) : (
                            <Row style={{ width: '100%' }}>
                                <Col span={12}>
                                    {driver && (
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span>Tài xế: {driver?.fullName}</span>
                                            <span>Số điện thoại: {driver?.phone}</span>
                                        </div>
                                    )}
                                </Col>
                                <Col span={12} style={{ display: 'flex', justifyContent: 'end' }}>
                                    <Space>
                                        <Button type="primary" onClick={() => handlerMapModal.open()}>
                                            Chọn tài xế
                                        </Button>
                                        <Button
                                            key="submit"
                                            type="primary"
                                            disabled={driver == null}
                                            htmlType="submit"
                                            style={{ marginLeft: '12px' }}
                                        >
                                            Điều hướng tài xế
                                        </Button>
                                    </Space>
                                </Col>
                            </Row>
                        )}
                    </Row>
                </Card>
                <Card
                    style={{ margin: '0 10px 10px 0' }}
                    size="small"
                    title={<FormattedMessage defaultMessage="Lịch sử thay đổi" />}
                >
                    {dataDetail?.bookingDetails?.map((item, index) => {
                        return (
                            <Card style={{ margin: '0 10px 10px 0' }} size="small" key={index}>
                                <Row gutter={16}>
                                    <Col span={12}>
                                        <Tag color={stateValues[index]?.color}>
                                            <div style={{ padding: '0 4px', fontSize: 14 }}>
                                                {stateValues[index]?.label}
                                            </div>
                                        </Tag>
                                    </Col>
                                    <Col span={12} style={{ textAlign: 'right' }}>
                                        {item.createdDate}
                                    </Col>
                                </Row>
                                <div>Ghi chú: {item.note}</div>
                            </Card>
                        );
                    })}
                </Card>
                <Modal
                    style={{ top: 20, position: 'relative' }}
                    open={openedMapModal}
                    onCancel={() => handlerMapModal.close()}
                    width={'70%'}
                    data={dataDetail || {}}
                    footer={null}
                >
                    <MapModal dataDetail={dataDetail} onCancel={handlerMapModal.close} setDriver={setDriver} />
                </Modal>
            </Form>
        </Spin>
    );
};
export default BookingModal;
