import {
    CurrentcyPositions,
    STATE_ORDER_CANCEL,
    STATE_ORDER_DONE,
    STATE_ORDER_PENDING,
    STATUS_ACTIVE,
    STATUS_INACTIVE,
    STATUS_PENDING,
    LECTURE_LESSION,
    LECTURE_SECTION,
    STATE_COURSE_PREPARED,
    STATE_COURSE_STARTED,
    STATE_COURSE_FINISHED,
    STATE_COURSE_CANCELED,
    STATE_TASK_ASIGN,
    STATE_TASK_DONE,
    STATE_COURSE_RECRUITED,
    STATE_PROJECT_TASK_CREATE,
    STATE_PROJECT_TASK_PROCESSING,
    STATE_PROJECT_TASK_DONE,
    STATE_PROJECT_TASK_CANCEL,
    REGISTRATION_MONEY_RECEIVED,
    REGISTRATION_MONEY_RETURN,
    TASK_LOG_WORKING,
    TASK_LOG_OFF,
    COMPANY_SEEK_STATE_LOOKING,
    COMPANY_SEEK_STATE_ACCEPT,
    nationKinds,
    driverState,
    serviceUser,
    bookingState,
    stateDriver,
    statePromotionValue,
    kindPromotion,
    statePayoutValue,
    NEWS_TARGET_ALL_USERS,
    NEWS_TARGET_ALL_DRIVERS,
    NEWS_TARGET_ALL_CUSTOMERS,
    NEWS_TARGET_SPECIFIC_USERS,
    NEWS_STATE_INIT,
    NEWS_STATE_PUBLISHED,
    NOTIFICATION_KIND_SYSTEM,
    NOTIFICATION_KIND_PROMOTION,
    NOTIFICATION_KIND_WARNING,
} from '@constants';
import {
    dateFilterMessage,
    dayOfWeek,
    discountTypeOptionIntl,
    genderMessage,
    orderStateMessage,
    promotionKindOptionIntl,
    statePromotion,
    statusMessage,
    lectureKindMessage,
    lectureStateMessage,
    taskStateMessage,
    stateResgistrationMessage,
    statusSubjectMessage,
    projectTaskStateMessage,
    registrationMoneyKindMessage,
    actionMessage,
    stateCourseRequestMessage,
    taskLog,
    companySeek,
    expYearMessage,
    archivedMessage,
    nationKindMessage,
    statedriverServiceMessage,
    statusVNMessage,
    serviceUserIntl,
    statedBookingMessage,
    stateDriverMessage,
    kindPromotionMessage,
    statePromotionMessage,
    statePayoutMessage,
    targerVNMessage,
    stateNewsMessage,
    kindNewsMessage,
} from './intl';
import { commonMessage } from '@locales/intl';

export const languageOptions = [
    { value: 1, label: 'EN' },
    { value: 2, label: 'VN' },
    { value: 3, label: 'Other' },
];

export const orderOptions = [
    { value: 1, label: '1' },
    { value: 2, label: '2' },
    { value: 3, label: '3' },
];

export const commonStatus = [
    { value: STATUS_ACTIVE.toString(), label: 'Active', color: 'green' },
    { value: STATUS_PENDING.toString(), label: 'Pending', color: 'warning' },
    { value: STATUS_INACTIVE.toString(), label: 'Inactive', color: 'red' },
];

export const lectureState = [
    { value: STATE_COURSE_PREPARED, label: lectureStateMessage.prepared, color: 'yellow' },
    { value: STATE_COURSE_RECRUITED, label: lectureStateMessage.recruit, color: 'blue' },
    { value: STATE_COURSE_STARTED, label: lectureStateMessage.started, color: 'warning' },
    { value: STATE_COURSE_FINISHED, label: lectureStateMessage.finished, color: 'green' },
    { value: STATE_COURSE_CANCELED, label: lectureStateMessage.canceled, color: 'red' },
];

