import { takeLatest } from 'redux-saga/effects';
import { accountActions } from '@store/actions';
import { processAction } from '@store/utils';
import apiConfig from '@constants/apiConfig';
import { UserTypes, storageKeys } from '@constants';
import { getData } from '@utils/localStorage';

const loginSaga = (payload) => processAction(apiConfig.account.login, payload);

const getProfileSaga = (payload) => {
    const useKind = getData(storageKeys.USER_KIND);
    let api;
    if (useKind) {
        api = apiConfig.account.getProfile;
    }

    return processAction(api, payload);
};

const sagas = [
    takeLatest(accountActions.login.type, loginSaga),
    takeLatest(accountActions.getProfile.type, getProfileSaga),
];

export default sagas;
