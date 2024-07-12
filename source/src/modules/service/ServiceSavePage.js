import PageWrapper from '@components/common/layout/PageWrapper';
import { STATUS_ACTIVE, UserTypes, groupPermissionKinds, storageKeys } from '@constants';
import apiConfig from '@constants/apiConfig';
import useSaveBase from '@hooks/useSaveBase';
import React from 'react';
import { useParams } from 'react-router-dom';
import ServiceForm from './ServiceForm';
import useFetch from '@hooks/useFetch';
import { getData } from '@utils/localStorage';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import routes from './routes';
import { CATEGORY_KIND_SERVICE } from '@constants';

const ServiceSavePage = () => {
    const translate = useTranslate();
    const queryParameters = new URLSearchParams(window.location.search);
    const categoryServiceId = queryParameters.get('categoryServiceId');
    const categoryServiceName = queryParameters.get('categoryServiceName');
    const { id } = useParams();
    const { detail, mixinFuncs, loading, onSave, setIsChangedFormValues, isEditing, title } = useSaveBase({
        apiConfig: {
            getById: apiConfig.service.getById,
            create: apiConfig.service.create,
            update: apiConfig.service.update,
        },
        options: {
            getListUrl: routes?.serviceListPage?.path,
            objectName: 'Dịch vụ',
        },
        override: (funcs) => {
            funcs.prepareUpdateData = (data) => {
                return {
                    image: data.image,
                    ...data,
                    id: id,
                    categoryId: categoryServiceId,
                };
            };
            funcs.prepareCreateData = (data) => {
                return {
                    ...data,
                    status: STATUS_ACTIVE,
                    image: data.image,
                    categoryId: categoryServiceId,
                };
            };

            funcs.mappingData = (data) => {
                return {
                    ...data.data,
                };
            };
        },
    });

    return (
        <PageWrapper
            loading={loading}
            routes={[
                {
                    breadcrumbName: translate.formatMessage(commonMessage.ServiceCategory),
                    path: '/service-category',
                },
                {
                    breadcrumbName: translate.formatMessage(commonMessage.Service),
                    path:
                        routes.serviceListPage.path +
                        `?categoryServiceId=${categoryServiceId}&categoryServiceName=${categoryServiceName}`,
                },
                { breadcrumbName: title },
            ]}
        >
            <ServiceForm
                setIsChangedFormValues={setIsChangedFormValues}
                dataDetail={detail ? detail : {}}
                formId={mixinFuncs.getFormId()}
                isEditing={isEditing}
                actions={mixinFuncs.renderActions()}
                onSubmit={onSave}
            />
        </PageWrapper>
    );
};

export default ServiceSavePage;
