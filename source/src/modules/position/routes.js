import apiConfig from '@constants/apiConfig';
import PositionListPage from '.';
import PositionSavePage from './PositionSavePage';
export default {
    positionListPage: {
        path: '/position',
        title: 'Position',
        auth: true,
        permissions: [apiConfig.position.getList.baseURL],
        component: PositionListPage,
    },
    positionSavePage: {
        path: '/position/:id',
        title: 'Position Save Page',
        auth: true,
        permissions: [apiConfig.position.create.baseURL, apiConfig.position.update.baseURL],
        component: PositionSavePage,
    },
};
