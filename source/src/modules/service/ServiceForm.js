import CropImageField from '@components/common/form/CropImageField';
import DropdownField from '@components/common/form/DropdownField';
import TextField from '@components/common/form/TextField';
import { AppConstants, SERVICE_USER_KIND_BIKE, SERVICE_USER_KIND_CAR, SERVICE_USER_KIND_SHIP_BIKE, SERVICE_USER_KIND_SHIP_TRUCK, STATUS_ACTIVE } from '@constants';
import apiConfig from '@constants/apiConfig';
import { commonStatusOptions, formSize, serviceOptions } from '@constants/masterData';
import useBasicForm from '@hooks/useBasicForm';
import useFetch from '@hooks/useFetch';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import { Button, Card, Col, Form, Grid, Input, Row, Space, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { statusOptions } from '@constants/masterData';
import NumericField from '@components/common/form/NumericField';
import AutoCompleteField from '@components/common/form/AutoCompleteField';
import { CloseOutlined } from '@ant-design/icons';
import { FormattedMessage, defineMessages } from 'react-intl';
import { translateKeys } from '@utils/intlHelper';
const messagesDefault = defineMessages({
    level: 'Mức giá {level}',
});
const ServiceForm = (props) => {
    const translate = useTranslate();
    const [kind, setKind] = useState();
    const statusValues = translate.formatKeys(statusOptions, ['label']);
    const serviceOptionsSelect = translate.formatKeys(serviceOptions, ['label']);
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
        const prices = values.prices;
        let price = {
            startPrice: {
                distance: values.start_distance,
                price: values.start_price,
            },
        };
        if (values.kind === SERVICE_USER_KIND_CAR) price.prices = prices;
        if (values.kind === SERVICE_USER_KIND_SHIP_BIKE) price.prices = prices;
        if (values.kind === SERVICE_USER_KIND_SHIP_TRUCK) price.prices = prices;
        else price.nextPrices = values.nextPrices;
        return mixinFuncs.handleSubmit({
            ...values,
            image: imageUrl,
            price: JSON.stringify(price),
            size: JSON.stringify(values.size),
        });
    };

    useEffect(() => {
        const price = JSON.parse(dataDetail?.price ?? '{}');
        const size = JSON.parse(dataDetail?.size ?? '{}');

        form.setFieldsValue({
            ...dataDetail,
            categoryId: dataDetail?.category?.id,
            image: dataDetail.image,
            start_distance: price?.startPrice?.distance,
            start_price: price?.startPrice?.price,
            prices: price?.prices ?? [],
            size,
            nextPrices: price?.nextPrices,
        });
        setKind(dataDetail?.kind);
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
                        <CropImageField
                            label="Avatar"
                            name="image"
                            imageUrl={imageUrl && `${AppConstants.contentRootUrl}${imageUrl}`}
                            aspect={1 / 1}
                            uploadFile={uploadFile}
                        />
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <TextField label={translate.formatMessage(commonMessage.Name)} name="name" required />
                    </Col>
                    <Col span={12}>
                        <DropdownField
                            defaultValue={STATUS_ACTIVE}
                            label={translate.formatMessage(commonMessage.status)}
                            name="status"
                            options={statusValues}
                        />
                    </Col>
                    
                    <Col span={12}>
                        <DropdownField
                            required
                            label={translate.formatMessage(commonMessage.kind)}
                            name="kind"
                            disabled={isEditing}
                            onChange={(value) => setKind(value)}
                            options={serviceOptionsSelect}
                        />
                    </Col>
                    {(kind == SERVICE_USER_KIND_SHIP_BIKE || kind === SERVICE_USER_KIND_SHIP_TRUCK)
                        &&
                        <Col span={12}>
                            <NumericField label={translate.formatMessage(commonMessage.maxOrder)} name="maxOrder" required />
                        </Col>
                    }
                </Row>
                <Row gutter={16}>
                    <Col span={24}>
                        <TextField
                            label={translate.formatMessage(commonMessage.description)}
                            type="textarea"
                            name="description"
                        />
                    </Col>
                </Row>
                {(kind == SERVICE_USER_KIND_SHIP_BIKE || kind === SERVICE_USER_KIND_SHIP_TRUCK) &&
                    <Col span={24}>
                        <Card size="small" title={<FormattedMessage defaultMessage="Khối lượng và kích thước" />}>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <NumericField
                                        label={translate.formatMessage(commonMessage.weight)}
                                        name="weight"
                                        min={0}
                                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                        addonAfter="kg"
                                        required
                                    />
                                </Col>

                                <Col span={12}>
                                    <NumericField
                                        label={translate.formatMessage(commonMessage.height)}
                                        name={['size', 'height']}
                                        min={0}
                                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                        addonAfter="cm"
                                        required
                                    />
                                </Col>
                                <Col span={12}>
                                    <NumericField
                                        label={translate.formatMessage(commonMessage.length)}
                                        name={['size', 'length']}
                                        min={0}
                                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                        addonAfter="cm"
                                        required
                                    />
                                </Col>
                                <Col span={12}>
                                    <NumericField
                                        label={translate.formatMessage(commonMessage.width)}
                                        name={['size', 'width']}
                                        min={0}
                                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                        addonAfter="cm"
                                        required
                                    />
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                }
                <Row style={{ marginBottom: '1rem', marginTop: '20px' }} gutter={16}>
                    <Col span={24}>
                        <Card size="small" title={<FormattedMessage defaultMessage="Mở cửa" />}>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <NumericField
                                        label={translate.formatMessage(commonMessage.distance)}
                                        name="start_distance"
                                        min={0}
                                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                        addonAfter="m"
                                        required
                                    />
                                </Col>

                                <Col span={12}>
                                    <NumericField
                                        label={translate.formatMessage(commonMessage.price)}
                                        name="start_price"
                                        min={0}
                                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                        addonAfter="₫"
                                        required
                                    />
                                </Col>
                                {kind === SERVICE_USER_KIND_BIKE && (
                                    <Col span={12}>
                                        <NumericField
                                            label={translate.formatMessage(commonMessage.nextPrice)}
                                            name="nextPrices"
                                            min={0}
                                            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                            addonAfter="₫"
                                            required
                                        />
                                    </Col>
                                )}
                            </Row>
                        </Card>
                    </Col>

                    {(kind == SERVICE_USER_KIND_SHIP_BIKE || kind === SERVICE_USER_KIND_SHIP_TRUCK) &&
                        <Col style={{ marginTop: '20px' }} span={24}>
                            <Form.List name="prices">
                                {(fields, { add, remove }) => (
                                    <div
                                        style={{
                                            display: 'flex',
                                            rowGap: 16,
                                            flexDirection: 'column',
                                        }}
                                    >
                                        {fields.map((field) => (
                                            <Card
                                                size="small"
                                                title={translate.formatMessage(messagesDefault.level, {
                                                    level: field.name + 1,
                                                })}
                                                key={field.key}
                                                extra={
                                                    <CloseOutlined
                                                        onClick={() => {
                                                            remove(field.name);
                                                        }}
                                                    />
                                                }
                                            >
                                                <Row gutter={16}>
                                                    <Col span={6}>
                                                        <NumericField
                                                            label={translate.formatMessage(commonMessage.from)}
                                                            name={[field.name, 'from']}
                                                            min={0}
                                                            formatter={(value) =>
                                                                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                                            }
                                                            addonAfter="m"
                                                            required
                                                        />
                                                    </Col>
                                                    <Col span={6}>
                                                        <NumericField
                                                            label={translate.formatMessage(commonMessage.to)}
                                                            name={[field.name, 'to']}
                                                            min={0}
                                                            formatter={(value) =>
                                                                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                                            }
                                                            addonAfter="m"
                                                        // required
                                                        />
                                                    </Col>

                                                    <Col span={12}>
                                                        <NumericField
                                                            label={translate.formatMessage(commonMessage.price)}
                                                            name={[field.name, 'price']}
                                                            min={0}
                                                            formatter={(value) =>
                                                                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                                            }
                                                            addonAfter="₫"
                                                            required
                                                        />
                                                    </Col>
                                                </Row>
                                            </Card>
                                        ))}

                                        <Button type="dashed" onClick={() => add()} block>
                                            + <FormattedMessage defaultMessage="Thêm mức giá" />
                                        </Button>
                                    </div>
                                )}
                            </Form.List>
                        </Col>
                    }
                </Row>
                <Row style={{ marginBottom: '1rem' }} gutter={16}>
                    <Col span={24}>
                        {kind === SERVICE_USER_KIND_CAR && (
                            <Form.List name="prices">
                                {(fields, { add, remove }) => (
                                    <div
                                        style={{
                                            display: 'flex',
                                            rowGap: 16,
                                            flexDirection: 'column',
                                        }}
                                    >
                                        {fields.map((field) => (
                                            <Card
                                                size="small"
                                                title={translate.formatMessage(messagesDefault.level, {
                                                    level: field.name + 1,
                                                })}
                                                key={field.key}
                                                extra={
                                                    <CloseOutlined
                                                        onClick={() => {
                                                            remove(field.name);
                                                        }}
                                                    />
                                                }
                                            >
                                                <Row gutter={16}>
                                                    <Col span={6}>
                                                        <NumericField
                                                            label={translate.formatMessage(commonMessage.from)}
                                                            name={[field.name, 'from']}
                                                            min={0}
                                                            formatter={(value) =>
                                                                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                                            }
                                                            addonAfter="m"
                                                            required
                                                        />
                                                    </Col>
                                                    <Col span={6}>
                                                        <NumericField
                                                            label={translate.formatMessage(commonMessage.to)}
                                                            name={[field.name, 'to']}
                                                            min={0}
                                                            formatter={(value) =>
                                                                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                                            }
                                                            addonAfter="m"
                                                        // required
                                                        />
                                                    </Col>

                                                    <Col span={12}>
                                                        <NumericField
                                                            label={translate.formatMessage(commonMessage.price)}
                                                            name={[field.name, 'price']}
                                                            min={0}
                                                            formatter={(value) =>
                                                                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                                            }
                                                            addonAfter="₫"
                                                            required
                                                        />
                                                    </Col>
                                                </Row>
                                            </Card>
                                        ))}

                                        <Button type="dashed" onClick={() => add()} block>
                                            + <FormattedMessage defaultMessage="Thêm mức giá" />
                                        </Button>
                                    </div>
                                )}
                            </Form.List>
                        )}
                    </Col>
                </Row>

                <div className="footer-card-form">{actions}</div>
            </Card>
        </Form >
    );
};

export default ServiceForm;
