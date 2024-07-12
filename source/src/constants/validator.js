export const whiteSpaceRegex = /^[^\s]+(\s+[^\s]+)*$/g;
export const onlyWhiteSpace = /.*\S.*/;
export const phoneRegExp = /^0([3|5|7|8|9]([0-9]{8}))$/;
export const numberRegExp = /@"^\d$"/;
export const emailRegExp =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const nameRegExp = /^[A-Za-z0-9_.-]{3,20}$/;
export const validatePriority = (_, value) => {
    if (Number(value) <= 0) {
        return Promise.reject("Vị trí phải lớn hơn 0 ");
    }
    if (Number(value) > 9999) {
        return Promise.reject("Vị trí phải nhỏ hơn 9999");
    }
    return Promise.resolve();
};

export const userCodeRegex = /^[a-zA-Z0-9.\-_]+$/;
