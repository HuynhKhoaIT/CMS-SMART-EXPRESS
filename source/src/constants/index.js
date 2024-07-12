export const apiUrl = process.env.REACT_APP_API;
export const bookingUrl = process.env.REACT_APP_BOOKING;
export const apiTenantUrl = 'http://api-path/';
export const apiTenantId = process.env.REACT_APP_TENANT_ID;
export const enableExposure = process.env.REACT_APP_ENABLE_EXPOSURE === 'true';
export const envType = process.env.REACT_APP_ENV;
export const envGoogleMapAPIKey = process.env.REACT_APP_GOOGLE_MAP_API_KEY;
export const fixedPath = {
    privacy: `${apiUrl}${process.env.REACT_APP_PRIVACY_PATH}`,
    help: `${apiUrl}${process.env.REACT_APP_HELP_PATH}`,
    aboutUs: `${apiUrl}${process.env.REACT_APP_ABOUT_US_PATH}`,
};

export const brandName = 'BOOKING';
export const brandNameExpress = 'SMART EXPRESS';

export const appName = 'cms-booking-app';

export const storageKeys = {
    USER_ACCESS_TOKEN: `${appName}-user-access-token`,
    USER_REFRESH_TOKEN: `${appName}-user-refresh-token`,
    USER_KIND: `${appName}-user-kind`,
    TENANT_ID: `${appName}-tenant-id`,
    RESTAURANT_ID: `${appName}-restaurant-id`,
    TENANT_HEADER: `X-tenant`,
    TENANT_API_URL: `${appName}-tenant-api-url`,
    REVENUE_TAB_ACTIVE: `${appName}-revenue-tab-active`,
};

export const baseHeader = {
    'Content-Type': 'application/json',
};

export const multipartFormHeader = {
    'Content-Type': 'multipart/form-data',
};

export const AppConstants = {
    apiRootUrl: process.env.REACT_APP_API,
    contentRootUrl: `${process.env.REACT_APP_API_MEDIA}v1/file/download`,
    mediaRootUrl: `${process.env.REACT_APP_API_MEDIA}`,
    langKey: 'vi',
};

export const THEMES = {
    DARK: 'dark',
    LIGHT: 'light',
};

export const defaultLocale = 'en';
export const locales = ['en', 'vi'];

export const activityType = {
    GAME: 'game',
    VIDEO: 'video',
    ARTICLE: 'article',
    FOCUS_AREA: 'focus-area',
};

export const DATE_DISPLAY_FORMAT = 'DD-MM-YYYY HH:mm';
export const DATE_SHORT_MONTH_FORMAT = 'DD MMM YYYY';
export const TIME_FORMAT_DISPLAY = 'HH:mm';
export const DATE_FORMAT_VALUE = 'DD/MM/YYYY';
export const DATE_FORMAT_DISPLAY = 'DD/MM/YYYY';
export const DEFAULT_FORMAT = 'DD/MM/YYYY HH:mm:ss';
export const DATE_FORMAT_ZERO_TIME = 'DD/MM/YYYY 00:00:00';
export const DATE_FORMAT_END_OF_DAY_TIME = 'DD/MM/YYYY 23:59:59';
export const DATE_FORMAT_MONTH_VALUE = 'MM/YYYY';
export const DATE_FORMAT_YEAR_VALUE = 'YYYY';
export const DEFAULT_FORMAT_ZERO_SECOND = 'DD/MM/YYYY HH:mm:00';
export const navigateTypeEnum = {
    PUSH: 'PUSH',
    POP: 'POP',
    REPLACE: 'REPLACE',
};

export const articleTypeEnum = {
    URL: 'url',
    PLAIN: 'plain',
};

export const accessRouteTypeEnum = {
    NOT_LOGIN: false,
    REQUIRE_LOGIN: true,
    BOTH: null,
};

export const UploadFileTypes = {
    AVATAR: 'AVATAR',
    LOGO: 'LOGO',
    DOCUMENT: 'DOCUMENT',
};

