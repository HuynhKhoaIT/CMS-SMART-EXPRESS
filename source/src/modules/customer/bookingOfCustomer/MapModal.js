import React, { useEffect, useState } from 'react';
import GoogleMapReact from 'google-map-react';
import style from './index.module.scss';
import { Avatar, Card, Flex, Modal } from 'antd';
import { AppConstants, envGoogleMapAPIKey } from '@constants';
import useFetch from '@hooks/useFetch';
import apiConfig from '@constants/apiConfig';
import useTranslate from '@hooks/useTranslate';
import useQueryParams from '@hooks/useQueryParams';

const Marker = ({ marker, serviceImg, type, onCancel, setDriver }) => {
    const [accessModal, setAccessModal] = useState(false);
    const hanldeDriver = () => {
        setDriver(marker);
        setAccessModal(false);
        onCancel();
    };

    const { address, avatar, distance, fullName, phone, status } = marker;
    return (
        <>
            <div className={style.markerContainer}>
                {!type && (
                    <div className={style.infoBox}>
                        <div className={style.infoBoxText}>
                            <div className={style.titleWrapper}>
                                <div className={style.avatar}>
                                    <Avatar
                                        src={avatar ? `${AppConstants.contentRootUrl}${avatar}` : null}
                                        size="large"
                                    />
                                </div>
                                <span className={style.fullName}>{fullName}</span>
                            </div>
                            <span className={style.phone}>{phone}</span>
                            <p className={style.address}>{address}</p>
                        </div>
                    </div>
                )}
                {!type ? (
                    <div onClick={() => setAccessModal(true)}>
                        <img
                            width="60"
                            height="60"
                            src={serviceImg ? `${AppConstants.contentRootUrl}${serviceImg}` : null}
                            alt="driver"
                        />
                    </div>
                ) : (
                    <img
                        width="60"
                        height="60"
                        src={serviceImg ? `${AppConstants.contentRootUrl}${serviceImg}` : null}
                        alt="driver"
                    />
                )}
            </div>
            <Modal
                title="Chi tiết tài xế"
                open={accessModal}
                destroyOnClose={true}
                onCancel={() => setAccessModal(false)}
                data={marker || {}}
                width={400}
                onOk={hanldeDriver}
            >
                <p>Tài xế: {marker?.fullName}</p>
                <p>Số điện thoại: {marker?.phone}</p>
            </Modal>
        </>
    );
};
const MapModal = ({ dataDetail, onCancel, setDriver }) => {
    const translate = useTranslate();
    const { params: queryParams, setQueryParams, deserializeParams } = useQueryParams();
    const [defaultProps, setDefaultProps] = useState({
        center: {
            lat: dataDetail.pickupLat,
            lng: dataDetail.pickupLong,
        },
        zoom: 11,
    });
    const { data: dataMap, execute: executeGetDataMap } = useFetch(apiConfig.map.getList, {
        mappingData: (res) => {
            return res.data.content;
        },
    });

    useEffect(() => {
        executeGetDataMap({
            params: {
                serviceId: dataDetail?.service.id,
            },
        });
    }, [queryParams]);

    return (
        <Flex gap={10} vertical style={{ height: '80vh' }}>
            {dataMap && (
                <div style={{ height: '100%', width: '100%' }}>
                    <GoogleMapReact
                        bootstrapURLKeys={{ key: envGoogleMapAPIKey ?? '' }}
                        defaultCenter={defaultProps.center}
                        defaultZoom={defaultProps.zoom}
                        yesIWantToUseGoogleMapApiInternals
                    >
                        {dataMap.map((marker) => (
                            <Marker
                                key={marker.id}
                                lat={marker.latitude}
                                lng={marker.longitude}
                                marker={marker}
                                serviceImg={dataDetail?.service?.image}
                                onCancel={onCancel}
                                setDriver={setDriver}
                            />
                        ))}
                        <Marker
                            key={dataDetail.id}
                            lat={dataDetail.pickupLat}
                            lng={dataDetail.pickupLong}
                            marker={{}}
                            serviceImg={'/AVATAR/AVATAR_6egcLz0cdK.png'}
                            type="user"
                        />
                    </GoogleMapReact>
                </div>
            )}
        </Flex>
    );
};

export default MapModal;
