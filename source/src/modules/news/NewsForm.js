import { Card, Col, Row, DatePicker } from 'antd';
import React, { useEffect, useState } from 'react';
import useBasicForm from '@hooks/useBasicForm';
import useTranslate from '@hooks/useTranslate';
import TextField from '@components/common/form/TextField';
import { BaseForm } from '@components/common/form/BaseForm';
import DatePickerField from '@components/common/form/DatePickerField';
import { DATE_FORMAT_VALUE, DEFAULT_FORMAT, NEWS_STATE_PUBLISHED, NEWS_TARGET_SPECIFIC_USERS } from '@constants/index';
import { convertUtcToLocalTime, formatDateString } from '@utils/index';
import dayjs from 'dayjs';
import AutoCompleteField from '@components/common/form/AutoCompleteField';
import useFetch from '@hooks/useFetch';
import { FormattedMessage } from 'react-intl';
import apiConfig from '@constants/apiConfig';
import { statusOptions, targetOptions, newsStateOptions, kindOptions } from '@constants/masterData';
import SelectField from '@components/common/form/SelectField';
import CropImageField from '@components/common/form/CropImageField';
import { AppConstants } from '@constants';
import { commonMessage } from '@locales/intl';
import RichTextField from '@components/common/form/RichTextField';
import BooleanField from '@components/common/form/BooleanField';
import styles from './index.module.scss';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

