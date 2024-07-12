import PageWrapper from '@components/common/layout/PageWrapper';
import { STATUS_ACTIVE, UserTypes, groupPermissionKinds, storageKeys } from '@constants';
import apiConfig from '@constants/apiConfig';
import useSaveBase from '@hooks/useSaveBase';
import React from 'react';
import { useParams } from 'react-router-dom';
import useFetch from '@hooks/useFetch';
import { getData } from '@utils/localStorage';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import PositionForm from './PositionForm';

const PositionSavePage = () => {
    const translate = useTranslate();
    const { id } = useParams();
    const { detail, mixinFuncs, loading, onSave, setIsChangedFormValues, isEditing, title } = useSaveBase({
        apiConfig: {
            getById: apiConfig.position.getById,
            create: apiConfig.position.create,
            update: apiConfig.position.update,
        },
        options: {
            getListUrl: `/position`,
            objectName: 'Tài xế online',
        },
        override: (funcs) => {
            funcs.prepareUpdateData = (data) => {
                return {
                    ...data,
                    id: id,
                };
            };
            funcs.prepareCreateData = (data) => {
                return {
                    ...data,
                    status: STATUS_ACTIVE,
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
                { breadcrumbName: translate.formatMessage(commonMessage.Position), path: `/position` },
                { breadcrumbName: title },
            ]}
        >
            <PositionForm
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

export default PositionSavePage;