export const taskState = [
    { value: STATE_TASK_ASIGN, label: taskStateMessage.asign, color: 'warning' },
    { value: STATE_TASK_DONE, label: taskStateMessage.done, color: 'green' },
];

export const projectTaskState = [
    { value: STATE_PROJECT_TASK_CREATE, label: projectTaskStateMessage.create, color: 'yellow' },
    { value: STATE_PROJECT_TASK_PROCESSING, label: projectTaskStateMessage.processing, color: 'blue' },
    { value: STATE_PROJECT_TASK_DONE, label: projectTaskStateMessage.done, color: 'green' },
    { value: STATE_PROJECT_TASK_CANCEL, label: projectTaskStateMessage.cancel, color: 'red' },
];

export const archivedOption = [
    { value: 0, label: archivedMessage.NotReset },
    { value: 1, label: archivedMessage.Reset },
];

export const statusOptions = [
    {
        value: STATUS_PENDING,
        label: statusVNMessage.pending,
        color: '#FFBF00',
    },
    {
        value: STATUS_ACTIVE,
        label: statusVNMessage.active,
        color: '#00A648',
    },
    {
        value: STATUS_INACTIVE,
        label: statusVNMessage.inactive,
        color: '#CC0000',
    },
];

export const statusSubjectOptions = [
    {
        value: 0,
        label: statusSubjectMessage.active,
        color: 'green',
    },
    {
        value: 1,
        label: statusSubjectMessage.canceled,
        color: 'red',
    },
];
export const stateResgistrationOptions = [
    {
        value: 1,
        label: stateResgistrationMessage.register,
        color: 'yellow',
    },
    { value: 2, label: stateResgistrationMessage.learning, color: 'blue' },
    { value: 3, label: stateResgistrationMessage.finished, color: 'green' },
    { value: 4, label: stateResgistrationMessage.canceled, color: 'red' },
];

export const lectureKindOptions = [
    {
        value: LECTURE_LESSION,
        label: lectureKindMessage.lesson,
        color: '#00A648',
    },
    {
        value: LECTURE_SECTION,
        label: lectureKindMessage.section,
        color: '#FFBF00',
    },
];

export const commonStatusOptions = [
    { value: STATUS_ACTIVE, label: 'Active' },
    { value: STATUS_PENDING, label: 'Pending' },
    { value: STATUS_INACTIVE, label: 'Inactive' },
];

export const MALE = 1;
export const FEMALE = 2;

export const genderOptions = [
    { label: genderMessage.male, value: MALE },
    { label: genderMessage.female, value: FEMALE },
];

export const formSize = {
    small: '700px',
    normal: '800px',
    big: '900px',
};

export const commonLanguages = [
    { value: 'vi', label: 'Việt Nam' },
    { value: 'en', label: 'English' },
    { value: 'de', label: 'German' },
];
export const CATEGORY_KIND_GENERATION = 2;
export const CATEGORY_KIND_EDUCATION = 1;
export const CATEGORY_KIND_MAJOR = 3;
export const CATEGORY_KIND_NEW = 4;
export const CATEGORY_KIND_SERVICE = 5;
export const CATEGORY_KIND_INVOICE_IN = 6;
export const CATEGORY_KIND_INVOICE_OUT = 7;
export const CATEGORY_KIND_KNOWLEDGE = 8;
export const CATEGORY_KIND_DEVICE = 9;
export const CATEGORY_KIND_PROVIDER_PRODUCT = 10;
export const categoryKind = {
    service: {
        title: 'Category',
        path: 'service',
        value: CATEGORY_KIND_SERVICE,
    },
    education: {
        title: 'Danh mục trường',
        path: 'education',
        value: CATEGORY_KIND_EDUCATION,
    },
    generation: {
        title: 'Danh mục hệ',
        path: 'generation',
        value: CATEGORY_KIND_GENERATION,
    },
    major: {
        title: 'Danh mục chuyên ngành',
        path: 'major',
        value: CATEGORY_KIND_MAJOR,
    },
};

