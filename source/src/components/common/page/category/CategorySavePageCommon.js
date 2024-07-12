import PageWrapper from '@components/common/layout/PageWrapper';
import useSaveBase from '@hooks/useSaveBase';
import React from 'react';
import CategoryFormCommon from './CategoryFormCommon';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';

function CategorySavePageCommon({
    breadcrumb,
    apiConfig,
    getListUrl,
    kind,
    objectName,
    fieldsName = {
        image: 'image',
        name: 'name',
        description: 'description',
    },
}) {
    const translate = useTranslate();
    const { detail, mixinFuncs, loading, setIsChangedFormValues, isEditing, title } = useSaveBase({
        apiConfig: {
            getById: apiConfig.getById,
            create: apiConfig.create,
            update: apiConfig.update,
        },
        options: {
            getListUrl,
            objectName: objectName,
        },
        override: (funcs) => {
            funcs.prepareUpdateData = (data) => {
                return {
                    ...data,
                    id: detail.id,
                    kind,
                    // parentId: null,
                };
            };
            funcs.prepareCreateData = (data) => {
                return {
                    ...data,
                    kind: kind,
                    ordering: 0,
                    // parentId: null,
                };
            };
        },
    });

    return (
        <PageWrapper loading={loading} routes={[...breadcrumb, { breadcrumbName: title }]} title={title}>
            <CategoryFormCommon
                setIsChangedFormValues={setIsChangedFormValues}
                dataDetail={detail ? detail : {}}
                formId={mixinFuncs.getFormId()}
                isEditing={isEditing}
                actions={mixinFuncs.renderActions()}
                onSubmit={mixinFuncs.onSave}
                fieldsName={fieldsName}
            />
        </PageWrapper>
    );
}

export default CategorySavePageCommon;