export const LIMIT_IMAGE_SIZE = 512000;

export const STATUS_PENDING = 0;
export const STATUS_ACTIVE = 1;
export const STATUS_INACTIVE = -1;
export const STATUS_DELETE = -2;

export const STATE_ORDER_PENDING = 0;
export const STATE_ORDER_DONE = 1;
export const STATE_ORDER_CANCEL = -1;
export const ORDER_TYPE_PICK_UP = 1;
export const ORDER_TYPE_DELIVER = 2;
export const PAYMENT_TYPE_CASH = 'OFFLINE_CASH';
export const PAYMENT_TYPE_CARD = 'OFFLINE_CARD';
export const PAYMENT_TYPE_ONLINE_PAYPAL = 'ONLINE_PAYPAL';
export const STATE_COURSE_PREPARED = 1;
export const STATE_COURSE_STARTED = 2;
export const STATE_COURSE_FINISHED = 3;
export const STATE_COURSE_CANCELED = 4;
export const STATE_COURSE_RECRUITED = 5;

export const STATE_TASK_ASIGN = 1;
export const STATE_TASK_DONE = 2;

export const STATE_PROJECT_TASK_CREATE = 1;
export const STATE_PROJECT_TASK_PROCESSING = 2;
export const STATE_PROJECT_TASK_DONE = 3;
export const STATE_PROJECT_TASK_CANCEL = 4;

export const DEFAULT_TABLE_ITEM_SIZE = 20;
export const DEFAULT_TABLE_PAGE_START = 0;
export const DEFAULT_GET_ALL_LIST = 1000;
export const DEFAULT_TIME = '01/01/2023 00:00:00';
export const commonStatus = {
    PENDING: 0,
    ACTIVE: 1,
    INACTIVE: -1,
    DELETE: -2,
};

export const UserTypes = {
    ADMIN: 1,
    MANAGER: 2,
    STUDENT: 3,
    LEADER: 4,
    COMPANY: 5,
};

export const LEADER_LOGIN_TYPE = 'leader';
export const ADMIN_LOGIN_TYPE = 'password';
export const STUDENT_LOGIN_TYPE = 'student';
export const COMPANY_LOGIN_TYPE = 'company';

export const loginOptions = [
    { label: 'Admin', value: ADMIN_LOGIN_TYPE },
    { label: 'Sinh viên', value: STUDENT_LOGIN_TYPE },
    { label: 'Leader', value: LEADER_LOGIN_TYPE },
    { label: 'Công ty', value: COMPANY_LOGIN_TYPE },
];

export const commonStatusColor = {
    [commonStatus.PENDING]: 'warning',
    [commonStatus.ACTIVE]: 'green',
    ['-1']: 'red',
};

export const appAccount = {
    APP_USERNAME: process.env.REACT_APP_USERNAME,
    APP_PASSWORD: process.env.REACT_APP_PASSWORD,
};

export const COMMON_PROTOCOL = 'jdbc:mysql://'; // using for connection string

export const CATEGORY_KIND_VEHICLE = 1;
export const CATEGORY_KIND_SERVICE = 2;
export const categoryKinds = {
    CATEGORY_KIND_VEHICLE,
    CATEGORY_KIND_SERVICE,
};

const GROUP_KIND_ADMIN = 1;
const GROUP_KIND_ORG = 2;
const GROUP_KIND_CUSTOMER = 3;
const GROUP_KIND_EMPLOYEE = 4;

export const groupPermissionKinds = {
    ADMIN: GROUP_KIND_ADMIN,
    ORG: GROUP_KIND_ORG,
    CUSTOMER: GROUP_KIND_CUSTOMER,
    EMPLOYEE: GROUP_KIND_EMPLOYEE,
};

export const groupPermissionKindsOptions = [
    { label: 'Admin', value: GROUP_KIND_ADMIN },
    { label: 'Org', value: GROUP_KIND_ORG },
    { label: 'Customer', value: GROUP_KIND_CUSTOMER },
    { label: 'Employee', value: GROUP_KIND_EMPLOYEE },
];

