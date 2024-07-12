import apiConfig from '@constants/apiConfig';
import CustomerSavePage from './CustomerSavePage';
import CustomerListPage from '.';
import BookingListPage from '@modules/customer/bookingOfCustomer/index';

export default {
    customerListPage: {
        path: '/customer',
        title: 'Customer',
        auth: true,
        component: CustomerListPage,
        permissions: [apiConfig.customer.getList.baseURL],
    },
    customerSavePage: {
        path: '/customer/:id',
        title: 'Customer Save Page',
        auth: true,
        component: CustomerSavePage,
        permissions: [apiConfig.customer.update.baseURL],
    },
    customerBookingListPage: {
        path: '/customer/booking',
        title: 'Customer Booking List Page',
        auth: true,
        component: BookingListPage,
        permissions: [apiConfig.booking.getList.baseURL],
    },
};
