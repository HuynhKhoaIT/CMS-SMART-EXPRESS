import TextField from '@components/common/form/TextField';
import { Card, Col, Form, Modal, Row, Button } from 'antd';
import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { BaseForm } from '@components/common/form/BaseForm';
import useNotification from '@hooks/useNotification';
import { defineMessages } from 'react-intl';
import { useIntl } from 'react-intl';
import useTranslate from '@hooks/useTranslate';
import FieldSet from '@components/common/form/FieldSet';
import NumericField from '@components/common/form/NumericField';

const messages = defineMessages({
    objectName: 'setting',
    update: 'Cập nhật',
    updateSuccess: 'Cập nhật {objectName} thành công',
});
const StringeeModal = ({
    open,
    onCancel,
    onOk,
    title,
    data,
    stringeeData,
    executeUpdate,
    executeLoading,
    ...props
}) => {
    const [form] = Form.useForm();
    const [isChanged, setChange] = useState(false);
    const notification = useNotification();
    const intl = useIntl();
    const translate = useTranslate();
    const updateSetting = (values) => {
        values.to.submitOnHash = stringeeData.to.submitOnHash;
        values.to.type = stringeeData.to.type;
        values.from.type = stringeeData.from.type;
        values.answer_url = stringeeData.answer_url;
        executeUpdate({
            data: {
                id: data.id,
                // isSystem: data.isSystem,
                dataType: data?.dataType,
                status: data.status,
                settingValue: JSON.stringify(values),
            },
            onCompleted: (response) => {
                if (response.result === true) {
                    onCancel();
                    notification({
                        message: intl.formatMessage(messages.updateSuccess, {
                            objectName: translate.formatMessage(messages.objectName),
                        }),
                    });
                    executeLoading();
                    setChange(false);
                }
            },
            onError: (err) => { },
        });
    };

    const handleInputChange = () => {
        setChange(true);
    };

    useEffect(() => {
        // form.setFields(data);'
        if (stringeeData) {
            form.setFieldsValue({
                ...stringeeData,
            });
        }
    }, [stringeeData]);
    return (
        <Modal centered open={open} onCancel={onCancel} footer={null} title={data?.keyName} {...props}>
            <Card className="card-form" bordered={false}>
                <BaseForm form={form} onFinish={updateSetting} size="100%">
                    <FieldSet title={'Action'}>
                        <Row gutter={16}>
                            <Col span={12}>
                                <TextField
                                    label={<FormattedMessage defaultMessage="Action" />}
                                    name={["action", 'action']}
                                    onChange={handleInputChange}
                                />
                            </Col>
                            <Col span={12}>
                                <NumericField
                                    label={<FormattedMessage defaultMessage="Loop" />}
                                    name={["action", 'loop']}
                                    min={1}
                                    onChange={handleInputChange}
                                />
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={12}>
                                <NumericField
                                    label={<FormattedMessage defaultMessage="Speed" />}
                                    name={["action", 'speed']}
                                    min={-4}
                                    max={4}
                                    onChange={handleInputChange}
                                />
                            </Col>
                            <Col span={12}>
                                <TextField
                                    label={<FormattedMessage defaultMessage="Text" />}
                                    name={["action", 'text']}
                                    onChange={handleInputChange}
                                />
                            </Col>
                            <Col span={24}>
                                <TextField
                                    label={<FormattedMessage defaultMessage="Voice" />}
                                    name={["action", 'voice']}
                                    onChange={handleInputChange}
                                />
                            </Col>
                        </Row>
                    </FieldSet>
                    <FieldSet title={<FormattedMessage defaultMessage="From To" />}>
                        <Row gutter={16}>
                            <Col span={12}>
                                <TextField
                                    label={<FormattedMessage defaultMessage="Alias" />}
                                    name={["from", 'alias']}
                                    onChange={handleInputChange}
                                />
                            </Col>
                            <Col span={12}>
                                <TextField
                                    label={<FormattedMessage defaultMessage="Number" />}
                                    name={["from", 'number']}
                                    onChange={handleInputChange}
                                />
                            </Col>
                            <Col span={12}>
                                <TextField
                                    label={<FormattedMessage defaultMessage="Timeout" />}
                                    name={["to", 'timeout']}
                                    min={5}
                                    onChange={handleInputChange}
                                />
                            </Col>
                        </Row>
                    </FieldSet>
                    <Row gutter={16}>
                        <Col span={24}>
                            <TextField
                                type='textarea'
                                label={<FormattedMessage defaultMessage="Auth" />}
                                name={'auth'}
                                onChange={handleInputChange}
                            />
                        </Col>

                    </Row>
                    <div style={{ float: 'right' }}>
                        <Button key="submit" type="primary" htmlType="submit" disabled={!isChanged}>
                            {intl.formatMessage(messages.update)}
                        </Button>
                    </div>
                </BaseForm>
            </Card>
        </Modal>
    );
};

export default StringeeModal;
