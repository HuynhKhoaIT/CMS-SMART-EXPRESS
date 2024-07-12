import React from 'react';
import apiConfig from '@constants/apiConfig';
import routes from '../routes';
import PageWrapper from '@components/common/layout/PageWrapper';
import DriverVehicleForm from './DriverVehicleForm';
import useTranslate from '@hooks/useTranslate';
import useSaveBase from '@hooks/useSaveBase';
import { generatePath, useParams } from 'react-router-dom';
import { defineMessages } from 'react-intl';
import useNotification from '@hooks/useNotification';

const message = defineMessages({
    objectName: 'Xe của tài xế',
    driver: 'Tài xế',
    driverVehicle: 'Xe của tài xế',
});

const DriverVehicleSavePage = () => {
    const { id } = useParams();
    const notification = useNotification();
    const translate = useTranslate();
    const { detail, onSave, mixinFuncs, setIsChangedFormValues, isEditing, errors, loading, title } = useSaveBase({
        apiConfig: {
            getById: apiConfig.driverVehicle.getByDriver,
            create: apiConfig.driverVehicle.create,
            update: apiConfig.driverVehicle.update,
        },
        options: {
            getListUrl: routes.driverListPage.path,
            objectName: translate.formatMessage(message.objectName),
        },
        override: (funcs) => {
            funcs.prepareUpdateData = (data) => {
                return {
                    ...data,
                    id: detail.id,
                    driverId: id,
                };
            };
            funcs.prepareCreateData = (data) => {
                return {
                    ...data,
                    driverId: id,
                };
            };
            funcs.handleFetchDetail = (params) => {
                mixinFuncs.executeGet({
                    ...params,
                    pathParams: { driverId: id },
                    onCompleted: (response) => {
                        if (!response.data) {
                            mixinFuncs.setDetail({});
                            mixinFuncs.setEditing(false);
                        } else mixinFuncs.setDetail(mixinFuncs.mappingData(response));
                    },
                    onError: (err) => {
                        notification({ type: 'error', message: 'Get driver vehicle error' });
                    },
                });
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
                    breadcrumbName: translate.formatMessage(message.driver),
                    path: generatePath(routes.driverListPage.path),
                },
                { breadcrumbName: Object.keys(detail).length > 0 ? 'Cập nhật xe của tài xế' : 'Thêm xe của tài xế' },
            ]}
            title={title}
        >
            <DriverVehicleForm
                formId={mixinFuncs.getFormId()}
                isEditing={Object.keys(detail).length > 0}
                actions={mixinFuncs.renderActions()}
                dataDetail={detail ? detail : {}}
                onSubmit={onSave}
                setIsChangedFormValues={setIsChangedFormValues}
                isError={errors}
            />
        </PageWrapper>
    );
};
export default DriverVehicleSavePage;