export const CurrentcyPositions = {
    FRONT: 0,
    BACK: 1,
};

export const chart31DaysData = [
    {
        date: '1',
        cancel: 0,
        done: 0,
        pending: 0,
    },
    {
        date: '2',
        cancel: 0,
        done: 0,
        pending: 0,
    },
    {
        date: '3',
        cancel: 0,
        done: 0,
        pending: 0,
    },
    {
        date: '4',
        cancel: 0,
        done: 0,
        pending: 0,
    },
    {
        date: '5',
        cancel: 0,
        done: 0,
        pending: 0,
    },
    {
        date: '6',
        cancel: 0,
        done: 0,
        pending: 0,
    },
    {
        date: '7',
        cancel: 0,
        done: 0,
        pending: 0,
    },
    {
        date: '8',
        cancel: 0,
        done: 0,
        pending: 0,
    },
    {
        date: '9',
        cancel: 0,
        done: 0,
        pending: 0,
    },
    {
        date: '10',
        cancel: 0,
        done: 0,
        pending: 0,
    },
    {
        date: '11',
        cancel: 0,
        done: 0,
        pending: 0,
    },
    {
        date: '12',
        cancel: 0,
        done: 0,
        pending: 0,
    },
    {
        date: '13',
        cancel: 0,
        done: 0,
        pending: 0,
    },
    {
        date: '14',
        cancel: 0,
        done: 0,
        pending: 0,
    },
    {
        date: '15',
        cancel: 0,
        done: 0,
        pending: 0,
    },
    {
        date: '16',
        cancel: 0,
        done: 0,
        pending: 0,
    },
    {
        date: '17',
        cancel: 0,
        done: 0,
        pending: 0,
    },
    {
        date: '18',
        cancel: 0,
        done: 0,
        pending: 0,
    },
    {
        date: '19',
        cancel: 0,
        done: 0,
        pending: 0,
    },
    {
        date: '20',
        cancel: 0,
        done: 0,
        pending: 0,
    },
    {
        date: '21',
        cancel: 0,
        done: 0,
        pending: 0,
    },
    {
        date: '22',
        cancel: 0,
        done: 0,
        pending: 0,
    },
    {
        date: '23',
        cancel: 0,
        done: 0,
        pending: 0,
    },
    {
        date: '24',
        cancel: 0,
        done: 0,
        pending: 0,
    },
    {
        date: '25',
        cancel: 0,
        done: 0,
        pending: 0,
    },
    {
        date: '26',
        cancel: 0,
        done: 0,
        pending: 0,
    },
    {
        date: '27',
        cancel: 0,
        done: 0,
        pending: 0,
    },
    {
        date: '28',
        cancel: 0,
        done: 0,
        pending: 0,
    },
    {
        date: '29',
        cancel: 0,
        done: 0,
        pending: 0,
    },
    {
        date: '30',
        cancel: 0,
        done: 0,
        pending: 0,
    },
    {
        date: '31',
        cancel: 0,
        done: 0,
        pending: 0,
    },
];
export const formSize = {
    small: '600px',
    normal: '700px',
    big: '900px',
};

export const LECTURE_SECTION = 1;
export const LECTURE_LESSION = 2;

export const REGISTRATION_MONEY_RECEIVED = 1;
export const REGISTRATION_MONEY_RETURN = 2;

export const TASK_LOG_WORKING = 1;
export const TASK_LOG_OFF = 100;

export const COMPANY_SEEK_STATE_LOOKING = 1;
export const COMPANY_SEEK_STATE_ACCEPT = 2;
const PROVINCE_KIND = 1;
const DISTRICT_KIND = 2;
const VILLAGE_KIND = 3;

export const nationKinds = {
    PROVINCE_KIND,
    DISTRICT_KIND,
    VILLAGE_KIND,
};
export const driverState = {
    OFF: 0,
    ON: 1,
};

