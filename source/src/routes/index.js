import PageNotAllowed from '@components/common/page/PageNotAllowed';
import PageNotFound from '@components/common/page/PageNotFound';
import Dashboard from '@modules/entry';
import LoginPage from '@modules/login/index';
import ProfilePage from '@modules/profile/index';
import driverRoutes from '@modules/driver/routes';
import serviceRoutes from '@modules/service/routes';
import vehicleServiceRoutes from '@modules/category/routes';
import nationRoutes from '@modules/system/nation/routes';
import positionRoutes from '@modules/position/routes';
import customerRoutes from '@modules/customer/routes';
import mapRoutes from '@modules/map/routes';
import bookingRoutes from '@modules/booking/routes';
import promotionRoutes from '@modules/promotion/routes';
import revenueRoutes from '@modules/revenue/routes';
import settingRoutes from '@modules/settings/routes';
import newsRoutes from '@modules/news/routes';
import financeRoutes from '@modules/finance/routes';
import walletRoutes from '@modules/walletTransaction/routes';

import requestPayoutRoutes from '@modules/requestPayOut/routes';

/*
    auth
        + null: access login and not login
        + true: access login only
        + false: access not login only
*/
const routes = {
    pageNotAllowed: {
        path: '/not-allowed',
        component: PageNotAllowed,
        auth: null,
        title: 'Page not allowed',
    },
    homePage: {
        path: '/',
        component: Dashboard,
        auth: true,
        title: 'Home',
    },
    loginPage: {
        path: '/login',
        component: LoginPage,
        auth: false,
        title: 'Login page',
    },
    profilePage: {
        path: '/profile',
        component: ProfilePage,
        auth: true,
        title: 'Profile page',
    },
    // keep this at last
    //
    ...serviceRoutes,
    ...vehicleServiceRoutes,
    ...nationRoutes,
    ...positionRoutes,
    ...customerRoutes,
    ...mapRoutes,
    ...bookingRoutes,
    ...promotionRoutes,
    ...revenueRoutes,
    ...requestPayoutRoutes,
    ...settingRoutes,
    ...newsRoutes,
    ...financeRoutes,
    ...walletRoutes,
    notFound: {
        component: PageNotFound,
        auth: null,
        title: 'Page not found',
        path: '*',
    },
    ...driverRoutes,
};

export default routes;
