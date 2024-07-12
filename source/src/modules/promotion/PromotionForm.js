import { Card, Col, Row, DatePicker } from 'antd';
import React, { useEffect, useState } from 'react';
import useBasicForm from '@hooks/useBasicForm';
import useTranslate from '@hooks/useTranslate';
import TextField from '@components/common/form/TextField';
import { BaseForm } from '@components/common/form/BaseForm';
import DatePickerField from '@components/common/form/DatePickerField';
import { DATE_FORMAT_DISPLAY, DATE_FORMAT_VALUE, DEFAULT_FORMAT, DEFAULT_FORMAT_ZERO_SECOND, PROMOTION_STATE_INIT, statePromotionValue } from '@constants/index';
import { convertUtcToLocalTime, formatDateString } from '@utils/index';
import dayjs from 'dayjs';
import useFetch from '@hooks/useFetch';
import { FormattedMessage, defineMessages } from 'react-intl';
import apiConfig from '@constants/apiConfig';
import { kindPromotionOptions, statePromotionValueOptions, statusOptions } from '@constants/masterData';
import SelectField from '@components/common/form/SelectField';
import CropImageField from '@components/common/form/CropImageField';
import { AppConstants, nationKinds } from '@constants';
import { commonMessage } from '@locales/intl';
import NumericField from '@components/common/form/NumericField';
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

