import apiConfig from '@constants/apiConfig';
import BookingListPage from './index';
import BookingSavePage from './BookingSavePage';
import ActivityRateListPage from './listActivityRate';
export default {
    bookingListPage: {
        path: '/booking',
        title: 'Booking',
        auth: true,
        permissions: [apiConfig.booking.getList.baseURL],
        component: BookingListPage,
    },
    bookingSavePage: {
        path: '/booking/:id',
        title: 'Booking',
        auth: true,
        permissions: [apiConfig.booking.update.baseURL],
        component: BookingSavePage,
    },
    activityRateListPage: {
        path: '/list-activity-rate',
        title: 'Tỉ lệ hoạt động',
        auth: true,
        // permissions: [apiConfig.booking.listActivityRate.baseURL],
        component: ActivityRateListPage,
    },
};
