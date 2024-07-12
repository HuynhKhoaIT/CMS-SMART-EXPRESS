import { useCurrency } from '@components/common/elements/Currency';
import { UserTypes, storageKeys } from '@constants';
import useNotification from '@hooks/useNotification';
import routes from '@routes';
import { selectRestaurantList } from '@selectors/app';
import { removeCacheToken } from '@services/userService';
import { accountActions, appActions } from '@store/actions';
import { createPathWithData } from '@utils';
import { getData } from '@utils/localStorage';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import notFoundImage from '@assets/images/bg_404.png';
import React from 'react';
import HomePage from '@modules/home';

const Dashboard = () => {
    const userKind = getData(storageKeys.USER_KIND);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const notification = useNotification();
    const { fetchCurrency } = useCurrency();
    // useEffect(() => {
    //     navigate('/booking');
    // }, []);
    return <HomePage />;

    // return <img alt="not-found-background" src={notFoundImage} />;
};

export default Dashboard;