const PromotionForm = ({ serviceOptions, isEditing, formId, actions, dataDetail, onSubmit, setIsChangedFormValues, handleFocus }) => {
    const translate = useTranslate();
    const [imageUrl, setImageUrl] = useState(null);
    const [activeKind, setActiveKind] = useState();
    const { execute: executeUpFile } = useFetch(apiConfig.file.upload);
    const statusValues = translate.formatKeys(statusOptions, ['label']);
    const kindPromotionValues = translate.formatKeys(kindPromotionOptions, ['label']);
    const statePromotionValues = translate.formatKeys(statePromotionValueOptions, ['label']);

    const { form, mixinFuncs, onValuesChange } = useBasicForm({
        onSubmit,
        setIsChangedFormValues,
    });

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
                    setIsChangedFormValues(true);
                }
            },
            onError: (error) => {
                onError();
            },
        });
    };

    useEffect(() => {
        if (!isEditing > 0) {
            setActiveKind(kindPromotionOptions[0].value);

            form.setFieldsValue({
                status: statusValues[1].value,
                kind: kindPromotionOptions[0].value,
                state: statePromotionValueOptions[0]?.value,
            });
        }
    }, [isEditing]);



    useEffect(() => {
        if(!isEditing){
            return;
        }
        const serviceData = dataDetail?.services?.map((item) => {
            return item.id;
        });
        setActiveKind(dataDetail?.kind);
        dataDetail.startDate = dataDetail.startDate && dayjs(convertUtcToLocalTime(dataDetail.startDate, DEFAULT_FORMAT, DEFAULT_FORMAT), DEFAULT_FORMAT_ZERO_SECOND);
        dataDetail.endDate = dataDetail.endDate && dayjs(convertUtcToLocalTime(dataDetail.endDate, DEFAULT_FORMAT, DEFAULT_FORMAT), DEFAULT_FORMAT_ZERO_SECOND);

        form.setFieldsValue({
            ...dataDetail,
            serviceIds:serviceData,
        });
        setImageUrl(dataDetail.avatar);
    }, [dataDetail]);

    const handleSubmit = (values) => {
        values.startDate = values.startDate && dayjs(values?.startDate).utc().format(DEFAULT_FORMAT);
        values.endDate = values.endDate && dayjs(values?.endDate).utc().format(DEFAULT_FORMAT);
        return mixinFuncs.handleSubmit({
            ...values,
            avatar: imageUrl,
        });
    };
    const validateStartDate = (_, value) => {
        const date = dayjs(formatDateString(new Date(), DATE_FORMAT_DISPLAY), DATE_FORMAT_VALUE);
        if (date && value && value.isBefore(date)) {
            return Promise.reject('Ngày bắt đầu phải lớn hơn hoặc bằng ngày hiện tại');
        }
        return Promise.resolve();
    };

    const validateDueDate = (_, value) => {
        const { startDate } = form.getFieldValue();
        if (startDate && value && value.isBefore(startDate)) {
            return Promise.reject('Ngày kết thúc phải lớn hơn ngày bắt đầu');
        }
        return Promise.resolve();
    };

    return (
        <BaseForm formId={formId} onFinish={handleSubmit} form={form} onValuesChange={onValuesChange}>
            <Card>
                <Row gutter={16}>
                    <Col span={12}>
                        <CropImageField
                            label={<FormattedMessage defaultMessage="Ảnh đại diện" />}
                            name="avatar"
                            imageUrl={imageUrl && `${AppConstants.contentRootUrl}${imageUrl}`}
                            aspect={1 / 1}
                            uploadFile={uploadFile}
                        />
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <TextField label={translate.formatMessage(commonMessage.promotionName)} required name="name" />
                    </Col>
                    <Col span={12}>
                        <SelectField
                            required
                            label={<FormattedMessage defaultMessage="Trạng thái" />}
                            name="status"
                            options={statusValues}
                        />
                    </Col>

                    <Col span={12}>
                        <DatePickerField
                            name="startDate"
                            label={<FormattedMessage defaultMessage="Ngày bắt đầu" />}
                            placeholder="Ngày bắt đầu"
                            format={DEFAULT_FORMAT_ZERO_SECOND}
                            style={{ width: '100%' }}
                            showTime
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng chọn ngày bắt đầu',
                                },
                                {
                                    validator: validateStartDate,
                                },
                            ]}
                        />
                    </Col>

                    <Col span={12}>
                        <DatePickerField
                            label={<FormattedMessage defaultMessage="Ngày kết thúc" />}
                            name="endDate"
                            showTime
                            placeholder="Ngày kết thúc"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng chọn ngày kết thúc',
                                },
                                {
                                    validator: validateDueDate,
                                },
                            ]}
                            format={DEFAULT_FORMAT_ZERO_SECOND}
                            style={{ width: '100%' }}
                        />
                    </Col>
                    <Col span={24}>
                        <SelectField
                            mode="multiple"
                            required
                            allowClear
                            label={<FormattedMessage defaultMessage="Danh sách dịch vụ" />}
                            name="serviceIds"
                            options={serviceOptions}
                        />
                    </Col>

                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <NumericField
                            required
                            label={<FormattedMessage defaultMessage="Số lượng" />}
                            name="quantity"
                            min={0}
                        />
                    </Col>
                    <Col span={12}>
                        <SelectField
                            required
                            label={<FormattedMessage defaultMessage="Loại" />}
                            name="kind"
                            onChange={(value) => {
                                setActiveKind(value);
                            }}
                            options={kindPromotionValues}
                        />
                    </Col>
                   
                </Row>
                {activeKind == kindPromotionOptions[0].value ?
                    (
                        <Row gutter={16}>
                            <Col span={12}>
                                <NumericField
                                    label={<FormattedMessage defaultMessage="Giới hạn tối thiểu" />}
                                    name="limitValueMin"
                                    min={0}
                                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    addonAfter="₫"
                                />
                            </Col>
                            <Col span={12}>
                                <NumericField
                                    label={<FormattedMessage defaultMessage="Phần trăm giảm" />}
                                    name="discountValue"
                                    min={0}
                                    required
                                    max={100}
                                    addonAfter="%"
                                />
                            </Col>
                           
                            <Col span={12}>
                                <NumericField
                                    label={<FormattedMessage defaultMessage="Giới hạn tối đa" />}
                                    name="limitValueMax"
                                    min={0}
                                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    addonAfter="₫"
                                />
                            </Col>
                            
                        </Row>
                    ) : (
                        <Row gutter={16}>
                            <Col span={12}>
                                <NumericField
                                    label={<FormattedMessage defaultMessage="Giới hạn tối thiểu" />}
                                    name="limitValueMin"
                                    min={0}
                                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    addonAfter="₫"
                                />
                            </Col>
                            <Col span={12}>
                                <NumericField
                                    label={<FormattedMessage defaultMessage="Giá giảm" />}
                                    name="discountValue"
                                    required
                                    min={0}
                                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    addonAfter="đ"
                                />
                            </Col>
                           
                        </Row>
                    )}

                {isEditing ?
                    (
                        <Col span={12}>
                            <SelectField
                                required
                                label={<FormattedMessage defaultMessage="Tình trạng" />}
                                name="state"
                                options={[
                                    {
                                        value: statePromotionValue.PROMOTION_STATE_INIT,
                                        label: statePromotionValues[0].label,
                                        disabled: statePromotionValue.PROMOTION_STATE_INIT < dataDetail?.state,
                                    },
                                    {
                                        value: statePromotionValue.PROMOTION_STATE_RUNNING,
                                        label: statePromotionValues[1].label,
                                        disabled: statePromotionValue.PROMOTION_STATE_RUNNING < dataDetail?.state,
                                    },
                                    {
                                        value: statePromotionValue.PROMOTION_STATE_DONE,
                                        label: statePromotionValues[2].label,
                                        disabled: statePromotionValue.PROMOTION_STATE_DONE < dataDetail?.state,
                                    },
                                    {
                                        value: statePromotionValue.PROMOTION_STATE_CANCEL,
                                        label: statePromotionValues[3].label,
                                        disabled: statePromotionValue.PROMOTION_STATE_CANCEL < dataDetail?.state,
                                    },
                                ]}
                            />
                        </Col>
                    ):
                    (
                        <Col span={12}>
                            <SelectField
                                required
                                label={<FormattedMessage defaultMessage="Tình trạng" />}
                                name="state"
                                options={statePromotionValues}
                            />
                        </Col>
                    )}
                <Row gutter={16}>
                    <Col span={24}>
                        <TextField type="textarea" label={translate.formatMessage(commonMessage.description)} name="description" />
                    </Col>

                </Row>
                <div className="footer-card-form">{actions}</div>
            </Card>
        </BaseForm>
    );
};

export default PromotionForm;
