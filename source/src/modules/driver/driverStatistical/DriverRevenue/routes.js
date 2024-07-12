import apiConfig from '@constants/apiConfig';
import RevenueListPage from '.';
export default {
    revenueListPage: {
        path: '/revenue',
        title: 'Revenue',
        auth: true,
        permissions: [apiConfig.booking.revenue.baseURL],
        component: RevenueListPage,
    },
    
};
