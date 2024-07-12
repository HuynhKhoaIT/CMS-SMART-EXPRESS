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

const DriverServiceForm = ({
    isEditing,
    formId,
    actions,
    dataDetail,
    onSubmit,
    setIsChangedFormValues,
    handleFocus,
}) => {
    const translate = useTranslate();
    const statusValues = translate.formatKeys(statusOptions, ['label']);
    const stateValues = translate.formatKeys(DriverServiceOptions, ['label']);

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
            serviceId: dataDetail?.service?.id,
        });
    }, [dataDetail]);

    const handleSubmit = (values) => {
        return mixinFuncs.handleSubmit({ ...values });
    };

    return (
        <BaseForm formId={formId} onFinish={handleSubmit} form={form} onValuesChange={onValuesChange}>
            <Card>
                <Row gutter={16}>
                    <Col span={12}>
                        <NumericField
                            min={0}
                            max={100}
                            label={translate.formatMessage(commonMessage.ratioShare)}
                            required
                            name="ratioShare"
                            addonAfter={'%'}
                        />
                    </Col>
                    <Col span={12}>
                        <AutoCompleteField
                            required
                            label={<FormattedMessage defaultMessage="Dịch vụ" />}
                            name="serviceId"
                            apiConfig={apiConfig.service.autocomplete}
                            mappingOptions={(item) => ({ value: item.id, label: item.name })}
                            searchParams={(text) => ({ name: text })}
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

export default DriverServiceForm;
