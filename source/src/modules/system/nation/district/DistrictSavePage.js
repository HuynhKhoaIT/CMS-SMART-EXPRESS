import PageWrapper from '@components/common/layout/PageWrapper';
import apiConfig from '@constants/apiConfig';
import useSaveBase from '@hooks/useSaveBase';
import React from 'react';
import { defineMessages } from 'react-intl';
import DistrictForm from './DistrictForm';
import routes from '../routes';
import useTranslate from '@hooks/useTranslate';
// import { commonMessage } from '@locales/intl';

const messages = defineMessages({
    province: 'Tỉnh, thành phố',
    district: 'Quận, huyện',
});

const DistrictSavePage = () => {
    const translate = useTranslate();
    const queryParameters = new URLSearchParams(window.location.search);
    const provinceId = queryParameters.get('provinceId');
    const provinceName = queryParameters.get('provinceName');

    const { detail, mixinFuncs, loading, setIsChangedFormValues, isEditing, title } = useSaveBase({
        apiConfig: {
            getById: apiConfig.nation.getById,
            create: apiConfig.nation.create,
            update: apiConfig.nation.update,
        },
        options: {
            getListUrl: routes.districtListPage.path,
            objectName: translate.formatMessage(messages.district),
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
                { breadcrumbName: 'Home' },
                { breadcrumbName: translate.formatMessage(messages.province), path: routes.nationListPage.path },
                {
                    breadcrumbName: `${provinceName}`,
                    path: routes.districtListPage.path + `?provinceId=${provinceId}&provinceName=${provinceName}`,
                },
                { breadcrumbName: title },
            ]}
            title={title}
        >
            <DistrictForm
                setIsChangedFormValues={setIsChangedFormValues}
                dataDetail={detail ? detail : {}}
                formId={mixinFuncs.getFormId()}
                isEditing={isEditing}
                actions={mixinFuncs.renderActions()}
                onSubmit={mixinFuncs.onSave}
            />
        </PageWrapper>
    );
};

export default DistrictSavePage;
