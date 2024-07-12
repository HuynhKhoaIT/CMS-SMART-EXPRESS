import apiConfig from '@constants/apiConfig';
import ServiceListPage from '.';
import ServiceSavePage from './ServiceSavePage';
export default {
    serviceListPage: {
        path: '/service-category/user-service',
        title: 'Service',
        auth: true,
        permissions: [apiConfig.service.getList.baseURL],
        component: ServiceListPage,
    },
    serviceSavePage: {
        path: '/service-category/user-service/:id',
        title: 'Service Save Page',
        auth: true,
        permissions: [apiConfig.service.create.baseURL, apiConfig.service.update.baseURL],
        component: ServiceSavePage,
    },
};
