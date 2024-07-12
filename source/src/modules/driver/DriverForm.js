import { Card, Col, Row, DatePicker } from "antd";
import React, { useEffect, useState } from "react";
import useBasicForm from "@hooks/useBasicForm";
import useTranslate from "@hooks/useTranslate";
import TextField from "@components/common/form/TextField";
import { BaseForm } from "@components/common/form/BaseForm";
import DatePickerField from "@components/common/form/DatePickerField";
import { DATE_FORMAT_VALUE, DEFAULT_FORMAT } from "@constants/index";
import { formatDateString } from "@utils/index";
import dayjs from "dayjs";
import useFetch from "@hooks/useFetch";
import { FormattedMessage, defineMessages } from "react-intl";
import apiConfig from "@constants/apiConfig";
import { statusOptions } from "@constants/masterData";
import SelectField from "@components/common/form/SelectField";
import CropImageField from "@components/common/form/CropImageField";
import { AppConstants, nationKinds } from "@constants";
import { commonMessage } from "@locales/intl";
import useNationField from "@hooks/useNationField";
import AutoCompleteLocationField from "@components/common/form/AutoCompleteLocationField";
import { phoneRegExp } from "@constants/validator";

const DriverForm = ({
    isEditing,
    formId,
    actions,
    dataDetail,
    onSubmit,
    setIsChangedFormValues,
    handleFocus,
    bankOptions,
}) => {
    const translate = useTranslate();
    const [imageUrl, setImageUrl] = useState(null);
    const { execute: executeUpFile } = useFetch(apiConfig.file.upload);
    const kindProvince = nationKinds.PROVINCE_KIND;
    const kindDistrict = nationKinds.DISTRICT_KIND;
    const kindVillage = nationKinds.VILLAGE_KIND;
    const statusValues = translate.formatKeys(statusOptions, ["label"]);
    const [dataNation, setDataNation] = useState({});
    const { form, mixinFuncs, onValuesChange } = useBasicForm({
        onSubmit,
        setIsChangedFormValues,
    });

    const {
        provincesFieldProps,
        wardsFieldProps,
        districtsFieldProps,
    } = useNationField({
        form,
        initialData: dataNation,
        kindOptions: {
            provinceKind: kindProvince,
            districtKind: kindDistrict,
            wardKind: kindVillage,
        },
    });
    useEffect(() => {
        setDataNation(dataDetail);
    }, [dataDetail]);
    const uploadFile = (file, onSuccess, onError) => {
        executeUpFile({
            data: {
                type: "AVATAR",
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
            form.setFieldsValue({
                status: statusValues[1].value,
            });
        }
    }, [isEditing]);

    useEffect(() => {
        const identification = dataDetail?.identificationCard && JSON.parse(dataDetail?.identificationCard);
        const bankInfo = dataDetail?.bankCard && JSON.parse(dataDetail?.bankCard);
        const dateIdentification =
            identification?.issuingDate && dayjs(identification?.issuingDate, DEFAULT_FORMAT);
        form.setFieldsValue({
            ...dataDetail,
            provinceId: dataDetail?.province?.name,
            districtId: dataDetail?.district?.name,
            wardId: dataDetail?.ward?.name,
            accountNumber: bankInfo?.accountNumber,
            accountName: bankInfo?.accountName,
            bankName: bankInfo?.bankName,
            branch: bankInfo?.branch,
            identificationCardNumber: identification?.identificationCardNumber,
            issuingPlace: identification?.issuingPlace,
            issuingDate: dateIdentification && dateIdentification,
        });

        setImageUrl(dataDetail.avatar);
    }, [dataDetail]);

    const handleSubmit = (values) => {
        if (isEditing) {
            values.provinceId =
                typeof values?.provinceId == "string"
                    ? dataDetail?.province?.id
                    : values.provinceId;
            values.districtId =
                typeof values?.districtId == "string"
                    ? dataDetail?.district?.id
                    : values.districtId;
            values.wardId =
                typeof values?.wardId == "string"
                    ? dataDetail?.ward?.id
                    : values.wardId;
        }

        const newidentification = {
            identificationCardNumber: values?.identificationCardNumber,
            issuingPlace: values?.issuingPlace,
            issuingDate:
                values?.issuingDate &&
                formatDateString(values.issuingDate, DATE_FORMAT_VALUE) + ' 00:00:00',
        };
        values.identificationCard = newidentification && JSON.stringify(newidentification);

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
        <BaseForm
            formId={formId}
            onFinish={handleSubmit}
            form={form}
            onValuesChange={onValuesChange}
        >
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
                            <TextField
                                label={translate.formatMessage(commonMessage.name)}
                                required
                                name="fullName"
                            />
                        </Col>
                        <Col span={12}>
                            <TextField
                                label={translate.formatMessage(commonMessage.phone)}
                                type="number"
                                name="phone"
                                rules={[
                                    {
                                        validator: checkPhone,
                                    },
                                ]}
                                required
                            />
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <TextField
                                label={translate.formatMessage(commonMessage.password)}
                                rules={[
                                    {
                                        min: 6,
                                        message: "Mật khẩu phải có ít nhất 6 kí tự!",
                                    },
                                ]}
                                required={isEditing ? false : true}
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
                        <b>{translate.formatMessage(commonMessage.address)}</b>
                    </legend>

                    <Row gutter={16}>
                        <Col span={12}>
                            <AutoCompleteLocationField
                                label={<FormattedMessage defaultMessage="Tỉnh/Thành phố" />}
                                name="provinceId"
                                required
                                {...provincesFieldProps}
                            />
                        </Col>
                        <Col span={12}>
                            <AutoCompleteLocationField
                                label={<FormattedMessage defaultMessage="Quận/Huyện" />}
                                name="districtId"
                                required
                                {...districtsFieldProps}
                            />
                        </Col>
                        <Col span={12}>
                            <AutoCompleteLocationField
                                label={<FormattedMessage defaultMessage="Xã/Phường" />}
                                name="wardId"
                                required
                                {...wardsFieldProps}
                            />
                        </Col>
                        <Col span={12}>
                            <TextField
                                required
                                label={translate.formatMessage(commonMessage.address)}
                                name="address"
                            />
                        </Col>
                    </Row>
                </fieldset>
                <fieldset>
                    <legend>
                        <b>{translate.formatMessage(commonMessage.InfinityInfo)}</b>
                    </legend>
                    <Row gutter={16}>
                        <Col span={12}>
                            <TextField
                                label={translate.formatMessage(commonMessage.CMND)}
                                name="identificationCardNumber"
                            />
                        </Col>
                        <Col span={12}>
                            <TextField
                                label={translate.formatMessage(commonMessage.Place)}
                                name="issuingPlace"
                            />
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <DatePickerField
                                name="issuingDate"
                                label={translate.formatMessage(commonMessage.CMNDDate)}
                                placeholder="Ngày cấp"
                                format={DATE_FORMAT_VALUE}
                                style={{ width: '100%' }}
                            // required={isEditing ? false : true}
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
                <div style={{ marginTop: 20 }} className="footer-card-form">{actions}</div>
            </Card>
        </BaseForm>
    );
};

export default DriverForm;
