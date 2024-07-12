import React, { useEffect, useState } from 'react';
import apiConfig from '@constants/apiConfig';
import routes from './routes';
import PageWrapper from '@components/common/layout/PageWrapper';
import DriverForm from './DriverForm';
import useTranslate from '@hooks/useTranslate';
import useSaveBase from '@hooks/useSaveBase';
import { generatePath, useParams } from 'react-router-dom';
import { defineMessages } from 'react-intl';
const message = defineMessages({
    objectName: 'Tài xế',
    driver: 'Tài xế',
});

const getBank = async () => {
    try {
        const response = await fetch("https://api.vietqr.io/v2/banks");
        if (!response.ok) {
            throw new Error("Network response was not ok " + response.statusText);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("There has been a problem with your fetch operation:", error);
        return null;
    }
};
const DriverSavePage = () => {
    const studentId = useParams();
    const translate = useTranslate();
    const [bankOptions, setBankOptions] = useState([]);

    const { detail, onSave, mixinFuncs, setIsChangedFormValues, isEditing, errors, loading, title } = useSaveBase({
        apiConfig: {
            getById: apiConfig.driver.getById,
            create: apiConfig.driver.create,
            update: apiConfig.driver.update,
        },
        options: {
            getListUrl: routes.driverListPage.path,
            objectName: translate.formatMessage(message.objectName),
        },
        override: (funcs) => {
            funcs.prepareUpdateData = (data) => {
                return {
                    ...data,
                    id: detail.id,
                };
            };
            funcs.prepareCreateData = (data) => {
                return {
                    ...data,
                };
            };
        },
    });
    useEffect(() => {
        const fetchData = async () => {
            const data = await getBank();
            if (!data) return;
            const bankOptions = data?.data?.map((item) => {
                return {
                    value: item?.shortName,
                    label: item?.shortName,
                };
            });
            setBankOptions(bankOptions);
        };

        fetchData();
    }, []);

    return (
        <PageWrapper
            loading={loading}
            routes={[
                {
                    breadcrumbName: translate.formatMessage(message.driver),
                    path: generatePath(routes.driverListPage.path, { studentId }),
                },
                { breadcrumbName: title },
            ]}
            title={title}
        >
            <DriverForm
                formId={mixinFuncs.getFormId()}
                actions={mixinFuncs.renderActions()}
                dataDetail={detail ? detail : {}}
                onSubmit={onSave}
                setIsChangedFormValues={setIsChangedFormValues}
                isError={errors}
                isEditing={isEditing}
                bankOptions={bankOptions}
            />
        </PageWrapper>
    );
};
export default DriverSavePage;
