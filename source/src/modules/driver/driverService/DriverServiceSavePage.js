import React from 'react';
import apiConfig from '@constants/apiConfig';
import routes from '../routes';
import PageWrapper from '@components/common/layout/PageWrapper';
import DriverServiceForm from './DriverServiceForm';
import useTranslate from '@hooks/useTranslate';
import useSaveBase from '@hooks/useSaveBase';
import { generatePath, useParams } from 'react-router-dom';
import { defineMessages } from 'react-intl';
const message = defineMessages({
    objectName: 'Dịch vụ tài xế',
    driver: 'Tài xế',
    driverService: 'Dịch vụ tài xế',
});

const DriverServiceSavePage = () => {
    const translate = useTranslate();
    const queryParameters = new URLSearchParams(window.location.search);
    const driverId = queryParameters.get('driverId');
    const { detail, onSave, mixinFuncs, setIsChangedFormValues, isEditing, errors, loading, title } = useSaveBase({
        apiConfig: {
            getById: apiConfig.driverService.getById,
            create: apiConfig.driverService.create,
            update: apiConfig.driverService.update,
        },
        options: {
            getListUrl: routes.driverServiceListPage.path + `?driverId=${driverId}`,
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
                    driverId: driverId,
                };
            };
        },
    });
    return (
        <PageWrapper
            loading={loading}
            routes={[
                {
                    breadcrumbName: translate.formatMessage(message.driver),
                    path: generatePath(routes.driverListPage.path),
                },
                {
                    breadcrumbName: translate.formatMessage(message.driverService),
                    path: generatePath(routes.driverServiceListPage.path) + `?driverId=${driverId}`,
                },
                { breadcrumbName: title },
            ]}
            title={title}
        >
            <DriverServiceForm
                formId={mixinFuncs.getFormId()}
                actions={mixinFuncs.renderActions()}
                dataDetail={detail ? detail : {}}
                onSubmit={onSave}
                setIsChangedFormValues={setIsChangedFormValues}
                isError={errors}
                isEditing={isEditing}
            />
        </PageWrapper>
    );
};
export default DriverServiceSavePage;
