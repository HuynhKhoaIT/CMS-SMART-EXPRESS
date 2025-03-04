import apiConfig from '@constants/apiConfig';
import NationListPage from '.';
import NationSavePage from './NationSavePage';
import DistrictListPage from './district';
import DistrictSavePage from './district/DistrictSavePage';
import VillageListPage from './village';
import VillageSavePage from './village/VillageSavePage';

export default {
    // provinceListPage: {
    //     path: '/nation/province',
    //     title: 'Province List Page',
    //     auth: true,
    //     component: ProvinceListPage,
    //     // permissions: apiConfig.nation.getList.baseURL,
    // },
    // provinceSavePage: {
    //     path: '/nation/province/:id',
    //     title: 'Province Save Page',
    //     auth: true,
    //     component: ProvinceSavePage,
    //     // permissions: apiConfig.nation.getById.baseURL,
    // },

    nationListPage: {
        path: '/nation',
        title: 'Nation',
        auth: true,
        component: NationListPage,
    },
    nationSavePage: {
        path: '/nation/:id',
        title: 'Nation Save Page',
        auth: true,
        component: NationSavePage,
    },
    districtListPage: {
        path: '/nation/district',
        title: 'District List page',
        auth: true,
        component: DistrictListPage,
    },
    districtSavePage: {
        path: '/nation/district/:id',
        title: 'District Save Page',
        auth: true,
        component: DistrictSavePage,
    },
    villageListPage: {
        path: '/nation/district/village',
        title: 'District List page',
        auth: true,
        component: VillageListPage,
    },
    villageSavePage: {
        path: '/nation/district/village/:id',
        title: 'District Save Page',
        auth: true,
        component: VillageSavePage,
    },
};
