import apiConfig from "@constants/apiConfig";
import FinanceListPage from ".";

export default {
    finaceListPage: {
        path: '/list-finance',
        title: 'Finance',
        auth: true,
        // permissions: [apiConfig.booking.finance.baseURL],
        component: FinanceListPage,
    },
};