export const bookingState = {
    BOOKING_STATE_CANCEL: -100,
    BOOKING_STATE_BOOKING: 0,
    BOOKING_STATE_DRIVER_ACCEPT: 100,
    BOOKING_STATE_PICKUP_SUCCESS: 200,
    BOOKING_STATE_DONE: 300,
    CONTACT_TO_CALL_CENTER: 400,
};

export const SERVICE_USER_KIND_CAR = 1;
export const SERVICE_USER_KIND_BIKE = 2;
export const SERVICE_USER_KIND_SHIP_BIKE = 3;
export const SERVICE_USER_KIND_SHIP_TRUCK = 4;

export const serviceUser = {
    SERVICE_USER_KIND_CAR,
    SERVICE_USER_KIND_BIKE,
    SERVICE_USER_KIND_SHIP_BIKE,
    SERVICE_USER_KIND_SHIP_TRUCK,
};

export const STATE_ONL = 0;
export const STATE_BUSY = 1;
export const STATE_ALL = '';
export const stateDriver = {
    STATE_ONL,
    STATE_BUSY,
    STATE_ALL,
};

export const PROMOTION_STATE_INIT = 0;
export const PROMOTION_STATE_RUNNING = 1;
export const PROMOTION_STATE_DONE = 2;
export const PROMOTION_STATE_CANCEL = 3;

export const PROMOTION_KIND_PRICE = 0;
export const PROMOTION_KIND_PERCENT = 1;

export const statePromotionValue = {
    PROMOTION_STATE_INIT,
    PROMOTION_STATE_RUNNING,
    PROMOTION_STATE_DONE,
    PROMOTION_STATE_CANCEL,
};
export const kindPromotion = {
    PROMOTION_KIND_PRICE,
    PROMOTION_KIND_PERCENT,
};

export const REVENUE_KIND_DAY = 1;
export const REVENUE_KIND_MONTH = 2;
export const REVENUE_KIND_QUARTER = 3;
export const REVENUE_KIND_YEAR = 4;


export const revenueStateTabs = [
    { label: 'Doanh thu ngày', key: REVENUE_KIND_DAY, value: REVENUE_KIND_DAY, color: 'green' },
    { label: 'Doanh thu tháng', key: REVENUE_KIND_MONTH, value: REVENUE_KIND_MONTH, color: 'blue' },
    { label: 'Doanh thu quý', key: REVENUE_KIND_QUARTER, value: REVENUE_KIND_QUARTER, color: 'yellow' },
    { label: 'Doanh thu năm', key: REVENUE_KIND_YEAR, value: REVENUE_KIND_YEAR, color: 'red' },
];

export const REQUEST_PAY_OUT_STATE_INIT = 0;
export const REQUEST_PAY_OUT_STATE_APPROVE = 1;
export const REQUEST_PAY_OUT_STATE_REJECT = 2;

export const statePayoutValue = {
    REQUEST_PAY_OUT_STATE_INIT,
    REQUEST_PAY_OUT_STATE_APPROVE,
    REQUEST_PAY_OUT_STATE_REJECT,
};

export const REQUEST_PAYOUT_KIND_DRIVER = 0;
export const REQUEST_PAYOUT_KIND_CUSTOMER = 1;


export const NEWS_STATE_INIT = 0;
export const NEWS_STATE_PUBLISHED = 1;

export const NEWS_TARGET_ALL_USERS = 1;
export const NEWS_TARGET_ALL_DRIVERS = 2;
export const NEWS_TARGET_ALL_CUSTOMERS = 3;
export const NEWS_TARGET_SPECIFIC_USERS = 4;

export const NOTIFICATION_KIND_SYSTEM = 4;
export const NOTIFICATION_KIND_PROMOTION = 5;
export const NOTIFICATION_KIND_WARNING = 6;

export const WALLET_KIND_DRIVER = 0;
export const WALLET_KIND_CUSTOMER = 1;


export const IS_BOOKING = false;