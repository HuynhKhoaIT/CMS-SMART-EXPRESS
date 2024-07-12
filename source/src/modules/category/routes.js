import apiConfig from '@constants/apiConfig';
import CategoryListPage from '.';
import CategorySavePage from './CategorySavePage';
import CategoryServiceListPage from '@modules/service/categoryService';
import CategoryServiceSavePage from '@modules/service/categoryService/CategoryServiceSavePage';
export default {
    categoryListPage: {
        path: '/vehicle-category',
        title: 'Vehicle Category',
        auth: true,
        permissions: [apiConfig.category.getList.baseURL],
        component: CategoryListPage,
    },
    categorySavePage: {
        path: '/vehicle-category/:id',
        title: 'Vehicle category Save Page',
        auth: true,
        permissions: [apiConfig.category.create.baseURL, apiConfig.category.update.baseURL],
        component: CategorySavePage,
    },
    categoryServiceListPage: {
        path: '/service-category',
        title: 'service Category',
        auth: true,
        permissions: [apiConfig.category.getList.baseURL],
        component: CategoryServiceListPage,
    },
    categoryServiceSavePage: {
        path: '/service-category/:id',
        title: 'service category Save Page',
        auth: true,
        permissions: [apiConfig.category.create.baseURL, apiConfig.category.update.baseURL],
        component: CategoryServiceSavePage,
    },
};
