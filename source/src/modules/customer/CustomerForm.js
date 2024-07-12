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
import { phoneRegExp } from '@constants/validator';

const CustomerForm = ({ isEditing, formId, actions, dataDetail, onSubmit, setIsChangedFormValues, handleFocus, bankOptions }) => {
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
        const bankInfo = dataDetail?.bankCard && JSON.parse(dataDetail?.bankCard);

        form.setFieldsValue({
            ...dataDetail,
            accountNumber: bankInfo?.accountNumber,
            accountName: bankInfo?.accountName,
            bankName: bankInfo?.bankName,
            branch: bankInfo?.branch,
        });
        setImageUrl(dataDetail.avatar);
    }, [dataDetail]);

    const handleSubmit = (values) => {
        const newBankInfo = {
            accountName: values?.accountName,
            accountNumber: values?.accountNumber,
            bankName: values?.bankName,
            branch: values?.branch,
        };
        values.bankCard = newBankInfo && JSON.stringify(newBankInfo);
        return mixinFuncs.handleSubmit({
            ...values,
            avatar: imageUrl,
        });
    };

    const checkPhone = (_, value) => {
        if (!phoneRegExp.test(value)) {
            return Promise.reject('Số điện thoại không hợp lệ, vui lòng nhập lại');
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
                <fieldset>
                    <legend>
                        <b>{translate.formatMessage(commonMessage.AcccountInfo)}</b>
                    </legend>
                    <Row gutter={16}>
                        <Col span={12}>
                            <TextField label={translate.formatMessage(commonMessage.name)} required name="name" />
                        </Col>
                        <Col span={12}>
                            <TextField
                                label={translate.formatMessage(commonMessage.email)}
                                type="email"
                                name="email"
                                required
                            />
                        </Col>
                        <Col span={12}>
                            <TextField
                                label={translate.formatMessage(commonMessage.phone)}
                                type="number"
                                name="phone"
                                required
                                rules={[
                                    {
                                        validator: checkPhone,
                                    },
                                ]}
                            />
                        </Col>
                        <Col span={12}>
                            <TextField
                                label={translate.formatMessage(commonMessage.password)}
                                rules={[
                                    {
                                        min: 6,
                                        message: 'Mật khẩu phải có ít nhất 6 kí tự!',
                                    },
                                ]}
                                name="password"
                                type="password"
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
                </fieldset>
                <fieldset>
                    <legend>
                        <b>{translate.formatMessage(commonMessage.BankInfo)}</b>
                    </legend>
                    <Row gutter={16}>
                        <Col span={12}>
                            <TextField label={translate.formatMessage(commonMessage.bankNumber)} name="accountNumber" />
                        </Col>
                        <Col span={12}>
                            <TextField
                                label={translate.formatMessage(commonMessage.bankNameCustomer)}
                                name="accountName"
                            />
                        </Col>
                        <Col span={12}>
                            <SelectField
                                label={translate.formatMessage(commonMessage.bankName)}
                                name="bankName"
                                options={bankOptions}
                            />
                        </Col>
                        <Col span={12}>
                            <TextField label={translate.formatMessage(commonMessage.bankAgency)} name="branch" />
                        </Col>
                    </Row>
                </fieldset>
                <div className="footer-card-form">{actions}</div>
            </Card>
        </BaseForm>
    );
};

export default CustomerForm;
