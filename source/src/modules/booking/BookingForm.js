import { Card, Col, Row, DatePicker, Tooltip, Tag } from 'antd';
import React, { useEffect, useState } from 'react';
import useBasicForm from '@hooks/useBasicForm';
import useTranslate from '@hooks/useTranslate';
import TextField from '@components/common/form/TextField';
import { BaseForm } from '@components/common/form/BaseForm';
import AutoCompleteField from '@components/common/form/AutoCompleteField';
import { FormattedMessage } from 'react-intl';
import apiConfig from '@constants/apiConfig';
import { statusOptions, BookingOptions } from '@constants/masterData';
import SelectField from '@components/common/form/SelectField';
import { commonMessage } from '@locales/intl';
import NumericField from '@components/common/form/NumericField';
import { IconMapPin } from '@tabler/icons-react';
import { AppConstants, IS_BOOKING } from '@constants';
import CropImageField from '@components/common/form/CropImageField';
import useFetch from '@hooks/useFetch';

const BookingForm = ({ isEditing, formId, actions, dataDetail, onSubmit, setIsChangedFormValues, handleFocus }) => {
    const translate = useTranslate();
    const statusValues = translate.formatKeys(statusOptions, ['label']);
    const stateValues = translate.formatKeys(BookingOptions, ['label']);

    const [pickupImageUrl, setPickupImageUrl] = useState(null);
    const [deliveryImageUrl, setDeliveryImageUrl] = useState(null);

    const { execute: executeUpFile } = useFetch(apiConfig.file.upload);
    const [driverPhone, setDriverPhone] = useState();
    const { form, mixinFuncs, onValuesChange } = useBasicForm({
        onSubmit,
        setIsChangedFormValues,
    });

    useEffect(() => {
        if (!isEditing > 0) {
            form.setFieldsValue({
                state: stateValues[0].value,
                status: statusValues[1].value,
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
        setPickupImageUrl(dataDetail?.pickupImage);
        setDeliveryImageUrl(dataDetail?.deliveryImage);
    }, [dataDetail]);

    const handleSubmit = (values) => {
        // const filteredArray = Object.keys(values)
        //     .filter((key) => !isNaN(key))
        //     .map((key) => ({
        //         id: key,
        //         ...values[key],
        //     }));
        // values.listDetails = filteredArray;
        values.driverId = values?.driver?.id;
        return mixinFuncs.handleSubmit({
            ...values,
            status: statusValues[1].value,
            destinationLat: dataDetail.destinationLat,
            destinationLong: dataDetail.destinationLong,
            pickupLong: dataDetail.pickupLong,
            pickupLat: dataDetail.pickupLat,
        });
    };

    const handleDriver = (value, option) => {
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

    const uploadFilePickup = (file, onSuccess, onError) => {
        executeUpFile({
            data: {
                type: 'AVATAR',
                file: file,
            },
            onCompleted: (response) => {
                if (response.result === true) {
                    onSuccess();
                    setPickupImageUrl(response.data.filePath);
                    setIsChangedFormValues(true);
                }
            },
            onError: (error) => {
                onError();
            },
        });
    };
    const uploadFile = (file, onSuccess, onError) => {
        executeUpFile({
            data: {
                type: 'AVATAR',
                file: file,
            },
            onCompleted: (response) => {
                if (response.result === true) {
                    onSuccess();
                    setDeliveryImageUrl(response.data.filePath);
                    setIsChangedFormValues(true);
                }
            },
            onError: (error) => {
                onError();
            },
        });
    };
    return (
        <BaseForm formId={formId} onFinish={handleSubmit} form={form} onValuesChange={onValuesChange}>
            <Card>
                <Card
                    style={{ marginBottom: '10px' }}
                    size="small"
                    title={
                        IS_BOOKING ?
                            <FormattedMessage defaultMessage="Thông tin booking" /> : <FormattedMessage defaultMessage="Thông tin đơn hàng" />}
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

                                label={
                                    IS_BOOKING ?
                                        <FormattedMessage defaultMessage='Điểm đón' /> : <FormattedMessage defaultMessage='Điểm lấy hàng' />
                                } required
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
                                required
                                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                addonAfter="m"
                            />
                        </Col>
                        <Col span={12}>
                            <NumericField
                                label={<FormattedMessage defaultMessage="Tổng tiền" />}
                                name="money"
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
                                options={stateValues}
                            />
                        </Col>
                        <Col span={24}>
                            <TextField
                                type="textarea"
                                label={<FormattedMessage defaultMessage="Ghi chú" />}
                                name="customerNote"
                                rows={2}
                            />
                        </Col>
                    </Row>
                    {!IS_BOOKING && <Row gutter={12}>
                        <Col span={12}>
                            <CropImageField
                                label={<FormattedMessage defaultMessage="Avatar" />}
                                name="pickupImage"
                                imageUrl={pickupImageUrl && `${AppConstants.contentRootUrl}${pickupImageUrl}`}
                                aspect={1 / 1}
                                uploadFile={uploadFilePickup}
                            />
                        </Col>
                        <Col span={12}>
                            <CropImageField
                                label={<FormattedMessage defaultMessage="Avatar" />}
                                name="deliveryImage"
                                imageUrl={deliveryImageUrl && `${AppConstants.contentRootUrl}${deliveryImageUrl}`}
                                aspect={1 / 1}
                                uploadFile={uploadFile}
                            />


                        </Col>
                    </Row>}
                </Card>

                <Card
                    style={{ marginBottom: '10px' }}
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
                    style={{ marginBottom: '10px' }}
                    size="small"
                    title={<FormattedMessage defaultMessage="Thông tin tài xế" />}
                >
                    <Row gutter={16}>
                        <Col span={12}>
                            <AutoCompleteField
                                required
                                label={<FormattedMessage defaultMessage="Tài xế" />}
                                name={['driver', 'id']}
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
                        <Col span={12}>
                            <TextField
                                label={translate.formatMessage(commonMessage.phone)}
                                fieldValue={driverPhone}
                                disabled
                            />
                        </Col>
                    </Row>
                </Card>
                <Card
                    style={{ marginBottom: '10px' }}
                    size="small"
                    title={<FormattedMessage defaultMessage="Lịch sử thay đổi" />}
                >
                    {dataDetail?.bookingDetails?.map((item, index) => {
                        return (
                            <Card style={{ marginBottom: '10px' }} size="small" key={index}>
                                <Row gutter={16}>
                                    <Col span={12}>
                                        <Tag color={stateValues[index].color}>
                                            <div style={{ padding: '0 4px', fontSize: 14 }}>
                                                {IS_BOOKING ? stateValues[index].label : index == 2 ? 'Đã lấy hàng' : stateValues[index].label}
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
                <div className="footer-card-form">{actions}</div>
            </Card>
        </BaseForm>
    );
};

export default BookingForm;
