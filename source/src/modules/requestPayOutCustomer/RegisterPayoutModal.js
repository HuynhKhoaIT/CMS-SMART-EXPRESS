import { BaseForm } from '@components/common/form/BaseForm';
import CropImageField from '@components/common/form/CropImageField';
import NumericField from '@components/common/form/NumericField';
import TextField from '@components/common/form/TextField';
import { AppConstants } from '@constants';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import { Col, Form, Modal, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';

const messages = defineMessages({
    objectName: 'Chi tiết yêu cầu rút tiền',
    update: 'Cập nhật',
    create: 'Thêm mới',
    createSuccess: 'Tạo {objectName} thành công',
});
const RegisterPayoutModal = ({
    open,
    onCancel,
    data,
}) => {
    const translate = useTranslate();
    const [form] = Form.useForm();
    const handleOnCancel = () => {
        onCancel();
    };

    const [imageUrl, setImageUrl] = useState(null);
    const [imageBank, setImageBank] = useState(null);

    useEffect(() => {
        console.log(data);
        const bankInfo = data?.bankCard && JSON.parse(data?.bankCard);

        form.setFieldsValue({
            ...data,
            bankNumber: bankInfo?.accountNumber,
            bankNameCustomer: bankInfo?.accountName,
            bankName: bankInfo?.bankName,
            bankAgency: bankInfo?.branch,
        });
        setImageUrl(data?.driver?.avatar);
        setImageBank(data?.image);
    }, [data]);

    return (
        <Modal
            centered
            open={open}
            onCancel={handleOnCancel}
            footer={null}
            title={translate.formatMessage(messages.objectName)}
            width={800}
        >
            <BaseForm
                form={form}
                size="100%"
                style={{ width: '100%', maxHeight: '800px', overflowX: 'auto' }}
            >
                <Col span={12}>
                    <CropImageField
                        label={translate.formatMessage(commonMessage.avatar)}
                        name={['driver', 'avatar']}
                        imageUrl={imageUrl && `${AppConstants.contentRootUrl}${imageUrl}`}
                        aspect={1 / 1}
                        disabled={true}
                    />
                </Col>
                <fieldset>
                    <legend>
                        <b>{translate.formatMessage(commonMessage.AcccountInfo)}</b>
                    </legend>
                    <Row gutter={16}>
                        <Col span={12}>
                            <TextField
                                readOnly
                                label={translate.formatMessage(commonMessage.fullName)}
                                name={['driver', 'fullName']}
                                style={{ height: '55px' }}
                            />
                        </Col>
                        <Col span={12}>
                            <TextField
                                label={translate.formatMessage(commonMessage.phone)}
                                name={['driver', 'phone']}
                                style={{ height: '55px' }}
                                readOnly
                            />
                        </Col>
                    </Row>
                    <TextField
                        label={translate.formatMessage(commonMessage.address)}
                        name={['driver', 'address']}
                        style={{ height: '55px' }}
                        readOnly
                    />
                </fieldset>
                <fieldset style={{ marginBottom: '10px' }}>
                    <legend>
                        <b>{translate.formatMessage(commonMessage.BankInfo)}</b>
                    </legend>
                    <Row gutter={16}>
                        <Col span={12}>
                            <TextField
                                label={translate.formatMessage(commonMessage.bankNumber)}
                                name="bankNumber"
                                readOnly={true}
                                style={{ height: '55px' }}
                            />
                        </Col>
                        <Col span={12}>
                            <TextField
                                label={translate.formatMessage(commonMessage.bankNameCustomer)}
                                name="bankNameCustomer"
                                readOnly={true}
                                style={{ height: '55px' }}
                            />
                        </Col>
                        <Col span={12}>
                            <TextField
                                label={translate.formatMessage(commonMessage.bankName)}
                                name="bankName"
                                readOnly={true}
                                style={{ height: '55px' }}
                            />
                        </Col>
                        <Col span={12}>
                            <TextField
                                label={translate.formatMessage(commonMessage.bankAgency)}
                                name="bankAgency"
                                readOnly={true}
                                style={{ height: '55px' }}
                            />
                        </Col>
                    </Row>
                </fieldset>
                <Row>
                    <Col span={24}>
                        <NumericField
                            label={<FormattedMessage defaultMessage={'Tiền rút'} />}
                            name="money"
                            min={0}
                            // max={withdrawMoney}
                            addonAfter="₫"
                            // defaultValue={0}
                            readOnly={true}
                        />
                    </Col>
                </Row>
                {data?.transactionCode && (
                    <fieldset style={{ marginBottom: '10px' }}>
                        <legend>
                            <b>{translate.formatMessage(commonMessage.approveInfo)}</b>
                        </legend>
                        <Row gutter={16}>
                            <Col span={24}>
                                <CropImageField
                                    label={translate.formatMessage(commonMessage.transactionImage)}
                                    name={'image'}
                                    imageUrl={imageBank && `${AppConstants.contentRootUrl}${imageBank}`}
                                    aspect={1 / 1}
                                    disabled={true}
                                />
                            </Col>
                            <Col span={12}>
                                <TextField
                                    label={translate.formatMessage(commonMessage.transactionCode)}
                                    name="transactionCode"
                                    readOnly={true}
                                    style={{ height: '55px' }}
                                />
                            </Col>
                        </Row>
                    </fieldset>
                )}
                {data?.note &&
                    <Row>
                        <Col span={24}>
                            <TextField
                                label={translate.formatMessage(commonMessage.note)}
                                name="note"
                                type="textarea"
                                readOnly
                                style={{ height: 250 }}
                            />
                        </Col>
                    </Row>
                }
            </BaseForm>
        </Modal>
    );
};

export default RegisterPayoutModal;
