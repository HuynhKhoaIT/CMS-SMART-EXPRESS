import apiConfig from '@constants/apiConfig';
import NewsListPage from '.';
import NewsSavePage from './NewsSavePage';

export default {
    newsListPage: {
        path: '/news',
        title: 'Tin tức',
        auth: true,
        component: NewsListPage,
        permissions: [apiConfig.news.getList.baseURL],
    },
    newsSavePage: {
        path: '/news/:id',
        title: 'News Save Page',
        auth: true,
        component: NewsSavePage,
        permissions: [apiConfig.news.update.baseURL],
    },

};