export const datetimeFormats = [
    { value: 'DD.MM.YYYY HH:mm', label: 'dd.MM.yyyy' },
    { value: 'YYYY.MM.DD HH:mm', label: 'yyyy.MM.dd' },
];

export const orderMethods = [
    { value: 'OFFLINE_CASH', label: 'Tiền mặt' },
    { value: 'OFFLINE_CARD', label: 'Thẻ' },
    { value: 'ONLINE_PAYPAL', label: 'Paypal' },
];

export const currentcyPositions = [
    { value: CurrentcyPositions.FRONT, label: '$ 1234,56' },
    { value: CurrentcyPositions.BACK, label: '1234,56 $' },
];

export const daysOfWeekSchedule = [
    { value: 'monday', label: dayOfWeek.monday },
    { value: 'tuesday', label: dayOfWeek.tuesday },
    { value: 'wednesday', label: dayOfWeek.wednesday },
    { value: 'thursday', label: dayOfWeek.thursday },
    { value: 'friday', label: dayOfWeek.friday },
    { value: 'saturday', label: dayOfWeek.saturday },
    { value: 'sunday', label: dayOfWeek.sunday },
];

export const FREE_STATE = 0;
export const BUSY_STATE = 1;

export const stateOptions = [
    { label: 'Rảnh', value: FREE_STATE, color: '#00A648' },
    { label: 'Bận', value: BUSY_STATE, color: '#FFBF00' },
];

export const HALF = 0;
export const FULL = 1;

export const salaryType = [
    { label: 'Chia sẻ', value: HALF },
    { label: 'Đầy đủ', value: FULL },
];

export const STATE_PROMOTION_CREATED = 'CREATED';
export const STATE_PROMOTION_RUNNING = 'RUNNING';
export const STATE_PROMOTION_END = 'END';
export const STATE_PROMOTION_CANCEL = 'CANCEL';

export const statePromotionOptions = [
    { label: statePromotion.created, value: STATE_PROMOTION_CREATED, color: '#FFBF00' },
    { label: statePromotion.running, value: STATE_PROMOTION_RUNNING, color: '#00A648' },
    { label: statePromotion.end, value: STATE_PROMOTION_END, color: '#FF3333' },
    { label: statePromotion.cancel, value: STATE_PROMOTION_CANCEL, color: '#F69501' },
];

export const PROMOTION_KIND_USE_ONCE = 2;
export const PROMOTION_KIND_USE_MULTIPLE = 1;

export const promotionKindOption = [
    { label: promotionKindOptionIntl.one, value: PROMOTION_KIND_USE_ONCE },
    { label: promotionKindOptionIntl.multiple, value: PROMOTION_KIND_USE_MULTIPLE },
];

export const DISCOUNT_TYPE_PERCENT = 1;
export const DISCOUNT_TYPE_MONEY = 2;

export const discountTypeOption = [
    { label: discountTypeOptionIntl.percent, value: DISCOUNT_TYPE_PERCENT },
    { label: discountTypeOptionIntl.money, value: DISCOUNT_TYPE_MONEY },
];
export const dateFilterOptions = [
    { value: 1, label: dateFilterMessage.today },
    { value: 2, label: dateFilterMessage.thisMonth },
    { value: 3, label: dateFilterMessage.lastMonth },
    { value: 4, label: dateFilterMessage.custom },
];
export const levelOptionSelect = [
    {
        value: 1,
        label: 'Level 1',
    },
    { value: 2, label: 'Level 2' },
    { value: 3, label: 'Level 3' },
    { value: 4, label: 'Level 4' },
    { value: 5, label: 'Level 5' },
];

export const settingGroups = {
    GENERAL: 'general',
    STRINGEE: 'Stringee',
};

