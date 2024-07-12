import apiConfig from '@constants/apiConfig';
import RequestPatOutListPage from '.';
export default {
    requestPayOutListPage: {
        path: '/request-pay-out-customer',
        title: 'Request PayOut',
        auth: true,
        permissions: [apiConfig.requestPayout.getList.baseURL],
        component: RequestPatOutListPage,
    },
    
};
