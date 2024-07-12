import React, { useEffect, useState } from "react";
import apiConfig from "@constants/apiConfig";
import routes from "@routes";
import PageWrapper from "@components/common/layout/PageWrapper";
import useTranslate from "@hooks/useTranslate";
import useSaveBase from "@hooks/useSaveBase";
import { generatePath, useParams } from "react-router-dom";
import { defineMessages } from "react-intl";
import CustomerForm from "./CustomerForm";
import useFetch from "@hooks/useFetch";
const message = defineMessages({
    objectName: "Khách hàng",
    customer: "Khách hàng",
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
const CustomerSavePage = () => {
    const translate = useTranslate();
    const queryParameters = new URLSearchParams(window.location.search);
    const driverId = queryParameters.get("driverId");
    const [bankOptions, setBankOptions] = useState([]);
    const {
        detail,
        onSave,
        mixinFuncs,
        setIsChangedFormValues,
        isEditing,
        errors,
        loading,
        title,
    } = useSaveBase({
        apiConfig: {
            getById: apiConfig.customer.getById,
            create: apiConfig.customer.create,
            update: apiConfig.customer.update,
        },
        options: {
            getListUrl: routes.customerListPage.path,
            objectName: translate.formatMessage(message.objectName),
        },
        override: (funcs) => {
            funcs.prepareUpdateData = (data) => {
                return {
                    ...data,
                    id: detail.id,
                    driverId: driverId,
                };
            };
            funcs.prepareCreateData = (data) => {
                return {
                    ...data,
                    driverId: driverId,
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
                    breadcrumbName: translate.formatMessage(message.customer),
                    path: generatePath(routes.customerListPage.path),
                },
                { breadcrumbName: title },
            ]}
            title={title}
        >
            <CustomerForm
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
export default CustomerSavePage;