export const registrationMoneyKind = [
    { value: REGISTRATION_MONEY_RECEIVED, label: registrationMoneyKindMessage.receivedMoney, color: 'yellow' },
    { value: REGISTRATION_MONEY_RETURN, label: registrationMoneyKindMessage.returnMoney, color: 'blue' },
];
export const actionOptions = [
    {
        value: 1,
        label: actionMessage.contactForm,
    },
    { value: 2, label: actionMessage.navigation },
];

export const stateCourseRequestOptions = [
    { value: 0, label: stateCourseRequestMessage.request, color: 'orange' },
    {
        value: 1,
        label: stateCourseRequestMessage.processed,
        color: 'green',
    },
    { value: 2, label: stateCourseRequestMessage.cancel, color: 'red' },
];
export const TaskLogKindOptions = [
    {
        value: TASK_LOG_WORKING,
        label: taskLog.working,
        color: 'green',
    },
    {
        value: TASK_LOG_OFF,
        label: taskLog.off,
        color: 'red',
    },
];
export const companySeekOptions = [
    {
        value: COMPANY_SEEK_STATE_LOOKING,
        label: companySeek.looking,
    },
    {
        value: COMPANY_SEEK_STATE_ACCEPT,
        label: companySeek.accept,
    },
];
export const expYearOptions = [
    { value: 0, label: expYearMessage.noExperience },
    {
        value: 1,
        label: expYearMessage.oneYear,
    },
    { value: 2, label: expYearMessage.twoYear },
    { value: 3, label: expYearMessage.threeYear },
    { value: 4, label: expYearMessage.fourYear },
    { value: 5, label: expYearMessage.fiveYear },
];
export const nationKindOptions = [
    {
        value: nationKinds.PROVINCE_KIND,
        label: nationKindMessage.province,
    },
    {
        value: nationKinds.DISTRICT_KIND,
        label: nationKindMessage.district,
    },
    {
        value: nationKinds.VILLAGE_KIND,
        label: nationKindMessage.village,
    },
];

export const DriverServiceOptions = [
    {
        value: driverState.ON,
        label: statedriverServiceMessage.on,
        color: '#00A648',
    },
    {
        value: driverState.OFF,
        label: statedriverServiceMessage.off,
        color: '#CC0000',
    },
];

export const serviceOptions = [
    {
        value: serviceUser.SERVICE_USER_KIND_BIKE,
        label: serviceUserIntl.bike,
    },
    {
        value: serviceUser.SERVICE_USER_KIND_CAR,
        label: serviceUserIntl.car,
    },
    {
        value: serviceUser.SERVICE_USER_KIND_SHIP_BIKE,
        label: serviceUserIntl.shipBike,
    }, {
        value: serviceUser.SERVICE_USER_KIND_SHIP_TRUCK,
        label: serviceUserIntl.shipTruck,
    },
];

export const BookingOptions = [
    {
        value: bookingState.BOOKING_STATE_BOOKING,
        label: statedBookingMessage.booking,
        color: 'orange',
    },
    {
        value: bookingState.BOOKING_STATE_DRIVER_ACCEPT,
        label: statedBookingMessage.driverAccept,
        color: 'yellow',
    },
    {
        value: bookingState.BOOKING_STATE_PICKUP_SUCCESS,
        label: statedBookingMessage.pickupSuccess,
        color: 'blue',
    },
    {
        value: bookingState.BOOKING_STATE_DONE,
        label: statedBookingMessage.done,
        color: 'green',
    },
    {
        value: bookingState.BOOKING_STATE_CANCEL,
        label: statedBookingMessage.cancel,
        color: 'red',
    },
    {
        value: bookingState.CONTACT_TO_CALL_CENTER,
        label: statedBookingMessage.callCenter,
        color: 'yellow',
    },
];

