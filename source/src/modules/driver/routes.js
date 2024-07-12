import apiConfig from '@constants/apiConfig';
import DriverListPage from './index';
import DriverSavePage from './DriverSavePage';
import DriverServiceSavePage from './driverService/DriverServiceSavePage';
import DriverServiceListPage from './driverService';
import DriverVehicleSavePage from './driverVehicle/DriverVehicleSavePage';
import DriverStatisticalPage from './driverStatistical';
export default {
    driverListPage: {
        path: '/driver',
        title: 'Driver',
        auth: true,
        component: DriverListPage,
        permissions: [apiConfig.driver.getList.baseURL],
    },
    driverSavePage: {
        path: '/driver/:id',
        title: 'Driver Save Page',
        auth: true,
        component: DriverSavePage,
        permissions: [apiConfig.driver.create.baseURL, apiConfig.driver.update.baseURL],
    },
    driverServiceListPage: {
        path: '/driver/driver-service',
        title: 'Driver Service',
        auth: true,
        component: DriverServiceListPage,
        permissions: [apiConfig.driverService.getList.baseURL],
    },
    driverServiceSavePage: {
        path: '/driver/driver-service/:id',
        title: 'Driver Service Save Page',
        auth: true,
        component: DriverServiceSavePage,
        permissions: [apiConfig.driverService.create.baseURL, apiConfig.driverService.update.baseURL],
    },
    driverVehicleSavePage: {
        path: '/driver/driver-vehicle/:id',
        title: 'Driver Vehicle Save Page',
        auth: true,
        component: DriverVehicleSavePage,
        permissions: [apiConfig.driverVehicle.create.baseURL, apiConfig.driverVehicle.update.baseURL],
    },
    driverStatisticalListPage: {
        path: '/driver/driver-statistical',
        title: 'Driver statistical',
        auth: true,
        component: DriverStatisticalPage,
        // permissions: [apiConfig.driverService.getList.baseURL],
    },
};