const NewsForm = ({ isEditing, formId, actions, dataDetail, onSubmit, setIsChangedFormValues, handleFocus }) => {
    const translate = useTranslate();
    const [imageUrl, setImageUrl] = useState(null);
    const statusValues = translate.formatKeys(statusOptions, ['label']);
    const targerValues = translate.formatKeys(targetOptions, ['label']);
    const [target, setTarget] = useState();
    const stateValues = translate.formatKeys(newsStateOptions, ['label']);
    const kindValues = translate.formatKeys(kindOptions, ['label']);

    const { execute: executeUpFile } = useFetch(apiConfig.file.upload);
    const [isChecked, setIsChecked] = useState(false);
    const [driverIds, setDriverIds] = useState([]);
    const [customerIds, setCustomerIds] = useState([]);

    const { form, mixinFuncs, onValuesChange } = useBasicForm({
        onSubmit,
        setIsChangedFormValues,
    });

    useEffect(() => {
        if (!isEditing > 0) {
            form.setFieldsValue({
                status: statusValues[1].value,
                state: stateValues[0].value,
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
        if (dataDetail.target == NEWS_TARGET_SPECIFIC_USERS) {
            dataDetail.drivers = dataDetail.drivers?.map((item) => {
                return item.id;
            });
            dataDetail.customers = dataDetail.customers?.map((item) => {
                return item.id;
            });
        }
        setDriverIds(dataDetail?.drivers);
        setCustomerIds(dataDetail.customers);

        dataDetail.publishedDate = dataDetail.publishedDate && dayjs(convertUtcToLocalTime(dataDetail.publishedDate, DEFAULT_FORMAT, DEFAULT_FORMAT), DEFAULT_FORMAT);
        form.setFieldsValue({
            ...dataDetail,
        });
        setImageUrl(dataDetail.banner);
        setTarget(dataDetail.target);


    }, [dataDetail]);

    const handleSubmit = (values) => {
        if (values?.isPublishedNow) {
            values.publishedDate = dayjs(formatDateString(new Date(), DEFAULT_FORMAT), DEFAULT_FORMAT).format(DEFAULT_FORMAT);

        } else {
            values.isPublishedNow = false;
            values.publishedDate = values.publishedDate ? dayjs(values?.publishedDate).utc().format(DEFAULT_FORMAT) : dayjs(formatDateString(new Date(), DEFAULT_FORMAT), DEFAULT_FORMAT).format(DEFAULT_FORMAT);
        }

        if(!values?.driverIds){
            values.driverIds=driverIds;
        }
        if(!values?.customerIds){
            values.customerIds=customerIds;
        }
        return mixinFuncs.handleSubmit({
            ...values,
            banner: imageUrl,
        });
    };


    const validatePubishedDate = (_, value) => {
        const date = dayjs(formatDateString(new Date(), DEFAULT_FORMAT), DATE_FORMAT_VALUE);
        if (date && value && value.isBefore(date)) {
            return Promise.reject('Ngày thông báo phải lớn hơn hoặc bằng ngày hiện tại');
        }
        return Promise.resolve();
    };
    const handleOnChangeCheckBox = () => {
        if (!isChecked) {
            form.setFieldValue('publishedDate', dayjs(convertUtcToLocalTime(new Date(), DEFAULT_FORMAT, DEFAULT_FORMAT), DEFAULT_FORMAT));
        }
        setIsChecked(!isChecked);
    };

    return (
        <BaseForm formId={formId} onFinish={handleSubmit} form={form} onValuesChange={onValuesChange}>
            <Card>
                <Row gutter={16}>
                    <Col span={12}>
                        <CropImageField
                            label={<FormattedMessage defaultMessage="banner" />}
                            name="banner"
                            required
                            disabled={dataDetail?.state == NEWS_STATE_PUBLISHED}
                            imageUrl={imageUrl && `${AppConstants.contentRootUrl}${imageUrl}`}
                            aspect={16 / 9}
                            uploadFile={uploadFile}
                        />
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={18}>
                        <TextField readOnly={dataDetail?.state == NEWS_STATE_PUBLISHED} label={translate.formatMessage(commonMessage.title)} required name="title" />
                    </Col>
                    <Col span={6}>
                        <BooleanField
                            disabled={dataDetail?.state == NEWS_STATE_PUBLISHED}
                            className={styles.customCheckbox}
                            label={<FormattedMessage defaultMessage="Gửi ngay" />}
                            name="isPublishedNow"
                            checked={isChecked}
                            onChange={handleOnChangeCheckBox}
                        />
                    </Col>
                    <Col span={12}>
                        <DatePickerField
                            showTime={true}
                            disabled={isChecked || dataDetail?.state == NEWS_STATE_PUBLISHED}
                            label={<FormattedMessage defaultMessage="Ngày gửi" />}
                            name="publishedDate"
                            placeholder="Ngày gửi"
                            rules={[
                                {
                                    validator: validatePubishedDate,
                                },
                            ]}
                            format={DEFAULT_FORMAT}
                            style={{ width: '100%' }}
                        />
                    </Col>
                    <Col span={12}>
                        <SelectField
                            disabled={dataDetail?.state == NEWS_STATE_PUBLISHED}
                            required
                            label={<FormattedMessage defaultMessage="Đối tượng" />}
                            name="target"
                            onChange={setTarget}
                            options={targerValues}
                        />
                    </Col>
                    {target == NEWS_TARGET_SPECIFIC_USERS &&

                        (
                            <>
                                <Col span={12}>
                                    <AutoCompleteField
                                        label={<FormattedMessage defaultMessage="Tài xế" />}
                                        name='driverIds'
                                        disabled={dataDetail?.state == NEWS_STATE_PUBLISHED}
                                        apiConfig={apiConfig.driver.autocomplete}
                                        mappingOptions={(item) => ({
                                            value: item.id,
                                            label: `${item.fullName}-${item.phone}`,
                                            otherData: { phone: item.phone },
                                        })}
                                        props={{
                                            defaultValue: driverIds,
                                        }}
                                        initialSearchParams={{}}
                                        mode="multiple"
                                        searchParams={(text) => ({ fullName: text })}
                                    />
                                </Col>
                                <Col span={12}>
                                    <AutoCompleteField
                                        label={<FormattedMessage defaultMessage="Khách hàng" />}
                                        name='customerIds'
                                        disabled={dataDetail?.state == NEWS_STATE_PUBLISHED}
                                        apiConfig={apiConfig.customer.autocomplete}
                                        mappingOptions={(item) => ({
                                            value: item.id,
                                            label: `${item.name}-${item.phone}`,
                                            otherData: { phone: item.phone },
                                        })}
                                        props={{
                                            defaultValue: customerIds,
                                        }}
                                        mode="multiple"
                                        // onChange={handleDriver}
                                        searchParams={(text) => ({ name: text })}
                                    />
                                </Col>
                            </>
                        )}


                    <Col span={24}>
                        <TextField
                            required
                            disabled={dataDetail?.state == NEWS_STATE_PUBLISHED}
                            label={translate.formatMessage(commonMessage.description)}
                            type="textarea"
                            name="description"
                        />
                    </Col>
                    <Col span={24}>
                        <RichTextField
                            required
                            disabled={dataDetail?.state == NEWS_STATE_PUBLISHED}
                            style={{ height: 700, marginBottom: 70 }}
                            label={<FormattedMessage defaultMessage="Nội dung" />}
                            name="content"
                            baseURL={AppConstants.contentRootUrl}
                            setIsChangedFormValues={setIsChangedFormValues}
                            form={form}
                        />
                    </Col>
                    <Col span={12}>
                        <SelectField
                            disabled

                            label={<FormattedMessage defaultMessage="Tình trạng" />}
                            name="state"
                            options={stateValues}
                        />
                    </Col>
                    <Col span={12}>
                        <SelectField
                            required
                            disabled={dataDetail?.state == NEWS_STATE_PUBLISHED}
                            label={<FormattedMessage defaultMessage="Loại" />}
                            name="kind"
                            options={kindValues}
                        />
                    </Col>
                    {/* <Col span={12}>
                        <SelectField
                            required
                            label={<FormattedMessage defaultMessage="Trạng thái" />}
                            name="status"
                            options={statusValues}
                        />
                    </Col> */}
                </Row>

                <div className="footer-card-form">{actions}</div>
            </Card>
        </BaseForm>
    );
};

export default NewsForm;
