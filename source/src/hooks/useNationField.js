import apiConfig from '@constants/apiConfig';
import useFetch from '@hooks/useFetch';
import React, { useEffect, useState } from 'react';

function useNationField({ form, initialData, kindOptions = { provinceKind: 1, districtKind: 2, wardKind: 3 } }) {
    const [provincesOpts, setProvincesOpts] = useState([]);
    const [districtsOpts, setDistrictsOpts] = useState([]);
    const [parentIdOfDistrict, setParentIdOfDistrict] = useState();
    const [parentIdOfWard, setParentIdOfWard] = useState();
    const [disabledWard, setDisableWard] = useState(false);
    const [provinceName, setProvinceName] = useState();
    const [districtName, setDistrictName] = useState();
    const [wardName, setWardName] = useState();
    const [wardsOpts, setWardsOpts] = useState([]);
    const { execute: executeGetNation, loading: getNationLoading } = useFetch(apiConfig.nation.autocomplete);
    const handleGetNation = (setOpts, kind, parentId) => {
        executeGetNation({
            params: {
                kind,
                parentId,
            },
            onCompleted: (res) => {
                setOpts(
                    res.data?.content?.map((item) => ({
                        label: item.name,
                        value: item.id,
                    })),
                );
            },
        });
    };

    const handleGetProvinces = () => {
        handleGetNation(setProvincesOpts, kindOptions.provinceKind);
    };

    const handleGetDistricts = (parentId) => {
        handleGetNation(setDistrictsOpts, kindOptions.districtKind, parentId);
    };

    const handleGetWards = (parentId) => {
        handleGetNation(setWardsOpts, kindOptions.wardKind, parentId);
    };

    const baseFieldProps = {
        mappingOptions: (item) => ({
            label: item.name,
            value: item.id,
        }),
        apiConfig: apiConfig.nation.autocomplete,
        allowClear: false,
    };
    const provincesFieldProps = {
        ...baseFieldProps,
        searchParams: (text) => ({ name: text, kind: kindOptions.provinceKind }),
        options: provincesOpts,
        onChange: (id, option) => {
            handleGetDistricts(id);
            setParentIdOfDistrict(id);
            setDistrictsOpts(undefined);
            setDisableWard(true);
            setWardsOpts(undefined);
            form.setFieldsValue({
                districtId: undefined,
                wardId: undefined,
            });
            handleProvince(option);
        },
    };
    const handleProvince = (option) => {
        setProvinceName(option.label);
    };
    const districtsFieldProps = {
        ...baseFieldProps,
        options: districtsOpts,
        onChange: (id, option) => {
            handleGetWards(id);
            setParentIdOfWard(id);
            setDisableWard(false);
            form.setFieldsValue({
                wardId: undefined,
            });
            handleDistrict(option);
        },
        searchParams: (text) => ({
            name: text,
            parentId: parentIdOfDistrict ? parentIdOfDistrict : form.getFieldValue('provinceId'),
            kind: kindOptions.districtKind,
        }),
    };
    const handleDistrict = (option) => {
        setDistrictName(option.label);
    };

    const wardsFieldProps = {
        ...baseFieldProps,
        options: wardsOpts,
        searchParams: (text) => ({
            name: text,
            parentId: parentIdOfWard ? parentIdOfWard : form.getFieldValue('districtId'),
            kind: kindOptions.wardKind,
        }),
        onChange: (id, option) => {
            handleAward(option);
        },
        disabled: disabledWard,
    };
    const handleAward = (option) => {
        setWardName(option.label);
    };

    useEffect(() => {
        handleGetProvinces(true);
        if (initialData?.district?.id) {
            handleGetDistricts(initialData?.province?.id);
        }
        if (initialData?.ward?.id) {
            handleGetWards(initialData?.district?.id);
        }
    }, [initialData]);

    return {
        provincesOpts,
        districtsOpts,
        wardsOpts,
        getNationLoading,
        handleGetProvinces,
        handleGetWards,
        handleGetDistricts,
        provincesFieldProps,
        wardsFieldProps,
        districtsFieldProps,
        provinceName,
        districtName,
        wardName,
    };
}

export default useNationField;
