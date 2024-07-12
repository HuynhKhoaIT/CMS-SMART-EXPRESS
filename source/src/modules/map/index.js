import React, { useEffect, useState } from 'react';
import GoogleMapReact from 'google-map-react';
import style from './index.module.scss';
import { Avatar, Flex } from 'antd';
import { AppConstants, envGoogleMapAPIKey } from '@constants';
import useFetch from '@hooks/useFetch';
import apiConfig from '@constants/apiConfig';
import PageWrapper from '@components/common/layout/PageWrapper';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import { FieldTypes } from '@constants/formConfig';
import SearchForm from '@components/common/form/SearchForm';
import useQueryParams from '@hooks/useQueryParams';
import { stateDriverOptions } from '@constants/masterData';

const Marker = ({ marker, serviceImg, type }) => {
    const { address, avatar, distance, fullName, phone, status } = marker;
    return (
        <div className={style.markerContainer}>
            {!type && (
                <div className={style.infoBox}>
                    <div className={style.infoBoxText}>
                        <div className={style.titleWrapper}>
                            <div className={style.avatar}>
                                <Avatar src={avatar ? `${AppConstants.contentRootUrl}${avatar}` : null} size="large" />
                            </div>
                            <span className={style.fullName}>{fullName}</span>
                        </div>
                        <span className={style.phone}>{phone}</span>
                        <p className={style.address}>{address}</p>
                    </div>
                </div>
            )}
            <img
                width="60"
                height="60"
                src={serviceImg ? `${AppConstants.contentRootUrl}${serviceImg}` : null}
                alt="driver"
            />
        </div>
    );
};
const MapPage = () => {
    const translate = useTranslate();
    const stateDriverValue = translate.formatKeys(stateDriverOptions, ['label']);

    const { params: queryParams, setQueryParams, deserializeParams } = useQueryParams();
    const [defaultProps, setDefaultProps] = useState({
        center: {
            lat: 10.8127596,
            lng: 106.5573114,
        },
        zoom: 11,
    });

    const [locate, setLocate] = useState({
        locate: {
            lat: null,
            lng: null,
        },
    });
    const [selected, setSelect] = useState();
    const [serviceImg, setServiceImg] = useState('');
    const { data: dataMap, execute: executeGetDataMap } = useFetch(apiConfig.map.getList, {
        mappingData: (res) => {
            if (res.data.content) {
                return res.data.content;
            }
            return [];
        },
    });
    const { data: dataService } = useFetch(apiConfig.service.autocomplete, {
        immediate: true,
        mappingData: (res) => {
            let serviceOptions = [];
            res.data.content.map((service) => {
                serviceOptions.push({ value: service.id, label: service.name });
            });
            setQueryParams({ serviceId: serviceOptions[0].value });
            setServiceImg(res.data.content[0].image);
            return { options: [...serviceOptions], data: res.data.content };
        },
    });

    const handleOnClickMap = ({ x, y, lat, lng, event }) => {
        // console.log('🚀 ~ file: index.js:129 ~ handleOnClickMap ~ x, y, lat, lng, event:', x, y, lat, lng, event);
        setLocate({ locate: { lat: lat, lng: lng } });
        setSelect({ id: x, latitude: lat, longitude: lng, serviceImg: '/AVATAR/AVATAR_6egcLz0cdK.png' });
    };
    const handleOnSearchFilter = (value) => {
        if (value.state === undefined || value.state === '') {
            delete value.state;
        }
        setQueryParams(value);
        const foundItem = dataService.data.find((item) => item.id === value.serviceId);
        setServiceImg(foundItem.image);
    };

    const searchFields = [
        {
            key: 'serviceId',
            placeholder: translate.formatMessage(commonMessage.service),
            options: dataService?.options,
            type: FieldTypes.SELECT,
            width: '100px',
            submitOnChanged: true,
        },

        {
            key: 'state',
            placeholder: translate.formatMessage(commonMessage.state),
            options: stateDriverValue,
            type: FieldTypes.SELECT,
            width: '100px',
            submitOnChanged: true,
        },
    ];
    useEffect(() => {
        const state = parseInt(queryParams.get('state'));
        if (parseInt(queryParams.get('serviceId')) && !isNaN(state)) {
            executeGetDataMap({
                params: {
                    serviceId: parseInt(queryParams.get('serviceId')),
                    state: parseInt(queryParams.get('state')),
                },
            });
        } else {
            executeGetDataMap({
                params: {
                    serviceId: parseInt(queryParams.get('serviceId')),
                },
            });
        }
        if (locate?.locate?.lat !== null) {
            executeGetDataMap({
                params: {
                    serviceId: parseInt(queryParams.get('serviceId')),
                    latitude: locate?.locate?.lat,
                    longitude: locate?.locate?.lng,
                },
            });
        }
    }, [queryParams, locate]);
    return (
        <PageWrapper routes={[{ breadcrumbName: translate.formatMessage(commonMessage.Map) }]}>
            <Flex gap={10} vertical>
                <SearchForm
                    onSearch={handleOnSearchFilter}
                    fields={searchFields}
                    hiddenAction={true}
                    initialValues={deserializeParams(queryParams)}
                />

                {dataMap && (
                    <div style={{ height: '100vh', width: '100%' }}>
                        <GoogleMapReact
                            bootstrapURLKeys={{ key: envGoogleMapAPIKey ?? '' }}
                            defaultCenter={defaultProps.center}
                            defaultZoom={defaultProps.zoom}
                            yesIWantToUseGoogleMapApiInternals
                            onClick={handleOnClickMap}
                        >
                            {dataMap.map((marker) => (
                                <Marker
                                    key={marker.id}
                                    lat={marker.latitude}
                                    lng={marker.longitude}
                                    marker={marker}
                                    serviceImg={serviceImg}
                                />
                            ))}
                            {selected && (
                                <Marker
                                    key={selected.id}
                                    lat={selected.latitude}
                                    lng={selected.longitude}
                                    marker={{}}
                                    serviceImg={selected.serviceImg}
                                    type="user"
                                />
                            )}
                        </GoogleMapReact>
                    </div>
                )}
            </Flex>
        </PageWrapper>
    );
};

export default MapPage;
