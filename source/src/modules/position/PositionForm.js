import CropImageField from '@components/common/form/CropImageField';
import DropdownField from '@components/common/form/DropdownField';
import TextField from '@components/common/form/TextField';
import { AppConstants, STATUS_ACTIVE } from '@constants';
import apiConfig from '@constants/apiConfig';
import { commonStatusOptions, formSize } from '@constants/masterData';
import useBasicForm from '@hooks/useBasicForm';
import useFetch from '@hooks/useFetch';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import { Card, Col, Form, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import { statusOptions } from '@constants/masterData';
import AutoCompleteField from '@components/common/form/AutoCompleteField';
import DatePickerField from '@components/common/form/DatePickerField';
import { DATE_FORMAT_VALUE, DEFAULT_FORMAT } from '@constants/index';

const PositionForm = (props) => {
    const translate = useTranslate();
    const statusValues = translate.formatKeys(statusOptions, ['label']);
    const { formId, actions, dataDetail, onSubmit, setIsChangedFormValues, isEditing, size = 'small' } = props;
    const { execute: executeUpFile } = useFetch(apiConfig.file.upload);
    const [imageUrl, setImageUrl] = useState(null);

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
                    setIsChangedFormValues(true);
                    setImageUrl(response.data.filePath);
                }
            },
            onError: (error) => {
                onError();
            },
        });
    };

    const handleSubmit = (values) => {
        return mixinFuncs.handleSubmit({ ...values, image: imageUrl });
    };

    useEffect(() => {
        form.setFieldsValue({
            ...dataDetail,
            image: dataDetail.image,
        });
        setImageUrl(dataDetail.image);
    }, [dataDetail]);

    return (
        <Form
            style={{ width: formSize[size] ?? size }}
            id={formId}
            onFinish={handleSubmit}
            form={form}
            layout="vertical"
            onValuesChange={onValuesChange}
        >
            <Card className="card-form" bordered={false}>
                <Row gutter={16}>
                    <Col span={12}>
                        <TextField label={translate.formatMessage(commonMessage.latitude)} name="latitude" required />
                    </Col>
                    <Col span={12}>
                        <TextField label={translate.formatMessage(commonMessage.longitude)} required name="longitude" />
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <AutoCompleteField
                            label={translate.formatMessage(commonMessage.Service)}
                            required
                            name="serviceId"
                            apiConfig={apiConfig.service.autocomplete}
                            mappingOptions={(item) => ({ value: item.id, label: item.name })}
                            searchParams={(text) => ({ name: text })}
                        />
                    </Col>
                    <Col span={12}>
                        <DropdownField
                            defaultValue={STATUS_ACTIVE}
                            label={translate.formatMessage(commonMessage.status)}
                            name="status"
                            options={statusValues}
                        />
                    </Col>
                </Row>
                <div className="footer-card-form">{actions}</div>
            </Card>
        </Form>
    );
};

export default PositionForm;
