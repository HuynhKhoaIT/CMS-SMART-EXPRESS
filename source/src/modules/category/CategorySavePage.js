import CategorySavePageCommon from '@components/common/page/category/CategorySavePageCommon';
// import { categoryKind } from '@constants';
import React from 'react';
import { useIntl } from 'react-intl';
// import routes from '../routes';
import { defineMessages } from 'react-intl';
import routes from './routes';
import apiConfig from '@constants/apiConfig';
import { CATEGORY_KIND_VEHICLE } from '@constants';
import { commonLanguages } from '@constants/masterData';
import { commonMessage } from '@locales/intl';
import useTranslate from '@hooks/useTranslate';

const message = defineMessages({
    home: 'Home',
    newsCategory: 'News Category',
});

const CategorySavePage = () => {
    const intl = useIntl();
    const translate = useTranslate();

    return (
        <CategorySavePageCommon
            objectName={translate.formatMessage(commonMessage.vehicleCategory)}
            breadcrumb={[
                {
                    breadcrumbName: intl.formatMessage(commonMessage.VehicleCategory),
                    path: routes.categoryListPage.path,
                },
            ]}
            apiConfig={apiConfig.category}
            getListUrl={routes.categoryListPage.path}
            kind={CATEGORY_KIND_VEHICLE}
        />
    );
};

export default CategorySavePage;
