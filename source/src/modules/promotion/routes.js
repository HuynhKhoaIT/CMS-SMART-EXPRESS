import apiConfig from '@constants/apiConfig';
import PromotionListPage from '.';
import PromotionSavePage from './PromotionSavePage';
export default {
    promotionListPage: {
        path: '/promotion',
        title: 'Vehicle Promotion',
        auth: true,
        permissions: [apiConfig.promotion.getList.baseURL],
        component: PromotionListPage,
    },
    promotionSavePage: {
        path: '/promotion/:id',
        title: 'Vehicle promotion Save Page',
        auth: true,
        permissions: [apiConfig.promotion.create.baseURL, apiConfig.promotion.update.baseURL],
        component: PromotionSavePage,
    },

};