export const stateDriverOptions = [
    {
        value: stateDriver.STATE_ONL,
        label: stateDriverMessage.onl,
        color: '#FFBF00',
    },
    {
        value: stateDriver.STATE_BUSY,
        label: stateDriverMessage.busy,
        color: '#00A648',
    },
    {
        value: stateDriver.STATE_ALL,
        label: stateDriverMessage.all,
        color: '#CC0000',
    },
];


export const statePromotionValueOptions = [
    {
        value: statePromotionValue.PROMOTION_STATE_INIT,
        label: statePromotionMessage.init,
        color: 'yellow',
    },
    {
        value: statePromotionValue.PROMOTION_STATE_RUNNING,
        label: statePromotionMessage.running,
        color: 'blue',
    },
    {
        value: statePromotionValue.PROMOTION_STATE_DONE,
        label: statePromotionMessage.done,
        color: 'green',
    },
    {
        value: statePromotionValue.PROMOTION_STATE_CANCEL,
        label: statePromotionMessage.cancel,
        color: 'cancel',
    },
];


export const kindPromotionOptions = [
    {
        value: kindPromotion.PROMOTION_KIND_PERCENT,
        label: kindPromotionMessage.percent,
        color: 'blue',
    },
    {
        value: kindPromotion.PROMOTION_KIND_PRICE,
        label: kindPromotionMessage.price,
        color: 'green',
    },
];
export const statePayout = [
    {
        value: statePayoutValue.REQUEST_PAY_OUT_STATE_INIT,
        label: statePayoutMessage.init,
        color: 'yellow',
    },
    {
        value: statePayoutValue.REQUEST_PAY_OUT_STATE_APPROVE,
        label: statePayoutMessage.approve,
        color: 'green',
    },
    {
        value: statePayoutValue.REQUEST_PAY_OUT_STATE_REJECT,
        label: statePayoutMessage.reject,
        color: 'red',
    },
];


export const dataTypeSetting = {
    INT: 'int',
    STRING: 'string',
    BOOLEAN: 'boolean',
    DOUBLE: 'double',
    RICHTEXT: 'richtext',
    OBJECT: 'object',
};

export const targetOptions = [
    {
        value: NEWS_TARGET_ALL_USERS,
        label: targerVNMessage.allUsers,
        color: 'blue',
    },
    {
        value: NEWS_TARGET_ALL_DRIVERS,
        label: targerVNMessage.allDriver,
        color: 'green',
    },
    {
        value: NEWS_TARGET_ALL_CUSTOMERS,
        label: targerVNMessage.allCustomers,
        color: 'yellow',
    },
    {
        value: NEWS_TARGET_SPECIFIC_USERS,
        label: targerVNMessage.specificUsers,
        color: 'orange',
    },
];

export const newsStateOptions = [
    {
        value: NEWS_STATE_INIT,
        label: stateNewsMessage.init,
        color: 'green',
    },
    {
        value: NEWS_STATE_PUBLISHED,
        label: stateNewsMessage.public,
        color: 'red',
    },
];


export const kindOptions = [
    {
        value: NOTIFICATION_KIND_SYSTEM,
        label: kindNewsMessage.system,
        color: 'blue',
    },
    {
        value: NOTIFICATION_KIND_PROMOTION,
        label: kindNewsMessage.promotion,
        color: 'green',
    },
    {
        value: NOTIFICATION_KIND_WARNING,
        label: kindNewsMessage.warning,
        color: 'orange',
    },
];

export const walletValueKind = [
    { value: '0', label: commonMessage.deposit, color: 'green' },
    { value: '1', label: commonMessage.withdrawal, color: 'blue' },
    { value: '2', label: commonMessage.payment, color: 'volcano' },
    { value: '3', label: commonMessage.moneyReceived, color: 'purple' },
    { value: '4', label: commonMessage.payment, color: 'volcano' },
    { value: '5', label: commonMessage.compensation, color: 'red' },
    { value: '6', label: commonMessage.refund, color: 'red' },

];
