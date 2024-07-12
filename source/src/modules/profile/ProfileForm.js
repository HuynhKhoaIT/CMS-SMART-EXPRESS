import TextField from '@components/common/form/TextField';
import { Card, Col, Form, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import useBasicForm from '@hooks/useBasicForm';
import CropImageField from '@components/common/form/CropImageField';
import useFetch from '@hooks/useFetch';
import apiConfig from '@constants/apiConfig';
import { AppConstants } from '@constants';
import { Fragment } from 'react';
import { defineMessages } from 'react-intl';
import useTranslate from '@hooks/useTranslate';
import NumericField from '@components/common/form/NumericField';

const messages = defineMessages({
    banner: 'Banner',
    avatarPath: 'Avatar',
    username: 'Username',
    career: 'Career Name',
    fullname: 'Họ và tên',
    email: 'Email',
    hotline: 'Hot line',
    phoneNumber: 'Phone Number',
    taxNumber: 'Tax Number',
    zipCode: 'Zip Code',
    city: 'City',
    address: 'Address',
    logo: 'Logo',
    currentPassword: 'Mật khẩu hiện tại',
    newPassword: 'Mật khẩu mới',
    confirmPassword: 'Xác nhận mật khẩu mới',
    passwordLengthError: 'Mật khẩu phải ít nhất 6 kí tự',
    passwordMatchError: 'Mật khẩu không khớp',
});

const ProfileForm = (props) => {
    const { formId, dataDetail, onSubmit, setIsChangedFormValues, actions, isAdmin } = props;
    const [imageUrl, setImageUrl] = useState(null);

    const { execute: executeUpFile } = useFetch(apiConfig.file.upload);
    const translate = useTranslate();

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

    const uploadBannerFile = (file, onSuccess, onError) => {
        executeUpFile({
            data: {
                type: 'AVATAR',
                file: file,
            },
            onCompleted: (response) => {
                if (response.result === true) {
                    onSuccess();
                    setIsChangedFormValues(true);
                }
            },
            onError: (error) => {
                onError();
            },
        });
    };

    const uploadLogoFile = (file, onSuccess, onError) => {
        executeUpFile({
            data: {
                type: 'LOGO',
                file: file,
            },
            onCompleted: (response) => {
                if (response.result === true) {
                    onSuccess();
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
        });
        setImageUrl(dataDetail?.avatar);
    }, [dataDetail]);

    const handleFinish = (values) => {
        (values.avatar = imageUrl),
        mixinFuncs.handleSubmit({
            ...values,
            fullName: values.fullName,
            oldPassword: values.oldPassword,
            password: values.password,
            avatarPath: values.avatar,
            email: values.email,
        });
    };

    return (
        <Card className="card-form" bordered={false} style={{ minHeight: 'calc(100vh - 190px)' }}>
            <Form
                style={{ width: '50%' }}
                labelCol={{ span: 8 }}
                id={formId}
                onFinish={handleFinish}
                form={form}
                layout="horizontal"
                onValuesChange={onValuesChange}
            >
                <Row style={{ marginLeft: '8rem' }} gutter={16}>
                    <Col span={8}>
                        <CropImageField
                            label={translate.formatMessage(messages.avatarPath)}
                            name="avatarPath"
                            imageUrl={imageUrl && `${AppConstants.contentRootUrl}${imageUrl}`}
                            aspect={1 / 1}
                            required
                            uploadFile={uploadFile}
                        />
                    </Col>
                </Row>

                <TextField readOnly label={translate.formatMessage(messages.username)} name="username" />
                <TextField label={translate.formatMessage(messages.email)} name="email" />
                <TextField label={translate.formatMessage(messages.fullname)} name="fullName" />
                {/* <TextField label={translate.formatMessage(messages.phoneNumber)} name="phone" />
                <TextField label={translate.formatMessage(messages.hotline)} name="hotline" /> */}
                {/* {!isAdmin && (
                    <Fragment>
                        <TextField
                            name={['accountDto', 'phone']}
                            label={translate.formatMessage(messages.phoneNumber)}
                            required
                        />
                    </Fragment>
                )} */}
                <TextField
                    type="password"
                    label={translate.formatMessage(messages.currentPassword)}
                    required
                    name="oldPassword"
                />
                <TextField
                    type="password"
                    label={translate.formatMessage(messages.newPassword)}
                    name="password"
                    rules={[
                        {
                            validator: async () => {
                                const isTouched = form.isFieldTouched('newPassword');
                                if (isTouched) {
                                    const value = form.getFieldValue('newPassword');
                                    if (value.length < 6) {
                                        throw new Error(translate.formatMessage(messages.passwordLengthError));
                                    }
                                }
                            },
                        },
                    ]}
                />
                <TextField
                    type="password"
                    label={translate.formatMessage(messages.confirmPassword)}
                    rules={[
                        {
                            validator: async () => {
                                const password = form.getFieldValue('newPassword');
                                const confirmPassword = form.getFieldValue('confirmPassword');
                                if (password !== confirmPassword) {
                                    throw new Error(translate.formatMessage(messages.passwordMatchError));
                                }
                            },
                        },
                    ]}
                />

                <div className="footer-card-form">{actions}</div>
            </Form>
        </Card>
    );
};

export default ProfileForm;
