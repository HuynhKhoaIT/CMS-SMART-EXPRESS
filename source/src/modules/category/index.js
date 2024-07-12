import React from 'react';

import CategoryListPageCommon from '@components/common/page/category/CategoryListPageCommon';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import { CATEGORY_KIND_VEHICLE } from '@constants';

const CategoryListPage = () => {
    const translate = useTranslate();

    return (
        <CategoryListPageCommon
            routes={[{ breadcrumbName: translate.formatMessage(commonMessage.VehicleCategory) }]}
            kind={CATEGORY_KIND_VEHICLE}
        />
    );
};

export default CategoryListPage;
