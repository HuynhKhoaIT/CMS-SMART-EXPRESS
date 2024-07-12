import { Card, Col, Row, DatePicker } from 'antd';
import React, { useEffect, useState } from 'react';
import useBasicForm from '@hooks/useBasicForm';
import useTranslate from '@hooks/useTranslate';
import TextField from '@components/common/form/TextField';
import { BaseForm } from '@components/common/form/BaseForm';
import DatePickerField from '@components/common/form/DatePickerField';
import { DATE_FORMAT_VALUE, DEFAULT_FORMAT } from '@constants/index';
import { formatDateString } from '@utils/index';
import dayjs from 'dayjs';
import AutoCompleteField from '@components/common/form/AutoCompleteField';
import useFetch from '@hooks/useFetch';
import { FormattedMessage, defineMessages } from 'react-intl';
import apiConfig from '@constants/apiConfig';
import { statusOptions, DriverServiceOptions } from '@constants/masterData';
import SelectField from '@components/common/form/SelectField';
import CropImageField from '@components/common/form/CropImageField';
import { AppConstants, nationKinds } from '@constants';
import { commonMessage } from '@locales/intl';
import NumericField from '@components/common/form/NumericField';

const DriverVehicleForm = ({
    isEditing,
    formId,
    actions,
    dataDetail,
    onSubmit,
    setIsChangedFormValues,
    handleFocus,
}) => {
    const translate = useTranslate();
    const [imageUrl, setImageUrl] = useState(null);
    const statusValues = translate.formatKeys(statusOptions, ['label']);
    const stateValues = translate.formatKeys(DriverServiceOptions, ['label']);
    const { execute: executeUpFile } = useFetch(apiConfig.file.upload);

    const { form, mixinFuncs, onValuesChange } = useBasicForm({
        onSubmit,
        setIsChangedFormValues,
    });

    useEffect(() => {
        if (!isEditing > 0) {
            form.setFieldsValue({
                status: statusValues[1].value,
            });
        }
    }, [isEditing]);
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
        form.setFieldsValue({
            ...dataDetail,
            serviceId: dataDetail?.service?.id,
            brandId: dataDetail?.brand?.id,
        });
        setImageUrl(dataDetail.image);
    }, [dataDetail]);

    const handleSubmit = (values) => {
        return mixinFuncs.handleSubmit({
            ...values,
            image: imageUrl,
        });
    };

    return (
        <BaseForm formId={formId} onFinish={handleSubmit} form={form} onValuesChange={onValuesChange}>
            <Card>
                <Row gutter={16}>
                    <Col span={12}>
                        <CropImageField
                            label={<FormattedMessage defaultMessage="Hình ảnh" />}
                            name="image"
                            required
                            imageUrl={imageUrl && `${AppConstants.contentRootUrl}${imageUrl}`}
                            aspect={1 / 1}
                            uploadFile={uploadFile}
                        />
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <TextField label={translate.formatMessage(commonMessage.nameBike)} required name="name" />
                    </Col>
                    <Col span={12}>
                        <TextField label={translate.formatMessage(commonMessage.licenseNo)} required name="licenseNo" />
                    </Col>
                    <Col span={12}>
                        <TextField label={translate.formatMessage(commonMessage.plate)} required name="plate" />
                    </Col>
                    <Col span={12}>
                        <AutoCompleteField
                            required
                            label={<FormattedMessage defaultMessage="Thương hiệu" />}
                            name="brandId"
                            apiConfig={apiConfig.category.autocomplete}
                            mappingOptions={(item) => ({ value: item.id, label: item.name })}
                            initialSearchParams={{ kind: 1 }}
                            searchParams={(text) => ({ name: text })}
                        />
                    </Col>
                    <Col span={12}>
                        <SelectField
                            required
                            label={<FormattedMessage defaultMessage="Trạng thái" />}
                            name="status"
                            options={statusValues}
                        />
                    </Col>
                </Row>

                <div className="footer-card-form">{actions}</div>
            </Card>
        </BaseForm>
    );
};

export default DriverVehicleForm;
