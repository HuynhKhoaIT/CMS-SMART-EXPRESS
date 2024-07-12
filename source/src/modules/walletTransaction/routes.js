// import apiConfig from '@constants/apiConfig';
// import NewsSavePage from './NewsSavePage';
import WalletListSum from '.';
import WalletCustomerListSum from './Customer';
import WalletCustomerListPage from './Customer/WalletTransaction';
import WalletListPage from './WalletTransaction';

export default {
    walletListSum: {
        path: '/wallet-driver',
        title: 'Ví',
        auth: true,
        component: WalletListSum,
        // permissions: [apiConfig.news.getList.baseURL],
    },
    walletListPage: {
        path: '/wallet-transaction',
        title: 'wallet list Page',
        auth: true,
        component: WalletListPage,
        // permissions: [apiConfig.news.update.baseURL],
    },
    walletCustomerListSum: {
        path: '/wallet-customer',
        title: 'Ví',
        auth: true,
        component: WalletCustomerListSum,
        // permissions: [apiConfig.news.getList.baseURL],
    },
    walletListCustomerPage: {
        path: '/wallet-customer-transaction',
        title: 'wallet customer list Page',
        auth: true,
        component: WalletCustomerListPage,
        // permissions: [apiConfig.news.update.baseURL],
    },
};
