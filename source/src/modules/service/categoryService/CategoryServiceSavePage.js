import CategorySavePageCommon from '@components/common/page/category/CategorySavePageCommon';
// import { categoryKind } from '@constants';
import React from 'react';
import { useIntl } from 'react-intl';
// import routes from '../routes';
import { defineMessages } from 'react-intl';
import routes from '@routes';
import apiConfig from '@constants/apiConfig';
import { CATEGORY_KIND_SERVICE } from '@constants';
import { commonMessage } from '@locales/intl';
import useTranslate from '@hooks/useTranslate';

const message = defineMessages({
    home: 'Home',
    newsCategory: 'News Category',
});

const CategoryServiceSavePage = () => {
    const intl = useIntl();
    const translate = useTranslate();
    return (
        <CategorySavePageCommon
            objectName={translate.formatMessage(commonMessage.service)}
            breadcrumb={[
                {
                    breadcrumbName: intl.formatMessage(commonMessage.ServiceCategory),
                    path: routes.categoryServiceListPage.path,
                },
            ]}
            apiConfig={apiConfig.category}
            getListUrl={routes.categoryServiceListPage.path}
            kind={CATEGORY_KIND_SERVICE}
        />
    );
};

export default CategoryServiceSavePage;
