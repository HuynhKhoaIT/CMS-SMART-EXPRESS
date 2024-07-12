import React from 'react';
import { Table } from 'antd';

import styles from './BaseTable.module.scss';
import classNames from 'classnames';
import { IS_BOOKING } from '@constants';

const BaseTable = ({
    dataSource,
    className,
    onChange,
    rowSelection,
    columns,
    loading,
    pagination,
    scroll = { x: 'max-content' },
    rowKey = (record) => record.id,
    ...props
}) => (
    <Table
        onChange={onChange}
        // scroll={{ x: true }}
        columns={columns}
        dataSource={dataSource}
        loading={loading}
        rowKey={rowKey}
        rowSelection={rowSelection}
        scroll={scroll}

        // scroll={{ x: 'max-content' }}
        {...props}
        className={classNames(IS_BOOKING ? styles.baseTableBooking : styles.baseTable, className)}
        pagination={pagination ? { ...pagination, showSizeChanger: false, hideOnSinglePage: true } : false}
    />
);

export default BaseTable;
