// import { categoryKind } from '@constants';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
// import routes from '../routes';
import { defineMessages } from 'react-intl';
import routes from './routes';
import apiConfig from '@constants/apiConfig';
import useTranslate from '@hooks/useTranslate';
import PageWrapper from '@components/common/layout/PageWrapper';
import PromotionForm from './PromotionForm';
import { useParams } from 'react-router-dom';
import useSaveBase from '@hooks/useSaveBase';
import useListBase from '@hooks/useListBase';
const message = defineMessages({
    home: 'Home',
    promotion: 'Khuyến mãi',
    objectName: 'Khuyến mãi',
});

const PromotionSavePage = () => {
    const studentId = useParams();
    const translate = useTranslate();
    const [serviceOptions, setServiceOptions] = useState([]);
    const { data: servicesData, mixinFuncs: mixinFuncsListBase, queryFilter, loading: loadingListbase, pagination, serializeParams } = useListBase({
        apiConfig: apiConfig.service,
        options: {
            pageSize: 1000,
            objectName: 'Service',
        },
        override: (funcs) => {
            funcs.getList = () => {
                const params = mixinFuncsListBase.prepareGetListParams(queryFilter);
                mixinFuncsListBase.handleFetchList({
                    ...params,
                });
            };
            funcs.mappingData = (response) => {
                if (response.result === true) {
                    const options = response.data.content?.map((item) => {
                        return (
                            {
                                label: item?.name,
                                value: item?.id,
                            }
                        );
                    });
                    setServiceOptions(options);
                    return {
                        data: response.data.content,
                        total: response.data.totalElements,
                    };
                }
            };
        },
    });

    const { detail, onSave, mixinFuncs, setIsChangedFormValues, isEditing, errors, loading, title } = useSaveBase({
        apiConfig: {
            getById: apiConfig.promotion.getById,
            create: apiConfig.promotion.create,
            update: apiConfig.promotion.update,
        },
        options: {
            getListUrl: routes.promotionListPage.path,
            objectName: translate.formatMessage(message.objectName),
        },
        override: (funcs) => {
            funcs.prepareUpdateData = (data) => {
                return {
                    ...data,
                    id: detail.id,
                };
            };
            funcs.prepareCreateData = (data) => {
                return {
                    ...data,
                };
            };
        },
    });


    return (
        <PageWrapper
            loading={loading}
            routes={[
                {
                    breadcrumbName: translate.formatMessage(message.promotion),
                    path: routes.promotionListPage.path,
                },
                { breadcrumbName: title },
            ]}
            title={title}
        >
            <PromotionForm
                formId={mixinFuncs.getFormId()}
                actions={mixinFuncs.renderActions()}
                dataDetail={detail ? detail : {}}
                onSubmit={onSave}
                setIsChangedFormValues={setIsChangedFormValues}
                isError={errors}
                isEditing={isEditing}
                serviceOptions={serviceOptions}
            />
        </PageWrapper>
    );
};

export default PromotionSavePage;
