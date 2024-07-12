import apiConfig from '@constants/apiConfig';
import RequestPatOutListPage from '.';
import RequestPatOutListPageCustomer from '@modules/requestPayOutCustomer';
export default {
    requestPayOutListPageCustomer: {
        path: '/request-pay-out-customer',
        title: 'Request PayOut',
        auth: true,
        permissions: [apiConfig.requestPayout.getList.baseURL],
        component: RequestPatOutListPageCustomer,
    },
    requestPayOutListPage: {
        path: '/request-pay-out',
        title: 'Request PayOut',
        auth: true,
        permissions: [apiConfig.requestPayout.getList.baseURL],
        component: RequestPatOutListPage,
    },
};
