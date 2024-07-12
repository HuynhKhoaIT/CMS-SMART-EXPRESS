import React, { useEffect, useState } from 'react';
import { Avatar, Divider, List, Skeleton } from 'antd';
import useFetch from '@hooks/useFetch';
import apiConfig from '@constants/apiConfig';
import AvatarField from '@components/common/form/AvatarField';
import { UserOutlined, BookOutlined } from '@ant-design/icons';
import { AppConstants, DATE_FORMAT_VALUE, DEFAULT_FORMAT, TIME_FORMAT_DISPLAY } from '@constants';
import dayjs from 'dayjs';
import { convertUtcToLocalTime } from '@utils';
import ImageField from '@components/common/form/ImageField';
const ChatModal = ({ roomId, isEditing, onCancel }) => {
    const { data: room, loading: loadingDetail } = useFetch(apiConfig.room.getById, {
        immediate: true,
        pathParams: { id: roomId },
    });
    let customerId = room?.data?.customer?.id;
    let driverId = room?.data?.driver?.id;

    return (
        <div
            id="scrollableDiv"
            style={{
                maxHeight: '70vh',
                overflow: 'auto',
                padding: '0 16px',
                margin: '0 -20px',
            }}
            className="chat-log"
        >
            <List
                dataSource={room?.data?.chatDetails}
                renderItem={(item, index) => {
                    if (item?.sender == customerId) {
                        return (
                            <List.Item
                                key={index}
                                className="item-customer"
                                style={
                                    room?.data.chatDetails[index - 1]?.sender == customerId
                                        ? { padding: '0px 12px 12px 12px' }
                                        : { padding: '8px 12px' }
                                }
                            >
                                <List.Item.Meta
                                    avatar={
                                        index - 1 >= 0 && room?.data.chatDetails[index - 1]?.sender == customerId ? (
                                            <div style={{ width: '40px' }}></div>
                                        ) : (
                                            <AvatarField
                                                size="large"
                                                icon={<UserOutlined />}
                                                src={
                                                    room?.data?.driver?.avatar
                                                        ? `${AppConstants.contentRootUrl}${room?.data?.customer?.avatar}`
                                                        : null
                                                }
                                            />
                                            
                                        )
                                    }
                                    title={
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span style={{ fontSize: 10, fontWeight: '400' }}> {item?.timeSend}</span>
                                            <span>{room?.data?.customer?.name}</span>
                                        </div>
                                    }
                                    description={
                                        <div style={{ display: 'flex', justifyContent: 'end' }}>{item.msg?.includes('/AVATAR') ? (
                                            <img style={{ width:300 }} src={item.msg ? `${AppConstants.contentRootUrl}${item.msg}` : null} />
                                        ) : (
                                            item.msg
                                        )}</div>
                                    }
                                />
                            </List.Item>
                        );
                    }
                    return (
                        <List.Item key={index}>
                            <List.Item.Meta
                                style={
                                    room?.data.chatDetails[index - 1]?.sender == driverId
                                        ? { padding: '0px 12px 12px 12px' }
                                        : { padding: '8px 12px' }
                                }
                                avatar={
                                    // console.log(index)
                                    index - 1 >= 0 && room?.data.chatDetails[index - 1]?.sender == driverId ? (
                                        <div style={{ width: '40px' }}></div>
                                    ) : (
                                        <AvatarField
                                            size="large"
                                            icon={<UserOutlined />}
                                            src={
                                                room?.data?.driver?.avatar
                                                    ? `${AppConstants.contentRootUrl}${room?.data?.driver?.avatar}`
                                                    : null
                                            }
                                        />
                                    )
                                }
                                title={
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span>{room?.data?.driver?.fullName}</span>
                                        <span style={{ fontSize: 10, fontWeight: '400' }}> {item?.timeSend}</span>
                                    </div>
                                }
                                description={item.msg?.includes('/AVATAR') ? (
                                    <img style={{ width:300 }} src={item.msg ? `${AppConstants.contentRootUrl}${item.msg}` : null} />
                                ) : (
                                    item.msg
                                )}
                            />
                            {/* <div >
                                {item?.timeSend}
                            </div> */}
                        </List.Item>
                    );
                }}
            />
            {/* {room?.data?.chatDetails && (
                <div style={{ position: 'absolute', left: '50%', bottom: 12, transform: 'translate(-50%, 0)' }}>
                    <span style={{ padding: '5px 8px', borderRadius: '6px', background: '#ddd' }}>
                        {convertUtcToLocalTime(room?.data?.createdDate, DEFAULT_FORMAT, DATE_FORMAT_VALUE)}
                    </span>
                </div>
            )} */}
        </div>
    );
};
export default ChatModal;
